// On-campus carbon sinks — forest sequestration + soil organic carbon.
// KUA's roughly 1,000 acres of forest are the single biggest reason the
// school's net footprint approaches zero. Most peer boarding schools
// don't measure their forest at all, so the KUA number reads lower than
// competitors largely because of the inventory below.
//
// Numbers are preliminary estimates derived from public foresty rates;
// replace stand-level acres + dominant species with a real walk-through
// inventory once the AAS / forestry consultant report is in hand.

/**
 * @typedef {Object} ForestStand
 * @property {string} id
 * @property {string} name
 * @property {number} acres
 * @property {'mixed_hardwood'|'softwood'|'transitional'|'open_grown'} type
 * @property {string} ageClass        'young' | 'intermediate' | 'mature' | 'old_growth'
 * @property {number} mtco2eAcreYr    Per-acre rate (Birdsey 1992 / Nowak 2013).
 *   NOT net ecosystem sequestration — see SEQUESTRATION_BASIS below for what
 *   these two sources actually measure and why it matters.
 * @property {string} dominantSpecies
 */

/** @type {ForestStand[]} */
export const forestStands = [
  { id: 'stand_north',     name: 'North Hill — mixed hardwood',          acres: 320, type: 'mixed_hardwood', ageClass: 'mature',       mtco2eAcreYr: 2.8, dominantSpecies: 'Sugar maple, red oak, yellow birch' },
  { id: 'stand_potato',    name: 'Potato Patch — pine + transitional',    acres: 180, type: 'transitional',   ageClass: 'intermediate', mtco2eAcreYr: 3.2, dominantSpecies: 'White pine, red maple, beech' },
  { id: 'stand_chellis',   name: 'Chellis Pond riparian',                 acres:  60, type: 'mixed_hardwood', ageClass: 'mature',       mtco2eAcreYr: 2.4, dominantSpecies: 'Eastern hemlock, yellow birch' },
  { id: 'stand_south',     name: 'South ridge — softwood',                acres: 240, type: 'softwood',       ageClass: 'mature',       mtco2eAcreYr: 1.9, dominantSpecies: 'White pine, hemlock' },
  { id: 'stand_open',      name: 'Open-grown campus trees',               acres:  40, type: 'open_grown',     ageClass: 'mature',       mtco2eAcreYr: 4.2, dominantSpecies: 'Sugar maple, oak, elm (street trees)' },
  { id: 'stand_athletic',  name: 'Athletic-fields buffer',                acres: 100, type: 'transitional',   ageClass: 'young',        mtco2eAcreYr: 2.6, dominantSpecies: 'White ash, black cherry, red maple' },
  { id: 'stand_french',    name: 'French\'s Ledges — slope hardwood',     acres:  60, type: 'mixed_hardwood', ageClass: 'mature',       mtco2eAcreYr: 2.5, dominantSpecies: 'Red oak, sugar maple' },
];

/**
 * What the per-acre rates above actually measure — the thing that decides
 * whether the adopted total is right.
 *
 * Both sources are real and correctly transcribed. Neither was published to
 * answer "how much CO2 does this property remove from the atmosphere in a
 * year", which is the question this dashboard asks them.
 *
 *   Birdsey 1992 (USDA WO-59), Table 2.14 — "annual average accumulation of
 *   carbon in LIVE TREES on timberland". Derived from FIA net annual growth
 *   of growing stock: gross growth minus mortality, and NOT minus harvest
 *   removals. It excludes soil, forest floor, dead wood and understory.
 *   Northeast/Mid-Atlantic by type (lb C/acre/yr -> mtCO2e/acre/yr):
 *   oak-pine 1,911 -> 3.18, oak-hickory 1,719 -> 2.86, maple-beech-birch
 *   1,386 -> 2.31, white-red-jack pine 1,115 -> 1.85, spruce-fir 968 -> 1.61;
 *   all NE timberland 1,447 -> 2.41; US average 1,252 -> 2.08.
 *
 *   Nowak et al. 2013, Environmental Pollution 178:229-236 — urban and
 *   community trees across 28 cities and 6 states. The widely quoted 0.277
 *   kg C/m2/yr is the GROSS rate (-> 4.11 mtCO2e per acre of CANOPY/yr, which
 *   is where 4.2 comes from). Nowak's own NET rate is 0.205, i.e. 74% of
 *   gross. His New Hampshire row is 0.217 gross -> 2.38 net. And the
 *   denominator is acres of tree canopy, not acres of land.
 *
 * So the rates here are growth-side numbers. Published NET figures for the
 * same acreage run lower: EPA GHG Equivalencies 1.00 mtCO2e/acre/yr (all five
 * pools, net of harvest and disturbance); USDA FS Domke et al. 0.84; and
 * Smith/Heath/Skog/Birdsey 2006 (GTR NE-343) yield tables give 1.6-2.0 for
 * unharvested NE hardwood at 65-95 years, the age band holding ~65% of NH
 * forest carbon.
 *
 * Whether to reprice on that basis is an open decision, tracked as task #16.
 * SINKS_RECONCILIATION in geographicEstimates.js publishes the gap meanwhile.
 */
