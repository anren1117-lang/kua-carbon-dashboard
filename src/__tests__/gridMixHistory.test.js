// The grid's carbon intensity varies by year, and picking the right year is
// logic that can go wrong silently.
//
// These tests deliberately do NOT restate the vintage table back at itself —
// asserting `EGRID_NEWE[4].co2eLbPerMwh === 543.2` would pass for a typo'd
// table as readily as a correct one. What they pin is behaviour: selection,
// unit conversion against an independently computed value, internal
// consistency of each row, and that no vintage ships without a citation.

import { describe, it, expect } from 'vitest';
import {
  EGRID_NEWE,
  ISO_NE_ANNUAL,
  ISO_NE_MIX_NEL,
  vintageKgPerKwh,
  latestVintage,
  vintageForUsageYear,
  reportVintageGap,
  intensityChangePct,
  EGRID_LATEST_KG_PER_KWH,
} from '../data/gridMixHistory.js';

describe('eGRID NEWE vintage table', () => {
  it('holds a contiguous, ascending set of editions', () => {
    const years = EGRID_NEWE.map((v) => v.vintage);
    expect(years).toEqual([...years].sort((a, b) => a - b));
    expect(new Set(years).size).toBe(years.length);
    expect(years.length).toBeGreaterThanOrEqual(4);
    // Actually check contiguity — without this the test name was a promise the
    // assertions didn't keep, and a table of 2019/2020/2021/2099 would pass.
    for (let i = 1; i < years.length; i++) {
      expect(years[i] - years[i - 1], `gap between ${years[i - 1]} and ${years[i]}`).toBe(1);
    }
  });

  it('every row carries a citation and a plausible rate', () => {
    for (const v of EGRID_NEWE) {
      expect(v.source, `vintage ${v.vintage}`).toMatch(/eGRID/i);
      // New England has no coal fleet to speak of and no hydro dominance; a
      // rate outside this band means a transcription error, not a real grid.
      expect(v.co2eLbPerMwh, `vintage ${v.vintage}`).toBeGreaterThan(300);
      expect(v.co2eLbPerMwh, `vintage ${v.vintage}`).toBeLessThan(900);
      // CO2e includes CH4 and N2O, so it is always at or above bare CO2.
      expect(v.co2eLbPerMwh).toBeGreaterThanOrEqual(v.co2LbPerMwh);
    }
  });

  it('each resource mix sums to about 100% of generation', () => {
    for (const v of EGRID_NEWE) {
      const sum = Object.values(v.mix).reduce((s, x) => s + x, 0);
      expect(sum, `vintage ${v.vintage} mix sums to ${sum}`).toBeGreaterThan(99);
      expect(sum, `vintage ${v.vintage} mix sums to ${sum}`).toBeLessThan(101);
    }
  });

  it('converts lb/MWh to kg/kWh against an independently computed value', () => {
    // 543.2 lb/MWh × 0.45359237 kg/lb ÷ 1000 kWh/MWh = 0.24639 kg/kWh.
    // The literal is worked out by hand here, not read from the module.
    const v2023 = EGRID_NEWE.find((v) => v.vintage === 2023);
    expect(vintageKgPerKwh(v2023)).toBeCloseTo(0.24639, 5);
  });

  it('returns null for a row with no usable rate', () => {
    expect(vintageKgPerKwh(null)).toBeNull();
    expect(vintageKgPerKwh({ co2eLbPerMwh: 'nope' })).toBeNull();
  });
});

describe('choosing a vintage for a usage year', () => {
  it('costs a usage year at the newest edition published at or before it', () => {
    expect(vintageForUsageYear(2021).vintage).toBe(2021);
    expect(vintageForUsageYear(2022).vintage).toBe(2022);
  });

  it('holds the newest edition for a usage year that has outrun eGRID', () => {
    // eGRID lags roughly two years; 2026 usage has no 2026 edition to use.
    expect(vintageForUsageYear(2026).vintage).toBe(latestVintage().vintage);
    expect(vintageForUsageYear(2030).vintage).toBe(latestVintage().vintage);
  });

  it('falls back to the oldest edition rather than nothing for an early year', () => {
    const oldest = EGRID_NEWE[0].vintage;
    expect(vintageForUsageYear(2010).vintage).toBe(oldest);
  });

  it('never returns null, whatever it is handed', () => {
    for (const input of [undefined, null, NaN, 'abc', {}]) {
      expect(vintageForUsageYear(input)).toBeTruthy();
      expect(vintageForUsageYear(input).co2eLbPerMwh).toBeGreaterThan(0);
    }
  });

  it('reports how stale the factor is instead of hiding the lag', () => {
    // Literals, not `2026 - gap.vintage` — that restated the implementation and
    // would have passed for any vintage table.
    expect(reportVintageGap(2023).yearsStale).toBe(0);
    expect(reportVintageGap(2026).yearsStale).toBe(3);
    const gap = reportVintageGap(2026);
    expect(gap.usageYear).toBe(2026);
    expect(gap.kgPerKwh).toBeGreaterThan(0);
    expect(gap.source).toMatch(/eGRID/i);
  });
});

