// Unit tests for the per-building kWh + mtCO₂e roll-up that feeds
// the campus-map page, /buildings/:id and /dorm-leaderboard.
//
// The central contract is SEASONAL annualization (Phase 390): measured kWh is
// divided by the share of the year those months represent, not multiplied by
// 12/monthsCovered. The expected numbers below come from the multipliers in
// seasonalPatterns.js, which sum to 11.55 — so January's share is
// 1.25/11.55 = 0.1082 and a single January of 1,000 kWh annualizes to 9,240,
// not 12,000.

import { describe, it, expect } from 'vitest';
import { computeBuildingEmissions } from '../utils/buildingEmissions.js';
import { seasonalYearFraction, seasonalShares, monthlyPattern } from '../data/seasonalPatterns.js';
import { KG_PER_KWH } from '../data/gridMix.js';

const sampleBuildings = [
  { id: 'a', name: 'A', category: 'Academic', sqft: 10_000, occupants: 100 },
  { id: 'b', name: 'B', category: 'Dorm',     sqft:  5_000, occupants:  20 },
  { id: 'c', name: 'C', category: 'Athletic', sqft:  8_000, occupants:  50 },
];

describe('computeBuildingEmissions — basics', () => {
  it('returns one row per building', () => {
    const { rows } = computeBuildingEmissions({
      buildings: sampleBuildings,
      monthlyHistory: {},
    });
    expect(rows).toHaveLength(3);
    expect(rows.map((r) => r.id).sort()).toEqual(['a', 'b', 'c']);
  });

  it('preserves building metadata (name, category, sqft, occupants)', () => {
    const { rows } = computeBuildingEmissions({
      buildings: sampleBuildings,
      monthlyHistory: {},
    });
    const a = rows.find((r) => r.id === 'a');
    expect(a).toMatchObject({ name: 'A', category: 'Academic', sqft: 10_000, occupants: 100 });
  });

  it('returns 0 emissions for buildings with no measured history', () => {
    const { rows } = computeBuildingEmissions({
      buildings: sampleBuildings,
      monthlyHistory: {},
    });
    expect(rows.every((r) => r.annualKwh === 0 && r.mtCO2e === 0)).toBe(true);
  });

  it('reports a year fraction of 0 — not 1 — when there is nothing to annualize from', () => {
    // A fraction of 1 would mean "this month IS the year"; 0 means "no basis".
    const { rows } = computeBuildingEmissions({ buildings: sampleBuildings, monthlyHistory: {} });
    expect(rows.every((r) => r.yearFraction === 0)).toBe(true);
  });
});

describe('seasonalYearFraction', () => {
  it('a full twelve months is exactly one year', () => {
    const all = Array.from({ length: 12 }, (_, i) => `2026-${String(i + 1).padStart(2, '0')}`);
    expect(seasonalYearFraction(all)).toBeCloseTo(1, 10);
  });

  it('weights a heating month above a summer month', () => {
    expect(seasonalYearFraction(['2026-01'])).toBeGreaterThan(seasonalYearFraction(['2026-07']));
  });

  it('shares sum to 1 and follow the published multipliers', () => {
    const shares = seasonalShares();
    expect(shares.reduce((s, x) => s + x, 0)).toBeCloseTo(1, 10);
    // Literals, not a recomputation of the implementation: January is 1.25 of
    // a 11.55 total, July 0.59. Recomputing the formula here would pass for any
    // multiplier table, including a transposed or mis-indexed one.
    expect(shares[0]).toBeCloseTo(0.1082, 4);
    expect(shares[6]).toBeCloseTo(0.0511, 4);
    expect(monthlyPattern[0].month).toBe('Jan');
    expect(monthlyPattern[6].month).toBe('Jul');
  });

  it('counts the same month of the same year once', () => {
    expect(seasonalYearFraction(['2026-01', '2026-01'])).toBeCloseTo(seasonalYearFraction(['2026-01']), 10);
  });

  it('counts the same month of two different years twice', () => {
    // Two Januaries measure two Januaries. Counting January's share once while
    // summing both readings would inflate the annual figure roughly twofold.
    expect(seasonalYearFraction(['2025-01', '2026-01']))
      .toBeCloseTo(2 * seasonalYearFraction(['2026-01']), 10);
  });

  it('ignores malformed keys instead of counting them', () => {
    expect(seasonalYearFraction(['nope', '2026-13', '', null, '2026-01']))
      .toBeCloseTo(seasonalYearFraction(['2026-01']), 10);
  });

  it('rejects an unpadded month key, and the roll-up rejects it identically', () => {
    // The two must agree: a key counted as coverage but rejected by the
    // fraction would report months measured beside an annual figure of zero.
    expect(seasonalYearFraction(['2026-1'])).toBe(0);
    const { rows } = computeBuildingEmissions({
      buildings: sampleBuildings,
      monthlyHistory: { a: { '2026-1': 5000, '2026-2': 5000 } },
    });
    const a = rows.find((r) => r.id === 'a');
    expect(a.monthsCovered).toBe(0);
    expect(a.annualKwh).toBe(0);
  });

  it('returns 0 for an empty or non-array input', () => {
    expect(seasonalYearFraction([])).toBe(0);
    expect(seasonalYearFraction(null)).toBe(0);
  });
});

