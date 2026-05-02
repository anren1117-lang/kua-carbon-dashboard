// Barrel export for the data layer. Components and API routes should import
// from here rather than reaching into individual files.

export { emissionFactors, getFactor, getFactorByKey } from './emissionFactors.js';
export { buildings, getBuilding } from './buildings.js';
export { meters, getMeter, listMetersForBuilding } from './meters.js';
export { gridMix, GRID_MIX_TOTAL_MTCO2E, GRID_MIX_TOTAL_KWH, GRID_MIX_YEAR } from './gridMix.js';
export { dayOfWeekPattern, monthlyPattern, hourOfDayShape } from './seasonalPatterns.js';
export { dorms, getDorm } from './dorms.js';
export { students, TOTAL_STUDENTS } from './students.js';
export { staff, TOTAL_STAFF } from './staff.js';
export { diningMenuItems, diningVendors, ingredientPurchases, foodWasteLogs, menuScenarios } from './dining.js';
export { fleetVehicles, fleetFuelLogs, commuteSurveyResponses, carpoolTrips, schoolTrips, airTravelRecords } from './transportation.js';
export { envysionSnapshot } from './envysionSnapshot.js';
export { wasteLogs } from './waste.js';
export { procurementRecords } from './procurement.js';
export { reductionActions } from './reductionActions.js';
export { knowledgeArticles } from './learningContent.js';
