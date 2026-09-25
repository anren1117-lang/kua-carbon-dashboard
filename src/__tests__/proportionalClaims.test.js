// Third pass of the reprice sweep: proportional claims. Twelve hardcoded
// "N% of gross / of Scope 3 / of the net balance" statements exist in prose.
// Ten check out — "roughly half of Scope 3" for purchased goods is 49.9%,
// "~95% of Scope 1" for heating is 95.5%, "60% of gross from Scope 3" is
// 60.0%, "about 15% of total electricity" from a 200 kW array is 14.7%, and
// the rest quote outside literature. Two did not.
//
//   LearnAgent: "~185 mtCO2e/yr — about 11% of KUA's entire net balance".
//   That was 10.7% against the old net of 1,725. The net is now 2,566, so the
//   same 185 mt is 7.2%. A reprice artefact, invisible to a numeric sweep
//   because the stale thing is a ratio, not a figure.
//
//   StudentDay: "a 10-mile one-way commute ... produces roughly 1.5 mtCO2e per
//   year — about 0.7% of KUA's entire annual footprint, from a single person."
//   Both halves wrong, and the second was never right. 1.5 mt comes from the
//   0.404 kg/mi factor Phase 406 retired; at the EPA commuting factor the same
//   commute is 1.07 mt. And 1.5 mt is 0.034% of gross, not 0.7% — the claim
//   overstated one commuter's share by about thirty times, on a page whose
//   whole purpose is to give an admin a sense of scale.
//
// Both now derive their figure AND their share, so neither can drift again.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { GROSS_MT } from '../data/scopeTotals.js';
import { ANNUAL_SEQUESTRATION_MT } from '../data/sinks.js';
import { getFactorByKey } from '../data/emissionFactors.js';
import { INSTRUCTIONAL_DAYS } from '../data/academicCalendar.js';
import { LEARNING_PATHS } from '../components/LearnAgent.js';

const netMt = GROSS_MT - ANNUAL_SEQUESTRATION_MT;
const CAR = getFactorByKey('travel', 'passenger_car_avg').kgco2e_per_unit;

const bodies = [];
const walk = (n) => {
  if (Array.isArray(n)) return n.forEach(walk);
  if (n && typeof n === 'object') {
    for (const v of Object.values(n)) {
      if (typeof v === 'string') bodies.push(v); else walk(v);
    }
  }
};
walk(LEARNING_PATHS);

describe('proportional claims state the proportion they actually are', () => {
  it('the international-travel lever states its share of the CURRENT net', () => {
    // Two bodies mention 185 mt; only one states it as a share of the net.
    const body = bodies.find((b) => /185 mtCO₂e\/yr/.test(b) && /% of/.test(b));
    expect(body).toBeTruthy();
    const share = Math.round((185 / netMt) * 100);
    expect(share).toBe(7);                       // 11% against the retired net
    expect(body).toMatch(new RegExp(`${share}% of`));
    expect(body).not.toMatch(/about 11% of/);
  });

  it('a solo commute is priced at the commuting factor, not the retired one', () => {
    const mt = (10 * 2 * INSTRUCTIONAL_DAYS * CAR) / 1000;
    expect(mt).toBeCloseTo(1.07, 2);
    // 1.5 was this same commute at the 0.404 kg/mi factor Phase 406 retired
    expect((10 * 2 * INSTRUCTIONAL_DAYS * 0.404) / 1000).toBeCloseTo(1.45, 2);
  });

  it('and states a share of gross that is not thirty times too big', () => {
    const src = readFileSync(resolve(process.cwd(), 'pages/admin/scope3/StudentDay.js'), 'utf8');
    const mt = (10 * 2 * INSTRUCTIONAL_DAYS * CAR) / 1000;
    const pct = (mt / GROSS_MT) * 100;
    expect(pct).toBeLessThan(0.05);
    expect(src).not.toMatch(/0\.7% of/);
    expect(src).not.toMatch(/roughly 1\.5 mtCO₂e/);
    // the figure and the share both come from the data now
    expect(src).toMatch(/INSTRUCTIONAL_DAYS/);
    // gross comes from the live composer here, not the build-time constant
    expect(src).toMatch(/live\.grossMt/);
  });

  it('the claims that were already right are left alone', () => {
    // guarding against a sweep that "fixes" correct prose
    const scope3 = readFileSync(resolve(process.cwd(), 'pages/Scope3.js'), 'utf8');
    expect(scope3).toMatch(/roughly half of Scope 3/);
    const scope1 = readFileSync(resolve(process.cwd(), 'pages/Scope1.js'), 'utf8');
    expect(scope1).toMatch(/~95% of Scope 1/);
  });
});
