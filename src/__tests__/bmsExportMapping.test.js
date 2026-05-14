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
} from '../data/bmsExportMapping.js';

beforeEach(() => { localStorage.clear(); });

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
