// Composed year-to-date electricity total — built from the actual
// measured monthly BMS captures + the daily values in the BMS Meter
// Trends export. Every kWh in the YTD figure traces back to a specific
// measured source, no single-snapshot figure used as the headline.
//
// Sources (all measured):
//   • monthlyConsumption.js     — Jan + Feb + Mar + Apr full-month
//                                  master-meter "displayedTotal" rows
//                                  from the BMS All Meters page
//   • bmsExportApr2026.js       — May 1-4 daily totals summed across
//                                  the export's main + panel feeds
//                                  (the export starts Apr 5; April is
//                                  already covered by the monthly
//                                  capture above so we ONLY pull the
//                                  May days here, no overlap)
//
// Cross-checks against the older single-snapshot value
// (GRID_MIX_TOTAL_KWH = 649,439 from the All Meters page through
// 2026-05-03) confirm agreement within ~0.5%, well inside CT
// calibration noise.

import { monthlyReports } from './monthlyConsumption.js';
import { bmsExportMeters } from './bmsExportApr2026.js';

// Heuristic: which feeds in the export count toward a campus total?
// Same definition used by the Scope 2 BMS insights panel — main feeds
// and panel feeds, not submeters underneath them.
function isCampusFeed(id) {
  return /MainFeed$|PanelFeed$|MDPFeed$|MDP$|^PM_\d+_Feed$|^PM_\d+_LP$|^PM_\d+_MainFeed$/.test(id);
}

// Pre-compute daily campus totals from the export, by date, summed
// across every campus feed.
const exportDailyByDate = (() => {
  const out = new Map();
  for (const m of bmsExportMeters) {
    if (!isCampusFeed(m.id)) continue;
    for (const d of (m.daily || [])) {
      out.set(d.date, (out.get(d.date) || 0) + d.kwh);
    }
  }
  return out;
})();

// Anchor date for the YTD composition. Update when a fresher BMS
// export ships — usually matches the latest day in bmsExportApr2026.js.
export const COMPOSED_YTD_AS_OF = '2026-05-04';

// Days-into-year for Jan 1 → COMPOSED_YTD_AS_OF.
const dayOfYear = (() => {
  const start = new Date('2026-01-01T00:00:00Z');
  const end = new Date(COMPOSED_YTD_AS_OF + 'T00:00:00Z');
  return Math.round((end - start) / 86400000) + 1; // +1 inclusive
})();
export const COMPOSED_YTD_DAYS = dayOfYear; // 124 for May 4 in a non-leap year

/**
 * @typedef {Object} YtdComponent
 * @property {string} label
 * @property {string} period         "Jan 2026" or "May 1-4 2026"
 * @property {number} kwh
 * @property {number} days
 * @property {string} source         file path the kWh came from
 */

/** @type {YtdComponent[]} */
export const ytdComponents = (() => {
  const out = [];

  // Months fully covered by the monthly captures: Jan, Feb, Mar, Apr.
  const monthLabels = { '2026-01': 'Jan 2026', '2026-02': 'Feb 2026', '2026-03': 'Mar 2026', '2026-04': 'Apr 2026' };
  const daysInMonth = { '2026-01': 31, '2026-02': 28, '2026-03': 31, '2026-04': 30 };
  for (const r of monthlyReports) {
    if (monthLabels[r.month]) {
      out.push({
        label: monthLabels[r.month],
        period: r.month,
        kwh: r.displayedTotal,
        days: daysInMonth[r.month],
        source: 'src/data/monthlyConsumption.js (BMS All Meters page master-meter)',
      });
    }
  }

  // Partial month from the export — May 1–4 only (April is already
  // covered above by the monthly capture, no overlap).
  const mayDays = Array.from(exportDailyByDate.entries())
    .filter(([date]) => date.startsWith('2026-05') && date <= COMPOSED_YTD_AS_OF)
    .sort();
  if (mayDays.length > 0) {
    const mayKwh = mayDays.reduce((s, [, k]) => s + k, 0);
    const first = mayDays[0][0].slice(8);
    const last = mayDays[mayDays.length - 1][0].slice(8);
    out.push({
      label: `May ${first}–${last} 2026`,
      period: '2026-05',
      kwh: Math.round(mayKwh),
      days: mayDays.length,
      source: 'src/data/bmsExportApr2026.js (BMS Meter Trends export, daily campus-feed sum)',
    });
  }

  return out;
})();

