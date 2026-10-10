// KUA reduction targets. These are aspirational pending board sign-off.
// Replace with the actual board-approved figures when the climate
// action plan is ratified.
//
// Each target sets a baseline year + value and a target year + percent
// reduction. The Goals page computes a linear trajectory between the
// two and plots the current measured value against it.

import { GROSS_MT, SCOPE2_TOTAL_MT, SCOPE3_LINES } from './scopeTotals.js';
import { ANNUAL_SEQUESTRATION_MT } from './sinks.js';
import { REPORTING_PERIOD } from './academicCalendar.js';

/**
 * THE BASELINE IS THIS INVENTORY, AND THAT IS NOT A MEASUREMENT OF PROGRESS.
 *
 * Every target carried `baselineYear: 2024` while its baselineValue was
 * derived from the CURRENT totals. There is no 2024 inventory — this is KUA's
 * first. So the "2024 baseline" was the present-day figure wearing a date, and
 * /goals computed `(baseline - actual) / baseline`, which is structurally
 * ZERO: the progress bar read 0% and could never read anything else, however
 * much the school reduced. A target whose progress cannot move is not a target.
 *
 * The honest statement is that progress against these targets becomes
 * measurable from the NEXT inventory, and until then the bar is showing an
 * arithmetic identity rather than a result. BASELINE_IS_FIRST_INVENTORY says
 * so, and /goals renders it instead of a silent 0%.
 */
export const BASELINE_YEAR = Number(REPORTING_PERIOD.schoolYear.slice(0, 4));
export const BASELINE_IS_FIRST_INVENTORY = true;
export const BASELINE_NOTE =
  `These baselines are the ${REPORTING_PERIOD.label} inventory itself — KUA's first. `
  + 'Progress against a target is measured between two inventories, so the figures below show '
  + 'the distance still to travel, not ground already covered. The first real progress reading '
  + `comes with the ${BASELINE_YEAR + 1}-${BASELINE_YEAR + 2} inventory.`;

// The gross and net baselines are DERIVED, not typed. The net one was a
// literal 1,725 until the forest sink was repriced (task #16) and it silently
// described a balance the dashboard no longer reported. Deriving both keeps
// the Goals trajectory anchored to whatever the canonical modules say.
const GROSS_BASELINE_MT = Math.round(GROSS_MT);
const NET_BASELINE_MT = Math.round(GROSS_MT - ANNUAL_SEQUESTRATION_MT);
// Derived like the other two. This was a hardcoded 390 from before the eGRID
// factor correction, against a current 410 — so /goals reported Scope 2 as
// 5% ABOVE its baseline and flagged the target "behind pace", when nothing
// about the school's electricity had changed. The whole delta was the
// emission factor being corrected. Presenting a methodology revision as a
// performance regression is worse than showing no number.
const SCOPE2_BASELINE_MT = Math.round(SCOPE2_TOTAL_MT);
// Likewise derived. This was a literal 235 carrying the comment "matches
// scopeTotals.js Scope 3 dining placeholder row" — which was true when written
// and is exactly how the Scope 2 baseline went stale: a number that matches
// another number today, with nothing holding them together tomorrow. The
// comment was also what let it past the literal guard, which exempted any
// baseline annotated `// matches`.
const DINING_BASELINE_MT = (() => {
  const row = SCOPE3_LINES.find((l) => /dining/i.test(l.source));
  if (!row) throw new Error('targets: no dining row in SCOPE3_LINES to baseline against');
  return Math.round(row.mt);
})();

/**
 * @typedef {Object} ReductionTarget
 * @property {string} id
 * @property {string} title
 * @property {string} scope            'gross' | 'scope1' | 'scope2' | 'scope3' | 'net' | 'energy_kwh'
 * @property {number} baselineYear
 * @property {number} baselineValue    in mtCO2e (or kWh for energy targets)
 * @property {number} targetYear
 * @property {number} percentReduction 0..100
 * @property {string} description
 * @property {string} owner
 * @property {boolean} approved
 */

