// ISO New England 2024 system mix. mtCO2e values are the share of KUA's
// 2024 annual electricity (~221.53 mtCO2e baseline) attributable to each fuel.
// Source: ISO-NE 2024 System Mix and Emissions Report.

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
  { source: 'Natural Gas',                                 mtCO2e: 213.83, percentOfEmissions: 96.5, mixPercent: 51,    kwhUsed: 1181399, emissionFactor: 0.000181, color: '#ef4444' },
  { source: 'Nuclear',                                     mtCO2e:   0.00, percentOfEmissions:  0.0, mixPercent: 23,    kwhUsed:  532788, emissionFactor: 0.000000, color: '#8b5cf6' },
  { source: 'Renewables (Solar, Wind, Biomass)',           mtCO2e:   0.00, percentOfEmissions:  0.0, mixPercent: 12,    kwhUsed:  277976, emissionFactor: 0.000000, color: '#22c55e' },
  { source: 'Hydropower',                                  mtCO2e:   0.00, percentOfEmissions:  0.0, mixPercent:  6,    kwhUsed:  138988, emissionFactor: 0.000000, color: '#3b82f6' },
  { source: 'Net Imports (NY, Quebec, New Brunswick)',     mtCO2e:   0.00, percentOfEmissions:  0.0, mixPercent:  7,    kwhUsed:  162153, emissionFactor: 0.000000, color: '#06b6d4' },
  { source: 'Oil',                                         mtCO2e:   5.95, percentOfEmissions:  2.7, mixPercent:  1,    kwhUsed:   23165, emissionFactor: 0.000257, color: '#f97316' },
  { source: 'Coal',                                        mtCO2e:   1.75, percentOfEmissions:  0.8, mixPercent:  0.23, kwhUsed:    5328, emissionFactor: 0.000329, color: '#6b7280' },
];

export const GRID_MIX_TOTAL_MTCO2E = 221.53;
export const GRID_MIX_TOTAL_KWH = 2316469;
export const GRID_MIX_YEAR = 2024;
