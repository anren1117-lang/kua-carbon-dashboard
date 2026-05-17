// @vitest-environment jsdom
//
// DormLeaderboardPreview — the homepage strip that surfaces the top
// three dorms by kWh/resident with a link to /dorm-leaderboard. The
// test guards two things: (a) it actually renders something with
// real building data behind it, and (b) the link to the full
// leaderboard is present (otherwise the strip is a dead-end for
// the user).

import { describe, it, expect, afterEach } from 'vitest';
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DormLeaderboardPreview } from '../components/DormLeaderboardPreview.js';

afterEach(() => { cleanup(); });

describe('DormLeaderboardPreview', () => {
  it('renders at least one dorm row with kWh/resident annotation', () => {
    const { container } = render(
      <MemoryRouter><DormLeaderboardPreview /></MemoryRouter>,
    );
    // Should include a medal emoji from the top-3 podium.
    const hasMedal = /🥇|🥈|🥉/.test(container.textContent);
    expect(hasMedal).toBe(true);
    // Should include the per-resident annotation.
    expect(container.textContent).toMatch(/kWh\/resident\/yr/);
  });

  it('includes a link to the full /dorm-leaderboard page', () => {
    const { container } = render(
      <MemoryRouter><DormLeaderboardPreview /></MemoryRouter>,
    );
    const cta = container.querySelector('a[href="/dorm-leaderboard"]');
    expect(cta).toBeTruthy();
    expect(cta.textContent).toMatch(/See all/);
  });

  it('individual dorm names link to their /buildings/:id detail', () => {
    const { container } = render(
      <MemoryRouter><DormLeaderboardPreview /></MemoryRouter>,
    );
    // At least one dorm name should be a link to /buildings/...
    const buildingLinks = container.querySelectorAll('a[href^="/buildings/"]');
    expect(buildingLinks.length).toBeGreaterThan(0);
  });
});
