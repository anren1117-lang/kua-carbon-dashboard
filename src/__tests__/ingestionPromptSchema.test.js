// The AI ingestion prompt tells the model what columns each Supabase table has.
// Nothing checked that against the tables, and it had drifted:
//
//   purchased_goods   prompt said invoice_date? / vendor? / category?  — none of
//                     which exist — and omitted fiscal_year and
//                     purchasing_category, both NOT NULL. EVERY extracted row
//                     failed to insert.
//   scope1_refrigerants  prompt said system_id?; the column is equipment_id.
//   waste, study_abroad  prompt omitted school_year, which the admin forms write
//                     and which the Phase 429 reporting-period boundary reads.
//
// It matters because AdminAIIngestion's auto-write path inserts every
// high-confidence row directly; a schema rejection shows up as one red chip in a
// bulk drop, not as a failure the admin is likely to notice.
//
// This parses the prompt and the migrations and compares them, so the prompt
// cannot drift from the schema again without a test failing.

import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('../../', import.meta.url).pathname);
const PROMPT = fs.readFileSync(path.join(ROOT, 'api/admin/ai-ingestion.js'), 'utf8');
const MIGRATIONS = fs.readdirSync(path.join(ROOT, 'supabase/migrations'))
  .filter((f) => f.endsWith('.sql'))
  .map((f) => fs.readFileSync(path.join(ROOT, 'supabase/migrations', f), 'utf8'))
  .join('\n');

/** Columns the prompt claims for a table, from its `- table: { ... }` line. */
function promptFields(table) {
  const re = new RegExp(`^- ${table}:\\s*\\{(.+)\\}\\s*$`, 'm');
  const m = PROMPT.match(re);
  if (!m) return null;
  return m[1].split(',').map((f) => f.trim().split(':')[0].trim().replace(/\?$/, '')).filter(Boolean);
}

/** {name, notNull} for each column, from the migration. */
function schemaColumns(table) {
  const m = MIGRATIONS.match(new RegExp(`create table (?:if not exists )?${table}\\s*\\(([\\s\\S]*?)\\n\\);`, 'i'));
  if (!m) return null;
  const cols = [];
  for (const raw of m[1].split('\n')) {
    const line = raw.trim().replace(/,$/, '');
    if (!line || line.startsWith('--')) continue;
    if (/^(check|primary key|unique|constraint)\b/i.test(line)) continue;
    const name = line.split(/\s+/)[0];
    if (!/^[a-z_][a-z0-9_]*$/i.test(name)) continue;
    cols.push({ name, notNull: /not null/i.test(line), hasDefault: /default/i.test(line) });
  }
  return cols;
}

// Only tables with a migration can be checked automatically.
const MIGRATED = ['scope1_heating_oil', 'scope1_propane', 'scope1_fleet',
                  'scope1_refrigerants', 'renewables_solar', 'renewables_geothermal',
                  'renewables_wind', 'purchased_goods', 'commuting'];

describe('the ingestion prompt matches the real schema', () => {
  it.each(MIGRATED)('%s: every field the prompt names exists as a column', (table) => {
    const claimed = promptFields(table);
    const cols = schemaColumns(table);
    expect(claimed, `${table} has no shape line in the prompt`).toBeTruthy();
    expect(cols, `${table} has no migration`).toBeTruthy();
    const names = cols.map((c) => c.name);
    for (const f of claimed) {
      expect(names, `${table}.${f} is in the prompt but not in the table`).toContain(f);
    }
  });

  it.each(MIGRATED)('%s: every NOT NULL column without a default is in the prompt', (table) => {
    const claimed = promptFields(table);
    const required = schemaColumns(table)
      .filter((c) => c.notNull && !c.hasDefault && c.name !== 'id' && c.name !== 'created_at')
      .map((c) => c.name);
    for (const r of required) {
      expect(claimed, `${table}.${r} is NOT NULL but the prompt never mentions it`).toContain(r);
    }
  });

  it('catches a drifted field rather than matching anything', () => {
    // The exact defect this was written for: a field the prompt claims that the
    // table does not have.
    expect(schemaColumns('purchased_goods').map((c) => c.name)).not.toContain('invoice_date');
    expect(promptFields('purchased_goods')).not.toContain('invoice_date');
    expect(promptFields('purchased_goods')).toContain('fiscal_year');
    expect(promptFields('purchased_goods')).toContain('purchasing_category');
  });

  it('every table the prompt allows also has a documented shape', () => {
    // Rule 10 tells the model "NEVER write to a table not in the list above",
    // so the allow-list is authoritative — a table on it with no shape is an
    // invitation to guess.
    const allow = PROMPT.match(/const ALLOWED_TABLES = \[([\s\S]*?)\]/);
    const tables = allow
      ? [...allow[1].matchAll(/'([a-z_]+)'/g)].map((m) => m[1])
      : [...PROMPT.matchAll(/^- ([a-z_]+):/gm)].map((m) => m[1]);
    for (const t of tables) {
      expect(promptFields(t), `${t} is allowed but has no field shape`).toBeTruthy();
    }
  });
});
