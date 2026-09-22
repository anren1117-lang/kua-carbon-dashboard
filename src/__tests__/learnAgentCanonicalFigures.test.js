// Four LearnAgent figures that disagree with the values the dashboard
// publishes, or with physics. Each is stated to students as fact.
//
//   Grid mix    "Renewables ~14%, Net imports ~12%" — gridMix gives 12% and
//               7%, with hydro as its own 6% row. LearnAgent:441 states the
//               mix correctly.
//   Driving     "1,000 miles = 400 kg" — ef_car_avg is 0.2986 kg/mi, so 299
//               kg. 400 g/mi is the EPA figure Phase 406 retired.
//   Electricity "current 2.3M kWh" — the Year-1 projection behind
//               SCOPE2_TOTAL_MT is ~1.66M kWh. Stated correctly at :441.
//   Volume      "one metric ton of CO2 would fill a sphere about 8 meters
//               across" — 1 t at 25 degC is 556 m3, a sphere ~10.2 m across.
//               An 8 m sphere holds about half a tonne.
//
// Every assertion derives from the canonical module or from the gas law, so a
// reprice moves the lesson rather than stranding it.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getFactorByKey } from '../data/emissionFactors.js';
import { SCOPE2_TOTAL_MT } from '../data/scopeTotals.js';
import { KG_PER_KWH, gridMix } from '../data/gridMix.js';

const src = readFileSync(resolve(process.cwd(), 'components/LearnAgent.js'), 'utf8');
const pct = (label) => gridMix.find((r) => new RegExp(label, 'i').test(r.label || r.source)).mixPercent;

describe('LearnAgent figures match the dashboard', () => {
  it('the grid mix shares are the canonical ones', () => {
    expect(Math.round(pct('Renewables'))).toBe(12);
    expect(Math.round(pct('imports'))).toBe(7);
    expect(src).not.toMatch(/Renewables \(solar\/wind\/biomass\): ~14%/);
    expect(src).not.toMatch(/Net imports \(mostly Canadian hydro\): ~12%/);
  });

  it('driving 1,000 miles uses the canonical car factor', () => {
    const kg = Math.round(getFactorByKey('travel', 'passenger_car_avg').kgco2e_per_unit * 1000);
    expect(kg).toBe(299);
    expect(src).not.toMatch(/1,000 miles ≈ 400 kg/);
    expect(src).toMatch(new RegExp(`1,000 miles ≈ ~?${kg} kg`));
  });

  it('KUA electricity is the Year-1 projection, not 2.3M kWh', () => {
    const kwh = Math.round((SCOPE2_TOTAL_MT * 1000) / KG_PER_KWH);
    expect(kwh).toBeGreaterThan(1_600_000);
    expect(kwh).toBeLessThan(1_750_000);
    expect(src).not.toMatch(/2\.3M kWh/);
  });

  it('a tonne of CO2 fills a sphere about 10 m across, not 8', () => {
    // PV = nRT: 1e6 g / 44.01 g/mol at 298.15 K, 1 atm
    const m3 = ((1e6 / 44.01) * 0.0821 * 298.15) / 1000;
    const diameter = Math.cbrt((6 * m3) / Math.PI);
    expect(m3).toBeGreaterThan(500);
    expect(diameter).toBeCloseTo(10.2, 0);
    expect(src).not.toMatch(/sphere about 8 meters across/);
    expect(src).toMatch(/sphere about 10 meters across/);
  });

  it('the places that were already right are untouched', () => {
    // :441 states the mix and the kWh correctly; this fix must not disturb it.
    expect(src).toMatch(/597/);
    expect(src).toMatch(/1\.66 ?million|1,66\d,\d{3}|1\.66M/);
  });
});
