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
      limit()  { return builder; },
      then(resolve, reject) { return Promise.resolve(response).then(resolve, reject); },
    };
    return { from: () => builder };
  };
  return { setNextResponse, makeQueryHarness };
});

vi.mock('../supabaseClient.js', () => ({ supabase: makeQueryHarness() }));

import { useBmsExport, rowToExport } from '../hooks/useBmsExport.js';
import { invalidate as clearMeasuredCache } from '../hooks/measuredCache.js';
import { BMS_EXPORT_META as SEED_META } from '../data/bmsExportSep2026.js';

const storedRow = (overrides = {}) => ({
  id: 'row-1',
  source_file: 'MeterTrends_20261001_uploaded.csv',
  window_start: '2026-09-20T04:00:00.000Z',
  window_end: '2026-10-01T04:00:00.000Z',
  hours_covered: 264,
  meter_count: 2,
  summary: [
    { id: 'PM_01_MainFeed', totalKwh: 1200, peakKw: 30, avgKw: 5, hourly: Array(24).fill(5), daily: [], direction: 'consumption' },
    { id: 'PM_02_SolarFeed', totalKwh: 300, peakKw: 9, avgKw: 1, hourly: Array(24).fill(1), daily: [], direction: 'generation' },
  ],
  created_at: '2026-10-01T12:00:00.000Z',
  ...overrides,
});

beforeEach(() => { clearMeasuredCache(); setNextResponse({ data: [], error: null }); });
afterEach(() => { vi.clearAllMocks(); });

describe('useBmsExport', () => {
  it('uses the committed export when nothing has been uploaded', async () => {
    const { result } = renderHook(() => useBmsExport());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.meta.sourceFile).toBe(SEED_META.sourceFile);
    expect(result.current.fromUpload).toBe(false);
    expect(result.current.meters.length).toBe(SEED_META.meterCount);
  });

  it('prefers the newest uploaded window', async () => {
    setNextResponse({ data: [storedRow()], error: null });
    const { result } = renderHook(() => useBmsExport());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.fromUpload).toBe(true);
    expect(result.current.meta.sourceFile).toBe('MeterTrends_20261001_uploaded.csv');
    expect(result.current.meta.hoursCovered).toBe(264);
    expect(result.current.meters).toHaveLength(2);
  });

  it('keeps the committed export when the table is missing', async () => {
    setNextResponse({ data: null, error: { message: 'relation "bms_export_summaries" does not exist' } });
    const { result } = renderHook(() => useBmsExport());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.fromUpload).toBe(false);
    expect(result.current.meta.sourceFile).toBe(SEED_META.sourceFile);
    expect(result.current.error).toMatch(/does not exist/);
  });

  it('falls back rather than render an empty dashboard from a broken row', async () => {
    setNextResponse({ data: [storedRow({ summary: [] })], error: null });
    const { result } = renderHook(() => useBmsExport());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.fromUpload).toBe(false);
    expect(result.current.meters.length).toBe(SEED_META.meterCount);
  });
});

describe('rowToExport', () => {
  it('maps a stored row onto the shape the pages already consume', () => {
    const out = rowToExport(storedRow());
    expect(out.meta).toMatchObject({ hoursCovered: 264, meterCount: 2 });
    expect(out.meta.windowStartIso).toBe('2026-09-20T04:00:00.000Z');
    expect(out.meters[0].id).toBe('PM_01_MainFeed');
  });

  it('returns null for a row with no usable summary', () => {
    expect(rowToExport(null)).toBeNull();
    expect(rowToExport(storedRow({ summary: null }))).toBeNull();
    expect(rowToExport(storedRow({ summary: [] }))).toBeNull();
  });
});
