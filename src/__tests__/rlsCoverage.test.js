// Every table this project creates must have a decided RLS posture.
//
// WHY THIS EXISTS.
//
// Phase 531 revoked twelve `to anon` write policies, having surveyed the
// migrations for that phrasing. That survey missed a larger gap, because it
// only looked at tables that HAD policies: of the 27 tables the migrations
// create, only 12 ever run `alter table ... enable row level security`.
//
// On a table with RLS disabled, policies are irrelevant — the `anon` role's
// table grants apply with no row filtering. That is strictly more permissive
// than an explicit anon write policy, so the tables nobody wrote a policy for
// were the least protected ones, and a survey of policies could not see them.
// Among them are the tables holding the inventory itself:
// scope2_utility_bills, scope2_meter_readings, scope1_heating_oil,
// scope1_propane, sinks_trees.
//
// WHAT THIS TEST DOES, AND DOES NOT, PROVE.
//
// It is a STATIC check of the migrations in this repo — the project's intent.
// It cannot see the live database. Several of these tables are known to be
// absent on the configured project (schemaHealth.js tracks them; bms_meter_map
// returns PGRST205), and Supabase's own default grants are not visible from
// here. Confirming the deployed posture needs the pg_policies / pg_class query
// in supabase/migrations/20261016120000_revoke_anon_writes.sql.
//
// The point is that a table can no longer be added without someone deciding,
// in writing, whether it is RLS-protected — and that the current gap is
// counted instead of invisible.

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const MIGRATIONS = resolve(process.cwd(), '..', 'supabase', 'migrations');
const files = readdirSync(MIGRATIONS).filter((f) => f.endsWith('.sql')).sort();
const sql = files.map((f) => readFileSync(resolve(MIGRATIONS, f), 'utf8')).join('\n');

const created = new Set(
  [...sql.matchAll(/create\s+table\s+if\s+not\s+exists\s+([a-z0-9_]+)/gi)].map((m) => m[1].toLowerCase()),
);
const rlsEnabled = new Set(
  [...sql.matchAll(/alter\s+table\s+(?:if\s+exists\s+)?(?:public\.)?([a-z0-9_]+)\s+enable\s+row\s+level\s+security/gi)].map((m) => m[1].toLowerCase()),
);

/**
 * Tables knowingly left without RLS, each with the reason it is acceptable or
 * the work needed. This is a DEBT REGISTER, not an allowlist to grow by
 * reflex: adding an entry should feel like filing a ticket.
 *
 * EMPTY since Phase 533. Phase 532 listed fifteen tables here, and its
 * `browserWrites` flags were wrong for most of them: it marked
 * scope1_heating_oil, scope2_meter_readings, sinks_trees and others as having
 * no browser write path, when every admin form wrote to them through the
 * shared useTable hook. Phase 533 moved those writes to /api/admin/records
 * and 20261025120000_lock_admin_tables.sql enables RLS on all fifteen. The
 * guard at the bottom of this file now checks the browser side directly
 * rather than trusting a hand-set flag.
 */
const KNOWN_WITHOUT_RLS = {};

const SRC = resolve(process.cwd());
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    if (['node_modules', 'dist', '__tests__'].includes(d.name)) return [];
    const full = resolve(dir, d.name);
    if (d.isDirectory()) return walk(full);
    return /\.(js|jsx)$/.test(d.name) && !/\.test\./.test(d.name) ? [full] : [];
  });
}
const SRC_FILES = walk(SRC).map((f) => [f.slice(SRC.length + 1), readFileSync(f, 'utf8')]);

