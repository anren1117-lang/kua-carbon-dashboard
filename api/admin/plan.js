// POST /api/admin/plan
//
// Body:
//   {
//     context: {
//       fiscalYear: string,                                 // e.g. "2026-2027"
//       capitalAppetite: 'low'|'medium'|'high',             // board appetite for capex
//       topPriority: 'scope1'|'scope2'|'scope3'|'sinks'|'engagement',
//       timeHorizonYears: 1|3|5,
//       regulatoryDriver?: string,                          // e.g. "NH SB-123 disclosure"
//       grossMt: number,                                    // current gross emissions
//       sinksMt: number,                                    // current annual sequestration
//       enrollment: number,
//       notes?: string
//     },
//     history?: {
//       completed: [{ id, title, when, mtSaved? }],
//       declined:  [{ id, title, reason? }]
//     }
//   }
//
// Response:
//   {
//     mode: 'llm'|'rule',
//     summary: string,
//     plan: [{
//       id, title, why, expectedMtPerYear, estimatedCostUsd,
//       ownerRole, timeline, category, difficulty, paybackYears,
//       dataSource,        // where the mt and $ benchmarks come from
//       provenance         // 'measured' | 'cited' | 'estimated'
//     }],
//     totalExpectedMtPerYear: number,
//     percentOfGross: number,
//     generatedAt: ISO,
//     nextCheckInDays: 90
//   }
//
// The agent re-runs every time it's called with updated context +
// history. It excludes completed/declined items, recalibrates priorities
// when the institutional context changes (new fiscal year, capital
// appetite shifted, regulatory deadline appeared), and surfaces the
// next-best whole-school lever.

import { createRateLimit, getClientKey } from '../../src/utils/rateLimit.js';
import { verifyAdminRequest } from '../../src/utils/adminToken.js';

const limiter = createRateLimit({ capacity: 8, refillPerSec: 0.1 });

function readEnv(key) {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return undefined;
}

