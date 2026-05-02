// Point-in-time snapshot of Envysion building meter observations
// (Jan 27 – Feb 25, 2026 reporting window). The annualBaseline values live
// on the meter registry; this file captures the observed instantaneous
// power and voltage that the live dashboard displays alongside.

/**
 * @typedef {Object} EnvysionSnapshotRow
 * @property {string} buildingId
 * @property {number} energyUsedKwh    Period kWh (per Envysion report)
 * @property {number} powerKw          Last-observed instantaneous demand
 * @property {number} avgVoltage
 */

/** @type {EnvysionSnapshotRow[]} */
export const envysionSnapshot = [
  { buildingId: 'b_miller',     energyUsedKwh: 44695, powerKw: 72.7, avgVoltage: 209 },
  { buildingId: 'b_whittemore', energyUsedKwh: 43193, powerKw: 74.7, avgVoltage: 205 },
  { buildingId: 'b_barrette',   energyUsedKwh: 35365, powerKw: 28.1, avgVoltage: 209 },
  { buildingId: 'b_kilton',     energyUsedKwh: 20069, powerKw: 20.1, avgVoltage: 121 },
  { buildingId: 'b_fitch',      energyUsedKwh: 15427, powerKw: 21.0, avgVoltage: 209 },
  { buildingId: 'b_silvergym',  energyUsedKwh: 11407, powerKw: 10.2, avgVoltage: 208 },
  { buildingId: 'b_flickinger', energyUsedKwh:  9717, powerKw: 17.2, avgVoltage: 210 },
  { buildingId: 'b_chellis',    energyUsedKwh:  5217, powerKw:  7.1, avgVoltage: 240 },
  { buildingId: 'b_welch',      energyUsedKwh:  5511, powerKw: 12.0, avgVoltage: 121 },
  { buildingId: 'b_dexter',     energyUsedKwh:  5105, powerKw:  0.6, avgVoltage: 209 },
  { buildingId: 'b_densmore',   energyUsedKwh:  4768, powerKw: 11.0, avgVoltage: 209 },
  { buildingId: 'b_kurth',      energyUsedKwh:  3784, powerKw:  2.8, avgVoltage: 243 },
  { buildingId: 'b_baxter',     energyUsedKwh:  2403, powerKw:  1.9, avgVoltage: 209 },
  { buildingId: 'b_bryant',     energyUsedKwh:  2288, powerKw:  3.9, avgVoltage: 209 },
  { buildingId: 'b_rowe',       energyUsedKwh:  2072, powerKw:  2.2, avgVoltage: 208 },
  { buildingId: 'b_bishop',     energyUsedKwh:  1826, powerKw:  1.6, avgVoltage: 239 },
  { buildingId: 'b_childcare',  energyUsedKwh:  1738, powerKw:  0.6, avgVoltage: 209 },
  { buildingId: 'b_mikula',     energyUsedKwh:  1595, powerKw:  1.6, avgVoltage: 240 },
];
