// Hydrate Scope 1 from Supabase: fuel_bills (heating) +
// scope1_fleet_records (fleet vehicles) + scope1_refrigerant_logs
// (HVAC refrigerant leakage).
//
// Each component flips estimated → measured independently as its
// table fills in — see composeScope1FromBills() in
// src/data/scopeTotals.js. The page-level provenance flag is
// 'measured' as soon as ANY of the three has rows; consumers that
// want per-component provenance read state.breakdown[i].provenance.
//
// Pattern is reusable: one hook per scope component, each fetching
// its own Supabase table and returning a measured-or-fallback result.

import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient.js';
import { composeScope1, composeScope1FromBills } from '../data/scopeTotals.js';

/**
 * @returns {{
 *   totalMt: number,
 *   breakdown: Array<{ source: string, mt: number, provenance: string, method: string }>,
 *   provenance: string,
 *   note: string,
 *   loading: boolean,
 *   error: string | null,
 *   measured: boolean,
 * }}
 */
export function useMeasuredScope1() {
  // Initial render uses the synchronous placeholder so the page has
  // numbers to draw immediately. The Supabase fetch then either
  // confirms (no rows → keep placeholder) or upgrades to measured.
  const [state, setState] = useState(() => ({
    ...composeScope1(),
    loading: true,
    error: null,
    measured: false,
  }));

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        // Three tables in parallel. Errors on one don't block the
        // others — composeScope1FromBills falls back to placeholder
        // for any component whose array is empty.
        const [bills, fleet, refrig] = await Promise.all([
          supabase.from('fuel_bills').select('fuel_type, gallons'),
          supabase.from('scope1_fleet_records').select('fuel_type, gallons').then(
            (r) => r,
            // The migration may not have run yet on this Supabase
            // project; tolerate "table does not exist" by returning
            // an empty data set rather than 500-ing the whole page.
            () => ({ data: [], error: null })
          ),
          supabase.from('scope1_refrigerant_logs').select('refrigerant_type, lbs_recharged, lbs_reclaimed').then(
            (r) => r,
            () => ({ data: [], error: null })
          ),
        ]);
        if (cancelled) return;

        // Surface the FIRST hard error so the caller can show a
        // banner. fuel_bills is the table the dashboard has shipped
        // for the longest, so a real error there is most likely a
        // genuine connectivity issue.
        if (bills?.error) {
          setState((prev) => ({ ...prev, loading: false, error: bills.error.message || 'Supabase error' }));
          return;
        }

        const composed = composeScope1FromBills(bills?.data || [], {
          fleetRecords: fleet?.data || [],
          refrigerantLogs: refrig?.data || [],
        });
        setState({
          ...composed,
          loading: false,
          error: null,
          measured: composed.provenance === 'measured',
        });
      } catch (err) {
        if (cancelled) return;
        setState((prev) => ({ ...prev, loading: false, error: err.message || 'fetch failed' }));
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return state;
}
