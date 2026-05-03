// Per-month, per-building electricity consumption from the KUA Eclypse
// BMS All Meters page. Date-range filter set to a single calendar
// month, captured from 10.1.1.27 on the date noted in `capturedAt`.
//
// Two totals to be aware of in every BMS row:
//
//   - The sum of submeter rows (sumOfRows below)
//   - The "Totals" line the BMS itself prints at the bottom
//     (displayedTotal below)
//
// They drift apart 5-10% from CT calibration, branch overlaps, or
// untracked load between the main meter and the submeter network.
// We carry both numbers so /data-admin can surface the gap rather
// than silently picking one and hiding the other.

/**
 * @typedef {Object} MonthlyBuildingRow
 * @property {string} buildingId
 * @property {number} kwh         Submeter reading for that month
 * @property {number} powerKw     Instantaneous demand at capture
 * @property {number} avgVoltage
 */

/**
 * @typedef {Object} MonthlyReport
 * @property {string} month             ISO month, "YYYY-MM"
 * @property {string} capturedAt        ISO date when scraped from the BMS
 * @property {number} displayedTotal    The Totals row the BMS prints at the bottom (master meter)
 * @property {number} sumOfRows         Sum of the per-building submeter rows
 * @property {MonthlyBuildingRow[]} rows
 */

/** @type {MonthlyReport[]} */
export const monthlyReports = [
  {
    month: '2026-04',
    capturedAt: '2026-05-03',
    displayedTotal: 128895,
    sumOfRows: 142395,
    rows: [
      { buildingId: 'b_baxter',     kwh:  2087, powerKw:  1.7, avgVoltage: 211 },
      { buildingId: 'b_bishop',     kwh:  1004, powerKw:  0.4, avgVoltage: 243 },
      { buildingId: 'b_miller',     kwh: 29045, powerKw: 37.1, avgVoltage: 211 },
      { buildingId: 'b_fitch',      kwh: 11536, powerKw: 12.3, avgVoltage: 211 },
      { buildingId: 'b_flickinger', kwh: 10421, powerKw:  9.5, avgVoltage: 212 },
      { buildingId: 'b_barrette',   kwh: 35404, powerKw: 39.0, avgVoltage: 211 },
      { buildingId: 'b_barnfield',  kwh:  3395, powerKw:  4.5, avgVoltage: 210 },
      { buildingId: 'b_whittemore', kwh:  6992, powerKw:  8.6, avgVoltage: 210 },
      { buildingId: 'b_silvergym',  kwh:  5390, powerKw:  6.9, avgVoltage: 211 },
      { buildingId: 'b_densmore',   kwh:  4166, powerKw:  6.4, avgVoltage: 211 },
      { buildingId: 'b_bryant',     kwh:  1549, powerKw:  1.5, avgVoltage: 211 },
      { buildingId: 'b_dexter',     kwh:  4775, powerKw:  0.2, avgVoltage: 211 },
      { buildingId: 'b_rowe',       kwh:  1475, powerKw:  1.5, avgVoltage: 210 },
      { buildingId: 'b_welch',      kwh:  4228, powerKw:  3.4, avgVoltage: 122 },
      { buildingId: 'b_kilton',     kwh: 13932, powerKw:  9.0, avgVoltage: 122 },
      { buildingId: 'b_kurth',      kwh:   699, powerKw:  5.9, avgVoltage: 244 },
      { buildingId: 'b_chellis',    kwh:  4132, powerKw:  4.2, avgVoltage: 243 },
      { buildingId: 'b_mikula',     kwh:  1527, powerKw:  1.8, avgVoltage: 243 },
      { buildingId: 'b_childcare',  kwh:   638, powerKw:  0.2, avgVoltage: 211 },
    ],
  },
];

/** Look up a single month's report. */
export function getMonthlyReport(month) {
  return monthlyReports.find((r) => r.month === month) || null;
}

/** Per-building monthly series — used by trend charts. Returns { buildingId: { 'YYYY-MM': kwh } }. */
export function buildingMonthlyHistory() {
  const out = {};
  for (const report of monthlyReports) {
    for (const row of report.rows) {
      if (!out[row.buildingId]) out[row.buildingId] = {};
      out[row.buildingId][report.month] = row.kwh;
    }
  }
  return out;
}

/** Campus monthly totals (master-meter / displayedTotal). */
export function campusMonthlyTotals() {
  return monthlyReports.map((r) => ({
    month: r.month,
    displayedTotal: r.displayedTotal,
    sumOfRows: r.sumOfRows,
  }));
}
