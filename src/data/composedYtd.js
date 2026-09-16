// Composed year-to-date electricity total + Year 1 projection, built from the
// SEED inputs (the data files in this repo). The composition rules live in
// electricityLedger.js; useMeasuredScope2() applies the same rules with admin
// entries from Supabase laid over this seed, so the static exports here are
// the dashboard's fallback when no admin data has been entered.
//
// Seed inputs:
//   • monthlyConsumption.js    — master-meter "displayedTotal" per month
//                                (BMS All Meters page; ground truth)
//   • contiguousMonths2026.js  — campus feed-sum per month from the daily
//                                Meter Trends export, scaled to master-meter
//                                equivalent where no master total exists
//
// The seasonal Year 1 projection fills the rest of the year.

import { monthlyReports } from './monthlyConsumption.js';
import { seedFeedMonths } from './contiguousMonths2026.js';
import { SNAPSHOT_AS_OF, SNAPSHOT_DAYS_INTO_YEAR } from './envysionSnapshot.js';
import { monthlyPattern } from './seasonalPatterns.js';
import {
  composeElectricityLedger,
  ledgerToYtdComponents,
  projectYear1,
  daysInMonthKey,
} from './electricityLedger.js';

export const SEED_MASTER_SOURCE = 'src/data/monthlyConsumption.js (BMS All Meters page master-meter)';

export const SEED_LEDGER_INPUTS = {
  masterMonths: monthlyReports.map((r) => ({ month: r.month, kwh: r.displayedTotal, source: SEED_MASTER_SOURCE, note: null })),
  feedMonths: seedFeedMonths,
};

export const seedLedger = composeElectricityLedger(SEED_LEDGER_INPUTS);

// Anchor date for the contiguous YTD composition — the last measured day.
export const COMPOSED_YTD_AS_OF = seedLedger.asOf;

// Master ÷ feed-sum scale applied to feed-only months.
export const FEED_TO_MASTER_SCALE = seedLedger.scale ? seedLedger.scale.value : null;

// Days-into-year for Jan 1 → COMPOSED_YTD_AS_OF, with the year taken from the
// anchor so it stays correct across a year rollover.
export const COMPOSED_YTD_DAYS = (() => {
  const yyyy = COMPOSED_YTD_AS_OF.slice(0, 4);
  const start = new Date(`${yyyy}-01-01T00:00:00Z`);
  const end = new Date(COMPOSED_YTD_AS_OF + 'T00:00:00Z');
  return Math.round((end - start) / 86400000) + 1; // +1 inclusive
})();

/**
 * @typedef {Object} YtdComponent
 * @property {string} label
 * @property {string} period         "YYYY-MM" month key
 * @property {boolean} [reconciled]  true when scaled from the feed-sum export
 * @property {number} kwh
 * @property {number} days
 * @property {string} source         where the kWh came from
 */

/** @type {YtdComponent[]} */
export const ytdComponents = ledgerToYtdComponents(seedLedger);

/** Scaled (feed-sum × scale) months in the seed composition. */
export const reconciledMonths = seedLedger.months
  .filter((m) => m.provenance === 'scaled')
  .map((m) => ({
    month: m.month,
    kwh: m.kwh,
    days: m.days,
    partial: m.days < m.calendarDays,
    provenance: 'reconciled',
    source: m.source,
  }));

export const COMPOSED_YTD_KWH = seedLedger.ytdKwh;
export const COMPOSED_YTD_DAYS_COVERED = seedLedger.ytdDays;

// ─── Year 1 projection — seasonally anchored ──────────────────────
// The naive approach is linear: kWh × (365 ÷ days_covered). For an NH
// boarding school that's wrong — Jan/Feb peak from heating, Jul trough from
// no occupancy + no heating + AC barely on. Linear annualization ignores where
// in the year the measured run falls. projectYear1() anchors the unmeasured
// months on the measured ones using the NH seasonal shape instead.

const seedYear1 = projectYear1(ytdComponents, monthlyPattern);

export const year1Months = seedYear1.months;
export const COMPOSED_YEAR1_KWH = seedYear1.year1Kwh;
export const COMPOSED_YEAR1_CALIBRATED_ANNUAL = Math.round(seedYear1.calibratedAnnual);

// Annualize a measured window by ITS share of the Year 1 shape, not the
// YTD's: Year 1 ÷ the Year 1 kWh falling on the window's days (each month's
// kWh spread evenly over its days). COMPOSED_ANNUALIZE_FACTOR is only right
// for the Jan 1 → YTD-anchor window; a 123-day Jan–May snapshot or a 30-day
// spring export needs its own factor.
export function annualizeFactorForWindow(startIso, endIso) {
  const year = parseInt(COMPOSED_YTD_AS_OF.slice(0, 4), 10);
  const end = new Date(`${endIso}T12:00:00Z`);
  let windowKwh = 0;
  for (let d = new Date(`${startIso}T12:00:00Z`); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    if (d.getUTCFullYear() !== year) continue;
    const m = d.getUTCMonth();
    windowKwh += year1Months[m].kwh / daysInMonthKey(`${year}-${String(m + 1).padStart(2, '0')}`);
  }
  // NULL, not 1, when the window doesn't overlap the ledger year at all —
  // e.g. an export from last year. Returning 1 would silently publish a
  // 30-day total as if it were the annual figure.
  return windowKwh > 0 ? COMPOSED_YEAR1_KWH / windowKwh : null;
}

// envysionSnapshot.js per-building rows are YTD from Jan 1 → SNAPSHOT_AS_OF.
export const SNAPSHOT_ANNUALIZE_FACTOR = annualizeFactorForWindow(`${SNAPSHOT_AS_OF.slice(0, 4)}-01-01`, SNAPSHOT_AS_OF)
  // The snapshot sits inside the ledger year today; if it ever doesn't, fall
  // back to naive linear rather than to a silent ×1.
  ?? (365 / SNAPSHOT_DAYS_INTO_YEAR);

// Effective annualize factor = projected year 1 ÷ YTD measured.
// Differs from naive 365/days_covered because the unmeasured days aren't
// average: with data through mid-September, what's left of the year is
// heating season, so this sits above the linear factor.
export const COMPOSED_ANNUALIZE_FACTOR = COMPOSED_YTD_DAYS_COVERED > 0
  ? COMPOSED_YEAR1_KWH / COMPOSED_YTD_KWH
  : 1;
// Naive linear factor kept for cross-reference / older callers.
export const COMPOSED_LINEAR_ANNUALIZE_FACTOR = COMPOSED_YTD_DAYS_COVERED > 0 ? 365 / COMPOSED_YTD_DAYS_COVERED : 1;
// COMPOSED_ANNUAL_KWH stays as the public name; consumers who imported
// it before now get the seasonally-anchored projection automatically.
export const COMPOSED_ANNUAL_KWH = COMPOSED_YEAR1_KWH;

// COMPOSED_YTD_MTCO2E and COMPOSED_ANNUAL_MTCO2E are computed in
// gridMix.js, NOT here — that's where the cited per-fuel emission
// factors live. Importing them back into this file would create a
// circular dependency. To get those values:
//   import { GRID_MIX_TOTAL_MTCO2E, GRID_MIX_ANNUAL_MTCO2E } from './gridMix.js'
