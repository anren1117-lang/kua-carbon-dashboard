// GET /api/health
//
// Minimal-cost health check for uptime monitoring (UptimeRobot,
// Better Uptime, etc.). Returns 200 with a body summarizing component
// status. Returns 503 when any required component is unreachable.
//
// What it checks:
// - meter adapter: listMeters() succeeds → returns count
// - supabase: getSupabaseServer() returns a client → tries a no-op query
// - emission factor registry size (sanity check on data layer load)
//
// What it does NOT check:
// - Anthropic API (would cost a request per ping)
// - The Eclypse BMS upstream (private LAN; not visible from cloud)

import { getMeterAdapter } from '../src/adapters/meter/index.js';
import { getSupabaseServer } from '../src/storage/supabaseServer.js';
import { emissionFactors } from '../src/data/emissionFactors.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const checks = {
    timestamp: new Date().toISOString(),
    factors: { ok: emissionFactors.length > 0, count: emissionFactors.length },
    adapter: { ok: false, count: 0, error: null },
    supabase: { configured: false, ok: null, error: null },
  };

  try {
    const adapter = getMeterAdapter();
    const meters = await adapter.listMeters();
    checks.adapter = { ok: true, count: meters.length, error: null };
  } catch (err) {
    checks.adapter = { ok: false, count: 0, error: err.message };
  }

  try {
    const sb = await getSupabaseServer();
    if (sb) {
      checks.supabase.configured = true;
      // Cheapest possible query — just count rows in a known table.
      const { error } = await sb.from('emission_factors').select('id', { count: 'exact', head: true });
      checks.supabase.ok = !error;
      if (error) checks.supabase.error = error.message;
    }
  } catch (err) {
    checks.supabase.ok = false;
    checks.supabase.error = err.message;
  }

  const requiredOk = checks.factors.ok && checks.adapter.ok;
  const supabaseOk = !checks.supabase.configured || checks.supabase.ok !== false;
  const overall = requiredOk && supabaseOk;

  res.status(overall ? 200 : 503).json({ ok: overall, checks });
}
