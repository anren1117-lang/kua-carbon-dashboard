// MockMeterAdapter — generates realistic interval readings on demand from
// the in-process meter registry plus the seasonal/day-of-week shapes. No
// persisted state; importReadings is a no-op that pretends to succeed.

import { meters } from '../../data/meters.js';
import { getBuilding } from '../../data/buildings.js';
import { dayOfWeekPattern, monthlyPattern, hourOfDayShape } from '../../data/seasonalPatterns.js';
import { quantityToKgCO2e, kgToMt } from '../../utils/emissions.js';
import { detectAnomalies, qualityScore } from '../../utils/anomaly.js';

const HOURS_PER_YEAR = 8760;

function shapeMultiplier(date, intervalMinutes) {
  const dow = date.getUTCDay();
  const hour = date.getUTCHours();
  const month = date.getUTCMonth();
  const dowMul = dayOfWeekPattern[dow]?.multiplier ?? 1;
  const monthMul = monthlyPattern[month]?.multiplier ?? 1;
  const hourMul = intervalMinutes <= 60 ? hourOfDayShape[hour] ?? 1 : 1;
  return dowMul * monthMul * hourMul;
}

/** @type {import('./MeterDataAdapter.js').MeterDataAdapter} */
export const MockMeterAdapter = {
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

  async getReadings({ meterId, buildingId, start, end, intervalMinutes }) {
    const startMs = new Date(start).getTime();
    const endMs   = new Date(end).getTime();
    if (!(endMs > startMs)) return [];

    const matched = meters.filter((m) => {
      if (meterId && m.id !== meterId) return false;
      if (buildingId && m.buildingId !== buildingId) return false;
      return m.type === 'electricity'; // Mock only generates electricity for now
    });

    /** @type {import('./MeterDataAdapter.js').MeterReading[]} */
    const out = [];
    for (const m of matched) {
      const interval = intervalMinutes ?? m.intervalMinutes;
      const intervalMs = interval * 60 * 1000;
      const intervalsPerYear = HOURS_PER_YEAR * (60 / interval);
      const baselinePerInterval = m.annualBaselineValue / intervalsPerYear;

      for (let t = startMs; t < endMs; t += intervalMs) {
        const date = new Date(t);
        const mul = shapeMultiplier(date, interval);
        // Deterministic noise (±6%)
        const noise = 1 + ((Math.sin(t / 3600000) * 0.06));
        const value = baselinePerInterval * mul * noise;
        out.push({
          id: `${m.id}_${t}`,
          meterId: m.id,
          buildingId: m.buildingId,
          meterType: m.type,
          timestamp: date.toISOString(),
          intervalMinutes: interval,
          value: Number(value.toFixed(4)),
          unit: m.unit,
          demandKw: interval === 60 ? Number(value.toFixed(2)) : undefined,
          dataQuality: 'estimated',
          source: 'mock',
        });
      }
    }
    return out;
  },

  async importReadings(readings) {
    // No-op for the mock; in a real adapter this would persist to Supabase.
    return { inserted: readings.length };
  },

  async getQuality({ meterId, start, end }) {
    const matched = meters.filter((m) => !meterId || m.id === meterId);
    const reports = [];
    for (const m of matched) {
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

    // Per-day rollup
    /** @type {Record<string, number>} */
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
