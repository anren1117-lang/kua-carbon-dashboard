// One journey, five numbers. Two are legitimately different and SAY SO:
//
//   4.3 t  Boston -> Tokyo specifically (10,800 km x 2 x 0.20011 = 4,322 kg)
//   3.7 mt the cohort-weighted central (9,060 km x 2 x 0.20011 = 3,626 kg),
//          which is what personalFootprint's MT_PER_INTL_FLIGHT adopts
//
// Three more gave 3,000 kg, 4,000 kg and 3 mt with no basis at all, so a
// student meeting several of them has no way to tell which is the figure and
// which is the route. Those three now use the cohort-weighted central, and
// the ratios that hung off them were followed through rather than left
// pointing at the old inputs.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { GROSS_MT } from '../data/scopeTotals.js';
import { TOTAL_STUDENTS } from '../data/students.js';

const src = readFileSync(resolve(process.cwd(), 'components/LearnAgent.js'), 'utf8');
const DEFRA = 0.20011;           // kg CO2e / passenger-km, economy incl. non-CO2
const COHORT_KM = 9060;          // one-way cohort-weighted average
const grossPerStudent = GROSS_MT / TOTAL_STUDENTS;

describe('the East Asia round trip has one unlabelled value', () => {
  it('the cohort-weighted computation gives ~3.6-3.7 mt', () => {
    const kg = COHORT_KM * 2 * DEFRA;
    expect(kg).toBeCloseTo(3626, 0);
    expect(kg / 1000).toBeGreaterThan(3.5);
    expect(kg / 1000).toBeLessThan(3.8);
  });

  it('the unlabelled 3,000 / 4,000 / 3 mt figures are gone', () => {
    expect(src).not.toMatch(/East Asia ≈ \*\*3,000 kg/);
    expect(src).not.toMatch(/East Asia is about \*\*4,000 kg/);
    expect(src).not.toMatch(/round-trip to East Asia ≈ 3 mtCO₂e/);
  });

  it('the labelled route-specific and cohort figures survive', () => {
    // Boston->Tokyo at 4.3 t and the 9,060 km derivation are both correct.
    expect(src).toMatch(/Boston to Tokyo emits about \*\*4\.3 metric tons\*\*/);
    expect(src).toMatch(/9,060/);
    expect(src).toMatch(/cohort-weighted/);
  });

  it('ratios that hung off the old figures were recomputed', () => {
    // 3.7 mt against a ~5 kg/yr light-switching baseline is ~750x, not 800x.
    expect(src).not.toMatch(/800× as much as a year/);
    // and against gross per student, one trip is ~29%, two are ~57%
    // 12.87 until task #5 repriced Scope 2 to the published eGRID rate
    expect(grossPerStudent).toBeCloseTo(12.93, 1);
    // Asserted as the claim the copy actually makes — "close to a third" and
    // "well over half" — rather than a rounded point. 7.4/12.87 is 57.5%,
    // which sits exactly on toBeCloseTo(57, 0)'s boundary.
    const oneTrip = (3.7 / grossPerStudent) * 100;
    const twoTrips = (7.4 / grossPerStudent) * 100;
    expect(oneTrip).toBeGreaterThan(27);
    expect(oneTrip).toBeLessThan(33);
    expect(twoTrips).toBeGreaterThan(55);
    expect(src).not.toMatch(/~50-60% of personal footprint/);
  });
});
