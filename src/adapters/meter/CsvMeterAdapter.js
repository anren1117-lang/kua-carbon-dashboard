// CsvMeterAdapter — parses uploaded CSV and serves readings out of an
// in-memory store. Phase 2 swaps the in-memory store for a Supabase
// `meter_readings` table (schema documented in src/data/quizLedger.js
// alongside the quiz_attempts schema).
//
// The /data-admin upload form posts CSV text to /api/meters/readings/import
// after parsing client-side via parseMeterCsv(). When METER_SOURCE=csv,
// queries go through this adapter and read from the same store.

import { parseMeterCsv } from '../../utils/csvMeterParser.js';
import { meters } from '../../data/meters.js';
import { getBuilding } from '../../data/buildings.js';
import { quantityToKgCO2e, kgToMt } from '../../utils/emissions.js';
import { detectAnomalies, qualityScore } from '../../utils/anomaly.js';

/** @type {import('./MeterDataAdapter.js').MeterReading[]} */
const store = [];

/** Ingest a CSV blob; returns { inserted, errors }. Mostly for tests + the upload form. */
export function ingestCsv(csv) {
  const { readings, errors } = parseMeterCsv(csv);
  if (errors.length === 0) {
    for (const r of readings) store.push(r);
  }
  return { inserted: readings.length, errors };
}

/** Test-only escape hatch. */
export function _resetCsvStore() {
  store.length = 0;
}

function withinWindow(reading, startMs, endMs) {
  const t = new Date(reading.timestamp).getTime();
  return t >= startMs && t < endMs;
}

/** @type {import('./MeterDataAdapter.js').MeterDataAdapter} */
export const CsvMeterAdapter = {
  async listMeters() {
    // CSV doesn't tell us about meters — it just feeds readings against
    // the registry in src/data/meters.js. Return that registry.
    return meters.map((m) => ({
      id: m.id,
      buildingId: m.buildingId,
      type: m.type,
      unit: m.unit,
      provider: m.provider,
      intervalMinutes: m.intervalMinutes,
    }));
  },

  async getReadings({ meterId, buildingId, start, end }) {
    const startMs = new Date(start).getTime();
    const endMs   = new Date(end).getTime();
    return store.filter((r) => {
      if (meterId && r.meterId !== meterId) return false;
      if (buildingId && r.buildingId !== buildingId) return false;
      return withinWindow(r, startMs, endMs);
    });
  },

  async importReadings(readings) {
    let inserted = 0;
    for (const r of readings) {
      // Minimum-viable validation: it must look like a MeterReading.
      if (!r || !r.meterId || !r.timestamp || typeof r.value !== 'number') continue;
      store.push({ ...r, source: 'csv', dataQuality: r.dataQuality || 'actual' });
      inserted++;
    }
    return { inserted };
  },

  async getQuality({ meterId, start, end }) {
    const targets = meters.filter((m) => !meterId || m.id === meterId);
    const reports = [];
    for (const m of targets) {
      const readings = await this.getReadings({ meterId: m.id, start, end });
      const issues = detectAnomalies(readings);
      reports.push({
        meterId: m.id,
        start,
        end,
        totalReadings: readings.length,
        qualityScore: qualityScore(readings, issues),
        issues,
      });
    }
    return reports;
  },

  async getBuildingEnergy({ buildingId, start, end }) {
    const readings = await this.getReadings({ buildingId, start, end });
    const totalKwh = readings.reduce((s, r) => s + r.value, 0);
    const peakKw = readings.reduce((p, r) => Math.max(p, r.demandKw ?? 0), 0);
    const { kgco2e } = quantityToKgCO2e({ quantity: totalKwh, factorId: 'ef_grid_isone_2024' });
    const b = getBuilding(buildingId);
    const sqft = b?.sqft ?? 1;
    const occ  = b?.occupants ?? 1;
    const mtCO2e = kgToMt(kgco2e);

    const dailyMap = {};
    for (const r of readings) {
      const day = r.timestamp.slice(0, 10);
      dailyMap[day] = (dailyMap[day] || 0) + r.value;
    }
    const dailyKwh = Object.entries(dailyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, kwh]) => ({ date, kwh: Number(kwh.toFixed(2)) }));

    return {
      buildingId,
      buildingName: b?.name ?? buildingId,
      start,
      end,
      totalKwh: Number(totalKwh.toFixed(2)),
      peakKw: Number(peakKw.toFixed(2)),
      mtCO2e: Number(mtCO2e.toFixed(4)),
      mtCO2ePerSqft: Number(((mtCO2e * 1000) / sqft).toFixed(4)),
      mtCO2ePerOccupant: Number((mtCO2e / occ).toFixed(4)),
      dailyKwh,
    };
  },
};
