// @vitest-environment jsdom

// Tests for the live-measured-data hooks. Each hook is built around a
// supabase round-trip; we mock the client so the tests run hermetically
// without a real DB. The mock supports the chained `.from(...).select(...)`
// pattern the hooks use, and a parallel `.order(...).limit(...)` chain
// just in case any hook ever extends to ordered selects.
//
// What we're proving:
//   1. Initial render returns the synchronous placeholder so pages draw
//      immediately instead of flashing zeros.
//   2. After the supabase fetch resolves, the hook returns measured
//      values when rows exist or the placeholder when empty.
//   3. supabase errors don't crash the page — they surface as an
//      `error` field, the rest of the state stays sensible.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

// We control what `supabase.from(...)` returns from inside each test.
// vi.hoisted lets us share the harness across the vi.mock factory
// (which runs before imports) and the tests below.
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
          // Resolve to whatever the test set for this table; default to
          // empty data when unset so the hook treats it as "no rows".
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

// Imports must come AFTER vi.mock so the hook picks up the mock.
import { useMeasuredScope1 } from '../hooks/useMeasuredScope1.js';
import { useMeasuredScope3 } from '../hooks/useMeasuredScope3.js';
import { useMeasuredSinks } from '../hooks/useMeasuredSinks.js';
import { SCOPE1_TOTAL_MT, SCOPE3_TOTAL_MT } from '../data/scopeTotals.js';
import { ANNUAL_SEQUESTRATION_MT, TOTAL_FOREST_ACRES } from '../data/sinks.js';

beforeEach(() => {
  setNextResponses({});
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe('useMeasuredScope1', () => {
  it('returns placeholder on first paint (loading=true)', () => {
    const { result } = renderHook(() => useMeasuredScope1());
    expect(result.current.totalMt).toBe(SCOPE1_TOTAL_MT);
    expect(result.current.loading).toBe(true);
    expect(result.current.measured).toBe(false);
  });

  it('keeps placeholder when fuel_bills is empty', async () => {
    setNextResponses({ fuel_bills: { data: [], error: null } });
    const { result } = renderHook(() => useMeasuredScope1());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.totalMt).toBe(SCOPE1_TOTAL_MT);
    expect(result.current.provenance).toBe('estimated');
    expect(result.current.measured).toBe(false);
  });

  it('flips to measured when fuel_bills has rows', async () => {
    setNextResponses({
      fuel_bills: {
        data: [{ fuel_type: 'Heating Oil', gallons: 100000 }],
        error: null,
      },
    });
    const { result } = renderHook(() => useMeasuredScope1());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.measured).toBe(true);
    expect(result.current.provenance).toBe('measured');
    // 100,000 gal × 10.16 kg/gal = 1,016,000 kg = 1,016 mt heating
    // + fleet 54 + refrigerants 7 = ~1,077 mt
    expect(result.current.totalMt).toBeGreaterThan(1000);
    expect(result.current.totalMt).toBeLessThan(1100);
  });

  it('surfaces a Supabase error as state.error', async () => {
    setNextResponses({ fuel_bills: { data: null, error: { message: 'rls denied' } } });
    const { result } = renderHook(() => useMeasuredScope1());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toMatch(/rls/i);
    expect(result.current.measured).toBe(false);
    // Headline still has placeholder values so the page doesn't blank.
    expect(result.current.totalMt).toBe(SCOPE1_TOTAL_MT);
  });
});

