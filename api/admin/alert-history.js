// GET /api/admin/alert-history?limit=20
//
// Admin-gated. Returns recent alert-email batches the daily cron has
// dispatched. Powers the "Past alerts sent" panel on /admin/alerts.

import { verifyAdminRequest } from '../../src/utils/adminToken.js';
import { listAlertHistory } from '../../src/storage/alertHistory.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader && res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }
  const auth = verifyAdminRequest(req);
  if (!auth.valid) {
    return res.status(401).json({ error: `admin auth required: ${auth.reason}` });
  }

  const limit = Math.max(1, Math.min(parseInt(req.query?.limit, 10) || 20, 200));
  try {
    const entries = await listAlertHistory(limit);
    return res.status(200).json({ entries, count: entries.length });
  } catch (err) {
    return res.status(500).json({ error: 'server_error', details: String(err?.message || err) });
  }
}