describe('computeBuildingEmissions — seasonal annualization', () => {
  it('scales a single January by its share of the year, not by 12', () => {
    const { rows } = computeBuildingEmissions({
      buildings: sampleBuildings,
      monthlyHistory: { a: { '2026-01': 1000 } },
    });
    const a = rows.find((r) => r.id === 'a');
    expect(a.annualKwh).toBe(9_240);       // 1000 ÷ (1.25/11.55)
    expect(a.monthsCovered).toBe(1);
    expect(a.yearFraction).toBeCloseTo(0.108, 3);
  });

  it('does not over-extrapolate a full 12-month series', () => {
    const months = Object.fromEntries(
      Array.from({ length: 12 }, (_, i) => [`2026-${String(i + 1).padStart(2, '0')}`, 1000])
    );
    const { rows } = computeBuildingEmissions({
      buildings: sampleBuildings,
      monthlyHistory: { a: months },
    });
    const a = rows.find((r) => r.id === 'a');
    expect(a.annualKwh).toBe(12_000);
    expect(a.monthsCovered).toBe(12);
    expect(a.yearFraction).toBe(1);
  });

  it('averages across years instead of double-counting a repeated month', () => {
    // Two Januaries of 1,000 kWh is an average January of 1,000 — not 2,000.
    const { rows } = computeBuildingEmissions({
      buildings: sampleBuildings,
      monthlyHistory: { a: { '2025-01': 1000, '2026-01': 1000 } },
    });
    expect(rows.find((r) => r.id === 'a').annualKwh).toBe(9_240);
  });

  it('ignores a zero or negative reading rather than counting it as coverage', () => {
    const { rows } = computeBuildingEmissions({
      buildings: sampleBuildings,
      monthlyHistory: { a: { '2026-01': 1000, '2026-02': 0, '2026-03': -50 } },
    });
    const a = rows.find((r) => r.id === 'a');
    expect(a.monthsCovered).toBe(1);
    expect(a.annualKwh).toBe(9_240);
  });

  it('THE BUG: two dorms with identical usage must not be ranked by which month was entered', () => {
    // NOTE the assumption under this expectation: the divisor is the CAMPUS
    // seasonal shape. It is right for a building that swings like the campus,
    // and wrong in a known direction for one that doesn't — a dorm empty all
    // summer, or a gym running summer camps. See the limitation note in
    // buildingEmissions.js. What the numbers below pin down is that the two
    // months are no longer treated as interchangeable, not that 19,576 is the
    // true year for every building type.
    // Same building, same 1,000 kWh in a month. Under the old flat rule both
    // annualized to 12,000 and the dorms tied. They should not tie: 1,000 kWh
    // in July is a much heavier year than 1,000 kWh in January.
    const jan = computeBuildingEmissions({
      buildings: sampleBuildings, monthlyHistory: { a: { '2026-01': 1000 } },
    }).rows.find((r) => r.id === 'a');
    const jul = computeBuildingEmissions({
      buildings: sampleBuildings, monthlyHistory: { a: { '2026-07': 1000 } },
    }).rows.find((r) => r.id === 'a');

    expect(jan.annualKwh).toBe(9_240);
    expect(jul.annualKwh).toBe(19_576);
    expect(jul.annualKwh / jan.annualKwh).toBeCloseTo(2.12, 1);
  });

  it('a building measured only in winter does not outrank an identical one measured all year', () => {
    // Both use 1,000 kWh in every month of the year. One has only January
    // recorded. Their annualized figures should agree closely — that is the
    // whole point of weighting by season.
    const allMonths = Object.fromEntries(
      Array.from({ length: 12 }, (_, i) => [`2026-${String(i + 1).padStart(2, '0')}`, 1000])
    );
    // January's true usage for such a building is 1.25/0.9625 = 1.299× the
    // average month, i.e. 1,298.7 kWh — so that is what a January-only record
    // would actually contain. Written as a literal on purpose: deriving it from
    // seasonalShares() would assert x·s/s = x, an identity true of any share
    // table, and would pass even if the months were transposed.
    const janOnly = { '2026-01': 1_298.7 };
    const { rows } = computeBuildingEmissions({
      buildings: sampleBuildings,
      monthlyHistory: { a: allMonths, b: janOnly },
    });
    const a = rows.find((r) => r.id === 'a');
    const b = rows.find((r) => r.id === 'b');
    expect(b.annualKwh).toBeCloseTo(a.annualKwh, -1);
  });
});

