// The forest sink is now priced on a NET basis. Task #16, decided.
//
// What changed and why: the old per-acre rates were growth-side numbers used
// to answer a net-flux question — the same category error as pricing displaced
// electricity at the inventory average. Birdsey 1992 Table 2.14 is annual
// accumulation in LIVE TREES (gross growth minus mortality, NOT minus harvest
// removals, no soil / forest floor / dead wood), and the open-grown 4.2 was
// Nowak 2013's GROSS US average per m² of CANOPY, not per acre of land.
//
// The table now takes net annual increment from the GTR NE-343 yield tables
// (Smith, Heath, Skog & Birdsey 2006) for unharvested Northeastern stands, and
// Nowak's own New Hampshire NET rate for the open-grown acres, scaled by canopy
// cover because the denominator there is canopy, not ground.
//
// Two things fell out that are worth stating:
//
//   The age ordering flipped the right way round. Increment peaks in young and
//   intermediate stands and declines with age (GTR NE-343 maple-beech-birch:
//   3.28 at 25-35 yr falling to 1.59 at 85-95; Birdsey says it in words on
//   p.1). The old table had mature hardwood ABOVE the young stand.
//
//   The total landed at ~1,829 against a research central of 1.77-1.80/acre,
//   and against the dashboard's own four-method central of 1.73 computed years
//   earlier by an unrelated route. It sits slightly above a flat mature-stand
//   weighting because this forest genuinely has a young stand, an intermediate
//   stand and open-grown trees.

import { describe, it, expect } from 'vitest';
import {
  forestStands,
  TOTAL_FOREST_ACRES,
  ANNUAL_SEQUESTRATION_MT,
  SEQUESTRATION_BASIS,
} from '../data/sinks.js';

const M2_PER_ACRE = 4046.8564224;
const C_TO_CO2 = 44 / 12;
const LB_TO_KG = 0.45359237;

/** kg C per m²/yr → mtCO2e per acre of canopy/yr */
const perCanopyAcre = (kgCperM2) => (kgCperM2 * M2_PER_ACRE / 1000) * C_TO_CO2;
/** lb C per acre/yr → mtCO2e per acre/yr */
const fromLbC = (lb) => (lb * LB_TO_KG / 1000) * C_TO_CO2;

const stand = (id) => forestStands.find((s) => s.id === `stand_${id}`);

describe('the forest sink is priced on a net basis', () => {
  it('the basis says what it is, and what it assumes', () => {
    expect(SEQUESTRATION_BASIS.basis).toMatch(/net annual increment/i);
    expect(SEQUESTRATION_BASIS.assumesNoHarvest).toBe(true);
    expect(SEQUESTRATION_BASIS.excludesSoilCarbon).toBe(true);
    // the one input still to be measured rather than assumed
    expect(SEQUESTRATION_BASIS.campusCanopyCover).toBeGreaterThan(0);
    expect(SEQUESTRATION_BASIS.campusCanopyCover).toBeLessThan(1);
  });

  it('the total sits in the published net band, near the research central', () => {
    const weighted = ANNUAL_SEQUESTRATION_MT / TOTAL_FOREST_ACRES;
    expect(weighted).toBeGreaterThan(1.0);   // EPA all-pools net, incl. harvest
    expect(weighted).toBeLessThan(2.5);      // top of the defensible range
    // GTR NE-343 age-weighted central for an unharvested NE mix
    expect(weighted).toBeCloseTo(1.83, 1);
    expect(ANNUAL_SEQUESTRATION_MT).toBeGreaterThan(1600);
    expect(ANNUAL_SEQUESTRATION_MT).toBeLessThan(2000);
  });

  it('increment now declines with stand age, as every yield table has it', () => {
    const young = forestStands.find((s) => s.ageClass === 'young');
    const intermediate = forestStands.find((s) => s.ageClass === 'intermediate');
    const matureHardwood = stand('north');
    expect(young.mtco2eAcreYr).toBeGreaterThan(intermediate.mtco2eAcreYr);
    expect(intermediate.mtco2eAcreYr).toBeGreaterThan(matureHardwood.mtco2eAcreYr);
    // and no mature stand may exceed the young one
    for (const s of forestStands.filter((x) => x.ageClass === 'mature')) {
      expect(s.mtco2eAcreYr).toBeLessThan(young.mtco2eAcreYr);
    }
  });

  it('the open-grown rate is Nowak NH NET scaled by canopy cover, not his gross US average', () => {
    const open = stand('open');
    const nhNet = perCanopyAcre(0.217 * 0.74);          // NH gross x his 74% net ratio
    expect(nhNet).toBeCloseTo(2.38, 2);
    expect(open.mtco2eAcreYr).toBeCloseTo(nhNet * SEQUESTRATION_BASIS.campusCanopyCover, 1);
    // the figure this replaced: the GROSS US average per canopy acre
    expect(perCanopyAcre(0.277)).toBeCloseTo(4.11, 2);
    expect(open.mtco2eAcreYr).toBeLessThan(perCanopyAcre(0.277) / 2);
  });

  it('every mature stand sits below its Birdsey live-tree growth rate', () => {
    // Live-tree growth is gross of removals, so it is an upper bound on a net
    // increment for the same ground. Conversions re-derived here, not trusted.
    expect(fromLbC(1252)).toBeCloseTo(2.08, 2);   // US average
    expect(fromLbC(1386)).toBeCloseTo(2.31, 2);   // maple-beech-birch
    expect(fromLbC(1719)).toBeCloseTo(2.86, 2);   // oak-hickory
    expect(stand('north').mtco2eAcreYr).toBeLessThan(fromLbC(1386));
    expect(stand('french').mtco2eAcreYr).toBeLessThan(fromLbC(1719));
  });

  it('every stand records the published figure its rate came from', () => {
    for (const s of forestStands) {
      expect(typeof s.rateBasis).toBe('string');
      expect(s.rateBasis.length).toBeGreaterThan(10);
    }
  });
});
