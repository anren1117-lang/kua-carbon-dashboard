// POST /api/admin/admin-home-brief
//
// Body:
//   {
//     scopeTotals:  { grossMt, netMt, scope1Mt, scope2Mt, scope3Mt, sinkMt,
//                     scope1Measured, scope3Measured, sinksMeasured },
//     freshness:    { fresh, aging, stale, empty, irregular, staleTables },
//     recentFeed:   [{ ts, table, label, summary }],  // last 10 admin writes
//     shippedCount: number,
//     openItems:    number   // current plan items not yet shipped/declined
//   }
//
// Response (200):
//   {
//     mode:        'llm'|'unavailable',
//     focus:       string,   // 1-2 sentence "what to focus on next"
//     state:       string,   // 1-2 sentence "where things stand"
//     followups:   string[], // 2-3 short next-actions (verb-first)
//     generatedAt: ISO
//   }
//
// The brief on AdminHome answers "I'm an admin opening the portal —
// what do I look at first?" 2-3 sentences max, action-oriented.

import { createRateLimit, getClientKey } from '../../src/utils/rateLimit.js';
import { verifyAdminRequest } from '../../src/utils/adminToken.js';

const limiter = createRateLimit({ capacity: 8, refillPerSec: 0.2 });

function readEnv(key) {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return undefined;
}

const SYSTEM_PROMPT = `You are KUA's admin-portal greeter. When the sustainability admin opens the portal, you give them a 2-section executive snapshot:

KUA context: 340-student boarding secondary school in Plainfield/Meriden NH. The admin is opening this dashboard ~2-3× per week to enter records, generate plans, and check that the measured-data pipeline is current.

Output STRICT JSON only — no prose before or after — matching this shape exactly:
{
  "state":     "1-2 sentences. Where things stand right now: gross emissions level, what's measured vs estimated, freshness state. Plain prose, no jargon.",
  "focus":     "1-2 sentences. What this admin should look at FIRST when they land on the portal today. Specific. If freshness is degrading, mention which tables. If a scope is still estimated, point at instrumentation. If no plan exists, suggest generating one. Open with a verb — 'Pull...', 'Check...', 'Review...'",
  "followups": ["3-5 short next-actions (verb-first, 6-10 words each). Each one is something the admin could check off in <5 minutes."]
}

Rules:
1. Total reply length under 800 chars across the 3 fields. This is a top-of-page snapshot, not a memo.
2. NO welcome / NO marketing voice / NO "great job". Direct admin-tone.
3. Specific to the data provided. Don't fabricate numbers.
4. Focus field opens with a verb. Followups all open with verbs.
5. If everything is fresh + measured + a plan exists, the focus can be aspirational ("Look at the cumulative-shipped chart — you're ahead of schedule on Scope 3").`;

function buildUserMessage(s) {
  const lines = ['Admin-portal state for the brief:'];
  if (s.scopeTotals) {
    const t = s.scopeTotals;
    lines.push(`- Gross: ${t.grossMt} mt/yr; Net: ${t.netMt} mt/yr`);
    lines.push(`- Scope 1: ${t.scope1Mt} mt (${t.scope1Measured ? 'measured' : 'estimated'}); Scope 2: ${t.scope2Mt} mt (measured); Scope 3: ${t.scope3Mt} mt (${t.scope3Measured ? 'measured' : 'estimated'}); Sinks: ${t.sinkMt} mt (${t.sinksMeasured ? 'measured' : 'estimated'})`);
  }
  if (s.freshness) {
    const f = s.freshness;
    lines.push(`- Freshness: ${f.fresh} fresh / ${f.aging} aging / ${f.stale} stale / ${f.empty} empty / ${f.irregular} irregular`);
    if (Array.isArray(f.staleTables) && f.staleTables.length > 0) {
      lines.push(`- Stale tables: ${f.staleTables.slice(0, 5).join(', ')}`);
    }
  }
  if (typeof s.shippedCount === 'number') {
    lines.push(`- Plan items shipped: ${s.shippedCount}`);
  }
  if (typeof s.openItems === 'number') {
    lines.push(`- Plan items still open: ${s.openItems}`);
  }
  if (Array.isArray(s.recentFeed) && s.recentFeed.length > 0) {
    lines.push(`- Recent admin activity: ${s.recentFeed.slice(0, 5).map((r) => `${r.label} (${r.summary})`).join('; ')}`);
  } else {
    lines.push(`- No recent admin activity in the past 30 days.`);
  }
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

  const apiKey = readEnv('ANTHROPIC_API_KEY');
  if (!apiKey) {
    res.status(200).json({
      mode: 'unavailable',
      focus: '',
      state: '',
      followups: [],
      generatedAt: new Date().toISOString(),
    });
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
        model: 'claude-sonnet-4-6', // small task, no need for Opus
        max_tokens: 600,
        system: [
          { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
        ],
        messages: [
          { role: 'user', content: buildUserMessage(body) },
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

    res.status(200).json({
      mode: 'llm',
      state: String(parsed?.state || '').slice(0, 500),
      focus: String(parsed?.focus || '').slice(0, 500),
      followups: Array.isArray(parsed?.followups)
        ? parsed.followups.slice(0, 5).map((s) => String(s).slice(0, 120)).filter(Boolean)
        : [],
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: String(err?.message || 'brief failed') });
  }
}