const SYSTEM_PROMPT = `You are KUA's institutional carbon-strategy planner. You generate detailed prioritized decarbonization plans for the school's leadership (Head of School, Sustainability Committee, Board of Trustees, Facilities Director, Dining Services).

KUA is a 340-student boarding secondary school in Plainfield/Meriden NH (climate zone 6A, ~7,500 HDD), 19 buildings totaling ~290K sqft (11 dorms ~105K, 3 academic ~78K, 3 athletic ~98K, 2 other ~10K). Heating dominates Scope 1 (~1,350 mt central, range 891–1,867 — from ~111K gal heating oil + ~19K gal propane); the school is on the ISO-NE grid for Scope 2 (~385 mt measured ±5%); Scope 3 (~2,635 mt central, range 1,726–3,720) is led by purchased goods (EEIO Cat 1 ~1,315) followed by student travel ~760 (East-Asia-heavy international + Northeast US boarders × 3-4 RTs/yr), dining ~235, upstream fuel ~230. ~1,000 acres of campus forest sequester ~2,650 mt/yr (range 2,100–2,650 across Birdsey 1992 / NH FIA / Nowak 2013).

KUA peer benchmarks (use as comparison anchors when relevant — do NOT cite specific dollar figures or page numbers as fact, just reference the program name):
- Phillips Academy Andover: 100% renewable electricity via PPA + Boston-area heat-pump pilot in classroom buildings.
- Phillips Exeter Academy: Geothermal field under the playing fields (Phelps Science Center conversion); composting program with >70% diversion.
- Hotchkiss School: Biomass-fueled heating plant (wood chips from regional supply) — replaced fuel oil in 2012, signature decarbonization move.
- St. Paul's School (NH): Has set a "carbon neutral by 2030" pledge; uses Renewable Energy Credits + on-site solar; published an annual sustainability dashboard public-facing.
- Loomis Chaffee: Plant-rich dining shift (Sodexo collaboration), Solar PV + LEED platinum dorm renovations.
- Deerfield Academy: Multi-MW solar field; geothermal in newer dorm builds.
- Northfield Mount Hermon: Biomass + extensive on-site woodlot management as legitimate sink.
- These are NESCAC/Eight Schools comparisons — the board cares about peer positioning.

Plan-building principles:
1. Match the dominant emissions cluster to the leverage that's both biggest and feasible NOW. Don't over-index on Scope 1 if capital appetite is low; surface a feasibility-study stepping stone instead.
2. Honor measurement gaps. If a scope is still "estimated" (not yet flipped to measured), one of your top items should be "instrument the data path" so future plans can be calibrated against real numbers, not bottom-up modeling.
3. Include at least one no-cost or low-cost behavioral item every cycle — momentum matters.
4. Include at least one capital-heavy multi-year item even at "low" capital appetite — as a feasibility study deliverable, not a green-light. Boards appreciate seeing the long-arc options.
5. For dominant-Scope-3 cohorts, recommend cohort-specific levers (e.g. "international" → travel offsetting + bundle flights; "day students" → carpool incentives; "US boarders" → bus-share for break trips).

Output STRICT JSON only — no prose before or after — matching this shape exactly:
{
  "summary": "3-5 sentence framing of why this plan fits the current fiscal context, what the dominant lever cluster is, and how the next 12 months hand off to the years 2-5",
  "plan": [
    {
      "id": "p1",
      "title": "...",
      "why": "2-4 sentences. Memo-to-Sustainability-Committee voice. Specific to KUA's context.",
      "expectedMtPerYear": 0,
      "estimatedCostUsd": 0,
      "ownerRole": "Facilities Director|Dining Services Director|Head of School|Board of Trustees|Sustainability Committee|Director of Operations|Travel Office",
      "timeline": "this-quarter|this-year|this-3-years",
      "category": "scope1|scope2|scope3|sinks|engagement",
      "difficulty": "easy|medium|hard",
      "paybackYears": 0,
      "firstSteps": ["3-5 short concrete actions, each starting with a verb. Examples: 'Pull last 24 months of heating-oil delivery invoices from Facilities', 'Survey current T8 fluorescent count by building'."],
      "dependencies": "What must be in place before this can start. 1-2 sentences. Use 'none' if no blockers.",
      "yearByYearMt": [0, 15, 45, 60, 60, 60],
      // ^ Array of length 1-6 (one entry per year over the planning
      // horizon). Models the realistic ramp: heat-pump conversion
      // hits steady-state by Y3; LED retrofits land mostly in Y1;
      // behavioral campaigns hit immediately. Each value is annual
      // mt for that year. The LAST value should equal expectedMtPerYear
      // (the steady-state). Use a smooth ramp, not a step function.
      "milestones": ["2-4 dated checkpoints to verify the plan is on track. Each: 'YYYY-Qn: <observable outcome>'."],
      "risks": ["1-3 short failure modes specific to KUA. Each is a single sentence."],
      "kpis": ["1-3 measurable success metrics. Each: 'metric_name (unit): target'."],
      "dataSource": "Cite the type of source the mt + $ benchmarks come from. Examples: 'Project Drawdown plant-rich diets', 'NREL PVWatts simulation for NH', 'EPA WARM model v15.1', 'NEEP cold-climate heat-pump performance data', 'GHG Protocol Scope 3 Cat 7 + ICCT fuel economy', 'EPA ENERGY STAR commercial LED savings'. Do NOT fabricate specific page numbers or precise paper titles.",
      "provenance": "measured | cited | estimated. Use 'measured' ONLY if the mt comes from a real KUA meter or invoice (BMS, fuel deliveries, utility bills). Use 'cited' if the methodology is published (EPA, IPCC, NREL, Drawdown) AND the input quantities are reasonable for KUA. Use 'estimated' if either the input quantity (acreage, fuel use, fleet miles) or the resulting mt is your best-effort guess that needs replacement with measured data. When in doubt, use 'estimated' — never inflate confidence."
    }
  ]
}

Rules:
1. The plan must be 8–12 items, ordered by priority. Priority = (mtCO2e/yr) × (capital-appetite-fit) × (board-political-feasibility). Don't put $1M heat-pump retrofits at #1 if capitalAppetite is 'low'.
2. expectedMtPerYear is WHOLE-SCHOOL annual mt CO2e (not kg, not per-student). Anchor to these benchmarks:
   - Heating-oil to heat-pump conversion (whole campus): 600-900 mt/yr, ~$3-5M, 12-15 yr payback
   - Single-building boiler upgrade (one dorm/academic): 30-60 mt/yr, ~$200-400K, 8-12 yr
   - 60 kW Phase-2 solar (one rooftop): 6-8 mt/yr, ~$150-200K, 8-10 yr
   - LED retrofit (full campus): 6-10 mt/yr, ~$80-120K, 4-6 yr
   - HVAC schedule optimization (auto-shutoff after hours): 9-15 mt/yr, ~$10-30K, <1 yr
   - Dorm winter setpoint reduction 2°F: 15-22 mt/yr, no cost, immediate
   - 20% beef cut in dining services: 50-60 mt/yr, no cost (menu change), immediate
   - Compost expansion to all stations: 4-6 mt/yr, ~$15-30K/yr opex, immediate
   - Faculty/staff commute incentive policy: 25-35 mt/yr, ~$40-80K/yr opex
   - International student travel offset purchase: 100-200 mt/yr offset, ~$15-30/mt
3. ownerRole must be a real KUA role from the enum. No invented roles.
4. paybackYears = estimatedCostUsd ÷ (expectedMtPerYear × $200/mt social cost) for capital projects, or "0" for no-cost / opex levers. The model can use other reasonable cost-of-carbon assumptions.
5. Honor history: never propose a completed item again. Never propose a declined item again. The "why" line must reflect the current context — if topPriority is 'scope1' and the item is scope2, explain why it's still on the list (lower-effort, faster payback, bridge action).
6. No filler. Every item must have realistic mt + $ numbers that justify the priority order.
7. The "why" line is 1-3 sentences, reads like a memo to the Sustainability Committee — specific to KUA's context (mention the fuel mix, climate, enrollment, forest, budget appetite where relevant).`;

