// POST /api/admin/plan-item-alternatives
//
// Body:
//   {
//     item:         <the plan item the admin wants to replace>,
//     context:      <institutional context>,
//     otherItems?:  <full plan.plan array — the agent should NOT propose
//                    duplicates of items already in the plan>,
//     reason?:      string — admin's reason for replacing (passed to LLM)
//   }
//
// Response (200):
//   {
//     mode: 'llm'|'unavailable',
//     alternatives: [{ id, title, why, expectedMtPerYear, estimatedCostUsd, ownerRole, timeline, category, difficulty, paybackYears, dataSource, provenance }],
//     generatedAt: ISO
//   }
//
// Lets the admin swap one plan item without re-running the whole
// plan endpoint. Useful for "I don't like the LED retrofit, what
// else can hit Scope 2?" or "Heat-pump conversion is too aggressive,
// what's the medium-confidence alternative?"

import { createRateLimit, getClientKey } from '../../src/utils/rateLimit.js';
import { verifyAdminRequest } from '../../src/utils/adminToken.js';
import { openSSE, streamAnthropicJson, tryParseJsonLoose } from '../../src/utils/anthropicStream.js';

const limiter = createRateLimit({ capacity: 6, refillPerSec: 0.15 });

function readEnv(key) {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return undefined;
}

const SYSTEM_PROMPT = `You are KUA's institutional carbon-strategy planner, generating alternative plan items.

KUA context: 340-student boarding secondary school in Plainfield/Meriden NH (CZ 6A, ~7,500 HDD). 19 buildings ~290K sqft. ~111K gal heating oil + ~19K gal propane/yr Scope 1, ~1.64M kWh/yr Scope 2, ~2,635 mt Scope 3 (purchased goods + travel dominant). ~1,000 acres of campus forest sequester ~2,650 mt/yr.

Your job: propose 2-3 alternative plan items that could REPLACE the one the admin is rejecting, while:
1. Staying in the same category (scope1/scope2/scope3/sinks/engagement) — admin is replacing a Scope X item; alternatives must also target Scope X. Don't switch categories.
2. Hitting roughly the same mt + $ band, OR — if the admin's reason says "too expensive" or "too aggressive" — propose smaller/cheaper alternatives; if they say "too small" / "too soft" propose bigger ones.
3. Not duplicating items already in the plan (the otherItems list).
4. Drawing from the same benchmark library the plan endpoint uses: heat-pump conversion (600-900 mt / $3-5M), single-building boiler upgrade (30-60 mt / $200-400K), 60 kW solar (6-8 mt / $150-200K), LED retrofit (6-10 mt / $80-120K), HVAC auto-shutoff (9-15 mt / $10-30K), dorm setpoint -2°F (15-22 mt / free), 20% beef cut (50-60 mt / free), compost expansion (4-6 mt / $15-30K), commute incentive (25-35 mt / $40-80K), international travel offset (100-200 mt / $15-30/mt), behavioral campaigns (5-20 mt / minimal cost), measurement instrumentation ($10-30K, enables future).

Output STRICT JSON only — no prose before or after — matching this shape:
{
  "alternatives": [
    {
      "id": "alt1",
      "title": "...",
      "why": "1-2 sentences calibrated to the admin's reason for rejecting the original.",
      "expectedMtPerYear": 0,
      "estimatedCostUsd": 0,
      "ownerRole": "Facilities Director|Dining Services Director|Head of School|Board of Trustees|Sustainability Committee|Director of Operations|Travel Office",
      "timeline": "this-quarter|this-year|this-3-years",
      "category": "must match the rejected item's category",
      "difficulty": "easy|medium|hard",
      "paybackYears": 0,
      "dataSource": "Real published methodology family",
      "provenance": "measured|cited|estimated"
    }
  ]
}

Generate 2-3 alternatives. Order by best-fit to the admin's reason first.`;

function buildUserMessage(item, context, otherItems, reason) {
  const lines = ['Original item the admin wants to replace:'];
  lines.push(`- Title: ${item.title}`);
  lines.push(`- Category: ${item.category} (alternatives must match)`);
  lines.push(`- Expected: ${item.expectedMtPerYear || 0} mt/yr · ${item.estimatedCostUsd === 0 ? 'no capex' : '$' + Number(item.estimatedCostUsd).toLocaleString()}`);
  lines.push(`- Difficulty: ${item.difficulty} · Timeline: ${item.timeline}`);
  if (item.why) lines.push(`- Why (original): ${item.why}`);
  if (reason) {
    lines.push('');
    lines.push(`Admin's reason for rejecting it: "${reason}"`);
    lines.push('Tune your alternatives to address this reason directly.');
  }
  if (Array.isArray(otherItems) && otherItems.length > 0) {
    lines.push('');
    lines.push('Items already in the plan (do NOT propose duplicates):');
    for (const o of otherItems) {
      if (o.id === item.id) continue;
      lines.push(`- ${o.title} (${o.category})`);
    }
  }
  if (context) {
    lines.push('');
    lines.push('Institutional context:');
    if (context.capitalAppetite)  lines.push(`- Capital appetite: ${context.capitalAppetite}`);
    if (context.topPriority)      lines.push(`- Top priority: ${context.topPriority}`);
    if (context.timeHorizonYears) lines.push(`- Horizon: ${context.timeHorizonYears} yr`);
  }
  lines.push('', 'Generate 2-3 alternatives now in the JSON shape.');
  return lines.join('\n');
}

