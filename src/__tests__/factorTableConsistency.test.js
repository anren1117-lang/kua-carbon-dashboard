// Two factor tables, one set of EPA figures, no link between them.
//
// emissionFactors.js holds 35 rows with `unit` and `year`. scopeTotals.js holds
// the bare scalars the composers actually consume. They agree — but nothing
// asserted that, and the units differ, which is exactly how I misread it:
// waste reads 0.639 kg/kg in one table and 0.58 mt/short-ton in the other, and
// I called that a contradiction before noticing emissionFactors.js:96 already
// documents the conversion ("x 1.10231"). A short ton is 907.185 kg, so
// 0.639 x 0.907185 = 0.5797 = 0.58. Same number, different denominator.
//
// If EPA publishes a new Table 9, whoever edits one table gets no signal that
// the other exists. This is that signal.

import { describe, it, expect } from 'vitest';
import { getFactorByKey } from '../data/emissionFactors.js';
import {
  FUEL_FACTORS_KG_PER_GAL,
  FLEET_FACTORS_KG_PER_GAL,
  WASTE_FACTORS_MT_PER_TON,
  REFRIGERANT_GWP100,
} from '../data/scopeTotals.js';

const KG_PER_SHORT_TON = 907.185;

// [emissionFactors category, subcategory, value the composers use, conversion]
const PAIRS = [
  ['fuel',        'heating_oil_no2', FUEL_FACTORS_KG_PER_GAL['Heating Oil'],  1],
  ['fuel',        'propane',         FUEL_FACTORS_KG_PER_GAL['Propane'],      1],
  ['fuel',        'gasoline',        FLEET_FACTORS_KG_PER_GAL['Gasoline'],    1],
  ['fuel',        'diesel',          FLEET_FACTORS_KG_PER_GAL['Diesel'],      1],
  ['refrigerant', 'r410a',           REFRIGERANT_GWP100['R-410A'],            1],
  ['refrigerant', 'r134a',           REFRIGERANT_GWP100['R-134a'],            1],
  // kg CO2e per kg  ->  metric tons CO2e per SHORT ton
  ['waste',       'landfill_mixed',  WASTE_FACTORS_MT_PER_TON.Landfill,       KG_PER_SHORT_TON / 1000],
  ['waste',       'recycling',       WASTE_FACTORS_MT_PER_TON.Recycling,      KG_PER_SHORT_TON / 1000],
  ['waste',       'compost_food',    WASTE_FACTORS_MT_PER_TON.Composting,     KG_PER_SHORT_TON / 1000],
];

describe('the two factor tables agree', () => {
  it.each(PAIRS)('%s/%s matches the composer factor', (cat, sub, composerValue, conv) => {
    const row = getFactorByKey(cat, sub);
    expect(row, `${cat}/${sub} missing from emissionFactors.js`).toBeTruthy();
    const expected = row.kgco2e_per_unit * conv;
    // 1% rather than exact: the composer values are rounded for display
    // (0.5797 -> 0.58). A real divergence is far larger than rounding.
    expect(Math.abs(expected - composerValue) / composerValue).toBeLessThan(0.01);
  });

  it('catches a divergence rather than matching anything', () => {
    // Guard against a comparison that would pass on any input.
    const row = getFactorByKey('waste', 'landfill_mixed');
    const wrong = row.kgco2e_per_unit * (KG_PER_SHORT_TON / 1000) * 1.2;
    expect(Math.abs(wrong - WASTE_FACTORS_MT_PER_TON.Landfill) / WASTE_FACTORS_MT_PER_TON.Landfill)
      .toBeGreaterThan(0.01);
  });

  it('every emissionFactors row carries a vintage, which the composer scalars do not', () => {
    // The asymmetry worth knowing: emissionFactors.js can say WHEN a factor is
    // from (food 2018 Poore & Nemecek, procurement 2022 EEIO, waste 2025 Hub);
    // the composer tables cannot. That is task #17 item 6.
    for (const [cat, sub] of PAIRS.map(([c, s]) => [c, s])) {
      expect(getFactorByKey(cat, sub).year, `${cat}/${sub}`).toBeGreaterThan(2000);
    }
  });
});
