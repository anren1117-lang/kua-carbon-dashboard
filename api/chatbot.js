// POST /api/chatbot
//
// Body: { query: string, readingLevel?: 'novice'|'intermediate'|'advanced' }
//
// Response:
//   {
//     mode: 'rule' | 'llm',
//     title?: string,
//     answer: string,
//     sourceDoc?: string,
//     readingLevel?: string,
//     confidence: 'high' | 'medium' | 'low',
//     related?: { id, title }[]
//   }
//
// Behavior:
// 1. Always run the rule-based matchQuery() first. If it scores high
//    (≥ 6) we return its answer immediately — it's faster, deterministic,
//    and citation-grounded.
// 2. If the rule match is medium / low and an Anthropic API key is
//    configured, ask Claude to rewrite the matched article (or the
//    closest-related two) at the requested reading level, with the
//    explicit instruction "use ONLY the provided articles; if they
//    don't answer the question, say so."
// 3. If no API key is configured (or the API call fails), fall back
//    to the rule-based answer with a "low confidence" tag.
//
// The grounding-only system prompt prevents the LLM from inventing
// numbers about KUA that we can't audit. Without grounding the
// chatbot would happily make up facts.

import { matchQuery } from '../src/utils/chatbotMatch.js';
import { knowledgeArticles } from '../src/data/learningContent.js';
import { createRateLimit, getClientKey } from '../src/utils/rateLimit.js';

// 12 questions per minute per IP, with bursts up to 12 (capacity = 12,
// refill ≈ 0.2 / sec). Generous enough for normal classroom use; cheap
// enough that a runaway tab can't burn through the API budget.
const limiter = createRateLimit({ capacity: 12, refillPerSec: 0.2 });

function readEnv(key) {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return undefined;
}

const RULE_HIGH_CONFIDENCE = 6;
const RULE_MEDIUM_CONFIDENCE = 2;

const SYSTEM_PROMPT = `You are KUA's carbon-literacy chatbot. You answer middle-school through AP-level questions about carbon footprints, climate science, energy, food, transportation, waste, and KUA's specific data.

Strict grounding rules:
1. The user's question may have one to three relevant knowledge articles attached. Use ONLY those articles. Do not invent facts about KUA, do not invent numbers, do not pull in claims that don't appear in the provided articles.
2. If the articles don't actually answer the question, say so plainly and suggest the user ask a teacher or sustainability lead.
3. Match the requested reading level: novice = 4–6 sentences, plain language, no jargon. intermediate = 6–10 sentences, can use scope/GWP/kgCO2e terms. advanced = full AP-level treatment with calculations.
4. Always end with a one-line "Source:" citation referencing the article title (and sourceDoc if present).
5. Do not output safety disclaimers, do not pretend to have data we didn't give you, do not refuse climate-related questions.`;

function buildUserMessage(query, articles, readingLevel) {
  const articlesBlock = articles.map((a, i) => (
    `--- Article ${i + 1}: ${a.title} ---\n${a.body}\nSource: ${a.sourceDoc || 'KUA knowledge base'}\nReading level tag: ${a.readingLevel}`
  )).join('\n\n');
  return `Reading level requested: ${readingLevel || 'intermediate'}\n\nQuestion: ${query}\n\nReference articles:\n\n${articlesBlock}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { query, readingLevel } = req.body || {};
  if (!query || typeof query !== 'string' || !query.trim()) {
    res.status(400).json({ error: 'query (string) is required' });
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

  // Step 1 — rule-based match
  const ruleMatch = matchQuery(query, { readingLevel });
  if (!ruleMatch.best || ruleMatch.score < RULE_MEDIUM_CONFIDENCE) {
    res.status(200).json({
      mode: 'rule',
      answer: "I don't have a confident answer to that one. Try rephrasing, or ask a sustainability lead or teacher. Topics I cover well: carbon footprints, Scope 1/2/3, energy, food emissions, transportation, waste, and KUA-specific data.",
      confidence: 'low',
    });
    return;
  }

  if (ruleMatch.score >= RULE_HIGH_CONFIDENCE) {
    res.status(200).json({
      mode: 'rule',
      title: ruleMatch.best.title,
      answer: ruleMatch.best.body,
      sourceDoc: ruleMatch.best.sourceDoc,
      readingLevel: ruleMatch.best.readingLevel,
      confidence: 'high',
      related: ruleMatch.related.map((a) => ({ id: a.id, title: a.title })),
    });
    return;
  }

  // Step 2 — LLM rewrite, grounded on the matched + related articles
  const apiKey = readEnv('ANTHROPIC_API_KEY');
  if (!apiKey) {
    // No key — fall back to rule answer, tagged medium.
    res.status(200).json({
      mode: 'rule',
      title: ruleMatch.best.title,
      answer: ruleMatch.best.body,
      sourceDoc: ruleMatch.best.sourceDoc,
      readingLevel: ruleMatch.best.readingLevel,
      confidence: 'medium',
      related: ruleMatch.related.map((a) => ({ id: a.id, title: a.title })),
    });
    return;
  }

  const articles = [ruleMatch.best, ...ruleMatch.related].filter(Boolean);
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
          { role: 'user', content: buildUserMessage(query, articles, readingLevel) },
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
      .join('\n\n')
      .trim();

    res.status(200).json({
      mode: 'llm',
      title: ruleMatch.best.title,
      answer: text || ruleMatch.best.body,
      sourceDoc: ruleMatch.best.sourceDoc,
      readingLevel: readingLevel || ruleMatch.best.readingLevel,
      confidence: 'high',
      related: ruleMatch.related.map((a) => ({ id: a.id, title: a.title })),
    });
  } catch (err) {
    // Network or API failure → fall back to rule answer
    res.status(200).json({
      mode: 'rule',
      title: ruleMatch.best.title,
      answer: ruleMatch.best.body,
      sourceDoc: ruleMatch.best.sourceDoc,
      readingLevel: ruleMatch.best.readingLevel,
      confidence: 'medium',
      related: ruleMatch.related.map((a) => ({ id: a.id, title: a.title })),
      fallbackReason: err.message,
    });
  }
}

// Export for tests
export { RULE_HIGH_CONFIDENCE, RULE_MEDIUM_CONFIDENCE, SYSTEM_PROMPT, knowledgeArticles };
