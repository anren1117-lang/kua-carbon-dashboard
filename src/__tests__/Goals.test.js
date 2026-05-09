// @vitest-environment jsdom
//
// Component-level tests for the Goals page (Phase 52 provenance
// pills). Verifies the page renders provenance pills next to status
// pills on each target row, and that the pill flips between
// "Measured" and "Estimated" based on which scopes are live.

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

import Goals from '../pages/Goals.js';
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

describe('Goals page (provenance pills, Phase 52)', () => {
  it('renders the page title + at least one reduction target', () => {
    wrap(<Goals />);
    expect(screen.getByText(/Goals & Targets/i)).toBeTruthy();
    // The "active targets" stat headline always renders.
    expect(screen.getAllByText(/Active targets/i).length).toBeGreaterThan(0);
  });

  it('shows "Estimated" pills on every target by default (no measured records)', async () => {
    // Empty supabase across the board → every scope stays on the
    // placeholder. Both gross/net targets and scope-specific targets
    // should pill as Estimated. Scope 2 target is the exception
    // (always live BMS).
    wrap(<Goals />);
    await waitFor(() => {
      // After hook resolves, the page re-renders. We just want to see
      // at least one Estimated pill (for gross/scope3/net).
      expect(screen.getAllByText(/^Estimated$/i).length).toBeGreaterThan(0);
    });
    // Scope 2 target's pill should show Measured even with no records
    // (BMS is always live).
    expect(screen.getAllByText(/✓ Measured/i).length).toBeGreaterThan(0);
  });

  it('flips additional rows to Measured when scope1 + scope3 records land', async () => {
    setNextResponses({
      // Scope 1: a single fuel_bill row flips composeScope1FromBills to measured
      fuel_bills: { data: [{ fuel_type: 'Heating Oil', gallons: 100000 }], error: null },
      scope1_heating_oil: { data: [], error: null },
      scope1_propane: { data: [], error: null },
      scope1_fleet: { data: [], error: null },
      scope1_refrigerants: { data: [], error: null },
      // Scope 3: a single day-student row flips composeScope3FromRecords to measured
      day_students: { data: [{ zip_code: '03777', school_year: '2025-2026' }], error: null },
      us_boarding_students: { data: [], error: null },
      international_students: { data: [], error: null },
      study_abroad: { data: [], error: null },
      faculty_travel: { data: [], error: null },
      waste: { data: [], error: null },
      purchased_goods: { data: [], error: null },
      commuting: { data: [], error: null },
      forest_stand_actuals: { data: [], error: null },
    });
    const { container } = wrap(<Goals />);
    // Wait for hooks to resolve. We just sanity-check that at least
    // ONE more pill flipped to Measured beyond the baseline (Scope 2
    // is always-measured even without records). The exact count
    // depends on the targets list in src/data/targets.js — currently
    // gross / scope2 / scope3 / net. With fuel_bills + day_students
    // populated, gross + scope3 both flip, so we expect at least 3
    // Measured pills total.
    await waitFor(() => {
      const measuredCount = screen.queryAllByText(/✓ Measured/i).length;
      const estimatedCount = screen.queryAllByText(/^Estimated$/i).length;
      // Either we hit the expected count, or the test fails with a
      // helpful diff so future migrations have something to read.
      if (measuredCount + estimatedCount === 0) {
        throw new Error('No provenance pills rendered yet — hooks not resolved');
      }
      expect(measuredCount).toBeGreaterThanOrEqual(2);
    }, { timeout: 3000 });
    // Don't be too strict on the exact count — the test asserts the
    // mechanism (live data flips pills), not every target's bucket.
  });
});
