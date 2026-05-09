// Composer hook: returns measured-or-fallback values for ALL scopes
// + sinks + gross/net so the homepage hero, Executive provenance row,
// Goals trajectory, and AdminHome data-status panel can read one
// consistent measured-aware view.
//
// Built on top of useMeasuredScope1, useMeasuredScope3, and
// useMeasuredSinks — each per-component hook does its own Supabase
// round-trip; this composer just folds them together.

import { useMeasuredScope1 } from './useMeasuredScope1.js';
import { useMeasuredScope3 } from './useMeasuredScope3.js';
import { useMeasuredSinks } from './useMeasuredSinks.js';
import { GRID_MIX_ANNUAL_MTCO2E } from '../data/gridMix.js';

/**
 * @returns {{
 *   scope1Mt: number,
 *   scope2Mt: number,
 *   scope3Mt: number,
 *   sinkMt: number,
 *   grossMt: number,
 *   netMt: number,
 *   loading: boolean,
 *   measuredScopes: number,    // 0..4 — how many scope rows flipped to measured
 *   scope1Measured: boolean,
 *   scope3Measured: boolean,
 *   sinksMeasured: boolean,
 *   scope3CohortDetail: Array<{ cohort: string, label: string, count: number, mt: number, perStudentMt: number|null, provenance: string, method: string }>,
 * }}
 */
export function useMeasuredScopeTotals() {
  const s1 = useMeasuredScope1();
  const s3 = useMeasuredScope3();
  const sinks = useMeasuredSinks();
  const scope1Mt = s1.totalMt;
  const scope3Mt = s3.totalMt;
  const scope2Mt = Math.round(GRID_MIX_ANNUAL_MTCO2E); // already measured via BMS
  const sinkMt = sinks.totalMt;
  const grossMt = scope1Mt + scope2Mt + scope3Mt;
  const netMt = grossMt - sinkMt;
  // Scope 2 is permanently 'cited' (BMS-measured kWh × cited factors)
  // so it always counts toward the measured tally.
  const measuredScopes =
    1 +
    (s1.measured ? 1 : 0) +
    (s3.measured ? 1 : 0) +
    (sinks.measured ? 1 : 0);
  return {
    scope1Mt,
    scope2Mt,
    scope3Mt,
    sinkMt,
    grossMt,
    netMt,
    loading: s1.loading || s3.loading || sinks.loading,
    measuredScopes,
    scope1Measured: s1.measured,
    scope3Measured: s3.measured,
    sinksMeasured: sinks.measured,
    // Expose Scope 3's per-cohort breakdown so non-Scope3 pages
    // (Executive, AnnualReport) can render the same measured table
    // without re-fetching. Will be the placeholder array when s3 is
    // estimated and the composed array when measured.
    scope3CohortDetail: Array.isArray(s3.cohortDetail) ? s3.cohortDetail : [],
  };
}
