// The electrify-heating lever ran on two constants that contradict the data
// layer, and one that is arithmetically impossible.
//
//   heatingMt = scope1Mt * 0.8      // "~80% of Scope 1 is heating fuel"
//   heatingMmbtu = heatingMt*1000/80 // "~80 kg/MMBtu (mix of #2 oil at 73
//                                    //  + propane at 64)"
//
// Both are wrong against the repo's own numbers:
//
//   scopeTotals' Scope 1 rows are heating 1,290 + fleet 54 + refrigerants 7.
//   1,290 / 1,351 = 0.9548, not 0.80. "The rest" is 61 mt, not 270.
//
//   10.21 kg/gal ÷ 0.1385 MMBtu = 73.72 for oil; 5.72 ÷ 0.0915 = 62.51 for
//   propane. At the documented 90/10 split that is 72.60 kg/MMBtu. No blend
//   of 73 and 64 can reach 80 — the comment refutes its own constant.
//
// Effect: at 100% electrification the model said Scope 1 falls 1,080 mt while
// every other surface says heating fuel is 1,290 mt.
//
// Both are now DERIVED from the same factor table the rest of the app uses,
// so a factor change moves them together instead of leaving this file behind.

import { describe, it, expect } from 'vitest';
import { runScenario } from '../utils/scenarioModel.js';
import {
  SCOPE1_TOTAL_MT, SCOPE2_TOTAL_MT, SCOPE3_TOTAL_MT,
  FUEL_FACTORS_KG_PER_GAL, FUEL_BTU_PER_GAL,
  SCOPE1_HEATING_MT, HEATING_SHARE_OF_SCOPE1, HEATING_KG_PER_MMBTU, HEATING_OIL_FRACTION,
} from '../data/scopeTotals.js';
import { ANNUAL_SEQUESTRATION_MT } from '../data/sinks.js';

describe('the heating constants come from the factor table', () => {
  it('heating share matches the Scope 1 rows, not 0.80', () => {
    expect(SCOPE1_HEATING_MT).toBe(1290);
    expect(HEATING_SHARE_OF_SCOPE1).toBeCloseTo(1290 / 1351, 4);
    expect(HEATING_SHARE_OF_SCOPE1).toBeGreaterThan(0.9);
  });

  it('kg/MMBtu is the 90/10 blend of the published per-gallon factors', () => {
    const oil = FUEL_FACTORS_KG_PER_GAL['Heating Oil'] / (FUEL_BTU_PER_GAL.heating_oil / 1e6);
    const propane = FUEL_FACTORS_KG_PER_GAL.Propane / (FUEL_BTU_PER_GAL.propane / 1e6);
    expect(oil).toBeCloseTo(73.72, 1);
    expect(propane).toBeCloseTo(62.51, 1);
    const blend = HEATING_OIL_FRACTION * oil + (1 - HEATING_OIL_FRACTION) * propane;
    expect(HEATING_KG_PER_MMBTU).toBeCloseTo(blend, 6);
    expect(HEATING_KG_PER_MMBTU).toBeCloseTo(72.6, 1);
  });

  it('no blend of the two fuels could ever have been 80', () => {
    // The old comment named 73 and 64 and then used 80. Pin the impossibility
    // so nobody restores it as a "round number".
    const oil = FUEL_FACTORS_KG_PER_GAL['Heating Oil'] / (FUEL_BTU_PER_GAL.heating_oil / 1e6);
    const propane = FUEL_FACTORS_KG_PER_GAL.Propane / (FUEL_BTU_PER_GAL.propane / 1e6);
    expect(Math.max(oil, propane)).toBeLessThan(80);
  });
});

describe('electrifying heating removes the heating fuel, not 80% of Scope 1', () => {
  const run = (pct) => runScenario({
    scope1Mt: SCOPE1_TOTAL_MT, scope2Mt: SCOPE2_TOTAL_MT, scope3Mt: SCOPE3_TOTAL_MT,
    sinksMt: ANNUAL_SEQUESTRATION_MT, heatingElectrifyPct: pct,
  });

  it('at 100%, Scope 1 falls to the non-heating remainder', () => {
    const r = run(100);
    // The model is PROPORTIONAL — it removes the heating share of whatever
    // Scope 1 currently is — so that a live Scope 1 scales the lever with it.
    const removed = SCOPE1_TOTAL_MT - r.modified.scope1Mt;
    expect(removed).toBeCloseTo(SCOPE1_TOTAL_MT * HEATING_SHARE_OF_SCOPE1, 6);
    // ...which lands 1 mt under the heating row, because the published
    // SCOPE1_TOTAL_MT (1,350) is rounded while its own rows sum to 1,351.
    // A pre-existing rounding artefact in the data, not in this lever.
    expect(removed).toBeGreaterThan(SCOPE1_HEATING_MT - 1.5);
    expect(removed).toBeLessThanOrEqual(SCOPE1_HEATING_MT);
    // The remainder is fleet + refrigerants, not 270 mt of phantom heating.
    expect(r.modified.scope1Mt).toBeLessThan(65);
  });

  it('the old 0.80 would have left 270 mt of phantom heating behind', () => {
    const r = run(100);
    const oldWouldRemove = SCOPE1_TOTAL_MT * 0.8;
    expect(SCOPE1_TOTAL_MT - r.modified.scope1Mt).toBeGreaterThan(oldWouldRemove);
  });

  it('electrification still ADDS Scope 2 at the inventory rate', () => {
    // The correction must not disturb the inventory-vs-marginal split that
    // Phase 397 established: new load is consumption, priced at the average.
    const r = run(100);
    expect(r.modified.scope2Mt).toBeGreaterThan(SCOPE2_TOTAL_MT);
  });

  it('scales linearly with the slider', () => {
    const half = run(50), full = run(100);
    const dHalf = SCOPE1_TOTAL_MT - half.modified.scope1Mt;
    const dFull = SCOPE1_TOTAL_MT - full.modified.scope1Mt;
    expect(dHalf).toBeCloseTo(dFull / 2, 1);
  });
});
