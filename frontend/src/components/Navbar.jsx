import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { gsap, scrollToId } from '../utils/gsapSetup';

const LINKS = [['home', 'Home'], ['collection', 'Collection'], ['expertise', 'Expertise'], ['about', 'About'], ['memories', 'Memories'], ['contact', 'Contact']];
const LOGO = 'https://i.ibb.co/tTbGDbLv/Untitled-design-1.png';

export default function Navbar({ q, setQ }) {
  const [open, setOpen] = useState(false);
  const [sOpen, setSOpen] = useState(false);
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem('theme') || 'light'; } catch { return 'light'; } });
  const mob = useRef(null), sInput = useRef(null);
  const { pathname } = useLocation(), navigate = useNavigate();
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);

  const go = (e, id) => {
    e.preventDefault(); closeMenu();
    if (pathname === '/') scrollToId(id); else navigate('/', { state: { scrollTo: id } });
  };
  const closeMenu = () => {
    if (!open) return; setOpen(false);
    gsap.to(mob.current, { clipPath: 'circle(0% at 100% 0%)', duration: 0.5, ease: 'power3.in', onComplete: () => (mob.current.style.visibility = 'hidden') });
  };
  const toggleMenu = () => {
    if (open) return closeMenu();
    setOpen(true); mob.current.style.visibility = 'visible';
    gsap.timeline().to(mob.current, { clipPath: 'circle(150% at 100% 0%)', duration: 0.7, ease: 'power3.out' })
      .from('#mobile a', { y: 40, opacity: 0, stagger: 0.07, ease: 'lux', duration: 0.6 }, '-=.3');
  };
  const flipTheme = () => { const n = theme === 'dark' ? 'light' : 'dark'; setTheme(n); try { localStorage.setItem('theme', n); } catch { /* ignore */ } };

  return (
    <>
      <header className="nav">
        <a href="/" className="logo" onClick={(e) => go(e, 'home')}>
          <img src={LOGO} alt="" onError={(e) => (e.target.style.display = 'none')} />HASNAIN ZAIDI<sup>®</sup>
        </a>
        <nav className="links" aria-label="Main">
          {LINKS.map(([id, t]) => <a key={id} href={`/#${id}`} onClick={(e) => go(e, id)}>{t}</a>)}
        </nav>
        <div className="actions">
          <input id="search" ref={sInput} className={sOpen ? 'open' : ''} type="search" value={q}
            onChange={(e) => setQ(e.target.value)} placeholder="Search skills & projects" aria-label="Search" />
          <button className="icon" aria-label="Search" onClick={() => { setSOpen(!sOpen); setTimeout(() => sInput.current?.focus(), 50); }}>⌕</button>
          <button className="icon" aria-label="Toggle theme" onClick={flipTheme}>◐</button>
          <a href="/#contact" className="btn dark mag" id="hire" onClick={(e) => go(e, 'contact')}>Hire Me</a>
          <button className="icon burger" aria-label="Menu" aria-expanded={open} onClick={toggleMenu}>☰</button>
        </div>
      </header>
      <div className="mobile" id="mobile" ref={mob}>
        {LINKS.map(([id, t]) => <a key={id} href={`/#${id}`} onClick={(e) => go(e, id)}>{t}</a>)}
        <Link to="/resume" onClick={closeMenu}>Resume</Link>
      </div>
    </>
  );
}
