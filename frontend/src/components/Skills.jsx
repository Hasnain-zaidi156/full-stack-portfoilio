import { useContext, useState } from 'react';
import { useFlipFilter } from '../utils/gsapSetup';
import { SearchCtx } from '../utils/search';
import { skills } from '../data/portfolioData';

// [description, category, icon] — names portfolioData.js ki skills list se aate hain
const META = {
  'React.js': ['Component-driven interfaces.', 'Frontend', '⚛'],
  'Node.js & Express.js': ['Server-side JavaScript, routing and middleware.', 'Backend', '⬢'],
  MongoDB: ['Flexible document data.', 'Database', '◉'],
  'JavaScript (ES6+)': ['Modern, modular scripting.', 'Frontend', 'JS'],
  'HTML5 & CSS3': ['Semantic markup, layouts and animation.', 'Frontend', '</>'],
  'Bootstrap 5': ['Rapid responsive UI.', 'Frontend', 'B'],
  'Git & GitHub': ['Version control and collaboration.', 'Tools', '⑂'],
  'REST APIs': ['Clean client–server contracts.', 'Backend', '⇌'],
};

export default function Skills() {
  const q = useContext(SearchCtx);
  const [filter, setFilter] = useState('all');
  const capture = useFlipFilter('#skills .s', filter);
  return (
    <section id="expertise" className="sec alt">
      <p className="eyebrow" data-scramble>Expertise</p>
      <h2>The Skills Collection</h2>
      <div className="filters">
        {['all', 'Frontend', 'Backend', 'Database', 'Tools'].map((f) => (
          <button key={f} className={filter === f ? 'on' : ''} onClick={() => { capture(); setFilter(f); }}>{f === 'all' ? 'All' : f}</button>
        ))}
      </div>
      <div className="grid skills" id="skills">
        {skills.map((s) => {
          const [d, c, ic] = META[s] || ['', 'Tools', '✦'];
          const show = (filter === 'all' || c === filter) && (!q || (s + d + c).toLowerCase().includes(q));
          return (
            <article className="s" key={s} style={{ display: show ? '' : 'none' }}>
              <span className="ic">{ic}</span><h3>{s}</h3><p>{d}</p><small>{c}</small>
            </article>
          );
        })}
      </div>
    </section>
  );
}
