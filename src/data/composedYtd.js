// Composed year-to-date electricity total. Every kWh in the YTD figure
// traces back to a specific measured source:
//
//   • monthlyConsumption.js    — Jan–Apr full-month master-meter
//                                "displayedTotal" rows from the BMS All
//                                Meters page (ground truth)
//   • contiguousMonths2026.js  — May 1 onward, monthly totals from the
//                                contiguous daily Meter Trends export,
//                                scaled to master-meter equivalent (the
//                                building feeds sum ~14% above the master)
//
// The seasonal Year 1 projection below fills the rest of the year.

import { monthlyReports } from './monthlyConsumption.js';
import { reconciledMonths, CONTIGUOUS_LAST_DAY } from './contiguousMonths2026.js';
import { SNAPSHOT_AS_OF } from './envysionSnapshot.js';

// Anchor date for the contiguous YTD composition — the last measured day.
export const COMPOSED_YTD_AS_OF = CONTIGUOUS_LAST_DAY;

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
 * @property {string} period         "YYYY-MM" month key
 * @property {boolean} [reconciled]  true when scaled from the feed-sum export
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

  // 2. Reconciled contiguous months from the daily Meter Trends export,
  //    scaled to master-meter equivalent, so the YTD runs unbroken to the
  //    anchor. A month that also has a master-meter capture above uses the
  //    capture instead — it's ground truth and needs no scale factor.
  for (const m of reconciledMonths) {
    if (fullMonths.has(m.month)) continue;
    if (m.month > COMPOSED_YTD_AS_OF.slice(0, 7)) continue;
    const [yyyy, mm] = m.month.split('-');
    const label = m.partial
      ? `${MONTH_NAMES[parseInt(mm, 10) - 1]} 1–${m.days} ${yyyy}`
      : labelForMonthKey(m.month);
    out.push({ label, period: m.month, kwh: m.kwh, days: m.days, source: m.source, reconciled: true });
  }

  // Chronological order for the composition table.
  out.sort((a, b) => a.period.localeCompare(b.period) || a.label.localeCompare(b.label));
  return out;
})();

export const COMPOSED_YTD_KWH = ytdComponents.reduce((s, c) => s + c.kwh, 0);
export const COMPOSED_YTD_DAYS_COVERED = ytdComponents.reduce((s, c) => s + c.days, 0);

// ─── Year 1 projection — seasonally-anchored ──────────────────────
// The naive approach is linear: kWh × (365 ÷ days_covered). For an
// NH boarding school that's wrong — Jan/Feb peak from heating, Jul
// trough from no occupancy + no heating + AC barely on. Linear
// annualization ignores where in the year the measured run falls.
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

// Map each ytdComponent to its month index. A partial month only
// contributes a fractional share.
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
// give a stable estimate; partial months are noisier because a short
// window is more sensitive to weather/occupancy than a full month. Weight each implied annual by its frac so a partial month
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
    windowKwh += year1Months[m].kwh / daysInMonthFor(year, m);
  }
  return windowKwh > 0 ? COMPOSED_YEAR1_KWH / windowKwh : 1;
}

// envysionSnapshot.js per-building rows are YTD from Jan 1 → SNAPSHOT_AS_OF.
export const SNAPSHOT_ANNUALIZE_FACTOR = annualizeFactorForWindow(`${SNAPSHOT_AS_OF.slice(0, 4)}-01-01`, SNAPSHOT_AS_OF);

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
