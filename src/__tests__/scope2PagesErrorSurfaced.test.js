// @vitest-environment jsdom
//
// The last of #20. Six surfaces read useMeasuredScope2 DIRECTLY — not through
// the composer Phase 442 fixed — and not one of them referenced `.error` at
// all. A Supabase failure was invisible on every one, including /scope-2, the
// page whose entire subject is Scope 2.
//
// Only three need wiring, and the reason each of the other three does not is
// worth writing down rather than discovering again later:
//
//   PeerComparison        renders in App.js — the homepage already carries the
//                         composer notice, and the composer aggregates
//                         s2.error as "Scope 2: ...". Already covered.
//   Scope2BmsInsights     both render INSIDE Scope2.js, so wiring the page
//   Scope2LiveDashboard   covers both charts. One notice per page, not per
//                         chart — the rule held since Phase 443.
//
// Driven through the REAL error path; asserted on the RENDERED DOM; scoped to
// the notice element, because these pages say "Scope 2" throughout their prose
// and a loose getByText would pass against a notice naming nothing.

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

import Scope2 from '../pages/Scope2.js';
import Hotspots from '../pages/Hotspots.js';
import BuildingsPage from '../pages/Buildings.js';
import { _resetCacheForTests } from '../hooks/measuredCache.js';

const PAGES = [['Scope2', Scope2], ['Hotspots', Hotspots], ['Buildings', BuildingsPage]];
const mount = (C) => render(<MemoryRouter future={ROUTER_FUTURE}><C /></MemoryRouter>);
// useMeasuredScope2 reads SCOPE2_TABLE — 'scope2_meter_readings'. My first
// fixture guessed 'electricity_ledger', so the injected error never fired and
// all three pages "failed" while the wiring was already correct. Imported
// rather than retyped, so a table rename cannot quietly hollow this file out.
import { SCOPE2_TABLE } from '../hooks/useMeasuredScope2.js';
const FAIL = { [SCOPE2_TABLE]: { data: null, error: { message: 'rls denied' } } };

beforeEach(() => { cleanup(); _resetCacheForTests?.(); setNextResponses({}); });
afterEach(() => { cleanup(); });

describe('the Scope 2 surfaces report a failed fetch', () => {
  it.each(PAGES)('%s surfaces the error', async (name, C) => {
    setNextResponses(FAIL);
    mount(C);
    await waitFor(() => expect(screen.getByText(/Live data unavailable/i)).toBeTruthy());
    expect(screen.getByText(/Live data unavailable/i).textContent).toMatch(/rls denied/);
  });

  it.each(PAGES)('%s stays quiet when the table is merely empty', async (name, C) => {
    setNextResponses({});
    mount(C);
    await new Promise((r) => setTimeout(r, 120));
    expect(screen.queryByText(/Live data unavailable/i)).toBeNull();
  });

  it.each(PAGES)('%s still renders its content on failure', async (name, C) => {
    setNextResponses(FAIL);
    const { container } = mount(C);
    await waitFor(() => expect(screen.getByText(/Live data unavailable/i)).toBeTruthy());
    expect(container.textContent.length).toBeGreaterThan(400);
  });

  it('shows ONE notice on /scope-2, not one per chart', async () => {
    // Scope2BmsInsights and Scope2LiveDashboard both live on this page.
    setNextResponses(FAIL);
    mount(Scope2);
    await waitFor(() => expect(screen.getByText(/Live data unavailable/i)).toBeTruthy());
    expect(screen.getAllByText(/Live data unavailable/i)).toHaveLength(1);
  });
});
