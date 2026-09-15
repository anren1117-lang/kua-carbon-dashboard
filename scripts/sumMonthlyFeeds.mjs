#!/usr/bin/env node
// CLI: monthly campus feed-sum from a DAILY Distech Eclypse Meter Trends
// export, plus the feed-sum → master-meter scale. Its output is copied into
// src/data/contiguousMonths2026.js; the rules live (and are unit-tested) in
// src/data/feedMonthSums.js.
//
// Usage:
//   node scripts/sumMonthlyFeeds.mjs <daily-export.csv>
//
// Why a separate script: parseBmsExport.mjs is built for HOURLY exports and
// drops any sample gap over 6 h, so a daily export parses to all zeros.

import fs from 'node:fs';
import { monthlyReports } from '../src/data/monthlyConsumption.js';
import {
  parseMeterTrendsCsv,
  sumCampusFeedsByMonth,
  calibrateToMaster,
  MAX_MISSING_SHARE,
} from '../src/data/feedMonthSums.js';

const [, , inputPath] = process.argv;
if (!inputPath) {
  console.error('Usage: sumMonthlyFeeds.mjs <daily-export.csv>');
  process.exit(1);
}

const result = sumCampusFeedsByMonth(parseMeterTrendsCsv(fs.readFileSync(inputPath, 'utf8')));
const monthKeys = Object.keys(result.months).sort();

console.log(`Source: ${inputPath.split('/').pop()}`);
console.log(`Campus feeds: ${result.feedCount}; readings ${result.firstReading} → ${result.lastReading}; last full day ${result.lastFullDay}`);
console.log('');
console.log('Month     days  feed-sum kWh  missing feed-days (~kWh)   master kWh  master÷feed');
for (const mk of monthKeys) {
  const m = result.months[mk];
  const master = monthlyReports.find((r) => r.month === mk)?.displayedTotal;
  const share = m.kwh > 0 ? `${(100 * m.missingEstKwh / m.kwh).toFixed(1)}%` : 'n/a';
  const gap = m.missingFeedDays ? `${m.missingFeedDays} (~${Math.round(m.missingEstKwh)}, ${share})` : '0';
  const days = m.days === m.calendarDays ? String(m.days) : `${m.days}/${m.calendarDays}`;
  console.log(
    `${mk}   ${days.padStart(5)}  ${String(Math.round(m.kwh)).padStart(11)}  ${gap.padStart(24)}` +
    `  ${master ? String(master).padStart(11) : '          —'}  ${master ? (master / m.kwh).toFixed(3).padStart(11) : ''}`,
  );
}

// Only the export's first and last months may legitimately be partial.
for (const mk of monthKeys.slice(1, -1)) {
  const m = result.months[mk];
  if (m.days !== m.calendarDays) console.log(`WARNING: ${mk} has ${m.days} of ${m.calendarDays} days — do not ship it as a full month`);
}

console.log('');
const cal = calibrateToMaster(result.months, monthlyReports);
if (!cal) {
  console.error(`No month qualifies for calibration (needs a master capture, every day present, positive total, ≤${MAX_MISSING_SHARE * 100}% missing load).`);
  process.exit(1);
}
console.log(`Calibration months ${cal.months.join(', ')}: master ${cal.masterKwh} ÷ feed-sum ${Math.round(cal.feedKwh)} = ${cal.scale.toFixed(4)}`);

if (result.warnings.length) {
  console.log('');
  console.log(`Warnings (${result.warnings.length}):`);
  result.warnings.slice(0, 40).forEach((w) => console.log(`  ${w}`));
}
