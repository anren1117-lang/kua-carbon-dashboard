// Hydrate Scope 1 from Supabase fuel_bills.
//
// Returns the same shape composeScope1() would return, but flips the
// heating row's provenance from 'estimated' → 'measured' the moment
// any fuel_bills rows exist. Fleet + refrigerants stay 'estimated'
// until those tables ship — see composeScope1FromBills() in
// src/data/scopeTotals.js.
//
// Pattern is reusable: one hook per scope component, each fetching its
// own Supabase table and returning a measured-or-fallback result. Same
// shape lets the consuming page wire to either without branching.

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
        const { data, error } = await supabase
          .from('fuel_bills')
          .select('fuel_type, gallons');
        if (cancelled) return;
        if (error) {
          setState((prev) => ({ ...prev, loading: false, error: error.message || 'Supabase error' }));
          return;
        }
        const composed = composeScope1FromBills(data || []);
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
