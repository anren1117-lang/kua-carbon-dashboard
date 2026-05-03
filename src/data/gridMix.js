// KUA's allocation of the ISO New England 2024 system mix.
//
// kWhUsed = KUA's annual electricity (1,927,278 kWh, projected from
// the 2026 BMS year-to-date snapshot through 2026-05-03 × 365/123)
// multiplied by each fuel's share of generation. mtCO2e = that kWh
// figure multiplied by the per-fuel emission factor.
//
// Source: ISO-NE 2024 System Mix and Emissions Report (factor year);
// envysionSnapshot.js (KUA usage year).

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

/** @type {GridMixSource[]} */
export const gridMix = [
  { source: 'Natural Gas',                                 mtCO2e: 177.91, percentOfEmissions: 96.5, mixPercent: 51,    kwhUsed: 982912, emissionFactor: 0.000181, color: '#ef4444' },
  { source: 'Nuclear',                                     mtCO2e:   0.00, percentOfEmissions:  0.0, mixPercent: 23,    kwhUsed: 443274, emissionFactor: 0.000000, color: '#8b5cf6' },
  { source: 'Renewables (Solar, Wind, Biomass)',           mtCO2e:   0.00, percentOfEmissions:  0.0, mixPercent: 12,    kwhUsed: 231273, emissionFactor: 0.000000, color: '#22c55e' },
  { source: 'Hydropower',                                  mtCO2e:   0.00, percentOfEmissions:  0.0, mixPercent:  6,    kwhUsed: 115637, emissionFactor: 0.000000, color: '#3b82f6' },
  { source: 'Net Imports (NY, Quebec, New Brunswick)',     mtCO2e:   0.00, percentOfEmissions:  0.0, mixPercent:  7,    kwhUsed: 134910, emissionFactor: 0.000000, color: '#06b6d4' },
  { source: 'Oil',                                         mtCO2e:   4.95, percentOfEmissions:  2.7, mixPercent:  1,    kwhUsed:  19273, emissionFactor: 0.000257, color: '#f97316' },
  { source: 'Coal',                                        mtCO2e:   1.46, percentOfEmissions:  0.8, mixPercent:  0.23, kwhUsed:   4433, emissionFactor: 0.000329, color: '#6b7280' },
];

export const GRID_MIX_TOTAL_MTCO2E = 184.32;
export const GRID_MIX_TOTAL_KWH = 1927278;
export const GRID_MIX_YEAR = 2024;          // ISO-NE factor source year
export const KUA_USAGE_YEAR = 2026;          // KUA usage projection (annualized YTD)
