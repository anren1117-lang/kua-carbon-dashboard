// Monthly campus feed-sum from a DAILY Distech Eclypse Meter Trends export,
// and the feed-sum → master-meter scale. Pure functions so the day-boundary
// and calibration rules are unit-tested; scripts/sumMonthlyFeeds.mjs is the
// CLI that prints the numbers for src/data/contiguousMonths2026.js.
//
// Rules:
//   • Campus feeds only (isCampusFeed).
//   • Each counter reading is stamped at local midnight, so the diff from day
//     D 00:00 to day D+1 00:00 is day D's consumption. The export's last row
//     closes the previous day.
//   • Diffs are SIGNED. A feed with solar behind it (e.g. PM_19_KurthDorm)
//     runs its counter backwards while exporting; the master meter sees that
//     as net import, so the feed-sum does too. PM_20_SBKPanelFeed runs
//     backwards on every day it reports — more likely a reversed CT than
//     generation. Counting it flipped instead of signed moves the 2026 scale
//     0.8740 → 0.8604 and the scaled May–Sep total by about −0.4%.
//   • A missing reading, or a daily diff beyond MAX_DAILY_DIFF_KWH (counter
//     reset, meter swap), counts as a missing feed-day, not as consumption.
//   • A month can calibrate the scale only if every calendar day is present,
//     its total is positive, and its estimated missing load is at most
//     MAX_MISSING_SHARE of the month.

import { isCampusFeed } from './campusFeeds.js';

export const MAX_DAILY_DIFF_KWH = 20000;
export const MAX_MISSING_SHARE = 0.005;
const KWH_SUFFIX = '_TotalKilowattHours';

export function parseMeterTrendsCsv(text) {
  // Naive split is safe: the export has no quoted fields or embedded commas.
  const lines = text.split(/\r?\n/).filter((l) => l.length > 0);
  const header = lines[0].split(',');
  if (header[0] !== 'timestamp') {
    throw new Error(`Expected first column 'timestamp', got '${header[0]}'`);
  }
  return { header, rows: lines.slice(1).map((l) => l.split(',')) };
}

export function daysInMonth(monthKey) {
  const [y, m] = monthKey.split('-').map((s) => parseInt(s, 10));
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

// Timestamps are local wall-clock ('2026-05-01T00:00:00.000'); work on the
// date strings so no timezone conversion can shift a day across a boundary.
function addDay(iso) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

const num = (x) => (x === undefined || x === '' || !Number.isFinite(Number(x)) ? null : Number(x));

/**
 * @typedef {Object} FeedMonth
 * @property {number} kwh              signed campus feed-sum
 * @property {number} days             days with a full-day diff
 * @property {number} calendarDays
 * @property {number} missingFeedDays  feed × day cells with no usable diff
 * @property {number} missingEstKwh    those cells × that feed's mean daily |kWh|
 */

/**
 * @param {{header: string[], rows: string[][]}} csv
 * @returns {{feedCount: number, firstReading: string, lastReading: string,
 *   lastFullDay: string|null, months: Record<string, FeedMonth>, warnings: string[]}}
 */
export function sumCampusFeedsByMonth({ header, rows }) {
  const warnings = [];
  const dates = rows.map((r) => r[0].slice(0, 10));

  const feedCols = [];
  for (let i = 1; i < header.length; i++) {
    if (!header[i].endsWith(KWH_SUFFIX)) continue;
    const id = header[i].slice(0, -KWH_SUFFIX.length);
    if (isCampusFeed(id)) feedCols.push({ id, col: i });
  }

  // Row indexes k whose previous row is exactly one day earlier.
  const dayRows = [];
  for (let k = 1; k < rows.length; k++) {
    if (addDay(dates[k - 1]) === dates[k]) dayRows.push(k);
    else warnings.push(`non-consecutive rows ${dates[k - 1]} → ${dates[k]}: day(s) skipped`);
  }

  const diffs = feedCols.map(({ id, col }) => dayRows.map((k) => {
    const a = num(rows[k - 1][col]);
    const b = num(rows[k][col]);
    if (a === null || b === null) return null;
    const d = b - a;
    if (Math.abs(d) > MAX_DAILY_DIFF_KWH) {
      warnings.push(`${dates[k - 1]} ${id}: implausible daily diff ${d.toFixed(0)} kWh treated as missing`);
      return null;
    }
    return d;
  }));

  // Estimate each gap from that feed's mean daily |kWh| on the days it did
  // report — used only to decide whether a month is complete enough to
  // calibrate on.
  const meanAbsDaily = diffs.map((ds) => {
    const ok = ds.filter((d) => d !== null);
    return ok.length ? ok.reduce((s, d) => s + Math.abs(d), 0) / ok.length : 0;
  });

  const months = {};
  dayRows.forEach((k, j) => {
    const mk = dates[k - 1].slice(0, 7);
    if (!months[mk]) {
      months[mk] = { kwh: 0, days: 0, calendarDays: daysInMonth(mk), missingFeedDays: 0, missingEstKwh: 0 };
    }
    const m = months[mk];
    m.days++;
    diffs.forEach((ds, f) => {
      if (ds[j] === null) {
        m.missingFeedDays++;
        m.missingEstKwh += meanAbsDaily[f];
      } else {
        m.kwh += ds[j];
      }
    });
  });

  return {
    feedCount: feedCols.length,
    firstReading: dates[0],
    lastReading: dates[dates.length - 1],
    lastFullDay: dayRows.length ? dates[dayRows[dayRows.length - 1] - 1] : null,
    months,
    warnings,
  };
}

/**
 * Master-meter total ÷ feed-sum over the months that have a master capture
 * and near-complete feed coverage. Null when no month qualifies.
 * @param {Record<string, FeedMonth>} months
 * @param {{month: string, displayedTotal: number}[]} masterReports
 */
export function calibrateToMaster(months, masterReports, maxMissingShare = MAX_MISSING_SHARE) {
  const used = masterReports.filter((r) => {
    const m = months[r.month];
    return m && m.days === m.calendarDays && m.kwh > 0 && m.missingEstKwh / m.kwh <= maxMissingShare;
  });
  if (used.length === 0) return null;
  const masterKwh = used.reduce((s, r) => s + r.displayedTotal, 0);
  const feedKwh = used.reduce((s, r) => s + months[r.month].kwh, 0);
  return { months: used.map((r) => r.month), masterKwh, feedKwh, scale: masterKwh / feedKwh };
}
