// POST /api/admin/plan-diff
//
// Body:
//   {
//     priorPlan: [{ title, expectedMtPerYear, category, timeline, ... }],
//     newPlan:   { plan: [...], summary, totalExpectedMtPerYear, ... },
//     context:   { capitalAppetite, topPriority, ... }
//   }
//
// Response (200):
//   {
//     mode: 'llm' | 'unavailable',
//     diff: {
//       headline:  string,      // 1 sentence summary
//       summary:   string,      // 2-3 sentence explanation
//       added:     string[],    // bullet titles of newly added items
//       removed:   string[],    // bullet titles of dropped items
//       evolved:   string[],    // titles that changed materially
//       unchanged: number       // count of items kept as-is
//     },
//     generatedAt: ISO
//   }
//
// Phase 117 added priorPlan to /api/admin/plan so regeneration
// preserves continuity. But the admin had no way to see what
// CHANGED between the prior and new plan — only the new state.
// This endpoint narrates the diff: which items got added, which
// got dropped, which evolved (same lever, different number), and
// why the agent reshuffled.
//
// Lightweight Sonnet-backed call — the diff is a one-paragraph
// brief, not a full plan, so Opus is overkill.

import { createRateLimit, getClientKey } from '../../src/utils/rateLimit.js';
import { verifyAdminRequest } from '../../src/utils/adminToken.js';
import { openSSE, streamAnthropicJson, tryParseJsonLoose } from '../../src/utils/anthropicStream.js';

const limiter = createRateLimit({ capacity: 8, refillPerSec: 0.2 });

function readEnv(key) {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return undefined;
}

const SYSTEM_PROMPT = `You narrate the diff between a prior decarbonization plan and a freshly regenerated one for Kimball Union Academy.

The admin just clicked "Re-generate plan." They want to know: what changed and WHY did the agent move things around? Did the priorities shift because of new context? Did some lever get retired because actuals showed it underdelivers? Did capital appetite change so a $3M heat-pump item dropped to a single-building scope?

Output STRICT JSON only — no prose before or after — matching this shape:
{
  "headline":  "1 sentence — top-level "the plan shifted because X" framing. Open with a verb if possible.",
  "summary":   "2-3 sentences — the agent's reasoning. Mention the specific drivers (capital appetite, calibration signal, scope target). NOT a list of items — that goes in added/removed/evolved arrays below.",
  "added":     ["For each NEW item not in the prior plan, one bullet: 'Title — 1 short clause why it's new (e.g. opened a Scope 3 lever because the cohort data flipped to measured).'"],
  "removed":   ["For each item DROPPED from the prior plan (not yet shipped or declined), one bullet: 'Title — 1 short clause why it's gone.'"],
  "evolved":   ["For each item kept BUT changed materially (mt or $ moved >20%, timeline shifted, owner changed), one bullet: 'Title — what shifted and why.'"],
  "unchanged": 0
}

Rules:
1. Total reply length under 1000 chars. This is a top-of-plan banner, not an essay.
2. Be specific. "Heat-pump conversion → Densmore Hall only" beats "narrowed the heat-pump item".
3. If the new plan is identical in spirit (same priorities, similar mt), say so — don't manufacture drama.
4. If priorPlan is empty (first generation), say "First plan generation — nothing to diff." with headline only.
5. NO marketing voice. NO praise. Direct memo tone.`;

function diffItems(priorPlan, newPlan) {
  const prior = Array.isArray(priorPlan) ? priorPlan : [];
  const cur = Array.isArray(newPlan?.plan) ? newPlan.plan : [];
  const titleKey = (t) => String(t || '').toLowerCase().trim();
  const priorByTitle = new Map(prior.map((p) => [titleKey(p.title), p]));
  const curByTitle = new Map(cur.map((c) => [titleKey(c.title), c]));
  const added = cur.filter((c) => !priorByTitle.has(titleKey(c.title)));
  const removed = prior.filter((p) => !curByTitle.has(titleKey(p.title)));
  const evolved = [];
  let unchanged = 0;
  for (const c of cur) {
    const p = priorByTitle.get(titleKey(c.title));
    if (!p) continue;
    const mtMoved = Math.abs((Number(c.expectedMtPerYear) || 0) - (Number(p.expectedMtPerYear) || 0));
    const mtBase = Math.max(1, Number(p.expectedMtPerYear) || 0);
    const mtPct = (mtMoved / mtBase) * 100;
    const timelineChanged = (c.timeline || '') !== (p.timeline || '');
    if (mtPct >= 20 || timelineChanged) {
      evolved.push({
        title: c.title,
        priorMt: p.expectedMtPerYear,
        newMt: c.expectedMtPerYear,
        priorTimeline: p.timeline,
        newTimeline: c.timeline,
      });
    } else {
      unchanged += 1;
    }
  }
  return { added, removed, evolved, unchanged };
}

