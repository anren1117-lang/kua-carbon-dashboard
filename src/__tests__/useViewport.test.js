// @vitest-environment jsdom
//
// useViewport — verifies the responsive boolean used by Layout to
// swap between desktop nav and the mobile hamburger drawer. Pure
// hook; only DOM dependency is window.innerWidth + 'resize'.

import { describe, it, expect, afterEach } from 'vitest';
import React from 'react';
import { render, act, cleanup } from '@testing-library/react';
import { useIsNarrow, useViewportWidth, NARROW_BREAKPOINT } from '../hooks/useViewport.js';

function harness(hookCall) {
  const seen = [];
  function Probe() {
    seen.push(hookCall());
    return null;
  }
  return { Probe, seen };
}

function setWidth(px) {
  // jsdom doesn't ship a real layout engine, so innerWidth is just a
  // plain property we can overwrite. Fire 'resize' to trigger the
  // hook's listener.
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: px });
  act(() => { window.dispatchEvent(new Event('resize')); });
}

afterEach(() => { cleanup(); });

describe('useIsNarrow', () => {
  it('reports false when viewport is wider than the breakpoint', () => {
    setWidth(1200);
    const { Probe, seen } = harness(() => useIsNarrow());
    render(<Probe />);
    expect(seen.at(-1)).toBe(false);
  });

  it('reports true when viewport is narrower than the breakpoint', () => {
    setWidth(390); // iPhone 12 portrait
    const { Probe, seen } = harness(() => useIsNarrow());
    render(<Probe />);
    expect(seen.at(-1)).toBe(true);
  });

  it('reacts to resize events', () => {
    setWidth(1200);
    const { Probe, seen } = harness(() => useIsNarrow());
    render(<Probe />);
    expect(seen.at(-1)).toBe(false);
    setWidth(500);
    expect(seen.at(-1)).toBe(true);
    setWidth(1024);
    expect(seen.at(-1)).toBe(false);
  });

  it('honors a custom breakpoint', () => {
    setWidth(900);
    const { Probe, seen } = harness(() => useIsNarrow(1000));
    render(<Probe />);
    expect(seen.at(-1)).toBe(true);
  });

  it('exposes a sensible default breakpoint', () => {
    expect(NARROW_BREAKPOINT).toBe(720);
  });
});

describe('useViewportWidth', () => {
  it('returns the current width on mount', () => {
    setWidth(820);
    const { Probe, seen } = harness(() => useViewportWidth());
    render(<Probe />);
    expect(seen.at(-1)).toBe(820);
  });
});
