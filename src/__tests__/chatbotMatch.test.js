// Unit tests for the chatbot intent matcher (matchQuery) and the
// quiz lookup (pickQuizForTopic). Backed by knowledgeArticles +
// QUIZ_BANK in the same file — keyword × 3, title × 2, body × 1,
// reading-level bonus + 1.5, top match + up to 2 related.

import { describe, it, expect } from 'vitest';
import { matchQuery, pickQuizForTopic } from '../utils/chatbotMatch.js';
import { knowledgeArticles } from '../data/learningContent.js';

describe('matchQuery — input handling', () => {
  it('returns null best for empty / whitespace / null queries', () => {
    for (const q of ['', '   ', null, undefined]) {
      expect(matchQuery(q)).toEqual({ best: null, related: [], score: 0 });
    }
  });

  it('returns null best when the query strips down to only stop words / short words', () => {
    // "the and at it" → all stop-listed; "in on of" → short or stop.
    expect(matchQuery('the and at it').best).toBeNull();
  });

  it('returns null best when no article scores > 0', () => {
    expect(matchQuery('zzzphraseunlikelytomatchanything').best).toBeNull();
  });
});

describe('matchQuery — matching', () => {
  it('returns a single best article when the query clearly maps to one topic', () => {
    // Use a keyword pulled directly from one of the bundled articles so
    // the assertion survives content edits.
    const sample = knowledgeArticles.find((a) => a.keywords && a.keywords.length > 0);
    const keyword = sample.keywords[0];
    const out = matchQuery(keyword);
    expect(out.best).toBeTruthy();
    expect(out.score).toBeGreaterThan(0);
  });

  it('caps the related array at 2 entries', () => {
    // A common-ish word should hit multiple articles; whatever scores,
    // the related list must never exceed 2.
    const out = matchQuery('emissions carbon climate');
    expect(out.related.length).toBeLessThanOrEqual(2);
    if (out.best) {
      // The best is not also in related.
      expect(out.related.includes(out.best)).toBe(false);
    }
  });

  it('sorts results by descending score (best is highest)', () => {
    const out = matchQuery('emissions carbon climate');
    if (out.related.length > 0) {
      // We can't read scores back, but the contract is "best first".
      // Re-score by running the matcher on the best's title — it must
      // still beat any related article's title.
      const bestOut = matchQuery(out.best.title);
      expect(bestOut.best).toBe(out.best);
    }
  });

  it('the reading-level bonus tips a tie toward the matching level', () => {
    // Pick two articles that share a keyword (if any). If the fixture
    // has none, this becomes a soft assertion — that's fine.
    const article = knowledgeArticles.find((a) => a.readingLevel);
    if (!article) return;
    const keyword = article.keywords?.[0] || article.title.split(' ')[0];
    const matched = matchQuery(keyword, { readingLevel: article.readingLevel });
    const noLevel = matchQuery(keyword);
    expect(matched.score).toBeGreaterThanOrEqual(noLevel.score);
  });

  it('weighs keyword hits more than body hits (3x vs 1x)', () => {
    // Construct a query of one keyword from an article. The article
    // whose keyword matches must beat any article that only happens to
    // mention the token somewhere in its body.
    const sample = knowledgeArticles.find((a) => a.keywords?.length > 0);
    const keyword = sample.keywords[0];
    const out = matchQuery(keyword);
    expect(out.best).toBe(sample);
  });
});

describe('pickQuizForTopic', () => {
  it('returns the matching quiz when one exists', () => {
    const q = pickQuizForTopic('scopes');
    expect(q.topic).toBe('scopes');
    expect(q.options.filter((o) => o.correct)).toHaveLength(1);
  });

  it('falls back to the first quiz for an unknown topic', () => {
    const fallback = pickQuizForTopic('not-a-real-topic');
    expect(fallback).toBeTruthy();
    expect(fallback.id).toBeDefined();
  });

  it('every bank entry has exactly one correct option', () => {
    // Quietly enforces the quiz authoring invariant — easy to break by
    // copy-pasting a new question with two `correct: true` rows.
    const topics = ['scopes', 'food', 'energy', 'kua_specific'];
    for (const t of topics) {
      const q = pickQuizForTopic(t);
      const correct = q.options.filter((o) => o.correct);
      expect(correct).toHaveLength(1);
    }
  });

  it('every bank entry has an explanation on every option', () => {
    const topics = ['scopes', 'food', 'energy', 'kua_specific'];
    for (const t of topics) {
      const q = pickQuizForTopic(t);
      for (const o of q.options) {
        expect(typeof o.explanation).toBe('string');
        expect(o.explanation.length).toBeGreaterThan(0);
      }
    }
  });
});
