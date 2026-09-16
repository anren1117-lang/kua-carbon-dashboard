// The hourly Meter Trends export the operational views draw from.
//
// Until now this was whatever module a developer last generated and committed
// (src/data/bmsExportSep2026.js). An admin can now upload the CSV on
// /admin/bms-export; the browser parses it with src/data/parseBmsExport.js —
// the same code scripts/parseBmsExport.mjs runs — and stores the compact
// summary in bms_export_summaries. The newest stored window wins.
//
// No rows, table missing (migration not applied), or the fetch failed → the
// committed module, so every operational view keeps working exactly as before.

import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient.js';
import { cachedFetch } from './measuredCache.js';
import { BMS_EXPORT_META as SEED_META, bmsExportMeters as SEED_METERS } from '../data/bmsExportSep2026.js';

export const BMS_EXPORT_TABLE = 'bms_export_summaries';

/** A stored row → the { meta, meters } shape the pages already consume. Pure. */
export function rowToExport(row) {
  if (!row || !Array.isArray(row.summary) || row.summary.length === 0) return null;
  return {
    meta: {
      sourceFile: row.source_file,
      windowStartIso: new Date(row.window_start).toISOString(),
      windowEndIso: new Date(row.window_end).toISOString(),
      hoursCovered: row.hours_covered,
      meterCount: row.meter_count,
      generatedAt: row.created_at,
    },
    meters: row.summary,
  };
}

const seedExport = () => ({ meta: SEED_META, meters: SEED_METERS, fromUpload: false });

/**
 * @returns {{ meta: object, meters: object[], fromUpload: boolean,
 *   loading: boolean, error: string|null }}
 */
export function useBmsExport() {
  const [state, setState] = useState(() => ({ ...seedExport(), loading: true, error: null }));

  useEffect(() => {
    let cancelled = false;
    cachedFetch('bmsExport', () => supabase
      .from(BMS_EXPORT_TABLE)
      .select('id, source_file, window_start, window_end, hours_covered, meter_count, summary, created_at')
      .order('window_end', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(1))
      .then((res) => {
        if (cancelled) return;
        if (res?.error) {
          // Missing table or a real error: keep the committed export.
          setState({ ...seedExport(), loading: false, error: res.error.message || 'Supabase error' });
          return;
        }
        const uploaded = rowToExport((res?.data || [])[0]);
        setState(uploaded
          ? { ...uploaded, fromUpload: true, loading: false, error: null }
          : { ...seedExport(), loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled) setState({ ...seedExport(), loading: false, error: err?.message || 'fetch failed' });
      });
    return () => { cancelled = true; };
  }, []);

  return state;
}
