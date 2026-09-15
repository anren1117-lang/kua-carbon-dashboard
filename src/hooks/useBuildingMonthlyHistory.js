// Per-building monthly electricity, with admin entries laid over the static
// history in monthlyConsumption.js.
//
// computeBuildingEmissions() already takes `monthlyHistory` as an option and
// ten surfaces call it (campus map, building detail, dorm leaderboard + its
// homepage preview, dorm posters, compare-buildings, month compare, monthly
// digest, energy challenge). Feeding them all one merged history keeps them
// consistent by construction: an admin month entered once moves every one of
// them, and none of them can drift from the others.
//
// No admin rows, or the table unreachable → exactly the static history, so the
// dashboard is unchanged until someone enters data.

import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient.js';
import { cachedFetch } from './measuredCache.js';
import { buildingMonthlyHistory } from '../data/monthlyConsumption.js';
import {
  rowsToBuildingMonths,
  mergeBuildingMonthlyHistory,
  adminBuildingMonthKeys,
} from '../data/buildingMonths.js';
import { SCOPE2_TABLE } from './useMeasuredScope2.js';

/** Supabase rows (oldest → newest) → merged history + provenance. Pure. */
export function composeBuildingHistoryFromRows(rows) {
  const { history: admin, ignored } = rowsToBuildingMonths(rows);
  return {
    history: mergeBuildingMonthlyHistory(buildingMonthlyHistory(), admin),
    adminKeys: adminBuildingMonthKeys(admin),
    adminBuildingCount: Object.keys(admin).length,
    ignoredRows: ignored,
  };
}

/**
 * @returns {{ history: Record<string, Record<string, number>>, adminKeys: Set<string>,
 *   adminBuildingCount: number, ignoredRows: object[], loading: boolean,
 *   error: string|null, fromAdmin: boolean }}
 */
export function useBuildingMonthlyHistory() {
  const [state, setState] = useState(() => ({
    ...composeBuildingHistoryFromRows([]),
    loading: true,
    error: null,
    fromAdmin: false,
  }));

  useEffect(() => {
    let cancelled = false;
    cachedFetch('scope2', () => supabase
      .from(SCOPE2_TABLE)
      .select('id, period_start, period_end, building, kwh, data_quality, source, notes, created_at')
      .order('created_at', { ascending: true })
      .order('id', { ascending: true }))
      .then((res) => {
        if (cancelled) return;
        if (res?.error) {
          setState((prev) => ({ ...prev, loading: false, error: res.error.message || 'Supabase error' }));
          return;
        }
        const composed = composeBuildingHistoryFromRows(res?.data || []);
        setState({ ...composed, loading: false, error: null, fromAdmin: composed.adminBuildingCount > 0 });
      })
      .catch((err) => {
        if (!cancelled) setState((prev) => ({ ...prev, loading: false, error: err?.message || 'fetch failed' }));
      });
    return () => { cancelled = true; };
  }, []);

  return state;
}
