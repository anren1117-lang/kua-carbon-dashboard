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
 * @property {number} mtco2eAcreYr    Sequestration rate (Birdsey 1992 / Nowak 2013)
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
