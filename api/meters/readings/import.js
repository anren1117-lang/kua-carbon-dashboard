// POST /api/meters/readings/import
// Body: { readings: MeterReading[] } | array of MeterReading
// Mock adapter ignores; real adapter persists to Supabase.

import { getMeterAdapter } from '../../../src/adapters/meter/index.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const body = req.body || {};
    const readings = Array.isArray(body) ? body : body.readings;
    if (!Array.isArray(readings)) {
      res.status(400).json({ error: 'Body must be an array of readings or { readings: [...] }' });
      return;
    }
    const adapter = getMeterAdapter();
    const result = await adapter.importReadings(readings);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
