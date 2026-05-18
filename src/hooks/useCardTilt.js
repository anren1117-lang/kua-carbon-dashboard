import { useEffect, useRef } from 'react';

// Apple Vision Pro-style 3D tilt that follows the cursor across
// a card. Subtle (~6deg max rotation) and uses transform-style:
// preserve-3d so child highlights catch the light. Disabled on
// touch devices + under prefers-reduced-motion.
//
// Usage:
//   const tiltRef = useCardTilt({ max: 6 });
//   <div ref={tiltRef} className="kua-tilt">...</div>
//
// The .kua-tilt CSS class wires the perspective + transition
// (defined in App.css).

const REDUCED_MOTION = typeof window !== 'undefined'
  && typeof window.matchMedia === 'function'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const IS_TOUCH = typeof window !== 'undefined'
  && ('ontouchstart' in window || (navigator?.maxTouchPoints || 0) > 0);

export function useCardTilt(opts = {}) {
  const ref = useRef(null);
  const max = opts.max ?? 6;
  const scale = opts.scale ?? 1.015;

  useEffect(() => {
    if (REDUCED_MOTION || IS_TOUCH) return undefined;
    const el = ref.current;
    if (!el) return undefined;

    let raf = null;
    let pending = null;

    function apply() {
      if (!pending || !el) { raf = null; return; }
      const { x, y } = pending;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      // -1..1 normalized offset from center
      const dx = (x - cx) / (r.width / 2);
      const dy = (y - cy) / (r.height / 2);
      const rotY = Math.max(-1, Math.min(1, dx)) * max;
      const rotX = -Math.max(-1, Math.min(1, dy)) * max;
      el.style.transform = `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale(${scale})`;
      raf = null;
    }

    function onMove(e) {
      pending = { x: e.clientX, y: e.clientY };
      if (raf === null) raf = requestAnimationFrame(apply);
    }
    function onLeave() {
      pending = null;
      if (el) el.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale(1)';
    }

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      if (raf !== null) cancelAnimationFrame(raf);
      if (el) el.style.transform = '';
    };
  }, [max, scale]);

  return ref;
}
