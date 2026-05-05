// BmsExportMeterAdapter — reads from the parsed Distech Eclypse Meter
// Trends CSV (src/data/bmsExportApr2026.js) and synthesizes hourly
// readings on demand by combining each meter's measured daily total
// with its measured hour-of-day load profile.
//
// Why synthesize: the parser keeps a compact summary (daily totals +
// 24-bucket hourly profile + peak) rather than the raw 712 hourly
// samples per meter, to stay bundle-friendly. For Trend Builder's
// resolution this is honest:
//   - daily kWh totals are direct measurements
//   - the hourly distribution is averaged across the export window
//   - synthetic samples = daily.kwh × (hourProfile[h] / sum(hourProfile))
//
// Outside the export window, this adapter falls through to the Mock
// adapter so the rest of the year still renders.

import { MockMeterAdapter } from './MockMeterAdapter.js';
import { BMS_EXPORT_META, bmsExportMeters } from '../../data/bmsExportApr2026.js';
import { getBmsMeterMap } from '../../data/bmsExportMapping.js';
import { GRID_MIX_TOTAL_MTCO2E, GRID_MIX_TOTAL_KWH } from '../../data/gridMix.js';

const KG_PER_KWH = (GRID_MIX_TOTAL_MTCO2E * 1000) / GRID_MIX_TOTAL_KWH;

const WINDOW_START_MS = new Date(BMS_EXPORT_META.windowStartIso).getTime();
const WINDOW_END_MS   = new Date(BMS_EXPORT_META.windowEndIso).getTime();

const meterById = Object.fromEntries(bmsExportMeters.map((m) => [m.id, m]));

/** Build the synthetic Meter[] list — one per parsed PM device. */
function listAllMeters() {
  const map = getBmsMeterMap();
  return bmsExportMeters.map((m) => ({
    id: m.id,
    buildingId: map[m.id] || null,
    type:       /Solar/i.test(m.id) ? 'solar' : 'electricity',
    unit:       'kWh',
    provider:   'KUA Distech Eclypse BMS',
    intervalMinutes: 60,
    annualBaselineValue: m.totalKwh, // 30-day window total, used as a baseline reference
  }));
}

function meterIdsForBuilding(buildingId) {
  if (!buildingId) return [];
  const map = getBmsMeterMap();
  return Object.entries(map).filter(([, b]) => b === buildingId).map(([m]) => m);
}

function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

function dateKey(d) { return d.toISOString().slice(0, 10); }

/**
 * Synthesize hourly readings for one meter inside the export window.
 * Each reading carries source: 'bms_export' so the chart can render
 * it as measured.
 */
function synthesizeReadings(meterId, startMs, endMs) {
  const m = meterById[meterId];
  if (!m) return [];
  const dailyByDate = Object.fromEntries((m.daily || []).map((d) => [d.date, d]));
  const profileSum = m.hourly.reduce((s, v) => s + v, 0) || 1;
  const out = [];
  // Iterate hour by hour; only emit a reading if the meter has a
  // daily entry for that date AND the hour falls inside the window.
  const start = new Date(clamp(startMs, WINDOW_START_MS, WINDOW_END_MS));
  start.setMinutes(0, 0, 0);
  const end = new Date(clamp(endMs, WINDOW_START_MS, WINDOW_END_MS));
  for (let t = start.getTime(); t <= end.getTime(); t += 3600000) {
    const ts = new Date(t);
    const dk = dateKey(ts);
    const day = dailyByDate[dk];
    if (!day) continue;
    const hour = ts.getUTCHours();
    const fraction = m.hourly[hour] / profileSum;
    const kwh = day.kwh * fraction;
    out.push({
      id: `${meterId}|${ts.toISOString()}`,
      meterId,
      buildingId: getBmsMeterMap()[meterId] || null,
      meterType: /Solar/i.test(meterId) ? 'solar' : 'electricity',
      timestamp: ts.toISOString(),
      intervalMinutes: 60,
      value: +kwh.toFixed(3),
      unit: 'kWh',
      demandKw: +(kwh).toFixed(3), // hourly kWh ≈ avg kW for that hour
      dataQuality: 'actual',
      source: 'bms_export',
    });
  }
  return out;
}