function buildUserMessage(context, history, measuredState) {
  const lines = [
    'KUA institutional context:',
    `- Fiscal year: ${context.fiscalYear || 'unspecified'}`,
    `- Capital appetite (board): ${context.capitalAppetite}`,
    `- Top priority area: ${context.topPriority}`,
    `- Planning horizon: ${context.timeHorizonYears} year(s)`,
    `- Current gross emissions: ${context.grossMt} mtCO2e/yr`,
    `- Current annual sequestration: ${context.sinksMt} mtCO2e/yr`,
    `- Enrollment: ${context.enrollment} students`,
  ];
  if (context.regulatoryDriver) lines.push(`- Regulatory driver: ${context.regulatoryDriver}`);
  if (context.notes)            lines.push(`- Notes from leadership: "${context.notes}"`);

  // Phase 93: measurement state. Tells the agent which scope rows
  // are already measured (so it doesn't propose "instrument that")
  // and which are still on the bottom-up cross-check (so it CAN).
  if (measuredState) {
    lines.push('', 'Measurement state per scope (use this to recommend instrumentation gaps as plan items):');
    lines.push(`- Scope 1: ${measuredState.scope1Measured ? 'MEASURED (live from admin tables)' : 'still on bottom-up cross-check — propose data instrumentation'}`);
    lines.push(`- Scope 2: MEASURED (BMS) — no instrumentation work needed`);
    lines.push(`- Scope 3: ${measuredState.scope3Measured ? 'MEASURED (live from 8 admin tables)' : 'still on bottom-up cross-check — propose data instrumentation'}`);
    lines.push(`- Sinks: ${measuredState.sinksMeasured ? 'MEASURED (forest_stand_actuals)' : 'placeholder forest inventory — propose USFS FIA-style walk-through'}`);
    if (Array.isArray(measuredState.scope3CohortDetail) && measuredState.scope3CohortDetail.length > 0) {
      lines.push('', 'Scope 3 cohort breakdown (use this to target the dominant cohort):');
      for (const c of measuredState.scope3CohortDetail) {
        const provTag = c.provenance === 'measured' ? '✓ measured' : 'estimated';
        lines.push(`  · ${c.label}: ${c.mt} mt (${c.count} records, ${provTag})`);
      }
    }
  }
  if (history && (history.completed?.length || history.declined?.length)) {
    lines.push('', 'Plan history:');
    if (history.completed?.length) {
      lines.push(`- Completed: ${history.completed.map((c) => {
        const actual = c.mtSaved;
        const expected = c.expectedMt;
        let tag = '';
        if (typeof actual === 'number' && typeof expected === 'number' && expected > 0) {
          const pct = Math.round(((actual - expected) / expected) * 100);
          tag = ` (-${Math.round(actual)} mt actual; est ${Math.round(expected)}, ${pct >= 0 ? '+' : ''}${pct}%)`;
        } else if (typeof actual === 'number') {
          tag = ` (-${Math.round(actual)} mt/yr)`;
        }
        return c.title + tag;
      }).join('; ')}`);
    }
    if (history.declined?.length) {
      lines.push(`- Declined / vetoed: ${history.declined.map((d) => d.title + (d.reason ? ` — ${d.reason}` : '')).join('; ')}`);
    }
    lines.push('Generate a NEW 8-12 step plan that excludes completed and declined items. Priorities should reflect what\'s left, not the original full slate. Each item carries firstSteps, dependencies, milestones, risks, and kpis as documented in the schema.');
  } else {
    lines.push('', 'No prior plan history. Generate the highest-impact 8-12 starting institutional levers for this fiscal year. Each item carries firstSteps, dependencies, milestones, risks, and kpis as documented in the schema.');
  }
  return lines.join('\n');
}

