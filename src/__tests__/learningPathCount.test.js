// Three files, three different counts of the same thing:
//
//   Faq.js:170        "eight short learning paths"   <- user-facing
//   Learn.js:12       "11 paths"                      (comment, correct)
//   LearnAgent.js:51  "9 paths"                       (comment)
//
// LearnAgent defines ELEVEN. A teacher reading the FAQ is told eight and
// finds eleven.
//
// The fix is to DERIVE it. A fourth hardcoded number would drift the same way
// the first three did, so LearnAgent now exports the count and the FAQ renders
// it.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { LEARNING_PATH_COUNT } from '../components/LearnAgent.js';

const read = (rel) => readFileSync(resolve(process.cwd(), rel), 'utf8');
const agent = read('components/LearnAgent.js');

describe('the learning-path count is derived, not asserted', () => {
  it('the export matches the paths actually defined', () => {
    const defined = (agent.match(/^    id: '[a-z0-9-]+',$/gm) || []).length;
    expect(defined).toBeGreaterThan(5);
    expect(LEARNING_PATH_COUNT).toBe(defined);
  });

  it('there really are eleven right now', () => {
    // A premise check: if this changes the export should follow it, and the
    // FAQ should follow the export without anyone editing prose.
    expect(LEARNING_PATH_COUNT).toBe(11);
  });

  it('the FAQ no longer hardcodes a count', () => {
    const faq = read('pages/Faq.js');
    expect(faq).not.toMatch(/eight short learning paths/);
    expect(faq).toMatch(/LEARNING_PATH_COUNT/);
  });

  it('no comment states a stale count either', () => {
    expect(agent).not.toMatch(/across 9 paths/);
  });
});
