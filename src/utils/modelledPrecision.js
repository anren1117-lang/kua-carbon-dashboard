// Show the precision the evidence supports, and no more.
//
// A building's "annual electricity" is not measured. It is measured months
// divided by the share of a year those months cover (seasonalYearFraction, see
// buildingEmissions.js). Rendering that as "22,213 kWh" claims resolution to
// the kilowatt-hour on a figure where everything past the first two or three
// digits is an artefact of the seasonal model — and the model itself moved
// 13.7% in Phase 390 and another 5% in Phase 392.
//
// False precision is not a cosmetic problem. It is a claim about data quality,
// made silently, to a reader who has no way to check it. A school board
// comparing "22,213" against "19,847" will read a 2,366 kWh difference as real
// when the method's own uncertainty swamps it.
//
// THE RULE: precision follows coverage. A building with twelve metered months
// has earned more digits than one with four. yearFraction (0..1) is already
// carried on every row by computeBuildingEmissions, so the caller doesn't have
// to guess.
//
// Deliberately NOT applied to directly measured readings. A single month's
// metered kWh, or the live API window on /buildings, is a measurement — it can
// be shown as precisely as it was recorded. This is only for figures that have
// been extrapolated.

/**
 * Significant figures justified by how much of the year was actually measured.
 *
 *   ≥ 90% of the year   → 4 s.f.  (essentially a measurement)
 *   anything above zero → 3 s.f.
 *   no data at all      → 2 s.f.
 *
 * WHY 3 AND NOT 2 AT PARTIAL COVERAGE. My first cut dropped to 2 s.f. below
 * half a year, reasoning about a figure like 22,213 where "about 22,000" is
 * honest. Checked against real buildings it was wrong: Miller became 380,000
 * (up 4,457 from 375,543) and two dorms 1,000 kWh apart displayed as the same
 * number. Rounding away real signal isn't humility, and overstating a figure
 * while claiming to be more careful is worse than the precision it replaced.
 *
 * The seasonal share is known to roughly a percent, not roughly ten — so the
 * third digit is supported. The fourth is the one that was fiction.
 *
 * @param {number} yearFraction 0..1
 */
export function sigFigsForCoverage(yearFraction) {
  if (!Number.isFinite(yearFraction) || yearFraction <= 0) return 2;
  if (yearFraction >= 0.9) return 4;
  return 3;
}

/**
 * Round to n significant figures. Returns the NUMBER, so callers can still
 * format it with toLocaleString() and get thousands separators.
 */
export function toSigFigs(value, sigFigs) {
  const v = Number(value);
  if (!Number.isFinite(v) || v === 0) return 0;
  const n = Math.max(1, Math.min(15, Math.floor(sigFigs) || 1));
  return Number(v.toPrecision(n));
}

/**
 * A modelled annual kWh figure, rounded to what its coverage supports and
 * formatted with separators. "22,213" at 4 months of coverage becomes "22,000".
 */
export function formatModelledKwh(kwh, yearFraction) {
  const v = Number(kwh);
  if (!Number.isFinite(v) || v <= 0) return '0';
  return toSigFigs(v, sigFigsForCoverage(yearFraction)).toLocaleString();
}

/**
 * A modelled mtCO₂e figure. Decimal places, not significant figures, because
 * these are small numbers where a reader expects a decimal point — but fewer
 * of them than toFixed(2) was claiming. At low coverage, 10 kg resolution on a
 * figure whose method moves by whole percent is not meaningful.
 */
export function formatModelledMt(mt, yearFraction) {
  const v = Number(mt);
  if (!Number.isFinite(v) || v <= 0) return '0';
  const dp = sigFigsForCoverage(yearFraction) >= 4 ? 2 : 1;
  return v.toFixed(dp);
}

/**
 * How to describe the number's standing, for a caller that wants to say so
 * next to it. Returns null when coverage is full enough not to need a caveat.
 */
export function coverageCaveat(yearFraction, monthsCovered) {
  if (!Number.isFinite(yearFraction) || yearFraction <= 0) return 'no measured months yet';
  if (yearFraction >= 0.9) return null;
  const months = Number.isFinite(monthsCovered) ? monthsCovered : null;
  const pct = Math.round(yearFraction * 100);
  return months
    ? `estimated from ${months} metered month${months === 1 ? '' : 's'} (${pct}% of a year)`
    : `estimated from ${pct}% of a year`;
}

// ─── Per-student precision ──────────────────────────────────────────────
//
// Phase 400 set the rule for extrapolated building figures: precision follows
// COVERAGE. This is the same principle one level up — precision follows
// PROVENANCE — for the per-student family, which was doing two things wrong.
//
// FALSE PRECISION. Scope 1 per student printed 3.97, claiming 0.01 mtCO2e of
// resolution, while the same page publishes a range of 895-1,875 mt. Over 340
// students that range spans 2.88 — 288x the displayed resolution. One decimal
// is still 28x finer than the spread, which is as far as this should go.
//
// THREE ANSWERS TO ONE QUESTION. Net per student appeared as 5.07 (Executive,
// AnnualReport), 5.1 (AISummary, LearnAgent) and a hardcoded ~5.0 in a quiz.
// Sinks was already at one decimal, so ScopePageInfo rendered the same row at
// two precisions depending on which scope you were looking at.
//
// A measured total earns two decimals. An estimated or cited one earns one:
// a seasonally-extrapolated projection is not a measurement.
export const PER_STUDENT_DP = { measured: 2, estimated: 1, cited: 1 };

export function perStudentMt(totalMt, students, provenance = 'estimated') {
  if (!Number.isFinite(totalMt) || !Number.isFinite(students) || students <= 0) return null;
  const dp = PER_STUDENT_DP[provenance] ?? PER_STUDENT_DP.estimated;
  return (totalMt / students).toFixed(dp);
}
