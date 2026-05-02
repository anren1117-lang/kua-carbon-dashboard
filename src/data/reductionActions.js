// Reduction Actions — proposed campus interventions with owner, cost,
// expected CO2e reduction, status. Power the AI Carbon Advisor and the
// recommendation ranking.

/**
 * @typedef {Object} ReductionAction
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {'energy'|'dining'|'transportation'|'waste'|'procurement'|'engagement'} category
 * @property {number} expectedReductionMtCO2e   Annualized
 * @property {number} estimatedCostUsd          0 if behavioural
 * @property {'low'|'medium'|'high'} difficulty
 * @property {'low'|'medium'|'high'} urgency
 * @property {'high'|'medium'|'low'} confidence
 * @property {string} owner
 * @property {string} timeline
 * @property {'proposed'|'in_progress'|'completed'|'blocked'} status
 * @property {string} dataSource
 * @property {string} nextAction
 */

/** @type {ReductionAction[]} */
export const reductionActions = [
  {
    id: 'ra_dorm_thermo',
    title: 'Lower dorm winter thermostat by 2°F (70 → 68°F)',
    description: 'Adjust default heating setpoint in all dorms during occupied hours; preserve 70°F option on individual override.',
    category: 'energy',
    expectedReductionMtCO2e: 18,
    estimatedCostUsd: 0,
    difficulty: 'low',
    urgency: 'high',
    confidence: 'high',
    owner: 'Facilities Director',
    timeline: 'Next heating season',
    status: 'proposed',
    dataSource: 'KUA dorm heating-fuel records + 3% per °F rule',
    nextAction: 'Pilot in 2 dorms for one month, measure delta vs control.',
  },
  {
    id: 'ra_beef_cut20',
    title: 'Reduce beef portions by 20% and add chicken/vegetarian alternatives',
    description: 'Replace 1 of 5 weekly beef entrées with a chicken or plant-based equivalent. Maintain caloric and protein parity.',
    category: 'dining',
    expectedReductionMtCO2e: 56,
    estimatedCostUsd: 0,
    difficulty: 'medium',
    urgency: 'high',
    confidence: 'high',
    owner: 'Dining Services Director',
    timeline: 'Spring menu cycle',
    status: 'proposed',
    dataSource: 'POS records + Poore & Nemecek (2018)',
    nextAction: 'Coordinate with chef on substitute recipes; survey student acceptance.',
  },
  {
    id: 'ra_gym_hvac_after9',
    title: 'Auto-shutoff Whittemore HVAC after 9 PM',
    description: 'Add occupancy-based control to Whittemore Athletic Center HVAC; default to setback after 9 PM.',
    category: 'energy',
    expectedReductionMtCO2e: 9,
    estimatedCostUsd: 6500,
    difficulty: 'medium',
    urgency: 'medium',
    confidence: 'medium',
    owner: 'Facilities Director',
    timeline: '90 days',
    status: 'proposed',
    dataSource: 'Envysion late-night demand readings',
    nextAction: 'Get BMS quote from existing vendor.',
  },
  {
    id: 'ra_led_retrofit',
    title: 'Replace remaining T8 fluorescent lighting with LEDs',
    description: 'Approximately 35% of Miller, Fitch, Flickinger still on T8 fluorescent. Retrofit to LED with motion sensors.',
    category: 'energy',
    expectedReductionMtCO2e: 7,
    estimatedCostUsd: 28000,
    difficulty: 'medium',
    urgency: 'medium',
    confidence: 'high',
    owner: 'Facilities Director',
    timeline: '6 months',
    status: 'in_progress',
    dataSource: 'Lighting inventory audit + utility rebate application',
    nextAction: 'Submit Liberty Utilities rebate forms (~40% of cost).',
  },
  {
    id: 'ra_carpool_challenge',
    title: 'Faculty/staff carpool challenge — Spring',
    description: '6-week opt-in carpool program with leaderboard and small incentives. Target 20% participation among solo drivers.',
    category: 'transportation',
    expectedReductionMtCO2e: 12,
    estimatedCostUsd: 1200,
    difficulty: 'low',
    urgency: 'medium',
    confidence: 'medium',
    owner: 'Sustainability Coordinator',
    timeline: 'April–May 2026',
    status: 'proposed',
    dataSource: 'Staff commute survey + carpool log mock data',
    nextAction: 'Finalize prize budget and launch sign-up form.',
  },
  {
    id: 'ra_compost_expand',
    title: 'Expand compost collection to all dining stations',
    description: 'Add separated compost bins to plate-scrape, salad bar, and faculty dining. Reduce landfill waste tonnage.',
    category: 'waste',
    expectedReductionMtCO2e: 4,
    estimatedCostUsd: 2400,
    difficulty: 'low',
    urgency: 'low',
    confidence: 'medium',
    owner: 'Dining Services Director',
    timeline: '60 days',
    status: 'proposed',
    dataSource: 'Food waste logs Feb–Mar 2026',
    nextAction: 'Order bins; train dining staff on contamination protocols.',
  },
  {
    id: 'ra_int_student_offset',
    title: 'Voluntary travel offset program for international students',
    description: 'Optional fee at enrollment that funds verified removal credits for international student round-trip flights.',
    category: 'transportation',
    expectedReductionMtCO2e: 0, // Not a reduction; framed as compensation
    estimatedCostUsd: 0,
    difficulty: 'low',
    urgency: 'low',
    confidence: 'low',
    owner: 'Admissions / Sustainability',
    timeline: 'Next admissions cycle',
    status: 'proposed',
    dataSource: 'International student headcount + air travel records',
    nextAction: 'Identify acceptable removal-credit registry; draft opt-in language.',
  },
  {
    id: 'ra_dorm_competition',
    title: 'Dorm energy reduction competition',
    description: 'Public dorm-level leaderboard tracking weekly kWh delta vs baseline. Winning dorm gets sustainability dinner.',
    category: 'engagement',
    expectedReductionMtCO2e: 6,
    estimatedCostUsd: 800,
    difficulty: 'low',
    urgency: 'medium',
    confidence: 'medium',
    owner: 'Sustainability Coordinator',
    timeline: 'February–March 2026',
    status: 'proposed',
    dataSource: 'Per-building meter readings + dorm population',
    nextAction: 'Set up weekly auto-email with delta rankings.',
  },
];
