// Parse an HOURLY Distech Eclypse "Meter Trends" CSV into the compact
// per-meter summary the dashboard ships.
//
// Extracted from scripts/parseBmsExport.mjs so the browser and the CLI run the
// same code: the admin upload page parses a dropped file with this, and the
// script stays a thin wrapper that writes the result to a module. Pure — no
// fs, no process — so it also runs under vitest.
//
// Input shape (~1,120 columns, hundreds of meters × 8 metrics each):
//   timestamp, PM_01_MainFeed_MeasuredVoltage_L1_L2,
//   PM_01_MainFeed_TotalKilowattHours, PM_01_MainFeed_TotalRealPower, …
//
// Output: { meta, meters } where each meter carries totalKwh, peakKw, avgKw,
// a 24-bucket hour-of-day kW profile, and per-day kWh + peak kW. Raw interval
// samples (~75K points) are NOT kept — too much bundle for what the pages draw.

// Recognized trailing metric tokens. Anything else (voltage, amps, frequency)
// is ignored: the emissions math doesn't need it.
const METRICS = ['TotalKilowattHours', 'TotalRealPower', 'TotalPeakDemand'];
const METRIC_SLOT = {
  TotalKilowattHours: 'kwhCol',
  TotalRealPower: 'realPowerCol',
  TotalPeakDemand: 'peakDemandCol',
};

// A gap longer than this means the counter jumped a reporting hole, not a real
// interval — diffing across it would invent consumption.
const MAX_INTERVAL_HOURS = 6;
// Counter resets / comms glitches produce absurd diffs.
const MAX_ABS_DIFF_KWH = 1e6;
// Real building peaks run 2–6× the mean; anything above this is a sensor blip.
const PEAK_OUTLIER_MULTIPLE = 10;
// Below this much movement over the window, a counter is stuck, not measuring.
const STUCK_KWH = 10;

