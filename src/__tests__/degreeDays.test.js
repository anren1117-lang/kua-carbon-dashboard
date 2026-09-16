// Weather data, and the two ways it can quietly lie.
//
// One: a partial month compared against a whole-month normal. September 2026
// held 15 of 30 days when captured, so counting it would make the year look
// artificially mild — the same trap as half a metered month in buildingMonths.
//
// Two: normalizing against the wrong normals period. The NWS sheet for this
// station is still 1961–1990 and runs 6.3% higher than the current normals, so
// using it would inject the bias this module exists to remove.
//
// These tests mostly pin BEHAVIOUR. The exception is one test pinning the
// normals literals, because exactly one place should — those were verified
// against NCEI and ACIS independently, and if they drift, everything built on
// them drifts silently.

import { describe, it, expect } from 'vitest';
import {
  STATION,
  HDD_NORMAL_1991_2020,
  HDD_NORMAL_1961_1990,
  HDD_ACTUAL,
  hddNormal,
  hddActual,
  compareToNormal,
  monthlyComparison,
  weatherContextText,
  NORMALIZATION_READINESS,
  ACTUALS_SOURCE,
  NORMALS_SOURCE,
} from '../data/degreeDays.js';

describe('station and provenance', () => {
  it('names the station, its distance from campus, and the degree-day base', () => {
    expect(STATION.id).toBe('KLEB');
    expect(STATION.base).toBe(65);
    expect(STATION.milesFromCampus).toBeLessThan(25);
    expect(ACTUALS_SOURCE).toMatch(/ACIS/i);
    expect(NORMALS_SOURCE).toMatch(/1991.2020/);
  });

  it('covers all twelve months of normals', () => {
    for (let m = 1; m <= 12; m++) expect(hddNormal(m)).toBeGreaterThan(0);
    expect(hddNormal(0)).toBeNull();
    expect(hddNormal(13)).toBeNull();
  });

  it('pins the normals against the published NCEI values', () => {
    // Verified twice over: NCEI's 1991-2020 normals and ACIS agree month for
    // month. This is the one place that holds the literals.
    expect(HDD_NORMAL_1991_2020[1]).toBeCloseTo(1401.1, 1);
    expect(HDD_NORMAL_1991_2020[7]).toBeCloseTo(13.7, 1);
    expect(HDD_NORMAL_1991_2020[12]).toBeCloseTo(1184.2, 1);
    // 7333.5 exactly — deliberately NOT asserted through Math.round, which sits
    // on the half-way boundary here and would pass or fail on how the binary
    // float happens to land.
    const annual = Object.values(HDD_NORMAL_1991_2020).reduce((s, x) => s + x, 0);
    expect(annual).toBeCloseTo(7333.5, 0);
  });

  it('keeps the superseded period distinguishable and clearly warmer-biased', () => {
    const cur = Object.values(HDD_NORMAL_1991_2020).reduce((s, x) => s + x, 0);
    const old = Object.values(HDD_NORMAL_1961_1990).reduce((s, x) => s + x, 0);
    expect(old).toBeGreaterThan(cur);
    // Mind the denominator: the old sheet is 6.7% ABOVE today's normal, while
    // today's normal is 6.3% BELOW the old sheet. Same pair of numbers, two
    // different percentages — the kind of slip that makes a bias correction
    // itself biased.
    expect(((old - cur) / cur) * 100).toBeCloseTo(6.7, 1);
    expect(((cur - old) / old) * 100).toBeCloseTo(-6.3, 1);
  });
});

describe('partial months are excluded, not averaged in', () => {
  it('reports September 2026 as partial and refuses to return it as actual', () => {
    expect(HDD_ACTUAL[2026].partial).toContain(9);
    expect(hddActual(2026, 9)).toBeNull();
    expect(hddActual(2026, 8)).toBe(4);
  });

  it('leaves the partial month out of the year comparison', () => {
    const c = compareToNormal(2026);
    expect(c.monthsCompared).toBe(8);          // Jan-Aug, not Jan-Sep
    expect(c.monthsExcluded).toContain(9);
    // Normal for Jan-Aug only; September's 168.7 must not be in the denominator.
    expect(c.normalHdd).toBe(Math.round(
      [1, 2, 3, 4, 5, 6, 7, 8].reduce((s, m) => s + HDD_NORMAL_1991_2020[m], 0),
    ));
  });

  it('still surfaces the partial month in the month-by-month view, flagged', () => {
    const rows = monthlyComparison(2026);
    const sep = rows.find((r) => r.month === 9);
    expect(sep.partial).toBe(true);
    expect(sep.pctVsNormal).toBeNull();        // no misleading percentage
    expect(sep.actual).toBe(50);               // the raw reading is still shown
  });

  it('compares every whole month it does have', () => {
    const c2025 = compareToNormal(2025);
    expect(c2025.monthsCompared).toBe(12);
    expect(c2025.monthsExcluded).toEqual([]);
  });
});

describe('actual versus normal', () => {
  it('finds 2026 markedly milder than normal so far', () => {
    // Jan-Aug 2026 ran about 9% below normal — invisible on every page before
    // this module existed, and read as the school's own performance.
    const c = compareToNormal(2026);
    expect(c.pctVsNormal).toBeLessThan(-5);
    expect(c.pctVsNormal).toBeCloseTo(-9.1, 0);
  });

  it('finds 2025 mildly below normal across a full year', () => {
    const c = compareToNormal(2025);
    expect(c.actualHdd).toBe(6984);
    expect(c.pctVsNormal).toBeCloseTo(-4.8, 0);
  });

  it('returns null rather than a 0% that would read as "exactly normal"', () => {
    expect(compareToNormal(1999)).toBeNull();
    expect(monthlyComparison(1999)).toEqual([]);
    expect(weatherContextText(1999)).toBeNull();
  });

  it('describes direction in weather terms, never in energy terms', () => {
    const txt = weatherContextText(2026);
    expect(txt).toMatch(/milder/i);
    expect(txt).toMatch(/1991.2020/);
    // This module knows about weather, not consumption. It must not claim the
    // school used more or less energy — that inference belongs to the reader.
    expect(txt).not.toMatch(/\b(used|saved|efficien|consumption)\b/i);
  });
});

describe('normalized energy is deliberately not offered yet', () => {
  it('declares itself not ready, with a reason and a citation', () => {
    // A number that looks weather-normalized but is fitted to 9 months would be
    // worse than none. If someone flips this, it should be on purpose.
    expect(NORMALIZATION_READINESS.ready).toBe(false);
    expect(NORMALIZATION_READINESS.methodRequiresMonths).toBeGreaterThanOrEqual(12);
    expect(NORMALIZATION_READINESS.reason).toMatch(/month/i);
    expect(NORMALIZATION_READINESS.source).toMatch(/ENERGY STAR/i);
  });

  it('exports no normalization function to call by accident', async () => {
    const mod = await import('../data/degreeDays.js');
    const normalizers = Object.keys(mod).filter((k) => /normaliz/i.test(k) && typeof mod[k] === 'function');
    expect(normalizers).toEqual([]);
  });
});
