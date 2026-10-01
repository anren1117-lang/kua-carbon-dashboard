// What the campus map and the building comparison actually measure.
//
// Phase 491 found the dorm leaderboard ranking a fifth of a dorm's footprint.
// The same roll-up — utils/buildingEmissions.js — also feeds /campus-map and
// /compare-buildings, for EVERY building, and there the consequence is worse
// than incompleteness.
//
// Heating intensity varies by category: a dorm is modelled at 75 kBtu/sqft/yr,
// an academic building at 55, an athletic one at 45 (HEATING_KBTU_PER_SQFT).
// So omitting heat does not scale every building down by the same factor — it
// REORDERS them. "Top 5 by total emissions / where the absolute most carbon
// comes from" named the wrong building first and the wrong building fifth.
//
// The modelled heat sums to within ~6% of the campus Scope 1 heating figure
// that scopeTotals.js derives independently, which is the check that this is
// the same method rather than a second invention.
//
// Unlike the dorm leaderboard, folding heat in here is the RIGHT move rather
// than a tempting mistake, and the difference is what the surface is for. The
// leaderboard is competitive — adding a term that is floor area times one
// constant would rank square feet per resident, which no student controls. The
// map is descriptive: it answers "where does the carbon come from", heat varies
// by category and area, and leaving out three quarters of the answer is the
// larger error. So the total is published here. It stays labelled as modelled,
// and the metered electricity stays separately visible, because one of these
// came off a meter and the other came off a spreadsheet.

import { buildings } from './buildings.js';
import { HEATING_KBTU_PER_SQFT } from './geographicEstimates.js';
import { HEATING_KG_PER_MMBTU } from './scopeTotals.js';
import { computeBuildingEmissions } from '../utils/buildingEmissions.js';

/** Modelled annual heating mtCO2e for a floor area at a category intensity. */
export function modelledHeatMt(sqft, category = 'Dorm') {
  const mmbtu = (sqft * (HEATING_KBTU_PER_SQFT[category] ?? HEATING_KBTU_PER_SQFT.Other)) / 1000;
  return (mmbtu * HEATING_KG_PER_MMBTU) / 1000;
}

const categoryById = Object.fromEntries(buildings.map((b) => [b.id, b.category]));

/** Metered electricity beside modelled heat, one row per building. */
export const BUILDING_ENERGY_SPLIT = computeBuildingEmissions().rows.map((r) => {
  const category = categoryById[r.id];
  // Round the parts first, then sum them. Summing the unrounded values and
  // rounding the total leaves a row whose two published components do not add
  // up to its own published total — a 0.1 mt discrepancy that a reader
  // checking the arithmetic would find before we did.
  const elecMt = +r.mtCO2e.toFixed(1);
  const heatMt = +modelledHeatMt(r.sqft, category).toFixed(1);
  return {
    id: r.id,
    name: r.name,
    category,
    sqft: r.sqft,
    elecMt,
    heatMt,
    totalMt: +(elecMt + heatMt).toFixed(1),
  };
});

const ELEC_MT = BUILDING_ENERGY_SPLIT.reduce((s, r) => s + r.elecMt, 0);
const HEAT_MT = BUILDING_ENERGY_SPLIT.reduce((s, r) => s + r.heatMt, 0);

/** Share of the modelled building footprint that an electricity-only view omits. */
export const CAMPUS_HEAT_SHARE_PCT = Math.round((HEAT_MT / (HEAT_MT + ELEC_MT)) * 100);

const topN = (key, n = 5) => BUILDING_ENERGY_SPLIT
  .slice().sort((a, b) => b[key] - a[key]).slice(0, n);

export const TOP5_BY_ELECTRICITY = topN('elecMt');
export const TOP5_BY_TOTAL = topN('totalMt');

/** Buildings whose top-5 membership depends on whether heat is counted. */
export const TOP5_DISAGREEMENT = {
  electricityOnly: TOP5_BY_ELECTRICITY
    .filter((r) => !TOP5_BY_TOTAL.some((t) => t.id === r.id)).map((r) => r.name),
  withHeat: TOP5_BY_TOTAL
    .filter((r) => !TOP5_BY_ELECTRICITY.some((e) => e.id === r.id)).map((r) => r.name),
  firstPlaceDiffers: TOP5_BY_ELECTRICITY[0].id !== TOP5_BY_TOTAL[0].id,
};

export const BUILDING_ENERGY_BASIS = {
  meteredElectricityMt: +ELEC_MT.toFixed(1),
  modelledHeatMt: +HEAT_MT.toFixed(1),
  heatSharePct: CAMPUS_HEAT_SHARE_PCT,
  heatMethod:
    `floor area x NH-CZ6 intensity by category (Dorm ${HEATING_KBTU_PER_SQFT.Dorm}, `
    + `Academic ${HEATING_KBTU_PER_SQFT.Academic}, Athletic ${HEATING_KBTU_PER_SQFT.Athletic}, `
    + `Dining ${HEATING_KBTU_PER_SQFT.Dining} kBtu/sqft/yr) x ${HEATING_KG_PER_MMBTU.toFixed(1)} kg/MMBtu`,
  whyItReorders:
    'Heating intensity differs by category, so dropping heat does not scale buildings uniformly. '
    + 'It changes which building ranks first and which sits fifth.',
  electricityIsMetered: true,
  heatIsModelled: true,
};
