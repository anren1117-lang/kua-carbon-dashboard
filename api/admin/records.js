// Admin-only writes to the inventory data-entry tables.
//
// WHY THIS EXISTS.
//
// Phase 531 moved the bms_* writes behind verifyAdminRequest and described
// that as moving "every admin write server-side". It was not. Every admin
// data-entry form goes through one hook — pages/admin/scope3/useTable.js,
// re-exported by _shared.js — and that hook, CsvImportPanel and
// AdminAIIngestion all wrote straight to Supabase with the publishable anon
// key that ships in the bundle. Twenty-one tables, including the ones the
// published totals are composed from (fuel bills, heating oil, meter
// readings, the forest sink), so anyone with the key could rewrite the
// inventory without touching the admin gate.
//
// This route is the one write path for all of them. The browser sends
// { table, rows } / { table, id, fields } / { table, id }; the server checks
// the token BEFORE reading the body, checks the table against an explicit
// allow-list, and writes with the service-role client.
//
// WHAT IS VALIDATED, AND WHAT IS NOT.
//
// Table names are allow-listed. Column names must be plain identifiers, and
// the server-managed columns (id, created_at) cannot be set by the caller.
// Column names are NOT checked against a per-table list: eight of these
// tables have no migration in this repo, so no such list can be derived, and
// a hand-typed one would drift. An unknown column is still rejected —
// PostgREST refuses it (PGRST204) and the error is returned to the admin —
// so nothing rides along silently; it simply fails at the database rather
// than here.

import { verifyAdminRequest } from '../../src/utils/adminToken.js';
import { getSupabaseAdmin, SupabaseAdminUnconfiguredError } from '../_lib/supabaseAdmin.js';

export const ADMIN_WRITABLE_TABLES = new Set([
  // Scope 1
  'fuel_bills', 'scope1_heating_oil', 'scope1_propane', 'scope1_fleet', 'scope1_refrigerants',
  // Scope 2
  'scope2_meter_readings',
  // Scope 3
  'day_students', 'us_boarding_students', 'international_students',
  'study_abroad', 'faculty_travel', 'waste', 'purchased_goods', 'commuting',
  // Sinks
  'forest_stand_actuals', 'sinks_trees', 'sinks_soil_samples',
  // Renewables
  'renewables_solar', 'renewables_geothermal', 'renewables_wind',
  // Framework drafts (AdminFramework + AI ingestion)
  'framework_drafts',
]);

// A CSV import is the largest legitimate write; a school's year of fuel bills
// or a full forest walk is well under this.
export const MAX_ROWS = 500;
const MAX_FIELDS = 60;
const MAX_TEXT = 20_000;
const SERVER_MANAGED = new Set(['id', 'created_at']);
const IDENT = /^[a-z_][a-z0-9_]{0,62}$/;

function validateFields(fields, label) {
  if (!fields || typeof fields !== 'object' || Array.isArray(fields)) return `${label} must be an object`;
  const keys = Object.keys(fields);
  if (keys.length === 0) return `${label} has no fields`;
  if (keys.length > MAX_FIELDS) return `${label} has ${keys.length} fields; cap is ${MAX_FIELDS}`;
  for (const k of keys) {
    if (!IDENT.test(k)) return `${label}: "${k}" is not a valid column name`;
    if (SERVER_MANAGED.has(k)) return `${label}: "${k}" is set by the database, not the caller`;
    const v = fields[k];
    if (typeof v === 'string' && v.length > MAX_TEXT) return `${label}.${k} exceeds ${MAX_TEXT} characters`;
    if (typeof v === 'number' && !Number.isFinite(v)) return `${label}.${k} is not a finite number`;
  }
  return null;
}

const isId = (v) => (typeof v === 'number' && Number.isFinite(v))
  || (typeof v === 'string' && v.length > 0 && v.length <= 64);

export default async function handler(req, res) {
  const auth = verifyAdminRequest(req);
  if (!auth.valid) {
    res.status(401).json({ error: auth.reason || 'unauthorized' });
    return;
  }

  if (!['POST', 'PATCH', 'DELETE'].includes(req.method)) {
    res.setHeader('Allow', 'POST, PATCH, DELETE');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const table = req.body?.table;
  if (typeof table !== 'string' || !ADMIN_WRITABLE_TABLES.has(table)) {
    res.status(400).json({ error: `table must be one of the admin data-entry tables` });
    return;
  }

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (err) {
    if (err instanceof SupabaseAdminUnconfiguredError) {
      res.status(503).json({ error: err.message });
      return;
    }
    throw err;
  }

  try {
    // POST { table, rows: [...] } — insert one or more rows.
    if (req.method === 'POST') {
      const rows = req.body?.rows;
      if (!Array.isArray(rows) || rows.length === 0) {
        res.status(400).json({ error: 'Body must be { table, rows: [ ... ] } with at least one row' });
        return;
      }
      if (rows.length > MAX_ROWS) {
        res.status(400).json({ error: `${rows.length} rows; cap is ${MAX_ROWS} per request` });
        return;
      }
      for (let i = 0; i < rows.length; i++) {
        const reason = validateFields(rows[i], `rows[${i}]`);
        if (reason) { res.status(400).json({ error: reason }); return; }
      }
      const { error } = await supabase.from(table).insert(rows);
      if (error) { res.status(502).json({ error: error.message }); return; }
      res.status(200).json({ inserted: rows.length });
      return;
    }

    // PATCH { table, id, fields } and DELETE { table, id } — one row by id.
    // No bulk update or delete: no admin flow needs one, and not offering it
    // keeps a mistaken call to a single row.
    const id = req.body?.id;
    if (!isId(id)) { res.status(400).json({ error: 'Body must include a row id' }); return; }

    if (req.method === 'PATCH') {
      const fields = req.body?.fields;
      const reason = validateFields(fields, 'fields');
      if (reason) { res.status(400).json({ error: reason }); return; }
      const { error } = await supabase.from(table).update(fields).eq('id', id);
      if (error) { res.status(502).json({ error: error.message }); return; }
      res.status(200).json({ updated: id });
      return;
    }

    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) { res.status(502).json({ error: error.message }); return; }
    res.status(200).json({ deleted: id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
