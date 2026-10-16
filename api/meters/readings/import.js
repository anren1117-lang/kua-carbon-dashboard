// POST /api/meters/readings/import
// Body: { readings: MeterReading[] } | array of MeterReading
// Mock adapter ignores; real adapter persists to Supabase.

import { getMeterAdapter } from '../../../src/adapters/meter/index.js';
import { verifyAdminRequest } from '../../../src/utils/adminToken.js';

const MAX_READINGS = 10_000;

function validateReading(r, i) {
  if (!r || typeof r !== 'object' || Array.isArray(r)) return `[${i}] not an object`;
  if (typeof r.id !== 'string' || !r.id)               return `[${i}] missing id`;
  if (typeof r.meterId !== 'string' || !r.meterId)     return `[${i}] missing meterId`;
  if (typeof r.timestamp !== 'string' || !r.timestamp) return `[${i}] missing timestamp`;
  const ts = new Date(r.timestamp);
  if (Number.isNaN(ts.getTime()))                      return `[${i}] timestamp not a valid date`;
  if (typeof r.value !== 'number' || !Number.isFinite(r.value)) return `[${i}] value must be a finite number`;
  if (r.intervalMinutes != null && (typeof r.intervalMinutes !== 'number' || !Number.isFinite(r.intervalMinutes))) {
    return `[${i}] intervalMinutes must be a finite number when set`;
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  // ADMIN ONLY. This endpoint had NO authorization check at all: any
  // unauthenticated caller could POST up to 10,000 meter readings and, on a
  // Supabase-configured deploy, have the adapter persist them. Meter readings
  // drive the emission totals every page on this site reports, so that was a
  // write path into the dashboard's headline numbers.
  //
  // The validation below is shape-only and was never a substitute: it stops
  // malformed rows, not unauthorized ones. The sole legitimate caller is the
  // CSV upload on /data-admin, which sits behind the admin gate, so it has a
  // bearer token to send — it just wasn't sending it (fixed in DataAdmin.js).
  //
  // Checked BEFORE reading the body: an unauthorized caller should not get
  // validation feedback on a 10,000-row payload.
  const auth = verifyAdminRequest(req);
  if (!auth.valid) {
    res.status(401).json({ error: auth.reason || 'unauthorized' });
    return;
  }
  try {
    const body = req.body || {};
    const readings = Array.isArray(body) ? body : body.readings;
    if (!Array.isArray(readings)) {
      res.status(400).json({ error: 'Body must be an array of readings or { readings: [...] }' });
      return;
    }
    if (readings.length > MAX_READINGS) {
      res.status(413).json({ error: `Too many readings (${readings.length}); cap is ${MAX_READINGS} per request` });
      return;
    }
    // Earlier code passed the body through unchecked. The default adapter
    // (mock) is a no-op, but on a Supabase-configured deploy malformed
    // rows would get serialized as nulls and pollute the readings store.
    // Validate shape up-front so a bad request never lands in the DB.
    for (let i = 0; i < readings.length; i++) {
      const reason = validateReading(readings[i], i);
      if (reason) {
        res.status(400).json({ error: `Invalid reading ${reason}` });
        return;
      }
    }
    const adapter = getMeterAdapter();
    const result = await adapter.importReadings(readings);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
