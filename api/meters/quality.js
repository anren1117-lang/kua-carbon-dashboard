// GET /api/meters/quality?meterId=&start=&end=
// Returns gap/spike/flat/stale issues per meter.

import { getMeterAdapter } from '../../src/adapters/meter/index.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const { meterId, start, end } = req.query || {};
    if (!start || !end) {
      res.status(400).json({ error: 'start and end query params are required (ISO 8601)' });
      return;
    }
    const adapter = getMeterAdapter();
    const reports = await adapter.getQuality({ meterId, start, end });
    res.status(200).json({ reports });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
