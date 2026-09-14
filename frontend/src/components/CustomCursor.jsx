import React, { useEffect, useRef, useState } from 'react';
import '../style/CustomCursor.css';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setEnabled(mq.matches);

    const handleChange = (e) => setEnabled(e.matches);
    mq.addEventListener ? mq.addEventListener('change', handleChange) : mq.addListener(handleChange);
    return () => {
      mq.removeEventListener ? mq.removeEventListener('change', handleChange) : mq.removeListener(handleChange);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let ringX = window.innerWidth / 2;
    let ringY = window.innerHeight / 2;
    let dotX = ringX;
    let dotY = ringY;
    let targetX = ringX;
    let targetY = ringY;
    let rafId;

    const onMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setHidden(false);
    };

    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);

    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    const isInteractive = (el) =>
      el.closest('a, button, input, textarea, select, [role="button"], .nav-links li, .c-btn, .soc-card');

    const onOver = (e) => setHovering(Boolean(isInteractive(e.target)));

    const tick = () => {
      // dot follows instantly-ish, ring trails with easing
      dotX += (targetX - dotX) * 0.9;
      dotY += (targetY - dotY) * 0.9;
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseover', onOver);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        className={`cc-dot${hidden ? ' cc-hidden' : ''}${clicking ? ' cc-clicking' : ''}`}
      />
      <div
        ref={ringRef}
        className={`cc-ring${hidden ? ' cc-hidden' : ''}${hovering ? ' cc-hover' : ''}${clicking ? ' cc-clicking' : ''}`}
      />
    </>
  );
}
