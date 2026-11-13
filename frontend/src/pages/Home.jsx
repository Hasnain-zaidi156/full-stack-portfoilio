import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap, ScrollTrigger, SplitText, Draggable, scrollToId } from '../utils/gsapSetup';
import { profile, experience } from '../data/portfolioData';
import { downloadResumePdf } from '../utils/generateResumePdf';
import Collection from '../components/Collection';
import Skills from '../components/Skills';
import Memories from '../components/Memories';
import Contact from '../components/Contact';

const SERVICES = [
  ['Frontend Development', 'Pixel-accurate, performant interfaces.', '◐'], ['Full Stack Web Development', 'MERN apps from database to UI.', '⬡'],
  ['Responsive Website Design', 'Flawless on every screen.', '▭'], ['Interactive UI Development', 'Motion and micro-interactions.', '✦'],
  ['Landing Page Development', 'Pages designed to convert.', '⌂'], ['Website Optimization', 'Faster loads, better scores.', '⚡'],
];
const MARQUEE = 'REACT ✦ NODE ✦ EXPRESS ✦ MONGODB ✦ GSAP ✦ UI/UX ✦ RESPONSIVE ✦ ';
let played = false; // preloader sirf pehli dafa

export default function Home() {
  const root = useRef(null);
  const loc = useLocation();

  useEffect(() => {
    const $ = (s) => root.current.querySelector(s), $$ = (s) => [...root.current.querySelectorAll(s)];
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const heroIn = () => {
        const split = SplitText.create('.big', { type: 'chars,words' });
        gsap.timeline()
          .from(split.chars, { yPercent: 110, opacity: 0, stagger: 0.015, duration: 0.9, ease: 'lux' })
          .from(['.status', '.sub', '.name', '.ctas .btn'], { y: 30, opacity: 0, stagger: 0.1, duration: 0.7, ease: 'lux' }, '-=.5')
          .from('.photo', { scale: 0.8, opacity: 0, duration: 1, ease: 'lux' }, '<')
          .from('#ring', { drawSVG: 0, duration: 1.6, ease: 'power2.out' }, '<');
      };
      if (played) { $('.preloader').style.display = 'none'; heroIn(); } else {
        played = true;
        gsap.timeline({ onComplete: heroIn })
          .to('.pre-bar', { scaleX: 1, duration: 1, ease: 'power2.inOut' })
          .from('.pre-hz', { yPercent: 40, opacity: 0, duration: 0.8, ease: 'lux' }, 0)
          .to('.preloader', { yPercent: -100, duration: 0.9, ease: 'power4.inOut' });
      }
      // rotating role (TextPlugin)
      const roles = ['MERN Stack Developer', 'Full Stack Developer', 'React Developer'];
      let ri = 0;
      const loop = () => { ri = (ri + 1) % roles.length; gsap.to('#role', { duration: 1, text: roles[ri], ease: 'none' }); gsap.delayedCall(3.5, loop); };
      gsap.delayedCall(4, loop);
      gsap.to('#dot', { motionPath: { path: 'M200,4a196,196 0 1,1 0,392a196,196 0 1,1 0,-392' }, duration: 8, repeat: -1, ease: 'none' });
      gsap.to('.marquee div', { xPercent: -50, duration: 25, ease: 'none', repeat: -1 });
      $$('[data-scramble]').forEach((el) => { const t = el.textContent;
        ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => gsap.to(el, { duration: 1, scrambleText: { text: t, chars: 'upperCase', speed: 0.6 } }) }); });
      const sel = '.p,.s,.sv,.timeline article,.achv-card';
      gsap.set(sel, { opacity: 0, y: 60 });
      ScrollTrigger.batch(sel, { start: 'top 90%', once: true, onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, stagger: 0.08, duration: 0.9, ease: 'lux' }) });
      const ab = SplitText.create('.split', { type: 'words' });
      gsap.from(ab.words, { yPercent: 100, opacity: 0, stagger: 0.05, duration: 0.8, ease: 'lux', scrollTrigger: { trigger: '.split', start: 'top 85%' } });
      $$('[data-speed]').forEach((el) => gsap.fromTo(el, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: el.parentElement, scrub: true } }));
      gsap.from('.tl-line path', { drawSVG: 0, ease: 'none', scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 70%', scrub: true } });
      Draggable.create('#drag', { type: 'x,y', bounds: '.portrait', inertia: true });
      const hire = document.getElementById('hire');
      const wig = () => gsap.to(hire, { rotation: 8, ease: 'wig', duration: 1 });
      hire?.addEventListener('mouseenter', wig);
      const refresh = () => ScrollTrigger.refresh();
      addEventListener('load', refresh);
      return () => { hire?.removeEventListener('mouseenter', wig); removeEventListener('load', refresh); };
    });
    mm.add('(prefers-reduced-motion: reduce)', () => { $('.preloader').style.display = 'none'; });
    if (loc.state?.scrollTo) setTimeout(() => scrollToId(loc.state.scrollTo), 700);
    return () => mm.revert();
  }, [loc.state]);

  return (
    <div ref={root}>
      <div className="preloader" aria-hidden="true"><span className="pre-hz">HZ</span><span className="pre-bar" /></div>
      <main id="main">
        <section id="home" className="hero">
          <p className="status"><i /> Available for new projects</p>
          <h1 className="big">BUILDING DIGITAL EXPERIENCES THAT MATTER.</h1>
          <div className="hero-row">
            <div>
              <p className="sub">Creative Frontend Developer &amp; <span id="role">MERN Stack Developer</span> crafting modern, interactive and high-performance digital experiences.</p>
              <p className="name">HASNAIN ZAIDI</p>
              <div className="ctas">
                <a href="#collection" className="btn dark mag" onClick={(e) => { e.preventDefault(); scrollToId('collection'); }}>Explore Collection</a>
                <a href="#contact" className="btn mag" onClick={(e) => { e.preventDefault(); scrollToId('contact'); }}>Let's Work Together</a>
              </div>
            </div>
            <div className="photo">
              <img src={profile.photo} alt="Hasnain Zaidi portrait" width="400" height="400" fetchPriority="high" />
              <svg viewBox="0 0 400 400" aria-hidden="true"><circle id="ring" cx="200" cy="200" r="196" fill="none" stroke="currentColor" strokeWidth="1.5" /><circle id="dot" r="9" fill="currentColor" /></svg>
            </div>
          </div>
        </section>

        <div className="marquee" aria-hidden="true"><div><span>{MARQUEE}</span><span>{MARQUEE}</span></div></div>

        <Collection />
        <Skills />

        <section className="sec">
          <p className="eyebrow" data-scramble>Services</p><h2>Shop by Category</h2>
          <div className="grid services">
            {SERVICES.map(([t, d, ic]) => <article className="sv" key={t}><span className="ic">{ic}</span><h3>{t}</h3><p>{d}</p></article>)}
          </div>
        </section>

        <section id="about" className="sec about">
          <div>
            <p className="eyebrow" data-scramble>About</p>
            <h2 className="split">Dedicated to detail. Driven by design.</h2>
            <p className="meta">Hasnain Zaidi · MERN Stack Developer | Full Stack Web Developer · {profile.address} · Training: Saylani Mass IT Training (SMIT), TITAN Sukkur</p>
            <p>I am a dedicated Frontend Developer with a strong focus on building interactive and responsive web applications using React.js. With a solid foundation in JavaScript, HTML5, CSS3, and Bootstrap, I enjoy turning complex problems into simple, beautiful, and intuitive designs.</p>
            <p>I am also a Homeopathy Doctor, which gives me a unique perspective on attention to detail and a disciplined approach to problem-solving.</p>
            <div className="ctas">
              <button className="btn dark mag" onClick={() => downloadResumePdf()}>Download Resume (PDF)</button>
              <Link className="btn mag" to="/resume">View Resume</Link>
            </div>
          </div>
          <div className="portrait"><img className="plate" data-speed="0.15" src={profile.photo} alt="Hasnain Zaidi" loading="lazy" /><div className="tag" id="drag">Drag me ®</div></div>
        </section>

        <Memories />

        <section className="sec alt">
          <p className="eyebrow" data-scramble>Experience &amp; Education</p><h2>Timeline</h2>
          <div className="timeline">
            <svg className="tl-line" preserveAspectRatio="none" viewBox="0 0 2 100"><path d="M1 0V100" stroke="currentColor" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" /></svg>
            {experience.map((x) => (
              <article key={x.title}><time>{x.date}</time><h3>{x.title}</h3><ul>{x.points.map((p) => <li key={p}>{p}</li>)}</ul></article>
            ))}
            <article><time>Training</time><h3>Saylani Mass IT Training (SMIT)</h3><p>TITAN Sukkur — MERN Stack development.</p></article>
            <article><time>College</time><h3>Govt. Islamia Science College Sukkur</h3><p>Intermediate, Computer Science (2024).</p></article>
          </div>
        </section>

        <Contact />
      </main>
      <footer className="foot"><b>HASNAIN ZAIDI®</b><span>© 2026 · Rohri, Sindh · <Link to="/resume">Resume</Link></span></footer>
    </div>
  );
}