export function parseCsv(text) {
  // Newline-tolerant naive CSV — this export has no quoted fields.
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

/**
 * @param {string} text        raw CSV
 * @param {string} sourceFile  recorded in meta, e.g. the uploaded filename
 * @returns {{ meta: object, meters: object[] }}
 */
export function parseMeterTrendsHourly(text, sourceFile = 'upload.csv') {
  const { header, rows } = parseCsv(text);
  if (header[0] !== 'timestamp') {
    throw new Error(`Expected first column 'timestamp', got '${header[0]}'`);
  }
  if (rows.length < 2) {
    throw new Error('Need at least two readings to diff a counter');
  }

  // Meter id := the column name minus its trailing metric token, so
  // PM_17_HP01Feed_TotalKilowattHours → PM_17_HP01Feed.
  const meterCols = new Map();
  for (let i = 1; i < header.length; i++) {
    const col = header[i];
    for (const metric of METRICS) {
      const suffix = `_${metric}`;
      if (!col.endsWith(suffix)) continue;
      const meterId = col.slice(0, -suffix.length);
      if (!meterCols.has(meterId)) meterCols.set(meterId, {});
      meterCols.get(meterId)[METRIC_SLOT[metric]] = i;
    }
  }

  const ts = rows.map((r) => new Date(r[0]));
  const summary = [];

  for (const [meterId, cols] of meterCols) {
    const samples = [];
    for (let i = 0; i < rows.length; i++) {
      const cumulative = cols.kwhCol !== undefined ? parseNum(rows[i][cols.kwhCol]) : null;
      if (cumulative === null) continue;
      const peak = cols.peakDemandCol !== undefined ? parseNum(rows[i][cols.peakDemandCol]) : null;
      samples.push({ t: ts[i], cumulativeKwh: cumulative, peakKw: peak });
    }
    if (samples.length < 2) {
      summary.push({ id: meterId, totalKwh: 0, peakKw: 0, avgKw: 0, hourly: Array(24).fill(0), daily: [], sampleCount: 0 });
      continue;
    }

    // Diff consecutive samples → interval kWh.
    const allDiffs = [];
    for (let i = 1; i < samples.length; i++) {
      const dKwh = samples[i].cumulativeKwh - samples[i - 1].cumulativeKwh;
      const dt = (samples[i].t - samples[i - 1].t) / 3600000;
      if (dt <= 0 || dt > MAX_INTERVAL_HOURS) continue;
      if (Math.abs(dKwh) > MAX_ABS_DIFF_KWH) continue;
      allDiffs.push({ t: samples[i].t, dKwh, dt, peakKw: samples[i].peakKw });
    }

    // Direction: bidirectional meters (solar) count DOWN while exporting, so a
    // negative window total is generation and its magnitude is what we keep.
    const signedTotal = allDiffs.reduce((s, d) => s + d.dKwh, 0);
    let direction = 'consumption';
    let signFlip = 1;
    if (signedTotal < -STUCK_KWH) {
      direction = 'generation';
      signFlip = -1;
    } else if (Math.abs(signedTotal) < STUCK_KWH) {
      direction = 'stuck';
    }

    // Hour-of-day and date key both come from LOCAL time: mixing local hours
    // with UTC dates shifts late-evening load into the next day's bucket and
    // the daily totals drift from what a building manager reads off the BMS.
    const intervals = [];
    for (const d of allDiffs) {
      const corrected = d.dKwh * signFlip;
      if (corrected < -0.1) continue; // small reversal against the dominant direction
      const yyyy = d.t.getFullYear();
      const mm = String(d.t.getMonth() + 1).padStart(2, '0');
      const dd = String(d.t.getDate()).padStart(2, '0');
      intervals.push({
        hourOfDay: d.t.getHours(),
        dateKey: `${yyyy}-${mm}-${dd}`,
        kwh: Math.max(0, corrected),
        kw: Math.max(0, corrected) / d.dt,
        peakKw: d.peakKw,
      });
    }

    const buckets = Array.from({ length: 24 }, () => ({ sum: 0, n: 0 }));
    for (const r of intervals) {
      buckets[r.hourOfDay].sum += r.kw;
      buckets[r.hourOfDay].n += 1;
    }
    const hourly = buckets.map((b) => (b.n > 0 ? +(b.sum / b.n).toFixed(2) : 0));

    const dayMap = new Map();
    for (const r of intervals) {
      if (!dayMap.has(r.dateKey)) dayMap.set(r.dateKey, { kwhSum: 0, peakKw: 0 });
      const day = dayMap.get(r.dateKey);
      day.kwhSum += r.kwh;
      const candidatePeak = r.peakKw !== null ? r.peakKw : r.kw;
      if (candidatePeak > day.peakKw) day.peakKw = candidatePeak;
    }
    const daily = Array.from(dayMap.entries())
      .sort()
      .map(([date, d]) => ({ date, kwh: +d.kwhSum.toFixed(1), peakKw: +d.peakKw.toFixed(2) }));

    const totalFromCumulative = +Math.abs(signedTotal).toFixed(1);
    const totalFromIntegration = +daily.reduce((s, d) => s + d.kwh, 0).toFixed(1);
    const totalKwh = direction === 'stuck' ? 0 : totalFromCumulative;

    const allKw = intervals.map((r) => r.kw);
    const avgKw = allKw.length ? +(allKw.reduce((s, v) => s + v, 0) / allKw.length).toFixed(2) : 0;
    const sanePeakCap = avgKw > 0 ? avgKw * PEAK_OUTLIER_MULTIPLE : Infinity;
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
      direction,
      signedCumulative: +signedTotal.toFixed(1),
    });
  }

  // Biggest loads first.
  summary.sort((a, b) => b.totalKwh - a.totalKwh);

  return {
    meta: {
      sourceFile,
      // Min/max rather than first/last: a newest-first export would otherwise
      // report a window that runs backwards, and every annualize factor
      // derived from it would be garbage.
      windowStartIso: new Date(Math.min(...ts.map((d) => d.getTime()))).toISOString(),
      windowEndIso: new Date(Math.max(...ts.map((d) => d.getTime()))).toISOString(),
      hoursCovered: ts.length,
      meterCount: summary.length,
      generatedAt: new Date().toISOString(),
    },
    meters: summary,
  };
}
