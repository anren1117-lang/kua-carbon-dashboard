import React, { useEffect, useState } from 'react';

// Small floating "scroll to top" button that appears once the user
// has scrolled past 500px. Bottom-right, cyan, lifts on hover. Click
// smooth-scrolls the window back to top. Respects prefers-reduced-
// motion by using behavior: 'auto' instead of 'smooth' when set.
//
// Mounted once at the Layout level so every public-site page picks
// it up without per-page wiring.

const SHOW_AFTER_PX = 500;

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    let raf = null;
    function onScroll() {
      if (raf !== null) return;
      raf = requestAnimationFrame(() => {
        setVisible(window.scrollY > SHOW_AFTER_PX);
        raf = null;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  function onClick() {
    if (typeof window === 'undefined') return;
    const reduceMotion = window.matchMedia
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Scroll back to top"
      style={{
        ...styles.btn,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.85)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="5 12 12 5 19 12" />
      </svg>
    </button>
  );
}

const styles = {
  btn: {
    position: 'fixed',
    right: 18,
    bottom: 18,
    width: 44,
    height: 44,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #22d3ee, #06b6d4)',
    color: '#0b1220',
    border: '1px solid rgba(11, 18, 32, 0.4)',
    boxShadow: '0 6px 16px -4px rgba(34, 211, 238, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 90,
    transition: 'opacity 220ms ease, transform 220ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 200ms ease',
  },
};
