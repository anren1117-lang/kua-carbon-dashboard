// Admin-only writes to bms_meter_map (the BMS meter -> building mapping).
//
// REPLACES THREE DIRECT BROWSER WRITES. src/data/bmsExportMapping.js called
// supabase.from('bms_meter_map') with the publishable anon key:
//
//   line 117  .upsert({ meter_id, building_id, updated_at })
//   line 119  .delete().eq('meter_id', meterId)
//   line 148  .delete().neq('meter_id', '')      <- clears the whole table
//
// Those only worked because the migration granted `anon` insert/update/delete.
// Since the anon key is in the shipped bundle, so was the ability to rewrite
// or wipe the mapping that decides which buildings show measured electricity
// on /buildings, /hotspots and the dorm leaderboard.
//
// Routing the writes here means the database can be locked down to
// `for select to anon` while the admin UI keeps working: this endpoint
// verifies the admin bearer token and connects with the service-role key.
//
// READS ARE DELIBERATELY NOT HERE. Public select stays allowed, and
// bmsExportMapping.js still reads straight from Supabase — the mapping is not
// secret, and keeping the read path unchanged avoids a needless round trip.

import { verifyAdminRequest } from '../../src/utils/adminToken.js';
import { getSupabaseAdmin, SupabaseAdminUnconfiguredError } from '../_lib/supabaseAdmin.js';

const TABLE = 'bms_meter_map';
const MAX_ID_LENGTH = 200;
// A single BMS export maps on the order of 100 meters; 5k is far above any
// legitimate payload and well below anything that would strain the table.
const MAX_ENTRIES = 5_000;

function badId(v) {
  return typeof v !== 'string' || v.length === 0 || v.length > MAX_ID_LENGTH;
}

export default async function handler(req, res) {
  // Authorization BEFORE body parsing or validation: an unauthorized caller
  // should not get schema feedback, and should not cost us the parse.
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
    // PUT { entries: [{ meterId, buildingId }, ...] } — upsert a batch.
    if (req.method === 'PUT') {
      const entries = req.body?.entries;
      if (!Array.isArray(entries)) {
        res.status(400).json({ error: 'Body must be { entries: [{ meterId, buildingId }] }' });
        return;
      }
      if (entries.length > MAX_ENTRIES) {
        res.status(413).json({ error: `Too many entries (${entries.length}); cap is ${MAX_ENTRIES}` });
        return;
      }
      for (let i = 0; i < entries.length; i++) {
        const e = entries[i];
        if (!e || typeof e !== 'object') { res.status(400).json({ error: `[${i}] not an object` }); return; }
        if (badId(e.meterId))    { res.status(400).json({ error: `[${i}] meterId must be a 1-${MAX_ID_LENGTH} char string` }); return; }
        if (badId(e.buildingId)) { res.status(400).json({ error: `[${i}] buildingId must be a 1-${MAX_ID_LENGTH} char string` }); return; }
      }
      if (entries.length === 0) { res.status(200).json({ upserted: 0 }); return; }

      const now = new Date().toISOString();
      const rows = entries.map((e) => ({
        meter_id: e.meterId, building_id: e.buildingId, updated_at: now,
      }));
      const { error } = await supabase.from(TABLE).upsert(rows);
      if (error) { res.status(502).json({ error: error.message }); return; }
      res.status(200).json({ upserted: rows.length });
      return;
    }

    // DELETE { meterId } — unmap one meter.
    // DELETE { all: true } — clear the mapping. Explicit flag required so a
    // malformed body can never be read as "delete everything"; the browser
    // code it replaces used .neq('meter_id','') for this.
    if (req.method === 'DELETE') {
      const { meterId, all } = req.body || {};
      if (all === true) {
        const { error } = await supabase.from(TABLE).delete().neq('meter_id', '');
        if (error) { res.status(502).json({ error: error.message }); return; }
        res.status(200).json({ cleared: true });
        return;
      }
      if (badId(meterId)) {
        res.status(400).json({ error: 'Body must be { meterId } or { all: true }' });
        return;
      }
      const { error } = await supabase.from(TABLE).delete().eq('meter_id', meterId);
      if (error) { res.status(502).json({ error: error.message }); return; }
      res.status(200).json({ deleted: meterId });
      return;
    }

    res.setHeader('Allow', 'PUT, DELETE');
    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
