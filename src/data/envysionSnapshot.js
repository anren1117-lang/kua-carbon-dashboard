// KUA Eclypse BMS year-to-date readings, captured 2026-05-03 04:08 ET
// from the All Meters page of the on-campus dashboard at 10.1.1.27.
//
// energyUsedKwh is the year-to-date kWh that meter has logged from
// 2026-01-01 through the capture timestamp (123 days). powerKw and
// avgVoltage are the instantaneous demand + average voltage at the
// time of capture. Replace with live BmsMeterAdapter readings once
// the on-campus relay is wired.

/**
 * @typedef {Object} EnvysionSnapshotRow
 * @property {string} buildingId
 * @property {number} energyUsedKwh    Year-to-date kWh through SNAPSHOT_AS_OF
 * @property {number} powerKw          Instantaneous demand at capture time
 * @property {number} avgVoltage
 */

export const SNAPSHOT_AS_OF = '2026-05-03';
export const SNAPSHOT_DAYS_INTO_YEAR = 123;
export const SNAPSHOT_TOTAL_KWH = 649439;

/** @type {EnvysionSnapshotRow[]} */
export const envysionSnapshot = [
  { buildingId: 'b_baxter',     energyUsedKwh:   9054, powerKw:  1.7, avgVoltage: 211 },
  { buildingId: 'b_bishop',     energyUsedKwh:   5567, powerKw:  0.4, avgVoltage: 243 },
  { buildingId: 'b_miller',     energyUsedKwh: 149055, powerKw: 34.0, avgVoltage: 211 },
  { buildingId: 'b_fitch',      energyUsedKwh:  55017, powerKw: 12.3, avgVoltage: 211 },
  { buildingId: 'b_flickinger', energyUsedKwh:  36576, powerKw:  9.5, avgVoltage: 212 },
  { buildingId: 'b_barrette',   energyUsedKwh: 136024, powerKw: 38.5, avgVoltage: 211 },
  { buildingId: 'b_barnfield',  energyUsedKwh:  13492, powerKw:  4.5, avgVoltage: 210 },
  { buildingId: 'b_whittemore', energyUsedKwh: 107140, powerKw:  8.6, avgVoltage: 210 },
  { buildingId: 'b_silvergym',  energyUsedKwh:  34583, powerKw:  8.5, avgVoltage: 210 },
  { buildingId: 'b_densmore',   energyUsedKwh:  16941, powerKw:  6.3, avgVoltage: 211 },
  { buildingId: 'b_bryant',     energyUsedKwh:   7655, powerKw:  1.5, avgVoltage: 211 },
  { buildingId: 'b_dexter',     energyUsedKwh:  18729, powerKw:  0.2, avgVoltage: 211 },
  { buildingId: 'b_rowe',       energyUsedKwh:   6634, powerKw:  1.6, avgVoltage: 210 },
  { buildingId: 'b_welch',      energyUsedKwh:  16314, powerKw:  3.3, avgVoltage: 122 },
  { buildingId: 'b_kilton',     energyUsedKwh:  55722, powerKw: 14.4, avgVoltage: 122 },
  { buildingId: 'b_kurth',      energyUsedKwh:   9559, powerKw:  6.1, avgVoltage: 244 },
  { buildingId: 'b_chellis',    energyUsedKwh:  18556, powerKw:  5.3, avgVoltage: 242 },
  { buildingId: 'b_mikula',     energyUsedKwh:   6302, powerKw:  2.2, avgVoltage: 243 },
  { buildingId: 'b_childcare',  energyUsedKwh:   4976, powerKw:  0.2, avgVoltage: 211 },
];

// The figures here are year-to-date measurements, NOT a full-year
// projection. The dashboard treats them as period totals through
// SNAPSHOT_AS_OF (2026-05-03). Pages that want a full-year
// projection can multiply by 365 / SNAPSHOT_DAYS_INTO_YEAR — the
// `ANNUALIZE_FACTOR` export below is provided for that case but is
// NOT applied to the baseline by default.
export const ANNUALIZE_FACTOR = 365 / SNAPSHOT_DAYS_INTO_YEAR; // ≈ 2.9675
