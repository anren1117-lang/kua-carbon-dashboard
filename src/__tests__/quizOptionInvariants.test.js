// Every quiz in the learn agent must have exactly one correct option.
//
// This is not hypothetical. The peer-comparison quiz shipped with "Lower than
// peers" marked WRONG while its own explanation conceded the net figure is in
// fact lower — the option was false only under a boundary the question never
// named. A reader who picked it was told they were wrong about a true thing.
//
// Two invariants, both cheap, both previously violated:
//   1. exactly one correct:true per question — zero is unanswerable, two is a
//      scoring bug the UI cannot express.
//   2. no option is marked wrong while its explanation starts by agreeing with
//      it. "Correct, but..." is a sign the option, not the reader, is at fault.

import { describe, it, expect } from 'vitest';
import { LEARNING_PATHS } from '../components/LearnAgent.js';

/** Every object in the tree that looks like a quiz question. */
function questions(node, out = []) {
  if (Array.isArray(node)) { node.forEach((n) => questions(n, out)); return out; }
  if (!node || typeof node !== 'object') return out;
  if (Array.isArray(node.options) && typeof node.question === 'string') out.push(node);
  Object.values(node).forEach((v) => questions(v, out));
  return out;
}

const all = questions(LEARNING_PATHS);

describe('quiz option invariants', () => {
  it('finds the quizzes at all — a zero-length sweep proves nothing', () => {
    expect(all.length).toBeGreaterThan(5);
  });

  it('every question has exactly one correct option', () => {
    const bad = all
      .map((q) => [q.question.slice(0, 60), q.options.filter((o) => o.correct).length])
      .filter(([, n]) => n !== 1);
    expect(bad).toEqual([]);
  });

  it('no wrong option is conceded by its own explanation', () => {
    // the shipped defect: correct:false next to an explanation opening "True on gross"
    const CONCEDES = /^\s*(\*\*)?(true|correct|right|yes)\b/i;
    const bad = all.flatMap((q) =>
      q.options
        .filter((o) => !o.correct && CONCEDES.test(String(o.explanation || '')))
        .map((o) => `${q.question.slice(0, 40)} :: ${o.text}`),
    );
    expect(bad).toEqual([]);
  });

  it('the concession guard would catch the wording that shipped', () => {
    expect(CONCEDES_PROBE('True on gross, but KUA counts more Scope 3.')).toBe(true);
    expect(CONCEDES_PROBE('Correct — and that is the boundary point.')).toBe(true);
    expect(CONCEDES_PROBE('That sets KUA’s net against their gross.')).toBe(false);
  });
});

const CONCEDES_PROBE = (s) => /^\s*(\*\*)?(true|correct|right|yes)\b/i.test(s);
