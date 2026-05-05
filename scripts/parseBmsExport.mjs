#!/usr/bin/env node
// One-shot parser: reads a Distech Eclypse Meter Trends CSV export and
// emits a compact JS module the dashboard can ship as static data.
//
// Usage:
//   node scripts/parseBmsExport.mjs <input.csv> <output.js>
//
// Input shape (Eclypse Meter Trends CSV):
//   timestamp,
//   PM_01_MainFeed_MeasuredVoltage_L1_L2,
//   PM_01_MainFeed_TotalKilowattHours,
//   PM_01_MainFeed_TotalRealPower,
//   ...
//   (~1,120 columns, hundreds of meters × 8 metrics each)
//
// Output: per-meter compact summary
//   {
//     meta: { sourceFile, windowStartIso, windowEndIso, hoursCovered, generatedAt },
//     meters: [{
//       id:           'PM_01_MainFeed',
//       totalKwh:      12345.6,
//       peakKw:        180.2,
//       avgKw:          17.1,
//       hourly:    [..24 numbers..],   // mean kW by hour-of-day 0..23
//       daily:     [{ date, kwh, peakKw }, ...],
//     }]
//   }
//
// We don't ship raw 1-hour interval samples (~75K data points) — too
// much bundle for what the page actually needs. The compact summary is
// ~150 KB and plenty for trend visualization at the dashboard's scale.

import fs from 'node:fs';

function parseCsv(text) {
  // Newline-tolerant naive CSV (no embedded commas in this file).
  const lines = text.split(/\r?\n/).filter((l) => l.length > 0);
  const header = lines[0].split(',');
  const rows = lines.slice(1).map((l) => l.split(','));
  return { header, rows };
}

function parseNum(x) {
  if (x === undefined || x === null || x === '') return null;
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}

const [, , inputPath, outputPath] = process.argv;
if (!inputPath || !outputPath) {
  console.error('Usage: parseBmsExport.mjs <input.csv> <output.js>');
  process.exit(1);
}

const text = fs.readFileSync(inputPath, 'utf8');
const { header, rows } = parseCsv(text);

// Build column index by metric type, grouped by meter id.
//   Meter id := the prefix before the last underscore-separated metric.
//   e.g. PM_17_HP01Feed_TotalKilowattHours → meterId 'PM_17_HP01Feed'
//        PM_17_HP01Feed_TotalRealPower      → same meterId
const TS_COL = header.indexOf('timestamp');
if (TS_COL !== 0) {
  console.error(`Expected first column 'timestamp', got '${header[0]}'`);
  process.exit(1);
}

// Recognized trailing metric tokens. Anything else is ignored for the
// summary (we don't need voltage/amps/frequency for emissions math).
const METRICS = ['TotalKilowattHours', 'TotalRealPower', 'TotalPeakDemand'];
const meters = new Map(); // meterId → { kwhCol, realPowerCol, peakDemandCol }

for (let i = 1; i < header.length; i++) {
  const col = header[i];
  for (const metric of METRICS) {
    const suffix = '_' + metric;
    if (col.endsWith(suffix)) {
      const meterId = col.slice(0, -suffix.length);
      if (!meters.has(meterId)) meters.set(meterId, {});
      const slot = ({
        TotalKilowattHours: 'kwhCol',
        TotalRealPower:     'realPowerCol',
        TotalPeakDemand:    'peakDemandCol',
      })[metric];
      meters.get(meterId)[slot] = i;
    }
  }
}

// Walk the rows once. For each meter, the load profile (hourly + daily
// + total) is derived by diffing the cumulative kWh column across
// consecutive samples — works on all 104 meters, while RealPower is
// only present on ~12. PeakDemand column gives us peak kW directly
// where available; otherwise peak is derived from the max diff.
const ts = rows.map((r) => new Date(r[TS_COL]));

