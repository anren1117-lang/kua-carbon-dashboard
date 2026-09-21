// @vitest-environment jsdom
//
// Phase 442 gave useMeasuredScopeTotals an `error` and wired the two homepage
// components to it. Five more PUBLIC pages read that same composer and still
// rendered build-time constants as though they were live when a fetch failed:
// Executive, Goals, Actions, Scenarios, AnnualReport.
//
// ONE NOTICE PER PAGE, NOT PER CHART. Six chart components (ScopeDonut,
// PeerComparison, ScopeRangeChart, NetBalanceWaterfall, MeasuredShareChart,
// AISummary) also read the composer, and giving each its own banner would show
// a reader four identical warnings on one page. The page owns the notice.
//
// TeacherPortal reads the composer too but sits behind a PasswordGate, so it
// renders nothing to assert against without auth; left for #20.
//
// Driven through the REAL error path and asserted on the RENDERED DOM.

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
      const p = {
        select() { return p; }, order() { return p; },
        limit() { return p; }, eq() { return p; },
        then(res, rej) {
          return Promise.resolve(responses[table] ?? { data: [], error: null }).then(res, rej);
        },
      };
      return p;
    }
    return { from: (table) => makeBuilder(table) };
  };
  return { setNextResponses, makeQueryHarness };
});

vi.mock('../supabaseClient.js', () => ({ supabase: makeQueryHarness() }));

import Executive from '../pages/Executive.js';
import Goals from '../pages/Goals.js';
import Actions from '../pages/Actions.js';
import Scenarios from '../pages/Scenarios.js';
import AnnualReport from '../pages/AnnualReport.js';
import { _resetCacheForTests } from '../hooks/measuredCache.js';

const PAGES = [
  ['Executive', Executive],
  ['Goals', Goals],
  ['Actions', Actions],
  ['Scenarios', Scenarios],
  ['AnnualReport', AnnualReport],
];

const mount = (C) => render(<MemoryRouter future={ROUTER_FUTURE}><C /></MemoryRouter>);

beforeEach(() => { cleanup(); _resetCacheForTests?.(); setNextResponses({}); });
afterEach(() => { cleanup(); });

describe('every composer-reading public page reports a failed fetch', () => {
  it.each(PAGES)('%s surfaces the error', async (name, C) => {
    setNextResponses({ fuel_bills: { data: null, error: { message: 'rls denied' } } });
    mount(C);
    await waitFor(() => expect(screen.getByText(/Live data unavailable/i)).toBeTruthy());
    // Scope the scope-label assertion to the NOTICE, never getAllByText: these
    // pages say "Scope 1" in their prose, so a loosened query would go green
    // against a notice that named no scope at all.
    const notice = screen.getByText(/Live data unavailable/i);
    expect(notice.textContent).toMatch(/Scope 1/);
    expect(notice.textContent).toMatch(/rls denied/);
  });

  it.each(PAGES)('%s says nothing when the tables are merely empty', async (name, C) => {
    // An empty table is not a failure. This is the regression the fix must not
    // cause, and it is why the notice returns null rather than rendering an
    // "unknown" state.
    setNextResponses({});
    mount(C);
    await new Promise((r) => setTimeout(r, 120));
    expect(screen.queryByText(/Live data unavailable/i)).toBeNull();
  });

  it('shows ONE notice per page, not one per chart', async () => {
    // Executive renders several composer-reading charts. If the notice lived
    // on the chart rather than the page, a reader would see it repeated.
    setNextResponses({ fuel_bills: { data: null, error: { message: 'rls denied' } } });
    mount(Executive);
    await waitFor(() => expect(screen.getByText(/Live data unavailable/i)).toBeTruthy());
    expect(screen.getAllByText(/Live data unavailable/i)).toHaveLength(1);
  });
});
