// What the dorm comparison actually measures — and what it leaves out.
//
// /buildings ranks dorms on "kWh per student per day" and /student-challenges
// ranks them on kg CO2e per resident. Both read the electricity meter and
// nothing else. No heating fuel is attributed per building anywhere in this
// repo: utils/buildingEmissions.js converts kWh to mtCO2e with the grid factor
// and stops there, and Scope 1 heating is modelled at campus level only.
//
// That omission is not a rounding detail. Priced with the same NH-CZ6 dorm
// intensity Scope 1 already uses, heating is roughly FOUR FIFTHS of a dorm's
// footprint. The electricity ranking is a ranking of the remaining fifth.
//
// Worse than incomplete, it is biased in a specific direction: a dorm that
// heats with oil keeps its largest emission source off the board entirely,
// while a dorm running heat pumps shows that same heat as electricity and
// ranks WORSE for having electrified. Kilton — the hall KUA renovated and
// expanded from 14 to 32 beds — currently ranks heaviest on electricity per
// resident and carries the LOWEST modelled heat share of any dorm, which is
// what partial electrification looks like from the outside.
//
// WHY THE MODELLED HEAT IS NOT FOLDED INTO THE RANKING. It would be easy to
// add heatMt to elecMt and call the leaderboard complete. It would also be
// worse. Modelled heat here is sqft x one intensity constant, identical for
// every dorm, so it carries exactly zero per-dorm information — adding it at
// ~78% weight would turn a behaviour leaderboard into a ranking of SQUARE FEET
// PER RESIDENT, which no student can change, while looking more rigorous. So
// the heat figure is published as context and scale, and the ranking stays on
// the quantity that was actually metered. Per-dorm fuel deliveries are what
// would change this; nothing else.

import { buildings } from './buildings.js';
import { dorms } from './dorms.js';
import { envysionSnapshot } from './envysionSnapshot.js';
import { SNAPSHOT_ANNUALIZE_FACTOR } from './composedYtd.js';
import { KG_PER_KWH } from './gridMix.js';
import { HEATING_KBTU_PER_SQFT } from './geographicEstimates.js';
import { HEATING_KG_PER_MMBTU } from './scopeTotals.js';

const snapshotById = Object.fromEntries(envysionSnapshot.map((r) => [r.buildingId, r]));
const buildingById = Object.fromEntries(buildings.map((b) => [b.id, b]));

/** Modelled annual heating mtCO2e for a floor area, at a category intensity. */
export function modelledHeatMt(sqft, category = 'Dorm') {
  const mmbtu = (sqft * (HEATING_KBTU_PER_SQFT[category] ?? HEATING_KBTU_PER_SQFT.Other)) / 1000;
  return (mmbtu * HEATING_KG_PER_MMBTU) / 1000;
}

/**
 * One row per MODELED dorm: the metered electricity the leaderboard ranks on,
 * beside the modelled heat it cannot see.
 */
export const DORM_ENERGY_SPLIT = dorms
  .filter((d) => d.modeled !== false)
  .map((d) => {
    const b = buildingById[d.buildingId];
    const annualKwh = (snapshotById[d.buildingId]?.energyUsedKwh ?? 0) * SNAPSHOT_ANNUALIZE_FACTOR;
    const elecMt = (annualKwh * KG_PER_KWH) / 1000;
    const heatMt = modelledHeatMt(b.sqft, 'Dorm');
    return {
      id: d.id,
      name: d.name,
      residents: d.population,
      sqft: b.sqft,
      elecMt: +elecMt.toFixed(2),
      heatMt: +heatMt.toFixed(2),
      heatSharePct: +((heatMt / (heatMt + elecMt)) * 100).toFixed(1),
      sqftPerResident: Math.round(b.sqft / d.population),
    };
  });

const ELEC_MT = DORM_ENERGY_SPLIT.reduce((s, r) => s + r.elecMt, 0);
const HEAT_MT = DORM_ENERGY_SPLIT.reduce((s, r) => s + r.heatMt, 0);

/** Share of a dorm's modelled footprint that the electricity ranking omits. */
export const DORM_HEAT_SHARE_PCT = Math.round((HEAT_MT / (HEAT_MT + ELEC_MT)) * 100);

/** The dorm whose modelled heat share is lowest — the most electrified. */
export const MOST_ELECTRIFIED_DORM = DORM_ENERGY_SPLIT
  .reduce((a, b) => (b.heatSharePct < a.heatSharePct ? b : a));

export const DORM_ENERGY_BASIS = {
  rankedOn: 'metered electricity only',
  omitted: 'heating fuel, which is not metered per building anywhere in this repo',
  omittedSharePct: DORM_HEAT_SHARE_PCT,
  electricityMt: +ELEC_MT.toFixed(1),
  modelledHeatMt: +HEAT_MT.toFixed(1),
  heatMethod: `floor area x NH-CZ6 dorm intensity (${HEATING_KBTU_PER_SQFT.Dorm} kBtu/sqft/yr) x ${HEATING_KG_PER_MMBTU.toFixed(1)} kg/MMBtu — the same method Scope 1 uses campus-wide`,
  heatFoldedIntoRanking: false,
  whyNotFolded:
    'Modelled heat is floor area times one constant, identical for every dorm, so it holds no '
    + 'per-dorm information. Folding it in at ~' + DORM_HEAT_SHARE_PCT + '% weight would rank square '
    + 'feet per resident rather than anything a resident controls.',
  biasDirection:
    'An oil-heated dorm keeps its largest source off the board; an electrified dorm shows that heat '
    + 'as electricity and ranks worse for it.',
  settledBy: 'per-dorm fuel deliveries',
};
