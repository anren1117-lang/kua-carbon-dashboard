import { GRID_MIX_TOTAL_MTCO2E, GRID_MIX_ANNUAL_MTCO2E } from './gridMix.js';
import { ANNUAL_SEQUESTRATION_MT } from './sinks.js';
import { SINKS_RECONCILIATION } from './geographicEstimates.js';
import { TOTAL_STUDENTS } from './students.js';
import {
  SCOPE1_TOTAL_MT as KUA_SCOPE1_TOTAL_MT,
  SCOPE3_TOTAL_MT as KUA_SCOPE3_TOTAL_MT,
  SCOPE3_LARGEST_LABEL,
  SCOPE3_LARGEST_LINE,
} from './scopeTotals.js';

const KUA_SCOPE2_ANNUAL_MT = GRID_MIX_ANNUAL_MTCO2E;
const round1 = (n) => Math.round(n * 10) / 10;

// Peer per-student footprints, and what can honestly be said with them.
//
// EVERY PEER ROW IS AN ILLUSTRATIVE SHAPE. None of these schools publishes a
// per-student inventory — two of the notes below say outright that the figure
// was not researched. That single fact governs how they may be used: they can
// show that boundary choices move a number, and they cannot support a ranking
// in either direction.
//
// This matters because the dashboard has made the mistake twice, in opposite
// directions. It first said KUA's net "is lower" than peers, comparing KUA's
// net against their gross. The correction then asserted KUA is "above every
// one of them" on gross — a stricter claim, read off the same unresearched
// numbers, in the document that goes to a board. Both are rankings. Neither is
// available from this data.
//
// What IS available is the arithmetic of KUA's own boundary, which needs no
// peer at all: the same campus reports 13.4 or 7.8 per student depending on
// whether the forest sink is subtracted.
//
// And a second boundary, which the sink framing hid. KUA's Scope 1+2 is 5.4
// per student against peer shapes of 4.5-5.5 — the energy side is comparable.
// The whole of the gross gap is Scope 3: KUA counts purchased goods, dining,
// waste and commuting (8.0/student) where these shapes carry 3.5-4.5 and no
// published Scope 3 breakdown at all. Attributing that gap to the forest, as
// this dashboard did, was wrong twice over.

export const peers = [
  { name: 'KUA',                          type: 'boarding-secondary', isUs: true, provenance: 'cited', sinksQuantified: true,
    scope1:  round1(KUA_SCOPE1_TOTAL_MT / TOTAL_STUDENTS),
    scope2:  round1(KUA_SCOPE2_ANNUAL_MT / TOTAL_STUDENTS),
    scope3:  round1(KUA_SCOPE3_TOTAL_MT / TOTAL_STUDENTS),
    sinks:   round1(-ANNUAL_SEQUESTRATION_MT / TOTAL_STUDENTS),
    offsets: 0,
    note: `Preliminary per-student figures from KUA gross/sinks ÷ ${TOTAL_STUDENTS} enrolled students (Wikipedia + KUA "By the Numbers"). Scope 1 = ${KUA_SCOPE1_TOTAL_MT.toLocaleString()} mt heating fuel + refrigerants + fleet. Scope 2 = ${Math.round(KUA_SCOPE2_ANNUAL_MT).toLocaleString()} mt — Year 1 projection from BMS-measured kWh × ISO-NE 2024 per-fuel factors (${GRID_MIX_TOTAL_MTCO2E.toFixed(1)} mt YTD seasonally extrapolated). Scope 3 = ${KUA_SCOPE3_TOTAL_MT.toLocaleString()} mt — led by ${SCOPE3_LARGEST_LABEL} (${SCOPE3_LARGEST_LINE.shareOfScope3}% of Scope 3), then international and US-boarder term-break travel. Sinks = ${Math.round(ANNUAL_SEQUESTRATION_MT).toLocaleString()} mt from ~1,000 acres of campus forest (campus is 1,300 acres total; ~1,000 forested) on a net basis, inside a ${SINKS_RECONCILIATION.methodCount}-method range (${SINKS_RECONCILIATION.lowMt.toLocaleString()}–${SINKS_RECONCILIATION.highMt.toLocaleString()}) and above its central of ${SINKS_RECONCILIATION.centralMt.toLocaleString()}, because the other methods average in harvested acres and KUA does not harvest — which matters here, because the sink is what puts KUA ahead of its peers.` },
  { name: 'Phillips Exeter Academy (NH)', type: 'boarding-secondary', provenance: 'estimated', sinksQuantified: false,
    scope1: 4.0, scope2: 1.5, scope3: 4.5, sinks: 0, offsets: 0,
    note: 'ESTIMATED SHAPE, not a published figure. Exeter publishes a 2023 plan ("Building from Strength Toward a Zero Carbon Future") with targets — 75% cut in Scope 1+2 from a 2005 baseline by 2031, zero by 2050, and roughly 60% achieved since 2005 — but no per-student inventory and no Scope 3 breakdown we could locate. The split above is an order-of-magnitude sketch for a larger boarding cohort in older buildings on heating oil. Sinks: not quantified in their reporting, which is not the same as zero.' },
  { name: 'Phillips Academy Andover (MA)',type: 'boarding-secondary', provenance: 'estimated', sinksQuantified: false,
    scope1: 3.5, scope2: 1.5, scope3: 4.0, sinks: 0, offsets: 0,
    note: 'ESTIMATED SHAPE, not a published figure. Andover publishes a Climate Action Plan 2019–2030 (adopted 2018) with a 30% mtCO₂e reduction target plus water and 90%-diversion waste goals, and annual FY tracking — but no per-student inventory we could locate. Sinks: not quantified, which is not the same as zero.' },
  { name: 'Lawrenceville School (NJ)',    type: 'boarding-secondary', provenance: 'estimated', sinksQuantified: false,
    scope1: 3.0, scope2: 2.0, scope3: 4.0, sinks: 0, offsets: 0,
    note: 'ESTIMATED SHAPE. We did not locate a published inventory for Lawrenceville and did not research it directly — treat this row as an illustrative boarding-school profile only. Sinks: not quantified.' },
  { name: 'Choate Rosemary Hall (CT)',    type: 'boarding-secondary', provenance: 'estimated', sinksQuantified: false,
    scope1: 3.0, scope2: 1.5, scope3: 3.5, sinks: 0, offsets: 0,
    note: 'ESTIMATED SHAPE. We did not locate a published inventory for Choate and did not research it directly — illustrative peer profile only. Sinks: not quantified.' },
  { name: 'Middlebury College',           type: 'college', provenance: 'estimated', sinksQuantified: false,
    scope1: 2.0, scope2: 1.0, scope3: 2.5, sinks: 0, offsets: 0,
    note: 'ESTIMATED SHAPE for the scope split. The neutrality story, however, is documented and was previously described incorrectly here: Middlebury reached carbon neutrality in 2016 mostly through REAL REDUCTIONS — a $12M biomass plant cut No. 6 fuel oil by 91% (2M → ~185,000 gal), three solar arrays totalling 1,150 kW supply ~8% of electricity, and 87 Efficiency Vermont projects saved 4.52M kWh. The residual was closed with carbon credits quantified from their OWN 2,100 acres of Bread Loaf forestland, preserved in perpetuity under a Vermont Land Trust easement. The old drawdown figure of −5.5 was unsourced and is removed rather than guessed at.' },
  { name: 'Williams College',             type: 'college', provenance: 'estimated', sinksQuantified: false,
    scope1: 2.5, scope2: 1.0, scope3: 2.5, sinks: 0, offsets: 0,
    note: 'ESTIMATED SHAPE. We did not locate a published inventory for Williams and did not research it directly — illustrative cold-climate residential-college profile. Sinks: not quantified.' },
  { name: 'Yale University',              type: 'university', provenance: 'estimated', sinksQuantified: false,
    scope1: 1.5, scope2: 1.0, scope3: 1.5, sinks: 0, offsets: 0,
    note: 'ESTIMATED SHAPE, not a published per-capita figure. Yale publishes progress in PERCENTAGES (Scope 1+2 down ~28% against a 2015 baseline; a 2005 baseline of 263,119 mtCO₂e; Scope 3 category trends against 2020) rather than a per-FTE number we could cite. Sinks: not quantified.' },
];

