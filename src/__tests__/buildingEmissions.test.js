// Unit tests for the per-building kWh + mtCO₂e roll-up that feeds
// the campus-map page. The math is small; tests pin down the
// annualization-from-coverage behavior (one building with 12 months
// shouldn't outweigh another with 2 months on apples-to-apples
// comparisons) and the share-percent total.

import { describe, it, expect } from 'vitest';
import { computeBuildingEmissions } from '../utils/buildingEmissions.js';

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
});

describe('computeBuildingEmissions — annualization', () => {
  it('scales a single-month reading up to 12 months', () => {
    const { rows } = computeBuildingEmissions({
      buildings: sampleBuildings,
      monthlyHistory: { a: { '2026-01': 1000 } },
    });
    const a = rows.find((r) => r.id === 'a');
    expect(a.annualKwh).toBe(12_000);   // 1 month × 12
    expect(a.monthsCovered).toBe(1);
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
  });
});

describe('computeBuildingEmissions — emissions math + intensity', () => {
  it('mtCO2e = annualKwh × 0.235 / 1000 by default', () => {
    const { rows } = computeBuildingEmissions({
      buildings: sampleBuildings,
      monthlyHistory: { a: { '2026-01': 1000, '2026-02': 1000 } },
      // 2 months × 1000 = 2000 measured. Annualized: (2000/2)*12 = 12,000.
    });
    const a = rows.find((r) => r.id === 'a');
    expect(a.annualKwh).toBe(12_000);
    expect(a.mtCO2e).toBeCloseTo(12_000 * 0.235 / 1000, 2);
  });

  it('honors an override kgPerKwh', () => {
    const { rows } = computeBuildingEmissions({
      buildings: sampleBuildings,
      monthlyHistory: { a: { '2026-01': 1000 } }, // 12,000 annualized
      kgPerKwh: 1.0,
    });
    const a = rows.find((r) => r.id === 'a');
    expect(a.mtCO2e).toBeCloseTo(12, 2);
  });

  it('intensity is kgCO2e / sqft / yr', () => {
    const { rows } = computeBuildingEmissions({
      buildings: sampleBuildings,
      monthlyHistory: { a: { '2026-01': 10_000 } }, // 120,000 annualized
    });
    const a = rows.find((r) => r.id === 'a');
    // 120,000 kWh × 0.235 = 28,200 kg, / 10,000 sqft = 2.82 kg/sqft/yr
    expect(a.kgPerSqft).toBeCloseTo(2.82, 1);
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

  it('exposes that month\'s raw kWh on monthKwh + annualizes to ×12 on annualKwh', () => {
    const r = computeBuildingEmissions({ buildings: sampleBuildings, monthlyHistory: history, month: '2026-02' });
    const a = r.rows.find((row) => row.id === 'a');
    expect(a.monthKwh).toBe(1500);
    expect(a.annualKwh).toBe(18_000);
  });

  it('returns 0 for a building with no data for the selected month', () => {
    const r = computeBuildingEmissions({ buildings: sampleBuildings, monthlyHistory: history, month: '2026-03' });
    const b = r.rows.find((row) => row.id === 'b');
    expect(b.monthKwh).toBe(0);
    expect(b.annualKwh).toBe(0);
    expect(b.mtCO2e).toBe(0);
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
    expect(totalKwh).toBe(24_000);
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
