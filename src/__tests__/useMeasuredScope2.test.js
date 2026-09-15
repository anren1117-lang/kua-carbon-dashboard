// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const { setNextResponse, makeQueryHarness } = vi.hoisted(() => {
  let response = { data: [], error: null };
  const setNextResponse = (next) => { response = next; };
  const makeQueryHarness = () => {
    const builder = {
      select() { return builder; },
      order() { return builder; },
      then(resolve, reject) { return Promise.resolve(response).then(resolve, reject); },
    };
    return { from: () => builder };
  };
  return { setNextResponse, makeQueryHarness };
});

vi.mock('../supabaseClient.js', () => ({ supabase: makeQueryHarness() }));

import { useMeasuredScope2, composeScope2FromRows } from '../hooks/useMeasuredScope2.js';
import { invalidate as clearMeasuredCache } from '../hooks/measuredCache.js';
import { GRID_MIX_ANNUAL_MTCO2E } from '../data/gridMix.js';
import { COMPOSED_YTD_AS_OF, COMPOSED_YEAR1_KWH } from '../data/composedYtd.js';

beforeEach(() => { clearMeasuredCache(); setNextResponse({ data: [], error: null }); });
afterEach(() => { vi.clearAllMocks(); });

const master = (month, kwh) => {
  const [y, m] = month.split('-').map(Number);
  const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return {
    id: `m-${month}`, period_start: `${month}-01`, period_end: `${month}-${lastDay}`, building: null,
    // PostgREST returns numeric columns as strings — pin that they still work.
    kwh: String(kwh), data_quality: 'measured', source: 'bms_master_monthly', notes: null,
  };
};

describe('useMeasuredScope2', () => {
  it('falls back to the seed composition when the table is empty', async () => {
    const { result } = renderHook(() => useMeasuredScope2());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.annualMt).toBe(GRID_MIX_ANNUAL_MTCO2E);
    expect(result.current.year1Kwh).toBe(COMPOSED_YEAR1_KWH);
    expect(result.current.asOf).toBe(COMPOSED_YTD_AS_OF);
    expect(result.current.fromAdmin).toBe(false);
  });

  it('lays an admin master-meter total over the seed', async () => {
    setNextResponse({ data: [master('2026-05', 120000)], error: null });
    const { result } = renderHook(() => useMeasuredScope2());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const may = result.current.ledger.months.find((m) => m.month === '2026-05');
    expect(may).toMatchObject({ provenance: 'master', kwh: 120000 });
    expect(result.current.fromAdmin).toBe(true);
    expect(result.current.adminMonthsUsed).toEqual(['2026-05']);
    expect(result.current.ledger.ranges.master).toBe('Jan–May');
  });

  it('keeps the seed and surfaces the error when Supabase fails', async () => {
    setNextResponse({ data: null, error: { message: 'relation does not exist' } });
    const { result } = renderHook(() => useMeasuredScope2());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toMatch(/does not exist/);
    expect(result.current.annualMt).toBe(GRID_MIX_ANNUAL_MTCO2E);
  });
});

describe('composeScope2FromRows', () => {
  it('reports rows it could not use', () => {
    const out = composeScope2FromRows([{ ...master('2026-05', 1), building: 'b_miller' }]);
    expect(out.ignoredRows).toHaveLength(1);
    expect(out.adminMonthsUsed).toEqual([]);
  });
});
