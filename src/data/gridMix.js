// KUA's allocation of the New England system mix.
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
//   • mixPercent      — fuel share of ISO-NE generation
//   • emissionFactor  — per-fuel kg CO2e per kWh of electricity output
//
// Measured inputs (change automatically when newer data lands):
//   • COMPOSED_YTD_KWH from composedYtd.js
//
// ── THE GRID IS NOT A CONSTANT (Phase 391) ────────────────────────────────
//
// The seven rows below are ONE year's mix. gridMixHistory.js holds the published
// eGRID NEWE series back to 2019, with the trend stated carefully there: the
// long direction is DOWN (~20–28% since 2010, record low in 2024), 2019 was an
// unusually clean bottom, and the 10% rise from 2019 to 2023 is real but is a
// cherry-picked window — start at 2016 and the sign flips. What matters for a
// school is the magnitude, not the direction: the same kWh scores about 10%
// differently depending on which year's grid prices it, which is bigger than
// most efficiency projects. A dashboard that holds carbon intensity fixed reads
// the grid's movements as the school's behaviour. scope2MtAtVintage() below is
// how a page prices the same kWh at each year's grid.
//
// A KNOWN DISCREPANCY, deliberately left visible rather than quietly closed:
// the per-fuel reconstruction below yields ~0.2344 kg/kWh, while EPA's
// published eGRID NEWE rate for the vintage KUA reports against is ~0.2464 —
// about 5% higher. The published rate is what GHG Protocol location-based
// Scope 2 actually asks for, so the reconstruction is understating, in the
// flattering direction. It is NOT silently swapped here because the 390 mt
// headline is also the baseline in targets.js (board sign-off pending), the
// impact and $115K cost of the REC recommendation in the admin plan agent,
// and a figure baked into three API system prompts. Repricing the inventory
// is a decision with governance attached, not a constant to edit in passing.
// FACTOR_RECONCILIATION publishes the gap so nobody has to rediscover it.

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
import {
  vintageForUsageYear,
  vintageKgPerKwh,
  reportVintageGap,
  EGRID_NEWE,
} from './gridMixHistory.js';

// Cited inputs only — fuel mix shares + per-fuel emission factors.
// Emission factors are per kWh of electricity OUTPUT (not fuel BTU input),
// matching how KUA's metered consumption is measured. Combined-cycle gas
// at 0.40 kg/kWh; oil and coal use US EPA eGRID NEWE subregion typical
// values; imports blend NYISO + Quebec hydro at a midpoint.
// `label` is the short form for tight layouts (the mix chip grid); `source`
// stays the full descriptive name for tables and CSV, where the parenthetical
// is the useful part.
const GRID_MIX_FACTORS = [
  { source: 'Natural Gas',                                label: 'Natural gas', mixPercent: 51,    emissionFactor: 0.000400, color: '#ef4444' },
  { source: 'Nuclear',                                    label: 'Nuclear',     mixPercent: 23,    emissionFactor: 0.000000, color: '#8b5cf6' },
  { source: 'Renewables (Solar, Wind, Biomass)',          label: 'Renewables',  mixPercent: 12,    emissionFactor: 0.000000, color: '#22c55e' },
  { source: 'Hydropower',                                 label: 'Hydro',       mixPercent:  6,    emissionFactor: 0.000000, color: '#3b82f6' },
  { source: 'Net Imports (NY, Quebec, New Brunswick)',    label: 'Net imports', mixPercent:  7,    emissionFactor: 0.000300, color: '#06b6d4' },
  { source: 'Oil',                                        label: 'Oil',         mixPercent:  1,    emissionFactor: 0.000780, color: '#f97316' },
  { source: 'Coal',                                       label: 'Coal',        mixPercent:  0.23, emissionFactor: 0.000950, color: '#6b7280' },
];

const TOTAL_PCT = GRID_MIX_FACTORS.reduce((s, f) => s + f.mixPercent, 0); // 100.23

