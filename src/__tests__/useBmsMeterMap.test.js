// @vitest-environment jsdom
//
// The mapping now arrives after first paint (shared-table hydration) and can
// change while a page is open (an admin edit). Pages memoize per-building rows
// against it, so the hook must hand out a NEW object identity exactly when the
// mapping changes — and the same one when it hasn't.

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBmsMeterMap } from '../hooks/useBmsMeterMap.js';
import {
  setBmsMeterMapping, clearBmsMeterMappings, __setSharedMeterMap, DEFAULT_MAPPING,
} from '../data/bmsExportMapping.js';

const noopClient = () => ({
  from: () => ({
    upsert: () => Promise.resolve({ error: null }),
    delete: () => ({ eq: () => Promise.resolve({ error: null }), neq: () => Promise.resolve({ error: null }) }),
    select: () => Promise.resolve({ data: [], error: null }),
  }),
});

beforeEach(() => { localStorage.clear(); __setSharedMeterMap(null); });

describe('useBmsMeterMap', () => {
  it('returns the current mapping and keeps one identity while nothing changes', () => {
    const { result, rerender } = renderHook(() => useBmsMeterMap());
    const first = result.current;
    expect(first.PM_17_BarnFieldhouseFeed).toBe(DEFAULT_MAPPING.PM_17_BarnFieldhouseFeed);
    rerender();
    expect(result.current).toBe(first);
  });

  it('re-renders with a new identity when shared rows hydrate', () => {
    const { result } = renderHook(() => useBmsMeterMap());
    const before = result.current;
    act(() => { __setSharedMeterMap({ PM_03_MainFeed: 'b_miller' }); });
    expect(result.current).not.toBe(before);
    expect(result.current.PM_03_MainFeed).toBe('b_miller');
  });

  it('re-renders when an admin maps or unmaps a meter', () => {
    const client = noopClient();
    const { result } = renderHook(() => useBmsMeterMap());
    act(() => { setBmsMeterMapping('PM_50_Lab', 'b_lab', client); });
    expect(result.current.PM_50_Lab).toBe('b_lab');
    act(() => { setBmsMeterMapping('PM_50_Lab', '', client); });
    expect(result.current.PM_50_Lab).toBeUndefined();
  });

  it('re-renders when every mapping is cleared', () => {
    const client = noopClient();
    const { result } = renderHook(() => useBmsMeterMap());
    act(() => { setBmsMeterMapping('PM_03_MainFeed', 'b_miller', client); });
    expect(result.current.PM_03_MainFeed).toBe('b_miller');
    act(() => { clearBmsMeterMappings(client); });
    expect(result.current).toEqual(DEFAULT_MAPPING);
  });
});
