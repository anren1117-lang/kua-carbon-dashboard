// Tripwire for the GLOBAL carbon figures, which nothing guarded.
//
// proseFigures.test.js guards KUA's own headline totals and the grid emission
// factor. It does not guard atmospheric CO₂, world annual emissions, the sink
// split or the remaining carbon budget — and those appear in far more places,
// inside AP teaching content that students are asked to COMPUTE from.
//
// What that gap cost, in one sweep:
//
//   - ~20 sites said "425 ppm (2024)" and "51% above pre-industrial". The year,
//     the concentration and the percentage were each wrong, and inconsistently:
//     425/278 is 53%, so the sentence disagreed with itself.
//   - Four sites had been corrected to 426 and the rest had not, so the same
//     course contradicted itself between units.
//   - The ocean and land sinks were taught in the WRONG ORDER. GCB 2025 puts
//     the 2015-2024 ocean sink at 29% against land's 21%; the content said
//     ~25% ocean / ~30% land. An ORDERING claim — the class interpolation does
//     not protect, because no single number is obviously wrong.
//   - The cumulative airborne fraction (39% since 1850) was conflated with the
//     recent decadal one (~50%).
//
// THE PAIRING RULE is the subtle part and gets its own test: the percentage
// above pre-industrial is a function of the concentration, so a year, a ppm
// and a percentage must move together. 422.8 (2024) is 52%; 425.6 (2025) is
// 53%. Pairing 2024 with 53% is wrong even though both numbers are real.

import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  CO2_PPM, CO2_PPM_EXACT, CO2_PPM_2024, CO2_PREINDUSTRIAL_PPM,
  CO2_PERCENT_ABOVE_PREINDUSTRIAL, CO2_PERCENT_ABOVE_PREINDUSTRIAL_2024,
  FOSSIL_GTCO2, TOTAL_GTCO2, FOSSIL_SHARES_2024, CEMENT_IS_INSIDE_FOSSIL,
  SINK_SHARES_RECENT_DECADE, LARGER_SINK, CUMULATIVE_1850_2024,
  CARBON_BUDGETS, TOTAL_GTC_2025, C_TO_CO2,
  CH4_GWP100_BIOGENIC, CH4_GWP100_FOSSIL, CH4_PERTURBATION_LIFETIME_YR,
  CH4_ATMOSPHERIC_LIFETIME_YR,
  budgetYears,
} from '../data/globalCarbonFigures.js';

/**
 * Figures that WERE the published value and are not any more. A surface stating
 * one of these is stale however the sentence is phrased — the check the
 * context-matching patterns cannot make.
 *
 * This list lives in the TEST, not in the data module. Put it in a shipped
 * module and every stale string it names goes back into the bundle, where the
 * residual gate finds them and reports a residual against the list itself.
 *
 * WHEN A GLOBAL FIGURE MOVES: add the superseded value here.
 */
const SUPERSEDED_GLOBAL_FIGURES = [
  '425 ppm', '420 ppm', '415 ppm', '410 ppm',
  '51% above', '51% increase', '50% increase',
  '~37 Gt', '37 Gt CO₂', '36 Gt CO₂',
  // SPECIFIC, not generic. '315 Gt' was the first spelling here and it
  // false-positived immediately on a CORRECT new figure: the stale value was
  // a 315 Gt CO₂ carbon budget, while 315 Gt C is cumulative carbon in the
  // atmosphere — different quantity, same digits. A marker short enough to
  // collide is a marker that trains you to ignore the guard.
  '250 GtCO₂ left', '315 Gt CO₂', '315 GtCO₂',
  'GWP-100 of 28', 'GWP100 of 28',
  '114 yr', '114-year',
];

const SRC = path.resolve(new URL('../', import.meta.url).pathname);

/** Every file that teaches a global figure. */
const GLOBAL_PROSE = [
  'components/LearnAgent.js',
  'data/learningContent.js',
  'data/ap-content/apes-unit-1.js',
  'data/ap-content/apes-unit-4.js',
  'data/ap-content/apes-unit-7.js',
  'data/ap-content/apes-unit-8.js',
  'data/ap-content/apes-unit-9.js',
  'data/ap-content/apes-figures.js',
  'data/ap-content/apbio-unit-3.js',
  'data/ap-content/apbio-unit-8.js',
];

// A line may name an old figure in order to retire it, or to explain why
// sources disagree — which is good teaching, not drift. Same construction the
// sibling guard uses.
// Bare /\bwas\b/ was too permissive and exempted a LIVE claim — "Pre-industrial
// CO2 was ~280 ppm ... Today it's ~425 ppm" is a present-tense assertion with a
// past-tense verb in it. The retiring constructions are named specifically.
const RETIRING = /older source|earlier version|previously|used to (say|read)|superseded|no longer|instead of|rather than|not the |before that|\bran \d|revised (up|down|to)|up from|down from|sources disagree|why sources|Phase \d/i;

