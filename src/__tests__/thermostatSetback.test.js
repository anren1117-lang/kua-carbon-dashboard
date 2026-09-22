// Two thermostat claims, both far above the published rule, one of them
// attributed to a source that does not say it.
//
// DOE/ENERGY STAR: about **10% a year** on heating and cooling for a
// **7-10 degF setback over 8 hours a day** — roughly **1.2% per degF**.
//
//   LearnAgent:352   "Lowering setpoint 2 degF overnight saves ~7% of heating
//                     energy. For a typical dorm using 6,000 gal/year heating
//                     oil, that is ~30 mtCO2e across the building."
//                     6,000 gal x 10.21 kg/gal = 61.3 mt TOTAL heating
//                     emissions. 30 mt is half the dorm's entire heating
//                     footprint from a 2 degF overnight setback.
//
//   LearnAgent:1499  "About 7% per degF of setback x ~2 degF = 14%. EPA
//                     ENERGY STAR documents this rule." Three problems: 7%
//                     per degF is ~6x the published rate, the attribution
//                     does not hold, and the question asks about 22->20 degC,
//                     which is 3.6 degF, not 2.
//
// Pinned against the fuel factor, so a reprice moves the lesson with it.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { FUEL_FACTORS_KG_PER_GAL } from '../data/scopeTotals.js';

const src = readFileSync(resolve(process.cwd(), 'components/LearnAgent.js'), 'utf8');
const DORM_GAL = 6000;
const dormHeatingMt = (DORM_GAL * FUEL_FACTORS_KG_PER_GAL['Heating Oil']) / 1000;
const PCT_PER_DEGF = 0.012; // DOE: ~10% for 7-10 degF over 8 h/day

describe('the setback figures follow the published rule', () => {
  it('the dorm heating total is what this test assumes', () => {
    expect(dormHeatingMt).toBeCloseTo(61.3, 1);
  });

  it('no claim exceeds the dorm total by an implausible share', () => {
    // 30 mt of a 61.3 mt heating footprint, from 2 degF overnight, is 49%.
    expect(src).not.toMatch(/~30 mtCO₂e of CO₂ across the building/);
    const saving2F = dormHeatingMt * PCT_PER_DEGF * 2;
    expect(saving2F).toBeLessThan(2); // ~1.5 mt
  });

  it('does not attribute 7% per degF to ENERGY STAR', () => {
    expect(src).not.toMatch(/7% per °F/);
    expect(src).not.toMatch(/EPA ENERGY STAR documents this rule/);
  });

  it('the quiz answer matches the temperature the question asks about', () => {
    // 22 -> 20 degC is 3.6 degF, not 2.
    const i = src.indexOf('Setting a dorm radiator from 22 °C to 20 °C');
    expect(i).toBeGreaterThan(-1);
    const block = src.slice(i, i + 1400);
    expect(block).toMatch(/3\.6/);
    const correct = block.match(/\{ text: '([^']+)', correct: true/);
    expect(correct, 'no correct option found').toBeTruthy();
    expect(correct[1]).toMatch(/~4%/);
  });

  it('exactly one option is marked correct', () => {
    const i = src.indexOf('Setting a dorm radiator from 22 °C to 20 °C');
    const block = src.slice(i, i + 1400);
    expect((block.match(/correct: true/g) || []).length).toBe(1);
  });

  it('14% survives as a distractor that names the inflated rule', () => {
    const i = src.indexOf('Setting a dorm radiator from 22 °C to 20 °C');
    const block = src.slice(i, i + 1400);
    expect(block).toMatch(/~14%/);
    expect(block).toMatch(/correct: false, explanation: '[^']*(six times|inflat|rule of thumb)/i);
  });
});
