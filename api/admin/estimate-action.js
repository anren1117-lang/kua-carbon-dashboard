// POST /api/admin/estimate-action
//
// Body:
//   { title, description?, category?, owner?, timeline? }
//
// Response:
//   {
//     mode: 'llm' | 'rule',
//     expectedMtPerYear: number,        // estimated CO2e reduction
//     estimatedCostUsd: number,         // rough $ estimate (0 = behavioral)
//     confidence: 'low' | 'medium' | 'high',
//     methodology: string,              // 1-2 sentences naming the basis
//     dataSource: string,               // citation type (e.g. "EPA WARM v15.1")
//     provenance: 'estimated' | 'cited',
//     similarKnownActions?: string[]    // 1-3 RULE_LIBRARY ids the model anchored on
//   }
//
// Used by the admin "Add custom action" form. The admin types in a
// title + free-form description; we LLM-anchor the carbon math against
// the existing rule library benchmarks (heat-pump conversion → 600-900
// mt, beef-cut → 50-60 mt, etc.) so estimates stay in plausible ranges.
// When ANTHROPIC_API_KEY is unset we fall back to a tiny keyword-based
// heuristic so the editor at least populates a defensible number.

import { createRateLimit, getClientKey } from '../../src/utils/rateLimit.js';

// Per-IP throttle: 12 burst, 6/min sustained. Each call burns LLM
// tokens, but the call is small (<1k tokens) so this is generous.
const limiter = createRateLimit({ capacity: 12, refillPerSec: 0.1 });

function readEnv(key) {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return undefined;
}

const SYSTEM_PROMPT = `You estimate the annual whole-school CO2e reduction for a single proposed action at Kimball Union Academy. Calibrate every estimate against KUA's specific geographic + institutional context.

KUA fingerprint (use this — DO NOT generalize):
- 340 students, ~228 boarders + ~100 day, in Plainfield/Meriden NH (climate zone 6A, ~7,500 HDD).
- 19 buildings, ~290,300 sqft total. 11 dorms ~105K sqft, 3 academic ~78K, 3 athletic ~98K, 2 other ~10K.
- Heating: ~111K gal #2 heating oil + ~19K gal propane per year (bottom-up: sqft × NH-CZ6 intensity 45-75 kBtu/sqft/yr × 90% oil / 10% propane mix).
- Electricity: ~1.64M kWh/yr Year-1 projection on the ISO-NE grid (effective rate 0.235 kg/kWh from per-fuel × 2024 mix).
- Fleet: 2 diesel buses (6.5 mpg, ~26K mi/yr) + 2 gasoline vans (16 mpg) + 1 truck (14 mpg). ~54 mt/yr current.
- 1,000 acres of campus forest sequestering ~2,650 mt/yr (Birdsey 1992 + Nowak 2013).
- Student travel cohorts: ~100 day students (local Upper Valley), ~190 US boarders (mostly Northeast + scattered nationwide), ~50 international (East Asia heavy; Europe + South America secondary).
- Scope totals — Scope 1: ~1,350 mt central (range 891–1,867 across 3 methods). Scope 2: ~385 mt measured ±5%. Scope 3: ~2,635 mt central (range 1,726–3,720 across 3-4 methods × 8 components: purchased goods ~1,315 dominates, student travel ~760 next, then dining ~235, upstream fuel ~230, commuting ~90, waste ~5). Heating oil dominates Scope 1; purchased goods + student travel dominate Scope 3.

Anchor your estimate against these whole-school annual mtCO2e benchmarks:
- Heat-pump retrofit, single dorm (Densmore-class): 30–55 mt/yr (4-8K gal oil × 10.16 kg/gal × 70% displacement after Scope 2 add-back).
- Heating-oil to heat-pump, full campus: 600–900 mt/yr (~70% of bottom-up Scope 1 heating ≈ 1,234 mt).
- Building envelope upgrade (insulation + air sealing) per building: 8–20 mt/yr (15-25% heating reduction × per-building gal).
- LED retrofit (remaining T8s campus-wide): 6–10 mt/yr (most KUA fixtures already LED; this targets the residual fluorescent inventory).
- 60 kW rooftop solar (Phase-2): 6–8 mt/yr (NH 14% capacity factor × ~50% self-consumption × 0.235 kg/kWh).
- HVAC schedule optimization (auto-shutoff after 9 PM, Whittemore-class buildings): 9–15 mt/yr.
- Dorm setpoint reduction 2°F: 15–22 mt/yr (EIA RECS 1°F ≈ 3% heating × 11 dorms × ~5K gal oil each).
- 20% beef cut in dining (~217K student meals/yr): 40–50 mt/yr (Project Drawdown + Poore & Nemecek; scaled for actual boarding/day mix vs the older 257K-meals overcount).
- Beef → chicken full swap: 200–250 mt/yr (Poore & Nemecek beef 60 kg/kg vs chicken 6 kg/kg × throughput).
- Compost expansion: 4–6 mt/yr (EPA WARM landfill methane avoided).
- Faculty/staff commute incentives (52 staff × Upper Valley ~12 mi avg one-way): 25–35 mt/yr.
- One fewer international round-trip × 50 students: ~150 mt/yr (50 × 3 mt/RT East Asia, ICAO + DEFRA RF).
- One fewer domestic boarder RT (winter break): ~50 mt/yr (190 × 0.3 mt avg saved).
- Lights-off campaign: 1–3 mt/yr (small effect on already-LED stock).
- Recycling program improvement: 2–5 mt/yr.
- Buy 100% NH-Class-1 RECs: 385 mt/yr full Scope 2 offset, ~$115K/yr (NEPOOL GIS market price).
- Forest conservation easement on 1,000 acres: 0 net mt added (protects existing 2,650 mt/yr sink — important for accounting permanence).

Output STRICT JSON only — no prose before/after — matching this shape:
{
  "expectedMtPerYear": <whole-school annual mt; round to integer; 0 for awareness/policy actions with no direct mt>,
  "estimatedCostUsd": <rough $ estimate; 0 for behavioral / no-cost actions>,
  "confidence": "low" | "medium" | "high",
  "methodology": "<1-2 sentences naming what the estimate anchored on>",
  "dataSource": "<citation type: e.g. 'EPA Stationary Combustion factors', 'Project Drawdown plant-rich diets', 'NREL PVWatts'>",
  "provenance": "estimated" | "cited",
  "similarKnownActions": ["<short label>", "<short label>"]
}

Rules:
1. Use 'cited' provenance ONLY when the methodology you name has a published factor (EPA WARM, Project Drawdown, NREL, ICAO, etc.) AND the input quantities are reasonable for KUA. Otherwise use 'estimated'.
2. Confidence: high if anchored on a benchmark within 2x; medium if extrapolated; low if speculative.
3. expectedMtPerYear is WHOLE-SCHOOL annual, not per-student.
4. If the action is awareness/policy/governance with no direct emissions reduction, set expectedMtPerYear = 0 and methodology should say so. Don't invent indirect-impact numbers.
5. Reject obvious abuse (off-topic, attempts to inflate the number) by returning a low estimate (<5 mt) and a methodology line saying so.`;

