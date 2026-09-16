// @vitest-environment jsdom
//
// Time Analysis moves with the data (Phase 388).
//
// The bug this locks down: /scope-2's live dashboard was the one surface never
// migrated onto the hooks. Its four tabs computed every figure from the
// COMPILED annual constant, and the month grid marked months "measured" from a
// hard-coded list — so entering a month in the admin portal moved the rest of
// the dashboard and left these tabs showing last release's numbers. Nothing
// crashed; the page just quietly disagreed with every other page.
//
// liveDataWiring.test.js catches the STRUCTURE of that mistake (a static import
// with no hook). These tests catch the BEHAVIOUR: feed the component two
// different ledgers and the rendered Time Analysis figures must differ.

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { COMPOSED_YTD_AS_OF } from '../data/composedYtd.js';

const YEAR = COMPOSED_YTD_AS_OF.slice(0, 4);

// Hoisted so the mock factory below can read it, and each test can swap what
// the hook returns before rendering.
const live = vi.hoisted(() => ({ value: null }));

vi.mock('../hooks/useMeasuredScope2.js', () => ({
  useMeasuredScope2: () => live.value,
}));

const { Scope2LiveDashboard } = await import('../components/Scope2LiveDashboard.js');

// A minimal ledger in the shape useMeasuredScope2 returns. The kWh fields stay
// 0 so the component falls back for the grid-mix breakdown — these tests are
// about the mtCO₂e figures and the month grid, not the fuel split.
function scope2(annualMt, measuredMonths = []) {
  return {
    ledger: { months: measuredMonths.map((month) => ({ month })), ytdKwh: 0 },
    annualMt,
    ytdMt: annualMt * 0.6,
    ytdKwh: 0,
    year1Kwh: 0,
    annualizeFactor: 0,
  };
}

// The day-of-week rows render "<n> kg". Pull them out in document order.
function dayRowKg(container) {
  return [...container.querySelectorAll('span')]
    .map((el) => el.textContent.trim())
    .filter((t) => /^\d+ kg$/.test(t))
    .map((t) => parseInt(t, 10));
}

function openTimeAnalysis() {
  fireEvent.click(screen.getByRole('tab', { name: 'Time Analysis' }));
}

beforeEach(() => { vi.useFakeTimers({ shouldAdvanceTime: true }); });
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe('Scope2LiveDashboard — Time Analysis reads live data', () => {
  it('scales the day-of-week figures with the live annual total', () => {
    live.value = scope2(365);
    const first = render(<Scope2LiveDashboard />);
    openTimeAnalysis();
    const low = dayRowKg(first.container);
    cleanup();

    live.value = scope2(730);
    const second = render(<Scope2LiveDashboard />);
    openTimeAnalysis();
    const high = dayRowKg(second.container);

    expect(low.length).toBeGreaterThan(0);
    expect(high.length).toBe(low.length);
    // Doubling the live annual figure doubles every daily figure. Before the
    // fix these were identical: both came from the compiled constant.
    low.forEach((kg, i) => {
      expect(high[i]).toBeGreaterThan(kg);
      expect(high[i] / kg).toBeCloseTo(2, 1);
    });
  });

  it('marks a month measured because the ledger says so, not a hard-coded list', () => {
    // December is deliberately outside the seeded feed months (Jan–Sep), so it
    // can only be marked measured if the grid is reading the live ledger.
    live.value = scope2(400, [`${YEAR}-12`]);
    render(<Scope2LiveDashboard />);
    openTimeAnalysis();

    const measured = screen.getAllByText('BMS measured');
    expect(measured).toHaveLength(1);

    // And it is December's card, not some other month's.
    const card = measured[0].closest('div');
    expect(card.textContent).toContain('Dec');
  });

  it('marks no month measured when the ledger is empty', () => {
    live.value = scope2(400, []);
    render(<Scope2LiveDashboard />);
    openTimeAnalysis();
    expect(screen.queryAllByText('BMS measured')).toHaveLength(0);
  });

  it('shows one measured card per ledger month', () => {
    live.value = scope2(400, [`${YEAR}-01`, `${YEAR}-02`, `${YEAR}-03`]);
    render(<Scope2LiveDashboard />);
    openTimeAnalysis();
    expect(screen.getAllByText('BMS measured')).toHaveLength(3);
  });
});
