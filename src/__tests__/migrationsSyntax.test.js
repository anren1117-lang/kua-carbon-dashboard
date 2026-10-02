// The migrations were invalid SQL, and had been since they were written.
//
// 12 of 28 tables were missing from the live database. The cause was not a
// forgotten deploy: 21 statements read `create policy if not exists ...`, and
// PostgreSQL has never supported IF NOT EXISTS on CREATE POLICY. The Supabase
// SQL editor parses a script as one batch, so the syntax error aborted the
// whole thing — including the create-table statements above it. Running it
// produced no tables and no partial state, which is exactly what we observed.
//
// Verified with libpg_query (the real PostgreSQL grammar, via pglast): the old
// file is rejected with `syntax error at or near "not"`; the rewritten one
// parses as 95 statements. They are now `drop policy if exists ...; create
// policy ...`, which is valid AND idempotent.
//
// This test cannot run a Postgres parser (no such dependency in the suite), so
// it guards the specific constructs Postgres does NOT support with IF NOT
// EXISTS. That list is short and stable, and it is the class that bit us: SQL
// that looks idempotent, reads fine to a human, and is a hard syntax error.

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const MIGRATIONS = resolve(process.cwd(), '..', 'supabase', 'migrations');
const files = readdirSync(MIGRATIONS).filter((f) => f.endsWith('.sql'));
const read = (f) => readFileSync(join(MIGRATIONS, f), 'utf8');

// PostgreSQL supports IF NOT EXISTS on TABLE, INDEX, SCHEMA, EXTENSION,
// SEQUENCE, VIEW(no), TRIGGER(no) ... these are the ones it does NOT.
const UNSUPPORTED = [
  [/create\s+policy\s+if\s+not\s+exists/i, 'CREATE POLICY IF NOT EXISTS'],
  [/create\s+trigger\s+if\s+not\s+exists/i, 'CREATE TRIGGER IF NOT EXISTS'],
  [/create\s+view\s+if\s+not\s+exists/i, 'CREATE VIEW IF NOT EXISTS'],
  [/create\s+rule\s+if\s+not\s+exists/i, 'CREATE RULE IF NOT EXISTS'],
];

describe('migrations are syntactically applicable', () => {
  it('there are migrations to check', () => {
    expect(files.length).toBeGreaterThan(5);
  });

  it('no migration uses IF NOT EXISTS where PostgreSQL rejects it', () => {
    const offenders = [];
    for (const f of files) {
      const lines = read(f).split('\n');
      lines.forEach((line, i) => {
        if (line.trimStart().startsWith('--')) return;
        for (const [re, label] of UNSUPPORTED) {
          if (re.test(line)) offenders.push(`${f}:${i + 1} — ${label}`);
        }
      });
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });

  it('every CREATE POLICY is preceded by a DROP POLICY IF EXISTS', () => {
    // the idempotent form, so re-running a migration is safe
    for (const f of files) {
      const src = read(f);
      const creates = (src.match(/^\s*create\s+policy\b/gim) || []).length;
      const drops = (src.match(/^\s*drop\s+policy\s+if\s+exists\b/gim) || []).length;
      expect(drops, `${f}: ${creates} CREATE POLICY vs ${drops} DROP POLICY IF EXISTS`)
        .toBe(creates);
    }
  });

  it('the consolidated apply-file matches the migrations it is built from', () => {
    const combined = readFileSync(
      resolve(process.cwd(), '..', 'supabase', 'APPLY_PENDING_MIGRATIONS.sql'), 'utf8');
    // it must carry no invalid construct either
    for (const [re, label] of UNSUPPORTED) {
      expect(combined.split('\n').filter((l) => !l.trimStart().startsWith('--') && re.test(l)),
        label).toEqual([]);
    }
    // and must stay non-destructive: it runs against a database with real rows
    expect(combined).not.toMatch(/^\s*drop\s+table\b/im);
    expect(combined).not.toMatch(/^\s*truncate\b/im);
    expect(combined).not.toMatch(/^\s*delete\s+from\b/im);
  });

  it('the guard catches the exact statement that failed', () => {
    const bad = 'create policy if not exists "allow anon select on bms_export_summaries"\n'
      + '  on bms_export_summaries for select to anon using (true);';
    const good = 'drop policy if exists "x" on t;\ncreate policy "x"\n  on t for select to anon using (true);';
    const hits = (sql) => sql.split('\n').filter((l) =>
      !l.trimStart().startsWith('--') && UNSUPPORTED.some(([re]) => re.test(l)));
    expect(hits(bad).length).toBe(1);
    expect(hits(good).length).toBe(0);
  });
});