const summary = [];
for (const [meterId, cols] of meters) {
  // Read cumulative kWh + peak demand columns into parallel arrays,
  // skipping rows where either parses to null.
  const samples = []; // [{ t: Date, cumulativeKwh: number, peakKw: number|null }]
  for (let i = 0; i < rows.length; i++) {
    const c = cols.kwhCol !== undefined ? parseNum(rows[i][cols.kwhCol]) : null;
    if (c === null) continue;
    const pd = cols.peakDemandCol !== undefined ? parseNum(rows[i][cols.peakDemandCol]) : null;
    samples.push({ t: ts[i], cumulativeKwh: c, peakKw: pd });
  }
  if (samples.length < 2) {
    // Not enough data to compute a delta. Skip but record the existence.
    summary.push({ id: meterId, totalKwh: 0, peakKw: 0, avgKw: 0, hourly: Array(24).fill(0), daily: [], sampleCount: 0 });
    continue;
  }

  // Diff consecutive samples → interval kWh. Bidirectional metering
  // (e.g. solar inverters) reports negative diffs when generating —
  // the magnitude is real, just signed by direction. Detect the
  // dominant counter direction and either keep all diffs (signed) or
  // flip sign so the magnitude stays positive.
  const allDiffs = [];
  for (let i = 1; i < samples.length; i++) {
    const dKwh = samples[i].cumulativeKwh - samples[i - 1].cumulativeKwh;
    const dt = (samples[i].t - samples[i - 1].t) / 3600000;
    if (dt <= 0 || dt > 6) continue;
    if (Math.abs(dKwh) > 1e6) continue; // wild glitch only
    allDiffs.push({ t: samples[i].t, dKwh, dt, peakKw: samples[i].peakKw });
  }

  // Direction inference: sum the signed diffs over the whole window.
  // Negative dominant = bidirectional meter accumulating "outbound"
  // energy as negative (generation/export). Positive dominant = normal
  // consumption meter. Near zero = stuck/broken meter.
  const signedTotal = allDiffs.reduce((s, d) => s + d.dKwh, 0);
  let direction = 'consumption';   // counter increases as energy flows in
  let signFlip = 1;
  if (signedTotal < -10) {
    direction = 'generation';      // counter decreases over time = exporting
    signFlip = -1;                 // flip so |kWh| represents magnitude generated
  } else if (Math.abs(signedTotal) < 10) {
    direction = 'stuck';           // no meaningful counter movement
  }

  // Build interval list using the inferred direction. Skip diffs that
  // run AGAINST the dominant direction (genuine reversals = noise for
  // a unidirectional meter; for bidirectional meters they're the
  // parasitic load and we count them with sign flipped if we want
  // to track parasitic separately).
  const intervals = [];
  for (const d of allDiffs) {
    const corrected = d.dKwh * signFlip; // positive = magnitude in the dominant direction
    if (corrected < -0.1) continue; // small reversal - skip as noise
    intervals.push({
      t: d.t,
      hourOfDay: d.t.getHours(),
      dateKey: d.t.toISOString().slice(0, 10),
      kwh: Math.max(0, corrected),
      kw:  Math.max(0, corrected) / d.dt,
      peakKw: d.peakKw,
    });
  }

  // Per-hour mean kW (24-bucket profile).
  const buckets = Array.from({ length: 24 }, () => ({ sum: 0, n: 0 }));
  for (const r of intervals) {
    buckets[r.hourOfDay].sum += r.kw;
    buckets[r.hourOfDay].n += 1;
  }
  const hourly = buckets.map((b) => (b.n > 0 ? +(b.sum / b.n).toFixed(2) : 0));

  // Per-day stats: sum kWh, max peakKw (from PeakDemand col where available,
  // else from the largest interval kW we observed).
  const dayMap = new Map();
  for (const r of intervals) {
    if (!dayMap.has(r.dateKey)) dayMap.set(r.dateKey, { kwhSum: 0, peakKw: 0 });
    const d = dayMap.get(r.dateKey);
    d.kwhSum += r.kwh;
    const candidatePeak = r.peakKw !== null ? r.peakKw : r.kw;
    if (candidatePeak > d.peakKw) d.peakKw = candidatePeak;
  }
  const daily = Array.from(dayMap.entries())
    .sort()
    .map(([date, d]) => ({
      date,
      kwh:    +d.kwhSum.toFixed(1),
      peakKw: +d.peakKw.toFixed(2),
    }));

  // Window total kWh — magnitude in the dominant direction. signFlip
  // converts a generating meter's negative cumulative-diff to a
  // positive magnitude representing energy GENERATED.
  const totalFromCumulative = +Math.abs(signedTotal).toFixed(1);
  const totalFromIntegration = +daily.reduce((s, d) => s + d.kwh, 0).toFixed(1);
  const totalKwh = direction === 'stuck' ? 0 : totalFromCumulative;

  const allKw = intervals.map((r) => r.kw);
  const avgKw  = allKw.length ? +(allKw.reduce((s, v) => s + v, 0) / allKw.length).toFixed(2) : 0;
  // Filter peak outliers: real building peaks are typically 2–6× the
  // average load. Drop anything above 10× the mean as a sensor blip
  // (e.g. counter reset spike, transient miscount, comms glitch).
  const sanePeakCap = avgKw > 0 ? avgKw * 10 : Infinity;
  const peakKwFromIntervals = allKw.length ? Math.max(...allKw.filter((v) => v <= sanePeakCap)) : 0;
  const peakKwFromColumn = intervals
    .map((r) => r.peakKw)
    .filter((v) => v !== null && v !== undefined && v <= sanePeakCap);
  const peakKw = +Math.max(peakKwFromIntervals, ...(peakKwFromColumn.length ? peakKwFromColumn : [0])).toFixed(2);
  const droppedOutliers = allKw.filter((v) => v > sanePeakCap).length;

  summary.push({
    id: meterId,
    totalKwh,
    totalKwhCumulative: totalFromCumulative,
    totalKwhIntegrated: totalFromIntegration,
    peakKw,
    avgKw,
    hourly,
    daily,
    sampleCount: intervals.length,
    droppedOutliers,
    direction,                     // 'consumption' | 'generation' | 'stuck'
    signedCumulative: +signedTotal.toFixed(1), // raw signed diff for audit
  });
}

