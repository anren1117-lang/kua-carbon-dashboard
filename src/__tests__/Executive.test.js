// @vitest-environment jsdom
//
// Component-level tests for the Executive page. Covers two Phase
// outcomes from this session:
//   - Phase 41: Scope 3 cohort breakdown row appears under the
//     Scope 3 ScopeRow when scope3CohortDetail is populated.
//   - Phase 54: per-scope measured/estimated pill on each ScopeRow
//     mirrors the live measured state.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const { setNextResponses, makeQueryHarness } = vi.hoisted(() => {
  let responses = {};
  const setNextResponses = (next) => { responses = next; };
  const makeQueryHarness = () => {
    function makeBuilder(table) {
      const promiseLike = {
        select() { return promiseLike; },
        order() { return promiseLike; },
        limit() { return promiseLike; },
        eq()    { return promiseLike; },
        then(resolve, reject) {
          const r = responses[table] ?? { data: [], error: null };
          return Promise.resolve(r).then(resolve, reject);
        },
      };
      return promiseLike;
    }
    return { from: (table) => makeBuilder(table) };
  };
  return { setNextResponses, makeQueryHarness };
});

vi.mock('../supabaseClient.js', () => ({ supabase: makeQueryHarness() }));

import Executive from '../pages/Executive.js';
import { _resetCacheForTests } from '../hooks/measuredCache.js';

beforeEach(() => {
  cleanup();
  setNextResponses({});
  _resetCacheForTests();
});
afterEach(() => {
  vi.restoreAllMocks();
});

function wrap(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('Executive page', () => {
  it('renders the headline scope rows + Scope 2 always-measured pill', async () => {
    wrap(<Executive />);
    // Each scope row's label should be visible.
    expect(screen.getByText(/Scope 1 — direct/i)).toBeTruthy();
    expect(screen.getByText(/Scope 2 — purchased electricity/i)).toBeTruthy();
    expect(screen.getByText(/Scope 3 — travel/i)).toBeTruthy();
    expect(screen.getByText(/Sinks — forest sequestration/i)).toBeTruthy();
    // Scope 2 is always measured (BMS) even with no admin records,
    // so its pill renders on first paint.
    expect(screen.getAllByText(/✓ measured/i).length).toBeGreaterThanOrEqual(1);
  });

  it('flips Scope 1 + Scope 3 pills to ✓ measured when records land', async () => {
    setNextResponses({
      fuel_bills: { data: [{ fuel_type: 'Heating Oil', gallons: 100000 }], error: null },
      scope1_heating_oil: { data: [], error: null },
      scope1_propane: { data: [], error: null },
      scope1_fleet: { data: [], error: null },
      scope1_refrigerants: { data: [], error: null },
      day_students: { data: [{ zip_code: '03777', school_year: '2025-2026' }, { zip_code: '03777', school_year: '2025-2026' }], error: null },
      us_boarding_students: { data: [], error: null },
      international_students: { data: [], error: null },
      study_abroad: { data: [], error: null },
      faculty_travel: { data: [], error: null },
      waste: { data: [], error: null },
      purchased_goods: { data: [], error: null },
      commuting: { data: [], error: null },
      forest_stand_actuals: { data: [], error: null },
    });
    wrap(<Executive />);
    // After live data lands: Scope 1 + Scope 2 + Scope 3 all
    // measured = at least 3 ScopeRow pills. (Sinks stays estimated;
    // forest_stand_actuals is empty.)
    await waitFor(() => {
      expect(screen.getAllByText(/✓ measured/i).length).toBeGreaterThanOrEqual(3);
    }, { timeout: 3000 });
  });

  it('renders the cohort breakdown micro-row when scope3CohortDetail is populated', async () => {
    setNextResponses({
      day_students: { data: [{ zip_code: '03777', school_year: '2025-2026' }], error: null },
      us_boarding_students: { data: [], error: null },
      international_students: { data: [], error: null },
      study_abroad: { data: [], error: null },
      faculty_travel: { data: [], error: null },
      waste: { data: [], error: null },
      purchased_goods: { data: [], error: null },
      commuting: { data: [], error: null },
    });
    wrap(<Executive />);
    // Phase 41's micro-row label "Scope 3 breakdown · live" only
    // renders when scope3Measured && cohortDetail.length > 0.
    await waitFor(() => {
      expect(screen.queryByText(/Scope 3 breakdown · live/i)).not.toBeNull();
    }, { timeout: 3000 });
    // Cohort labels render: Day students, US boarders, International boarders, Study abroad + faculty trips
    expect(screen.getByText(/Day students/i)).toBeTruthy();
  });
});
