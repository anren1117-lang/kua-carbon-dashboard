// Composer hook: returns measured-or-fallback values for ALL scopes
// + sinks + gross/net so the homepage hero, Executive provenance row,
// and Goals trajectory can read one consistent measured-aware view.
//
// Built on top of useMeasuredScope1 + useMeasuredScope3 — the two
// existing per-scope hooks — so the actual Supabase round-trips happen
// once and only once, regardless of how many consumers call this.

import { useMeasuredScope1 } from './useMeasuredScope1.js';
import { useMeasuredScope3 } from './useMeasuredScope3.js';
import { GRID_MIX_ANNUAL_MTCO2E } from '../data/gridMix.js';
import { ANNUAL_SEQUESTRATION_MT } from '../data/sinks.js';

/**
 * @returns {{
 *   scope1Mt: number,
 *   scope2Mt: number,
 *   scope3Mt: number,
 *   sinkMt: number,
 *   grossMt: number,
 *   netMt: number,
 *   loading: boolean,
 *   measuredScopes: number,    // 0..3 — how many scope rows flipped to measured
 *   scope1Measured: boolean,
 *   scope3Measured: boolean,
 * }}
 */
export function useMeasuredScopeTotals() {
  const s1 = useMeasuredScope1();
  const s3 = useMeasuredScope3();
  const scope1Mt = s1.totalMt;
  const scope3Mt = s3.totalMt;
  const scope2Mt = Math.round(GRID_MIX_ANNUAL_MTCO2E); // already measured via BMS
  const sinkMt = Math.round(ANNUAL_SEQUESTRATION_MT);
  const grossMt = scope1Mt + scope2Mt + scope3Mt;
  const netMt = grossMt - sinkMt;
  // Scope 2 is permanently 'cited' (BMS-measured kWh × cited factors)
  // so it always counts toward the measured tally.
  const measuredScopes = 1 + (s1.measured ? 1 : 0) + (s3.measured ? 1 : 0);
  return {
    scope1Mt,
    scope2Mt,
    scope3Mt,
    sinkMt,
    grossMt,
    netMt,
    loading: s1.loading || s3.loading,
    measuredScopes,
    scope1Measured: s1.measured,
    scope3Measured: s3.measured,
  };
}
