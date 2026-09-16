// Hydrate Scope 2 from Supabase. scope2_meter_readings rows with a ledger
// source — 'bms_master_monthly' (BMS All Meters monthly total) or
// 'meter_trends_feed_sum' (monthly feed-sum from a daily Meter Trends export)
// — are laid over the seed inputs month by month, then composed with the same
// pure rules the static exports use (src/data/electricityLedger.js).
//
// No admin rows (or the table unreachable) → exactly the seed composition,
// i.e. the numbers in composedYtd.js / gridMix.js. Admin rows land on
// /admin/scope-2/meter-trends, which previews this same composition.

import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient.js';
import { cachedFetch } from './measuredCache.js';
import { SEED_LEDGER_INPUTS } from '../data/composedYtd.js';
import {
  composeElectricityLedger,
  ledgerToYtdComponents,
  mergeLedgerInputs,
  projectYear1,
  rowsToLedgerInputs,
} from '../data/electricityLedger.js';
import { monthlyPattern } from '../data/seasonalPatterns.js';
import { composeScope2Mt } from '../data/gridMix.js';

export const SCOPE2_TABLE = 'scope2_meter_readings';

/**
 * The one query for scope2_meter_readings, shared by this hook and
 * useBuildingMonthlyHistory. They cache under the same key, so whichever
 * mounts first serves the other — if the two select lists ever drift apart,
 * the second hook silently gets the first one's columns. One fetcher removes
 * that whole class of bug.
 *
 * id breaks ties: created_at is transaction-start, so two rows written in one
 * transaction would otherwise have no deterministic order.
 */
export function fetchScope2Rows(supabaseClient) {
  return supabaseClient
    .from(SCOPE2_TABLE)
    .select('id, period_start, period_end, building, kwh, data_quality, source, notes, created_at')
    .order('created_at', { ascending: true })
    .order('id', { ascending: true });
}

/** Supabase rows (oldest → newest) → the full Scope 2 composition. Pure. */
export function composeScope2FromRows(rows) {
  const admin = rowsToLedgerInputs(rows);
  const ledger = composeElectricityLedger(mergeLedgerInputs(SEED_LEDGER_INPUTS, admin));
  const ytdComponents = ledgerToYtdComponents(ledger);
  const y1 = projectYear1(ytdComponents, monthlyPattern);
  const { ytdMt, annualMt } = composeScope2Mt(ledger.ytdKwh, y1.year1Kwh);
  return {
    ledger,
    ytdComponents,
    year1Months: y1.months,
    year1Kwh: y1.year1Kwh,
    calibratedAnnual: y1.calibratedAnnual,
    ytdKwh: ledger.ytdKwh,
    ytdDays: ledger.ytdDays,
    asOf: ledger.asOf,
    annualizeFactor: ledger.ytdKwh > 0 ? y1.year1Kwh / ledger.ytdKwh : 1,
    linearFactor: ledger.ytdDays > 0 ? 365 / ledger.ytdDays : 1,
    ytdMt,
    annualMt,
    adminMonthsUsed: ledger.months.filter((m) => String(m.source).startsWith('Admin')).map((m) => m.month),
    ignoredRows: admin.ignored,
  };
}

/**
 * @returns {ReturnType<typeof composeScope2FromRows> & {
 *   loading: boolean, error: string|null, fromAdmin: boolean }}
 */
export function useMeasuredScope2() {
  // First render uses the seed composition so the page draws immediately.
  const [state, setState] = useState(() => ({
    ...composeScope2FromRows([]),
    loading: true,
    error: null,
    fromAdmin: false,
  }));

  useEffect(() => {
    let cancelled = false;
    cachedFetch('scope2', () => fetchScope2Rows(supabase))
      .then((res) => {
        if (cancelled) return;
        if (res?.error) {
          setState((prev) => ({ ...prev, loading: false, error: res.error.message || 'Supabase error' }));
          return;
        }
        const composed = composeScope2FromRows(res?.data || []);
        setState({ ...composed, loading: false, error: null, fromAdmin: composed.adminMonthsUsed.length > 0 });
      })
      .catch((err) => {
        if (!cancelled) setState((prev) => ({ ...prev, loading: false, error: err?.message || 'fetch failed' }));
      });
    return () => { cancelled = true; };
  }, []);

  return state;
}