// Each rule includes a `source` and `provenance` so the page can show
// where the mt + $ benchmarks came from AND how confident we are.
// Provenance:
//   'cited'     = published methodology (EPA, IPCC, NREL, Drawdown, etc.)
//                 applied to reasonable KUA inputs.
//   'estimated' = the methodology may be cited but the KUA-specific
//                 input quantities are best-effort placeholders that need
//                 replacement with measured data (fuel deliveries,
//                 fixture counts, fleet miles, etc.).
// Almost everything in this library is 'estimated' — these benchmarks
// are sized to KUA without measured inventories of the specific systems
// (Miller Hall boiler load, Whittemore HVAC schedule, T8 fixture count,
// international student travel mileage, faculty commute distances).
const RULE_LIBRARY = [
  { id: 'r_dorm_thermo',     title: 'Lower dorm winter setpoint from 70°F to 68°F',                          mt: 18,   cost:    0, owner: 'Facilities Director',     timeline: 'this-quarter',  category: 'scope1', difficulty: 'easy',   payback: 0,  forApp: ['low','medium','high'], forPriority: ['scope1','engagement'],         source: 'EIA RECS heating demand × 1°F = ~3% rule + KUA dorm heating-oil load',                                                       provenance: 'estimated' },
  { id: 'r_beef_cut20',      title: 'Reduce beef portions 20% in dining services menu',                      mt: 56,   cost:    0, owner: 'Dining Services Director', timeline: 'this-quarter',  category: 'scope3', difficulty: 'easy',   payback: 0,  forApp: ['low','medium','high'], forPriority: ['scope3','engagement'],         source: 'Project Drawdown plant-rich diets + FAO LEAP per-meal beef GHG factors',                                                    provenance: 'estimated' },
  { id: 'r_lowcarbon_label', title: 'Print kg CO₂e per serving on dining menu cards',                        mt: 8,    cost: 5000, owner: 'Dining Services Director', timeline: 'this-quarter',  category: 'engagement', difficulty: 'easy', payback: 1, forApp: ['low','medium','high'], forPriority: ['scope3','engagement'],          source: 'Behavioral-economics studies of menu carbon labels (typical 8–14% beef substitution)',                                       provenance: 'estimated' },
  { id: 'r_compost_expand',  title: 'Expand compost collection to all dining stations',                      mt: 4,    cost:25000, owner: 'Dining Services Director', timeline: 'this-year',     category: 'scope3', difficulty: 'medium', payback: 30, forApp: ['medium','high'],       forPriority: ['scope3'],                       source: 'EPA WARM model v15.1 — landfill methane avoided per ton diverted',                                                          provenance: 'estimated' },
  { id: 'r_commute_policy',  title: 'Adopt a faculty/staff commute incentive policy',                        mt: 28,   cost:60000, owner: 'Director of Operations',   timeline: 'this-year',     category: 'scope3', difficulty: 'medium', payback: 11, forApp: ['medium','high'],       forPriority: ['scope3','engagement'],          source: 'GHG Protocol Scope 3 Cat 7 commuting + ICCT US fleet fuel-economy data, KUA staff = 52',                                     provenance: 'estimated' },
  { id: 'r_gym_hvac_after9', title: 'Auto-shutoff Whittemore HVAC after 9 PM',                               mt: 9,    cost:15000, owner: 'Facilities Director',     timeline: 'this-quarter',  category: 'scope2', difficulty: 'easy',   payback: 8,  forApp: ['low','medium','high'], forPriority: ['scope2','scope1'],              source: 'ASHRAE 90.1 unoccupied schedules + KUA Whittemore submeter (Eclypse BMS)',                                                  provenance: 'estimated' },
  { id: 'r_led_retrofit',    title: 'Replace remaining T8 fluorescent lighting with LEDs',                   mt: 7,    cost:100000,owner: 'Facilities Director',     timeline: 'this-year',     category: 'scope2', difficulty: 'medium', payback: 71, forApp: ['medium','high'],       forPriority: ['scope2'],                       source: 'EPA ENERGY STAR commercial LED retrofit savings + KUA fixture inventory',                                                   provenance: 'estimated' },
  { id: 'r_int_student_offset',title: 'Voluntary travel offset program for international students',          mt: 150,  cost: 4500, owner: 'Travel Office',            timeline: 'this-year',     category: 'scope3', difficulty: 'easy',   payback: 0,  forApp: ['low','medium','high'], forPriority: ['scope3'],                       source: 'ICAO carbon calculator × KUA international roster + Gold Standard offset prices ($25–35/mt)',                                provenance: 'estimated' },
  { id: 'r_solar_phase2',    title: 'Approve Phase-2 solar — 60 kW Miller rooftop array',                    mt: 6,    cost:175000,owner: 'Board of Trustees',        timeline: 'this-year',     category: 'scope2', difficulty: 'hard',   payback: 145,forApp: ['medium','high'],       forPriority: ['scope2','engagement'],          source: 'NREL PVWatts simulation for KUA latitude 43.6°N + ISO-NE 2024 grid offset',                                                 provenance: 'cited' },
  { id: 'r_oil_to_heatpump', title: 'Heating-oil to heat-pump conversion — start feasibility study',         mt: 800,  cost:300000,owner: 'Board of Trustees',        timeline: 'this-3-years',  category: 'scope1', difficulty: 'hard',   payback: 2,  forApp: ['high'],                forPriority: ['scope1'],                       source: 'NEEP cold-climate heat-pump performance data + RMI residential CCHP load modeling for NH',                                  provenance: 'estimated' },
  { id: 'r_carbon_budget',   title: 'Propose 2027-2028 institutional carbon budget to the Board',            mt: 0,    cost:    0, owner: 'Head of School',           timeline: 'this-quarter',  category: 'engagement', difficulty: 'medium', payback: 0,  forApp: ['low','medium','high'], forPriority: ['engagement','scope1','scope2','scope3'], source: 'GHG Protocol Corporate Standard — institutional-target framing (engagement, no direct mt)',                                  provenance: 'cited' },
  { id: 'r_no_single_use',   title: 'Adopt a no-single-use-plastics policy in dining + events',              mt: 5,    cost:10000, owner: 'Director of Operations',   timeline: 'this-year',     category: 'scope3', difficulty: 'medium', payback: 4,  forApp: ['medium','high'],       forPriority: ['scope3','engagement'],          source: 'EPA WARM v15.1 + Ellen MacArthur Foundation single-use plastics LCA',                                                       provenance: 'estimated' },
  { id: 'r_procurement_std', title: 'Adopt a sustainable IT procurement standard',                           mt: 6,    cost: 5000, owner: 'Director of Operations',   timeline: 'this-year',     category: 'scope3', difficulty: 'medium', payback: 4,  forApp: ['low','medium','high'], forPriority: ['scope3'],                       source: 'EPEAT criteria + Microsoft + Google published device lifecycle emissions',                                                  provenance: 'estimated' },
  { id: 'r_miller_boiler',   title: 'Replace Miller Hall boiler with high-efficiency condensing unit',       mt: 45,   cost:380000,owner: 'Facilities Director',     timeline: 'this-3-years',  category: 'scope1', difficulty: 'hard',   payback: 42, forApp: ['medium','high'],       forPriority: ['scope1'],                       source: 'DOE high-efficiency condensing-boiler benchmarks + KUA fuel-delivery records',                                              provenance: 'estimated' },
  { id: 'r_forest_easement', title: 'Place permanent conservation easement on 1,000 acres of campus forest', mt: 0,    cost:25000, owner: 'Board of Trustees',        timeline: 'this-year',     category: 'sinks', difficulty: 'medium', payback: 0,  forApp: ['low','medium','high'], forPriority: ['sinks','engagement'],           source: 'USFS Forest Inventory & Analysis — protects existing 2,650 mt/yr sink (no new mt added)',                                   provenance: 'cited' },
  { id: 'r_recs',            title: 'Buy NH-class-1 RECs to cover 100% of remaining grid scope-2',           mt: 385,  cost:115000,owner: 'Director of Operations',   timeline: 'this-year',     category: 'scope2', difficulty: 'easy',   payback: 0,  forApp: ['low','medium','high'], forPriority: ['scope2','engagement'],          source: 'NEPOOL GIS REC market price (~$70/MWh) × KUA annualized scope-2 kWh (~1.64M kWh × $0.07 ≈ $115K/yr)',                          provenance: 'cited' },
];

