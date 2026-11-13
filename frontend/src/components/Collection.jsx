// Projects "Featured Collection" — likes & comments MongoDB backend se (pehle jaisa).
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger, useFlipFilter } from '../utils/gsapSetup';
import { SearchCtx } from '../utils/search';
import { useProjects } from '../utils/useProjects';
import {
  IconCart, IconDocument, IconFood, IconCoin, IconCalculator, IconPlus, IconBeads, IconWatch, IconPlusMinus, IconClose,
} from './Icons';
import {
  slugify, loadLiked, saveLiked, loadMyTokens, saveMyTokens, loadVisitorName, saveVisitorName,
  loadAdminKey, saveAdminKey, clearAdminKey, timeAgo,
} from '../utils/projectFeedback';
import { fetchFeedback, toggleLikeApi, postCommentApi, deleteCommentApi, verifyAdminKey, resolveImg } from '../utils/api';

const ICONS = { cart: IconCart, document: IconDocument, food: IconFood, coin: IconCoin, calculator: IconCalculator,
  plus: IconPlus, beads: IconBeads, watch: IconWatch, plusminus: IconPlusMinus };
const GRADS = ['#2b2b2b,#6b5b45', '#8a7f6a,#d8cdb6', '#1c2a33,#4d6b7a', '#4a2f2f,#a77a6a'];