describe('computeBuildingEmissions — emissions math + intensity', () => {
  it('mtCO2e = annualKwh x the canonical grid factor / 1000', () => {
    const { rows } = computeBuildingEmissions({
      buildings: sampleBuildings,
      monthlyHistory: { a: { '2026-01': 1000, '2026-02': 1000 } },
      // 2000 measured over Jan+Feb = (1.25+1.19)/11.55 = 0.2113 of the year.
    });
    const a = rows.find((r) => r.id === 'a');
    expect(a.annualKwh).toBe(9_467);
    // Derived, not pinned: task #5 moved the canonical factor from the
    // per-fuel reconstruction (0.2344) to EPA's published rate (0.2464),
    // and this assertion should follow it rather than restate a literal.
    expect(a.mtCO2e).toBeCloseTo((9_467 * KG_PER_KWH) / 1000, 2);
  });

  it('honors an override kgPerKwh', () => {
    const { rows } = computeBuildingEmissions({
      buildings: sampleBuildings,
      monthlyHistory: { a: { '2026-01': 1000 } }, // 9,240 annualized
      kgPerKwh: 1.0,
    });
    const a = rows.find((r) => r.id === 'a');
    // Deliberately NOT derived from KG_PER_KWH: the point of this case is that
    // the override replaces the canonical factor, so 9,240 kWh x 1.0 = 9.24 mt
    // whatever the canonical factor happens to be.
    expect(a.mtCO2e).toBeCloseTo(9.24, 2);
  });

  it('intensity is kgCO2e / sqft / yr', () => {
    const { rows } = computeBuildingEmissions({
      buildings: sampleBuildings,
      monthlyHistory: { a: { '2026-01': 10_000 } }, // 92,400 annualized
    });
    const a = rows.find((r) => r.id === 'a');
    // 92,400 kWh x the canonical factor / 10,000 sqft. Derived so it tracks
    // the factor: this read 2.17 on the reconstruction and 2.28 on the
    // published rate adopted in task #5.
    expect(a.kgPerSqft).toBeCloseTo((92_400 * KG_PER_KWH) / 10_000, 1);
  });

  it('intensity is 0 for a zero-sqft building (no divide-by-zero)', () => {
    const { rows } = computeBuildingEmissions({
      buildings: [{ id: 'x', name: 'X', category: 'Other', sqft: 0, occupants: 1 }],
      monthlyHistory: { x: { '2026-01': 1000 } },
    });
    expect(rows[0].kgPerSqft).toBe(0);
  });
});

