// KUA reduction targets. These are aspirational pending board sign-off.
// Replace with the actual board-approved figures when the climate
// action plan is ratified.
//
// Each target sets a baseline year + value and a target year + percent
// reduction. The Goals page computes a linear trajectory between the
// two and plots the current measured value against it.

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
    baselineYear: 2024,
    baselineValue: 4345, // updated to current methodology (was 4150 pre-emission-factor-fix)
    targetYear: 2030,
    percentReduction: 50,
    description: 'Halve KUA\'s gross annual emissions vs the 2024 preliminary baseline. Achievable largely through dorm thermostat adjustments, beef-portion reductions, and the planned Whittemore + Miller solar arrays.',
    owner: 'Head of School + Sustainability Office',
    approved: false,
  },
  {
    id: 'tg_scope2_2027',
    title: 'Scope 2 down 30% by 2027',
    scope: 'scope2',
    baselineYear: 2024,
    baselineValue: 395, // updated (was 222 pre-fix)
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
    baselineYear: 2024,
    baselineValue: 800, // dining is ~30% of Scope 3 — figure stays close to original
    targetYear: 2028,
    percentReduction: 25,
    description: 'Reduce dining-driven Scope 3 by ~200 mtCO₂e via beef-frequency reductions, increased local sourcing, and food-waste diversion.',
    owner: 'Dining Services Director',
    approved: false,
  },
  {
    id: 'tg_net_2050',
    title: 'Net-zero net carbon by 2050',
    scope: 'net',
    baselineYear: 2024,
    baselineValue: 1695, // updated (was 1150 pre-fix; gross 4,345 − sinks 2,650)
    targetYear: 2050,
    percentReduction: 100,
    description: 'After all other reductions, close the remaining gap with verified removal credits or expanded forest stewardship. KUA\'s net is already low because of the campus forest; full net-zero is a 25-year horizon project.',
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
 * Returns 'on_track' (≤ trajectory), 'lagging' (≤ 10% over), 'off_track' (> 10% over).
 */
export function trajectoryStatus(target, actualValue, year) {
  const expected = targetTrajectoryAt(target, year);
  if (actualValue <= expected) return 'on_track';
  if (actualValue <= expected * 1.1) return 'lagging';
  return 'off_track';
}
