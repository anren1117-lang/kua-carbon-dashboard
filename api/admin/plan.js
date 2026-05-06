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

const limiter = createRateLimit({ capacity: 8, refillPerSec: 0.1 });

function readEnv(key) {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return undefined;
}

const SYSTEM_PROMPT = `You are KUA's institutional carbon-strategy planner. You generate prioritized 5-7 step decarbonization plans for the school's leadership (Head of School, Sustainability Committee, Board of Trustees, Facilities Director, Dining Services).

KUA is a 340-student boarding secondary school in Plainfield/Meriden NH (climate zone 6A, ~7,500 HDD), 19 buildings totaling ~290K sqft (11 dorms ~105K, 3 academic ~78K, 3 athletic ~98K, 2 other ~10K). Heating dominates Scope 1 (bottom-up ~1,250 mt central, range 891–1,867 — from ~111K gal heating oil + ~19K gal propane); the school is on the ISO-NE grid for Scope 2 (~385 mt measured ±5%); Scope 3 (~2,635 mt central, range 1,726–3,720) is dominated by student travel (East-Asia-heavy international cohort + Northeast US boarders × 3-4 RTs/yr) + purchased goods + dining. ~1,000 acres of campus forest sequester ~2,650 mt/yr (range 2,100–2,650 across Birdsey 1992 / NH FIA / Nowak 2013).

Output STRICT JSON only — no prose before or after — matching this shape exactly:
{
  "summary": "2-3 sentence framing of why this plan fits the current fiscal context",
  "plan": [
    {
      "id": "p1",
      "title": "...",
      "why": "...",
      "expectedMtPerYear": 0,
      "estimatedCostUsd": 0,
      "ownerRole": "Facilities Director|Dining Services Director|Head of School|Board of Trustees|Sustainability Committee|Director of Operations|Travel Office",
      "timeline": "this-quarter|this-year|this-3-years",
      "category": "scope1|scope2|scope3|sinks|engagement",
      "difficulty": "easy|medium|hard",
      "paybackYears": 0,
      "dataSource": "Cite the type of source the mt + $ benchmarks come from. Examples: 'Project Drawdown plant-rich diets', 'NREL PVWatts simulation for NH', 'EPA WARM model v15.1', 'NEEP cold-climate heat-pump performance data', 'GHG Protocol Scope 3 Cat 7 + ICCT fuel economy', 'EPA ENERGY STAR commercial LED savings'. Do NOT fabricate specific page numbers or precise paper titles.",
      "provenance": "measured | cited | estimated. Use 'measured' ONLY if the mt comes from a real KUA meter or invoice (BMS, fuel deliveries, utility bills). Use 'cited' if the methodology is published (EPA, IPCC, NREL, Drawdown) AND the input quantities are reasonable for KUA. Use 'estimated' if either the input quantity (acreage, fuel use, fleet miles) or the resulting mt is your best-effort guess that needs replacement with measured data. When in doubt, use 'estimated' — never inflate confidence."
    }
  ]
}

Rules:
1. The plan must be 5–7 items, ordered by priority. Priority = (mtCO2e/yr) × (capital-appetite-fit) × (board-political-feasibility). Don't put $1M heat-pump retrofits at #1 if capitalAppetite is 'low'.
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

function buildUserMessage(context, history) {
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
  if (history && (history.completed?.length || history.declined?.length)) {
    lines.push('', 'Plan history:');
    if (history.completed?.length) {
      lines.push(`- Completed: ${history.completed.map((c) => c.title + (c.mtSaved ? ` (-${c.mtSaved} mt/yr)` : '')).join('; ')}`);
    }
    if (history.declined?.length) {
      lines.push(`- Declined / vetoed: ${history.declined.map((d) => d.title + (d.reason ? ` — ${d.reason}` : '')).join('; ')}`);
    }
    lines.push('Generate a NEW 5-7 step plan that excludes completed and declined items. Priorities should reflect what\'s left, not the original full slate.');
  } else {
    lines.push('', 'No prior plan history. Generate the highest-impact 5-7 starting institutional levers for this fiscal year.');
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
  const top = scored.slice(0, 5).map((s) => s.rule);
  // Always include at least one no-cost quick-win for momentum.
  const quickWin = candidates.find((c) => c.cost === 0 && !top.includes(c));
  const final = (quickWin ? [...top, quickWin] : top).slice(0, 7).map((r, i) => ({
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
  const { context, history } = req.body || {};
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
        model: 'claude-sonnet-4-6',
        max_tokens: 1800,
        system: SYSTEM_PROMPT,
        messages: [
          { role: 'user', content: buildUserMessage(context, history) },
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

    const plan = parsed.plan.slice(0, 7).map((p, i) => ({
      id:                p.id || `p${i + 1}`,
      title:             String(p.title || '').slice(0, 140),
      why:               String(p.why || '').slice(0, 500),
      expectedMtPerYear: Number(p.expectedMtPerYear) || 0,
      estimatedCostUsd:  Number(p.estimatedCostUsd) || 0,
      ownerRole:         String(p.ownerRole || 'Sustainability Committee').slice(0, 60),
      timeline:          ['this-quarter','this-year','this-3-years'].includes(p.timeline) ? p.timeline : 'this-year',
      category:          ['scope1','scope2','scope3','sinks','engagement'].includes(p.category) ? p.category : 'scope1',
      difficulty:        ['easy','medium','hard'].includes(p.difficulty) ? p.difficulty : 'medium',
      paybackYears:      Number(p.paybackYears) || 0,
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
