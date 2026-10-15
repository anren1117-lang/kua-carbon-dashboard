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

// A LATENT RACE IN THE HARNESS — fixed, and NOT the cause of the reported
// flake. Read the timeout note further down for that; this block was written
// claiming it was the cause, and the claim was wrong.
//
// What is real: `responses` is module-level mutable state that the ORIGINAL
// harness read inside `then()`, i.e. whenever the awaited promise happened to
// settle. The next test's `beforeEach` resets it to `{}`, so a promise settling
// a tick late read the FOLLOWING test's data and resolved with no error. A
// control below reproduces exactly that on demand, so it was a genuine bug
// worth closing.
//
// What was overclaimed: that this explained the observed failure. It never
// reproduced — four further full runs stayed green — and the actual signature
// (fails only in full runs, passes 6/6 in isolation) is explained by the
// waitFor budget equalling the whole test budget, which is a different bug in
// a different place. Demonstrating A mechanism is not the same as demonstrating
// THE mechanism, and "diagnosed" was the wrong word for it.
//
// Fixed anyway: captured at `from(table)` time, so each query is bound to the
// responses in force when the component actually issued it.
const { setNextResponses, makeQueryHarness } = vi.hoisted(() => {
  let responses = {};
  const setNextResponses = (next) => { responses = next; };
  const makeQueryHarness = () => {
    function makeBuilder(table) {
      // bound HERE, at query-construction time — not read at settle time
      const bound = responses[table] ?? { data: [], error: null };
      const p = {
        select() { return p; }, order() { return p; },
        limit() { return p; }, eq() { return p; },
        then(res, rej) { return Promise.resolve(bound).then(res, rej); },
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

// The harness fix, asserted. Without this the binding could be reverted to a
// settle-time read by any refactor and the flake would come back silently —
// which is exactly how a fix with no test behaves.
describe('the query harness binds responses at query time', () => {
  it('a query that settles LATE still sees its own test\'s response', async () => {
    const { supabase } = await import('../supabaseClient.js');
    setNextResponses({ fuel_bills: { data: null, error: { message: 'mine' } } });
    const q = supabase.from('fuel_bills').select();      // issued now
    setNextResponses({ fuel_bills: { data: [], error: null } });  // next test resets
    const got = await q;                                  // settles after
    expect(got.error, 'late settle read the next test\'s responses').toEqual({ message: 'mine' });
  });

  it('and an unrelated table still defaults cleanly', async () => {
    const { supabase } = await import('../supabaseClient.js');
    setNextResponses({ fuel_bills: { data: null, error: { message: 'x' } } });
    const got = await supabase.from('some_other_table').select();
    expect(got).toEqual({ data: [], error: null });
  });
});

describe('every composer-reading public page reports a failed fetch', () => {
  it.each(PAGES)('%s surfaces the error', async (name, C) => {
    setNextResponses({ fuel_bills: { data: null, error: { message: 'rls denied' } } });
    mount(C);
    // Explicit, generous timeout. The default is 1000ms, and these five pages
    // mount a lot of chart components under a parallel test runner — a timing
    // budget adequate on an idle machine and marginal on a loaded one.
    //
    // This is the one that actually explains the reported flake.
    //
    // AND THE TEST BUDGET HAS TO EXCEED THE waitFor BUDGET. This read
    // `{ timeout: 5000 }` while vite.config.js sets no `test` block, so
    // Vitest's default testTimeout of 5000ms applied — the wait was allowed
    // exactly as long as the whole test, leaving nothing for mounting five
    // pages of charts. Under full-suite parallel load the test hit Vitest's
    // limit and failed before waitFor could even report, which is why it only
    // ever flaked in a full run and passed 6/6 in isolation. The per-test
    // timeout below is the headroom; raising only one of the two numbers
    // reintroduces the flake.
    await waitFor(
      () => expect(screen.getByText(/Live data unavailable/i)).toBeTruthy(),
      { timeout: 5000 },
    );
    // Scope the scope-label assertion to the NOTICE, never getAllByText: these
    // pages say "Scope 1" in their prose, so a loosened query would go green
    // against a notice that named no scope at all.
    const notice = screen.getByText(/Live data unavailable/i);
    expect(notice.textContent).toMatch(/Scope 1/);
    expect(notice.textContent).toMatch(/rls denied/);
  }, 20000);

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
    // Same exposure as the sweep above and it still had the 1000ms default —
    // the fix for the flake was applied to one of the two waits in this file
    // and not the other. Executive is named here precisely BECAUSE it mounts
    // several composer-reading charts, so it is the slowest mount in the file.
    await waitFor(
      () => expect(screen.getByText(/Live data unavailable/i)).toBeTruthy(),
      { timeout: 5000 },
    );
    expect(screen.getAllByText(/Live data unavailable/i)).toHaveLength(1);
  }, 20000);
});