describe('intensity trend', () => {
  it('keeps 2019 flagged as the series minimum, so the window cannot be quoted as the trend', () => {
    // Guards against the cherry-pick this table invites. 2019 is the LOWEST
    // rate we hold — it was an unusually clean year — so "+10% since 2019" is
    // arithmetically true and rhetorically misleading. If a future edition ever
    // undercuts 2019, the framing in the file header needs revisiting too.
    const rates = EGRID_NEWE.map((v) => v.co2eLbPerMwh);
    const y2019 = EGRID_NEWE.find((v) => v.vintage === 2019).co2eLbPerMwh;
    expect(y2019).toBe(Math.min(...rates));
  });

  it('quantifies the 2019–2023 rise without letting it stand as the direction of travel', () => {
    const change = intensityChangePct(2019, 2023);
    expect(change).toBeGreaterThan(0);
    // Precision 1 (±0.05), not 0 (±0.5). The file stakes its headline on "+10%";
    // a ±0.5pp window would tolerate a 2.5 lb/MWh transcription error in the
    // 2023 row and still pass.
    expect(change).toBeCloseTo(10.0, 1);
  });

  it('agrees with the underlying mix shift it claims to explain', () => {
    const a = EGRID_NEWE.find((v) => v.vintage === 2019);
    const b = EGRID_NEWE.find((v) => v.vintage === 2023);
    expect(b.mix.nuclear).toBeLessThan(a.mix.nuclear);   // 29.8 → 22.6
    expect(b.mix.gas).toBeGreaterThan(a.mix.gas);        // 49.3 → 55.9
    expect(b.mix.solar).toBeGreaterThan(a.mix.solar);    // 1.5 → 3.6, and still not enough
  });

  it('returns null for a vintage it does not hold', () => {
    expect(intensityChangePct(1999, 2023)).toBeNull();
    expect(intensityChangePct(2019, 2099)).toBeNull();
  });
});

describe('ISO-NE operational series is kept separate from the reporting factor', () => {
  it('records both the generation-only and with-imports rates', () => {
    for (const row of ISO_NE_ANNUAL) {
      expect(row.withImportsLbPerMwh).toBeLessThan(row.generationLbPerMwh);
      expect(row.source).toMatch(/ISO-NE/i);
    }
  });

  it('stays a distinct number from the eGRID reporting factor', () => {
    // A reader comparing the two will notice they disagree; the gap is a
    // methodology difference, not an error, and the code should keep them
    // distinguishable rather than averaging them into one number.
    //
    // Asserts they differ and both stay plausible — NOT that ISO-NE's is the
    // higher of the two. That ordering is an observation about today's data,
    // not a law, and pinning it would fail on a future eGRID edition without
    // anything actually being wrong.
    const isone2024 = ISO_NE_ANNUAL.find((r) => r.year === 2024);
    const egrid = latestVintage().co2eLbPerMwh;
    expect(isone2024.withImportsLbPerMwh).not.toBe(egrid);
    expect(Math.abs(isone2024.withImportsLbPerMwh - egrid)).toBeLessThan(150);
  });

  it('keeps the ISO-NE %-of-load mix flagged as a different denominator', () => {
    expect(ISO_NE_MIX_NEL.shares.imports).toBeGreaterThan(0);
    // eGRID's generation mix has no imports column at all — that is the
    // difference that makes the two tables non-comparable line by line.
    for (const v of EGRID_NEWE) expect(v.mix.imports).toBeUndefined();
  });
});

describe('the exported convenience constant', () => {
  it('matches the latest vintage, so consumers cannot drift from the table', () => {
    expect(EGRID_LATEST_KG_PER_KWH).toBe(vintageKgPerKwh(latestVintage()));
  });

  it('is materially above the 0.235 the dashboard used to assume', () => {
    // The old home-made per-fuel reconstruction landed ~5% low against the
    // published rate. If this ever stops being true, the reconciliation in
    // gridMix.js needs revisiting.
    expect(EGRID_LATEST_KG_PER_KWH).toBeGreaterThan(0.235);
    expect(EGRID_LATEST_KG_PER_KWH).toBeLessThan(0.26);
  });
});