function buildUserMessage({ priorPlan, newPlan, context, diff }) {
  const lines = [];
  if (!Array.isArray(priorPlan) || priorPlan.length === 0) {
    lines.push('No prior plan — this is a first generation.');
    if (newPlan?.summary) {
      lines.push('', `New plan summary: ${newPlan.summary}`);
    }
    return lines.join('\n');
  }
  lines.push(`Prior plan: ${priorPlan.length} items.`);
  for (const p of priorPlan) {
    lines.push(`- ${p.title} · ${Math.round(p.expectedMtPerYear || 0)} mt/yr · ${p.category || '?'} · ${p.timeline || '?'}`);
  }
  lines.push('', `New plan: ${newPlan.plan.length} items.`);
  for (const c of newPlan.plan) {
    lines.push(`- ${c.title} · ${Math.round(c.expectedMtPerYear || 0)} mt/yr · ${c.category || '?'} · ${c.timeline || '?'}`);
  }
  lines.push('', 'Server-computed diff (use these to anchor your narrative):');
  lines.push(`- Added (${diff.added.length}): ${diff.added.map((a) => a.title).join('; ') || 'none'}`);
  lines.push(`- Removed (${diff.removed.length}): ${diff.removed.map((r) => r.title).join('; ') || 'none'}`);
  lines.push(`- Evolved (${diff.evolved.length}): ${diff.evolved.map((e) => `${e.title} (${Math.round(e.priorMt)}→${Math.round(e.newMt)} mt${e.priorTimeline !== e.newTimeline ? `, ${e.priorTimeline}→${e.newTimeline}` : ''})`).join('; ') || 'none'}`);
  lines.push(`- Unchanged: ${diff.unchanged}`);
  if (context) {
    lines.push('', 'Current institutional context (use to explain WHY the agent shifted):');
    if (context.capitalAppetite)  lines.push(`- Capital appetite: ${context.capitalAppetite}`);
    if (context.topPriority)      lines.push(`- Top priority: ${context.topPriority}`);
    if (context.timeHorizonYears) lines.push(`- Horizon: ${context.timeHorizonYears} yr`);
  }
  lines.push('', 'Narrate the diff now in the JSON shape.');
  return lines.join('\n');
}

function cleanDiff(parsed, fallback) {
  return {
    headline:  String(parsed?.headline  || fallback.headline  || '').slice(0, 280),
    summary:   String(parsed?.summary   || '').slice(0, 800),
    added:     Array.isArray(parsed?.added)    ? parsed.added.slice(0, 8).map((s) => String(s).slice(0, 200)) : fallback.added,
    removed:   Array.isArray(parsed?.removed)  ? parsed.removed.slice(0, 8).map((s) => String(s).slice(0, 200)) : fallback.removed,
    evolved:   Array.isArray(parsed?.evolved)  ? parsed.evolved.slice(0, 8).map((s) => String(s).slice(0, 200)) : fallback.evolved,
    unchanged: Number(parsed?.unchanged) || fallback.unchanged,
  };
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
  const priorPlan = Array.isArray(body.priorPlan) ? body.priorPlan : [];
  const newPlan = body.newPlan;
  const context = body.context || {};

  if (!newPlan || !Array.isArray(newPlan.plan)) {
    res.status(400).json({ error: 'newPlan with plan[] is required' });
    return;
  }

  // Always compute the structured diff server-side. This is the
  // ground truth — the LLM only adds narration.
  const diff = diffItems(priorPlan, newPlan);
  const fallback = {
    headline: priorPlan.length === 0
      ? `First plan generation — ${newPlan.plan.length} items.`
      : `${diff.added.length} added, ${diff.removed.length} removed, ${diff.evolved.length} evolved, ${diff.unchanged} unchanged.`,
    summary: '',
    added: diff.added.map((a) => `${a.title} — newly added.`),
    removed: diff.removed.map((r) => `${r.title} — dropped from the plan.`),
    evolved: diff.evolved.map((e) => `${e.title} — ${Math.round(e.priorMt)}→${Math.round(e.newMt)} mt/yr.`),
    unchanged: diff.unchanged,
  };

  const apiKey = readEnv('ANTHROPIC_API_KEY');
  if (!apiKey) {
    // No-LLM fallback: return the structured diff as-is. Admin still
    // sees what changed; just no agent-narrated "why".
    res.status(200).json({
      mode: 'unavailable',
      diff: fallback,
      generatedAt: new Date().toISOString(),
    });
    return;
  }

  // Streaming branch via shared helper (same protocol as the other
  // structured AI endpoints).
  if (body.stream === true) {
    const send = openSSE(res);
    const { ok, text, usage } = await streamAnthropicJson({
      apiKey,
      send,
      mode: 'progress',
      progressInterval: 80,
      body: {
        model: 'claude-sonnet-4-6',
        max_tokens: 1200,
        system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: buildUserMessage({ priorPlan, newPlan, context, diff }) }],
      },
    });
    if (!ok) { res.end(); return; }
    const parsed = tryParseJsonLoose(text);
    send('done', {
      diff: cleanDiff(parsed, fallback),
      generatedAt: new Date().toISOString(),
      usage,
      model: 'claude-sonnet-4-6',
    });
    res.end();
    return;
  }

  // Non-streaming fallback path.
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
        max_tokens: 1200,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: buildUserMessage({ priorPlan, newPlan, context, diff }) }],
      }),
    });
    if (!apiRes.ok) {
      let detail = '';
      try { detail = (await apiRes.json())?.error?.message || ''; } catch {}
      res.status(502).json({ error: `Anthropic API ${apiRes.status}${detail ? ` — ${detail}` : ''}` });
      return;
    }
    const json = await apiRes.json();
    const text = (json.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n\n');
    const match = text.match(/\{[\s\S]*\}/);
    let parsed = null;
    if (match) { try { parsed = JSON.parse(match[0]); } catch {} }
    res.status(200).json({
      mode: 'llm',
      diff: cleanDiff(parsed, fallback),
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: String(err?.message || 'plan-diff failed') });
  }
}
