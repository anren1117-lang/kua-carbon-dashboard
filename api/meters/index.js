// GET /api/meters
// Optional filters: ?building_id=&type=
// Returns the meter registry the active adapter exposes.

import { getMeterAdapter } from '../../src/adapters/meter/index.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const adapter = getMeterAdapter();
    let meters = await adapter.listMeters();
    const { building_id, type } = req.query || {};
    if (building_id) meters = meters.filter((m) => m.buildingId === building_id);
    if (type)        meters = meters.filter((m) => m.type === type);
    res.status(200).json({ meters });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
