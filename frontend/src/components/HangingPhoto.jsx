import { useEffect, useRef, useState } from 'react';
import '../style/HangingPhoto.css';

/*
  HangingPhoto
  - Photo ek dhagay (V-shape string + keel) se latki hoti hai, pendulum physics ke saath.
  - PC: mouse photo ke upar se guzaro to hilti hai, pakar kar kheencho to jhoolti hai.
  - Mobile: phone shake karo to hilti hai (DeviceMotion), ungli se kheench kar bhi chhod sakte ho.
  - iOS par motion permission ke liye ek tap chahiye, isliye chhota "Tap to enable shake" button aata hai.
*/

const GRAVITY = 0.00002;     // ~1.4s ka time-period, asli latakti cheez jaisa
const DAMPING = 0.9945;      // jitna kam, utni jaldi ruk jayegi
const MAX_ANGLE = 0.8;       // radians (~46°), isse zyada nahi ghumegi
const SHAKE_THRESHOLD = 14;  // m/s² — isse zyada jhatka = shake

export default function HangingPhoto({ children }) {
  const hangRef = useRef(null);
  const swingRef = useRef(null);
  const stateRef = useRef({ angle: 0, vel: 0, dragging: false, lastX: 0, lastT: 0 });
  const [isTouch] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: none) and (pointer: coarse)').matches
  );
  const hasMotion = typeof window !== 'undefined' && typeof window.DeviceMotionEvent !== 'undefined';
  const askFirst = hasMotion && typeof window.DeviceMotionEvent.requestPermission === 'function';
  const [permissionDone, setPermissionDone] = useState(false);
  const [motionGranted, setMotionGranted] = useState(false);
  // Android/others: seedha on; iOS: tap ke baad on
  const motionOn = isTouch && hasMotion && (askFirst ? motionGranted : true);
  const needsPermission = isTouch && askFirst && !permissionDone;

  /* ---------- physics loop ---------- */
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const s = stateRef.current;
    if (reduce) s.angle = 0;

    let raf;
    let last = performance.now();

    const tick = (now) => {
      const dt = Math.min(32, now - last);
      last = now;

      if (!s.dragging && !reduce) {
        // pendulum: angular acceleration = -g * sin(angle)
        s.vel += -GRAVITY * Math.sin(s.angle) * dt;
        s.vel *= Math.pow(DAMPING, dt / 16);
        s.angle += s.vel * dt;

        if (s.angle > MAX_ANGLE) { s.angle = MAX_ANGLE; s.vel *= -0.4; }
        if (s.angle < -MAX_ANGLE) { s.angle = -MAX_ANGLE; s.vel *= -0.4; }

        // bohat chhoti halchal ko rok do taake CPU na jale
        if (Math.abs(s.angle) < 0.0005 && Math.abs(s.vel) < 0.00002) {
          s.angle = 0;
          s.vel = 0;
        }
      }

      if (swingRef.current) {
        swingRef.current.style.transform = `rotate(${s.angle}rad)`;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ---------- loader khatam hote hi halka sa intro jhoola ---------- */
  useEffect(() => {
    const s = stateRef.current;
    const kick = () => { s.vel += 0.0022; };
    if (window.__appLoaded) {
      const t = setTimeout(kick, 250);
      return () => clearTimeout(t);
    }
    window.addEventListener('app-loaded', kick, { once: true });
    return () => window.removeEventListener('app-loaded', kick);
  }, []);

  /* ---------- mobile shake ---------- */
  useEffect(() => {
    if (!motionOn) return;
    const s = stateRef.current;
    let lastShake = 0;

    const onMotion = (e) => {
      const a = e.accelerationIncludingGravity;
      if (!a) return;
      const now = Date.now();

      // seedha left-right jhatke ko swing mein badlo
      const ax = a.x || 0;
      const total = Math.sqrt((a.x || 0) ** 2 + (a.y || 0) ** 2 + (a.z || 0) ** 2);
      const jerk = Math.abs(total - 9.8);

      if (jerk > SHAKE_THRESHOLD * 0.35 && now - lastShake > 90) {
        lastShake = now;
        const push = Math.max(-0.004, Math.min(0.004, -ax * 0.0003));
        s.vel += Math.abs(push) > 0.0005 ? push : (Math.random() > 0.5 ? 0.002 : -0.002);
      }
    };

    window.addEventListener('devicemotion', onMotion);
    return () => window.removeEventListener('devicemotion', onMotion);
  }, [motionOn]);

  const enableMotion = async () => {
    try {
      const res = await window.DeviceMotionEvent.requestPermission();
      if (res === 'granted') {
        setMotionGranted(true);
        stateRef.current.vel += 0.0025; // confirm karne ke liye halka sa jhatka
      }
    } catch {
      /* permission nahi mili — touch drag phir bhi chalega */
    }
    setPermissionDone(true);
  };

  /* ---------- pointer: hover push + drag ---------- */
  const onPointerMove = (e) => {
    const s = stateRef.current;
    const now = performance.now();
    const dx = e.clientX - s.lastX;
    const dtp = Math.max(1, now - s.lastT);
    const speed = dx / dtp; // px/ms

    if (s.dragging) {
      const rect = hangRef.current.getBoundingClientRect(); // ye rotate nahi hota
      const pivotX = rect.left + rect.width / 2;
      const pivotY = rect.top; // nail yahan hai
      const ang = Math.atan2(e.clientX - pivotX, Math.max(60, e.clientY - pivotY));
      // CSS rotate(+) clockwise hota hai, isliye pointer right par ho to angle negative
      const next = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, -ang));
      s.vel = (next - s.angle) / Math.max(1, dtp);
      s.angle = next;
    } else if (e.pointerType === 'mouse' && Math.abs(speed) > 0.15) {
      // mouse photo ke upar se tez guzre to halka dhakka
      s.vel += Math.max(-0.0012, Math.min(0.0012, -speed * 0.0005));
    }

    s.lastX = e.clientX;
    s.lastT = now;
  };

  const onPointerDown = (e) => {
    const s = stateRef.current;
    s.dragging = true;
    s.vel = 0;
    s.lastX = e.clientX;
    s.lastT = performance.now();
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const endDrag = (e) => {
    const s = stateRef.current;
    if (!s.dragging) return;
    s.dragging = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  return (
    <div className="hang" ref={hangRef}>
      <div
        className="hang-swing"
        ref={swingRef}
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={(e) => e.pointerType === 'mouse' && !e.buttons && endDrag(e)}
      >
        {/* nail + dhaga */}
        <svg className="hang-thread" viewBox="0 0 380 165" aria-hidden="true">
          <defs>
            <linearGradient id="threadG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#e6c9a0" />
              <stop offset="1" stopColor="#b98a52" />
            </linearGradient>
            <pattern id="twist" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(55)">
              <rect width="6" height="6" fill="url(#threadG)" />
              <rect width="2" height="6" fill="rgba(0,0,0,0.22)" />
            </pattern>
          </defs>
          {/* do taraf ka dhaga (V shape) */}
          <line x1="190" y1="12" x2="73" y2="160" stroke="url(#twist)" strokeWidth="3.2" strokeLinecap="round" />
          <line x1="190" y1="12" x2="307" y2="160" stroke="url(#twist)" strokeWidth="3.2" strokeLinecap="round" />
          {/* gaanth (knots) */}
          <circle cx="73" cy="160" r="5.5" fill="#c9762f" stroke="rgba(0,0,0,0.35)" strokeWidth="1" />
          <circle cx="307" cy="160" r="5.5" fill="#c9762f" stroke="rgba(0,0,0,0.35)" strokeWidth="1" />
          {/* keel / nail */}
          <circle cx="190" cy="10" r="8" fill="#9aa7b4" stroke="rgba(0,0,0,0.45)" strokeWidth="1.5" />
          <circle cx="188" cy="8" r="2.6" fill="rgba(255,255,255,0.7)" />
        </svg>

        <div className="hang-body">{children}</div>
      </div>

      {needsPermission && (
        <button type="button" className="hang-motion-btn" onClick={enableMotion}>
          Tap to enable shake
        </button>
      )}
      <p className="hang-hint">
        {isTouch ? 'Phone shake karo ya photo ko kheencho' : 'Mouse se photo ko hilao ya pakar kar kheencho'}
      </p>
    </div>
  );
}
