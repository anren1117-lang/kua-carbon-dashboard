// Math tests for the /scenarios what-if simulator.

import { describe, it, expect } from 'vitest';
import { runScenario } from '../utils/scenarioModel.js';
import { KG_PER_KWH } from '../data/gridMix.js';
import { avertAvoidedKgPerKwh } from '../data/gridMixHistory.js';

const baseline = {
  scope1Mt: 200,
  scope2Mt: 100,
  sinksMt:  500,
};

describe('runScenario — baseline (no sliders moved)', () => {
  it('returns identical baseline and modified totals', () => {
    const r = runScenario(baseline);
    expect(r.baseline.grossMt).toBe(300);
    expect(r.modified.grossMt).toBe(300);
    expect(r.modified.netMt).toBe(r.baseline.netMt);
    expect(r.deltaMt).toBe(0);
    expect(r.steps).toEqual([]);
  });

  it('reports net = gross - sinks for baseline', () => {
    const r = runScenario(baseline);
    expect(r.baseline.netMt).toBe(300 - 500); // -200 (sink-positive!)
  });
});

describe('runScenario — electricity reduction', () => {
  it('cuts Scope 2 proportionally', () => {
    const r = runScenario({ ...baseline, electricityReductionPct: 25 });
    expect(r.modified.scope2Mt).toBe(75);
    expect(r.deltaMt).toBe(-25);
    expect(r.steps).toHaveLength(1);
    expect(r.steps[0].deltaMt).toBe(-25);
  });

  it('100% reduction zeros Scope 2', () => {
    const r = runScenario({ ...baseline, electricityReductionPct: 100 });
    expect(r.modified.scope2Mt).toBe(0);
  });
});

describe('runScenario — heating electrification', () => {
  it('shifts mass from Scope 1 to Scope 2 at COP > 1 (net win)', () => {
    const r = runScenario({ ...baseline, heatingElectrifyPct: 50 });
    expect(r.modified.scope1Mt).toBeLessThan(baseline.scope1Mt);
    expect(r.modified.scope2Mt).toBeGreaterThan(baseline.scope2Mt);
    // Net should improve (heat pump COP 3 >> 1)
    expect(r.modified.grossMt).toBeLessThan(baseline.scope1Mt + baseline.scope2Mt);
  });

  it('0% electrification leaves both scopes untouched', () => {
    const r = runScenario({ ...baseline, heatingElectrifyPct: 0 });
    expect(r.modified.scope1Mt).toBe(baseline.scope1Mt);
    expect(r.modified.scope2Mt).toBe(baseline.scope2Mt);
  });
});

describe('runScenario — solar PV', () => {
  it('offsets Scope 2 at the MARGINAL rate, not the inventory average', () => {
    const r = runScenario({ ...baseline, solarKw: 100 });
    // 100 kW × 1300 kWh/kW/yr × AVERT's displaced-generation rate, in mt.
    // Solar displaces the marginal unit (gas in New England), so pricing it
    // at the location-based average understated this by about half.
    const expected = (100 * 1300 * avertAvoidedKgPerKwh()) / 1000;
    expect(r.modified.scope2Mt).toBeCloseTo(baseline.scope2Mt - expected, 2);
  });

  it('keeps the two factors distinct — a merge would halve modelled solar', () => {
    // THE GUARD. If someone collapses solarDisplacedKgPerKwh back onto
    // gridKgPerKwh, the offset drops by ~2x and this fails. Same
    // unit-versus-question trap Phase 392 fixed in composeSolarFromRecords.
    const marginal = runScenario({ ...baseline, solarKw: 100 });
    const asAverage = runScenario({ ...baseline, solarKw: 100, solarDisplacedKgPerKwh: KG_PER_KWH });
    const marginalOffset = baseline.scope2Mt - marginal.modified.scope2Mt;
    const averageOffset = baseline.scope2Mt - asAverage.modified.scope2Mt;
    expect(marginalOffset).toBeGreaterThan(averageOffset * 1.5);
  });

  it('still prices NEW electric load at the inventory average, not the marginal rate', () => {
    // Electrification ADDS consumption, so it belongs at the average. If this
    // ever started using the marginal rate, electrifying would look ~2x worse.
    const r = runScenario({ ...baseline, heatingElectrifyPct: 50 });
    const added = r.modified.scope2Mt - baseline.scope2Mt;
    const rAtMarginal = runScenario({
      ...baseline, heatingElectrifyPct: 50, gridKgPerKwh: avertAvoidedKgPerKwh(),
    });
    const addedAtMarginal = rAtMarginal.modified.scope2Mt - baseline.scope2Mt;
    expect(added).toBeLessThan(addedAtMarginal);
  });

  it('0 kW solar is a no-op', () => {
    const r = runScenario({ ...baseline, solarKw: 0 });
    expect(r.modified.scope2Mt).toBe(baseline.scope2Mt);
  });
});

describe('runScenario — tree planting', () => {
  it('adds 2.1 mt/acre/yr to sinks (Birdsey closed-canopy)', () => {
    const r = runScenario({ ...baseline, treePlantingAcres: 10 });
    expect(r.modified.sinksMt).toBe(500 + 21);
  });

  it('appears as a single negative-delta step', () => {
    const r = runScenario({ ...baseline, treePlantingAcres: 10 });
    const step = r.steps.find((s) => /Plant/.test(s.label));
    expect(step).toBeDefined();
    expect(step.deltaMt).toBe(-21);
  });
});

describe('runScenario — multi-slider combinations', () => {
  it('layers all four effects when all sliders moved', () => {
    const r = runScenario({
      ...baseline,
      electricityReductionPct: 10,
      heatingElectrifyPct: 20,
      solarKw: 50,
      treePlantingAcres: 5,
    });
    expect(r.steps).toHaveLength(4);
    expect(r.modified.netMt).toBeLessThan(r.baseline.netMt);
  });

  it('deltaMt magnitude grows when sliders push further', () => {
    const small = runScenario({ ...baseline, electricityReductionPct: 5 });
    const big   = runScenario({ ...baseline, electricityReductionPct: 40 });
    expect(Math.abs(big.deltaMt)).toBeGreaterThan(Math.abs(small.deltaMt));
  });
});

describe('runScenario — deltaPct safety', () => {
  it('handles zero baseline net without dividing by zero', () => {
    const r = runScenario({ scope1Mt: 100, scope2Mt: 0, sinksMt: 100 });
    expect(Number.isFinite(r.deltaPct)).toBe(true);
  });
});
