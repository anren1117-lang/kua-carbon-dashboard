// @vitest-environment jsdom
//
// Unit tests for the BMS meter→building mapping layer. This is the
// bridge that flips a building's charts from estimated → measured, so
// the localStorage merge semantics (defaults under stored overrides)
// and the reverse lookup need to be exactly right.

import { describe, it, expect, beforeEach } from 'vitest';
import {
  DEFAULT_MAPPING, getBmsMeterMap, setBmsMeterMapping,
  clearBmsMeterMappings, metersForBuilding,
  hydrateBmsMeterMap, isBmsMeterMapShared, __setSharedMeterMap,
} from '../data/bmsExportMapping.js';

beforeEach(() => { localStorage.clear(); __setSharedMeterMap(null); });

describe('getBmsMeterMap', () => {
  it('returns the default mapping when localStorage is empty', () => {
    expect(getBmsMeterMap()).toEqual(DEFAULT_MAPPING);
  });

  it('returns a copy — mutating the result does not corrupt DEFAULT_MAPPING', () => {
    const map = getBmsMeterMap();
    map.PM_99_Injected = 'b_evil';
    expect(DEFAULT_MAPPING.PM_99_Injected).toBeUndefined();
    expect(getBmsMeterMap().PM_99_Injected).toBeUndefined();
  });

  it('merges stored overrides on top of the defaults', () => {
    setBmsMeterMapping('PM_03_MainFeed', 'b_miller');
    const map = getBmsMeterMap();
    expect(map.PM_03_MainFeed).toBe('b_miller');           // override
    expect(map.PM_17_BarnFieldhouseFeed).toBe('b_barnfield'); // still a default
  });

  it('lets a stored override replace a default value', () => {
    setBmsMeterMapping('PM_17_BarnFieldhouseFeed', 'b_somewhere_else');
    expect(getBmsMeterMap().PM_17_BarnFieldhouseFeed).toBe('b_somewhere_else');
  });

  it('falls back to defaults when localStorage holds corrupt JSON', () => {
    localStorage.setItem('kua_bms_meter_to_building_map', '{not valid json');
    expect(getBmsMeterMap()).toEqual(DEFAULT_MAPPING);
  });
});

describe('setBmsMeterMapping', () => {
  it('adds a new mapping', () => {
    setBmsMeterMapping('PM_50_Lab', 'b_lab');
    expect(getBmsMeterMap().PM_50_Lab).toBe('b_lab');
  });

  it('removes a mapping when given a falsy buildingId', () => {
    setBmsMeterMapping('PM_50_Lab', 'b_lab');
    setBmsMeterMapping('PM_50_Lab', '');
    // Override is gone; not a default, so it's absent entirely.
    expect(getBmsMeterMap().PM_50_Lab).toBeUndefined();
  });

  it('persists across calls (writes through to localStorage)', () => {
    setBmsMeterMapping('PM_60_Pool', 'b_pool');
    setBmsMeterMapping('PM_61_Kitchen', 'b_kitchen');
    const map = getBmsMeterMap();
    expect(map.PM_60_Pool).toBe('b_pool');
    expect(map.PM_61_Kitchen).toBe('b_kitchen');
  });
});

describe('clearBmsMeterMappings', () => {
  it('drops all overrides, leaving just the defaults', () => {
    setBmsMeterMapping('PM_03_MainFeed', 'b_miller');
    clearBmsMeterMappings();
    expect(getBmsMeterMap()).toEqual(DEFAULT_MAPPING);
  });
});

describe('shared mapping (bms_meter_map)', () => {
  const fakeClient = (rows, { fail = false } = {}) => {
    const calls = [];
    const builder = {
      select: () => Promise.resolve(fail ? { data: null, error: { message: 'relation does not exist' } } : { data: rows, error: null }),
      upsert: (row) => { calls.push(['upsert', row]); return Promise.resolve({ error: null }); },
      delete: () => ({ eq: (col, val) => { calls.push(['delete', val]); return Promise.resolve({ error: null }); },
                       neq: () => { calls.push(['deleteAll']); return Promise.resolve({ error: null }); } }),
    };
    return { from: () => builder, calls };
  };

  it('hydrates shared rows and reports how many landed', async () => {
    const c = fakeClient([{ meter_id: 'PM_03_MainFeed', building_id: 'b_miller' }]);
    const res = await hydrateBmsMeterMap(c);
    expect(res).toEqual({ ok: true, rows: 1 });
    expect(isBmsMeterMapShared()).toBe(true);
    expect(getBmsMeterMap().PM_03_MainFeed).toBe('b_miller');
  });

  it("keeps working on localStorage when the table isn't there", async () => {
    setBmsMeterMapping('PM_44_Shop', 'b_shop', fakeClient([]));
    const res = await hydrateBmsMeterMap(fakeClient(null, { fail: true }));
    expect(res.ok).toBe(false);
    expect(getBmsMeterMap().PM_44_Shop).toBe('b_shop');
  });

  it('lets a shared row win over this browser’s older edit', async () => {
    setBmsMeterMapping('PM_03_MainFeed', 'b_local_guess', fakeClient([]));
    await hydrateBmsMeterMap(fakeClient([{ meter_id: 'PM_03_MainFeed', building_id: 'b_agreed' }]));
    expect(getBmsMeterMap().PM_03_MainFeed).toBe('b_agreed');
  });

  // The share is fire-and-forget by design, so the caller isn't blocked on the
  // round-trip — let the microtasks run before asserting on it.
  const flush = () => new Promise((resolve) => { setTimeout(resolve, 0); });

  it('writes a new mapping through to the shared table', async () => {
    const c = fakeClient([]);
    setBmsMeterMapping('PM_50_Lab', 'b_lab', c);
    // Visible immediately, without waiting for the round-trip.
    expect(getBmsMeterMap().PM_50_Lab).toBe('b_lab');
    await flush();
    expect(c.calls).toEqual([['upsert', expect.objectContaining({ meter_id: 'PM_50_Lab', building_id: 'b_lab' })]]);
  });

  it('removes a mapping from the shared table too', async () => {
    const c = fakeClient([]);
    __setSharedMeterMap({ PM_50_Lab: 'b_lab' });
    setBmsMeterMapping('PM_50_Lab', '', c);
    expect(getBmsMeterMap().PM_50_Lab).toBeUndefined();
    await flush();
    expect(c.calls).toEqual([['delete', 'PM_50_Lab']]);
  });

  it('clears shared rows as well as local ones', () => {
    const c = fakeClient([]);
    __setSharedMeterMap({ PM_03_MainFeed: 'b_miller' });
    clearBmsMeterMappings(c);
    expect(getBmsMeterMap()).toEqual(DEFAULT_MAPPING);
  });
});

describe('metersForBuilding', () => {
  it('reverse-looks-up every meter mapped to a building', () => {
    // Two PM devices both pointing at b_kurth in the defaults.
    expect(metersForBuilding('b_kurth').sort())
      .toEqual(['PM_18_KurthResidenceMainFeed', 'PM_19_KurthDormMainFeed']);
  });

  it('includes overrides added at runtime', () => {
    setBmsMeterMapping('PM_03_MainFeed', 'b_kurth');
    expect(metersForBuilding('b_kurth')).toContain('PM_03_MainFeed');
  });

  it('returns [] for a building with no mapped meters', () => {
    expect(metersForBuilding('b_no_meters_here')).toEqual([]);
  });
});
