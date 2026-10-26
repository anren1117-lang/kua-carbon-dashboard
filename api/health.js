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
// - admin readiness: is ADMIN_TOKEN_SECRET usable, and is a service-role
//   key present for /api/admin/records. Reported as booleans only — never
//   the values. It does NOT affect `ok` (that stays the public site's
//   uptime signal); it is surfaced as `adminReady` so a deployer can check
//   the configuration without signing in, which is exactly what fails when
//   it is wrong. Before this, /api/health read ok:true while admin sign-in
//   was disabled in production.
//
// What it does NOT check:
// - Anthropic API (would cost a request per ping)
// - The Eclypse BMS upstream (private LAN; not visible from cloud)

import { getMeterAdapter } from '../src/adapters/meter/index.js';
import { getSupabaseServer } from '../src/storage/supabaseServer.js';
import { emissionFactors } from '../src/data/emissionFactors.js';
import { adminSecretStatus } from '../src/utils/adminToken.js';
import { isSupabaseAdminConfigured } from './_lib/supabaseAdmin.js';

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

  const secret = adminSecretStatus();
  checks.admin = {
    tokenSecret: secret,
    writeClient: {
      configured: isSupabaseAdminConfigured(),
      needs: 'SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SERVICE_KEY)',
    },
  };
  const adminReady = secret.configured && checks.admin.writeClient.configured;

  const requiredOk = checks.factors.ok && checks.adapter.ok;
  const supabaseOk = !checks.supabase.configured || checks.supabase.ok !== false;
  const overall = requiredOk && supabaseOk;

  res.status(overall ? 200 : 503).json({ ok: overall, adminReady, checks });
}
