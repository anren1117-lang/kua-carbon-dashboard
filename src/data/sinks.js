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
 * @property {string} rateBasis       The published figure this rate came from.
 * @property {number} mtco2eAcreYr    Net annual increment, mtCO2e/acre/yr.
 * @property {string} dominantSpecies
 */

/** @type {ForestStand[]} */
export const forestStands = [
  { id: 'stand_north',     name: 'North Hill — mixed hardwood',          acres: 320, type: 'mixed_hardwood', ageClass: 'mature',       mtco2eAcreYr: 1.79, dominantSpecies: 'Sugar maple, red oak, yellow birch',
    rateBasis: 'GTR NE-343 maple-beech-birch, 65-95 yr band (the band holding ~65% of NH forest carbon)' },
  { id: 'stand_potato',    name: 'Potato Patch — pine + transitional',    acres: 180, type: 'transitional',   ageClass: 'intermediate', mtco2eAcreYr: 2.20, dominantSpecies: 'White pine, red maple, beech',
    rateBasis: 'GTR NE-343 maple-beech-birch at 35-55 yr (2.70 falling to 2.23), blended down for the pine component' },
  { id: 'stand_chellis',   name: 'Chellis Pond riparian',                 acres:  60, type: 'mixed_hardwood', ageClass: 'mature',       mtco2eAcreYr: 1.69, dominantSpecies: 'Eastern hemlock, yellow birch',
    rateBasis: 'GTR NE-343 spruce-balsam fir, 65-95 yr — the closest published type for a hemlock-dominated riparian stand' },
  { id: 'stand_south',     name: 'South ridge — softwood',                acres: 240, type: 'softwood',       ageClass: 'mature',       mtco2eAcreYr: 1.15, dominantSpecies: 'White pine, hemlock',
    rateBasis: 'GTR NE-343 white-red-jack pine, 65-95 yr' },
  { id: 'stand_open',      name: 'Open-grown campus trees',               acres:  40, type: 'open_grown',     ageClass: 'mature',       mtco2eAcreYr: 1.31, dominantSpecies: 'Sugar maple, oak, elm (street trees)',
    rateBasis: 'Nowak 2013 New Hampshire NET rate, 2.38 mtCO2e per acre of CANOPY, x 55% canopy cover — the denominator is canopy, not ground' },
  { id: 'stand_athletic',  name: 'Athletic-fields buffer',                acres: 100, type: 'transitional',   ageClass: 'young',        mtco2eAcreYr: 3.00, dominantSpecies: 'White ash, black cherry, red maple',
    rateBasis: 'GTR NE-343 maple-beech-birch peak increment 3.28 at 25-35 yr, blended down for the pine component' },
  { id: 'stand_french',    name: 'French\'s Ledges — slope hardwood',     acres:  60, type: 'mixed_hardwood', ageClass: 'mature',       mtco2eAcreYr: 2.17, dominantSpecies: 'Red oak, sugar maple',
    rateBasis: 'GTR NE-343 oak-hickory 2.55 at 65-95 yr blended with maple-beech-birch 1.79' },
];

/**
 * What the per-acre rates above measure, and what they assume.
 *
 * Task #16, decided: the sink is priced on a NET basis. The rates were
 * previously growth-side figures answering a different question — Birdsey 1992
 * Table 2.14 is accumulation in LIVE TREES, gross of harvest removals and
 * excluding soil, forest floor, dead wood and understory; and the open-grown
 * rate was Nowak 2013's GROSS US average per m2 of CANOPY, applied per acre of
 * ground. Together those put the total at 2,650, the top of every published
 * spread.
 *
 * They now come from the GTR NE-343 yield tables (Smith, Heath, Skog & Birdsey
 * 2006) — net annual increment for UNHARVESTED Northeastern stands across all
 * non-soil pools — with Nowak's own New Hampshire NET rate for the open-grown
 * acres, scaled by canopy cover.
 *
 * Increment by age, maple-beech-birch (GTR NE-343, mtCO2e/acre/yr):
 *   15-25  3.12  |  25-35  3.28 (peak)  |  35-45  2.70  |  55-65  2.23
 *   75-85  1.78  |  85-95  1.59         |  115-125 1.05
 * Means for the 65-95 yr band by type: maple-beech-birch 1.79, oak-hickory
 * 2.55, spruce-balsam fir 1.69, white-red-jack pine 1.15.
 *
 * The result is ~1.83 mtCO2e/acre/yr. For comparison, the age-weighted central
 * for a flat NH-typical mature mix is 1.77, and this dashboard's own
 * four-method spread — computed years earlier by an unrelated route — centres
 * on 1.73. This table sits a little above both because the forest genuinely
 * contains a young stand, an intermediate stand and open-grown trees.
 *
 * Two assumptions are doing real work and are stated rather than buried:
 *
 *   No harvest. GTR NE-343 yield tables model unharvested stands. NH
 *   timberland as a whole runs growth:removals of about 1.9:1, which is why
 *   statewide net rates (EPA 1.00, Domke 0.84) land lower. KUA does not
 *   harvest its woodlot; if that changes, so does this number.
 *
 *   Canopy cover. Nowak's rate is per acre of tree canopy. The 40 open-grown
 *   acres are campus ground, not closed canopy, so the rate is scaled. 55% is
 *   an assumption and the easiest input here to replace with a measurement —
 *   canopy cover is readable straight off aerial imagery.
 *
 * Soil carbon is excluded: GTR NE-343 holds soil organic carbon constant
 * across age classes, and NH FIA reports statewide forest carbon stocks
 * falling 0.5% since 2012, so including it would not raise this figure.
 */
export const SEQUESTRATION_BASIS = {
  basis: 'net annual increment, unharvested stands, all non-soil pools',
  source: 'Smith, Heath, Skog & Birdsey 2006 (USDA FS GTR NE-343) yield tables; open-grown from Nowak et al. 2013 New Hampshire NET rate',
  assumesNoHarvest: true,
  excludesSoilCarbon: true,
  campusCanopyCover: 0.55,
  retiredBasis: 'live-tree growth gross of removals (Birdsey 1992) plus Nowak gross US urban canopy — gave 2,650',
  publishedNetComparators: [
    { source: 'EPA GHG Equivalencies (2024)', mtco2eAcreYr: 1.00, basis: 'all five pools, net of harvest and disturbance, national' },
    { source: 'Domke et al., USDA FS RU FS-382', mtco2eAcreYr: 0.84, basis: 'forest land remaining forest land, 1990-2020, national' },
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