// A DIFFERENT SERIES is not a stale copy of this one, and this guard nearly
// forced a wrong "correction". The Keeling-curve figure plots MAUNA LOA, whose
// 2024 annual mean is 424.61 ppm — it rounds to 425 and is right. The GLOBAL
// marine-boundary-layer mean for the same year is 422.80. Mauna Loa sits
// 1.8 ppm higher because it is a northern-hemisphere station, so "425 ppm" is
// correct there and stale everywhere else.
//
// Same shape as the inventory-vs-consequential trap: identical units, different
// question. A guard that cannot tell them apart will confidently break the one
// surface that was accurate.
const OTHER_SERIES = /Mauna Loa|MLO\b|Scripps|station mean|northern hemisphere/i;

function staleGlobalsIn(relPath) {
  const full = path.join(SRC, relPath);
  if (!fs.existsSync(full)) return [`${relPath} — MISSING, so this guard covers nothing`];
  const out = [];
  fs.readFileSync(full, 'utf8').split('\n').forEach((line, i) => {
    const code = line.trim();
    if (code.startsWith('//') || code.startsWith('*')) return;
    if (RETIRING.test(line) || OTHER_SERIES.test(line)) return;
    for (const fig of SUPERSEDED_GLOBAL_FIGURES) {
      if (line.includes(fig)) out.push(`${relPath}:${i + 1} — superseded global figure "${fig}"`);
    }
  });
  return out;
}

describe('the global carbon figures are internally consistent', () => {
  it('the percentage above pre-industrial is derived, not typed', () => {
    expect(CO2_PERCENT_ABOVE_PREINDUSTRIAL)
      .toBe(Math.round(((CO2_PPM_EXACT - CO2_PREINDUSTRIAL_PPM) / CO2_PREINDUSTRIAL_PPM) * 100));
    expect(CO2_PERCENT_ABOVE_PREINDUSTRIAL).toBe(53);
  });

  it('THE PAIRING RULE: each year pairs with its own percentage', () => {
    // the defect: "425 ppm (2024) ... 51%" had all three parts disagreeing
    expect(CO2_PERCENT_ABOVE_PREINDUSTRIAL_2024).toBe(52);
    expect(CO2_PERCENT_ABOVE_PREINDUSTRIAL).not.toBe(CO2_PERCENT_ABOVE_PREINDUSTRIAL_2024);
    // and 51% is not a correct pairing for ANY of our stated concentrations
    for (const ppm of [CO2_PPM_EXACT, CO2_PPM_2024, CO2_PPM]) {
      const pct = Math.round(((ppm - CO2_PREINDUSTRIAL_PPM) / CO2_PREINDUSTRIAL_PPM) * 100);
      expect(pct, `${ppm} ppm`).not.toBe(51);
    }
  });

  it('the rounded ppm is this year, not last', () => {
    expect(CO2_PPM).toBe(426);
    expect(CO2_PPM).not.toBe(Math.round(CO2_PPM_2024));   // 423, the 2024 value
  });

  it('GtC converts to GtCO2 at 44/12, and the parts make the total', () => {
    expect(C_TO_CO2).toBeCloseTo(3.667, 3);
    expect(TOTAL_GTCO2).toBe(Math.round(TOTAL_GTC_2025 * C_TO_CO2));
    expect(TOTAL_GTCO2).toBe(42);
    expect(FOSSIL_GTCO2).toBe(38);
    // the unit error found in apes-unit-1: 11.5 GtC cannot be 37 GtCO2
    expect(Math.round(11.5 * C_TO_CO2)).not.toBe(37);
  });

  it('fossil shares sum to 100 and cement is inside the fossil total', () => {
    expect(FOSSIL_SHARES_2024.reduce((s, r) => s + r.percent, 0)).toBe(100);
    // the double-count: fossil + cement + land-use triple-counts cement
    expect(CEMENT_IS_INSIDE_FOSSIL).toBe(true);
  });

  it('the ocean is the larger sink — the ordering that had flipped', () => {
    expect(LARGER_SINK).toBe('ocean');
    expect(SINK_SHARES_RECENT_DECADE.oceanPercent).toBeGreaterThan(SINK_SHARES_RECENT_DECADE.landPercent);
    // and the three shares account for the emissions
    const { oceanPercent, landPercent, airbornePercent } = SINK_SHARES_RECENT_DECADE;
    expect(oceanPercent + landPercent + airbornePercent).toBe(100);
  });

  it('the cumulative partition is NOT the decadal one', () => {
    // conflating these was the actual error
    expect(CUMULATIVE_1850_2024.atmospherePercent)
      .toBeLessThan(SINK_SHARES_RECENT_DECADE.airbornePercent);
    // GCB's own figures sum to 90%; nothing may force them to close
    const sum = CUMULATIVE_1850_2024.atmospherePercent
      + CUMULATIVE_1850_2024.oceanPercent + CUMULATIVE_1850_2024.landPercent;
    expect(sum).toBe(90);
    // and each percentage really is its GtC over the total
    expect(Math.round((CUMULATIVE_1850_2024.atmosphereGtC / CUMULATIVE_1850_2024.totalGtC) * 100))
      .toBe(CUMULATIVE_1850_2024.atmospherePercent);
  });

  it('the carbon budgets are ordered and their year-counts derived', () => {
    const gt = CARBON_BUDGETS.map((b) => b.gtCO2);
    expect([...gt].sort((a, b) => a - b)).toEqual(gt);   // already ascending
    expect(budgetYears(CARBON_BUDGETS[0].gtCO2)).toBe(4);
    // every budget is stated in GtCO2 only — see the module for why the GtC
    // column was dropped rather than reconciled
    CARBON_BUDGETS.forEach((b) => {
      expect(b.gtC, b.target).toBeUndefined();
      expect(budgetYears(b.gtCO2), b.target).toBeGreaterThan(0);
    });
  });

  it('methane carries AR6 values and distinguishes its two lifetimes', () => {
    expect(CH4_GWP100_FOSSIL).toBeGreaterThan(CH4_GWP100_BIOGENIC);
    // the perturbation lifetime is LONGER than the atmospheric one, which is
    // the thing most sources blur
    expect(CH4_PERTURBATION_LIFETIME_YR).toBeGreaterThan(CH4_ATMOSPHERIC_LIFETIME_YR);
    expect(CH4_GWP100_BIOGENIC).not.toBe(28);   // AR5
  });
});