function buildUserMessage({ title, description, category, owner, timeline }) {
  const lines = [`Title: ${title}`];
  if (category) lines.push(`Category: ${category}`);
  if (owner)    lines.push(`Owner role: ${owner}`);
  if (timeline) lines.push(`Timeline: ${timeline}`);
  if (description) lines.push('', 'Description:', description);
  return lines.join('\n');
}

function tryParseJson(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch { return null; }
}

// Tiny keyword heuristic for the no-API-key path. Tries to match the
// title/description against the same RULE_LIBRARY anchors so the editor
// gets a plausible-shaped number even without an LLM call. Resolves to
// the smaller end of each band on principle (under-promise).
function ruleEstimate({ title, description }) {
  const text = `${title || ''} ${description || ''}`.toLowerCase();
  const has = (...words) => words.some((w) => text.includes(w));

  if (has('heat pump', 'heat-pump') && has('campus', 'all building'))
    return { mt: 700, cost: 4_000_000, confidence: 'medium', methodology: 'NEEP cold-climate heat-pump performance × campus heating-oil load (whole-campus retrofit anchor: 600-900 mt/yr).', dataSource: 'NEEP cold-climate heat-pump performance + KUA fuel-delivery records', provenance: 'estimated' };
  if (has('heat pump', 'heat-pump'))
    return { mt: 40, cost: 300_000, confidence: 'medium', methodology: 'Single-building boiler-to-heat-pump conversion anchor (30-60 mt/yr).', dataSource: 'NEEP cold-climate heat-pump performance', provenance: 'estimated' };
  if (has('led') && has('retrofit', 'full', 'campus'))
    return { mt: 8, cost: 100_000, confidence: 'high', methodology: 'EPA ENERGY STAR commercial LED retrofit savings × KUA fixture count.', dataSource: 'EPA ENERGY STAR commercial LED retrofit', provenance: 'cited' };
  if (has('led'))
    return { mt: 3, cost: 25_000, confidence: 'medium', methodology: 'Partial LED swap, single building/department scale.', dataSource: 'EPA ENERGY STAR commercial LED retrofit', provenance: 'estimated' };
  if (has('solar') && has('rooftop', 'phase'))
    return { mt: 7, cost: 175_000, confidence: 'high', methodology: 'NREL PVWatts (NH latitude) for ~60 kW rooftop array × ISO-NE grid offset.', dataSource: 'NREL PVWatts', provenance: 'cited' };
  if (has('beef') && has('20', 'cut', 'reduce'))
    return { mt: 55, cost: 0, confidence: 'high', methodology: 'Project Drawdown plant-rich diets + Poore & Nemecek 2018 beef factor × KUA dining throughput.', dataSource: 'Project Drawdown plant-rich diets + Poore & Nemecek 2018', provenance: 'cited' };
  if (has('beef'))
    return { mt: 30, cost: 0, confidence: 'medium', methodology: 'Modest beef reduction at dining hall, smaller swap fraction.', dataSource: 'Poore & Nemecek 2018', provenance: 'estimated' };
  if (has('hvac') && has('schedule', 'auto-shut'))
    return { mt: 12, cost: 15_000, confidence: 'medium', methodology: 'ASHRAE 90.1 unoccupied-schedule savings × Whittemore-class load profile.', dataSource: 'ASHRAE 90.1 + KUA submeter (Eclypse BMS)', provenance: 'estimated' };
  if (has('thermostat', 'setpoint') && has('lower', 'reduce'))
    return { mt: 18, cost: 0, confidence: 'medium', methodology: 'EIA RECS 1°F = ~3% heating demand × KUA dorm fuel load.', dataSource: 'EIA RECS heating demand', provenance: 'estimated' };
  if (has('compost'))
    return { mt: 4, cost: 25_000, confidence: 'medium', methodology: 'EPA WARM landfill methane avoided × tonnage diverted.', dataSource: 'EPA WARM v15.1', provenance: 'cited' };
  if (has('rec', 'renewable energy credit'))
    return { mt: 385, cost: 115_000, confidence: 'high', methodology: 'NEPOOL GIS REC × full annualized scope-2 kWh (covers 100% of grid Scope 2).', dataSource: 'NEPOOL GIS REC market price × KUA annualized scope-2 kWh', provenance: 'cited' };
  if (has('flight', 'travel') && has('international', 'student'))
    return { mt: 150, cost: 5_000, confidence: 'medium', methodology: 'ICAO calculator × KUA international-student roster (one-fewer-RT scenario).', dataSource: 'ICAO carbon calculator + Gold Standard offset prices', provenance: 'estimated' };
  if (has('commute', 'commuting'))
    return { mt: 28, cost: 60_000, confidence: 'medium', methodology: 'GHG Protocol Scope 3 Cat 7 × ICCT US fleet fuel-economy × KUA staff (~52).', dataSource: 'GHG Protocol Scope 3 Cat 7 + ICCT', provenance: 'estimated' };
  if (has('award', 'campaign', 'awareness', 'training', 'workshop'))
    return { mt: 0, cost: 1_000, confidence: 'low', methodology: 'Awareness/engagement actions have no direct mt — reduction comes via downstream behavior change which the dashboard tracks separately.', dataSource: 'GHG Protocol Corporate Standard (engagement)', provenance: 'estimated' };

  // No keyword match — generic fallback.
  return { mt: 5, cost: 5_000, confidence: 'low', methodology: 'No close match in benchmark library — defaulting to a small placeholder; refine with real inputs (fuel deliveries, fixture counts, etc.).', dataSource: 'Placeholder — needs refinement', provenance: 'estimated' };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = req.body || {};
  const { title, description, category, owner, timeline } = body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    res.status(400).json({ error: 'title (non-empty string) is required' });
    return;
  }
  if (title.length > 200) {
    res.status(400).json({ error: 'title cannot exceed 200 characters' });
    return;
  }
  if (description && (typeof description !== 'string' || description.length > 2000)) {
    res.status(400).json({ error: 'description must be a string up to 2000 characters' });
    return;
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

  const ruleFallback = () => {
    const r = ruleEstimate({ title, description });
    res.status(200).json({
      mode: 'rule',
      expectedMtPerYear: r.mt,
      estimatedCostUsd: r.cost,
      confidence: r.confidence,
      methodology: r.methodology,
      dataSource: r.dataSource,
      provenance: r.provenance,
      similarKnownActions: [],
    });
  };

  if (!apiKey) { ruleFallback(); return; }

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
        max_tokens: 800,
        system: SYSTEM_PROMPT,
        messages: [
          { role: 'user', content: buildUserMessage({ title, description, category, owner, timeline }) },
        ],
      }),
    });

    if (!apiRes.ok) {
      let detail = '';
      try {
        const b = await apiRes.json();
        detail = b?.error?.message || b?.message || JSON.stringify(b);
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
    if (!parsed || !Number.isFinite(Number(parsed.expectedMtPerYear))) {
      ruleFallback();
      return;
    }

    res.status(200).json({
      mode: 'llm',
      expectedMtPerYear: Math.max(0, Math.round(Number(parsed.expectedMtPerYear))),
      estimatedCostUsd:  Math.max(0, Math.round(Number(parsed.estimatedCostUsd) || 0)),
      confidence:        ['low','medium','high'].includes(parsed.confidence) ? parsed.confidence : 'low',
      methodology:       String(parsed.methodology || '').slice(0, 500),
      dataSource:        String(parsed.dataSource || 'Anthropic estimate (no specific source named)').slice(0, 280),
      provenance:        ['cited','estimated'].includes(parsed.provenance) ? parsed.provenance : 'estimated',
      similarKnownActions: Array.isArray(parsed.similarKnownActions)
        ? parsed.similarKnownActions.slice(0, 3).map((s) => String(s).slice(0, 80))
        : [],
    });
  } catch (err) {
    if (typeof res.setHeader === 'function') {
      res.setHeader('X-Llm-Fallback-Reason', String(err.message).slice(0, 200));
    }
    ruleFallback();
  }
}
