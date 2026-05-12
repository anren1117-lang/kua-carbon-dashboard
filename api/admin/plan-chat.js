// POST /api/admin/plan-chat
//
// Body:
//   {
//     plan:         <full plan object from /api/admin/plan>,
//     context:      <institutional context>,
//     history:      { completed: [...], declined: [...] },
//     measuredState:{ scope1Measured, scope2Measured, scope3Measured, ... },
//     messages:     [{ role, content }]
//   }
//
// Response (200):
//   { mode: 'llm'|'unavailable', reply: string, generatedAt: ISO }
//
// Plan-level chat — the agent has access to the entire plan (all 8-12
// items + their detail blocks), institutional context, history of
// shipped/declined items, and the measurement state. Lets admins ask
// strategy-level questions ("which 3 items should I lead the board
// presentation with?", "what's the cheapest path to 30% by 2028?",
// "the board wants to cut the scope 1 budget in half — re-prioritize").

import { createRateLimit, getClientKey } from '../../src/utils/rateLimit.js';
import { verifyAdminRequest } from '../../src/utils/adminToken.js';

const limiter = createRateLimit({ capacity: 8, refillPerSec: 0.2 });

function readEnv(key) {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return undefined;
}

const SYSTEM_PROMPT = `You are KUA's institutional carbon-strategy planner, available for plan-level follow-up questions.

KUA context: 340-student boarding secondary school in Plainfield/Meriden NH (CZ 6A, ~7,500 HDD). 19 buildings ~290K sqft. Staff ~110, faculty ~75. Reports to Sustainability Committee + Board of Trustees. FY runs July 1 – June 30, board meets quarterly.

Conversation rules:
1. The current plan is pinned into the context block at the start of this conversation. Refer to specific items by their #rank or short title. Quote numbers precisely when answering — they're auditable.
2. Plan-level questions deserve plan-level answers: re-prioritization, board-presentation framing, "which 3 should we lead with", "what does this look like at $X budget", "what stretch goal could we add".
3. When asked to re-rank or pick a subset, lay out the actual ordered shortlist with the mt + $ per item. Don't hand-wave.
4. When the user asks about strategy ("how should we sequence this?", "what's risky?"), give a real opinion with reasoning, not a both-sides summary.
5. Plain prose. NO JSON unless explicitly requested. NO regeneration of the entire plan unless explicitly asked — the user has a Generate button for that.
6. Reply length matches the question. 1-3 sentences for factual asks; 1-2 short paragraphs for strategy/framing; an ordered list when asked to pick or rank.
7. Don't fabricate citations or specific dollar figures beyond what's already in the plan.`;

function buildPinnedContext(plan, context, history, measuredState) {
  const lines = ['[Plan + context pinned to this conversation]', ''];

  if (context) {
    lines.push('Institutional context:');
    lines.push(`- Fiscal year: ${context.fiscalYear || 'unspecified'}`);
    lines.push(`- Capital appetite: ${context.capitalAppetite || 'unspecified'}`);
    lines.push(`- Top priority: ${context.topPriority || 'unspecified'}`);
    lines.push(`- Planning horizon: ${context.timeHorizonYears || '—'} year(s)`);
    if (context.regulatoryDriver) lines.push(`- Regulatory driver: ${context.regulatoryDriver}`);
    if (context.notes)            lines.push(`- Leadership notes: ${context.notes}`);
    lines.push(`- Gross emissions: ${context.grossMt} mtCO2e/yr`);
    lines.push(`- Forest sequestration: ${context.sinksMt} mtCO2e/yr`);
    lines.push(`- Enrollment: ${context.enrollment}`);
    lines.push('');
  }

  if (measuredState) {
    lines.push('Measurement state:');
    lines.push(`- Scope 1: ${measuredState.scope1Measured ? 'measured (live)' : 'estimated (bottom-up cross-check)'}`);
    lines.push(`- Scope 2: measured (BMS)`);
    lines.push(`- Scope 3: ${measuredState.scope3Measured ? 'measured (live)' : 'estimated (bottom-up cross-check)'}`);
    lines.push(`- Sinks: ${measuredState.sinksMeasured ? 'measured' : 'estimated'}`);
    lines.push('');
  }

  if (plan && Array.isArray(plan.plan)) {
    lines.push(`Current plan (${plan.plan.length} items, total ${plan.totalExpectedMtPerYear || 0} mt/yr expected):`);
    if (plan.summary) lines.push(`Summary: ${plan.summary}`);
    plan.plan.forEach((item, i) => {
      lines.push('');
      lines.push(`#${i + 1}. ${item.title}`);
      lines.push(`   ${item.expectedMtPerYear || 0} mt/yr · ${item.estimatedCostUsd === 0 ? 'no capex' : '$' + Number(item.estimatedCostUsd).toLocaleString()} · ${item.timeline} · ${item.category}/${item.difficulty} · owner ${item.ownerRole}`);
      if (item.why) lines.push(`   Why: ${item.why}`);
    });
    lines.push('');
  }

  if (history) {
    const c = history.completed || [];
    const d = history.declined || [];
    if (c.length > 0) {
      const totalSaved = c.reduce((s, x) => s + (Number(x.mtSaved) || 0), 0);
      lines.push(`Already shipped (${c.length} items, ${Math.round(totalSaved)} mt/yr saved): ${c.map((x) => x.title).join('; ')}`);
    }
    if (d.length > 0) {
      lines.push(`Declined / vetoed (${d.length} items): ${d.map((x) => `${x.title}${x.reason ? ` (${x.reason})` : ''}`).join('; ')}`);
    }
  }

  lines.push('', '[End pinned context. Real user turns follow.]');
  return lines.join('\n');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader && res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const authed = verifyAdminRequest(req);
  if (!authed.ok) {
    res.status(authed.status).json({ error: authed.reason });
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
  const plan = body.plan;
  const context = body.context || {};
  const history = body.history || { completed: [], declined: [] };
  const measuredState = body.measuredState;
  const rawMessages = Array.isArray(body.messages) ? body.messages : [];

  if (!plan || !Array.isArray(plan.plan) || plan.plan.length === 0) {
    res.status(400).json({ error: 'plan with non-empty plan.plan is required' });
    return;
  }

  const messages = rawMessages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim().length > 0)
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));
  if (messages.length === 0 || messages[messages.length - 1].role !== 'user') {
    res.status(400).json({ error: 'messages must end with a user turn' });
    return;
  }

  const apiKey = readEnv('ANTHROPIC_API_KEY');
  if (!apiKey) {
    res.status(200).json({
      mode: 'unavailable',
      reply: '_Plan-level chat needs ANTHROPIC_API_KEY in the Vercel project env._',
      generatedAt: new Date().toISOString(),
    });
    return;
  }

  try {
    const pinned = buildPinnedContext(plan, context, history, measuredState);
    const fullMessages = [
      { role: 'user', content: pinned },
      { role: 'assistant', content: 'Pinned. Ready for plan-level follow-up.' },
      ...messages,
    ];

    const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-7',
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: fullMessages,
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
    const reply = (json.content || [])
      .filter((c) => c.type === 'text')
      .map((c) => c.text)
      .join('\n\n')
      .trim()
      .slice(0, 10000);

    if (!reply) {
      res.status(502).json({ error: 'Empty reply from LLM' });
      return;
    }

    res.status(200).json({
      mode: 'llm',
      reply,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: String(err?.message || 'chat failed') });
  }
}