describe('no teaching surface states a superseded global figure', () => {
  it.each(GLOBAL_PROSE)('%s is current', (relPath) => {
    expect(staleGlobalsIn(relPath)).toEqual([]);
  });

  it('the guard is not vacuous — it catches each defect found in the sweep', () => {
    const tmp = path.join(SRC, '__tests__/.globals-fixture.js');
    fs.writeFileSync(tmp,
      "const a = 'CO₂ has reached 425 ppm, a 51% increase over pre-industrial';\n"
      + "const b = 'global emissions are ~37 Gt CO₂/yr';\n"
      + "const c = 'CH₄ has GWP-100 of 28';\n", 'utf8');
    try {
      const hits = staleGlobalsIn('__tests__/.globals-fixture.js');
      expect(hits.length).toBeGreaterThanOrEqual(3);
    } finally {
      fs.unlinkSync(tmp);
    }
  });

  it('spares a Mauna Loa figure, where 425 ppm is the CORRECT value', () => {
    const tmp = path.join(SRC, '__tests__/.globals-mlo.js');
    fs.writeFileSync(tmp, "const a = '425 ppm (2024, Mauna Loa)';\n", 'utf8');
    try {
      expect(staleGlobalsIn('__tests__/.globals-mlo.js')).toEqual([]);
      // but the same figure with no station qualifier IS flagged
      const tmp2 = path.join(SRC, '__tests__/.globals-noqual.js');
      fs.writeFileSync(tmp2, "const a = 'atmospheric CO2 is 425 ppm';\n", 'utf8');
      try {
        expect(staleGlobalsIn('__tests__/.globals-noqual.js')).toHaveLength(1);
      } finally {
        fs.unlinkSync(tmp2);
      }
    } finally {
      fs.unlinkSync(tmp);
    }
  });

  it('spares a line that explains why older sources differ', () => {
    const tmp = path.join(SRC, '__tests__/.globals-ok.js');
    fs.writeFileSync(tmp,
      "const a = 'older sources say 425 ppm; the figure was revised upward';\n"
      + "// textbooks still print ~37 Gt CO₂\n", 'utf8');
    try {
      expect(staleGlobalsIn('__tests__/.globals-ok.js')).toEqual([]);
    } finally {
      fs.unlinkSync(tmp);
    }
  });

  it('covers files that actually exist — a typo here guards nothing', () => {
    GLOBAL_PROSE.forEach((f) => {
      expect(fs.existsSync(path.join(SRC, f)), f).toBe(true);
    });
    expect(GLOBAL_PROSE.length).toBeGreaterThan(8);
  });
});
