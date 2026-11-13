import crypto from 'crypto';
import express from 'express';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import Project from '../models/Project.js';
import Image from '../models/Image.js';
import { requireAdmin } from '../utils/adminAuth.js';

const router = express.Router();

const writeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

function requireDb(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ success: false, message: 'Database not connected.' });
  }
  next();
}

const slugify = (t = '') =>
  String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

const ALLOWED_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };
const MAX_IMG_BYTES = 2.5 * 1024 * 1024; // 2.5 MB (Vercel request limit ~4.5 MB, base64 ~33% bara hota hai)

// body se sirf allowed fields, saaf karke
function pick(body = {}) {
  const out = {};
  if (body.title !== undefined) out.title = String(body.title).trim().slice(0, 80);
  if (body.desc !== undefined) out.desc = String(body.desc).trim().slice(0, 600);
  if (body.tags !== undefined) {
    const arr = Array.isArray(body.tags) ? body.tags : String(body.tags).split(',');
    out.tags = arr.map((t) => String(t).trim()).filter(Boolean).slice(0, 12);
  }
  if (body.category !== undefined) out.category = body.category === 'Tools & Apps' ? 'Tools & Apps' : 'Websites';
  if (body.img !== undefined) out.img = String(body.img).trim().slice(0, 600);
  if (body.demo !== undefined) out.demo = String(body.demo).trim().slice(0, 400);
  if (body.github !== undefined) out.github = String(body.github).trim().slice(0, 400);
  if (body.placeholder !== undefined) out.placeholder = String(body.placeholder).trim().slice(0, 30);
  return out;
}

const shape = (p) => ({
  id: p._id.toString(),
  slug: p.slug,
  title: p.title,
  desc: p.desc,
  tags: p.tags || [],
  category: p.category,
  img: p.img || null,
  demo: p.demo,
  github: p.github,
  placeholder: p.placeholder || '',
  order: p.order,
});

// Purani upload ki hui pic DB se hata do (agar ab use nahi ho rahi)
async function dropImage(key) {
  if (key) await Image.deleteOne({ key }).catch(() => {});
}

// ---- GET /api/projects  (public) ----
router.get('/', requireDb, async (req, res) => {
  try {
    const rows = await Project.find({}).sort({ order: 1, createdAt: 1 }).lean();
    res.json({ success: true, projects: rows.map(shape) });
  } catch (err) {
    console.error('projects GET error:', err.message);
    res.status(500).json({ success: false, message: 'Could not load projects.' });
  }
});

// ---- POST /api/projects/seed  (admin) — body: { projects: [...] } ----
// Sirf tab chalta hai jab DB mein koi project na ho (static list ko ek baar import karne ke liye)
router.post('/seed', writeLimiter, requireAdmin, requireDb, async (req, res) => {
  try {
    if ((await Project.countDocuments()) > 0) {
      return res.status(409).json({ success: false, message: 'Projects pehle se database mein hain.' });
    }
    const list = Array.isArray(req.body?.projects) ? req.body.projects.slice(0, 100) : [];
    const used = new Set();
    const docs = [];
    list.forEach((raw, i) => {
      const data = pick(raw);
      if (!data.title) return;
      let slug = slugify(raw.slug || data.title) || `project-${i + 1}`;
      while (used.has(slug)) slug += '-2';
      used.add(slug);
      docs.push({ ...data, slug, order: i });
    });
    if (!docs.length) return res.status(400).json({ success: false, message: 'Koi valid project nahi mila.' });
    await Project.insertMany(docs);
    res.status(201).json({ success: true, count: docs.length });
  } catch (err) {
    console.error('seed error:', err.message);
    res.status(500).json({ success: false, message: 'Import nahi hua.' });
  }
});

