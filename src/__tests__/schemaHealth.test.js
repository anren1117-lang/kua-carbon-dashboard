// A missing table looked exactly like an empty one.
//
// /admin/data-quality — the page whose job is to answer "how complete is our
// data?" — fetched a row count per table and rendered `count ?? 0`. supabase-js
// resolves with { data, error } rather than throwing, and the fetch
// destructured only `count`, so a table that did not exist reported 0 rows:
// identical to a table awaiting its first entry.
//
// Twelve of this project's 28 tables were absent for months and every surface
// said "empty". The expensive one was bms_export_summaries, the table
// /admin/bms-export writes to: uploading a Meter Trends CSV could not persist,
// useBmsExport fell back to the committed export exactly as designed, and
// nothing anywhere said why. The same file could be uploaded repeatedly with no
// change and no error.
//
// There is a second trap behind it, which is why the remedy text mentions
// branches: on a Supabase database branch the SQL editor applies to the branch,
// not to the project the deployed app reads. Both show the same tables and the
// same seeded row counts, so "I ran it" and "it did not apply" are both true.

import { describe, it, expect } from 'vitest';
import {
  classifyTableError, missingTableReport, BLOCKED_BY_MISSING_TABLE,
  MISSING_TABLE_REMEDY, CODE_MISSING_TABLE, CODE_RLS_DENIED,
} from '../data/schemaHealth.js';

describe('a missing table is distinguishable from an empty one', () => {
  it('classifies the PostgREST codes that actually occur', () => {
    expect(classifyTableError(null)).toBe('ok');
    expect(classifyTableError({ code: CODE_MISSING_TABLE })).toBe('missing');
    expect(classifyTableError({ code: CODE_RLS_DENIED })).toBe('denied');
    expect(classifyTableError({ code: '23502' })).toBe('error');
  });

  it('recognises the real error object this project returned', () => {
    // verbatim from the live API during the investigation
    const real = {
      code: 'PGRST205',
      details: null,
      hint: null,
      message: "Could not find the table 'public.bms_export_summaries' in the schema cache",
    };
    expect(classifyTableError(real)).toBe('missing');
  });

  it('falls back to the message when no code is supplied', () => {
    expect(classifyTableError({ message: "Could not find the table 'public.x' in the schema cache" }))
      .toBe('missing');
  });

  it('an empty table is not reported as missing — the distinction being the point', () => {
    const stats = {
      waste: { count: 0, missing: false },
      scope1_propane: { count: 0, missing: false },
    };
    expect(missingTableReport(stats)).toEqual([]);
  });

  it('names what each missing table actually breaks', () => {
    const stats = {
      waste: { count: 0, missing: false },
      bms_export_summaries: { count: 0, missing: true },
      forest_stand_actuals: { count: 0, missing: true },
    };
    const report = missingTableReport(stats);
    expect(report.map((r) => r.table)).toEqual(['bms_export_summaries', 'forest_stand_actuals']);
    // a bare table name is not actionable; the consequence is
    expect(report[0].blocks).toMatch(/upload/i);
    expect(report[0].blocks.length).toBeGreaterThan(20);
  });

  it('every blocked-feature note says something, for every table listed', () => {
    for (const [table, blocks] of Object.entries(BLOCKED_BY_MISSING_TABLE)) {
      expect(blocks, table).toBeTruthy();
      expect(blocks.length, table).toBeGreaterThan(10);
    }
    // the ones that cost the most time here must be covered
    expect(BLOCKED_BY_MISSING_TABLE).toHaveProperty('bms_export_summaries');
    expect(BLOCKED_BY_MISSING_TABLE).toHaveProperty('forest_stand_actuals');
  });

  it('the remedy warns about the branch trap, not just the file to run', () => {
    expect(MISSING_TABLE_REMEDY).toMatch(/APPLY_PENDING_MIGRATIONS\.sql/);
    expect(MISSING_TABLE_REMEDY).toMatch(/branch/i);
  });

  it('an unknown missing table still produces a usable line', () => {
    const report = missingTableReport({ some_new_table: { missing: true } });
    expect(report[0].blocks).toBeTruthy();
  });
});
