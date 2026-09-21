// @vitest-environment jsdom
//
// The last two public pages from #20. Both read useMeasuredSinks directly
// (not the composer Phase 442 fixed) and both do this:
//
//   const isMeasured = live.measured && !live.loading && !live.error;
//
// `.error` is consumed ONLY to negate isMeasured. So a Supabase failure falls
// through to the placeholder — ANNUAL_SEQUESTRATION_MT, TOTAL_FOREST_ACRES —
// and renders it labelled "Stand-weighted (placeholder)". That label is honest
// about being a placeholder and silent about WHY: an empty table and a failed
// fetch produce byte-identical pages.
//
// This is the Phase 432 defect on /sinks-os and /credits, the two surfaces it
// did not reach.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ROUTER_FUTURE } from './routerFuture.js';

const { setNextResponses, makeQueryHarness } = vi.hoisted(() => {
  let responses = {};
  const setNextResponses = (next) => { responses = next; };
  const makeQueryHarness = () => {
    function makeBuilder(table) {
      const p = { select() { return p; }, order() { return p; }, limit() { return p; }, eq() { return p; },
        then(res, rej) { return Promise.resolve(responses[table] ?? { data: [], error: null }).then(res, rej); } };
      return p;
    }
    return { from: (table) => makeBuilder(table) };
  };
  return { setNextResponses, makeQueryHarness };
});

vi.mock('../supabaseClient.js', () => ({ supabase: makeQueryHarness() }));

import Sinks2 from '../pages/Sinks2.js';
import CarbonCredits from '../pages/CarbonCredits.js';
import { _resetCacheForTests } from '../hooks/measuredCache.js';

const PAGES = [['Sinks2', Sinks2], ['CarbonCredits', CarbonCredits]];
const mount = (C) => render(<MemoryRouter future={ROUTER_FUTURE}><C /></MemoryRouter>);

beforeEach(() => { cleanup(); _resetCacheForTests?.(); setNextResponses({}); });
afterEach(() => { cleanup(); });

describe('the sinks pages report a failed fetch instead of swallowing it', () => {
  it.each(PAGES)('%s surfaces the error', async (name, C) => {
    setNextResponses({ forest_stand_actuals: { data: null, error: { message: 'rls denied' } } });
    mount(C);
    await waitFor(() => expect(screen.getByText(/Live data unavailable/i)).toBeTruthy());
    // Scoped to the notice: these pages say "forest" and "stand" in prose, so a
    // loose query would pass against a notice that named nothing.
    expect(screen.getByText(/Live data unavailable/i).textContent).toMatch(/rls denied/);
  });

  it.each(PAGES)('%s stays quiet when the table is merely empty', async (name, C) => {
    setNextResponses({});
    mount(C);
    await new Promise((r) => setTimeout(r, 120));
    expect(screen.queryByText(/Live data unavailable/i)).toBeNull();
  });

  it.each(PAGES)('%s still renders its placeholder figures on failure', async (name, C) => {
    // The notice adds a fact; it must not replace the page.
    setNextResponses({ forest_stand_actuals: { data: null, error: { message: 'boom' } } });
    const { container } = mount(C);
    await waitFor(() => expect(screen.getByText(/Live data unavailable/i)).toBeTruthy());
    expect(container.textContent.length).toBeGreaterThan(400);
  });
});
