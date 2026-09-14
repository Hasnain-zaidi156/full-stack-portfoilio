import React, { useEffect, useRef } from 'react';
import '../style/About.css';
import '../style/Skills.css';
import { IconAtom } from '../components/Icons';

const techSkills = [
  { name: 'HTML5',      pct: 90, offset: 28.3  },
  { name: 'CSS3',       pct: 75, offset: 70.75 },
  { name: 'JavaScript', pct: 40, offset: 169.8 },
  { name: 'React.js', pct: 30, offset: 198.1, alt: true, icon: true },
  { name: 'Node.js & Express', pct: 55, offset: 127.35, alt: true },
  { name: 'MongoDB',    pct: 50, offset: 141.5, alt: true },
  { name: 'Bootstrap',  pct: 85, offset: 42.45 },
  { name: 'Git & GitHub',pct: 60, offset: 113.2 },
];

const proSkills = [
  { name: 'Team Work',         pct: 80 },
  { name: 'Creativity',        pct: 80 },
  { name: 'Project Management',pct: 65 },
  { name: 'Communication',     pct: 75 },
  { name: 'Problem Solving',   pct: 70 },
  { name: 'Attention to Detail',pct: 75 },
];

const tools = ['React.js','Node.js','Express.js','MongoDB','HTML5','CSS3','JavaScript ES6+','Bootstrap 5','Responsive Design','Git','GitHub','Flexbox','CSS Grid','VS Code'];

export default function Skills() {
  const circleRefs = useRef([]);
  const barRefs    = useRef([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      circleRefs.current.forEach((el, i) => {
        if (el) setTimeout(() => el.classList.add('animate'), i * 120);
      });
      barRefs.current.forEach((el, i) => {
        if (el) setTimeout(() => el.classList.add('animate'), i * 100);
      });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <main className="page-wrap">
        <div className="page-label">What I know</div>
        <h1 className="page-title">My <span>Skills</span></h1>
        <p className="page-sub" style={{ color: 'var(--muted)', marginBottom: '4rem' }}>
          Technical &amp; professional capabilities
        </p>

        {/* SVG gradient defs */}
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <linearGradient id="cgrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
            <linearGradient id="cgrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
        </svg>

        {/* Technical Skills */}
        <div className="circles-section">
          <div className="section-head">Technical Skills</div>
          <div className="circles-grid">
            {techSkills.map((s, i) => (
              <div
                key={s.name}
                className="circle-item"
                style={{ '--offset': s.offset }}
                ref={(el) => (circleRefs.current[i] = el)}
              >
                <div className="circle-wrap">
                  <svg className="circle-svg" viewBox="0 0 100 100">
                    <circle className="circle-track" cx="50" cy="50" r="45" />
                    <circle
                      className="circle-fill"
                      cx="50" cy="50" r="45"
                      style={s.alt ? { stroke: 'url(#cgrad2)' } : {}}
                    />
                  </svg>
                  <div className="circle-center">
                    <div className="circle-pct" style={s.pct < 35 ? { fontSize: '0.95rem' } : {}}>
                      {s.pct}%
                    </div>
                  </div>
                </div>
                <div className="circle-name">
                  {s.icon && <IconAtom style={{ marginRight: 4, verticalAlign: '-2px' }} />}
                  {s.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Professional Skills */}
        <div className="bars-section">
          <div className="section-head">Professional Skills</div>
          <div className="bars-grid">
            {proSkills.map((s, i) => (
              <div
                key={s.name}
                className="bar-item"
                style={{ '--w': `${s.pct}%` }}
                ref={(el) => (barRefs.current[i] = el)}
              >
                <div className="bar-info">
                  <span className="bar-name">{s.name}</span>
                  <span className="bar-pct">{s.pct}%</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech badges */}
        <div className="tech-section">
          <div className="section-head">Technologies &amp; Tools</div>
          <div className="tech-grid">
            {tools.map((t) => (
              <span key={t} className={`tech-badge${t.includes('React') ? ' react' : ''}`}>
                {t.includes('React') && <IconAtom style={{ marginRight: 4, verticalAlign: '-2px' }} />}
                {t}
              </span>
            ))}
          </div>
        </div>
      </main>

      <footer>
        <p>Designed &amp; Built by <span>Hasnain Zaidi</span> — Full Stack Developer</p>
      </footer>
    </>
  );
}