// Unit tests for the core emission-factor math (emissions.js) and the
// roll-up helpers (aggregation.js). These are the functions every
// number on the dashboard ultimately flows through, so a regression
// here is a wrong headline figure — lock the arithmetic down.

import { describe, it, expect } from 'vitest';
import {
  quantityToKgCO2e, kgToMt, mtToKg, annualElectricityMt,
} from '../utils/emissions.js';
import {
  sumBy, kwhByBuilding, allocateByGridMix, buildingAnnualEmissionsMt,
  perStudentIntensity, perSqftIntensity, meterAnnualKwh,
  totalCampusElectricityKwh, campusKwhShareFactor,
} from '../utils/aggregation.js';
import { gridMix } from '../data/gridMix.js';
import { meters } from '../data/meters.js';

// ef_grid_isone_2024 is the canonical electricity factor.
const ISONE = 0.235; // kgCO2e per kWh

describe('quantityToKgCO2e', () => {
  it('multiplies quantity by the factor looked up by id', () => {
    const { kgco2e, factor } = quantityToKgCO2e({ quantity: 1000, factorId: 'ef_grid_isone_2024' });
    expect(kgco2e).toBeCloseTo(1000 * ISONE);
    expect(factor.id).toBe('ef_grid_isone_2024');
  });

  it('looks a factor up by category + subcategory', () => {
    const { kgco2e, factor } = quantityToKgCO2e({ quantity: 10, category: 'electricity', subcategory: 'isone_grid' });
    expect(factor.id).toBe('ef_grid_isone_2024');
    expect(kgco2e).toBeCloseTo(10 * ISONE);
  });

  it('returns { kgco2e: 0, factor: null } for an unknown factor', () => {
    expect(quantityToKgCO2e({ quantity: 999, factorId: 'ef_nonexistent' }))
      .toEqual({ kgco2e: 0, factor: null });
  });

  it('returns 0 kg for a zero quantity', () => {
    expect(quantityToKgCO2e({ quantity: 0, factorId: 'ef_grid_isone_2024' }).kgco2e).toBe(0);
  });
});

describe('kgToMt / mtToKg', () => {
  it('converts kg to metric tons', () => {
    expect(kgToMt(2500)).toBe(2.5);
  });
  it('converts metric tons to kg', () => {
    expect(mtToKg(2.5)).toBe(2500);
  });
  it('round-trips', () => {
    expect(kgToMt(mtToKg(7.3))).toBeCloseTo(7.3);
  });
});

describe('annualElectricityMt', () => {
  it('converts kWh to mtCO2e via the ISO-NE factor', () => {
    // 100,000 kWh × 0.235 kg / 1000 = 23.5 mt
    expect(annualElectricityMt(100_000)).toBeCloseTo(23.5);
  });
  it('is 0 for 0 kWh', () => {
    expect(annualElectricityMt(0)).toBe(0);
  });
});

describe('sumBy', () => {
  it('groups rows by key and sums the value extractor', () => {
    const rows = [
      { scope: 's1', mt: 10 },
      { scope: 's1', mt: 5 },
      { scope: 's2', mt: 3 },
    ];
    expect(sumBy(rows, (r) => r.scope, (r) => r.mt)).toEqual({ s1: 15, s2: 3 });
  });

  it('returns {} for no rows', () => {
    expect(sumBy([], (r) => r.k, (r) => r.v)).toEqual({});
  });
});

describe('kwhByBuilding', () => {
  it('sums only electricity readings, grouped by buildingId', () => {
    const readings = [
      { meterType: 'electricity', buildingId: 'b1', value: 100 },
      { meterType: 'electricity', buildingId: 'b1', value: 50 },
      { meterType: 'electricity', buildingId: 'b2', value: 200 },
      { meterType: 'gas',         buildingId: 'b1', value: 999 }, // ignored
    ];
    expect(kwhByBuilding(readings)).toEqual({ b1: 150, b2: 200 });
  });

  it('returns {} when there are no electricity readings', () => {
    expect(kwhByBuilding([{ meterType: 'gas', buildingId: 'b1', value: 10 }])).toEqual({});
  });
});

describe('allocateByGridMix', () => {
  it('splits a kWh total across grid sources by mixPercent', () => {
    const total = 1_000_000;
    const alloc = allocateByGridMix(total);
    expect(alloc).toHaveLength(gridMix.length);
    for (let i = 0; i < gridMix.length; i++) {
      expect(alloc[i].source).toBe(gridMix[i].source);
      expect(alloc[i].kwh).toBeCloseTo(total * (gridMix[i].mixPercent / 100));
      expect(alloc[i].mtCO2e).toBeCloseTo(alloc[i].kwh * gridMix[i].emissionFactor);
    }
  });

  it('allocates nothing when the total is 0', () => {
    expect(allocateByGridMix(0).every((a) => a.kwh === 0 && a.mtCO2e === 0)).toBe(true);
  });
});

describe('buildingAnnualEmissionsMt', () => {
  it('matches annualElectricityMt (same factor, same math)', () => {
    expect(buildingAnnualEmissionsMt(250_000)).toBeCloseTo(annualElectricityMt(250_000));
  });
});

describe('perStudentIntensity / perSqftIntensity', () => {
  it('divides total mt by student count', () => {
    expect(perStudentIntensity(1720, 344)).toBeCloseTo(5.0, 1);
  });
  it('returns 0 for a zero/falsy student count (no divide-by-zero)', () => {
    expect(perStudentIntensity(1720, 0)).toBe(0);
  });
  it('converts mt to kg then divides by sqft', () => {
    expect(perSqftIntensity(10, 5000)).toBe((10 * 1000) / 5000);
  });
  it('returns 0 for zero sqft', () => {
    expect(perSqftIntensity(10, 0)).toBe(0);
  });
});

describe('meter baseline helpers', () => {
  it('meterAnnualKwh returns the meter baseline for a known id', () => {
    const elec = meters.find((m) => m.type === 'electricity');
    expect(meterAnnualKwh(elec.id)).toBe(elec.annualBaselineValue);
  });

  it('meterAnnualKwh returns 0 for an unknown meter id', () => {
    expect(meterAnnualKwh('m_does_not_exist')).toBe(0);
  });

  it('totalCampusElectricityKwh sums only electricity meter baselines', () => {
    const expected = meters
      .filter((m) => m.type === 'electricity')
      .reduce((s, m) => s + m.annualBaselineValue, 0);
    expect(totalCampusElectricityKwh()).toBe(expected);
    expect(totalCampusElectricityKwh()).toBeGreaterThan(0);
  });

  it('campusKwhShareFactor is a positive number', () => {
    expect(campusKwhShareFactor()).toBeGreaterThan(0);
  });
});
