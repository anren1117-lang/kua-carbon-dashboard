// BmsMeterAdapter — Distech Controls Eclypse REST API.
//
// The Eclypse Pro / Eclypse Connect controllers expose a JSON REST API at
// /api/rest/v1/. Authentication is HTTP Basic by default. Endpoints follow
// the BACnet object model exposed as URL paths, e.g.
//
//   GET /api/rest/v1/protocols/bacnet/local/objects/analog-value,1234/present-value
//
// This adapter does not assume one specific KUA point list (we don't have
// the docs yet). Instead it expects an env-supplied mapping from KUA
// `meterId` → Eclypse object reference, then issues parallel HTTP GETs for
// the reading window the caller asked for.
//
// REQUIRED environment variables (set in Vercel dashboard):
//   BMS_BASE_URL     e.g. "https://10.1.1.27"  (or "https://campus-relay.kua.org" once a relay exists)
//   BMS_USERNAME     Eclypse REST username
//   BMS_PASSWORD     Eclypse REST password
//   BMS_POINT_MAP    JSON, mapping { "<meterId>": "<eclypse path>" }
//                    Example: { "m_elec_b_miller": "protocols/bacnet/local/objects/analog-value,5/present-value" }
//
// IMPORTANT: 10.1.1.27 is on the campus LAN only. Cloud-hosted Vercel can't
// reach it. To bridge, run an on-campus relay (a Raspberry Pi or VM running
// the same adapter code, exposed via Cloudflare Tunnel or Tailscale) and
// point BMS_BASE_URL at the relay's public hostname.

import { meters } from '../../data/meters.js';
import { getBuilding } from '../../data/buildings.js';
import { quantityToKgCO2e, kgToMt } from '../../utils/emissions.js';
import { detectAnomalies, qualityScore } from '../../utils/anomaly.js';

function readEnv(key) {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      return import.meta.env[key];
    }
  } catch {}
  return undefined;
}

function getConfig() {
  const baseUrl = readEnv('BMS_BASE_URL');
  const username = readEnv('BMS_USERNAME');
  const password = readEnv('BMS_PASSWORD');
  const pointMapRaw = readEnv('BMS_POINT_MAP');
  const missing = [];
  if (!baseUrl) missing.push('BMS_BASE_URL');
  if (!username) missing.push('BMS_USERNAME');
  if (!password) missing.push('BMS_PASSWORD');
  if (missing.length) {
    throw new Error(`BmsMeterAdapter not configured — missing env vars: ${missing.join(', ')}`);
  }
  let pointMap = {};
  if (pointMapRaw) {
    try { pointMap = JSON.parse(pointMapRaw); } catch (e) {
      throw new Error(`BMS_POINT_MAP is not valid JSON: ${e.message}`);
    }
  }
  return { baseUrl: baseUrl.replace(/\/$/, ''), username, password, pointMap };
}

function basicAuth(username, password) {
  const token = (typeof Buffer !== 'undefined')
    ? Buffer.from(`${username}:${password}`).toString('base64')
    : btoa(`${username}:${password}`);
  return `Basic ${token}`;
}

async function eclypseGet(cfg, path) {
  const url = `${cfg.baseUrl}/api/rest/v1/${path.replace(/^\//, '')}`;
  const res = await fetch(url, {
    headers: { Authorization: basicAuth(cfg.username, cfg.password), Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`Eclypse GET ${path} → ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/** @type {import('./MeterDataAdapter.js').MeterDataAdapter} */
export const BmsMeterAdapter = {
  async listMeters() {
    // The BMS itself doesn't know about KUA's meter taxonomy — we keep that
    // as authoritative in src/data/meters.js. This method just proves
    // reachability by querying a discovery endpoint, then returns the
    // meters whose mappings are configured.
    const cfg = getConfig();
    await eclypseGet(cfg, 'protocols/bacnet/local'); // sanity ping
    return meters
      .filter((m) => cfg.pointMap[m.id])
      .map((m) => ({
        id: m.id,
        buildingId: m.buildingId,
        type: m.type,
        unit: m.unit,
        provider: 'Distech Eclypse',
        intervalMinutes: m.intervalMinutes,
      }));
  },

  async getReadings({ meterId, buildingId, start, end, intervalMinutes }) {
    const cfg = getConfig();
    const startMs = new Date(start).getTime();
    const endMs   = new Date(end).getTime();
    if (!(endMs > startMs)) return [];

    const matched = meters.filter((m) => {
      if (meterId && m.id !== meterId) return false;
      if (buildingId && m.buildingId !== buildingId) return false;
      return cfg.pointMap[m.id];
    });

    const out = [];
    for (const m of matched) {
      const path = cfg.pointMap[m.id];
      const interval = intervalMinutes ?? m.intervalMinutes;

      // Eclypse trend logs vary by site; default attempt is the trend-log
      // history endpoint relative to the present-value path. If that's not
      // present, the caller must point BMS_POINT_MAP at the trend object
      // directly.
      const trendPath = path.replace(/\/present-value$/, '/log-buffer');
      let logBuffer = null;
      try {
        logBuffer = await eclypseGet(cfg, `${trendPath}?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`);
      } catch {
        // Fall back: read present-value once and tag it as a single sample.
        const pv = await eclypseGet(cfg, path);
        out.push({
          id: `${m.id}_${endMs}`,
          meterId: m.id,
          buildingId: m.buildingId,
          meterType: m.type,
          timestamp: new Date(endMs).toISOString(),
          intervalMinutes: interval,
          value: typeof pv === 'number' ? pv : Number(pv?.value ?? pv?.['present-value'] ?? 0),
          unit: m.unit,
          dataQuality: 'actual',
          source: 'bms',
        });
        continue;
      }

      const samples = Array.isArray(logBuffer) ? logBuffer : (logBuffer?.records || []);
      for (const rec of samples) {
        const ts = rec.timestamp || rec.time || rec.t;
        const value = typeof rec === 'number' ? rec : (rec.value ?? rec.v);
        if (!ts || value == null) continue;
        out.push({
          id: `${m.id}_${new Date(ts).getTime()}`,
          meterId: m.id,
          buildingId: m.buildingId,
          meterType: m.type,
          timestamp: new Date(ts).toISOString(),
          intervalMinutes: interval,
          value: Number(value),
          unit: m.unit,
          dataQuality: 'actual',
          source: 'bms',
        });
      }
    }
    return out;
  },

  async importReadings() {
    throw new Error('Eclypse adapter is read-only; import readings via Supabase or CsvMeterAdapter.');
  },

  async getQuality({ meterId, start, end }) {
    const matched = meters.filter((m) => !meterId || m.id === meterId);
    const reports = [];
    for (const m of matched) {
      let readings = [];
      try {
        readings = await this.getReadings({ meterId: m.id, start, end });
      } catch {
        readings = [];
      }
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
    const peakKw = readings.reduce((p, r) => Math.max(p, r.demandKw ?? r.value ?? 0), 0);
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