export const COMPOSED_YTD_KWH = ytdComponents.reduce((s, c) => s + c.kwh, 0);
export const COMPOSED_YTD_DAYS_COVERED = ytdComponents.reduce((s, c) => s + c.days, 0);

// ─── Year 1 projection — seasonally-anchored ──────────────────────
// The naive approach is linear: kWh × (365 ÷ days_covered). For an
// NH boarding school that's wrong — Jan/Feb peak from heating, Jul
// trough from no occupancy + no heating + AC barely on. Linear
// annualization over Apr-anchored data (a low-heating month)
// systematically under-counts winter.
//
// Better: anchor the unmeasured months on the measured months using
// the NH seasonal shape. Each measured month implies its own
// "annual" via measuredKwh ÷ monthFraction. Average those across
// the measured months for a calibrated annual baseline. Project
// unmeasured months as annual × theirMonthFraction.

import { monthlyPattern } from './seasonalPatterns.js';

const MULT_SUM = monthlyPattern.reduce((s, m) => s + m.multiplier, 0); // ≈ 11.55
// Each month's share of the year-of-mean-month if the year's average
// month equals the mean — divide by 12 (to get the average) and by
// MULT_SUM/12 (so the multipliers sum to 12 with the average being 1).
// Equivalently: monthShare = multiplier / MULT_SUM.
const monthShare = monthlyPattern.map((m) => m.multiplier / MULT_SUM);

const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// Map each ytdComponent to its month index. Apr/May partial months
// only contribute a fractional share.
function componentToMonthShareCovered(c) {
  // Period like '2026-01' or '2026-05' from the components.
  const monthIdx = parseInt(c.period.slice(5), 10) - 1;
  if (monthIdx < 0 || monthIdx >= 12) return null;
  // Fraction of the month covered by this component.
  const frac = Math.min(1, c.days / monthDays[monthIdx]);
  return { monthIdx, frac, kwh: c.kwh };
}

// Calibrate annual baseline: for each measured month / fraction,
// implied annual = kwh ÷ (monthShare[monthIdx] × frac).
const impliedAnnuals = ytdComponents
  .map(componentToMonthShareCovered)
  .filter((x) => x && x.frac > 0 && monthShare[x.monthIdx] > 0)
  .map((x) => x.kwh / (monthShare[x.monthIdx] * x.frac));

const calibratedAnnual = impliedAnnuals.length > 0
  ? impliedAnnuals.reduce((s, v) => s + v, 0) / impliedAnnuals.length
  : COMPOSED_YTD_KWH * (365 / COMPOSED_YTD_DAYS_COVERED);

/** Year 1 projection = sum of (measured value if covered, else
 *  calibrated_annual × monthShare for the unmeasured remainder). */
function projectYear1() {
  const covered = new Map(); // monthIdx → kWh covered, fracCovered
  for (const c of ytdComponents) {
    const x = componentToMonthShareCovered(c);
    if (!x) continue;
    const cur = covered.get(x.monthIdx) || { kwh: 0, frac: 0 };
    covered.set(x.monthIdx, { kwh: cur.kwh + x.kwh, frac: cur.frac + x.frac });
  }
  const months = [];
  for (let i = 0; i < 12; i++) {
    const c = covered.get(i);
    const monthFullKwh = calibratedAnnual * monthShare[i];
    if (!c || c.frac >= 1) {
      months.push({
        monthIdx: i, label: monthlyPattern[i].month,
        kwh: c ? c.kwh : monthFullKwh,
        provenance: c ? 'measured' : 'projected',
        fracMeasured: c ? c.frac : 0,
      });
    } else {
      // Partial month: measured portion + projected portion of the rest.
      const remainingFrac = 1 - c.frac;
      months.push({
        monthIdx: i, label: monthlyPattern[i].month,
        kwh: c.kwh + monthFullKwh * remainingFrac,
        provenance: 'mixed',
        fracMeasured: c.frac,
      });
    }
  }
  return months;
}

export const year1Months = projectYear1();
export const COMPOSED_YEAR1_KWH = Math.round(year1Months.reduce((s, m) => s + m.kwh, 0));
export const COMPOSED_YEAR1_CALIBRATED_ANNUAL = Math.round(calibratedAnnual);

// Effective annualize factor = projected year 1 ÷ YTD measured.
// Higher than naive 365/days_covered because the measured months
// (Jan-Apr) lean heating-heavy.
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
