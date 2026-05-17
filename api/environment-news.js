// Public environmental-news feed for the /news page.
//
// Calls Anthropic with the web_search tool to pull 5-8 currently
// newsworthy environmental items, and caches the response in process
// memory so subsequent visitors on the same warm Vercel instance
// don't re-bill the LLM. Cache TTL is 24h — world environmental news
// doesn't change minute-to-minute, and one daily fetch per warm
// instance is the sweet spot for cost. The page also offers a manual
// refresh button that bypasses the cache via force=true.
//
// Cost guardrail: rate-limited 6 requests/min/IP (generous for normal
// student traffic, hard wall on scripted abuse). Each fresh fetch is
// roughly $0.05–0.15 depending on how many web searches the model
// decides to run (up to 5 per turn @ $0.01 each + LLM tokens).

import { createRateLimit, getClientKey } from '../src/utils/rateLimit.js';

const limiter = createRateLimit({ capacity: 6, refillPerSec: 6 / 60 });

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h
let cached = null; // { payload, generatedAt: number }

const SYSTEM_PROMPT = `You are an environmental news curator for the Kimball Union Academy carbon dashboard. The audience is KUA students — grades 9–12, mix of day + boarding (US + international). KUA sits on ~1,000 acres in Plainfield, NH (climate zone 6, ~7,500 heating-degree-days). Mixed maple/beech/birch forest, 19 tracked buildings, ~340 students. Heating runs oil + propane; electricity comes off the ISO-NE grid (~51% natural gas, ~23% nuclear). Dining hall serves three meals a day. Students drive/fly home for breaks. Winter sports are a big deal.

Your job: pull 5–8 currently newsworthy items about environmental issues, climate, energy, biodiversity, pollution, oceans, land use, agriculture, or environmental policy — and for EACH ONE, write a short connection back to the student's daily life at KUA.

Output STRICT JSON only — no prose before or after, no markdown fences. The shape MUST be exactly:

{
  "items": [
    {
      "headline": "One short, punchy headline (max 90 chars). Plain, not clickbait.",
      "summary": "2–3 short sentences explaining what happened and why it matters. Student-friendly tone. Avoid jargon; when a technical term is unavoidable, define it briefly inline.",
      "studentConnection": "1–2 sentences (max 280 chars) linking this story to the student's actual daily life at KUA. Be specific and concrete: name a dorm, a meal, a season, a behavior, a building, a trip home, the campus forest, the ski hill, the dining hall menu. Examples of good connections: 'Less snow in New England means fewer days on the Whaleback ski club this winter — this is a measurable change from when your parents were KUA students.' / 'KUA dining serves beef once or twice a week; cutting that to once cuts roughly 30 mtCO₂e a year — about the same as taking 6 cars off the road.' / 'The campus forest pulls about 2,650 mt of CO₂ out of the air each year — bigger than KUA's entire heating + electricity footprint combined.' Avoid generic statements like 'this matters for everyone'. Make it about the student, here, today.",
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
5. Keep headlines under 90 characters, summaries under 320 characters, studentConnection under 280 characters.
6. Prefer primary sources (IPCC, EPA, IEA, NOAA, peer-reviewed journals) when the news is about science. For policy or events, reputable newsrooms are fine (Reuters, AP, NYT, BBC, Guardian).
7. The studentConnection is required and must be specific to KUA / New England / a teenager's daily routine — not generic platitudes. If a story genuinely has no honest connection to student life, drop it.`;

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
      // studentConnection is the whole point of the feed — drop any
      // item the model didn't bother to localize. Better to return 4
      // grounded items than 8 generic ones.
      const studentConnection = String(it.studentConnection || '').slice(0, 400).trim();
      if (!studentConnection) return null;
      return {
        headline,
        summary,
        studentConnection,
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
