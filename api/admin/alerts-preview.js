// POST /api/admin/alerts-preview
//
// Admin-gated. Runs the alert evaluator on the live data layer (same
// Supabase + meter adapter the daily cron uses) and returns the list
// of alerts that WOULD fire — without actually emailing anyone.
//
// Use case: admin can click "Run alert check now" on /admin/alerts
// to (a) verify the detection logic is working, (b) see what's
// currently wrong before tomorrow's cron, (c) confirm new edits
// fixed an alert without waiting overnight.

import { verifyAdminRequest } from '../../src/utils/adminToken.js';
import { getSupabaseServer } from '../../src/storage/supabaseServer.js';
import { evaluateAlerts } from '../../src/utils/alertEvaluator.js';
import { getMeterAdapter } from '../../src/adapters/meter/index.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader && res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }
  const auth = verifyAdminRequest(req);
  if (!auth.valid) {
    return res.status(401).json({ error: `admin auth required: ${auth.reason}` });
  }

  try {
    const supabase = await getSupabaseServer();
    let meterAdapter = null;
    try { meterAdapter = getMeterAdapter(); }
    catch (err) { console.warn('[alerts-preview] meter adapter unavailable:', err?.message || err); }

    const result = await evaluateAlerts({ supabase, meterAdapter });
    return res.status(200).json({ ok: true, ...result });
  } catch (err) {
    return res.status(500).json({ error: 'server_error', details: String(err?.message || err) });
  }
}