describe('useMeasuredScope3', () => {
  it('returns placeholder on first paint', () => {
    const { result } = renderHook(() => useMeasuredScope3());
    expect(result.current.totalMt).toBe(SCOPE3_TOTAL_MT);
    expect(result.current.loading).toBe(true);
    expect(result.current.measured).toBe(false);
  });

  it('keeps placeholder when every table is empty', async () => {
    setNextResponses({
      day_students: { data: [], error: null },
      us_boarding_students: { data: [], error: null },
      international_students: { data: [], error: null },
      study_abroad: { data: [], error: null },
      faculty_travel: { data: [], error: null },
      waste: { data: [], error: null },
    });
    const { result } = renderHook(() => useMeasuredScope3());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.totalMt).toBe(SCOPE3_TOTAL_MT);
    expect(result.current.measured).toBe(false);
  });

  it('flips to measured when day_students has rows', async () => {
    setNextResponses({
      day_students: { data: [{ zip_code: '03753' }, { zip_code: '03781' }], error: null },
      us_boarding_students: { data: [], error: null },
      international_students: { data: [], error: null },
      study_abroad: { data: [], error: null },
      faculty_travel: { data: [], error: null },
      waste: { data: [], error: null },
    });
    const { result } = renderHook(() => useMeasuredScope3());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.measured).toBe(true);
    expect(result.current.provenance).toBe('measured');
    const travel = result.current.breakdown.find((b) => b.source.toLowerCase().includes('student travel'));
    expect(travel.provenance).toBe('measured');
    // 2 day × 1.4 mt = 2.8 → round 3 mt
    expect(travel.mt).toBe(3);
  });

  it('flips to measured when waste has rows', async () => {
    setNextResponses({
      day_students: { data: [], error: null },
      us_boarding_students: { data: [], error: null },
      international_students: { data: [], error: null },
      study_abroad: { data: [], error: null },
      faculty_travel: { data: [], error: null },
      waste: { data: [{ waste_type: 'Landfill', amount: 10, unit: 'tons' }], error: null },
    });
    const { result } = renderHook(() => useMeasuredScope3());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.measured).toBe(true);
    const wasteRow = result.current.breakdown.find((b) => b.source.toLowerCase() === 'waste');
    expect(wasteRow.provenance).toBe('measured');
  });

  it('surfaces an error from any of the six tables', async () => {
    setNextResponses({
      day_students: { data: [], error: null },
      us_boarding_students: { data: null, error: { message: 'connection refused' } },
      international_students: { data: [], error: null },
      study_abroad: { data: [], error: null },
      faculty_travel: { data: [], error: null },
      waste: { data: [], error: null },
    });
    const { result } = renderHook(() => useMeasuredScope3());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toMatch(/connection/i);
    expect(result.current.measured).toBe(false);
  });
});

describe('useMeasuredSinks', () => {
  it('returns hardcoded inventory on first paint (loading=true)', () => {
    const { result } = renderHook(() => useMeasuredSinks());
    expect(result.current.totalMt).toBe(Math.round(ANNUAL_SEQUESTRATION_MT));
    expect(result.current.acres).toBe(TOTAL_FOREST_ACRES);
    expect(result.current.loading).toBe(true);
    expect(result.current.measured).toBe(false);
    expect(Array.isArray(result.current.perStand)).toBe(true);
    expect(result.current.perStand.length).toBeGreaterThan(0);
  });

  it('keeps placeholder inventory when forest_stand_actuals is empty', async () => {
    setNextResponses({ forest_stand_actuals: { data: [], error: null } });
    const { result } = renderHook(() => useMeasuredSinks());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.totalMt).toBe(Math.round(ANNUAL_SEQUESTRATION_MT));
    expect(result.current.measured).toBe(false);
  });

  it('flips to measured when forest_stand_actuals has rows', async () => {
    setNextResponses({
      forest_stand_actuals: {
        data: [
          { stand_id: 'a', name: 'North',  acres: 100, mtco2e_acre_yr: 2.5 },  // 250
          { stand_id: 'b', name: 'South',  acres: 200, mtco2e_acre_yr: 3.0 },  // 600
        ],
        error: null,
      },
    });
    const { result } = renderHook(() => useMeasuredSinks());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.measured).toBe(true);
    expect(result.current.totalMt).toBe(850);
    expect(result.current.standCount).toBe(2);
    expect(result.current.acres).toBe(300);
    expect(result.current.perStand[0]).toMatchObject({ stand_id: 'a', name: 'North', mt: 250 });
  });

  it('surfaces a Supabase error as state.error', async () => {
    setNextResponses({ forest_stand_actuals: { data: null, error: { message: 'rls denied' } } });
    const { result } = renderHook(() => useMeasuredSinks());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toMatch(/rls/i);
    expect(result.current.measured).toBe(false);
  });
});
