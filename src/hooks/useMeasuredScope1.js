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
import { cachedFetch } from './measuredCache.js';

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
        // Cached so a second consumer in the same render tree (or
        // within 30s) reuses the in-flight or recent fetch instead
        // of firing duplicate Supabase round-trips.
        //
        // Reads from FIVE tables (heating × 3 + fleet + refrigerants):
        //   - fuel_bills          (AdminPortal.js / legacy CRUD)        → heating
        //   - scope1_heating_oil  (initial schema, /admin/scope-1/heating-oil) → heating
        //   - scope1_propane      (initial schema, /admin/scope-1/propane)     → heating
        //   - scope1_fleet        (initial schema, /admin/scope-1/fleet)       → fleet
        //   - scope1_refrigerants (initial schema, /admin/scope-1/refrigerants) → refrigerants
        //
        // The per-fuel tables (heating_oil / propane) don't store a
        // fuel_type column — we tag each row before passing to
        // composeScope1FromBills so the factor lookup works. fuel_bills
        // already has fuel_type so passes through unchanged.
        const [bills, oil, propane, fleet, refrig] = await cachedFetch('scope1', () => Promise.all([
          supabase.from('fuel_bills').select('fuel_type, gallons'),
          supabase.from('scope1_heating_oil').select('gallons').then(
            (r) => r,
            () => ({ data: [], error: null })
          ),
          supabase.from('scope1_propane').select('gallons').then(
            (r) => r,
            () => ({ data: [], error: null })
          ),
          supabase.from('scope1_fleet').select('fuel_type, gallons').then(
            (r) => r,
            // Tolerate "table does not exist" — falls back to placeholder.
            () => ({ data: [], error: null })
          ),
          supabase.from('scope1_refrigerants').select('refrigerant_type, recharge_lb, reclaim_lb').then(
            (r) => r,
            () => ({ data: [], error: null })
          ),
        ]));
        if (cancelled) return;

        // Surface the FIRST hard error so the caller can show a
        // banner. fuel_bills is the table the dashboard has shipped
        // for the longest, so a real error there is most likely a
        // genuine connectivity issue.
        if (bills?.error) {
          setState((prev) => ({ ...prev, loading: false, error: bills.error.message || 'Supabase error' }));
          return;
        }

        // Tag the per-fuel tables with their fuel_type so
        // composeScope1FromBills's factor lookup works on each row.
        // The merged list is what the helper sees.
        const taggedOil = (oil?.data || []).map((r) => ({ ...r, fuel_type: 'Heating Oil' }));
        const taggedPropane = (propane?.data || []).map((r) => ({ ...r, fuel_type: 'Propane' }));
        const allHeating = [
          ...(bills?.data || []),
          ...taggedOil,
          ...taggedPropane,
        ];
        const composed = composeScope1FromBills(allHeating, {
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
