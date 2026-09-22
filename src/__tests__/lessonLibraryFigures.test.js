// Two lessons stated KUA facts that the data layer contradicts, and students
// are asked to COMPUTE from both.
//
// GWP: "IPCC AR6 GWP values for HFCs: R-410A = 2,088, R-134a = 1,430,
//      R-32 = 675". Those are AR4/AR5 values. AR6 GWP-100 is 2,256 / 1,530 /
//      771 — which is exactly what this repo's own REFRIGERANT_GWP100 and
//      emissionFactors rows carry, the latter corrected in Phase 437 and
//      sourced to IPCC AR6 WG1 Ch.7. (2,088 is the AR4 figure the EU F-Gas
//      Regulation still mandates, which is why it circulates.)
//
// SOLAR: "KUA's 220 kW rooftop solar". renewables.js lists three OPERATIONAL
//      arrays totalling 60 kW DC (40 + 12 + 8) plus a 60 kW array planned for
//      2027. 220 matches neither. At the lesson's own 14% CF it implies
//      ~270,000 kWh/yr against a measured-anchored SOLAR_ANNUAL_KWH of
//      ~16,750.
//
// Pinned against the data layer, not against literals, so a new array or a
// GWP revision moves the lesson with it.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { REFRIGERANT_GWP100 } from '../data/scopeTotals.js';
import { solarSites, SOLAR_ANNUAL_KWH } from '../data/renewables.js';

const src = readFileSync(resolve(process.cwd(), 'data/lessonLibrary.js'), 'utf8');
const operationalKw = solarSites
  .filter((s) => s.status === 'operational')
  .reduce((sum, s) => sum + s.capacityKwDc, 0);

describe('the GWP lesson uses the AR6 values the dashboard uses', () => {
  it('the canonical AR6 set is what this test assumes', () => {
    expect(REFRIGERANT_GWP100['R-410A']).toBe(2256);
    expect(REFRIGERANT_GWP100['R-134a']).toBe(1530);
    expect(REFRIGERANT_GWP100['R-32']).toBe(771);
  });

  it('no AR4/AR5 value is presented as AR6', () => {
    const line = src.split('\n').find((l) => /GWP values for HFCs/.test(l));
    expect(line, 'GWP lesson not found').toBeTruthy();
    for (const stale of ['2,088', '1,430', '675']) {
      expect(line, `still teaches the pre-AR6 value ${stale}`).not.toContain(stale);
    }
  });

  it('it teaches the canonical figures instead', () => {
    const line = src.split('\n').find((l) => /GWP values for HFCs/.test(l));
    expect(line).toContain('2,256');
    expect(line).toContain('1,530');
    expect(line).toContain('771');
  });
});

describe('the solar lesson uses KUA capacity that exists', () => {
  it('the operational fleet is what this test assumes', () => {
    expect(operationalKw).toBe(60);
    expect(SOLAR_ANNUAL_KWH).toBeLessThan(60000);
  });

  it('no lesson claims a 220 kW array', () => {
    expect(src).not.toMatch(/220 kW/);
  });

  it('the stated capacity matches the operational fleet', () => {
    const lines = src.split('\n').filter((l) => /capacity factor|CF\b/.test(l) && /kW/.test(l));
    expect(lines.length).toBeGreaterThan(0);
    for (const l of lines) {
      expect(l, 'a solar lesson states a capacity KUA does not have')
        .toMatch(new RegExp(`${operationalKw} kW`));
    }
  });

  it('the capacity factor is labelled as the NH regional typical', () => {
    // 14% is a fair NH planning figure; it is not what these arrays measure,
    // and attributing it to KUA as observed performance is the other half of
    // the same error.
    const line = src.split('\n').find((l) => /capacity factor/.test(l) && /kW/.test(l));
    expect(line).toMatch(/NH|New Hampshire|regional/i);
  });
});