function ruleBasedPlan(context, history) {
  const completedIds = new Set((history?.completed ?? []).map((c) => c.id));
  const declinedIds  = new Set((history?.declined ?? []).map((d) => d.id));
  const candidates = RULE_LIBRARY.filter((r) => {
    if (completedIds.has(r.id) || declinedIds.has(r.id)) return false;
    if (!r.forApp.includes(context.capitalAppetite)) return false;
    if (!r.forPriority.includes(context.topPriority)) return false;
    return true;
  });
  // Score: mt impact, with bonus weight for matched top priority and
  // penalty for items beyond the time horizon.
  const horizon = context.timeHorizonYears || 3;
  const scored = candidates.map((r) => {
    let score = r.mt;
    if (r.category === context.topPriority) score *= 1.4;
    if (r.timeline === 'this-3-years' && horizon < 3) score *= 0.5;
    if (r.timeline === 'this-year' && horizon < 1)    score *= 0.3;
    return { rule: r, score };
  }).sort((a, b) => b.score - a.score);
  // Take more top-scored items than before so the rule-mode fallback
  // also produces an 8-12 item plan (was 5+1 = 7 before).
  const top = scored.slice(0, 10).map((s) => s.rule);
  // Always include at least one no-cost quick-win for momentum.
  const quickWin = candidates.find((c) => c.cost === 0 && !top.includes(c));
  const final = (quickWin ? [...top, quickWin] : top).slice(0, 12).map((r, i) => ({
    id: `p${i + 1}`,
    title: r.title,
    why: ruleWhy(r, context),
    expectedMtPerYear: r.mt,
    estimatedCostUsd:  r.cost,
    ownerRole:         r.owner,
    timeline:          r.timeline,
    category:          r.category,
    difficulty:        r.difficulty,
    paybackYears:      r.payback,
    // Rule-based fallback doesn't have hand-curated detail fields
    // for every rule — empty arrays signal "no detail" to the UI,
    // which skips the matching DetailBlock cleanly.
    firstSteps:        [],
    dependencies:      '',
    milestones:        [],
    risks:             [],
    kpis:              [],
    yearByYearMt:      r.timeline === 'this-quarter' ? [r.mt, r.mt, r.mt]
                      : r.timeline === 'this-year'    ? [r.mt * 0.5, r.mt, r.mt]
                      : [r.mt * 0.2, r.mt * 0.6, r.mt, r.mt],
    dataSource:        r.source,
    provenance:        r.provenance || 'estimated',
  }));
  return final;
}

