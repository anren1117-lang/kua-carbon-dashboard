// GET /api/meters/readings/export?meterId=&buildingId=&start=&end=&interval=
// Returns CSV (text/csv) suitable for opening in Excel or re-importing
// via /api/meters/readings/import. Round-trips with the upload format.

import { getMeterAdapter } from '../../../src/adapters/meter/index.js';
import { formatMeterCsv } from '../../../src/utils/csvMeterFormatter.js';

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
    const csv = formatMeterCsv(readings);

    // Vercel's res adapter may or may not support setHeader; both Express
    // and the relay http server do.
    if (typeof res.setHeader === 'function') {
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      const stamp = new Date().toISOString().slice(0, 10);
      res.setHeader('Content-Disposition', `attachment; filename="kua-meter-readings-${stamp}.csv"`);
    }
    if (typeof res.send === 'function') {
      res.status(200).send(csv);
    } else {
      // Fall back through the json shim our test rig uses.
      res.status(200).json({ csv });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
