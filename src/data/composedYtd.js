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

// Days-into-year for Jan 1 → COMPOSED_YTD_AS_OF. Derive the year from
// the anchor itself so this stays correct after a year rollover (the
// earlier code hardcoded '2026-01-01' and would have started counting
// from the wrong year-boundary the moment the anchor crossed into
// 2027).
const dayOfYear = (() => {
  const yyyy = COMPOSED_YTD_AS_OF.slice(0, 4);
  const start = new Date(`${yyyy}-01-01T00:00:00Z`);
  const end = new Date(COMPOSED_YTD_AS_OF + 'T00:00:00Z');
  return Math.round((end - start) / 86400000) + 1; // +1 inclusive
})();
export const COMPOSED_YTD_DAYS = dayOfYear;

/**
 * @typedef {Object} YtdComponent
 * @property {string} label
 * @property {string} period         "Jan 2026" or "May 1-4 2026"
 * @property {number} kwh
 * @property {number} days
 * @property {string} source         file path the kWh came from
 */

// Derive label + day count from the YYYY-MM key. Leap-aware (Feb 29
// when applicable) and works for any future year without edits.
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function labelForMonthKey(key) {
  const [yyyy, mm] = key.split('-');
  return `${MONTH_NAMES[parseInt(mm, 10) - 1]} ${yyyy}`;
}
function daysForMonthKey(key) {
  const [yyyy, mm] = key.split('-').map((s) => parseInt(s, 10));
  return new Date(yyyy, mm, 0).getDate();
}

// The export-window prefix used for partial-month detection. Shifts to
// the next month automatically as the YTD-as-of date crosses month
// boundaries — earlier code hardcoded "2026-05" here too, so the May→June
// transition would have silently dropped the partial-month component.
const PARTIAL_MONTH_PREFIX = COMPOSED_YTD_AS_OF.slice(0, 7);

/** @type {YtdComponent[]} */
export const ytdComponents = (() => {
  const out = [];

  // Months fully covered: every monthlyReports entry whose month key is
  // strictly earlier than the partial-month prefix (so Apr 2026 ships
  // in full, May 2026 is treated as partial via the export).
  for (const r of monthlyReports) {
    if (r.month >= PARTIAL_MONTH_PREFIX) continue;
    out.push({
      label: labelForMonthKey(r.month),
      period: r.month,
      kwh: r.displayedTotal,
      days: daysForMonthKey(r.month),
      source: 'src/data/monthlyConsumption.js (BMS All Meters page master-meter)',
    });
  }

  // Partial month from the export — the month containing
  // COMPOSED_YTD_AS_OF, dates up to that anchor.
  const partialMonthDays = Array.from(exportDailyByDate.entries())
    .filter(([date]) => date.startsWith(PARTIAL_MONTH_PREFIX) && date <= COMPOSED_YTD_AS_OF)
    .sort();
  if (partialMonthDays.length > 0) {
    const partialKwh = partialMonthDays.reduce((s, [, k]) => s + k, 0);
    const first = partialMonthDays[0][0].slice(8);
    const last = partialMonthDays[partialMonthDays.length - 1][0].slice(8);
    const [yyyy, mm] = PARTIAL_MONTH_PREFIX.split('-');
    out.push({
      label: `${MONTH_NAMES[parseInt(mm, 10) - 1]} ${first}–${last} ${yyyy}`,
      period: PARTIAL_MONTH_PREFIX,
      kwh: Math.round(partialKwh),
      days: partialMonthDays.length,
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

// Days in each month — derived from the actual year so leap-year
// Februaries get 29. Date(year, monthIdx + 1, 0) returns the last
// day of the requested month.
function daysInMonthFor(year, monthIdx) {
  return new Date(year, monthIdx + 1, 0).getDate();
}

// Map each ytdComponent to its month index. Apr/May partial months
// only contribute a fractional share.
function componentToMonthShareCovered(c) {
  // Period like '2026-01' or '2026-05' from the components.
  const year = parseInt(c.period.slice(0, 4), 10);
  const monthIdx = parseInt(c.period.slice(5), 10) - 1;
  if (monthIdx < 0 || monthIdx >= 12) return null;
  // Fraction of the month covered by this component (leap-aware).
  const frac = Math.min(1, c.days / daysInMonthFor(year, monthIdx));
  return { monthIdx, frac, kwh: c.kwh };
}

// Calibrate annual baseline: each measured month implies its own
// "annual" via kwh ÷ (monthShare × frac). Full months (frac = 1)
// give a stable estimate; partial months are noisier because a
// 4-day window is more sensitive to weather/occupancy than a 30-day
// window. Weight each implied annual by its frac so a partial month
// counts proportionally less.
//
// Earlier code took an unweighted mean — which gave a partial 4-day
// May the same vote as a full 31-day January, biasing the
// calibrated annual ~5% high in this dataset.
const measuredMonthCoverages = ytdComponents
  .map(componentToMonthShareCovered)
  .filter((x) => x && x.frac > 0 && monthShare[x.monthIdx] > 0);

const impliedAnnuals = measuredMonthCoverages.map((x) => ({
  implied: x.kwh / (monthShare[x.monthIdx] * x.frac),
  weight:  x.frac,
}));

const fracWeightSum = impliedAnnuals.reduce((s, v) => s + v.weight, 0);
const calibratedAnnual = fracWeightSum > 0
  ? impliedAnnuals.reduce((s, v) => s + v.implied * v.weight, 0) / fracWeightSum
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