export default function Collection() {
  const q = useContext(SearchCtx);
  const { projects } = useProjects();
  const [filter, setFilter] = useState('all');
  const capture = useFlipFilter('#projects .p', filter);
  const [feedback, setFeedback] = useState({});
  const [liked, setLiked] = useState({});
  const [tokens, setTokens] = useState({});
  const [adminKey, setAdminKey] = useState('');
  const [active, setActive] = useState(null);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [err, setErr] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    setLiked(loadLiked()); setTokens(loadMyTokens()); setName(loadVisitorName()); setAdminKey(loadAdminKey());
    let alive = true;
    fetchFeedback().then((d) => alive && setFeedback(d)).catch(() => alive && setErr('Likes & comments abhi load nahi ho sake.'));
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setActive(null);
    addEventListener('keydown', onKey);
    document.body.style.overflow = active !== null ? 'hidden' : '';
    if (active !== null) gsap.from('.detail .card', { y: 40, opacity: 0, duration: 0.5, ease: 'lux' });
    return () => { removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [active]);

  // admin panel se list badli ho to scroll positions dobara napo
  useEffect(() => { const t = setTimeout(() => ScrollTrigger.refresh(), 400); return () => clearTimeout(t); }, [projects]);

  const isAdmin = !!adminKey;
  const entry = (id) => feedback[id] || { likes: 0, comments: [] };

  const toggleLike = async (id) => {
    const was = !!liked[id], cur = entry(id);
    const nl = { ...liked, [id]: !was };
    setLiked(nl); saveLiked(nl);
    setFeedback((p) => ({ ...p, [id]: { ...cur, likes: Math.max(0, cur.likes + (was ? -1 : 1)) } }));
    try {
      const likes = await toggleLikeApi(id, was ? 'unlike' : 'like');
      setFeedback((p) => ({ ...p, [id]: { ...(p[id] || cur), likes } }));
    } catch {
      const rb = { ...liked, [id]: was };
      setLiked(rb); saveLiked(rb);
      setFeedback((p) => ({ ...p, [id]: { ...(p[id] || cur), likes: cur.likes } }));
      setErr('Like save nahi hua. Internet check karein.');
    }
  };

  const addComment = async (id) => {
    const n = name.trim(), t = text.trim();
    if (!n) return setErr('Please enter your name.');
    if (t.length < 2) return setErr('Please write a comment.');
    setPosting(true); setErr('');
    try {
      const c = await postCommentApi(id, { name: n, text: t });
      const cur = entry(id), { ownerToken, ...pub } = c;
      setFeedback((p) => ({ ...p, [id]: { ...cur, comments: [pub, ...cur.comments] } }));
      const tk = { ...tokens, [c.id]: ownerToken };
      setTokens(tk); saveMyTokens(tk); saveVisitorName(n); setText('');
    } catch (e) { setErr(e.message || 'Comment post nahi hua.'); }
    setPosting(false);
  };

  const delComment = async (id, cid) => {
    const cur = entry(id);
    setFeedback((p) => ({ ...p, [id]: { ...cur, comments: cur.comments.filter((c) => c.id !== cid) } }));
    try {
      await deleteCommentApi(id, cid, { ownerToken: tokens[cid], adminKey: isAdmin ? adminKey : undefined });
      if (tokens[cid]) { const tk = { ...tokens }; delete tk[cid]; setTokens(tk); saveMyTokens(tk); }
    } catch (e) {
      setFeedback((p) => ({ ...p, [id]: cur }));
      setErr(e.message || 'Delete nahi hua.');
    }
  };

  const adminToggle = async () => {
    if (isAdmin) { clearAdminKey(); return setAdminKey(''); }
    const key = window.prompt('Admin key:');
    if (!key) return;
    try { if (await verifyAdminKey(key)) { saveAdminKey(key); setAdminKey(key); } } catch { setErr('Admin key galat hai.'); }
  };

  const shown = (p) => (filter === 'all' || p.category === filter) && (!q || ((p.title || '') + (p.desc || '') + p.tags.join(' ')).toLowerCase().includes(q));
  const ap = active !== null ? projects[active] : null;

  return (
    <section id="collection" className="sec">
      <p className="eyebrow" data-scramble>Featured Collection</p>
      <h2>Selected Projects</h2>
      <div className="filters">
        {['all', 'Websites', 'Tools & Apps'].map((f) => (
          <button key={f} className={filter === f ? 'on' : ''} onClick={() => { capture(); setFilter(f); }}>{f === 'all' ? 'All' : f}</button>
        ))}
        {isAdmin && <Link className="admin manage" to="/admin">Manage Projects</Link>}
        <button className="admin" onClick={adminToggle}>{isAdmin ? 'Admin ✓ Logout' : 'Admin'}</button>
      </div>
      {err && <p className="note" role="status">{err}</p>}
      <div className="grid projects" id="projects">
        {projects.map((p, i) => {
          const id = p.slug || slugify(p.title), Ic = ICONS[p.placeholder], e = entry(id);
          return (
            <article className="p" key={id} style={{ display: shown(p) ? '' : 'none' }}>
              <div className="img">
                {p.img ? <img src={resolveImg(p.img)} alt={p.title} loading="lazy" data-speed="0.1" />
                  : <b style={{ background: `linear-gradient(135deg,${GRADS[i % 4]})` }}>{Ic ? <Ic width="56" height="56" /> : p.title[0]}</b>}
              </div>
              <div className="body">
                <h3>{p.title}</h3><p>{p.desc}</p>
                <span className="stack">{p.tags.join(' · ')}</span>
                <div className="row">
                  {p.demo && <a className="btn" href={p.demo} target="_blank" rel="noreferrer">Live Demo</a>}
                  {p.github && <a className="btn" href={p.github} target="_blank" rel="noreferrer">Source Code</a>}
                  <button onClick={() => { setErr(''); setText(''); setActive(i); }}>View Details · {e.comments.length}</button>
                  <button className={liked[id] ? 'like on' : 'like'} aria-pressed={!!liked[id]} onClick={() => toggleLike(id)}>♥ {e.likes}</button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {ap && (() => {
        const id = ap.slug || slugify(ap.title), e = entry(id);
        return (
          <div className="detail" role="dialog" aria-modal="true" onClick={(ev) => ev.target === ev.currentTarget && setActive(null)}>
            <div className="card">
              <button className="icon" aria-label="Close" onClick={() => setActive(null)}><IconClose width="16" height="16" /></button>
              <h3>{ap.title}</h3><p>{ap.desc}</p><small>{ap.tags.join(' · ')}</small>
              <div className="cm-form">
                <input placeholder="Your name" value={name} maxLength={40} onChange={(ev) => setName(ev.target.value)} />
                <textarea rows="2" placeholder="Write a comment…" value={text} maxLength={400} onChange={(ev) => setText(ev.target.value)} />
                <button className="btn dark" disabled={posting} onClick={() => addComment(id)}>{posting ? 'Posting…' : 'Post comment'}</button>
                {err && <p className="note">{err}</p>}
              </div>
              <ul className="cm">
                {e.comments.length === 0 && <li className="muted">No comments yet — be the first.</li>}
                {e.comments.map((c) => (
                  <li key={c.id}><b>{c.name}</b> <time>{timeAgo(c.at)}</time><p>{c.text}</p>
                    {(isAdmin || tokens[c.id]) && <button onClick={() => delComment(id, c.id)}>Delete</button>}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      })()}
    </section>
  );
}
