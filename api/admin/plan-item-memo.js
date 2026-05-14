// POST /api/admin/plan-item-memo
//
// Body:
//   {
//     item: <plan-item from /api/admin/plan response>,
//     context: <institutional context object — same shape as /api/admin/plan>
//   }
//
// Response (200):
//   {
//     mode: 'llm'|'unavailable',
//     memo: {
//       executiveSummary:     string,           // 1-paragraph "what / why / when"
//       weeklySchedule:       [{ week: number, focus: string, actions: string[] }],
//       stakeholderMap:       [{ role: string, when: 'week 1'|..., why: string }],
//       outreachTemplates:    [{ to: string, subject: string, draft: string }],
//       approvalsRequired:    string[],
//       budgetBreakdown:      [{ line: string, amountUsd: number, note?: string }],
//       successMetrics:       string[],
//       failureModes:         [{ risk: string, mitigation: string }],
//       communicationPlan:    [{ audience: string, channel: string, message: string }],
//     },
//     generatedAt: ISO
//   }
//
// This endpoint exists so the plan agent's top-level items can expand
// into a 1-page implementation memo on demand. Calling it for every
// plan item up-front would be expensive ($$ + tokens) and most items
// never get pursued. Lazy-load: admin clicks "Generate memo" on an
// item they want to ship → this endpoint runs.

import { createRateLimit, getClientKey } from '../../src/utils/rateLimit.js';
import { verifyAdminRequest } from '../../src/utils/adminToken.js';
import { openSSE, streamAnthropicJson, tryParseJsonLoose } from '../../src/utils/anthropicStream.js';

const limiter = createRateLimit({ capacity: 6, refillPerSec: 0.1 });

function readEnv(key) {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return undefined;
}

const SYSTEM_PROMPT = `You are KUA's institutional implementation strategist. You turn a single top-level decarbonization-plan item into a detailed implementation memo a Head of School or Director of Operations could hand to their team on Monday morning.

KUA context: 340-student boarding secondary school in Plainfield/Meriden NH (climate zone 6A, ~7,500 HDD). 19 buildings ~290K sqft. Staff ~110, faculty ~75. Reports to the Sustainability Committee + Board of Trustees. Existing relationships with FW Webb (heating oil), Liberty Utilities (electricity), Sodexo (dining services), regional waste hauler. Fiscal year runs July 1 – June 30. Board meets quarterly.

Output STRICT JSON only — no prose before or after — matching this shape exactly:
{
  "executiveSummary": "1 paragraph (3-5 sentences) framing what gets done, who does it, when, and what success looks like.",
  "weeklySchedule": [
    { "week": 1, "focus": "Discovery + baselining", "actions": ["Pull last 24 months of XYZ", "Survey current state by building", "..."] },
    { "week": 2, "focus": "...", "actions": ["..."] }
  ],
  "stakeholderMap": [
    { "role": "Facilities Director", "when": "week 1", "why": "owns implementation execution + has the on-site relationships" }
  ],
  "outreachTemplates": [
    {
      "to": "Vendor — e.g. FW Webb account rep",
      "subject": "Heating oil consumption analysis — 24-month data request",
      "draft": "Hi <name>, we're conducting a campus heating-fuel analysis as part of our 2030 reduction plan. Could you pull our delivery history for the last 24 months by tank/building? Specifically we need... <2-3 sentence specific ask>"
    }
  ],
  "approvalsRequired": ["Sustainability Committee — initial scope sign-off, week 2", "Board of Trustees — capital appropriation, next quarterly meeting (if cost > $50K)"],
  "budgetBreakdown": [
    { "line": "Engineering feasibility study", "amountUsd": 15000, "note": "outside firm — typical NH commercial benchmark" },
    { "line": "Equipment + installation", "amountUsd": 0, "note": "deferred to capital phase" }
  ],
  "successMetrics": ["mt CO2e reduced YoY (target: <X> mt by FY end)", "metric 2", "..."],
  "failureModes": [
    { "risk": "Specific KUA failure mode — be concrete", "mitigation": "What to do if it happens" }
  ],
  "communicationPlan": [
    { "audience": "Board of Trustees", "channel": "Quarterly meeting agenda item", "message": "1-sentence framing of progress + ask" },
    { "audience": "Parents", "channel": "Head of School newsletter", "message": "..." },
    { "audience": "Students", "channel": "All-School Meeting announcement", "message": "..." }
  ]
}

Rules:
1. Weekly schedule: 4–8 weeks. Each week has 2-5 specific actions. Verb-first ("Pull...", "Email...", "Walk-through...").
2. Stakeholder map: 3-6 distinct KUA roles. Use real KUA roles only (Head of School, Director of Operations, Facilities Director, Dining Services Director, Sustainability Committee chair, CFO, Director of Communications, Board chair, Travel Office, IT Director).
3. Outreach templates: 1-3 concrete emails. Each has a real subject line and a specific draft (not "<placeholder>" — write the actual email).
4. Approvals: 1-4 items, time-stamped to a week or board meeting.
5. Budget breakdown: line-item with USD amounts. Use 0 for no-cost items.
6. Success metrics: 2-4 measurable + time-bound metrics specific to THIS item, not generic dashboard KPIs.
7. Failure modes: 2-4 KUA-specific risks (not generic "scope creep" or "budget overrun" — be concrete: "Heating-oil vendor unable to pull data older than 18 months due to billing system change", etc.).
8. Communication plan: 2-4 audience/channel pairs. Match audience to the actual channels KUA uses.
9. The memo voice is direct and operational — written for someone who needs to execute, not for fundraising or board theater.`;

