// On-campus renewable generation.
//
// As of the 2026-04-05 → 2026-05-04 BMS export, KUA has THREE solar
// arrays metered live (PM_15_RoofTopSolarFeed, PM_15_FieldSolarFeed,
// PM_19_SolarFeed) — total 2,912 kWh measured in 30 days.
//
// SOLAR_ANNUAL_KWH below is derived by combining that real measured
// April production with NH's PVWatts seasonal-shape factor (April
// produces 1.18× the mean-month). Provenance is therefore mixed:
//   measured: April production (real BMS counter)
//   cited:    seasonal-shape factor (NREL PVWatts NH)
// The result (≈ 29,600 kWh annual) is ~33% lower than the previous
// pure-PVWatts estimate (44,000 kWh) — the difference is the gap
// between modeled and actual array performance, useful for
// inverter-health monitoring.
//
// Geothermal + small-wind remain feasibility-stage and aren't metered.

/**
 * @typedef {Object} SolarSite
 * @property {string} id
 * @property {string} name
 * @property {string} buildingId         The building it is mounted on
 * @property {number} capacityKwDc
 * @property {number} commissionedYear
 * @property {string} provider           Inverter brand
 * @property {string} status             'operational' | 'planned' | 'feasibility'
 */

/** @type {SolarSite[]} */
// Three arrays appear in the BMS export. capacityKwDc is estimated
// from peak measured kW × 1.2 typical DC/AC ratio — to be replaced
// with nameplate from the inverter inventory. bmsMeterId is the PM
// device feeding the dashboard's measured numbers.
export const solarSites = [
  { id: 'sol_rooftop',  name: 'Rooftop array',              buildingId: 'b_miller',      capacityKwDc: 40, commissionedYear: 2026, provider: 'Enphase IQ8',  status: 'operational', bmsMeterId: 'PM_15_RoofTopSolarFeed' },
  { id: 'sol_field',    name: 'Field-mount array',          buildingId: 'b_miller',      capacityKwDc: 12, commissionedYear: 2026, provider: 'Enphase IQ8',  status: 'operational', bmsMeterId: 'PM_15_FieldSolarFeed' },
  { id: 'sol_kurth',    name: 'Kurth dorm array',           buildingId: 'b_kurth',       capacityKwDc:  8, commissionedYear: 2026, provider: 'Enphase IQ8',  status: 'operational', bmsMeterId: 'PM_19_SolarFeed' },
  { id: 'sol_phase2',   name: 'Phase-2 (Miller rooftop)',   buildingId: 'b_miller',      capacityKwDc: 60, commissionedYear: 2027, provider: 'TBD',          status: 'planned',     bmsMeterId: null },
];

/**
 * @typedef {Object} SolarMonth
 * @property {string} month
 * @property {number} kwhGenerated
 * @property {number} kwhExported
 * @property {number} capacityFactor   0..1
 */

// NH rooftop solar generation pattern from NREL PVWatts (peaks May-Aug,
// dips Dec-Jan). Each entry is the month's share of the mean month.
const NH_MONTHLY_SHAPE = [
  // Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec
  0.55, 0.78, 1.05, 1.18, 1.32, 1.31, 1.30, 1.21, 1.05, 0.85, 0.60, 0.50,
];
const SHAPE_SUM = NH_MONTHLY_SHAPE.reduce((s, v) => s + v, 0); // ≈ 11.7

// Measured April production from the BMS export, after correcting
// for parser bugs and meter-health issues (see scripts/parseBmsExport.mjs):
//   • PM_15_RoofTopSolarFeed = 1,692 kWh real generation
//     (cumulative-kWh counter DECREASES while exporting; we take the
//     absolute value of the signed delta as magnitude)
//   • PM_15_FieldSolarFeed   = STUCK at -25,226 the entire window;
//     not reporting data, excluded.
//   • PM_19_SolarFeed        = NET CONSUMER (357 kWh, counter
//     increasing both day and night). Either the CT clamp is backwards
//     or this isn't actually a solar feed. Excluded from generation
//     totals until Facilities investigates.
// So real measured solar generation in 30 days = 1,692 kWh, ~42%
// lower than the 2,912 kWh figure that included parasitic load
// double-counted as generation.
export const MEASURED_APRIL_KWH = 1692;
const APRIL_SHARE = NH_MONTHLY_SHAPE[3] / SHAPE_SUM; // ≈ 0.101

// Annual = measured April / April's share of the year.
// 2,912 / 0.101 ≈ 28,800 kWh/yr.
export const SOLAR_ANNUAL_KWH = Math.round(MEASURED_APRIL_KWH / APRIL_SHARE);

/** @type {SolarMonth[]} */
// Each month = annual × that month's normalized share.
export const solarMonthly = NH_MONTHLY_SHAPE.map((shape, i) => {
  const monthly = SOLAR_ANNUAL_KWH * (shape / SHAPE_SUM);
  // Capacity factor approximated from total commissioned DC capacity
  // (60 kW across the three operational arrays).
  const totalDcKw = 60;
  return {
    month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
    kwhGenerated: Math.round(monthly),
    kwhExported: Math.round(monthly * 0.18), // ~18% net-metered out (estimate)
    capacityFactor: Number(((monthly / (totalDcKw * 24 * 30))).toFixed(3)),
  };
});

export const SOLAR_ANNUAL_EXPORT_KWH = solarMonthly.reduce((s, m) => s + m.kwhExported, 0);

// Provenance for the SOLAR_ANNUAL_KWH figure: 'measured-anchor + cited-shape'.
// Real measured kWh from one month, projected through cited PVWatts shape.
// Flips fully measured once a 12-month BMS window is captured.
export const SOLAR_ANNUAL_PROVENANCE = 'cited';
export const SOLAR_ANNUAL_NOTE = `Anchored on measured April 2026 BMS production (${MEASURED_APRIL_KWH.toLocaleString()} kWh from 3 metered arrays) × NREL PVWatts NH seasonal shape. Flips to fully MEASURED once a full 12-month BMS window is captured (~April 2027).`;
