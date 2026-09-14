import React, { useState, useEffect } from 'react';
import '../style/Achievements.css';
import { achievements } from '../data/portfolioData';
import { IconSearch, IconClose } from '../components/Icons';

export default function Achievements() {
  const [active, setActive] = useState(null);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setActive(null);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = active ? 'hidden' : '';
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  return (
    <>
      <main className="page-wrap">
        <div className="page-label">Success &amp; Recognition</div>
        <h1 className="page-title">Achievements <span>&amp; Memories</span></h1>
        <p className="page-sub">
          Certificates and proud moments from my journey as a Full Stack Developer.
        </p>

        <div className="achv-grid">
          {achievements.map((item, i) => (
            <div className={`achv-card${item.isCertificate ? ' achv-cert' : ''}`} key={i}>
              <div className="achv-thumb" onClick={() => setActive(item)}>
                <img src={item.img} alt={item.title} loading="lazy" />
                <div className="achv-zoom"><IconSearch /></div>
              </div>
              <div className="achv-body">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {active && (
        <div className="lightbox" onClick={() => setActive(null)}>
          <button className="lightbox-close" onClick={() => setActive(null)}><IconClose /></button>
          <img
            src={active.img}
            alt={active.title}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <footer>
        <p>Designed &amp; Built by <span>Hasnain Zaidi</span> — Full Stack Developer</p>
      </footer>
    </>
  );
}
