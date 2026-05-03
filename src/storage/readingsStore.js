// Meter-readings storage abstraction. Used by CsvMeterAdapter when
// METER_SOURCE=csv, and (in future) by the CSV upload handler.
//
// When Supabase is configured, writes mirror to meter_readings_csv and
// reads come from there. When not configured, falls back to an
// in-memory store kept inside this module.

import { getSupabaseServer } from './supabaseServer.js';

/** @type {import('../adapters/meter/MeterDataAdapter.js').MeterReading[]} */
const memStore = [];

const TABLE = 'meter_readings_csv';

function rowToReading(r) {
  return {
    id: r.id,
    meterId: r.meter_id,
    buildingId: r.building_id,
    meterType: r.meter_type,
    timestamp: typeof r.ts === 'string' ? r.ts : new Date(r.ts).toISOString(),
    intervalMinutes: r.interval_minutes,
    value: Number(r.value),
    unit: r.unit,
    demandKw: r.demand_kw == null ? undefined : Number(r.demand_kw),
    dataQuality: r.data_quality,
    source: r.source,
  };
}

function readingToRow(r) {
  return {
    id: r.id,
    meter_id: r.meterId,
    building_id: r.buildingId,
    meter_type: r.meterType,
    ts: r.timestamp,
    interval_minutes: r.intervalMinutes,
    value: r.value,
    unit: r.unit,
    demand_kw: r.demandKw ?? null,
    data_quality: r.dataQuality ?? 'actual',
    source: r.source ?? 'csv',
  };
}

/** @param {import('../adapters/meter/MeterDataAdapter.js').MeterReading[]} readings */
export async function insertReadings(readings) {
  if (!Array.isArray(readings) || readings.length === 0) return { inserted: 0 };

  // Always mirror to memory.
  for (const r of readings) {
    memStore.push({ ...r, source: r.source || 'csv' });
  }

  const sb = await getSupabaseServer();
  if (sb) {
    try {
      const rows = readings.map(readingToRow);
      // upsert by id so re-running an import is idempotent
      const { error } = await sb.from(TABLE).upsert(rows, { onConflict: 'id' });
      if (error) console.warn('meter_readings_csv write failed:', error.message);
    } catch (err) {
      console.warn('meter_readings_csv write threw:', err.message);
    }
  }
  return { inserted: readings.length };
}

export async function readReadings({ meterId, buildingId, start, end }) {
  const startMs = new Date(start).getTime();
  const endMs   = new Date(end).getTime();

  const sb = await getSupabaseServer();
  if (sb) {
    try {
      let q = sb.from(TABLE).select('*').gte('ts', new Date(startMs).toISOString()).lt('ts', new Date(endMs).toISOString());
      if (meterId)   q = q.eq('meter_id', meterId);
      if (buildingId) q = q.eq('building_id', buildingId);
      const { data, error } = await q;
      if (error) throw error;
      return data.map(rowToReading);
    } catch (err) {
      console.warn('meter_readings_csv read failed, falling back to memory:', err.message);
    }
  }

  return memStore.filter((r) => {
    if (meterId && r.meterId !== meterId) return false;
    if (buildingId && r.buildingId !== buildingId) return false;
    const t = new Date(r.timestamp).getTime();
    return t >= startMs && t < endMs;
  });
}

export function _resetReadingsStoreForTests() {
  memStore.length = 0;
}
