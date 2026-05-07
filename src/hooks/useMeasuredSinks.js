// Hydrate sinks (forest sequestration) from the
// forest_stand_actuals Supabase table.
//
// Falls back to the hardcoded src/data/sinks.js inventory (~2,650 mt
// from 7 named stands) when the table is empty. The hardcoded
// inventory IS itself a defensible per-stand × per-acre × Birdsey/
// Nowak rate calc — the live table just lets admins replace it with
// a real USFS Forest Inventory & Analysis-style walk-through.

import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient.js';
import { composeSinksFromActuals } from '../data/scopeTotals.js';
import { ANNUAL_SEQUESTRATION_MT, TOTAL_FOREST_ACRES, forestStands } from '../data/sinks.js';
import { cachedFetch } from './measuredCache.js';

/**
 * @returns {{
 *   totalMt: number,
 *   standCount: number,
 *   acres: number,
 *   perStand: Array<{ stand_id: string|null, name: string|null, acres: number, mtco2eAcreYr: number, mt: number }>,
 *   provenance: 'measured' | 'estimated',
 *   loading: boolean,
 *   error: string | null,
 *   measured: boolean,
 * }}
 */
export function useMeasuredSinks() {
  const [state, setState] = useState(() => ({
    totalMt: Math.round(ANNUAL_SEQUESTRATION_MT),
    standCount: forestStands.length,
    acres: TOTAL_FOREST_ACRES,
    perStand: forestStands.map((s) => ({
      stand_id: s.id,
      name: s.name,
      acres: s.acres,
      mtco2eAcreYr: s.mtco2eAcreYr,
      mt: Math.round(s.acres * s.mtco2eAcreYr),
    })),
    provenance: 'estimated',
    loading: true,
    error: null,
    measured: false,
  }));

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        // Tolerate "table doesn't exist" (migration not applied yet)
        // — return empty data so the placeholder inventory stays in
        // place. Same posture as fleet/refrigerants in
        // useMeasuredScope1.
        const { data, error } = await cachedFetch('sinks', () =>
          supabase
            .from('forest_stand_actuals')
            .select('stand_id, name, acres, mtco2e_acre_yr')
            .then((r) => r, () => ({ data: [], error: null }))
        );
        if (cancelled) return;
        if (error) {
          setState((prev) => ({ ...prev, loading: false, error: error.message || 'Supabase error' }));
          return;
        }
        const rows = data || [];
        if (rows.length === 0) {
          // Empty table — keep the placeholder inventory but flip
          // loading off so consumers can render.
          setState((prev) => ({ ...prev, loading: false, error: null, measured: false }));
          return;
        }
        const composed = composeSinksFromActuals(rows);
        const acres = rows.reduce((s, r) => s + (Number(r.acres) || 0), 0);
        setState({
          totalMt: composed.totalMt,
          standCount: composed.standCount,
          acres,
          perStand: composed.perStand,
          provenance: 'measured',
          loading: false,
          error: null,
          measured: true,
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
