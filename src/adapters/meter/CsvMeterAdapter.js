// CsvMeterAdapter — parses uploaded CSV and serves readings out of the
// readingsStore. The store mirrors writes to Supabase (table
// meter_readings_csv) when SUPABASE_URL + SUPABASE_SERVICE_KEY are set,
// otherwise stays in process memory.

import { parseMeterCsv } from '../../utils/csvMeterParser.js';
import { meters } from '../../data/meters.js';
import { getBuilding } from '../../data/buildings.js';
import { quantityToKgCO2e, kgToMt } from '../../utils/emissions.js';
import { detectAnomalies, qualityScore } from '../../utils/anomaly.js';
import { insertReadings, readReadings, _resetReadingsStoreForTests } from '../../storage/readingsStore.js';

/** Ingest a CSV blob; returns { inserted, errors }. */
export async function ingestCsv(csv) {
  const { readings, errors } = parseMeterCsv(csv);
  if (errors.length === 0 && readings.length > 0) {
    await insertReadings(readings);
  }
  return { inserted: readings.length, errors };
}

/** Test-only escape hatch. */
export function _resetCsvStore() {
  _resetReadingsStoreForTests();
}

/** @type {import('./MeterDataAdapter.js').MeterDataAdapter} */
export const CsvMeterAdapter = {
  async listMeters() {
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
    return readReadings({ meterId, buildingId, start, end });
  },

  async importReadings(readings) {
    const valid = (readings || []).filter((r) => r && r.meterId && r.timestamp && typeof r.value === 'number');
    return insertReadings(valid.map((r) => ({ ...r, source: 'csv', dataQuality: r.dataQuality || 'actual' })));
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
