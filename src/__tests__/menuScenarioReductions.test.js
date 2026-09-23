// The /dining menu scenarios publish an annual reduction each, rendered as the
// headline number of the scenario card. Three of the four are beef scenarios
// and none of them reproduced from the menu data beside them.
//
// Two separate faults:
//
//   1. A SWAP THAT COUNTS THE REPLACEMENT AS ZERO. "Beef → chicken 50% swap —
//      swap half of beef entrées for chicken; preserve protein servings" was
//      credited with 229 mt, the entire footprint of the beef removed. But the
//      chicken that replaces it still emits 1.98 kg a serving against beef's
//      9.95, so the saving is 80.1% of what was removed, not 100%. A swap
//      cannot save the whole of the thing it swapped.
//
//   2. A RESCALED BASE. Phase 415 rescaled these totals by the beef-factor
//      correction (x1.658) because Phase 405 had moved factorPerServing and
//      left them hardcoded. That re-anchored the level and kept the implied
//      beef base, which works out at ~460 mt/yr against the ~386 mt/yr the
//      menu data actually carries. The same failure as task #18 and task #21:
//      a rescale preserves whatever is wrong underneath it.
//
// Scenarios are now computed from the menu data and the canonical per-serving
// factors, with each one declaring what replaces the beef it removes.

import { describe, it, expect } from 'vitest';
import { menuScenarios, diningMenuItems, SCENARIO_BASIS } from '../data/dining.js';

const annualBeefMt = SCENARIO_BASIS.annualBeefMt;
const byId = (id) => menuScenarios.find((s) => s.id === id);

describe('menu scenarios reproduce from the menu beside them', () => {
  it('the beef base is derived from the menu, not carried forward', () => {
    let beefKg = 0;
    const days = new Set();
    for (const m of diningMenuItems) {
      days.add(m.date);
      if (m.category === 'beef') beefKg += (m.servingsServed || 0) * m.kgco2ePerServing;
    }
    const implied = (beefKg / 1000) * (365 / days.size);
    expect(annualBeefMt).toBeCloseTo(implied, 0);
    // and it is nowhere near the ~460 the old hardcoded totals implied
    expect(annualBeefMt).toBeLessThan(430);
  });

  it('every beef scenario equals base × share × (1 − replacement/beef)', () => {
    for (const s of menuScenarios.filter((x) => x.beefReductionPct > 0)) {
      const keep = 1 - (s.replacementKgPerServing / SCENARIO_BASIS.beefKgPerServing);
      const expected = annualBeefMt * (s.beefReductionPct / 100) * keep;
      expect(s.estimatedAnnualReductionMt).toBeCloseTo(expected, 0);
    }
  });

  it('the chicken swap deducts the chicken it adds', () => {
    const swap = byId('ms_beef50');
    expect(swap.replacementKgPerServing).toBeCloseTo(1.98, 2);
    // it must save strictly less than the beef it removed
    const removed = annualBeefMt * 0.5;
    expect(swap.estimatedAnnualReductionMt).toBeLessThan(removed);
    // ~80% of it, because chicken is ~20% of beef per serving
    expect(swap.estimatedAnnualReductionMt / removed).toBeCloseTo(0.80, 1);
    // the figure it replaces, which credited the swap with the whole of the beef
    expect(swap.estimatedAnnualReductionMt).toBeLessThan(229);
  });

  it('no scenario saves more beef than it removes', () => {
    for (const s of menuScenarios.filter((x) => x.beefReductionPct > 0)) {
      expect(s.estimatedAnnualReductionMt).toBeLessThanOrEqual(
        annualBeefMt * (s.beefReductionPct / 100) + 0.001,
      );
    }
  });

  it('a scenario with no beef component is left on its own basis', () => {
    const local = byId('ms_localproduce');
    expect(local.beefReductionPct).toBe(0);
    expect(local.estimatedAnnualReductionMt).toBe(12);
    expect(local.replacementKgPerServing).toBeUndefined();
  });
});
