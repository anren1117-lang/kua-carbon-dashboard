// Is the table empty, or is it not there?
//
// /admin/data-quality counted rows per table and rendered `count ?? 0`, so a
// table that does not exist displayed as "0 rows" — identical to a table
// waiting for its first entry. Twelve of this project's 28 tables were missing
// for months and every surface reported them as merely empty, including the
// one page whose job is to answer "how complete is our data?".
//
// The cost was not cosmetic. bms_export_summaries is the table
// /admin/bms-export writes to, so uploading a Meter Trends CSV failed with
// nothing on screen to say why — useBmsExport is documented to fall back to the
// committed export on a missing table, which is correct behaviour and perfectly
// silent. An admin could upload the same file ten times and see no change and
// no error.
//
// supabase-js returns { data, error } rather than throwing, so a missing table
// arrives as an error object the caller has to look at. Destructuring only
// `count` drops it.

/** PostgREST: the relation is not in the schema cache — it does not exist. */
export const CODE_MISSING_TABLE = 'PGRST205';
/** PostgREST: row-level security refused the operation. */
export const CODE_RLS_DENIED = '42501';

/**
 * Classify a supabase-js error into something a surface can act on.
 * @returns {'ok'|'missing'|'denied'|'error'}
 */
export function classifyTableError(error) {
  if (!error) return 'ok';
  const code = error.code || '';
  if (code === CODE_MISSING_TABLE) return 'missing';
  if (code === CODE_RLS_DENIED) return 'denied';
  // message fallback — older clients surface the text without a code
  if (/could not find the table/i.test(error.message || '')) return 'missing';
  return 'error';
}

/**
 * What stops working when a given table is absent. Keyed by table name; only
 * the ones with a user-visible consequence are listed, so the admin banner can
 * say what is broken rather than just naming a table.
 */
export const BLOCKED_BY_MISSING_TABLE = {
  bms_export_summaries: 'Meter Trends CSV upload on /admin/bms-export — uploads cannot persist, and the dashboard silently keeps using the export committed in the app',
  bms_meter_map: 'sharing the meter→building mapping between admins; it stays in one browser',
  forest_stand_actuals: 'forest stand data entry on /admin/sinks',
  scope1_fleet_records: 'the detailed fleet record form',
  scope1_refrigerant_logs: 'the detailed refrigerant service log',
  admin_audit_log: 'the /admin/audit-log trail (writes still succeed — the logger is fire-and-forget)',
  teacher_lessons: 'saving teacher lessons',
  quiz_attempts: 'recording student quiz attempts',
  meter_readings_csv: 'the CSV meter-reading importer',
  alert_subscribers: 'alert sign-ups',
  alert_cron_state: 'the alert scheduler',
  alert_history: 'the alert history view',
};

/** How an admin fixes it — one place, so every surface says the same thing. */
export const MISSING_TABLE_REMEDY =
  'Run supabase/APPLY_PENDING_MIGRATIONS.sql in the Supabase SQL editor. '
  + 'Check the branch selector first: on a database branch the SQL applies to the '
  + 'branch and never reaches the project the app reads.';

/**
 * @param {Record<string, {missing?: boolean}>} stats  table → fetch result
 * @returns {{table: string, blocks: string}[]}
 */
export function missingTableReport(stats = {}) {
  return Object.entries(stats)
    .filter(([, s]) => s && s.missing)
    .map(([table]) => ({
      table,
      blocks: BLOCKED_BY_MISSING_TABLE[table] || 'data entry for this table',
    }))
    .sort((a, b) => a.table.localeCompare(b.table));
}
