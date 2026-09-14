import React from 'react';
import '../style/About.css';
import '../style/Projects.css';
import { projects } from '../data/portfolioData';
import {
  IconCart, IconDocument, IconFood, IconCoin, IconCalculator,
  IconPlus, IconBeads, IconWatch, IconPlusMinus,
} from '../components/Icons';

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
  return (
    <>
      <main className="page-wrap">
        <div className="page-label">What I've built</div>
        <h1 className="page-title">Featured <span>Projects</span></h1>
        <p className="page-sub">A selection of my recent MERN stack work</p>

        <div className="projects-grid">
          {projects.map((p, i) => {
            const PlaceholderIcon = placeholderIcons[p.placeholder];
            return (
            <div className="project-card" key={i}>
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
              </div>
            </div>
            );
          })}
        </div>
      </main>

      <footer>
        <p>Designed &amp; Built by <span>Hasnain Zaidi</span> — Full Stack Developer</p>
      </footer>
    </>
  );
}