// Achievements & Memories — certificates aur memory pics (portfolioData.js se).
import { useEffect, useState } from 'react';
import { achievements } from '../data/portfolioData';
import { IconSearch, IconClose } from './Icons';

export default function Memories() {
  const [active, setActive] = useState(null);
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setActive(null);
    addEventListener('keydown', onKey);
    document.body.style.overflow = active ? 'hidden' : '';
    return () => { removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [active]);
  return (
    <section id="memories" className="sec">
      <p className="eyebrow" data-scramble>Success &amp; Recognition</p>
      <h2>Achievements &amp; Memories</h2>
      <div className="grid achv">
        {achievements.map((a, i) => (
          <article className={`achv-card${a.isCertificate ? ' cert' : ''}`} key={i}>
            <button className="thumb" aria-label={`Open ${a.title}`} onClick={() => setActive(a)}>
              <img src={a.img} alt={a.title} loading="lazy" /><span className="zoom"><IconSearch width="22" height="22" /></span>
            </button>
            <div className="body"><h3>{a.title}</h3><p>{a.desc}</p></div>
          </article>
        ))}
      </div>
      {active && (
        <div className="lightbox" onClick={() => setActive(null)}>
          <button className="icon" aria-label="Close" onClick={() => setActive(null)}><IconClose width="16" height="16" /></button>
          <img src={active.img} alt={active.title} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}