// Sort by total kWh descending so the biggest loads sit at the top.
summary.sort((a, b) => b.totalKwh - a.totalKwh);

const meta = {
  sourceFile: inputPath.split('/').pop(),
  windowStartIso: ts[0].toISOString(),
  windowEndIso:   ts[ts.length - 1].toISOString(),
  hoursCovered:   ts.length,
  meterCount:     summary.length,
  generatedAt:    new Date().toISOString(),
};

const out = `// Auto-generated from ${meta.sourceFile} by scripts/parseBmsExport.mjs
// Do not edit by hand. Re-run the parser with a fresh export to update.
//
// Source window: ${meta.windowStartIso} → ${meta.windowEndIso}
// Meters: ${meta.meterCount}, hours covered: ${meta.hoursCovered}.
// Per-meter shape: { id, totalKwh, peakKw, avgKw, hourly[24], daily[{date,kwh,peakKw}], sampleCount }.

export const BMS_EXPORT_META = ${JSON.stringify(meta, null, 2)};

export const bmsExportMeters = ${JSON.stringify(summary, null, 2)};
`;

fs.writeFileSync(outputPath, out, 'utf8');
console.log(`Wrote ${summary.length} meters → ${outputPath}`);
console.log(`Window: ${meta.windowStartIso} → ${meta.windowEndIso} (${meta.hoursCovered} hours)`);
console.log(`Top 5 meters by total kWh:`);
summary.slice(0, 5).forEach((m, i) => {
  console.log(`  ${i + 1}. ${m.id.padEnd(45)} ${String(m.totalKwh).padStart(10)} kWh  peak ${m.peakKw} kW`);
});
