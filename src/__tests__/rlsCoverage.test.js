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
  [...sql.matchAll(/alter\s+table\s+([a-z0-9_]+)\s+enable\s+row\s+level\s+security/gi)].map((m) => m[1].toLowerCase()),
);

/**
 * Tables knowingly left without RLS, each with the reason it is acceptable or
 * the work needed. This is a DEBT REGISTER, not an allowlist to grow by
 * reflex: adding an entry should feel like filing a ticket.
 *
 * `browserWrites: true` marks the ones where simply enabling RLS would break
 * a working admin form — those need their writes moved behind an
 * authenticated API route first, exactly as bms_meter_map and
 * bms_export_summaries were in Phase 531.
 */
const KNOWN_WITHOUT_RLS = {
  // --- written from the browser today. Enabling RLS here without first
  //     moving the write behind an authenticated API route would break a
  //     working admin form, which is the ordering trap Phase 531 avoided.
  purchased_goods:        { browserWrites: true,  via: 'pages/admin/scope3/useTable.js' },
  commuting:              { browserWrites: true,  via: 'pages/admin/scope3/useTable.js' },
  framework_drafts:       { browserWrites: true,  via: 'useTable.js + AdminAIIngestion.js' },

  // --- inventory source data. No browser write path found by scanning src/
  //     for Supabase writes, so with RLS off the deployed grants decide.
  //     Highest priority to confirm against the live database and lock down.
  scope2_utility_bills:   { browserWrites: false, note: 'inventory source data' },
  scope2_meter_readings:  { browserWrites: false, note: 'inventory source data' },
  scope1_heating_oil:     { browserWrites: false, note: 'inventory source data' },
  scope1_propane:         { browserWrites: false, note: 'inventory source data' },
  sinks_trees:            { browserWrites: false, note: 'inventory source data' },
  sinks_soil_samples:     { browserWrites: false, note: 'inventory source data' },

  // --- superseded by the *_records / admin_audit_log tables, which do have
  //     RLS. Candidates for dropping outright rather than protecting.
  scope1_fleet:           { browserWrites: false, note: 'superseded by scope1_fleet_records' },
  scope1_refrigerants:    { browserWrites: false, note: 'superseded by scope1_refrigerant_logs' },
  audit_log:              { browserWrites: false, note: 'superseded by admin_audit_log' },

  // --- scenario inputs for the renewables modelling pages.
  renewables_solar:       { browserWrites: false, note: 'scenario inputs' },
  renewables_wind:        { browserWrites: false, note: 'scenario inputs' },
  renewables_geothermal:  { browserWrites: false, note: 'scenario inputs' },
};

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
    expect(withoutRls.length).toBe(15);
    expect(rlsEnabled.size).toBe(12);
  });

  it('no table is written from the browser AND locked down in the same change', () => {
    // The ordering trap that Phase 531 had to avoid: revoking anon writes
    // before the write path moves server-side breaks a working admin form.
    const brokenByLockdown = Object.entries(KNOWN_WITHOUT_RLS)
      .filter(([t, meta]) => meta.browserWrites && rlsEnabled.has(t))
      .map(([t]) => t);
    expect(
      brokenByLockdown,
      `RLS was enabled on tables still written from the browser. Move those ` +
      `writes behind an authenticated API route first:\n  ${brokenByLockdown.join('\n  ')}`,
    ).toEqual([]);
  });
});
