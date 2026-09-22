// One quiz question taught two incompatible factor sets at once.
//
// The CORRECT answer used the canonical values — beef 99.5, chicken 9.9,
// rice 4.5, beans 1.0. All three DISTRACTOR explanations ran on the
// superseded set that emissionFactors.js records retiring in Phase 405:
//
//   "Chicken is ~6 kg CO2e/kg"              canonical is 9.9
//   "Rice ... 15x lower than beef"          99.5 / 4.5 = 22x
//   "Potatoes ... 150x less than beef"      99.5 / 0.4 = 249x
//
// The 15x and 150x ratios only hold if beef is 60 — the discredited teaching
// figure. A student who reads all four explanations is taught that beef is
// both 99.5 and 60.
//
// Ratios are asserted against the factor table, so a reprice moves the quiz
// with it rather than stranding it again.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getFactorByKey } from '../data/emissionFactors.js';

const src = readFileSync(resolve(process.cwd(), 'components/LearnAgent.js'), 'utf8');
const beef = getFactorByKey('food', 'beef').kgco2e_per_unit;
const chicken = getFactorByKey('food', 'chicken').kgco2e_per_unit;
const rice = getFactorByKey('food', 'rice').kgco2e_per_unit;
const POTATO = 0.4; // no factor row; OWID per-kg figure used by the lesson

// the four option explanations of the "LARGEST carbon footprint" question
const block = (() => {
  const i = src.indexOf('which has the LARGEST carbon footprint?');
  expect(i).toBeGreaterThan(-1);
  return src.slice(i, i + 1600);
})();

describe('the food quiz runs on one factor set', () => {
  it('the canonical values are what this test assumes', () => {
    expect(beef).toBe(99.5);
    expect(chicken).toBe(9.9);
    expect(rice).toBe(4.5);
  });

  it('the chicken distractor states the canonical per-kg value', () => {
    expect(block).not.toMatch(/Chicken is ~6 kg/);
    expect(block).toMatch(new RegExp(`Chicken is ~${chicken} kg`));
  });

  it('every ratio follows from the canonical beef figure', () => {
    // 15x and 150x are only true if beef is 60.
    expect(block).not.toMatch(/15× lower than beef/);
    expect(block).not.toMatch(/150× less impact/);
    expect(block).toMatch(new RegExp(`${Math.round(beef / rice)}× lower than beef`));
    expect(block).toMatch(new RegExp(`${Math.round(beef / POTATO / 10) * 10}× less impact`));
  });

  it('no explanation implies the retired beef = 60 set', () => {
    for (const ratio of [15, 150]) {
      const implied = ratio === 15 ? rice * ratio : POTATO * ratio;
      expect(Math.abs(implied - 60)).toBeLessThan(10); // proves 15x/150x => beef 60
    }
    expect(block).not.toMatch(/\b60 kg CO₂e/);
  });
});
