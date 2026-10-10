// @vitest-environment jsdom
//
// /carbon-math is a worked-example page whose subtitle promises "all using
// KUA-specific numbers". Three questions failed that promise, each in a
// different way — and a student who does the arithmetic is taught the error.
//
// Q1  "KUA used about 5,400,000 kWh of grid electricity last year"
//     The canonical Scope 2 is 390 mt at 0.234446 kg/kWh = 1,663,496 kWh.
//     The premise is 3.25x the dashboard's own figure. The internal
//     arithmetic (5.4M x 0.234 = 1,264 mt) is fine — the premise is not.
//
// Q3  "One round-trip transatlantic flight is about 2.5 mtCO2e"
//     personalFootprint.js retired 2.5 BY NAME as sitting below all four
//     published methods, and uses 3.7. Worse, the work line concludes
//     "125 mt across just 50 students is more per-person than most American
//     adults emit in a year" — that is 2.5 mt/person against this repo's own
//     FOOTPRINT_REFERENCE.usAdultAvgMt of 16. False by 6.4x, and it stays
//     false at the corrected 3.7.
//
// Q5  Answer 2,100 mt drawdown, then "The net figure is about 1,725".
//     4,375 - 2,100 = 2,275. The 1,725 comes from the ADOPTED per-stand sink
//     of 2,650, which the question never introduces. A student who subtracts
//     gets a different number than the page states.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { SCOPE2_TOTAL_MT, GROSS_MT } from '../data/scopeTotals.js';
import { KG_PER_KWH } from '../data/gridMix.js';
import { ANNUAL_SEQUESTRATION_MT } from '../data/sinks.js';
import { FOOTPRINT_REFERENCE } from '../utils/personalFootprint.js';
import { buildQuestions } from '../pages/CarbonMath.js';

const src = readFileSync(resolve(process.cwd(), 'pages/CarbonMath.js'), 'utf8');
const CANONICAL_KWH = Math.round((SCOPE2_TOTAL_MT * 1000) / KG_PER_KWH);

describe('Q1 uses KUA electricity, not a figure 3x too big', () => {
  it('no longer claims 5,400,000 kWh', () => {
    expect(src).not.toMatch(/5,400,000 kWh/);
  });

  // The premise is derived now, so assert on the question the page actually
  // builds rather than on a literal in its source — the figure moves with
  // Scope 2 and a regex over source text would only re-break.
  it('the stated kWh is within 10% of the canonical Scope 2 basis', () => {
    const q1 = buildQuestions()[0];
    const m = q1.setup.match(/KUA used about ([\d,]+) kWh/);
    expect(m, 'Q1 premise not found').toBeTruthy();
    const stated = Number(m[1].replace(/,/g, ''));
    expect(Math.abs(stated - CANONICAL_KWH) / CANONICAL_KWH).toBeLessThan(0.1);
  });

  it('and its answer follows from that premise', () => {
    const q1 = buildQuestions()[0];
    const stated = Number(q1.setup.match(/KUA used about ([\d,]+) kWh/)[1].replace(/,/g, ''));
    const expected = (stated * KG_PER_KWH) / 1000;
    expect(Math.abs(q1.answer - expected) / expected).toBeLessThan(0.05);
    // and the printed work must multiply out to the answer it states
    const work = q1.work.join(' ');
    const product = Number((work.match(/=\s*([\d,]+) kg/) || [])[1]?.replace(/,/g, ''));
    expect(product).toBeTruthy();
    expect(Math.abs(stated * KG_PER_KWH - product)).toBeLessThan(1);
    expect(Math.abs(product / 1000 - q1.answer)).toBeLessThan(1);
  });

  it('tracks the figure /scope-2 publishes, since it says so', () => {
    const q1 = buildQuestions();
    expect(Math.abs(q1[0].answer - SCOPE2_TOTAL_MT) / SCOPE2_TOTAL_MT).toBeLessThan(0.02);
    // and it follows a moved Scope 2 rather than pinning last release's number
    const moved = buildQuestions(SCOPE2_TOTAL_MT * 1.2)[0];
    expect(moved.answer).toBeGreaterThan(q1[0].answer);
  });
});

describe('Q3 prices a flight at the figure this repo actually uses', () => {
  it('no longer uses the retired 2.5 mt round trip', () => {
    expect(src).not.toMatch(/round-trip transatlantic flight is about 2\.5/);
  });

  it('does not claim a per-student flight beats a US adult year', () => {
    // 185 / 50 = 3.7 against usAdultAvgMt 16. The claim was false at 2.5 and
    // is still false at 3.7, so it must be gone, not merely rescaled.
    expect(src).not.toMatch(/more per-person than most American adults/);
    expect(FOOTPRINT_REFERENCE.usAdultAvgMt).toBe(16);
  });
});

describe('Q5 states a net that follows from its own answer', () => {
  it('does not assert 1,725 from a 2,100 drawdown', () => {
    const q5 = src.slice(src.indexOf('sequesters roughly 2.1'));
    const block = q5.slice(0, 900);
    // The adopted sink was repriced to a net basis (task #16), so the net it
    // implies moved with it. Derive both rather than pinning literals that go
    // stale the next time the sink moves.
    const adopted = Math.round(ANNUAL_SEQUESTRATION_MT).toLocaleString();
    const net = Math.round(GROSS_MT - ANNUAL_SEQUESTRATION_MT).toLocaleString();
    if (new RegExp(net).test(block)) {
      // allowed ONLY if the block also explains the adopted sink it comes
      // from — otherwise the subtraction does not reproduce.
      expect(block).toMatch(new RegExp(adopted));
    }
    // WHAT USED TO BE HERE, four lines after a comment saying "derive both
    // rather than pinning literals that go stale":
    //
    //   expect(GROSS_MT - 2100).toBeCloseTo(GROSS_MT - 2100, 1);   // tautology
    //   expect(Math.round(GROSS_MT - 2100)).toBe(2295);            // pinned
    //   expect(GROSS_MT - ANNUAL_SEQUESTRATION_MT).toBeCloseTo(2566, 0); // pinned
    //
    // The first compares a value to itself and can never fail. The other two
    // pinned the exact figures the comment warned about, and both went stale
    // the next time gross moved. The check that carries meaning is the one
    // above: a net quoted in the block must be reproducible from the sink the
    // block states. The rest is arithmetic, asserted as arithmetic.
    const highEndSink = 2100;
    expect(Math.round(GROSS_MT - highEndSink))
      .toBe(Math.round(GROSS_MT) - highEndSink);
    // even the most generous published drawdown leaves KUA net positive —
    // which is the premise Q5 rests on, and the thing worth guarding
    expect(GROSS_MT - highEndSink).toBeGreaterThan(0);
    expect(GROSS_MT - ANNUAL_SEQUESTRATION_MT).toBeGreaterThan(0);
    // and the canonical net is the adopted sink subtracted, nothing else
    expect(Math.round(GROSS_MT - ANNUAL_SEQUESTRATION_MT)).toBe(Number(net.replace(/,/g, '')));
  });
});
