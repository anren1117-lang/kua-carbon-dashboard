import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Top-of-page progress bar that fires on every route change.
// Pattern from YouTube, Stripe, Vercel, GitHub, Notion. A 2px
// cyan bar that quickly progresses from 0 → 70% → 100% over
// ~600ms then fades out.
//
// Because route changes in this app are mostly instant (lazy-
// loaded chunks resolve in <200ms on a warm network), the bar
// is more a visual cue ("the page changed") than an actual
// progress indicator. Still a luxury polish detail.

export function RouteProgress() {
  const { pathname } = useLocation();
  const [phase, setPhase] = useState('idle'); // 'idle' | 'running' | 'done'

  useEffect(() => {
    let t1, t2, t3;
    setPhase('running');
    t1 = setTimeout(() => setPhase('done'), 450);
    t2 = setTimeout(() => setPhase('idle'), 800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [pathname]);

  if (phase === 'idle') return null;

  return (
    <div style={styles.bar} aria-hidden="true">
      <div
        style={{
          ...styles.fill,
          width: phase === 'done' ? '100%' : '70%',
          opacity: phase === 'done' ? 0 : 1,
        }}
      />
    </div>
  );
}

const styles = {
  bar: {
    position: 'fixed',
    top: 0, left: 0, right: 0,
    height: 2,
    zIndex: 300,
    pointerEvents: 'none',
    background: 'transparent',
  },
  fill: {
    height: '100%',
    background: 'linear-gradient(90deg, #22d3ee 0%, #06b6d4 50%, #22d3ee 100%)',
    boxShadow: '0 0 10px rgba(34, 211, 238, 0.7), 0 0 4px rgba(34, 211, 238, 0.5)',
    transition: 'width 350ms cubic-bezier(0.22, 1, 0.36, 1), opacity 250ms ease 100ms',
  },
};
