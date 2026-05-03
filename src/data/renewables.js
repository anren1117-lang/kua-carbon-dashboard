// On-campus renewable generation. Currently mock data; replace with the
// real inverter API once the rooftop arrays come online.
//
// KUA's renewables roadmap (per the public methodology) includes:
// - Rooftop solar on Whittemore Athletic Center (40 kW DC, planned 2026)
// - Geothermal field under the Bicentennial Hall lawn (planned, exploratory)
// - Small-wind feasibility (not yet committed)
//
// This file fakes the Whittemore array as if it were already producing
// so the dashboard has something to show. Numbers reflect a typical
// 40 kW NH-latitude array with 14% capacity factor, ~0.5 MWh/kWp/yr.

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
export const solarSites = [
  { id: 'sol_whittemore', name: 'Whittemore rooftop array', buildingId: 'b_whittemore', capacityKwDc: 40, commissionedYear: 2026, provider: 'Enphase IQ8',  status: 'operational' },
  { id: 'sol_miller',     name: 'Miller Hall planned array', buildingId: 'b_miller',     capacityKwDc: 60, commissionedYear: 2027, provider: 'TBD',          status: 'planned' },
];

/**
 * @typedef {Object} SolarMonth
 * @property {string} month
 * @property {number} kwhGenerated
 * @property {number} kwhExported
 * @property {number} capacityFactor   0..1
 */

// Approximate NH rooftop solar generation pattern (peaks May-Aug, dips Dec-Jan).
// Whittemore array (40 kW DC) over 2026.
const WHITTEMORE_KW_DC = 40;
const NH_MONTHLY_SHAPE = [
  // Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec
  0.55, 0.78, 1.05, 1.18, 1.32, 1.31, 1.30, 1.21, 1.05, 0.85, 0.60, 0.50,
];
const KWH_PER_KWDC_YEAR = 1100; // NH average for fixed-tilt rooftop

/** @type {SolarMonth[]} */
export const solarMonthly = NH_MONTHLY_SHAPE.map((shape, i) => {
  const monthly = (WHITTEMORE_KW_DC * KWH_PER_KWDC_YEAR / 12) * shape;
  return {
    month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
    kwhGenerated: Math.round(monthly),
    kwhExported: Math.round(monthly * 0.18), // ~18% net-metered out
    capacityFactor: Number(((monthly / (WHITTEMORE_KW_DC * 24 * 30))).toFixed(3)),
  };
});

export const SOLAR_ANNUAL_KWH = solarMonthly.reduce((s, m) => s + m.kwhGenerated, 0);
export const SOLAR_ANNUAL_EXPORT_KWH = solarMonthly.reduce((s, m) => s + m.kwhExported, 0);
