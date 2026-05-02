// Meter anomaly detection — z-score against the meter's own history,
// gap detection, stale-meter detection. Returns issues for the
// /api/meters/quality endpoint and per-building dashboard alerts.

/**
 * @typedef {Object} MeterDataQualityIssue
 * @property {string} meterId
 * @property {'gap'|'spike'|'flat'|'stale'} kind
 * @property {string} startedAt
 * @property {string=} endedAt
 * @property {number=} zScore
 * @property {string} description
 */

/**
 * @param {import('../adapters/meter/MeterDataAdapter.js').MeterReading[]} readings
 * @param {object} opts
 * @param {number=} opts.zThreshold         Default 3.0
 * @param {number=} opts.gapMinutesThreshold Default 4× intervalMinutes
 * @returns {MeterDataQualityIssue[]}
 */
export function detectAnomalies(readings, opts = {}) {
  const zThreshold = opts.zThreshold ?? 3.0;
  if (readings.length < 8) return [];

  // Group by meterId
  const byMeter = new Map();
  for (const r of readings) {
    if (!byMeter.has(r.meterId)) byMeter.set(r.meterId, []);
    byMeter.get(r.meterId).push(r);
  }

  /** @type {MeterDataQualityIssue[]} */
  const issues = [];

  for (const [meterId, list] of byMeter) {
    list.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

    // Z-score on values
    const vals = list.map((r) => r.value);
    const mean = vals.reduce((s, v) => s + v, 0) / vals.length;
    const variance = vals.reduce((s, v) => s + (v - mean) ** 2, 0) / vals.length;
    const std = Math.sqrt(variance);
    if (std > 0) {
      for (const r of list) {
        const z = (r.value - mean) / std;
        if (Math.abs(z) >= zThreshold) {
          issues.push({
            meterId,
            kind: 'spike',
            startedAt: r.timestamp,
            zScore: Number(z.toFixed(2)),
            description: `Reading ${r.value.toFixed(2)} is ${z.toFixed(2)} standard deviations from this meter's mean (${mean.toFixed(2)}).`,
          });
        }
      }
    }

    // Flat: 6 consecutive identical values
    let runStart = null;
    let runLen = 0;
    for (let i = 1; i < list.length; i++) {
      if (list[i].value === list[i - 1].value) {
        if (runLen === 0) runStart = list[i - 1].timestamp;
        runLen++;
      } else {
        if (runLen >= 6) {
          issues.push({
            meterId,
            kind: 'flat',
            startedAt: runStart,
            endedAt: list[i - 1].timestamp,
            description: `${runLen + 1} consecutive identical readings — meter may be stuck.`,
          });
        }
        runLen = 0;
      }
    }

    // Gap: time between successive readings > 4× interval
    for (let i = 1; i < list.length; i++) {
      const dt = (new Date(list[i].timestamp).getTime() - new Date(list[i - 1].timestamp).getTime()) / 60000;
      const expected = list[i].intervalMinutes;
      if (dt > expected * 4) {
        issues.push({
          meterId,
          kind: 'gap',
          startedAt: list[i - 1].timestamp,
          endedAt: list[i].timestamp,
          description: `Gap of ${Math.round(dt)} minutes (expected ~${expected}).`,
        });
      }
    }

    // Stale: last reading older than 24h compared to query window end
    const last = list[list.length - 1];
    if (last) {
      const ageHours = (Date.now() - new Date(last.timestamp).getTime()) / 3600000;
      if (ageHours > 24) {
        issues.push({
          meterId,
          kind: 'stale',
          startedAt: last.timestamp,
          description: `Last reading is ${Math.round(ageHours)} hours old.`,
        });
      }
    }
  }

  return issues;
}

/**
 * Aggregate quality score 0-100 for a meter set.
 */
export function qualityScore(readings, issues) {
  if (!readings.length) return 0;
  const totalIssues = issues.length;
  const penalty = Math.min(70, totalIssues * 5);
  return Math.max(0, 100 - penalty);
}
