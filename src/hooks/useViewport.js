import { useEffect, useState } from 'react';

// Tiny viewport hook for the inline-style codebase. The CSS-in-JS
// pattern here doesn't have @media queries available, so the
// responsive branches live in JS: components call useIsNarrow() and
// swap their styles based on the boolean.
//
// The breakpoint is 720px — phones in portrait orientation and the
// narrower iPad split-view. Above 720 we keep the existing desktop
// grids untouched; below, components collapse to stacked / hamburger
// variants.

export const NARROW_BREAKPOINT = 720;

// SSR-safe default: when window is missing (Node, tests without
// jsdom, build-time), pretend desktop so server-rendered markup
// matches the desktop case the design was originally tuned for.
function readWidth() {
  if (typeof window === 'undefined') return Infinity;
  return window.innerWidth || Infinity;
}

export function useViewportWidth() {
  const [width, setWidth] = useState(readWidth);
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const onResize = () => setWidth(window.innerWidth || Infinity);
    window.addEventListener('resize', onResize);
    // Sync once on mount in case the initial read happened before
    // the layout settled (e.g. orientation change after hydration).
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return width;
}

export function useIsNarrow(breakpoint = NARROW_BREAKPOINT) {
  const width = useViewportWidth();
  return width < breakpoint;
}
