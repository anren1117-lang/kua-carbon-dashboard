// GET  /api/meters/readings?meterId=&buildingId=&start=&end=&interval=
// POST /api/meters/readings/import  → forwarded here when path matches; else
//                                    use api/meters/readings/import.js

import { getMeterAdapter } from '../../src/adapters/meter/index.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const { meterId, buildingId, start, end, interval } = req.query || {};
    if (!start || !end) {
      res.status(400).json({ error: 'start and end query params are required (ISO 8601)' });
      return;
    }
    const intervalMinutes = interval ? Number(interval) : undefined;
    const adapter = getMeterAdapter();
    const readings = await adapter.getReadings({ meterId, buildingId, start, end, intervalMinutes });
    res.status(200).json({ readings, count: readings.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
