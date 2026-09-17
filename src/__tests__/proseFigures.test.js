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
import { KG_PER_KWH } from '../data/gridMix.js';

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

// The grid factor drifts the same way the totals do, and it went stale in five
// places at once before Phase 392 — including a lesson teaching students that
// ISO-NE's 2024 rate was 643 lb/MWh when the published figure is 597.
//
// Context-matched, for the reason the header explains: prose legitimately
// carries OTHER kg/kWh figures that must not be flagged — ISO-NE's operational
// rate (~0.271), EPA's published eGRID NEWE rate (~0.246), the US average
// (~0.37). Only a claim about KUA's EFFECTIVE factor is a claim about this
// constant, so the word "effective" is what makes a number in scope.
const EFFECTIVE_FACTOR = /effective[^.\n]{0,70}?(\d\.\d{3})\s*kg/gi;
const CANONICAL_FACTOR = +KG_PER_KWH.toFixed(3);

// The same claim written in GRAMS. The first version of this tripwire only
// matched the kg form and so missed learningContent.js saying "about 235 g
// CO2/kWh" — a unit-shaped blind spot in a guard against stale figures.
//
// Requiring "CO" after the g is what keeps this off the legitimate US-average
// figure ("~370 g/kWh") that sits in the same sentence.
const EFFECTIVE_FACTOR_GRAMS = /effective[^.\n]{0,70}?(\d{2,4})\s*g\s*CO/gi;
const CANONICAL_GRAMS = Math.round(KG_PER_KWH * 1000);

const FACTOR_PROSE_FILES = [
  // The methodology page is the most citation-critical surface in the repo
  // and was NOT guarded until Phase 408 — it carried 0.235 while canonical
  // was 0.234.
  'pages/Methodology.js',
  'pages/Scope2.js',
  'components/LearnAgent.js',
  'components/DailyTip.js',
  'components/ScopeExplainer.js',
  'components/NetEstimate.js',
  'data/lessonLibrary.js',
  'data/learningContent.js',
];

function staleFactorsIn(relPath) {
  const full = path.join(SRC, relPath);
  if (!fs.existsSync(full)) return [];
  const stale = [];
  fs.readFileSync(full, 'utf8').split('\n').forEach((line, i) => {
    EFFECTIVE_FACTOR.lastIndex = 0;
    let m;
    while ((m = EFFECTIVE_FACTOR.exec(line)) !== null) {
      if (parseFloat(m[1]) !== CANONICAL_FACTOR) {
        stale.push(`${relPath}:${i + 1} — says the effective factor is ${m[1]}, canonical is ${CANONICAL_FACTOR}`);
      }
    }
    EFFECTIVE_FACTOR_GRAMS.lastIndex = 0;
    while ((m = EFFECTIVE_FACTOR_GRAMS.exec(line)) !== null) {
      if (parseInt(m[1], 10) !== CANONICAL_GRAMS) {
        stale.push(`${relPath}:${i + 1} — says the effective factor is ${m[1]} g, canonical is ${CANONICAL_GRAMS} g`);
      }
    }
  });
  return stale;
}

describe('prose states the current grid emission factor', () => {
  it.each(FACTOR_PROSE_FILES)('%s quotes the canonical effective factor', (relPath) => {
    expect(staleFactorsIn(relPath)).toEqual([]);
  });

  it('catches a stale factor rather than matching nothing', () => {
    const tmp = path.join(SRC, '__tests__/.factor-fixture.js');
    fs.writeFileSync(tmp, "const a = 'effective rate 0.999 kg/kWh';\n", 'utf8');
    try {
      expect(staleFactorsIn('__tests__/.factor-fixture.js')).toHaveLength(1);
    } finally {
      fs.unlinkSync(tmp);
    }
  });

  it('catches the factor written in grams, the form that slipped through first time', () => {
    const tmp = path.join(SRC, '__tests__/.factor-fixture-g.js');
    fs.writeFileSync(tmp, "const a = 'system-effective rate about 999 g CO2/kWh';\n", 'utf8');
    try {
      expect(staleFactorsIn('__tests__/.factor-fixture-g.js')).toHaveLength(1);
    } finally {
      fs.unlinkSync(tmp);
    }
  });

  it('does not flag the US-average figure sharing the sentence', () => {
    // "~370 g/kWh" is a different grid, not a stale copy of ours. Requiring
    // "CO" after the g is what separates them.
    const tmp = path.join(SRC, '__tests__/.factor-fixture-us.js');
    fs.writeFileSync(tmp, `const a = 'effective rate about ${CANONICAL_GRAMS} g CO2/kWh — cleaner than the US average (~370 g/kWh)';\n`, 'utf8');
    try {
      expect(staleFactorsIn('__tests__/.factor-fixture-us.js')).toEqual([]);
    } finally {
      fs.unlinkSync(tmp);
    }
  });

  it('leaves other legitimate kg/kWh figures alone', () => {
    const tmp = path.join(SRC, '__tests__/.factor-fixture2.js');
    // ISO-NE's operational rate and EPA's published rate are different
    // quantities, not stale copies of this one.
    fs.writeFileSync(tmp, "const a = '597 lb CO2 per MWh, or about 0.271 kg/kWh';\nconst b = 'published eGRID NEWE rate (0.246)';\n", 'utf8');
    try {
      expect(staleFactorsIn('__tests__/.factor-fixture2.js')).toEqual([]);
    } finally {
      fs.unlinkSync(tmp);
    }
  });
});
