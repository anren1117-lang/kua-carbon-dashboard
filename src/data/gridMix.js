// KUA's allocation of the ISO New England 2024 system mix.
//
// Single source of truth chain:
//   composedYtd.js  →  COMPOSED_YTD_KWH (sum of monthly BMS captures
//                       + CSV days, all measured)
//   THIS file       →  per-fuel allocation = YTD × mixPercent
//                       per-fuel mtCO2e    = kWh × cited emissionFactor
//                       GRID_MIX_TOTAL_*   = sum of per-fuel rows
//   GRID_MIX_ANNUAL_MTCO2E = TOTAL × COMPOSED_ANNUALIZE_FACTOR
//
// When a new monthly BMS capture is added to monthlyConsumption.js, or
// a fresh Meter Trends CSV is parsed into bmsExportApr2026.js, every
// number on this file recomputes — and so does every consumer of
// GRID_MIX_TOTAL_KWH / GRID_MIX_TOTAL_MTCO2E across the dashboard.
//
// Cited inputs (do not change without an ISO-NE methodology update):
//   • mixPercent      — fuel share of ISO-NE 2024 generation
//   • emissionFactor  — per-fuel kg CO2e per kWh of electricity output
//
// Measured inputs (change automatically when newer data lands):
//   • COMPOSED_YTD_KWH from composedYtd.js

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

import { COMPOSED_YTD_KWH, COMPOSED_ANNUALIZE_FACTOR } from './composedYtd.js';

// Cited inputs only — fuel mix shares + per-fuel emission factors.
// Emission factors are per kWh of electricity OUTPUT (not fuel BTU input),
// matching how KUA's metered consumption is measured. Combined-cycle gas
// at 0.40 kg/kWh; oil and coal use US EPA eGRID NEWE subregion typical
// values; imports blend NYISO + Quebec hydro at a midpoint.
const GRID_MIX_FACTORS = [
  { source: 'Natural Gas',                                mixPercent: 51,    emissionFactor: 0.000400, color: '#ef4444' },
  { source: 'Nuclear',                                    mixPercent: 23,    emissionFactor: 0.000000, color: '#8b5cf6' },
  { source: 'Renewables (Solar, Wind, Biomass)',          mixPercent: 12,    emissionFactor: 0.000000, color: '#22c55e' },
  { source: 'Hydropower',                                 mixPercent:  6,    emissionFactor: 0.000000, color: '#3b82f6' },
  { source: 'Net Imports (NY, Quebec, New Brunswick)',    mixPercent:  7,    emissionFactor: 0.000300, color: '#06b6d4' },
  { source: 'Oil',                                        mixPercent:  1,    emissionFactor: 0.000780, color: '#f97316' },
  { source: 'Coal',                                       mixPercent:  0.23, emissionFactor: 0.000950, color: '#6b7280' },
];

const TOTAL_PCT = GRID_MIX_FACTORS.reduce((s, f) => s + f.mixPercent, 0); // 100.23

/** @type {GridMixSource[]} */
// Per-fuel rows are derived: kwhUsed = COMPOSED_YTD_KWH × mix-fraction;
// mtCO2e = kwhUsed × emissionFactor. When COMPOSED_YTD_KWH changes
// (new BMS data lands), every row in this array recomputes.
export const gridMix = (() => {
  const rows = GRID_MIX_FACTORS.map((f) => {
    const kwhUsed = Math.round(COMPOSED_YTD_KWH * (f.mixPercent / TOTAL_PCT));
    const mtCO2e = +(kwhUsed * f.emissionFactor).toFixed(2);
    return {
      source: f.source,
      mixPercent: f.mixPercent,
      kwhUsed,
      emissionFactor: f.emissionFactor,
      mtCO2e,
      percentOfEmissions: 0, // filled below once total is known
      color: f.color,
    };
  });
  const totalMt = rows.reduce((s, r) => s + r.mtCO2e, 0);
  rows.forEach((r) => { r.percentOfEmissions = totalMt > 0 ? +((r.mtCO2e / totalMt) * 100).toFixed(1) : 0; });
  return rows;
})();

export const GRID_MIX_TOTAL_MTCO2E = +gridMix.reduce((s, r) => s + r.mtCO2e, 0).toFixed(2);
// YTD electricity flows through from composedYtd.js — not hardcoded.
export const GRID_MIX_TOTAL_KWH = COMPOSED_YTD_KWH;
// Annual scope-2 mtCO2e at the current grid mix.
export const GRID_MIX_ANNUAL_MTCO2E = +(GRID_MIX_TOTAL_MTCO2E * COMPOSED_ANNUALIZE_FACTOR).toFixed(1);

export const GRID_MIX_YEAR = 2024;            // ISO-NE factor source year
export const KUA_USAGE_YEAR = 2026;            // KUA usage year
export const KUA_USAGE_PERIOD = 'YTD composed from monthly captures + Meter Trends CSV';
