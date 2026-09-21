// @vitest-environment jsdom
//
// useMeasuredScopeTotals composes FOUR hooks — scope1, scope2, scope3, sinks —
// each of which exposes an `error`. The composer OR-ed their `loading` flags
// and returned none of their errors. Seventeen consumers read that composer,
// including the two homepage components (NetEstimate, ScopeExplainer), so they
// could not surface a failure even if they tried: the information never
// reached them.
//
// The visible consequence: ScopeExplainer.js read `live.scope2Mt ||
// SCOPE2_TOTAL_MT`, so a Supabase failure fell back to the build-time constant
// and rendered it as though it were live. A failed fetch and an empty table
// are different facts — Phase 432 fixed that for Scope1/Scope3/Sinks; this is
// the same defect on the homepage, one layer down.
//
// Driven through the REAL error path (the liveErrorSurfaced.test.js harness),
// and asserted on the RENDERED DOM, not on a computed string: a page that
// computes a notice and never displays it is how PERIOD_RECONCILIATION shipped
// nowhere for two phases with a green test.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ROUTER_FUTURE } from './routerFuture.js';

const { setNextResponses, makeQueryHarness } = vi.hoisted(() => {
  let responses = {};
  const setNextResponses = (next) => { responses = next; };
  const makeQueryHarness = () => {
    function makeBuilder(table) {
      const promiseLike = {
        select() { return promiseLike; },
        order()  { return promiseLike; },
        limit()  { return promiseLike; },
        eq()     { return promiseLike; },
        then(resolve, reject) {
          return Promise.resolve(responses[table] ?? { data: [], error: null }).then(resolve, reject);
        },
      };
      return promiseLike;
    }
    return { from: (table) => makeBuilder(table) };
  };
  return { setNextResponses, makeQueryHarness };
});

vi.mock('../supabaseClient.js', () => ({ supabase: makeQueryHarness() }));

import { useMeasuredScopeTotals } from '../hooks/useMeasuredScopeTotals.js';
import { NetEstimate } from '../components/NetEstimate.js';
import { ScopeExplainer } from '../components/ScopeExplainer.js';
import { _resetCacheForTests } from '../hooks/measuredCache.js';

const mount = (C) => render(<MemoryRouter future={ROUTER_FUTURE}><C /></MemoryRouter>);

beforeEach(() => { cleanup(); _resetCacheForTests?.(); setNextResponses({}); });
afterEach(() => { cleanup(); });

describe('the composer passes its children\'s errors on', () => {
  it('exposes an error when a child hook fails', async () => {
    setNextResponses({ fuel_bills: { data: null, error: { message: 'rls denied' } } });
    const { result } = renderHook(() => useMeasuredScopeTotals());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeTruthy();
    expect(result.current.error).toMatch(/rls denied/);
  });

  it('names WHICH scope failed, not just that something did', async () => {
    setNextResponses({ waste: { data: null, error: { message: 'relation does not exist' } } });
    const { result } = renderHook(() => useMeasuredScopeTotals());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toMatch(/Scope 3/i);
  });

  it('reports every failing scope when more than one fails', async () => {
    setNextResponses({
      fuel_bills: { data: null, error: { message: 'boom one' } },
      forest_stand_actuals: { data: null, error: { message: 'boom two' } },
    });
    const { result } = renderHook(() => useMeasuredScopeTotals());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toMatch(/Scope 1/i);
    expect(result.current.error).toMatch(/Sinks/i);
  });

  it('is null when the tables are merely EMPTY — the other fact', async () => {
    // An empty table is not a failure. Warning about it would be its own lie.
    setNextResponses({});
    const { result } = renderHook(() => useMeasuredScopeTotals());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeNull();
  });
});

describe('the homepage tells a reader when the numbers are not live', () => {
  it('NetEstimate renders a notice on a failed fetch', async () => {
    setNextResponses({ fuel_bills: { data: null, error: { message: 'rls denied' } } });
    mount(NetEstimate);
    await waitFor(() => expect(screen.getByText(/Live data unavailable/i)).toBeTruthy());
  });

  it('ScopeExplainer renders a notice on a failed fetch', async () => {
    setNextResponses({ fuel_bills: { data: null, error: { message: 'rls denied' } } });
    mount(ScopeExplainer);
    await waitFor(() => expect(screen.getByText(/Live data unavailable/i)).toBeTruthy());
  });

  it('neither shouts when the tables are merely empty', async () => {
    setNextResponses({});
    mount(NetEstimate);
    await waitFor(() => expect(screen.queryByText(/Live data unavailable/i)).toBeNull());
  });
});
