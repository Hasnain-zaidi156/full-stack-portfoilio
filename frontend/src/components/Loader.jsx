import { useEffect, useState } from 'react';
import '../style/Loader.css';
import { preload } from '../utils/images';

/*
  Shuru ka loader: Hasnain Zaidi ka naam + progress bar.
  Fonts/profile image ka intezar karta hai (max ~3.5s), kam az kam ~1.4s dikhta hai.
*/
const MIN_MS = 1400;
const MAX_MS = 3500;

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const start = performance.now();
    let ready = false;
    let raf;

    const markReady = () => { ready = true; };

    const imgReady = preload('profile');
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    Promise.all([imgReady, fontsReady]).then(markReady);

    const tick = (now) => {
      const t = now - start;
      // ready hone se pehle 90% par rukta hai, ready hone par 100% tak
      const target = ready && t >= MIN_MS ? 100 : Math.min(90, (t / MIN_MS) * 90);
      setProgress((p) => p + (target - p) * 0.12);

      if ((ready && t >= MIN_MS) || t >= MAX_MS) {
        setProgress(100);
        setLeaving(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!leaving) return;
    document.body.classList.remove('is-loading');
    window.__appLoaded = true;
    window.dispatchEvent(new Event('app-loaded'));
    const t = setTimeout(() => setGone(true), 650);
    return () => clearTimeout(t);
  }, [leaving]);

  useEffect(() => {
    document.body.classList.add('is-loading');
    return () => document.body.classList.remove('is-loading');
  }, []);

  if (gone) return null;

  return (
    <div className={`loader${leaving ? ' loader-out' : ''}`} role="status" aria-live="polite" aria-label="Loading">
      <div className="loader-box">
        <div className="loader-orb">
          <span className="loader-ring" />
          <span className="loader-ring loader-ring2" />
          <span className="loader-initials">HZ</span>
        </div>
        <p className="loader-name">Hasnain <span>Zaidi</span></p>
        <div className="loader-bar"><i style={{ width: `${progress}%` }} /></div>
        <p className="loader-pct">{Math.round(progress)}%</p>
      </div>
    </div>
  );
}
