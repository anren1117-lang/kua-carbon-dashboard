// The vintage-aware exports on gridMix.js (Phase 391).
//
// gridMixHistory.test.js covers the published series. This covers what KUA's
// own module does with it — including the two functions that actually render
// on /scope-2 (zeroEmissionPercent, effectiveKgPerKwh), which previously had
// no test at all despite replacing two figures that had been wrong on the page.
//
// The first test here is the load-bearing one: Phase 391 promised to make the
// grid time-aware WITHOUT repricing the inventory, because the 390 mt headline
// is also targets.js's baseline and a costed REC recommendation. If that number
// moves, it must move deliberately, in a phase that says so.

import { describe, it, expect } from 'vitest';
import {
  composeGridMix,
  gridMix,
  GRID_MIX_ANNUAL_MTCO2E,
  RECONSTRUCTED_KG_PER_KWH,
  EGRID_REPORTING_KG_PER_KWH,
  FACTOR_RECONCILIATION,
  VINTAGE_GAP,
  scope2MtAtVintage,
  zeroEmissionPercent,
  effectiveKgPerKwh,
  KUA_USAGE_YEAR,
} from '../data/gridMix.js';

describe('the inventory was not repriced', () => {
  it('still reports 390 mtCO2e for the year', () => {
    expect(GRID_MIX_ANNUAL_MTCO2E).toBe(390);
  });

  it('still prices a kWh at the reconstruction, not the published rate', () => {
    // 0.234446 = the seven per-fuel rows weighted by mix share. Written as a
    // literal so a change to any row's factor or share fails here.
    expect(RECONSTRUCTED_KG_PER_KWH).toBeCloseTo(0.234446, 6);
    expect(effectiveKgPerKwh()).toBeCloseTo(0.2344, 4);
  });
});

describe('effectiveKgPerKwh', () => {
  it('matches the reconstruction for the real mix', () => {
    expect(effectiveKgPerKwh(gridMix)).toBeCloseTo(RECONSTRUCTED_KG_PER_KWH, 3);
  });

  it('returns 0 rather than NaN for an empty or zero-kWh set', () => {
    expect(effectiveKgPerKwh([])).toBe(0);
    expect(effectiveKgPerKwh(composeGridMix(0))).toBe(0);
    expect(Number.isNaN(effectiveKgPerKwh([]))).toBe(false);
  });
});

describe('zeroEmissionPercent', () => {
  it('counts only sources with a zero emission factor', () => {
    // Nuclear 23 + renewables 12 + hydro 6 = 41 of 100.23. Net imports are
    // excluded because their factor is 0.0003, not 0 — that is the definition
    // the stat card now states out loud, because the lessons teach ~48% by
    // counting imports as clean.
    expect(zeroEmissionPercent()).toBe(41);
  });

  it('is a property of the grid, not of how much KUA used', () => {
    expect(zeroEmissionPercent(composeGridMix(0))).toBe(41);
    expect(zeroEmissionPercent(composeGridMix(5_000_000))).toBe(41);
  });

  it('returns 0 rather than NaN for an empty set', () => {
    expect(zeroEmissionPercent([])).toBe(0);
  });
});

describe('scope2MtAtVintage', () => {
  it('prices the same kWh differently at each year of the grid', () => {
    const rows = scope2MtAtVintage(1_663_697);
    expect(rows.length).toBeGreaterThanOrEqual(4);
    const byYear = Object.fromEntries(rows.map((r) => [r.vintage, r.mtCO2e]));
    // The point of the whole phase: identical behaviour, different answer.
    expect(byYear[2019]).toBeCloseTo(372.6, 0);
    expect(byYear[2023]).toBeCloseTo(409.9, 0);
    expect(byYear[2023]).toBeGreaterThan(byYear[2019]);
  });

  it('returns vintages in ascending order with a citation on each', () => {
    const rows = scope2MtAtVintage(1_000_000);
    const years = rows.map((r) => r.vintage);
    expect(years).toEqual([...years].sort((a, b) => a - b));
    for (const r of rows) expect(r.source).toMatch(/eGRID/i);
  });

  it('returns an empty list for anything that is not a positive kWh', () => {
    for (const bad of [0, -5, NaN, undefined, null]) {
      expect(scope2MtAtVintage(bad)).toEqual([]);
    }
  });
});

describe('the reconciliation is published, not buried', () => {
  it('states that the published rate is above what this page reports', () => {
    expect(EGRID_REPORTING_KG_PER_KWH).toBeGreaterThan(RECONSTRUCTED_KG_PER_KWH);
    expect(FACTOR_RECONCILIATION.gapPct).toBeGreaterThan(0);
    expect(FACTOR_RECONCILIATION.gapPct).toBeCloseTo(5.1, 1);
  });

  it('names the vintage it is reconciling against', () => {
    expect(FACTOR_RECONCILIATION.vintage).toBe(VINTAGE_GAP.vintage);
    expect(FACTOR_RECONCILIATION.source).toMatch(/eGRID/i);
  });

  it('reports the factor as older than the usage it prices', () => {
    expect(VINTAGE_GAP.yearsStale).toBeGreaterThan(0);
    expect(VINTAGE_GAP.vintage).toBeLessThan(KUA_USAGE_YEAR);
  });
});

describe('composed rows carry a short label for tight layouts', () => {
  it('gives every row both a full source name and a short label', () => {
    for (const r of gridMix) {
      expect(typeof r.label).toBe('string');
      expect(r.label.length).toBeGreaterThan(0);
      expect(r.label.length).toBeLessThanOrEqual(r.source.length);
    }
  });
});
