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
import { useMeasuredScope2 } from './useMeasuredScope2.js';

/**
 * @returns {{
 *   scope1Mt: number,
 *   scope2Mt: number,
 *   scope3Mt: number,
 *   sinkMt: number,
 *   grossMt: number,
 *   netMt: number,
 *   loading: boolean,
 *   error: string|null,       // any child hook's failure, naming which scope
 *   measuredScopes: number,    // 1..4 — Scope 2 is always counted (BMS-measured kWh × cited factors); the other three flip as their tables fill in
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
  const s2 = useMeasuredScope2();
  const scope1Mt = s1.totalMt;
  const scope3Mt = s3.totalMt;
  // BMS-measured kWh — the seed ledger, with any admin ledger months laid over it.
  const scope2Mt = Math.round(s2.annualMt);
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
    loading: s1.loading || s2.loading || s3.loading || sinks.loading,
    // Each child hook exposes an error; this composer returned none of them,
    // so all seventeen consumers — the homepage included — were structurally
    // unable to tell a reader the numbers had fallen back to build-time
    // constants. Labelled by scope: "live data unavailable" without saying
    // WHICH source failed is barely more useful than silence.
    error: [
      s1.error    && `Scope 1: ${s1.error}`,
      s2.error    && `Scope 2: ${s2.error}`,
      s3.error    && `Scope 3: ${s3.error}`,
      sinks.error && `Sinks: ${sinks.error}`,
    ].filter(Boolean).join('; ') || null,
    scope2FromAdmin: s2.fromAdmin,
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
