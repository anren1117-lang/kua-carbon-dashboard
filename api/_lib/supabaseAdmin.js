// SERVER-ONLY Supabase client, backed by the service-role key.
//
// WHY THIS EXISTS.
//
// Until now every Supabase connection in this project — browser AND server —
// used the publishable anon key. api/admin/audit-log.js says so in its own
// header: "Uses the same publishable anon key as the browser." The
// consequence is that Postgres could not tell an admin write from an
// anonymous one, so RLS had to grant `anon` insert/update/delete on six
// tables for the admin features to work at all. Twelve such policies existed,
// and the anon key ships in the client bundle and in this public repository.
//
// That is why the migrations' stated posture — "the bearer-token gate in the
// admin portal is the auth boundary, not RLS" — did not hold: the gate is a
// client-side UI control and the API routes connected as `anon`, so anyone
// with curl could bypass both and write directly to the database.
//
// With a service-role connection the server has an identity the database can
// distinguish, which is what lets the anon write policies be dropped while
// admin features keep working.
//
// RULES FOR THIS FILE
//
//  1. NEVER import it from src/. Anything src/ imports can be bundled and
//     shipped to the browser, and this key bypasses RLS entirely.
//  2. The variable is SUPABASE_SERVICE_ROLE_KEY — deliberately NOT prefixed
//     VITE_, because Vite inlines every VITE_* variable into the client
//     bundle. A service-role key in the bundle would be strictly worse than
//     the problem this file solves.
//  3. Fails closed. No fallback, no silent downgrade to the anon key: a
//     misconfigured deploy must refuse admin writes rather than quietly
//     perform them with a public credential. Same reasoning as the removal
//     of DEFAULT_SECRET from src/utils/adminToken.js.

import { createClient } from '@supabase/supabase-js';

export const URL_ENV_VAR = 'SUPABASE_URL';
export const SERVICE_KEY_ENV_VAR = 'SUPABASE_SERVICE_ROLE_KEY';

export class SupabaseAdminUnconfiguredError extends Error {
  constructor(missing) {
    super(
      `Supabase admin client is not configured (missing: ${missing.join(', ')}). ` +
      `Set ${URL_ENV_VAR} and ${SERVICE_KEY_ENV_VAR} in the server environment. ` +
      `${SERVICE_KEY_ENV_VAR} must NOT be prefixed VITE_ — Vite inlines VITE_* into ` +
      `the client bundle, and this key bypasses row-level security.`,
    );
    this.name = 'SupabaseAdminUnconfiguredError';
    this.code = 'SUPABASE_ADMIN_UNCONFIGURED';
    this.missing = missing;
  }
}

function readEnv(key) {
  const v = process.env[key];
  return typeof v === 'string' && v.length > 0 ? v : null;
}

/** True when both variables are present, without revealing either. */
export function isSupabaseAdminConfigured() {
  return Boolean(readEnv(URL_ENV_VAR) && readEnv(SERVICE_KEY_ENV_VAR));
}

/**
 * Build the service-role client. Throws SupabaseAdminUnconfiguredError when
 * either variable is missing — callers should translate that into a 503 so a
 * misconfigured deploy is visibly broken rather than silently unprotected.
 */
export function getSupabaseAdmin() {
  const url = readEnv(URL_ENV_VAR);
  const key = readEnv(SERVICE_KEY_ENV_VAR);
  const missing = [];
  if (!url) missing.push(URL_ENV_VAR);
  if (!key) missing.push(SERVICE_KEY_ENV_VAR);
  if (missing.length) throw new SupabaseAdminUnconfiguredError(missing);

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