function tryParseJson(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch { return null; }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader && res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const authed = verifyAdminRequest(req);
  if (!authed.valid) {
    res.status(401).json({ error: `admin auth required: ${authed.reason}` });
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

  const body = req.body || {};
  const item = body.item;
  const context = body.context || {};
  const otherItems = Array.isArray(body.otherItems) ? body.otherItems : [];
  const reason = typeof body.reason === 'string' ? body.reason.slice(0, 400) : '';

  if (!item || !item.title || !item.category) {
    res.status(400).json({ error: 'item with title + category is required' });
    return;
  }

  const apiKey = readEnv('ANTHROPIC_API_KEY');
  if (!apiKey) {
    res.status(200).json({
      mode: 'unavailable',
      alternatives: [],
      generatedAt: new Date().toISOString(),
      message: 'ANTHROPIC_API_KEY is not configured.',
    });
    return;
  }

  function cleanAlternatives(parsed) {
    return Array.isArray(parsed?.alternatives)
      ? parsed.alternatives.slice(0, 3).map((p, i) => ({
          id: p.id || `alt${i + 1}`,
          title: String(p.title || '').slice(0, 140),
          why: String(p.why || '').slice(0, 600),
          expectedMtPerYear: Number(p.expectedMtPerYear) || 0,
          estimatedCostUsd: Number(p.estimatedCostUsd) || 0,
          ownerRole: String(p.ownerRole || 'Sustainability Committee').slice(0, 60),
          timeline: ['this-quarter','this-year','this-3-years'].includes(p.timeline) ? p.timeline : 'this-year',
          category: ['scope1','scope2','scope3','sinks','engagement'].includes(p.category) ? p.category : item.category,
          difficulty: ['easy','medium','hard'].includes(p.difficulty) ? p.difficulty : 'medium',
          paybackYears: Number(p.paybackYears) || 0,
          dataSource: String(p.dataSource || '').slice(0, 280),
          provenance: ['measured','cited','estimated'].includes(p.provenance) ? p.provenance : 'estimated',
        }))
      : [];
  }

  // Phase 125: streaming branch.
  if (body.stream === true) {
    const send = openSSE(res);
    const { ok, text, usage } = await streamAnthropicJson({
      apiKey,
      send,
      mode: 'progress',
      progressInterval: 100,
      body: {
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
        system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: buildUserMessage(item, context, otherItems, reason) }],
      },
    });
    if (!ok) { res.end(); return; }
    const parsed = tryParseJsonLoose(text);
    if (!parsed) {
      send('error', { message: 'Could not parse JSON from LLM response' });
      res.end();
      return;
    }
    send('done', { alternatives: cleanAlternatives(parsed), generatedAt: new Date().toISOString(), usage, model: 'claude-sonnet-4-6' });
    res.end();
    return;
  }

  try {
    const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6', // narrower task than full plan; Sonnet is plenty
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [
          { role: 'user', content: buildUserMessage(item, context, otherItems, reason) },
        ],
      }),
    });

    if (!apiRes.ok) {
      let detail = '';
      try {
        const b = await apiRes.json();
        detail = b?.error?.message || JSON.stringify(b);
      } catch {
        try { detail = await apiRes.text(); } catch {}
      }
      res.status(502).json({ error: `Anthropic API ${apiRes.status}${detail ? ` — ${detail}` : ''}` });
      return;
    }

    const json = await apiRes.json();
    const text = (json.content || [])
      .filter((c) => c.type === 'text')
      .map((c) => c.text)
      .join('\n\n');
    const parsed = tryParseJson(text);
    const alternatives = Array.isArray(parsed?.alternatives)
      ? parsed.alternatives.slice(0, 3).map((p, i) => ({
          id: p.id || `alt${i + 1}`,
          title: String(p.title || '').slice(0, 140),
          why: String(p.why || '').slice(0, 600),
          expectedMtPerYear: Number(p.expectedMtPerYear) || 0,
          estimatedCostUsd: Number(p.estimatedCostUsd) || 0,
          ownerRole: String(p.ownerRole || 'Sustainability Committee').slice(0, 60),
          timeline: ['this-quarter','this-year','this-3-years'].includes(p.timeline) ? p.timeline : 'this-year',
          category: ['scope1','scope2','scope3','sinks','engagement'].includes(p.category) ? p.category : item.category,
          difficulty: ['easy','medium','hard'].includes(p.difficulty) ? p.difficulty : 'medium',
          paybackYears: Number(p.paybackYears) || 0,
          dataSource: String(p.dataSource || '').slice(0, 280),
          provenance: ['measured','cited','estimated'].includes(p.provenance) ? p.provenance : 'estimated',
        }))
      : [];

    res.status(200).json({
      mode: 'llm',
      alternatives,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: String(err?.message || 'alternatives failed') });
  }
}