export const BOARDING_TYPE = 'boarding-secondary';
const boarding = peers.filter((p) => p.type === BOARDING_TYPE && !p.isUs);
if (boarding.length === 0) {
  // Math.min of nothing is Infinity, and a board document would render
  // "Infinity–-Infinity" while the tests passed vacuously (netPer < Infinity).
  throw new Error('peerSchools: no boarding-secondary peers — the band would be Infinity');
}
const kua = peers.find((p) => p.isUs);
// Formatted strings, not numbers. The chart renders peers with toFixed(1)
// ("8.0"), and the band was rendering Math.round(...*10)/10 ("8") into the
// same board paragraph as a 7.8 and a 13.4 — three precisions for one
// quantity. Returning strings stops any caller re-rounding differently.
const d1 = (n) => (Math.round(n * 10) / 10).toFixed(1);
const grossOf = (p) => p.scope1 + p.scope2 + p.scope3;
const scope12Of = (p) => p.scope1 + p.scope2;

/**
 * The comparison set, derived once. Consumed by the chart, the annual report
 * and the learning path so the three cannot quote different bands — the
 * annual report and a lesson 620 lines apart previously disagreed about
 * whether the band was 6-10 or 8-10.
 */
export const BOARDING_PEER_BAND = {
  count: boarding.length,
  minGrossPerStudent: d1(Math.min(...boarding.map(grossOf))),
  maxGrossPerStudent: d1(Math.max(...boarding.map(grossOf))),
  minScope12PerStudent: d1(Math.min(...boarding.map(scope12Of))),
  maxScope12PerStudent: d1(Math.max(...boarding.map(scope12Of))),
  minScope3PerStudent: d1(Math.min(...boarding.map((p) => p.scope3))),
  maxScope3PerStudent: d1(Math.max(...boarding.map((p) => p.scope3))),
  // Both false today, and the two flags are why no ranking is supportable.
  anyPublishPerStudent: boarding.some((p) => p.provenance === 'cited'),
  anyQuantifySinks: boarding.some((p) => p.sinksQuantified === true),
  kuaScope12PerStudent: kua ? d1(scope12Of(kua)) : null,
  kuaScope3PerStudent: kua ? d1(kua.scope3) : null,
};

/** Plain-language statement of what these figures may and may not be used for. */
export const PEER_USE_CAVEAT =
  'None of these schools publishes a per-student inventory. The bars are illustrative '
  + 'shapes drawn from published targets, not reported results, so they show how much '
  + 'boundary choices move a number and cannot rank one school against another.';
