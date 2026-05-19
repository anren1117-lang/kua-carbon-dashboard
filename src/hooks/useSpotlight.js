import { useEffect, useRef } from 'react';

// Cursor-following spotlight effect — updates --kua-mx and
// --kua-my CSS custom properties on the ref'd element so the
// .kua-spotlight CSS class can paint a radial-gradient that
// tracks the pointer.
//
// Used by the homepage hero. Inspired by Vercel / GitHub /
// Linear marketing-site card hovers.

const REDUCED_MOTION = typeof window !== 'undefined'
  && typeof window.matchMedia === 'function'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useSpotlight(externalRef) {
  const internalRef = useRef(null);
  const ref = externalRef || internalRef;
  useEffect(() => {
    if (REDUCED_MOTION) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    let raf = null;
    let pending = null;
    function apply() {
      if (!pending || !el) { raf = null; return; }
      const r = el.getBoundingClientRect();
      const x = ((pending.x - r.left) / r.width) * 100;
      const y = ((pending.y - r.top) / r.height) * 100;
      el.style.setProperty('--kua-mx', `${x}%`);
      el.style.setProperty('--kua-my', `${y}%`);
      raf = null;
    }
    function onMove(e) {
      pending = { x: e.clientX, y: e.clientY };
      if (raf === null) raf = requestAnimationFrame(apply);
    }
    el.addEventListener('mousemove', onMove);
    return () => {
      el.removeEventListener('mousemove', onMove);
      if (raf !== null) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
  return ref;
}
