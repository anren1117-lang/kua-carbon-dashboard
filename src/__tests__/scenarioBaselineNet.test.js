// /scenarios published KUA as 910 mtCO₂e NET-NEGATIVE on first paint, under a
// subtitle reading "KUA's net carbon balance".
//
//   Scenarios.js fed runScenario scope1Mt (1,350) + scope2Mt (390) = 1,740
//   gross, and then subtracted the FULL forest sink of 2,650.
//   1,740 − 2,650 = −910.
//
// Scope 3 — 2,635 mt, 60% of gross — was simply absent, while the sink that
// offsets all three scopes was applied in full. Every other surface publishes
// +1,725 (Executive, AnnualReport, AISummary, LearnAgent), and CarbonMath
// states in words that KUA is NOT net-negative.
//
// The error flattered the school, on the page a trustee uses to evaluate
// spending. That is the worst direction for a reporting error to run.
//
// The invariant pinned here is not a literal but an IDENTITY: with no levers
// pulled, the scenario baseline must equal the inventory the rest of the
// product publishes. A future reprice of any scope moves both sides together.

import { describe, it, expect } from 'vitest';
import { runScenario } from '../utils/scenarioModel.js';
import { SCOPE1_TOTAL_MT, SCOPE2_TOTAL_MT, SCOPE3_TOTAL_MT, GROSS_MT } from '../data/scopeTotals.js';
import { ANNUAL_SEQUESTRATION_MT } from '../data/sinks.js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const CANONICAL_NET = GROSS_MT - ANNUAL_SEQUESTRATION_MT;
const idle = (over = {}) => runScenario({
  scope1Mt: SCOPE1_TOTAL_MT, scope2Mt: SCOPE2_TOTAL_MT, scope3Mt: SCOPE3_TOTAL_MT,
  sinksMt: ANNUAL_SEQUESTRATION_MT,
  electricityReductionPct: 0, heatingElectrifyPct: 0, solarKw: 0, treePlantingAcres: 0,
  ...over,
});

describe('the scenario baseline is the inventory everyone else publishes', () => {
  it('idle baseline gross equals GROSS_MT', () => {
    expect(idle().baseline.grossMt).toBe(GROSS_MT);
  });

  it('idle baseline net equals the canonical net, and is POSITIVE', () => {
    expect(idle().baseline.netMt).toBe(CANONICAL_NET);
    expect(idle().baseline.netMt).toBeGreaterThan(0);
  });

  it('does not silently drop Scope 3 when it is omitted', () => {
    // The old signature had no scope3Mt at all, so forgetting it produced a
    // plausible-looking number rather than an error. Defaulting to 0 keeps
    // that failure mode available, so this pins that the page supplies it.
    const withoutS3 = runScenario({
      scope1Mt: SCOPE1_TOTAL_MT, scope2Mt: SCOPE2_TOTAL_MT,
      sinksMt: ANNUAL_SEQUESTRATION_MT,
    });
    expect(withoutS3.baseline.grossMt).toBeLessThan(GROSS_MT);
    // ...and that is exactly the shape that produced the -910 claim:
    expect(withoutS3.baseline.netMt).toBeLessThan(0);
  });

  it('Scenarios.js actually passes scope3Mt', () => {
    const src = readFileSync(resolve(process.cwd(), 'pages/Scenarios.js'), 'utf8');
    expect(src).toMatch(/scope3Mt:/);
  });
});

describe('a reduction reads as a reduction', () => {
  it('cutting electricity lowers net and reports a negative deltaMt', () => {
    const r = idle({ electricityReductionPct: 20 });
    expect(r.modified.netMt).toBeLessThan(r.baseline.netMt);
    expect(r.deltaMt).toBeLessThan(0);
  });

  it('deltaPct is negative for an improvement, not positive', () => {
    // Against the old negative baseline, dividing by it flipped the sign: a
    // cut rendered as "+9%". With a positive baseline the sign is meaningful.
    const r = idle({ electricityReductionPct: 20 });
    expect(r.deltaPct).toBeLessThan(0);
    expect(Math.abs(r.deltaPct)).toBeCloseTo(Math.abs(r.deltaMt) / CANONICAL_NET * 100, 6);
  });

  it('Scope 3 is carried through unchanged — no lever here touches it', () => {
    const r = idle({ electricityReductionPct: 20, heatingElectrifyPct: 50, solarKw: 250, treePlantingAcres: 10 });
    expect(r.modified.scope3Mt).toBe(SCOPE3_TOTAL_MT);
    expect(r.baseline.scope3Mt).toBe(SCOPE3_TOTAL_MT);
  });
});
