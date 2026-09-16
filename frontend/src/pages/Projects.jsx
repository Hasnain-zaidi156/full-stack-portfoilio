import React, { useEffect, useState } from 'react';
import '../style/About.css';
import '../style/Projects.css';
import { projects } from '../data/portfolioData';
import {
  IconCart, IconDocument, IconFood, IconCoin, IconCalculator,
  IconPlus, IconBeads, IconWatch, IconPlusMinus,
} from '../components/Icons';
import {
  slugify, loadLiked, saveLiked, loadMyTokens, saveMyTokens,
  loadVisitorName, saveVisitorName, loadAdminKey, saveAdminKey,
  clearAdminKey, timeAgo,
} from '../utils/projectFeedback';
import {
  fetchFeedback, toggleLikeApi, postCommentApi, deleteCommentApi, verifyAdminKey,
} from '../utils/api';

const placeholderIcons = {
  cart: IconCart,
  document: IconDocument,
  food: IconFood,
  coin: IconCoin,
  calculator: IconCalculator,
  plus: IconPlus,
  beads: IconBeads,
  watch: IconWatch,
  plusminus: IconPlusMinus,
};

export default function Projects() {
  // server data: { [projectId]: { likes, comments: [{id,name,text,at}] } }
  const [feedback, setFeedback] = useState({});
  const [loadError, setLoadError] = useState('');
  const [liked, setLiked] = useState({});          // is browser ne kis ko like kiya
  const [myTokens, setMyTokens] = useState({});    // { [commentId]: ownerToken } — apne comments delete karne ke liye
  const [openFor, setOpenFor] = useState(null);
  const [visitorName, setVisitorName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');
  const [posting, setPosting] = useState(false);

  // ---- Admin ----
  const [adminKey, setAdminKey] = useState('');     // khali = admin nahi
  const [showLogin, setShowLogin] = useState(false);
  const [loginInput, setLoginInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    setLiked(loadLiked());
    setMyTokens(loadMyTokens());
    setVisitorName(loadVisitorName());
    setAdminKey(loadAdminKey());

    let alive = true;
    fetchFeedback()
      .then((data) => alive && setFeedback(data))
      .catch(() => alive && setLoadError('Likes & comments abhi load nahi ho sake.'));

    return () => { alive = false; };
  }, []);

  const isAdmin = !!adminKey;
  const entry = (id) => feedback[id] || { likes: 0, comments: [] };

  const toggleLike = async (id) => {
    const isLiked = !!liked[id];
    const action = isLiked ? 'unlike' : 'like';
    const current = entry(id);

    // optimistic update
    const nextLiked = { ...liked, [id]: !isLiked };
    setLiked(nextLiked);
    saveLiked(nextLiked);
    setFeedback((prev) => ({
      ...prev,
      [id]: { ...current, likes: Math.max(0, current.likes + (isLiked ? -1 : 1)) },
    }));

    try {
      const likes = await toggleLikeApi(id, action);
      setFeedback((prev) => ({ ...prev, [id]: { ...(prev[id] || current), likes } }));
    } catch {
      // rollback
      const rollback = { ...liked, [id]: isLiked };
      setLiked(rollback);
      saveLiked(rollback);
      setFeedback((prev) => ({ ...prev, [id]: { ...(prev[id] || current), likes: current.likes } }));
      setError('Like save nahi hua. Internet check karein.');
    }
  };

  const toggleCommentBox = (id) => {
    setError('');
    setCommentText('');
    setOpenFor((prev) => (prev === id ? null : id));
  };

  const addComment = async (id) => {
    const name = visitorName.trim();
    const text = commentText.trim();

    if (!name) return setError('Please enter your name.');
    if (text.length < 2) return setError('Please write a comment.');

    setPosting(true);
    setError('');
    try {
      const comment = await postCommentApi(id, { name, text });
      const current = entry(id);
      const { ownerToken, ...publicComment } = comment;
      setFeedback((prev) => ({
        ...prev,
        [id]: { ...current, comments: [publicComment, ...current.comments] },
      }));
      const tokens = { ...myTokens, [comment.id]: ownerToken };
      setMyTokens(tokens);
      saveMyTokens(tokens);
      saveVisitorName(name);
      setCommentText('');
    } catch (err) {
      setError(err.message || 'Comment post nahi hua.');
    } finally {
      setPosting(false);
    }
  };

  const deleteComment = async (id, commentId) => {
    const current = entry(id);
    setFeedback((prev) => ({
      ...prev,
      [id]: { ...current, comments: current.comments.filter((c) => c.id !== commentId) },
    }));
    try {
      await deleteCommentApi(id, commentId, {
        ownerToken: myTokens[commentId],
        adminKey: isAdmin ? adminKey : undefined,
      });
      if (myTokens[commentId]) {
        const tokens = { ...myTokens };
        delete tokens[commentId];
        setMyTokens(tokens);
        saveMyTokens(tokens);
      }
    } catch (err) {
      setFeedback((prev) => ({ ...prev, [id]: current })); // rollback
      setError(err.message || 'Comment delete nahi hua.');
    }
  };

  // ---- Admin login ----
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!loginInput.trim()) return;
    setLoggingIn(true);
    setLoginError('');
    try {
      const ok = await verifyAdminKey(loginInput.trim());
      if (ok) {
        setAdminKey(loginInput.trim());
        saveAdminKey(loginInput.trim());
        setShowLogin(false);
        setLoginInput('');
      } else {
        setLoginError('Wrong key.');
      }
    } catch (err) {
      setLoginError(err.message || 'Login failed.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleAdminLogout = () => {
    setAdminKey('');
    clearAdminKey();
  };

  return (
    <>
      <main className="page-wrap">
        <div className="page-label">What I've built</div>
        <h1 className="page-title">Featured <span>Projects</span></h1>
        <p className="page-sub">A selection of my recent MERN stack work</p>

        {loadError && <p className="pf-error" style={{ marginBottom: '1.5rem' }}>{loadError}</p>}

        <div className="projects-grid">
          {projects.map((p, i) => {
            const PlaceholderIcon = placeholderIcons[p.placeholder];
            const id = slugify(p.title) || `project-${i}`;
            const { likes, comments } = entry(id);
            const isLiked = !!liked[id];
            const isOpen = openFor === id;

            return (
              <div className="project-card" key={id}>
                <div className="project-thumb">
                  {p.img ? (
                    <img
                      src={p.img}
                      alt={p.title}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className="project-placeholder"
                    style={{ display: p.img ? 'none' : 'flex' }}
                  >
                    {PlaceholderIcon && <PlaceholderIcon />}
                  </div>
                </div>

                <div className="project-body">
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                  <div className="tags">
                    {p.tags.map((t) => (
                      <span className="tag" key={t}>{t}</span>
                    ))}
                  </div>

                  <div className="project-links">
                    <a href={p.demo} target="_blank" rel="noreferrer" className="pbtn pbtn-p">View Demo</a>
                    <a href={p.github} target="_blank" rel="noreferrer" className="pbtn pbtn-o">GitHub</a>
                  </div>

                  {/* ---- Like / Comment bar ---- */}
                  <div className="pf-bar">
                    <button
                      type="button"
                      className={`pf-btn ${isLiked ? 'is-liked' : ''}`}
                      onClick={() => toggleLike(id)}
                      aria-pressed={isLiked}
                      aria-label={isLiked ? 'Unlike this project' : 'Like this project'}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                        <path
                          d="M12 21s-7.5-4.7-9.6-9A5.3 5.3 0 0 1 12 6.6 5.3 5.3 0 0 1 21.6 12c-2.1 4.3-9.6 9-9.6 9z"
                          fill={isLiked ? 'currentColor' : 'none'}
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>{isLiked ? 'Liked' : 'Like'}</span>
                      <span className="pf-count">{likes}</span>
                    </button>

                    <button
                      type="button"
                      className={`pf-btn ${isOpen ? 'is-open' : ''}`}
                      onClick={() => toggleCommentBox(id)}
                      aria-expanded={isOpen}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                        <path
                          d="M21 12a8 8 0 0 1-8 8H7l-4 3v-5.5A8 8 0 1 1 21 12z"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>Comment</span>
                      <span className="pf-count">{comments.length}</span>
                    </button>
                  </div>

                  {/* ---- Comment panel ---- */}
                  {isOpen && (
                    <div className="pf-panel">
                      <input
                        type="text"
                        className="pf-input"
                        placeholder="Your name"
                        maxLength={40}
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                      />
                      <textarea
                        className="pf-input pf-textarea"
                        placeholder="Write your comment..."
                        maxLength={400}
                        rows={3}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                      {error && <p className="pf-error">{error}</p>}
                      <button
                        type="button"
                        className="pf-post"
                        onClick={() => addComment(id)}
                        disabled={posting}
                      >
                        {posting ? 'Posting...' : 'Post Comment'}
                      </button>

                      <div className="pf-list">
                        {comments.length === 0 ? (
                          <p className="pf-empty">No comments yet — be the first.</p>
                        ) : (
                          comments.map((c) => (
                            <div className="pf-item" key={c.id}>
                              <div className="pf-avatar">{(c.name || '?').charAt(0).toUpperCase()}</div>
                              <div className="pf-item-body">
                                <div className="pf-item-head">
                                  <strong>{c.name}</strong>
                                  <span className="pf-time">{timeAgo(c.at)}</span>
                                  {isAdmin && <span className="pf-admin-tag">admin</span>}
                                </div>
                                <p>{c.text}</p>
                              </div>
                              {(myTokens[c.id] || isAdmin) && (
                                <button
                                  type="button"
                                  className="pf-del"
                                  onClick={() => deleteComment(id, c.id)}
                                  aria-label="Delete comment"
                                  title={isAdmin && !myTokens[c.id] ? 'Delete (admin)' : 'Delete'}
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ---- Admin login / status (page ke neeche, subtle) ---- */}
        <div className="pf-admin-zone">
          {isAdmin ? (
            <div className="pf-admin-status">
              <span>Admin mode ON — aap koi bhi comment delete kar sakte hain.</span>
              <button type="button" className="pf-admin-link" onClick={handleAdminLogout}>
                Logout
              </button>
            </div>
          ) : showLogin ? (
            <form className="pf-admin-login" onSubmit={handleAdminLogin}>
              <input
                type="password"
                className="pf-input"
                placeholder="Admin key"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                autoFocus
              />
              <button type="submit" className="pf-post" disabled={loggingIn}>
                {loggingIn ? 'Checking...' : 'Login'}
              </button>
              <button
                type="button"
                className="pf-admin-link"
                onClick={() => { setShowLogin(false); setLoginError(''); setLoginInput(''); }}
              >
                Cancel
              </button>
              {loginError && <p className="pf-error">{loginError}</p>}
            </form>
          ) : (
            <button type="button" className="pf-admin-link" onClick={() => setShowLogin(true)}>
              Admin
            </button>
          )}
        </div>
      </main>

      <footer>
        <p>Designed &amp; Built by <span>Hasnain Zaidi</span> — Full Stack Developer</p>
      </footer>
    </>
  );
}
