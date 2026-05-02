// GET /api/buildings/:id/energy?start=&end=
// Per-building rollup: total kWh, peak kW, mtCO2e, intensities, daily series.

import { getMeterAdapter } from '../../../src/adapters/meter/index.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const buildingId = req.query?.id;
    const { start, end } = req.query || {};
    if (!buildingId) {
      res.status(400).json({ error: 'buildingId path param is required' });
      return;
    }
    if (!start || !end) {
      res.status(400).json({ error: 'start and end query params are required (ISO 8601)' });
      return;
    }
    const adapter = getMeterAdapter();
    const summary = await adapter.getBuildingEnergy({ buildingId, start, end });
    res.status(200).json(summary);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
