// @vitest-environment jsdom
//
// A FAILED FETCH AND AN EMPTY TABLE ARE DIFFERENT FACTS.
//
// Scope1/Scope3/Sinks each read `live.error` only to negate isMeasured, so a
// Supabase failure rendered the bottom-up placeholder and told the reader
// nothing — identical to "no data has been entered yet". Phase 432 surfaces it.
//
// This drives the REAL error path (the useMeasuredScope.test.js pattern) and
// asserts the page RENDERS the notice. A source-level guard would pass against
// a page that computes the string and never displays it — which is exactly how
// PERIOD_RECONCILIATION shipped nowhere for two phases while its test was green.

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

import Scope1 from '../pages/Scope1.js';
import Scope3 from '../pages/Scope3.js';
import Sinks  from '../pages/Sinks.js';
import { _resetCacheForTests } from '../hooks/measuredCache.js';

const mount = (C) => render(
  <MemoryRouter future={ROUTER_FUTURE}><C /></MemoryRouter>
);

beforeEach(() => { cleanup(); _resetCacheForTests?.(); setNextResponses({}); });
afterEach(() => { cleanup(); });

describe('a failed fetch is reported, not silently swallowed', () => {
  it('Scope 1 tells the reader when the fetch failed', async () => {
    setNextResponses({ fuel_bills: { data: null, error: { message: 'rls denied' } } });
    mount(Scope1);
    await waitFor(() => expect(screen.getByText(/Live data unavailable/i)).toBeTruthy());
    expect(screen.getByText(/rls denied/i)).toBeTruthy();
  });

  it('Scope 3 tells the reader when the fetch failed', async () => {
    setNextResponses({ waste: { data: null, error: { message: 'relation does not exist' } } });
    mount(Scope3);
    await waitFor(() => expect(screen.getByText(/Live data unavailable/i)).toBeTruthy());
  });

  it('Sinks tells the reader when the fetch failed', async () => {
    setNextResponses({ forest_stand_actuals: { data: null, error: { message: 'rls denied' } } });
    mount(Sinks);
    await waitFor(() => expect(screen.getByText(/Live data unavailable/i)).toBeTruthy());
  });

  it('says NOTHING when the tables are merely empty — the other fact', async () => {
    // The regression this must not cause: an empty table is not a failure, and
    // showing a warning for it would be its own kind of lie.
    setNextResponses({});
    mount(Scope1);
    await waitFor(() => expect(screen.getByText(/preliminary estimate/i)).toBeTruthy());
    expect(screen.queryByText(/Live data unavailable/i)).toBeNull();
  });
});
