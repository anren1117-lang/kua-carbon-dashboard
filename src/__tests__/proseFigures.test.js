// Tripwire for stale headline figures in teaching prose.
//
// Lesson bodies, quiz explanations and worked examples state KUA's headline
// numbers in sentences ("Net = 4,375 − 2,650 = 1,725"). They can't just
// interpolate the canonical constants: the worked ANSWERS are written out too,
// so a self-recomputing number would stop matching its own arithmetic.
//
// So the prose is maintained by hand — and twice in one session it went stale
// silently when the headline moved (385 → 390, 4,370 → 4,375). Nothing failed;
// the lessons simply disagreed with the dashboard.
//
// Matching by NUMERIC PROXIMITY was the obvious approach and it's wrong: a
// first cut flagged the year 1750, the Birdsey rate 1,252 lb C/acre/yr, the
// R-134a GWP of 1,430 and KUA's 1813 founding, because closeness to a total
// says nothing about whether a number IS that total. So this matches on
// CONTEXT instead: a figure only counts when the sentence claims it is the
// gross, the net, or Scope 2 — e.g. "gross: ~4,375 mtCO₂e" or
// "Scope 2 ~390". Those phrases are what goes stale.

import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { SCOPE2_TOTAL_MT, GROSS_MT } from '../data/scopeTotals.js';
import { ANNUAL_SEQUESTRATION_MT } from '../data/sinks.js';

const SRC = path.resolve(new URL('../', import.meta.url).pathname);

const PROSE_FILES = [
  'components/LearnAgent.js',
  'data/learningContent.js',
  'data/lessonLibrary.js',
  'data/apUnitMap.js',
  'utils/chatbotMatch.js',
  'pages/TeacherPortal.js',
  'pages/CarbonCredits.js',
];

const GROSS = Math.round(GROSS_MT);
const NET = Math.round(GROSS_MT - ANNUAL_SEQUESTRATION_MT);
const SCOPE2 = Math.round(SCOPE2_TOTAL_MT);

const num = (raw) => parseInt(String(raw).replace(/,/g, ''), 10);

// Each claim: a pattern whose capture group is the figure the sentence says is
// this total, and the canonical value it must equal.
const CLAIMS = [
  { label: 'gross', expected: GROSS, re: /gross(?:[^.\n]{0,40}?)(?:~|is |of )(\d{1,3}(?:,\d{3})+)\s*mtCO₂e/gi },
  { label: 'gross', expected: GROSS, re: /(\d{1,3}(?:,\d{3})+)\s*mtCO₂e\s*gross/gi },
  { label: 'net', expected: NET, re: /net(?:\s+(?:is|=|balance(?:\s+is)?|annual footprint as))?\s*~?(\d{1,3}(?:,\d{3})+)\s*mtCO₂e/gi },
  { label: 'Scope 2', expected: SCOPE2, re: /Scope 2[^.\n]{0,20}?~(\d{3})\b/gi },
];

// Lessons also pose invented schools ("A school spends $50,000 to buy offsets
// equal to its 1,000 mtCO₂e gross…"), whose worked answers depend on the made-up
// figure staying put. Those aren't claims about KUA, so they're out of scope.
const HYPOTHETICAL = /\b(a school|two schools|school A|school B|suppose|imagine|hypothetical|another school|peer school)\b/i;

function staleClaimsIn(relPath) {
  const text = fs.readFileSync(path.join(SRC, relPath), 'utf8');
  const lines = text.split('\n');
  const stale = [];
  lines.forEach((line, i) => {
    if (HYPOTHETICAL.test(line)) return;
    for (const { label, expected, re } of CLAIMS) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(line)) !== null) {
        const found = num(m[1]);
        if (Number.isFinite(found) && found !== expected) {
          stale.push(`${relPath}:${i + 1} — says ${label} is ${m[1]}, canonical is ${expected.toLocaleString()}`);
        }
      }
    }
  });
  return stale;
}

describe('teaching prose matches the canonical totals', () => {
  it.each(PROSE_FILES)('%s states the current headline figures', (relPath) => {
    expect(staleClaimsIn(relPath)).toEqual([]);
  });

  it('actually catches a stale figure (guard against a regex that matches nothing)', () => {
    const tmp = path.join(SRC, '__tests__/.prose-fixture.js');
    fs.writeFileSync(tmp, `const a = 'Gross: ~${(GROSS - 5).toLocaleString()} mtCO₂e/yr';\n`, 'utf8');
    try {
      expect(staleClaimsIn('__tests__/.prose-fixture.js')).toHaveLength(1);
    } finally {
      fs.unlinkSync(tmp);
    }
  });

  it('states the current gross and net somewhere in the lesson content', () => {
    const learn = fs.readFileSync(path.join(SRC, 'components/LearnAgent.js'), 'utf8');
    expect(learn).toContain(GROSS.toLocaleString());
    expect(learn).toContain(NET.toLocaleString());
  });
});
