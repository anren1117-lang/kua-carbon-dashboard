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
import { bmsExportMeters as bmsExportAprMeters } from './bmsExportApr2026.js';
import { bmsExportMeters as bmsExportSepMeters } from './bmsExportSep2026.js';

// Heuristic: which feeds in the export count toward a campus total?
// Same definition used by the Scope 2 BMS insights panel — main feeds
// and panel feeds, not submeters underneath them.
function isCampusFeed(id) {
  return /MainFeed$|PanelFeed$|MDPFeed$|MDP$|^PM_\d+_Feed$|^PM_\d+_LP$|^PM_\d+_MainFeed$/.test(id);
}

// Daily campus totals by date, summed across campus feeds, for a parsed
// export. We have two measured windows: the April export (Apr 5 – May 4)
// and the September export (Aug 16 – Sep 14). Each contributes the
// partial months not already covered by a full-month master-meter
// capture; the gap between them (May 5 – Aug 15) is unmeasured and gets
// filled by the seasonal projection in projectYear1(), not counted as
// measured here.
function exportDailyByDate(meters) {
  const out = new Map();
  for (const m of meters) {
    if (!isCampusFeed(m.id)) continue;
    for (const d of (m.daily || [])) {
      out.set(d.date, (out.get(d.date) || 0) + d.kwh);
    }
  }
  return out;
}
const aprExportDaily = exportDailyByDate(bmsExportAprMeters);
const sepExportDaily = exportDailyByDate(bmsExportSepMeters);

// Anchor date for the contiguous YTD composition — the last day of the
// unbroken measured run from Jan 1. The September export (Aug 16 – Sep 14)
// is measured too, but it's non-contiguous (May 5 – Aug 15 has no capture),
// so it is surfaced separately as LATEST_MEASURED_WINDOW rather than
// extending this anchor. That keeps the annual projection anchored on a
// contiguous span instead of a short late-summer slice.
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

/** @type {YtdComponent[]} */
export const ytdComponents = (() => {
  const out = [];
  const fullMonths = new Set();

  // 1. Full months from the master-meter captures. A month counts as
  //    "full" only if its last calendar day is on or before the anchor.
  for (const r of monthlyReports) {
    const lastDay = `${r.month}-${String(daysForMonthKey(r.month)).padStart(2, '0')}`;
    if (lastDay > COMPOSED_YTD_AS_OF) continue;
    out.push({
      label: labelForMonthKey(r.month),
      period: r.month,
      kwh: r.displayedTotal,
      days: daysForMonthKey(r.month),
      source: 'src/data/monthlyConsumption.js (BMS All Meters page master-meter)',
    });
    fullMonths.add(r.month);
  }

  // 2. Partial months from each measured export — every month with
  //    export days up to the anchor that isn't already a full month.
  //    April export → May 1–4; September export → Aug 16–31 + Sep 1–14.
  //    (April's own Apr days are dropped because Apr is a full month.)
  const addPartials = (dailyMap, sourceFile) => {
    const byMonth = new Map(); // 'YYYY-MM' → [date, ...]
    for (const date of dailyMap.keys()) {
      if (date > COMPOSED_YTD_AS_OF) continue;
      const mk = date.slice(0, 7);
      if (fullMonths.has(mk)) continue;
      if (!byMonth.has(mk)) byMonth.set(mk, []);
      byMonth.get(mk).push(date);
    }
    for (const [mk, dates] of byMonth) {
      dates.sort();
      const kwh = Math.round(dates.reduce((s, d) => s + dailyMap.get(d), 0));
      const [yyyy, mm] = mk.split('-');
      const first = dates[0].slice(8);
      const last = dates[dates.length - 1].slice(8);
      out.push({
        label: `${MONTH_NAMES[parseInt(mm, 10) - 1]} ${first}–${last} ${yyyy}`,
        period: mk,
        kwh,
        days: dates.length,
        source: sourceFile,
      });
    }
  };
  // Only the contiguous run (April export → May 1–4) extends the YTD. The
  // September export is surfaced separately (LATEST_MEASURED_WINDOW below).
  addPartials(aprExportDaily, 'src/data/bmsExportApr2026.js (April Meter Trends export, daily campus-feed sum)');

  // Chronological order for the composition table.
  out.sort((a, b) => a.period.localeCompare(b.period) || a.label.localeCompare(b.label));
  return out;
})();

// The latest measured operational window — the September export
// (Aug 16 – Sep 14). Shown alongside the YTD as a measured slice, but
// deliberately NOT folded into COMPOSED_YTD or the annual calibration: it's
// a ~30-day, non-contiguous window (the May 5 – Aug 15 gap is unmeasured),
// and using a short late-summer slice to re-anchor a whole-year projection
// through a seasonal shape it appears to contradict would be less reliable
// than the contiguous Jan–Apr anchor. It does signal that campus summer load
// runs higher than the heating-driven model assumes — flagged in the UI.
export const LATEST_MEASURED_WINDOW = (() => {
  const dates = Array.from(sepExportDaily.keys()).sort();
  if (dates.length === 0) return null;
  const kwh = Math.round(dates.reduce((s, d) => s + sepExportDaily.get(d), 0));
  const start = dates[0];
  const end = dates[dates.length - 1];
  // Unmeasured gap between the contiguous YTD anchor and this window's start.
  const anchor = new Date(COMPOSED_YTD_AS_OF + 'T00:00:00Z');
  const winStart = new Date(start + 'T00:00:00Z');
  const gapDays = Math.max(0, Math.round((winStart - anchor) / 86400000) - 1);
  return { start, end, kwh, days: dates.length, gapDays, source: 'src/data/bmsExportSep2026.js' };
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