/** @type {ReductionTarget[]} */
export const reductionTargets = [
  {
    id: 'tg_gross_2030',
    title: '50% gross-emissions reduction by 2030',
    scope: 'gross',
    baselineYear: BASELINE_YEAR,
    baselineValue: GROSS_BASELINE_MT, // bottom-up cross-check central: Scope 1 1,342 + Scope 2 410 + Scope 3 2,696
    targetYear: 2030,
    percentReduction: 50,
    description: 'Halve KUA\'s gross annual emissions vs the first-inventory baseline. Achievable largely through dorm thermostat adjustments, beef-portion reductions, and the planned Whittemore + Miller solar arrays.',
    owner: 'Head of School + Sustainability Office',
    approved: false,
  },
  {
    id: 'tg_scope2_2027',
    title: 'Scope 2 down 30% by 2027',
    scope: 'scope2',
    baselineYear: BASELINE_YEAR,
    baselineValue: SCOPE2_BASELINE_MT, // derived; see SCOPE2_BASELINE_MT for why 390 was wrong
    targetYear: 2027,
    percentReduction: 30,
    description: 'Move 30% of campus electricity onto on-campus renewables (the planned 100 kW combined arrays) plus an LED retrofit and HVAC scheduling tightening.',
    owner: 'Facilities Director',
    approved: false,
  },
  {
    id: 'tg_dining_2028',
    title: 'Dining-related emissions down 25% by 2028',
    scope: 'scope3',
    baselineYear: BASELINE_YEAR,
    baselineValue: DINING_BASELINE_MT,
    targetYear: 2028,
    percentReduction: 25,
    description: 'Reduce dining-driven Scope 3 by ~60 mtCO₂e via beef-frequency reductions, increased local sourcing, and food-waste diversion.',
    owner: 'Dining Services Director',
    approved: false,
  },
  {
    id: 'tg_net_2050',
    title: 'Net-zero net carbon by 2050',
    scope: 'net',
    baselineYear: BASELINE_YEAR,
    baselineValue: NET_BASELINE_MT, // gross minus the net-basis forest sink (task #16)
    targetYear: 2050,
    percentReduction: 100,
    description: `After all other reductions, close the remaining gap with verified removal credits or expanded forest stewardship. The campus forest removes about ${Math.round((ANNUAL_SEQUESTRATION_MT / GROSS_MT) * 100)}% of gross, which is a large lever and not a solved problem — what remains is still the majority of the footprint. Full net-zero is a 25-year horizon project.`,
    owner: 'Board of Trustees',
    approved: false,
  },
];

/**
 * Linear trajectory between baseline and target.
 * @param {ReductionTarget} target
 * @param {number} year (e.g., 2026)
 */
export function targetTrajectoryAt(target, year) {
  if (year <= target.baselineYear) return target.baselineValue;
  if (year >= target.targetYear) return target.baselineValue * (1 - target.percentReduction / 100);
  const fraction = (year - target.baselineYear) / (target.targetYear - target.baselineYear);
  const reductionByNow = target.baselineValue * (target.percentReduction / 100) * fraction;
  return target.baselineValue - reductionByNow;
}

/**
 * Are we on track? Compares an actual value to the linear trajectory at the same year.
 * Returns 'no_reading' (no elapsed period to judge), 'on_track' (≤ trajectory),
 * 'lagging' (≤ 10% over), 'off_track' (> 10% over).
 *
 * THE 'no_reading' BRANCH IS THE POINT, and leaving it out shipped a flattering
 * lie. At or before the baseline year, targetTrajectoryAt returns the baseline
 * itself, and the actual IS the baseline — so every target compared equal and
 * this function answered 'on_track' for all four. /goals rendered "On track
 * today 4 / 4" in green, plus an "On track" pill on every card.
 *
 * Phase 516 removed the pessimistic half of that same identity ("0.0% reduced",
 * "Behind pace") and left the optimistic half standing on three other surfaces.
 * Sign-flipped, it is the worse error: "0% reduced" at least reads as a null
 * result, while "On track 4/4" reads as success the school has not earned.
 *
 * A pace judgement needs two inventories. Before that there is no reading, and
 * saying so is not the same as saying things are fine.
 */
export function trajectoryStatus(target, actualValue, year) {
  if (year <= target.baselineYear) return 'no_reading';
  const expected = targetTrajectoryAt(target, year);
  if (actualValue <= expected) return 'on_track';
  if (actualValue <= expected * 1.1) return 'lagging';
  return 'off_track';
}

/**
 * How the pathway may honestly be described, given how much of it the board
 * has actually ratified.
 *
 * /goals called this "KUA's committed reduction pathway" while every target
 * carried `approved: false` — and the same page said so twice, in its
 * "Approved 0 / 4 · Board ratification pending" stat and in each row's
 * "Pending board approval". AnnualReport had it right ("Targets are
 * preliminary pending board approval"). For a school board, "committed" is
 * not a softer word for "proposed": it asserts a ratification that has not
 * happened.
 *
 * Derived rather than reworded, so the day the board ratifies, the page
 * starts saying "committed" on its own instead of waiting to be remembered.
 */
export function pathwayDescription(targets = reductionTargets) {
  const list = Array.isArray(targets) ? targets : [];
  if (list.length === 0) return 'No reduction targets are on record yet.';
  const approved = list.filter((t) => t && t.approved === true).length;
  if (approved === list.length) {
    return "KUA's committed reduction pathway — every target below is board-ratified.";
  }
  if (approved === 0) {
    return "KUA's proposed reduction pathway. No target below has been ratified by the board yet, so these are the school's working goals rather than commitments.";
  }
  return `KUA's reduction pathway — ${approved} of ${list.length} targets ${approved === 1 ? 'is' : 'are'} board-ratified; the rest are proposed and awaiting approval.`;
}
