// Admin panel — /admin
// Projects add / edit / delete, pic (upload ya link), description, links, order — sab yahin se.
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProjects, refreshProjects, getStaticProjects } from '../utils/useProjects';
import { loadAdminKey, saveAdminKey, clearAdminKey } from '../utils/projectFeedback';
import {
  verifyAdminKey, createProjectApi, updateProjectApi, deleteProjectApi,
  uploadProjectImageApi, reorderProjectsApi, seedProjectsApi, resolveImg,
} from '../utils/api';
import '../style/Admin.css';

const ICONS = ['', 'cart', 'document', 'food', 'coin', 'calculator', 'plus', 'beads', 'watch', 'plusminus'];
const EMPTY = { title: '', desc: '', tags: '', category: 'Websites', img: '', demo: '', github: '', placeholder: '' };

// Pic ko browser mein hi chhota kar deta hai (max 1600px, JPEG) taake upload tez ho aur 3 MB limit mein rahe
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('File parh nahi saka.'));
    reader.onload = () => {
      if (file.type === 'image/gif') return resolve(reader.result);
      const im = new Image();
      im.onerror = () => reject(new Error('Ye image file sahi nahi hai.'));
      im.onload = () => {
        const k = Math.min(1, 1600 / Math.max(im.width, im.height));
        const c = document.createElement('canvas');
        c.width = Math.round(im.width * k);
        c.height = Math.round(im.height * k);
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(im, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.85));
      };
      im.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function Admin() {
  const { projects, fromDb, loaded } = useProjects();
  const [key, setKey] = useState('');
  const [checking, setChecking] = useState(() => !!loadAdminKey());
  const [loginKey, setLoginKey] = useState('');
  const [loginErr, setLoginErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null); // { ok, text }
  const [editing, setEditing] = useState(null); // null | 'new' | project.id
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);

  useEffect(() => { document.title = 'Admin — Hasnain Zaidi'; }, []);

  // Pehle se saved key ho to chup-chaap verify karo
  useEffect(() => {
    const saved = loadAdminKey();
    if (!saved) return;
    verifyAdminKey(saved)
      .then(() => { setKey(saved); refreshProjects(); })
      .catch((e) => {
        if (e.status === 401) clearAdminKey();
        else setLoginErr('Server se connect nahi hua (free server so raha ho sakta hai). Thori der baad dobara try karein.');
      })
      .finally(() => setChecking(false));
  }, []);

  // Form ki pic ka preview
  const filePreview = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file]);
  useEffect(() => () => { if (filePreview) URL.revokeObjectURL(filePreview); }, [filePreview]);
  const preview = filePreview || resolveImg(form.img) || '';

  const login = async (e) => {
    e.preventDefault();
    if (!loginKey.trim()) return;
    setBusy(true); setLoginErr('');
    try {
      await verifyAdminKey(loginKey.trim());
      saveAdminKey(loginKey.trim());
      setKey(loginKey.trim()); setLoginKey('');
      refreshProjects();
    } catch (err) {
      setLoginErr(err.status === 401 ? 'Admin key galat hai.' : err.message || 'Login nahi hua.');
    }
    setBusy(false);
  };

  const logout = () => { clearAdminKey(); setKey(''); setEditing(null); setMsg(null); };

  // Har API kaam ek hi wrapper se: busy, error, aur baad mein list refresh
  const run = async (fn, okText) => {
    setBusy(true); setMsg(null);
    try {
      await fn();
      await refreshProjects();
      if (okText) setMsg({ ok: true, text: okText });
      return true;
    } catch (e) {
      if (e.status === 401) { logout(); setLoginErr('Admin key galat ya expire ho gayi. Dobara login karein.'); }
      else setMsg({ ok: false, text: e.message || 'Kuch masla hua.' });
      return false;
    } finally { setBusy(false); }
  };

  const openForm = (p) => {
    setMsg(null); setFile(null);
    if (p) {
      setEditing(p.id);
      setForm({ title: p.title, desc: p.desc || '', tags: (p.tags || []).join(', '), category: p.category || 'Websites',
        img: p.img || '', demo: p.demo || '', github: p.github || '', placeholder: p.placeholder || '' });
    } else { setEditing('new'); setForm(EMPTY); }
    setTimeout(() => document.getElementById('ad-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };
  const closeForm = () => { setEditing(null); setFile(null); };
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const pickFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!/^image\/(jpeg|png|webp|gif)$/.test(f.type)) return setMsg({ ok: false, text: 'Sirf JPG, PNG, WEBP ya GIF pic chunein.' });
    setMsg(null); setFile(f);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setMsg({ ok: false, text: 'Title zaroori hai.' });
    const ok = await run(async () => {
      const saved = editing === 'new' ? await createProjectApi(key, form) : await updateProjectApi(key, editing, form);
      if (file) await uploadProjectImageApi(key, saved.id, await fileToDataUrl(file));
    }, editing === 'new' ? 'Project add ho gaya ✓' : 'Project update ho gaya ✓');
    if (ok) closeForm();
  };

  const remove = (p) => {
    if (!window.confirm(`"${p.title}" delete karna hai? Ye wapis nahi aayega.`)) return;
    run(() => deleteProjectApi(key, p.id), 'Project delete ho gaya.');
  };

  const move = (i, d) => {
    const ids = projects.map((p) => p.id);
    const j = i + d;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    run(() => reorderProjectsApi(key, ids));
  };

  const importStatic = () => run(() => seedProjectsApi(key, getStaticProjects()), 'Purane projects database mein import ho gaye ✓');

  // ---------- Login ----------
  if (checking) return <main id="main" className="ad"><p className="ad-muted">Checking…</p></main>;

  if (!key) {
    return (
      <main id="main" className="ad ad-login">
        <p className="eyebrow">Admin</p>
        <h1 className="ad-h">Sign in</h1>
        <form onSubmit={login}>
          <label>Admin key
            <input type="password" autoComplete="current-password" value={loginKey} onChange={(e) => setLoginKey(e.target.value)} autoFocus />
          </label>
          {loginErr && <p className="note">{loginErr}</p>}
          <button className="btn dark" disabled={busy}>{busy ? 'Checking…' : 'Login'}</button>
        </form>
        <Link className="ad-back" to="/">← Back to site</Link>
      </main>
    );
  }

  // ---------- Panel ----------
  return (
    <main id="main" className="ad">
      <div className="ad-top">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="ad-h">Projects</h1>
        </div>
        <div className="ad-actions">
          <Link className="btn" to="/">View site</Link>
          <button className="btn" onClick={logout}>Logout</button>
        </div>
      </div>

      {msg && <p className={msg.ok ? 'ad-ok' : 'note'} role="status">{msg.text}</p>}

      {loaded && !fromDb && (
        <div className="ad-banner">
          <p>Abhi site <b>purani fixed list</b> (portfolioData.js) dikha rahi hai. Admin panel se edit karne ke liye pehle in projects ko database mein import karein — sirf ek dafa.</p>
          <button className="btn dark" disabled={busy} onClick={importStatic}>{busy ? 'Importing…' : `Import ${projects.length} projects`}</button>
        </div>
      )}

      {fromDb && editing === null && (
        <button className="btn dark ad-add" onClick={() => openForm(null)}>+ Add project</button>
      )}

      {editing !== null && (
        <form id="ad-form" className="ad-form" onSubmit={save}>
          <h2>{editing === 'new' ? 'New project' : 'Edit project'}</h2>
          <label>Title *
            <input value={form.title} maxLength={80} onChange={set('title')} required />
          </label>
          <label>Description
            <textarea rows="3" maxLength={600} value={form.desc} onChange={set('desc')} />
          </label>
          <div className="ad-2">
            <label>Tags (comma se alag)
              <input value={form.tags} onChange={set('tags')} placeholder="HTML5, CSS3, JavaScript" />
            </label>
            <label>Category
              <select value={form.category} onChange={set('category')}>
                <option>Websites</option>
                <option>Tools &amp; Apps</option>
              </select>
            </label>
          </div>
          <div className="ad-2">
            <label>Live Demo link
              <input type="url" value={form.demo} onChange={set('demo')} placeholder="https://…" />
            </label>
            <label>Source Code (GitHub) link
              <input type="url" value={form.github} onChange={set('github')} placeholder="https://github.com/…" />
            </label>
          </div>

          <fieldset className="ad-img">
            <legend>Project pic</legend>
            {preview ? <img src={preview} alt="Preview" /> : <div className="ad-noimg">Koi pic nahi</div>}
            <div className="ad-imgctl">
              <label>Computer se upload (JPG / PNG / WEBP / GIF)
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={pickFile} />
              </label>
              <label>ya pic ka link
                <input type="url" value={form.img.startsWith('/api/') ? '' : form.img}
                  placeholder={form.img.startsWith('/api/') ? 'Uploaded pic lagi hui hai' : 'https://…'}
                  onChange={(e) => { setFile(null); setForm((f) => ({ ...f, img: e.target.value })); }} />
              </label>
              {(preview || form.img) && (
                <button type="button" className="ad-link" onClick={() => { setFile(null); setForm((f) => ({ ...f, img: '' })); }}>Pic hata do</button>
              )}
            </div>
          </fieldset>

          <label>Pic na ho to icon
            <select value={form.placeholder} onChange={set('placeholder')}>
              {ICONS.map((i) => <option key={i} value={i}>{i || '— koi nahi (pehla harf) —'}</option>)}
            </select>
          </label>

          <div className="ad-actions">
            <button className="btn dark" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
            <button type="button" className="btn" disabled={busy} onClick={closeForm}>Cancel</button>
          </div>
        </form>
      )}

      <ul className="ad-list">
        {projects.map((p, i) => (
          <li key={p.slug} className="ad-row">
            {p.img ? <img src={resolveImg(p.img)} alt="" loading="lazy" /> : <div className="ad-thumb">{p.title[0]}</div>}
            <div className="ad-info">
              <b>{p.title}</b>
              <span>{p.category} · {(p.tags || []).join(', ') || 'no tags'}</span>
            </div>
            {fromDb && (
              <div className="ad-rowbtns">
                <button aria-label="Upar" disabled={busy || i === 0} onClick={() => move(i, -1)}>↑</button>
                <button aria-label="Neeche" disabled={busy || i === projects.length - 1} onClick={() => move(i, 1)}>↓</button>
                <button disabled={busy} onClick={() => openForm(p)}>Edit</button>
                <button className="ad-del" disabled={busy} onClick={() => remove(p)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