// ---- POST /api/projects  (admin) ----
router.post('/', writeLimiter, requireAdmin, requireDb, async (req, res) => {
  const data = pick(req.body);
  if (!data.title) return res.status(400).json({ success: false, message: 'Title zaroori hai.' });
  try {
    let slug = slugify(data.title) || 'project';
    if (await Project.exists({ slug })) slug = `${slug}-${crypto.randomBytes(2).toString('hex')}`;
    const last = await Project.findOne({}).sort({ order: -1 }).select('order').lean();
    const doc = await Project.create({ ...data, slug, order: (last?.order ?? -1) + 1 });
    res.status(201).json({ success: true, project: shape(doc) });
  } catch (err) {
    console.error('project create error:', err.message);
    res.status(500).json({ success: false, message: 'Project save nahi hua.' });
  }
});

// ---- PUT /api/projects/reorder  (admin) — body: { ids: [id, id, ...] } ----
router.put('/reorder', writeLimiter, requireAdmin, requireDb, async (req, res) => {
  const ids = Array.isArray(req.body?.ids) ? req.body.ids.filter((i) => mongoose.isValidObjectId(i)) : [];
  if (!ids.length) return res.status(400).json({ success: false, message: 'ids chahiye.' });
  try {
    await Project.bulkWrite(ids.map((id, i) => ({ updateOne: { filter: { _id: id }, update: { $set: { order: i } } } })));
    res.json({ success: true });
  } catch (err) {
    console.error('reorder error:', err.message);
    res.status(500).json({ success: false, message: 'Order save nahi hua.' });
  }
});

// ---- PUT /api/projects/:id  (admin) ----
router.put('/:id', writeLimiter, requireAdmin, requireDb, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid id.' });
  const data = pick(req.body);
  if (data.title !== undefined && !data.title) return res.status(400).json({ success: false, message: 'Title khali nahi ho sakta.' });
  try {
    const doc = await Project.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: 'Project nahi mila.' });

    // img field badla (URL paste kiya ya hata diya) aur purani pic upload ki hui thi => purani delete
    if (data.img !== undefined && data.img !== doc.img && doc.imgKey) {
      await dropImage(doc.imgKey);
      doc.imgKey = '';
    }
    Object.assign(doc, data);
    await doc.save();
    res.json({ success: true, project: shape(doc) });
  } catch (err) {
    console.error('project update error:', err.message);
    res.status(500).json({ success: false, message: 'Update nahi hua.' });
  }
});

// ---- POST /api/projects/:id/image  (admin) — body: { dataUrl: "data:image/png;base64,..." } ----
router.post('/:id/image', writeLimiter, requireAdmin, requireDb, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid id.' });
  const m = /^data:([\w/+.-]+);base64,([A-Za-z0-9+/=\s]+)$/.exec(String(req.body?.dataUrl || ''));
  if (!m || !ALLOWED_TYPES[m[1]]) {
    return res.status(400).json({ success: false, message: 'Sirf JPG, PNG, WEBP ya GIF pic allowed hai.' });
  }
  const buf = Buffer.from(m[2], 'base64');
  if (!buf.length || buf.length > MAX_IMG_BYTES) {
    return res.status(413).json({ success: false, message: 'Pic 2.5 MB se choti honi chahiye.' });
  }
  try {
    const doc = await Project.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: 'Project nahi mila.' });

    const key = `project-${doc.slug}-${Date.now().toString(36)}`;
    await Image.create({ key, filename: `${key}.${ALLOWED_TYPES[m[1]]}`, contentType: m[1], size: buf.length, data: buf });

    const oldKey = doc.imgKey;
    doc.imgKey = key;
    doc.img = `/api/images/${key}`; // relative — frontend API_URL laga leta hai
    await doc.save();
    await dropImage(oldKey);

    res.json({ success: true, project: shape(doc) });
  } catch (err) {
    console.error('image upload error:', err.message);
    res.status(500).json({ success: false, message: 'Pic upload nahi hui.' });
  }
});

// ---- DELETE /api/projects/:id  (admin) ----
router.delete('/:id', writeLimiter, requireAdmin, requireDb, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid id.' });
  try {
    const doc = await Project.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: 'Project nahi mila.' });
    await dropImage(doc.imgKey);
    res.json({ success: true });
  } catch (err) {
    console.error('project delete error:', err.message);
    res.status(500).json({ success: false, message: 'Delete nahi hua.' });
  }
});

export default router;