function buildUserMessage(item, context) {
  const lines = [
    'Plan item to expand:',
    `- Title: ${item.title}`,
    `- Why: ${item.why}`,
    `- Expected reduction: ${item.expectedMtPerYear} mtCO2e/yr`,
    `- Cost: ${item.estimatedCostUsd === 0 ? 'no capex' : '$' + Number(item.estimatedCostUsd).toLocaleString()}`,
    `- Owner role: ${item.ownerRole}`,
    `- Category: ${item.category}`,
    `- Difficulty: ${item.difficulty}`,
    `- Timeline tier: ${item.timeline}`,
  ];
  if (Array.isArray(item.firstSteps) && item.firstSteps.length) {
    lines.push(`- First steps (from the plan): ${item.firstSteps.join(' / ')}`);
  }
  if (item.dependencies)             lines.push(`- Dependencies: ${item.dependencies}`);
  if (Array.isArray(item.milestones) && item.milestones.length) {
    lines.push(`- Milestones: ${item.milestones.join(' / ')}`);
  }
  if (Array.isArray(item.risks) && item.risks.length) {
    lines.push(`- Known risks: ${item.risks.join(' / ')}`);
  }
  if (Array.isArray(item.kpis) && item.kpis.length) {
    lines.push(`- KPIs (from the plan): ${item.kpis.join(' / ')}`);
  }
  if (item.dataSource) lines.push(`- Data source: ${item.dataSource}`);
  lines.push('');
  lines.push('Institutional context:');
  if (context) {
    lines.push(`- Fiscal year: ${context.fiscalYear || 'unspecified'}`);
    lines.push(`- Capital appetite: ${context.capitalAppetite || 'unspecified'}`);
    lines.push(`- Top priority: ${context.topPriority || 'unspecified'}`);
    lines.push(`- Time horizon: ${context.timeHorizonYears || 'unspecified'} year(s)`);
    if (context.regulatoryDriver) lines.push(`- Regulatory driver: ${context.regulatoryDriver}`);
    if (context.notes)            lines.push(`- Notes: ${context.notes}`);
  }
  lines.push('', 'Generate a tactical implementation memo for THIS specific item, calibrated to KUA\'s real operating cadence.');
  return lines.join('\n');
}

function tryParseJson(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch { return null; }
}