export const BmsExportMeterAdapter = {
  async listMeters() {
    return listAllMeters();
  },

  async getReadings({ meterId, buildingId, start, end, intervalMinutes }) {
    const startMs = new Date(start).getTime();
    const endMs   = new Date(end).getTime();
    // Decide which meter ids to read.
    let ids = [];
    if (meterId) ids = [meterId];
    else if (buildingId) ids = meterIdsForBuilding(buildingId);
    else ids = bmsExportMeters.map((m) => m.id);

    // Inside-window portion: synthesize from the export.
    const insideOverlap = startMs < WINDOW_END_MS && endMs > WINDOW_START_MS;
    const insideStart = Math.max(startMs, WINDOW_START_MS);
    const insideEnd   = Math.min(endMs, WINDOW_END_MS);

    let inside = [];
    if (insideOverlap) {
      for (const id of ids) {
        inside = inside.concat(synthesizeReadings(id, insideStart, insideEnd));
      }
    }

    // Outside-window portion: defer to mock so charts that span
    // longer ranges still render. Mock returns full mock readings for
    // its declared meters, so we filter to the requested time range
    // and the meters we know about.
    let outside = [];
    if (startMs < WINDOW_START_MS || endMs > WINDOW_END_MS) {
      const mockReadings = await MockMeterAdapter.getReadings({ meterId, buildingId, start, end, intervalMinutes });
      // Drop any mock readings that overlap the BMS window — measured
      // wins over generated.
      outside = mockReadings.filter((r) => {
        const t = new Date(r.timestamp).getTime();
        return t < WINDOW_START_MS || t > WINDOW_END_MS;
      });
    }

    return inside.concat(outside).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  },

  async importReadings(readings) {
    // The BMS export is read-only — the parsed file is regenerated by
    // re-running the parser. Imports (e.g. CSV uploads of supplemental
    // data) still need to land somewhere, so delegate to the mock
    // adapter's in-memory store.
    return MockMeterAdapter.importReadings(readings);
  },

  async getQuality({ start, end }) {
    return bmsExportMeters.map((m) => ({
      meterId: m.id,
      start, end,
      totalReadings: m.sampleCount,
      qualityScore: m.droppedOutliers > 5 ? 70 : 95,
      issues: m.droppedOutliers > 0
        ? [{ kind: 'outliers_filtered', detail: `${m.droppedOutliers} samples above 10× mean filtered as sensor blips`, severity: 'low' }]
        : [],
    }));
  },

  async getBuildingEnergy({ buildingId, start, end }) {
    const ids = meterIdsForBuilding(buildingId);
    if (ids.length === 0) {
      // Building isn't mapped to any PM device yet — fall back to mock
      // so the dashboard doesn't render zeroes.
      return MockMeterAdapter.getBuildingEnergy({ buildingId, start, end });
    }
    const startMs = new Date(start).getTime();
    const endMs   = new Date(end).getTime();
    let totalKwh = 0;
    let peakKw = 0;
    const dailyMap = new Map();
    for (const id of ids) {
      const m = meterById[id];
      if (!m) continue;
      for (const d of (m.daily || [])) {
        const dt = new Date(d.date).getTime();
        if (dt < startMs || dt > endMs) continue;
        totalKwh += d.kwh;
        if (d.peakKw > peakKw) peakKw = d.peakKw;
        dailyMap.set(d.date, (dailyMap.get(d.date) || 0) + d.kwh);
      }
    }
    if (totalKwh === 0) {
      // Mapped but the requested window doesn't overlap the export.
      return MockMeterAdapter.getBuildingEnergy({ buildingId, start, end });
    }
    const mtCO2e = +(totalKwh * KG_PER_KWH / 1000).toFixed(3);
    return {
      buildingId,
      buildingName: buildingId,
      start, end,
      totalKwh: +totalKwh.toFixed(1),
      peakKw,
      mtCO2e,
      mtCO2ePerSqft: 0,
      mtCO2ePerOccupant: 0,
      dailyKwh: Array.from(dailyMap.entries()).sort().map(([date, kwh]) => ({ date, kwh: +kwh.toFixed(1) })),
    };
  },
};

export const BMS_EXPORT_WINDOW_START_MS = WINDOW_START_MS;
export const BMS_EXPORT_WINDOW_END_MS   = WINDOW_END_MS;