/** Files that import the anon client and chain a write on it. */
function browserWriteSites(files) {
  return files
    .filter(([, text]) => /from\s+['"][./]*(?:\.\.\/)*supabaseClient(?:\.js)?['"]/.test(text))
    .filter(([, text]) => {
      // Comments explain history and quote the old calls; they are not code.
      const code = text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
      return /\.from\([^)]*\)\s*\.(insert|upsert|update|delete)\s*\(/.test(code);
    })
    .map(([name]) => name)
    .sort();
}

describe('RLS coverage across the migrations', () => {
  it('finds the migrations at all — a zero-length scan proves nothing', () => {
    expect(files.length).toBeGreaterThan(5);
    expect(created.size).toBeGreaterThan(20);
    expect(created.has('bms_meter_map')).toBe(true);
  });

  it('every created table either enables RLS or is in the debt register', () => {
    const undecided = [...created]
      .filter((t) => !rlsEnabled.has(t) && !(t in KNOWN_WITHOUT_RLS))
      .sort();
    expect(
      undecided,
      `These tables are created with no RLS and no entry in KNOWN_WITHOUT_RLS. ` +
      `With RLS disabled the anon role's grants apply unfiltered, so decide the ` +
      `posture and record it:\n  ${undecided.join('\n  ')}`,
    ).toEqual([]);
  });

  it('the debt register does not list tables that actually have RLS', () => {
    // Stops the register rotting into noise once a table is fixed: locking a
    // table down should also mean deleting its entry here.
    const stale = Object.keys(KNOWN_WITHOUT_RLS).filter((t) => rlsEnabled.has(t)).sort();
    expect(stale, `RLS is enabled on these — remove them from KNOWN_WITHOUT_RLS:\n  ${stale.join('\n  ')}`)
      .toEqual([]);
  });

  it('the debt register does not list tables that no longer exist', () => {
    const ghosts = Object.keys(KNOWN_WITHOUT_RLS).filter((t) => !created.has(t)).sort();
    expect(ghosts, `Not created by any migration — stale register entries:\n  ${ghosts.join('\n  ')}`)
      .toEqual([]);
  });

  it('every table with RLS enabled has at least one policy', () => {
    // RLS on with no policy denies everything, which breaks reads silently
    // rather than visibly. Either is a decision; neither should be accidental.
    // Policy names may be QUOTED or bare identifiers, and the table may be
    // schema-qualified. Requiring a quoted name missed the alert_* migrations
    // entirely and made three tables look unpoliced when they were not — the
    // kind of false positive that teaches you to distrust the guard.
    const policied = new Set(
      [...sql.matchAll(/create\s+policy\s+(?:"[^"]+"|[a-z0-9_]+)\s*\n?\s*on\s+(?:public\.)?([a-z0-9_]+)/gi)]
        .map((m) => m[1].toLowerCase()),
    );
    const locked = [...rlsEnabled].filter((t) => !policied.has(t)).sort();
    expect(locked, `RLS enabled but no policy — every access would be denied:\n  ${locked.join('\n  ')}`)
      .toEqual([]);
  });

  it('records how large the gap currently is, so it cannot drift quietly', () => {
    // A deliberate canary. If this number moves, someone either locked a table
    // down (good — shrink it) or added an unprotected one (investigate).
    const withoutRls = [...created].filter((t) => !rlsEnabled.has(t));
    expect(withoutRls.length).toBe(Object.keys(KNOWN_WITHOUT_RLS).length);
    expect(withoutRls.length).toBe(0);
    // rlsEnabled is LARGER than created: the Phase 533 lockdown also covers
    // seven admin tables (fuel_bills, waste, day_students, …) that were made
    // in the dashboard rather than by a migration in this repo.
    expect([...created].filter((t) => !rlsEnabled.has(t))).toEqual([]);
  });

  it('no browser module writes to Supabase with the anon client', () => {
    // The ordering trap Phase 531 had to avoid — locking a table that the
    // browser still writes breaks a working form — is now checked at the
    // source instead of through a hand-set flag. Phase 531's migration called
    // forest_stand_actuals browser-write-free while ForestStands.js wrote to
    // it; a flag is a claim, a scan is evidence.
    //
    // The rule: a module importing the anon client (supabaseClient) may read,
    // never insert/upsert/update/delete. Server modules under storage/ use
    // getSupabaseServer() and the service key, and are not matched.
    const offenders = browserWriteSites(SRC_FILES);
    expect(
      offenders,
      `These modules write with the publishable anon key. Route the write ` +
      `through /api/admin/records (src/utils/adminRecords.js) instead:\n  ${offenders.join('\n  ')}`,
    ).toEqual([]);
  });

  it('the browser-write scan can fail — a scan that never fires proves nothing', () => {
    expect(SRC_FILES.length).toBeGreaterThan(100);
    const chained = `import { supabase } from '../supabaseClient';\n` +
      `await supabase\n  .from('fuel_bills')\n  .insert(row);`;
    const readOnly = `import { supabase } from '../supabaseClient';\n` +
      `// was supabase.from(t).insert(r)\nawait supabase.from('fuel_bills').select('*');`;
    expect(browserWriteSites([['chained.js', chained]])).toEqual(['chained.js']);
    expect(browserWriteSites([['readOnly.js', readOnly]])).toEqual([]);
  });
});
