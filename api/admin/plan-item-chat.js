// POST /api/admin/plan-item-chat
//
// Body:
//   {
//     item:     <plan item object — title, why, mt, cost, ...>,
//     context:  <institutional context (fiscalYear, capitalAppetite, …)>,
//     messages: [{ role: 'user'|'assistant', content: string }],
//     memo?:    <previously-generated implementation memo, optional>
//   }
//
// Response (200):
//   {
//     mode: 'llm'|'unavailable',
//     reply: string,            // assistant's next turn
//     generatedAt: ISO
//   }
//
// Lets the admin ask follow-ups about a single plan item without
// regenerating the whole plan. Each turn carries the item + context
// + prior messages so Claude has stable grounding.

import { createRateLimit, getClientKey } from '../../src/utils/rateLimit.js';
import { verifyAdminRequest } from '../../src/utils/adminToken.js';

const limiter = createRateLimit({ capacity: 8, refillPerSec: 0.2 });

function readEnv(key) {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return undefined;
}

const SYSTEM_PROMPT = `You are KUA's institutional carbon-strategy planner, available for follow-up questions on a single plan item.

KUA context: 340-student boarding secondary school in Plainfield/Meriden NH (climate zone 6A, ~7,500 HDD). 19 buildings ~290K sqft. Staff ~110, faculty ~75. Reports to Sustainability Committee + Board of Trustees. FY runs July 1 – June 30, board meets quarterly. Existing relationships: FW Webb (heating oil), Liberty Utilities (electricity), Sodexo (dining), regional waste hauler.

Conversation rules:
1. You're answering ONE follow-up at a time about ONE specific plan item. Keep replies short and operational — 2-5 sentences for simple questions; up to 2 short paragraphs for "draft a memo" or "rewrite the board talking points" requests.
2. Stay grounded in the specific item + context the user pinned to the conversation. If they ask a question outside that scope, gently redirect or note you're answering at your best given limited info.
3. Plain prose. NO JSON unless the user explicitly asks for "JSON" or "structured output". NO bullet lists unless they help — most replies are sentences/paragraphs.
4. When asked to draft something (email, memo, talking points), output the actual drafted thing — not "here's an outline you could use".
5. When the user pushes back ("but capacity is X, not Y"), accept the correction in your next turn rather than re-litigating.
6. Don't fabricate citations. If asked for sources, say "I'd anchor on <named published methodology>" without inventing page numbers.`;

function buildSystemContext(item, context, memo) {
  const lines = ['Pinned plan item:'];
  lines.push(`- Title: ${item.title}`);
  if (item.why)              lines.push(`- Why: ${item.why}`);
  if (item.expectedMtPerYear)lines.push(`- Expected: ${item.expectedMtPerYear} mtCO2e/yr`);
  if (item.estimatedCostUsd) lines.push(`- Cost: $${Number(item.estimatedCostUsd).toLocaleString()}`);
  if (item.ownerRole)        lines.push(`- Owner: ${item.ownerRole}`);
  if (item.category)         lines.push(`- Category: ${item.category}`);
  if (item.difficulty)       lines.push(`- Difficulty: ${item.difficulty}`);
  if (item.timeline)         lines.push(`- Timeline tier: ${item.timeline}`);
  if (Array.isArray(item.firstSteps) && item.firstSteps.length) {
    lines.push(`- First steps: ${item.firstSteps.join(' / ')}`);
  }
  if (item.dependencies)     lines.push(`- Dependencies: ${item.dependencies}`);
  if (Array.isArray(item.risks) && item.risks.length) {
    lines.push(`- Risks: ${item.risks.join(' / ')}`);
  }
  if (context) {
    lines.push('', 'Institutional context:');
    if (context.fiscalYear)        lines.push(`- Fiscal year: ${context.fiscalYear}`);
    if (context.capitalAppetite)   lines.push(`- Capital appetite: ${context.capitalAppetite}`);
    if (context.topPriority)       lines.push(`- Top priority: ${context.topPriority}`);
    if (context.timeHorizonYears)  lines.push(`- Time horizon: ${context.timeHorizonYears}yr`);
    if (context.regulatoryDriver)  lines.push(`- Regulatory: ${context.regulatoryDriver}`);
  }
  if (memo) {
    lines.push('', 'Previously-generated implementation memo is available (consult if the user asks about timeline, stakeholders, drafts, etc.).');
  }
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
  const item = body.item;
  const context = body.context || {};
  const memo = body.memo || null;
  const rawMessages = Array.isArray(body.messages) ? body.messages : [];

  if (!item || !item.title) {
    res.status(400).json({ error: 'item with title is required' });
    return;
  }

  // Filter + sanitize messages: at least one user turn required, last
  // must be user (we generate the next assistant turn).
  const messages = rawMessages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim().length > 0)
    .slice(-20) // cap history at 20 turns to keep token usage bounded
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));
  if (messages.length === 0 || messages[messages.length - 1].role !== 'user') {
    res.status(400).json({ error: 'messages must end with a user turn' });
    return;
  }

  const apiKey = readEnv('ANTHROPIC_API_KEY');
  if (!apiKey) {
    res.status(200).json({
      mode: 'unavailable',
      reply: '_Follow-up chat needs ANTHROPIC_API_KEY in the Vercel project env. Once that\'s set this thread can run._',
      generatedAt: new Date().toISOString(),
    });
    return;
  }

  const wantStream = body.stream === true;

  try {
    // Prepend the pinned-context block as the first user turn so it
    // sits inside the assistant's view of the conversation. Anthropic
    // doesn't accept a "context" role, so we fake it with a user
    // turn that's clearly labeled.
    const contextBlock = buildSystemContext(item, context, memo);
    const fullMessages = [
      { role: 'user', content: `[Conversation context — please consult but do not quote verbatim]\n\n${contextBlock}\n\n[End context]\n\nNow respond to the actual user turns that follow.` },
      { role: 'assistant', content: 'Understood. Pinned to that plan item — go ahead.' },
      ...messages,
    ];

    if (wantStream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');
      const send = (event, payload) => res.write(`event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`);
      const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1200,
          stream: true,
          system: [
            { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
          ],
          messages: fullMessages,
        }),
      });
      if (!apiRes.ok || !apiRes.body) {
        let detail = '';
        try { const b = await apiRes.json(); detail = b?.error?.message || JSON.stringify(b); } catch {}
        send('error', { message: `Anthropic API ${apiRes.status}${detail ? ` — ${detail}` : ''}` });
        res.end();
        return;
      }
      const reader = apiRes.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let full = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buffer.indexOf('\n\n')) >= 0) {
          const chunk = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 2);
          const dataLine = chunk.split('\n').find((l) => l.startsWith('data: '));
          if (!dataLine) continue;
          try {
            const ev = JSON.parse(dataLine.slice(6));
            if (ev.type === 'content_block_delta' && ev.delta?.type === 'text_delta') {
              const t = ev.delta.text || '';
              full += t;
              send('delta', { text: t });
            } else if (ev.type === 'message_stop') break;
          } catch {}
        }
      }
      send('done', { reply: full.trim().slice(0, 8000), generatedAt: new Date().toISOString() });
      res.end();
      return;
    }

    const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1200,
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
      .slice(0, 8000);

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
