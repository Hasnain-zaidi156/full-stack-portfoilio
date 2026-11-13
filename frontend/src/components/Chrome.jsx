// Cursor, scroll progress, back-to-top, magnetic buttons — saare pages par.
import { useEffect } from 'react';
import { gsap, ScrollTrigger, reduceMotion } from '../utils/gsapSetup';

export default function Chrome() {
  useEffect(() => {
    const fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    const ctx = gsap.context(() => {
      gsap.to('.progress', { scaleX: 1, ease: 'none', scrollTrigger: { scrub: 0.2, start: 0, end: 'max' } });
      ScrollTrigger.create({ start: 600, onToggle: (s) =>
        gsap.to('#top', { opacity: s.isActive ? 1 : 0, pointerEvents: s.isActive ? 'auto' : 'none', duration: 0.3 }) });
    });
    let off = () => {};
    if (fine && !reduceMotion()) {
      const cx = gsap.quickTo('.cursor', 'x', { duration: 0.2 }), cy = gsap.quickTo('.cursor', 'y', { duration: 0.2 });
      let cur = null;
      const move = (e) => {
        cx(e.clientX); cy(e.clientY);
        const m = e.target.closest?.('.mag');
        if (m !== cur) { if (cur) gsap.to(cur, { x: 0, y: 0, duration: 0.5, ease: 'power3' }); cur = m; }
        if (m) { const r = m.getBoundingClientRect();
          gsap.to(m, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.3, duration: 0.5, ease: 'power3', overwrite: 'auto' }); }
        gsap.to('.cursor', { scale: e.target.closest?.('a,button,input,textarea') ? 3.5 : 1, duration: 0.3, overwrite: 'auto' });
      };
      addEventListener('pointermove', move);
      off = () => removeEventListener('pointermove', move);
    }
    return () => { off(); ctx.revert(); };
  }, []);

  return (
    <>
      <div className="cursor" aria-hidden="true" />
      <div className="progress" aria-hidden="true" />
      <button id="top" aria-label="Back to top"
        onClick={() => gsap.to(window, { scrollTo: 0, duration: reduceMotion() ? 0 : 1, ease: 'lux' })}>↑</button>
    </>
  );
}
