// Admin-only writes to bms_export_summaries (uploaded BMS meter-trend
// exports). Reads stay public and direct — see useBmsExport.js.
//
// REPLACES TWO DIRECT BROWSER WRITES in pages/admin/AdminBmsExport.js:
//   line 106  supabase.from(BMS_EXPORT_TABLE).insert([row])
//   line 126  supabase.from(BMS_EXPORT_TABLE).delete().eq('id', row.id)
//
// Both ran with the publishable anon key and worked only because the
// migration granted `anon` insert/delete. That key is in the shipped bundle,
// so anyone could upload a fabricated export window — and the newest stored
// window WINS, meaning a forged row silently becomes the measured
// electricity the dashboard reports. Deleting rows was equally open.

import { verifyAdminRequest } from '../../src/utils/adminToken.js';
import { getSupabaseAdmin, SupabaseAdminUnconfiguredError } from '../_lib/supabaseAdmin.js';

const TABLE = 'bms_export_summaries';
const MAX_TEXT = 500;
// A BMS export covers ~100 meters; 10k is far above any real upload.
const MAX_METERS = 10_000;

const isIso = (v) => typeof v === 'string' && v.length <= 40 && !Number.isNaN(new Date(v).getTime());
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const isText = (v) => typeof v === 'string' && v.length > 0 && v.length <= MAX_TEXT;

function validateRow(r) {
  if (!r || typeof r !== 'object' || Array.isArray(r)) return 'body.row must be an object';
  if (!isText(r.source_file)) return `source_file must be a 1-${MAX_TEXT} char string`;
  if (!isIso(r.window_start)) return 'window_start must be an ISO date string';
  if (!isIso(r.window_end)) return 'window_end must be an ISO date string';
  if (new Date(r.window_end).getTime() < new Date(r.window_start).getTime()) {
    return 'window_end must not precede window_start';
  }
  if (!isNum(r.hours_covered) || r.hours_covered < 0) return 'hours_covered must be a non-negative number';
  if (!isNum(r.meter_count) || r.meter_count < 0) return 'meter_count must be a non-negative number';
  if (r.summary == null || typeof r.summary !== 'object') return 'summary must be an object or array';
  const n = Array.isArray(r.summary) ? r.summary.length : Object.keys(r.summary).length;
  if (n > MAX_METERS) return `summary has ${n} entries; cap is ${MAX_METERS}`;
  return null;
}

export default async function handler(req, res) {
  const auth = verifyAdminRequest(req);
  if (!auth.valid) {
    res.status(401).json({ error: auth.reason || 'unauthorized' });
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
    // POST { row } — store one uploaded export window.
    if (req.method === 'POST') {
      const row = req.body?.row;
      const reason = validateRow(row);
      if (reason) { res.status(400).json({ error: reason }); return; }
      // Only the six known columns are forwarded. The browser no longer picks
      // what lands in the table, so an extra attacker-chosen field cannot
      // ride along into the insert.
      const clean = {
        source_file: row.source_file,
        window_start: row.window_start,
        window_end: row.window_end,
        hours_covered: row.hours_covered,
        meter_count: row.meter_count,
        summary: row.summary,
      };
      const { error } = await supabase.from(TABLE).insert([clean]);
      if (error) { res.status(502).json({ error: error.message }); return; }
      res.status(200).json({ inserted: 1 });
      return;
    }

    // DELETE { id } — remove one stored window. No bulk delete: there is no
    // admin flow that needs it, and not offering it keeps the blast radius
    // of a mistaken call to a single row.
    if (req.method === 'DELETE') {
      const id = req.body?.id;
      if (!(typeof id === 'number' && Number.isFinite(id)) && !isText(id)) {
        res.status(400).json({ error: 'Body must be { id }' });
        return;
      }
      const { error } = await supabase.from(TABLE).delete().eq('id', id);
      if (error) { res.status(502).json({ error: error.message }); return; }
      res.status(200).json({ deleted: id });
      return;
    }

    res.setHeader('Allow', 'POST, DELETE');
    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
