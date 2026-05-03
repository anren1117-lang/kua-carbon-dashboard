// KUA's allocation of the ISO New England 2024 system mix.
//
// kWhUsed = KUA's year-to-date electricity (649,439 kWh through
// 2026-05-03 per the BMS All Meters page) multiplied by each fuel's
// share of generation. mtCO2e = that kWh figure multiplied by the
// per-fuel emission factor.
//
// These are YTD totals — NOT annualized projections. Pages that want
// a full-year projection should multiply by ANNUALIZE_FACTOR from
// envysionSnapshot.js.
//
// Source: ISO-NE 2024 System Mix and Emissions Report (factor year);
// envysionSnapshot.js (KUA usage period).

/**
 * @typedef {Object} GridMixSource
 * @property {string} source
 * @property {number} mtCO2e          Share of KUA scope-2 baseline attributable to this fuel
 * @property {number} percentOfEmissions
 * @property {number} mixPercent      Share of generation
 * @property {number} kwhUsed         KUA's allocated kWh from this source
 * @property {number} emissionFactor  tonnes CO2 per kWh (for documentation)
 * @property {string} color
 */

// Emission factors are per kWh of electricity OUTPUT (not fuel BTU input),
// matching how KUA's metered consumption is measured. Combined-cycle gas
// at 0.40 kg/kWh; oil and coal use US EPA eGRID NEWE subregion typical
// values; imports blend NYISO + Quebec hydro at a midpoint. Sum of
// per-row mtCO2e gives the YTD scope-2 baseline.

/** @type {GridMixSource[]} */
export const gridMix = [
  { source: 'Natural Gas',                                 mtCO2e: 132.49, percentOfEmissions: 86.8, mixPercent: 51,    kwhUsed: 331214, emissionFactor: 0.000400, color: '#ef4444' },
  { source: 'Nuclear',                                     mtCO2e:   0.00, percentOfEmissions:  0.0, mixPercent: 23,    kwhUsed: 149371, emissionFactor: 0.000000, color: '#8b5cf6' },
  { source: 'Renewables (Solar, Wind, Biomass)',           mtCO2e:   0.00, percentOfEmissions:  0.0, mixPercent: 12,    kwhUsed:  77933, emissionFactor: 0.000000, color: '#22c55e' },
  { source: 'Hydropower',                                  mtCO2e:   0.00, percentOfEmissions:  0.0, mixPercent:  6,    kwhUsed:  38966, emissionFactor: 0.000000, color: '#3b82f6' },
  { source: 'Net Imports (NY, Quebec, New Brunswick)',     mtCO2e:  13.64, percentOfEmissions:  8.9, mixPercent:  7,    kwhUsed:  45461, emissionFactor: 0.000300, color: '#06b6d4' },
  { source: 'Oil',                                         mtCO2e:   5.07, percentOfEmissions:  3.3, mixPercent:  1,    kwhUsed:   6494, emissionFactor: 0.000780, color: '#f97316' },
  { source: 'Coal',                                        mtCO2e:   1.42, percentOfEmissions:  0.9, mixPercent:  0.23, kwhUsed:   1494, emissionFactor: 0.000950, color: '#6b7280' },
];

// Sum of per-row mtCO2e = 152.62. Effective rate = 152.62/649,439 = 0.235 kg/kWh,
// in the range of ISO-NE 2024 system-average emissions (eGRID NEWE 2022 = 0.239).
export const GRID_MIX_TOTAL_MTCO2E = 152.62;
export const GRID_MIX_TOTAL_KWH = 649439;
export const GRID_MIX_YEAR = 2024;            // ISO-NE factor source year
export const KUA_USAGE_YEAR = 2026;            // KUA usage year
export const KUA_USAGE_PERIOD = 'YTD through 2026-05-03';
