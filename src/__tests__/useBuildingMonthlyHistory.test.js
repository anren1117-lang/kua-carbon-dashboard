// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const { setNextResponse, makeQueryHarness } = vi.hoisted(() => {
  let response = { data: [], error: null };
  const setNextResponse = (next) => { response = next; };
  const makeQueryHarness = () => {
    const builder = {
      select() { return builder; },
      order()  { return builder; },
      then(resolve, reject) { return Promise.resolve(response).then(resolve, reject); },
    };
    return { from: () => builder };
  };
  return { setNextResponse, makeQueryHarness };
});

vi.mock('../supabaseClient.js', () => ({ supabase: makeQueryHarness() }));

import { useBuildingMonthlyHistory, composeBuildingHistoryFromRows } from '../hooks/useBuildingMonthlyHistory.js';
import { invalidate as clearMeasuredCache } from '../hooks/measuredCache.js';
import { buildingMonthlyHistory } from '../data/monthlyConsumption.js';
import { SOURCE_BUILDING_MONTHLY } from '../data/buildingMonths.js';

const buildingRow = (building, month, kwh) => {
  const [y, m] = month.split('-').map(Number);
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return {
    id: `${building}-${month}`,
    period_start: `${month}-01`,
    period_end: `${month}-${String(last).padStart(2, '0')}`,
    building,
    kwh: String(kwh),
    data_quality: 'measured',
    source: SOURCE_BUILDING_MONTHLY,
    notes: null,
  };
};

beforeEach(() => { clearMeasuredCache(); setNextResponse({ data: [], error: null }); });
afterEach(() => { vi.clearAllMocks(); });

describe('useBuildingMonthlyHistory', () => {
  it('is exactly the static history when no admin rows exist', async () => {
    const { result } = renderHook(() => useBuildingMonthlyHistory());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.history).toEqual(buildingMonthlyHistory());
    expect(result.current.fromAdmin).toBe(false);
  });

  it('lets an admin month replace that building-month and leaves the others alone', async () => {
    setNextResponse({ data: [buildingRow('b_miller', '2026-01', 50000)], error: null });
    const { result } = renderHook(() => useBuildingMonthlyHistory());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const seed = buildingMonthlyHistory();
    expect(result.current.history.b_miller['2026-01']).toBe(50000);
    expect(seed.b_miller['2026-01']).not.toBe(50000);           // seed untouched
    expect(result.current.history.b_fitch['2026-01']).toBe(seed.b_fitch['2026-01']);
    expect(result.current.adminKeys.has('b_miller|2026-01')).toBe(true);
    expect(result.current.fromAdmin).toBe(true);
  });

  it('keeps the static history and reports the error when the table is unreachable', async () => {
    setNextResponse({ data: null, error: { message: 'relation does not exist' } });
    const { result } = renderHook(() => useBuildingMonthlyHistory());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toMatch(/does not exist/);
    expect(result.current.history).toEqual(buildingMonthlyHistory());
  });
});

describe('composeBuildingHistoryFromRows', () => {
  it('reports rows it could not use, without dropping them silently', () => {
    const out = composeBuildingHistoryFromRows([
      { ...buildingRow('b_miller', '2026-05', 1000), period_end: '2026-05-10' },
    ]);
    expect(out.ignoredRows).toHaveLength(1);
    expect(out.adminBuildingCount).toBe(0);
  });
});
