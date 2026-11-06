// npm run images   (frontend ya backend, dono folder se chal jata hai)
//
// 1) frontend/src/data/portfolioData.js ki saari remote pics (ibb.co wagera)
//    download karke frontend/public/images/ mein rakhta hai aur portfolioData.js
//    mein link ko local path (/images/...) se badal deta hai.
// 2) backend/pictures/ ki pics bhi public/images/ mein copy karta hai.
// 3) Saari pics MongoDB mein save (upsert) karta hai  (MONGO_URI chahiye, .env se).
// 4) src/utils/imagesMap.js dobara bana deta hai.
//
// Flags:  --force  (dobara download)   --no-db  (DB skip)
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import mongoose from 'mongoose';
import Image from '../models/Image.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const FRONT = process.env.FRONTEND_DIR || path.resolve(here, '../../frontend');
const PICS = path.resolve(here, '../pictures');
const DEST = path.join(FRONT, 'public/images');
const DATA = path.join(FRONT, 'src/data/portfolioData.js');
const EXT = /\.(jpe?g|png|webp|gif|svg|avif|ico)$/i;
const TYPES = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif', svg: 'image/svg+xml', avif: 'image/avif', ico: 'image/x-icon' };
const MIME_EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/svg+xml': 'svg', 'image/avif': 'avif', 'image/x-icon': 'ico' };

const force = process.argv.includes('--force');
const skipDb = process.argv.includes('--no-db');

const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'image';

fs.mkdirSync(DEST, { recursive: true });
fs.mkdirSync(PICS, { recursive: true });

// ---------- 1) portfolioData.js ki remote pics ----------
let text = fs.readFileSync(DATA, 'utf8');
const lines = text.split('\n');
let section = 'misc';
let lastTitle = '';
let titleNo = 0;
const jobs = []; // { url, name }

for (const line of lines) {
  const sec = line.match(/export const (\w+)\s*=/);
  if (sec) { section = sec[1] === 'achievements' ? 'achievement' : sec[1] === 'projects' ? 'project' : sec[1]; titleNo = 0; }
  const t = line.match(/title:\s*'((?:[^'\\]|\\.)*)'/);
  if (t) { lastTitle = t[1]; titleNo += 1; }
  const m = line.match(/\bimg:\s*'(https?:\/\/[^']+)'/);
  if (m) jobs.push({ url: m[1], name: `${section}-${titleNo}-${slug(lastTitle)}` });
}

async function download(url, name) {
  const urlExt = (new URL(url).pathname.match(/\.(\w{2,4})$/) || [])[1]?.toLowerCase();
  // pehle se maujood ho to dobara download nahi
  if (!force) {
    const have = fs.readdirSync(DEST).find((f) => f.replace(EXT, '') === name);
    if (have) return have;
  }
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const type = (res.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
  const ext = MIME_EXT[type] || (TYPES[urlExt] ? urlExt : 'jpg');
  const file = `${name}.${ext}`;
  fs.writeFileSync(path.join(DEST, file), Buffer.from(await res.arrayBuffer()));
  return file;
}

let downloaded = 0;
let failed = 0;
for (const { url, name } of jobs) {
  try {
    const file = await download(url, name);
    text = text.split(`'${url}'`).join(`'/images/${file}'`);
    downloaded += 1;
    console.log(`⬇️  ${name}  ←  ${url}`);
  } catch (err) {
    failed += 1;
    console.warn(`⚠️  ${name} download nahi hui (${err.message}) — purana link rakha hai: ${url}`);
  }
}
if (jobs.length) fs.writeFileSync(DATA, text);

// ---------- 2) backend/pictures -> public/images ----------
const own = fs.readdirSync(PICS).filter((f) => EXT.test(f));
for (const f of own) fs.copyFileSync(path.join(PICS, f), path.join(DEST, f));

// ---------- 4) imagesMap.js (DB se pehle, taake DB fail ho to bhi ban jaye) ----------
const sync = path.join(FRONT, 'scripts/sync-images.mjs');
if (fs.existsSync(sync)) spawnSync(process.execPath, [sync], { stdio: 'inherit', cwd: FRONT });

// ---------- 3) MongoDB mein save ----------
const files = fs.readdirSync(DEST).filter((f) => EXT.test(f));
if (skipDb) {
  console.log('ℹ️  --no-db: DB skip.');
} else if (!process.env.MONGO_URI) {
  console.warn('⚠️  MONGO_URI nahi mila (backend/.env) — pics DB mein save nahi hui.');
} else {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    let saved = 0;
    for (const f of files) {
      const buf = fs.readFileSync(path.join(DEST, f));
      if (buf.length > 12 * 1024 * 1024) { console.warn(`⚠️  ${f} 12MB se bari hai, DB skip.`); continue; }
      const ext = f.split('.').pop().toLowerCase();
      const key = f.replace(EXT, '');
      await Image.findOneAndUpdate(
        { key },
        { key, filename: f, contentType: TYPES[ext] || 'application/octet-stream', size: buf.length, data: buf },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      saved += 1;
    }
    console.log(`🗄️  ${saved} pic(s) MongoDB mein save/update.`);
  } catch (err) {
    console.error('❌ DB save fail:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

console.log(`✅ Done — ${downloaded} download, ${failed} fail, ${own.length} backend/pictures se, ${files.length} total frontend/public/images mein.`);
