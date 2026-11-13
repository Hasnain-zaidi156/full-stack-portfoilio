// Ek jagah saare GSAP plugins register hote hain (gsap 3.13+ mein sab plugins free hain).
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { TextPlugin } from 'gsap/TextPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { Flip } from 'gsap/Flip';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { CustomEase } from 'gsap/CustomEase';
import { CustomWiggle } from 'gsap/CustomWiggle';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText, ScrambleTextPlugin, TextPlugin,
  DrawSVGPlugin, MotionPathPlugin, Flip, Draggable, InertiaPlugin, CustomEase, CustomWiggle);
CustomEase.create('lux', '0.16,1,0.3,1');
CustomWiggle.create('wig', { wiggles: 5, type: 'easeOut' });

export { gsap, ScrollTrigger, SplitText, Flip, Draggable };
export const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const scrollToId = (id) =>
  gsap.to(window, { duration: reduceMotion() ? 0 : 1.1, scrollTo: { y: '#' + id, offsetY: 60 }, ease: 'lux' });

// Flip filter: capture() filter badalne se pehle call karo, phir setState.
export function useFlipFilter(selector, dep) {
  const st = useRef(null);
  useLayoutEffect(() => {
    if (!st.current) return;
    Flip.from(st.current, {
      duration: reduceMotion() ? 0 : 0.7, ease: 'lux', scale: true, absolute: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.8, duration: 0.3 }),
    });
    st.current = null;
  }, [dep]);
  return () => { st.current = Flip.getState(selector); };
}