export const SEQUESTRATION_BASIS = {
  measures: 'live-tree growth (Birdsey) and gross urban canopy sequestration (Nowak)',
  excludesHarvestRemovals: true,
  excludesNonLiveTreePools: true,
  nowakGrossToNetRatio: 0.74,
  publishedNetComparators: [
    { source: 'EPA GHG Equivalencies (2024)', mtco2eAcreYr: 1.00, basis: 'all five pools, net of harvest and disturbance' },
    { source: 'Domke et al., USDA FS RU FS-382', mtco2eAcreYr: 0.84, basis: 'forest land remaining forest land, 1990-2020' },
    { source: 'Smith et al. 2006, GTR NE-343', mtco2eAcreYr: 1.8, basis: 'unharvested NE hardwood, 65-95 yr, non-soil pools' },
  ],
};

export const TOTAL_FOREST_ACRES = forestStands.reduce((s, st) => s + st.acres, 0);
export const ANNUAL_SEQUESTRATION_MT = forestStands.reduce(
  (s, st) => s + st.acres * st.mtco2eAcreYr,
  0,
);

/**
 * @typedef {Object} SoilSample
 * @property {string} id
 * @property {string} standId
 * @property {string} sampledAt        ISO date
 * @property {number} depthCm
 * @property {number} percentOrganicC  % organic carbon by mass
 * @property {string} lab
 */

/** @type {SoilSample[]} */
export const soilSamples = [
  { id: 'ss_001', standId: 'stand_north',    sampledAt: '2025-09-12', depthCm: 30, percentOrganicC: 4.2, lab: 'UNH Cooperative Extension' },
  { id: 'ss_002', standId: 'stand_north',    sampledAt: '2025-09-12', depthCm: 60, percentOrganicC: 1.8, lab: 'UNH Cooperative Extension' },
  { id: 'ss_003', standId: 'stand_potato',   sampledAt: '2025-09-19', depthCm: 30, percentOrganicC: 5.1, lab: 'UNH Cooperative Extension' },
  { id: 'ss_004', standId: 'stand_chellis',  sampledAt: '2025-09-26', depthCm: 30, percentOrganicC: 6.4, lab: 'UNH Cooperative Extension' },
  { id: 'ss_005', standId: 'stand_south',    sampledAt: '2025-10-03', depthCm: 30, percentOrganicC: 3.7, lab: 'UNH Cooperative Extension' },
  { id: 'ss_006', standId: 'stand_open',     sampledAt: '2025-10-10', depthCm: 30, percentOrganicC: 4.8, lab: 'UNH Cooperative Extension' },
  { id: 'ss_007', standId: 'stand_athletic', sampledAt: '2025-10-17', depthCm: 30, percentOrganicC: 2.9, lab: 'UNH Cooperative Extension' },
];

// Typical soil bulk density for NH forest topsoil ≈ 1.0 g/cm³ for the top 30 cm.
// Mass of soil per acre to 30 cm ≈ 1,200 metric tons.
// One % organic-C → 12 mt C/acre → 44 mt CO2e/acre stored.
export const SOIL_BULK_DENSITY_T_ACRE_30CM = 1200;
export const C_TO_CO2E = 44 / 12;

/** Estimate currently-stored soil carbon (mtCO2e) given an avg %OC for the top 30 cm. */
export function soilCarbonStored(percentOrganicC, acres) {
  return percentOrganicC * 0.01 * SOIL_BULK_DENSITY_T_ACRE_30CM * acres * C_TO_CO2E;
}
