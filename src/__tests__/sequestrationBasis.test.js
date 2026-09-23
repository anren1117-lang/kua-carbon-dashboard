// The per-acre rates in sinks.js are growth-side numbers being used to answer
// a net-flux question. That is the whole of the 2,650-vs-1,730 gap, and it is
// the same mistake as pricing displaced electricity at the inventory average:
// the source is real and correctly transcribed, but it was published to answer
// a different question.
//
//   Birdsey 1992 Table 2.14 — annual accumulation of carbon in LIVE TREES on
//   timberland. FIA net annual growth of growing stock: gross growth minus
//   mortality, NOT minus harvest removals, and no soil / forest floor / dead
//   wood / understory.
//
//   Nowak et al. 2013 — the widely quoted 0.277 kg C/m²/yr is the GROSS rate,
//   per m² of CANOPY. Nowak's own net is 0.205, i.e. 74% of gross.
//
// These are checked by arithmetic, not by trusting the comment: the open-grown
// stand rate lands in the band Nowak's GROSS US figure converts to (4.11-4.15
// depending on whether you take 0.277 or the rounded 0.28), and well above his
// net — which is the evidence that the table took the gross number.
//
// Nothing here repriced anything. Whether to adopt a net basis is task #16.

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

/** kg C per m²/yr → mtCO2e per acre/yr */
const perCanopyAcre = (kgCperM2) => (kgCperM2 * M2_PER_ACRE / 1000) * C_TO_CO2;
/** lb C per acre/yr → mtCO2e per acre/yr */
const fromLbC = (lb) => (lb * LB_TO_KG / 1000) * C_TO_CO2;

describe('the per-acre rates are growth-side, and the code says so', () => {
  it('the basis is published alongside the rates', () => {
    expect(SEQUESTRATION_BASIS.excludesHarvestRemovals).toBe(true);
    expect(SEQUESTRATION_BASIS.excludesNonLiveTreePools).toBe(true);
    expect(SEQUESTRATION_BASIS.publishedNetComparators.length).toBeGreaterThanOrEqual(3);
  });

  it('the open-grown rate is Nowak GROSS, which is why it is the highest', () => {
    const openGrown = forestStands.find((s) => s.type === 'open_grown');
    expect(openGrown).toBeTruthy();
    // Nowak's gross US average, converted independently here
    expect(perCanopyAcre(0.277)).toBeCloseTo(4.11, 2);
    // 4.2 is a rounding of the gross figure (0.277 -> 4.11, the 0.28 the
    // references page quotes -> 4.15). Assert the band it came from rather
    // than a false precision the table never claimed.
    expect(openGrown.mtco2eAcreYr).toBeGreaterThan(perCanopyAcre(0.277) - 0.01);
    expect(openGrown.mtco2eAcreYr).toBeLessThan(perCanopyAcre(0.29));
    // his net is 74% of gross, and his NH row is lower still
    expect(SEQUESTRATION_BASIS.nowakGrossToNetRatio).toBeCloseTo(0.74, 2);
    expect(perCanopyAcre(0.205)).toBeCloseTo(3.04, 2);
    expect(perCanopyAcre(0.217 * 0.74)).toBeCloseTo(2.38, 2);
    // so the adopted rate exceeds the source's own NH net figure
    expect(openGrown.mtco2eAcreYr).toBeGreaterThan(perCanopyAcre(0.217 * 0.74));
  });

  it("Birdsey's US average converts to the 2.1 the pages cite", () => {
    expect(fromLbC(1252)).toBeCloseTo(2.08, 2);
    // and the NE/Mid-Atlantic types the stand table is drawn from
    expect(fromLbC(1719)).toBeCloseTo(2.86, 2);   // oak-hickory
    expect(fromLbC(1386)).toBeCloseTo(2.31, 2);   // maple-beech-birch
  });

  it('the weighted stand rate sits above every published NET comparator', () => {
    const weighted = ANNUAL_SEQUESTRATION_MT / TOTAL_FOREST_ACRES;
    expect(weighted).toBeCloseTo(2.65, 2);
    for (const c of SEQUESTRATION_BASIS.publishedNetComparators) {
      expect(weighted).toBeGreaterThan(c.mtco2eAcreYr);
    }
  });

  // Documented so it is not mistaken for a transcription error later: net
  // annual increment peaks in young/intermediate stands and declines with age
  // (GTR NE-343 yield tables; Birdsey 1992 p.1 states it in words). The stand
  // table currently inverts that. Asserting the INVERSION exists keeps the
  // finding visible without repricing it — flip this test when #16 is settled.
  it('records that the stand table inverts the age/increment relationship', () => {
    const matureHardwood = forestStands.find(
      (s) => s.ageClass === 'mature' && s.type === 'mixed_hardwood' && s.acres >= 300,
    );
    const young = forestStands.find((s) => s.ageClass === 'young');
    expect(matureHardwood).toBeTruthy();
    expect(young).toBeTruthy();
    // Backwards on the published yield tables, where young > mature.
    expect(matureHardwood.mtco2eAcreYr).toBeGreaterThan(young.mtco2eAcreYr);
  });
});
