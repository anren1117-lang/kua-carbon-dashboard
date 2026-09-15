// @vitest-environment jsdom
//
// The chain every migrated page depends on: an admin-entered master-meter
// month in scope2_meter_readings must move Scope 2 — and therefore gross and
// net — for every consumer of useMeasuredScopeTotals(). Without this, the
// dashboard can split-brain: /scope-2 moves while the donut, the homepage
// hero and the peer comparison keep the figures compiled into the release.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const { setNextResponses, makeQueryHarness } = vi.hoisted(() => {
  let responses = {};
  const setNextResponses = (next) => { responses = next; };
  const makeQueryHarness = () => {
    function makeBuilder(table) {
      const builder = {
        select() { return builder; },
        order()  { return builder; },
        limit()  { return builder; },
        eq()     { return builder; },
        then(resolve, reject) {
          return Promise.resolve(responses[table] ?? { data: [], error: null }).then(resolve, reject);
        },
      };
      return builder;
    }
    return { from: (table) => makeBuilder(table) };
  };
  return { setNextResponses, makeQueryHarness };
});

vi.mock('../supabaseClient.js', () => ({ supabase: makeQueryHarness() }));

import { useMeasuredScopeTotals } from '../hooks/useMeasuredScopeTotals.js';
import { invalidate as clearMeasuredCache } from '../hooks/measuredCache.js';
import { GRID_MIX_ANNUAL_MTCO2E } from '../data/gridMix.js';

const masterMonth = (month, kwh) => {
  const [y, m] = month.split('-').map(Number);
  const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return {
    id: `row-${month}`,
    period_start: `${month}-01`,
    period_end: `${month}-${lastDay}`,
    building: null,
    kwh: String(kwh),
    data_quality: 'measured',
    source: 'bms_master_monthly',
    notes: null,
  };
};

beforeEach(() => { clearMeasuredCache(); setNextResponses({}); });
afterEach(() => { vi.clearAllMocks(); });

describe('admin-entered electricity reaches the campus totals', () => {
  it('uses the seed Scope 2 when no admin rows exist', async () => {
    const { result } = renderHook(() => useMeasuredScopeTotals());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.scope2Mt).toBe(Math.round(GRID_MIX_ANNUAL_MTCO2E));
    expect(result.current.scope2FromAdmin).toBe(false);
    expect(result.current.grossMt).toBe(
      result.current.scope1Mt + result.current.scope2Mt + result.current.scope3Mt,
    );
  });

  it('moves Scope 2, gross and net when a master-meter month is entered', async () => {
    // A May master total far above the scaled figure it replaces (≈123,787 kWh).
    setNextResponses({ scope2_meter_readings: { data: [masterMonth('2026-05', 400000)], error: null } });
    const { result } = renderHook(() => useMeasuredScopeTotals());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.scope2FromAdmin).toBe(true);
    expect(result.current.scope2Mt).toBeGreaterThan(Math.round(GRID_MIX_ANNUAL_MTCO2E));
    // Gross and net stay internally consistent with the moved Scope 2.
    expect(result.current.grossMt).toBe(
      result.current.scope1Mt + result.current.scope2Mt + result.current.scope3Mt,
    );
    expect(result.current.netMt).toBe(result.current.grossMt - result.current.sinkMt);
  });
});
