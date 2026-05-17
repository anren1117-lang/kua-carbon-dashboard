// @vitest-environment jsdom
//
// Layout responsive behavior — verifies that on a narrow viewport the
// header collapses to a hamburger + drawer, and on a wide viewport the
// full horizontal nav renders. The hamburger drawer is the main reason
// a phone user can reach every page; if this test fails, mobile users
// have no way to navigate.

import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import React from 'react';
import { render, fireEvent, cleanup, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout.js';

function setWidth(px) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: px });
  act(() => { window.dispatchEvent(new Event('resize')); });
}

function mount() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<div>OVERVIEW BODY</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => { localStorage.clear(); });
afterEach(() => { cleanup(); });

describe('Layout — desktop viewport', () => {
  it('renders the full horizontal nav with all top items', () => {
    setWidth(1280);
    const { container } = mount();
    // Top nav routes are present.
    expect(container.textContent).toMatch(/Overview/);
    expect(container.textContent).toMatch(/Executive/);
    expect(container.textContent).toMatch(/Campus Map/);
    expect(container.textContent).toMatch(/Methodology/);
    // No hamburger.
    expect(container.querySelector('button[aria-label="Open menu"]')).toBeNull();
  });
});

describe('Layout — narrow viewport', () => {
  it('renders a hamburger button instead of the horizontal nav', () => {
    setWidth(390);
    const { container } = mount();
    const burger = container.querySelector('button[aria-label="Open menu"]');
    expect(burger).toBeTruthy();
    // The horizontal nav's wide-only "Categories" toggle should not be in the header.
    expect(container.querySelector('button[aria-haspopup="true"]')).toBeNull();
  });

  it('opens a drawer with grouped sections when the hamburger is tapped', () => {
    setWidth(390);
    const { container, getByLabelText } = mount();
    const burger = getByLabelText('Open menu');
    fireEvent.click(burger);
    const drawer = container.querySelector('nav[aria-label="Mobile primary"]');
    expect(drawer).toBeTruthy();
    expect(drawer.textContent).toMatch(/Portals/);
    expect(drawer.textContent).toMatch(/Dashboard/);
    expect(drawer.textContent).toMatch(/Categories/);
    // Spot-check a few high-traffic routes are reachable from the drawer.
    expect(drawer.textContent).toMatch(/Dorm leaderboard/);
    expect(drawer.textContent).toMatch(/Your footprint/);
    expect(drawer.textContent).toMatch(/News/);
  });

  it('closes the drawer when Close is tapped', () => {
    setWidth(390);
    const { container, getByLabelText } = mount();
    fireEvent.click(getByLabelText('Open menu'));
    expect(container.querySelector('nav[aria-label="Mobile primary"]')).toBeTruthy();
    fireEvent.click(getByLabelText('Close menu'));
    expect(container.querySelector('nav[aria-label="Mobile primary"]')).toBeNull();
  });
});