function ruleWhy(rule, context) {
  const matchesPriority = rule.category === context.topPriority;
  const noCost = rule.cost === 0;
  const lowApp = context.capitalAppetite === 'low';
  if (matchesPriority && noCost) return `Aligns with your ${context.topPriority} priority and is no-cost — operational change only, can ship this fiscal year without a capital request.`;
  if (matchesPriority)            return `Direct hit on your ${context.topPriority} priority. Cost ($${rule.cost.toLocaleString()}) is appropriate for ${context.capitalAppetite} capital appetite.`;
  if (noCost)                     return `Off your top priority but no-cost — easy momentum lever, frees up next year's capital window for the bigger ${context.topPriority} project.`;
  if (lowApp && rule.cost > 100000) return `Capital-heavy — surfaced for awareness only; recommend feasibility study this fiscal year, decision next.`;
  return `Bridge lever between your ${context.topPriority} priority and this category — included for portfolio balance.`;
}

function summaryFromContext(context) {
  return `Plan for ${context.fiscalYear || 'next fiscal'} prioritizing ${context.topPriority} with ${context.capitalAppetite} capital appetite over a ${context.timeHorizonYears}-year horizon. Ordered highest-mt first, with at least one no-cost quick-win to ship in the first quarter.`;
}

function tryParseJson(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch { return null; }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const auth = verifyAdminRequest(req);
  if (!auth.valid) {
    res.status(401).json({ error: `admin auth required: ${auth.reason}` });
    return;
  }
  const { context, history, measuredState } = req.body || {};
  if (!context || typeof context !== 'object') {
    res.status(400).json({ error: 'context (object) is required' });
    return;
  }
  const required = ['capitalAppetite', 'topPriority', 'timeHorizonYears', 'grossMt', 'sinksMt', 'enrollment'];
  for (const k of required) {
    if (context[k] === undefined || context[k] === null || context[k] === '') {
      res.status(400).json({ error: `context.${k} is required` });
      return;
    }
  }

  const limit = limiter.consume(getClientKey(req));
  if (!limit.allowed) {
    if (typeof res.setHeader === 'function') {
      res.setHeader('Retry-After', String(Math.ceil(limit.retryAfterMs / 1000)));
    }
    res.status(429).json({ error: 'Too many requests', retryAfterMs: limit.retryAfterMs });
    return;
  }

  const apiKey = readEnv('ANTHROPIC_API_KEY');

  const fallback = () => {
    const plan = ruleBasedPlan(context, history);
    const totalExpectedMtPerYear = plan.reduce((s, p) => s + (p.expectedMtPerYear || 0), 0);
    res.status(200).json({
      mode: 'rule',
      summary: summaryFromContext(context),
      plan,
      totalExpectedMtPerYear,
      percentOfGross: context.grossMt > 0 ? (totalExpectedMtPerYear / context.grossMt) * 100 : 0,
      generatedAt: new Date().toISOString(),
      nextCheckInDays: 90,
    });
  };

  if (!apiKey) { fallback(); return; }

  try {
    const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        // Phase 93: upgrade plan generation to Opus 4.7. The plan
        // endpoint produces the most-load-bearing output in the app
        // (8-12 detailed items × 5 detail blocks each = ~40 distinct
        // structured fields) and the extra capability pays for itself
        // on coherent multi-item prioritization + KUA-specific
        // tailoring. Other endpoints (memo, chat, ingestion) stay on
        // Sonnet — those are narrower tasks where Sonnet matches.
        model: 'claude-opus-4-7',
        max_tokens: 8000,
        // Phase 109: prompt caching on the stable system prompt.
        // It's a ~3 KB anchor (KUA fingerprint + peer benchmarks +
        // bench library + 5 plan-building principles) that stays
        // constant across calls. Ephemeral cache means subsequent
        // calls within the cache TTL (~5 min) hit the cached prefix
        // — ~90% cost reduction + measurable latency drop on the
        // typical admin workflow (generate → regenerate after
        // tweaking context → generate alternatives → ...).
        system: [
          { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
        ],
        messages: [
          { role: 'user', content: buildUserMessage(context, history, measuredState) },
        ],
      }),
    });

    if (!apiRes.ok) {
      let detail = '';
      try {
        const body = await apiRes.json();
        detail = body?.error?.message || body?.message || JSON.stringify(body);
      } catch {
        try { detail = await apiRes.text(); } catch {}
      }
      throw new Error(`Anthropic API ${apiRes.status}${detail ? ` — ${detail}` : ''}`);
    }
    const json = await apiRes.json();
    const text = (json.content || [])
      .filter((c) => c.type === 'text')
      .map((c) => c.text)
      .join('\n\n');

    const parsed = tryParseJson(text);
    if (!parsed || !Array.isArray(parsed.plan) || parsed.plan.length === 0) {
      fallback();
      return;
    }

    // Truncate arbitrary string arrays to keep response compact +
    // bound each item's payload (so the planner can't inflate one step
    // at the cost of the others).
    const cleanArr = (a, maxLen, maxItems) => Array.isArray(a)
      ? a.slice(0, maxItems).map((s) => String(s || '').slice(0, maxLen)).filter(Boolean)
      : [];

    const plan = parsed.plan.slice(0, 12).map((p, i) => ({
      id:                p.id || `p${i + 1}`,
      title:             String(p.title || '').slice(0, 140),
      why:               String(p.why || '').slice(0, 800),
      expectedMtPerYear: Number(p.expectedMtPerYear) || 0,
      estimatedCostUsd:  Number(p.estimatedCostUsd) || 0,
      ownerRole:         String(p.ownerRole || 'Sustainability Committee').slice(0, 60),
      timeline:          ['this-quarter','this-year','this-3-years'].includes(p.timeline) ? p.timeline : 'this-year',
      category:          ['scope1','scope2','scope3','sinks','engagement'].includes(p.category) ? p.category : 'scope1',
      difficulty:        ['easy','medium','hard'].includes(p.difficulty) ? p.difficulty : 'medium',
      paybackYears:      Number(p.paybackYears) || 0,
      // New detailed fields. Each is a string array (firstSteps,
      // milestones, risks, kpis) or a short prose string (dependencies).
      firstSteps:        cleanArr(p.firstSteps, 200, 5),
      dependencies:      String(p.dependencies || '').slice(0, 280),
      // yearByYearMt: cap at 6 entries (typical max horizon). Coerce
      // non-numeric to 0. If the agent didn't emit it, build a
      // sensible default — step from 0 to steady-state at Y2 for
      // "this-year" / "this-3-years"; immediate for "this-quarter".
      yearByYearMt: (() => {
        const steady = Number(p.expectedMtPerYear) || 0;
        if (Array.isArray(p.yearByYearMt) && p.yearByYearMt.length > 0) {
          return p.yearByYearMt.slice(0, 6).map((v) => Math.max(0, Number(v) || 0));
        }
        if (p.timeline === 'this-quarter') return [steady, steady, steady];
        if (p.timeline === 'this-year')    return [steady * 0.5, steady, steady];
        return [steady * 0.2, steady * 0.6, steady, steady]; // 3-year ramp
      })(),
      milestones:        cleanArr(p.milestones, 200, 4),
      risks:             cleanArr(p.risks, 200, 3),
      kpis:              cleanArr(p.kpis, 140, 3),
      dataSource:        String(p.dataSource || 'AI estimate (no specific source provided)').slice(0, 280),
      provenance:        ['measured','cited','estimated'].includes(p.provenance) ? p.provenance : 'estimated',
    }));

    const totalExpectedMtPerYear = plan.reduce((s, p) => s + p.expectedMtPerYear, 0);
    res.status(200).json({
      mode: 'llm',
      summary: String(parsed.summary || summaryFromContext(context)).slice(0, 500),
      plan,
      totalExpectedMtPerYear,
      percentOfGross: context.grossMt > 0 ? (totalExpectedMtPerYear / context.grossMt) * 100 : 0,
      generatedAt: new Date().toISOString(),
      nextCheckInDays: 90,
    });
  } catch (err) {
    if (typeof res.setHeader === 'function') {
      res.setHeader('X-Llm-Fallback-Reason', String(err.message).slice(0, 200));
    }
    fallback();
  }
}