describe('computeBuildingEmissions — month filter', () => {
  const history = {
    a: { '2026-01': 1000, '2026-02': 1500, '2026-03': 800 },
    b: { '2026-01':  500, '2026-02':  600 }, // no March data
    c: {},                                   // no data at all
  };

  it('returns mode: "annualized" when no month is set', () => {
    const r = computeBuildingEmissions({ buildings: sampleBuildings, monthlyHistory: history });
    expect(r.mode).toBe('annualized');
    expect(r.selectedMonth).toBeNull();
  });

  it('returns mode: "monthly" with the picked month when filter is set', () => {
    const r = computeBuildingEmissions({ buildings: sampleBuildings, monthlyHistory: history, month: '2026-02' });
    expect(r.mode).toBe('monthly');
    expect(r.selectedMonth).toBe('2026-02');
  });

  it('exposes the raw kWh and annualizes it by February\'s share of the year', () => {
    const r = computeBuildingEmissions({ buildings: sampleBuildings, monthlyHistory: history, month: '2026-02' });
    const a = r.rows.find((row) => row.id === 'a');
    expect(a.monthKwh).toBe(1500);
    expect(a.annualKwh).toBe(14_559);   // 1500 ÷ (1.19/11.55)
  });

  it('keeps one month comparable to another — the reason the colour scale works', () => {
    // The same building using an average-shaped year: whichever month the
    // viewer picks, the annualized figure should land in the same place.
    // Literal readings for a 120,000 kWh/yr building following the published
    // shape: January 120,000 × 1.25/11.55 = 12,987, July × 0.59/11.55 = 6,130.
    // Generating these from seasonalShares() would make the assertion circular.
    const even = { a: { '2026-01': 12_987, '2026-07': 6_130 } };
    const jan = computeBuildingEmissions({ buildings: sampleBuildings, monthlyHistory: even, month: '2026-01' })
      .rows.find((r) => r.id === 'a');
    const jul = computeBuildingEmissions({ buildings: sampleBuildings, monthlyHistory: even, month: '2026-07' })
      .rows.find((r) => r.id === 'a');
    expect(jan.annualKwh).toBeCloseTo(120_000, -2);
    expect(jul.annualKwh).toBeCloseTo(120_000, -2);
  });

  it('returns 0 for a building with no data for the selected month', () => {
    const r = computeBuildingEmissions({ buildings: sampleBuildings, monthlyHistory: history, month: '2026-03' });
    const b = r.rows.find((row) => row.id === 'b');
    expect(b.monthKwh).toBe(0);
    expect(b.annualKwh).toBe(0);
    expect(b.mtCO2e).toBe(0);
    expect(b.yearFraction).toBe(0);
  });

  it('ignores a malformed month string and falls back to annualized mode', () => {
    const r = computeBuildingEmissions({ buildings: sampleBuildings, monthlyHistory: history, month: 'not-a-month' });
    expect(r.mode).toBe('annualized');
    expect(r.selectedMonth).toBeNull();
  });

  it('exposes the sorted list of available months', () => {
    const r = computeBuildingEmissions({ buildings: sampleBuildings, monthlyHistory: history });
    expect(r.availableMonths).toEqual(['2026-01', '2026-02', '2026-03']);
  });
});

describe('computeBuildingEmissions — totals + share', () => {
  it('sharePercent sums to ~100 when buildings have measured data', () => {
    const { rows, totalKwh } = computeBuildingEmissions({
      buildings: sampleBuildings,
      monthlyHistory: {
        a: { '2026-01': 1000 },
        b: { '2026-01':  500 },
        c: { '2026-01':  500 },
      },
    });
    const sumShare = rows.reduce((s, r) => s + r.sharePercent, 0);
    expect(sumShare).toBeGreaterThanOrEqual(99);
    expect(sumShare).toBeLessThanOrEqual(101);
    expect(totalKwh).toBe(18_480);   // 9,240 + 4,620 + 4,620
  });

  it('share is unaffected by the annualization rule when coverage is equal', () => {
    // Every building measured over the same months: seasonal weighting cancels
    // out of the ratio, so relative standings are untouched. This is why the
    // leaderboard was safe until admin entry made coverage uneven.
    const { rows } = computeBuildingEmissions({
      buildings: sampleBuildings,
      monthlyHistory: {
        a: { '2026-01': 2000 }, b: { '2026-01': 1000 }, c: { '2026-01': 1000 },
      },
    });
    expect(rows.find((r) => r.id === 'a').sharePercent).toBeCloseTo(50, 1);
  });

  it('share is 0% across the board when nothing has data', () => {
    const { rows } = computeBuildingEmissions({
      buildings: sampleBuildings,
      monthlyHistory: {},
    });
    expect(rows.every((r) => r.sharePercent === 0)).toBe(true);
  });

  it('counts distinct months across all buildings', () => {
    const { monthsObserved } = computeBuildingEmissions({
      buildings: sampleBuildings,
      monthlyHistory: {
        a: { '2026-01': 1, '2026-02': 1 },
        b: { '2026-02': 1, '2026-03': 1 },
      },
    });
    expect(monthsObserved).toBe(3);
  });
});
