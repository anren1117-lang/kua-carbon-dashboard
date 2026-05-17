// Public environmental-news feed for the /news page.
//
// Calls Anthropic with the web_search tool to pull 5-8 currently
// newsworthy environmental items, and caches the response in process
// memory so subsequent visitors on the same warm Vercel instance
// don't re-bill the LLM. Cache TTL is generous (6h) because news
// items don't need to be minute-fresh; the page also offers a manual
// refresh button that bypasses the cache for force=true requests.
//
// Cost guardrail: rate-limited 6 requests/min/IP (generous for normal
// student traffic, hard wall on scripted abuse). Each fresh fetch is
// roughly $0.05–0.15 depending on how many web searches the model
// decides to run (up to 5 per turn @ $0.01 each + LLM tokens).

import { createRateLimit, getClientKey } from '../src/utils/rateLimit.js';

const limiter = createRateLimit({ capacity: 6, refillPerSec: 6 / 60 });

const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6h
let cached = null; // { payload, generatedAt: number }

const SYSTEM_PROMPT = `You are an environmental news curator for a high-school carbon-tracking dashboard. The audience is students (grades 9–12) and faculty at Kimball Union Academy. Your job: pull 5–8 currently newsworthy items about environmental issues, climate, energy, biodiversity, pollution, oceans, land use, or environmental policy.

Output STRICT JSON only — no prose before or after, no markdown fences. The shape MUST be exactly:

{
  "items": [
    {
      "headline": "One short, punchy headline (max 90 chars). Plain, not clickbait.",
      "summary": "2–3 short sentences explaining what happened and why it matters. Student-friendly tone. Avoid jargon; when a technical term is unavoidable, define it briefly inline.",
      "topic": "climate" | "energy" | "biodiversity" | "pollution" | "policy" | "oceans" | "land" | "agriculture",
      "sourceName": "Publication or organization name (e.g. 'IPCC', 'Reuters', 'Nature', 'EPA').",
      "sourceUrl": "Canonical https URL to the article or report.",
      "dateApprox": "YYYY-MM or YYYY-MM-DD — when this happened."
    }
  ]
}

Rules:
1. Use the web_search tool. Pull items that are current — preferably from the last 30–60 days. Avoid evergreen content unless something is newly relevant.
2. Mix at least 3 different topics so the feed feels representative — don't return 8 climate items.
3. Always include a real source URL. If you can't find one for an item, drop it — never invent URLs.
4. Be factually neutral. State what happened and the scale; let the student draw conclusions. No doom, no false optimism.
5. Keep headlines under 90 characters and summaries under 320 characters.
6. Prefer primary sources (IPCC, EPA, IEA, NOAA, peer-reviewed journals) when the news is about science. For policy or events, reputable newsrooms are fine (Reuters, AP, NYT, BBC, Guardian).`;

function tryParseJson(text) {
  const match = (text || '').match(/\{[\s\S]*\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch { return null; }
}

const ALLOWED_TOPICS = new Set(['climate', 'energy', 'biodiversity', 'pollution', 'policy', 'oceans', 'land', 'agriculture']);

function cleanItems(rawItems) {
  if (!Array.isArray(rawItems)) return [];
  return rawItems
    .map((it) => {
      if (!it || typeof it !== 'object') return null;
      const sourceUrl = typeof it.sourceUrl === 'string' && /^https?:\/\//i.test(it.sourceUrl) ? it.sourceUrl : null;
      if (!sourceUrl) return null;
      const headline = String(it.headline || '').slice(0, 200).trim();
      const summary  = String(it.summary || '').slice(0, 600).trim();
      if (!headline || !summary) return null;
      return {
        headline,
        summary,
        topic: ALLOWED_TOPICS.has(it.topic) ? it.topic : 'climate',
        sourceName: String(it.sourceName || 'Source').slice(0, 80).trim(),
        sourceUrl,
        dateApprox: typeof it.dateApprox === 'string' ? it.dateApprox.slice(0, 10) : '',
      };
    })
    .filter(Boolean);
}

// Test-only escape hatch so tests can reset the module-level cache.
export function _resetEnvironmentNewsCache() { cached = null; }

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader && res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  // Per-IP rate limit applies regardless of cache hit/miss so refresh
  // spamming can't trick the server into rebilling either.
  const limit = limiter.consume(getClientKey(req));
  if (!limit.allowed) {
    if (typeof res.setHeader === 'function') {
      res.setHeader('Retry-After', String(Math.ceil(limit.retryAfterMs / 1000)));
    }
    return res.status(429).json({ error: 'rate_limited', retryAfterMs: limit.retryAfterMs });
  }

  // Cache lookup — skip when force=true (manual refresh button) so the
  // user can deliberately re-fetch.
  const force = (req.query && (req.query.force === 'true' || req.query.force === '1'))
             || (req.body && req.body.force === true);
  if (!force && cached && Date.now() - cached.generatedAt < CACHE_TTL_MS) {
    return res.status(200).json({ ...cached.payload, fromCache: true });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'not_configured',
      help: 'Set ANTHROPIC_API_KEY in Vercel project settings to enable the news feed.',
    });
  }

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
        // Allow up to 5 web searches per turn; the model decides which
        // queries to run. Costs ~$0.01/search.
        tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 5 }],
        messages: [{
          role: 'user',
          content: 'Pull the current environmental-news feed for our students. Use web_search to find items from the last 30–60 days. Return only the JSON object.',
        }],
      }),
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: 'upstream_error',
        details: data.error || data,
      });
    }

    const blocks = Array.isArray(data.content) ? data.content : [];
    const text = blocks.filter((b) => b.type === 'text').map((b) => b.text).join('\n\n');
    const parsed = tryParseJson(text);
    if (!parsed || !Array.isArray(parsed.items)) {
      return res.status(502).json({ error: 'unparseable_response' });
    }

    const items = cleanItems(parsed.items);
    if (items.length === 0) {
      return res.status(502).json({ error: 'no_valid_items' });
    }

    const payload = {
      items,
      generatedAt: new Date().toISOString(),
      model: data.model || 'claude-sonnet-4-6',
      usage: data.usage || null,
    };
    cached = { payload, generatedAt: Date.now() };

    return res.status(200).json({ ...payload, fromCache: false });
  } catch (err) {
    return res.status(500).json({ error: 'server_error', details: String(err?.message || err) });
  }
}
