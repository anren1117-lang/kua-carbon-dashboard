// Rule-based intent matcher for the Carbon Learning Chatbot v1.
//
// Approach: tokenize the user's query, score every knowledge article by
// keyword overlap, optionally bias toward the requested reading level,
// and return the top match plus the next two as related-articles.
//
// Phase-2 upgrade path: replace this with a proper RAG retrieval over
// embedded knowledge content. The interface stays the same, so callers
// don't change.

import { knowledgeArticles } from '../data/learningContent.js';

const STOP_WORDS = new Set([
  'a','an','and','are','as','at','be','by','for','from','has','have','how','i','in','is','it','of','on','or','than','that','the','to','was','were','what','when','where','which','who','why','will','with','do','does','can','should','my','your','our',
]);

function tokenize(s) {
  return (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

function scoreArticle(article, queryTokens, readingLevel) {
  let score = 0;
  const haystack = `${article.title} ${article.body} ${article.keywords.join(' ')}`.toLowerCase();
  for (const t of queryTokens) {
    // Keyword field gets the biggest weight (curated by the article author)
    if (article.keywords.some((k) => k.toLowerCase().includes(t))) score += 3;
    // Title hits next
    if (article.title.toLowerCase().includes(t)) score += 2;
    // Body hits least
    if (haystack.includes(t)) score += 1;
  }
  // Reading-level alignment bonus
  if (readingLevel && article.readingLevel === readingLevel) score += 1.5;
  return score;
}

/**
 * Match a query to the best knowledge article.
 * @param {string} query
 * @param {object} [opts]
 * @param {'novice'|'intermediate'|'advanced'} [opts.readingLevel]
 * @returns {{ best: import('../data/learningContent.js').KnowledgeArticle | null, related: import('../data/learningContent.js').KnowledgeArticle[], score: number }}
 */
export function matchQuery(query, opts = {}) {
  const tokens = tokenize(query);
  if (tokens.length === 0) return { best: null, related: [], score: 0 };

  const ranked = knowledgeArticles
    .map((a) => ({ article: a, score: scoreArticle(a, tokens, opts.readingLevel) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  if (ranked.length === 0) return { best: null, related: [], score: 0 };

  return {
    best: ranked[0].article,
    related: ranked.slice(1, 3).map((r) => r.article),
    score: ranked[0].score,
  };
}

/**
 * Generate a quiz question pulled from an article. Phase-1 implementation
 * picks a fixed question template per topic; phase-2 will let an LLM
 * generate per-article questions with teacher approval.
 * @param {string} topic
 */
export function pickQuizForTopic(topic) {
  return QUIZ_BANK.find((q) => q.topic === topic) || QUIZ_BANK[0];
}

const QUIZ_BANK = [
  {
    id: 'q_scope2',
    topic: 'scopes',
    question: 'When KUA buys electricity from the grid, which scope does that fall under?',
    options: [
      { text: 'Scope 1', correct: false, explanation: 'Scope 1 is direct emissions you control — heating fuel, fleet, refrigerants.' },
      { text: 'Scope 2', correct: true,  explanation: 'Right. Scope 2 is purchased electricity. The power plant burns the fuel; KUA pays for the electricity.' },
      { text: 'Scope 3', correct: false, explanation: 'Scope 3 is everything else upstream/downstream — student travel, food, waste.' },
      { text: 'Scope 4', correct: false, explanation: 'There is no Scope 4 in the GHG Protocol — only 1, 2, and 3.' },
    ],
  },
  {
    id: 'q_beef',
    topic: 'food',
    question: 'Beef has roughly how many times the carbon footprint of chicken per kg?',
    options: [
      { text: '2×',   correct: false, explanation: 'Too low — the difference is much bigger because cattle are ruminants and produce methane.' },
      { text: '5×',   correct: false, explanation: 'Closer, but still low. The headline figure is ~10× per kg.' },
      { text: '10×',  correct: true,  explanation: 'Right. Beef averages ~60 kg CO₂e/kg vs chicken ~6 kg/kg — about a 10× difference.' },
      { text: '100×', correct: false, explanation: 'That gap is closer to beef vs vegetables. Beef vs chicken is ~10×.' },
    ],
  },
  {
    id: 'q_iso_ne',
    topic: 'energy',
    question: 'What is the dominant fuel source on the ISO-NE grid in 2024?',
    options: [
      { text: 'Coal',         correct: false, explanation: 'Coal is below 1% of the ISO-NE mix.' },
      { text: 'Natural gas',  correct: true,  explanation: 'Right. Natural gas is ~51% of ISO-NE generation in 2024.' },
      { text: 'Solar',        correct: false, explanation: 'Solar is part of the ~12% renewables share, not the dominant fuel.' },
      { text: 'Nuclear',      correct: false, explanation: 'Nuclear is ~23% — significant, but second to natural gas.' },
    ],
  },
  {
    id: 'q_kua_total',
    topic: 'kua_specific',
    question: 'Roughly how many mtCO₂e/yr is KUA\'s preliminary GROSS footprint estimate?',
    options: [
      { text: '~395',   correct: false, explanation: 'Too low — that\'s Scope 2 alone (electricity).' },
      { text: '~1,700', correct: false, explanation: 'That\'s the NET figure (gross minus forest sequestration). The gross is higher.' },
      { text: '~4,350', correct: true,  explanation: 'Right. Preliminary gross is ~4,350 mtCO₂e/yr (Scope 1 ~1,250 + Scope 2 ~395 + Scope 3 ~2,700). After ~2,650 mt of forest sequestration, net is ~1,700.' },
      { text: '~10,000',correct: false, explanation: 'Too high — that\'s closer to a much larger university\'s footprint.' },
    ],
  },
];
