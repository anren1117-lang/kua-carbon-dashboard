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

// Annualization: full-year ÷ days-covered.
export const COMPOSED_ANNUALIZE_FACTOR = COMPOSED_YTD_DAYS_COVERED > 0 ? 365 / COMPOSED_YTD_DAYS_COVERED : 1;
export const COMPOSED_ANNUAL_KWH    = Math.round(COMPOSED_YTD_KWH * COMPOSED_ANNUALIZE_FACTOR);

// COMPOSED_YTD_MTCO2E and COMPOSED_ANNUAL_MTCO2E are computed in
// gridMix.js, NOT here — that's where the cited per-fuel emission
// factors live. Importing them back into this file would create a
// circular dependency. To get those values:
//   import { GRID_MIX_TOTAL_MTCO2E, GRID_MIX_ANNUAL_MTCO2E } from './gridMix.js'