function cleanMemo(parsed) {
  return {
    executiveSummary: String(parsed?.executiveSummary || '').slice(0, 1200),
    weeklySchedule: Array.isArray(parsed?.weeklySchedule)
      ? parsed.weeklySchedule.slice(0, 12).map((w) => ({
          week: Number(w?.week) || 0,
          focus: String(w?.focus || '').slice(0, 200),
          actions: cleanArr(w?.actions, 200, 6),
        }))
      : [],
    stakeholderMap: cleanObjArr(parsed?.stakeholderMap, 8, { role: 80, when: 40, why: 240 }),
    outreachTemplates: Array.isArray(parsed?.outreachTemplates)
      ? parsed.outreachTemplates.slice(0, 4).map((o) => ({
          to: String(o?.to || '').slice(0, 120),
          subject: String(o?.subject || '').slice(0, 160),
          draft: String(o?.draft || '').slice(0, 1600),
        }))
      : [],
    approvalsRequired: cleanArr(parsed?.approvalsRequired, 240, 6),
    budgetBreakdown: Array.isArray(parsed?.budgetBreakdown)
      ? parsed.budgetBreakdown.slice(0, 8).map((b) => ({
          line: String(b?.line || '').slice(0, 160),
          amountUsd: Number(b?.amountUsd) || 0,
          note: String(b?.note || '').slice(0, 200),
        }))
      : [],
    successMetrics: cleanArr(parsed?.successMetrics, 200, 6),
    failureModes: cleanObjArr(parsed?.failureModes, 6, { risk: 240, mitigation: 280 }),
    communicationPlan: cleanObjArr(parsed?.communicationPlan, 6, { audience: 80, channel: 80, message: 280 }),
  };
}

const cleanArr = (a, maxLen, maxItems) => Array.isArray(a)
  ? a.slice(0, maxItems).map((s) => String(s || '').slice(0, maxLen)).filter(Boolean)
  : [];

const cleanObjArr = (a, maxItems, shape) => Array.isArray(a)
  ? a.slice(0, maxItems).map((o) => {
      if (!o || typeof o !== 'object') return null;
      const out = {};
      for (const [k, maxLen] of Object.entries(shape)) {
        if (k === 'actions' || k === '_actionsArr') continue;
        const v = o[k];
        if (typeof v === 'number') out[k] = v;
        else out[k] = String(v || '').slice(0, maxLen);
      }
      return out;
    }).filter(Boolean)
  : [];

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
  if (!item || typeof item !== 'object' || !item.title) {
    res.status(400).json({ error: 'item must be a plan-item object with at least a title' });
    return;
  }

  const apiKey = readEnv('ANTHROPIC_API_KEY');
  if (!apiKey) {
    res.status(200).json({
      mode: 'unavailable',
      memo: null,
      generatedAt: new Date().toISOString(),
      message: 'ANTHROPIC_API_KEY is not configured. Set it in Vercel env to generate implementation memos.',
    });
    return;
  }

  // Phase 125: streaming branch. When stream:true, pipe Anthropic SSE
  // through as char-count progress events + emit the cleaned memo on
  // 'done'. Memo cleanup runs after the stream completes since the
  // 8-section JSON only parses as a unit.
  if (body.stream === true) {
    const send = openSSE(res);
    // Phase 173: extended thinking on Sonnet for memo generation.
    // Memos are 8-section structured documents — thinking helps the
    // model sequence the weekly schedule + stakeholder map + budget
    // breakdown coherently rather than as parallel bullet lists.
    // Default ON; client can opt out via useThinking: false.
    const useThinking = body.useThinking !== false;
    const { ok, text, usage, thinking } = await streamAnthropicJson({
      apiKey,
      send,
      mode: 'progress',
      body: {
        model: 'claude-sonnet-4-6',
        max_tokens: useThinking ? 12000 : 4000,
        ...(useThinking ? {
          thinking: { type: 'enabled', budget_tokens: 4000 },
          temperature: 1,
        } : {}),
        system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: buildUserMessage(item, context) }],
      },
    });
    if (!ok) { res.end(); return; }
    const parsed = tryParseJsonLoose(text);
    if (!parsed) {
      send('error', { message: 'Could not parse JSON from LLM response' });
      res.end();
      return;
    }
    const memo = cleanMemo(parsed);
    send('done', {
      memo,
      generatedAt: new Date().toISOString(),
      usage,
      model: 'claude-sonnet-4-6',
      thinking: useThinking ? thinking : undefined,
      thinkingEnabled: !!useThinking,
    });
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
        model: 'claude-sonnet-4-6',
        max_tokens: 4000,
        // Phase 109: prompt caching on the stable system prompt.
        system: [
          { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
        ],
        messages: [
          { role: 'user', content: buildUserMessage(item, context) },
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
    if (!parsed) {
      res.status(502).json({ error: 'Could not parse JSON from LLM response' });
      return;
    }

    const memo = cleanMemo(parsed);

    res.status(200).json({
      mode: 'llm',
      memo,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: String(err?.message || 'memo generation failed') });
  }
}