/** @type {GridMixSource[]} */
// Per-fuel rows are derived: kwhUsed = COMPOSED_YTD_KWH × mix-fraction;
// mtCO2e = kwhUsed × emissionFactor. When COMPOSED_YTD_KWH changes
// (new BMS data lands), every row in this array recomputes.
export function composeGridMix(ytdKwh) {
  const rows = GRID_MIX_FACTORS.map((f) => {
    const kwhUsed = Math.round(ytdKwh * (f.mixPercent / TOTAL_PCT));
    const mtCO2e = +(kwhUsed * f.emissionFactor).toFixed(2);
    return {
      source: f.source,
      label: f.label || f.source,
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
}

export const gridMix = composeGridMix(COMPOSED_YTD_KWH);

export const GRID_MIX_TOTAL_MTCO2E = +gridMix.reduce((s, r) => s + r.mtCO2e, 0).toFixed(2);
// YTD electricity flows through from composedYtd.js — not hardcoded.
export const GRID_MIX_TOTAL_KWH = COMPOSED_YTD_KWH;
// Annual scope-2 mtCO2e at the current grid mix.
export const GRID_MIX_ANNUAL_MTCO2E = +(GRID_MIX_TOTAL_MTCO2E * COMPOSED_ANNUALIZE_FACTOR).toFixed(1);

/** YTD + annual Scope 2 mtCO₂e for any composed YTD and Year 1 kWh, with the
 *  same per-fuel rounding as the constants above — for live admin-fed data. */
export function composeScope2Mt(ytdKwh, year1Kwh) {
  if (!(ytdKwh > 0)) return { ytdMt: 0, annualMt: 0 };
  const ytdMt = +composeGridMix(ytdKwh).reduce((s, r) => s + r.mtCO2e, 0).toFixed(2);
  return { ytdMt, annualMt: +(ytdMt * (year1Kwh / ytdKwh)).toFixed(1) };
}

export const GRID_MIX_YEAR = 2024;            // ISO-NE factor source year
export const KUA_USAGE_YEAR = 2026;            // KUA usage year
export const KUA_USAGE_PERIOD = 'YTD composed from monthly captures + Meter Trends CSV';

// ── Time-varying grid (Phase 391) ─────────────────────────────────────────

/** Weighted kg CO2e per kWh implied by the seven rows above. ~0.2344. */
export const RECONSTRUCTED_KG_PER_KWH = +GRID_MIX_FACTORS
  .reduce((s, f) => s + (f.mixPercent / TOTAL_PCT) * f.emissionFactor * 1000, 0)
  .toFixed(6);

/** The eGRID edition KUA's usage year should be reported against. */
export const REPORTING_VINTAGE = vintageForUsageYear(KUA_USAGE_YEAR);

/** EPA's published rate for that edition, in kg/kWh. ~0.2464.
 *  vintageKgPerKwh() returns null by contract for a row with an unusable rate,
 *  and this runs at module scope — an unguarded .toFixed() on null would throw
 *  while the module is evaluating and take down every page that imports it. */
const reportingKgPerKwh = vintageKgPerKwh(REPORTING_VINTAGE);
export const EGRID_REPORTING_KG_PER_KWH = reportingKgPerKwh === null
  ? null
  : +reportingKgPerKwh.toFixed(6);

/**
 * The gap between what this file computes and what EPA publishes, stated in
 * one place so a page, a methodology note or a reviewer can read it off
 * rather than rediscovering it. Positive gapPct means the dashboard is
 * reporting FEWER emissions than the published factor would give.
 */
export const FACTOR_RECONCILIATION = {
  reconstructedKgPerKwh: RECONSTRUCTED_KG_PER_KWH,
  publishedKgPerKwh: EGRID_REPORTING_KG_PER_KWH,
  gapPct: +(((EGRID_REPORTING_KG_PER_KWH - RECONSTRUCTED_KG_PER_KWH) / RECONSTRUCTED_KG_PER_KWH) * 100).toFixed(1),
  vintage: REPORTING_VINTAGE.vintage,
  source: REPORTING_VINTAGE.source,
  note: 'Per-fuel reconstruction runs below EPA\'s published eGRID NEWE rate. The published rate is what GHG Protocol location-based Scope 2 asks for; adopting it would raise reported Scope 2 and is held for a deliberate phase because the current figure is also the targets.js baseline.',
};

/** How out of date the reporting factor is for the usage year. */
export const VINTAGE_GAP = reportVintageGap(KUA_USAGE_YEAR);

/**
 * The same kWh, priced at each year's published grid — the point being that
 * the answer moves even when the school's behaviour doesn't. Returns one row
 * per eGRID edition, oldest first.
 *
 * @param {number} kwh
 * @returns {{vintage:number, kgPerKwh:number, mtCO2e:number, source:string}[]}
 */
export function scope2MtAtVintage(kwh) {
  if (!(kwh > 0)) return [];
  return EGRID_NEWE.map((v) => {
    const kgPerKwh = vintageKgPerKwh(v);
    // Skip a vintage we can't price rather than throwing on null — one bad row
    // shouldn't cost the reader the other four years.
    if (kgPerKwh === null) return null;
    return {
      vintage: v.vintage,
      kgPerKwh: +kgPerKwh.toFixed(6),
      mtCO2e: +((kwh * kgPerKwh) / 1000).toFixed(1),
      source: v.source,
    };
  }).filter(Boolean);
}

/** Share of the mix that emits nothing at the point of generation. */
export function zeroEmissionPercent(rows = gridMix) {
  const total = rows.reduce((s, r) => s + r.mixPercent, 0);
  const zero = rows.filter((r) => r.emissionFactor === 0).reduce((s, r) => s + r.mixPercent, 0);
  return total > 0 ? +((zero / total) * 100).toFixed(0) : 0;
}

/** Effective kg CO2e per kWh implied by a set of composed rows. */
export function effectiveKgPerKwh(rows = gridMix) {
  const kwh = rows.reduce((s, r) => s + r.kwhUsed, 0);
  const mt = rows.reduce((s, r) => s + r.mtCO2e, 0);
  return kwh > 0 ? +((mt * 1000) / kwh).toFixed(4) : 0;
}
