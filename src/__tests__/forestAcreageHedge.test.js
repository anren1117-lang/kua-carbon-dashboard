// KUA publishes a 1,300-acre CAMPUS. It does not publish a forested acreage.
// The ~1,000 acres this dashboard uses is the project's own working figure —
// CLAUDE.md records that finding, and ScopeExplainer.js says so in the copy:
//
//   "(The campus is 1,300 acres, of which roughly 1,000 are treated as forest
//    — that 1,000 is our own working figure, not a published one.)"
//
// LearnAgent stated it as fact twice, in the lessons that introduce sinks:
//
//   "KUA owns roughly **1,000 acres of forest** in New Hampshire."
//   "The sink at KUA is the **~1,000 acres of campus forest**."
//
// That matters more here than anywhere: it is the number the whole sinks
// argument rests on, and the sink is over half of gross emissions. A student
// should know which figures are measured and which are assumed.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (rel) => readFileSync(resolve(process.cwd(), rel), 'utf8');
const agent = read('components/LearnAgent.js');

const HEDGE = /working figure|not a published|our own estimate|not published/i;

describe('the forested acreage is flagged as a working figure', () => {
  it('ScopeExplainer already does this — the model to follow', () => {
    const se = read('components/ScopeExplainer.js');
    expect(se).toMatch(/1,300 acres/);
    expect(se).toMatch(HEDGE);
  });

  // PROSE asserts; a givens-table entry inherits its framing from the
  // scenario line that introduces it. `{ label: 'Forested area', value:
  // '1,000 acres' }` is a parameter of a stated problem, not a claim about
  // the world — requiring the caveat inside a table cell would be noise.
  // Accepts BOTH quote styles: one of these bodies is a template literal, so
  // a single-quote-only pattern silently classified real prose as not-prose.
  const isProse = (l) => /^\s*(body|text|scenario|explanation|summary):\s*['`]/.test(l);

  it('every LearnAgent sentence asserting the acreage carries the caveat', () => {
    const offenders = agent.split('\n')
      .map((l, i) => [i + 1, l])
      .filter(([, l]) => /1,000 acres/.test(l) && isProse(l))
      .filter(([, l]) => !HEDGE.test(l))
      .map(([n]) => `LearnAgent.js:${n}`);
    expect(offenders).toEqual([]);
  });

  it('the published campus total is named alongside it', () => {
    // 1,300 is the figure KUA actually publishes; stating it is what makes
    // the 1,000 legible as an assumption rather than a measurement.
    const lines = agent.split('\n').filter((l) => /1,000 acres/.test(l) && isProse(l));
    expect(lines.length).toBeGreaterThanOrEqual(3);
    for (const l of lines) expect(l).toMatch(/1,300/);
  });
});
