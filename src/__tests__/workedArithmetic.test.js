// Worked examples are the dashboard's promise to a student: the numbers in a
// quiz explanation are there to be checked by hand. Several phases have found
// prose whose figures went stale, and proseFigures.test.js guards the headline
// TOTALS — but nothing checked that a stated calculation actually computes.
//
// This evaluates every contiguous arithmetic chain in the teaching files:
// "200 × 8,760 × 0.14 = 245,280", including restated intermediates like
// "50×1 + 4×28 + 0.1×273 = 50 + 112 + 27.3 = 189.3". The first expression is
// evaluated with normal precedence and compared to the last segment.
//
// Two deliberate allowances, both of which caused false alarms while building
// this and are documented so nobody "fixes" them into noise:
//
//   Unit rescale. Prose freely crosses kg→mt and BTU→MBTU mid-line:
//   "6,000 × 10.21 = 61.3 mt" is right, in kg. A power-of-1,000 rescale is
//   accepted rather than demanding the prose spell out the conversion.
//
//   Continuations are skipped, not failed. "2.77 kg C/gal × 44.01/12.01 =
//   10.15" has a unit word inside the expression, so a scan starting at 44.01
//   sees a fragment. A chain immediately preceded by an operator is a tail of
//   something longer; skipping is honest, inventing a verdict is not.
//
// A bare "N = M" is excluded entirely: "GWP-100 = 28" is a label, not a sum.
// The left side must contain at least one operator to count as a calculation.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const FILES = [
  'pages/Faq.js', 'pages/CarbonMath.js', 'components/DailyTip.js',
  'components/LearnAgent.js', 'data/learningContent.js', 'data/lessonLibrary.js',
  'data/apUnitMap.js', 'pages/Dining.js', 'pages/Methodology.js',
  'pages/Drawdown.js', 'components/EnergyEquivalents.js',
];

const NUM = String.raw`\d[\d,]*(?:\.\d+)?`;
const OP = String.raw`(?:[×x*÷/+]|[-−–])`;
const EXPR = `${NUM}(?:\\s*${OP}\\s*${NUM})*`;
const CHAIN = new RegExp(`(${NUM}(?:\\s*${OP}\\s*${NUM})+)\\s*=\\s*(${EXPR}(?:\\s*=\\s*${EXPR})*)`, 'g');
const CONTINUATION = new RegExp(`${OP}\\s*[A-Za-z₂°/%]*\\s*$`);

/** Evaluate a prose arithmetic expression, or null if it is not purely one. */
function evaluate(raw) {
  const s = raw.replace(/,/g, '').replace(/[×x]/g, '*').replace(/÷/g, '/').replace(/[−–]/g, '-');
  // Only digits, dots, spaces and the four operators survive this gate, so the
  // string below can hold nothing but arithmetic.
  if (!/^[\d.\s+\-*/]+$/.test(s)) return null;
  try {
    const v = Function(`"use strict"; return (${s});`)();
    return Number.isFinite(v) ? v : null;
  } catch { return null; }
}

const SCALES = [1, 1000, 0.001, 1e6, 1e-6];
const agrees = (got, want) =>
  SCALES.some((k) => Math.abs(got * k - want) <= Math.max(Math.abs(want) * 0.015, 0.5));

function scan(text) {
  const bad = [];
  let checked = 0;
  let skipped = 0;
  text.split('\n').forEach((line, i) => {
    if (line.trimStart().startsWith('//')) return;
    for (const m of line.matchAll(CHAIN)) {
      if (CONTINUATION.test(line.slice(Math.max(0, m.index - 24), m.index))) { skipped++; continue; }
      const lhs = evaluate(m[1]);
      const segs = m[2].split(/\s*=\s*/).map(evaluate);
      if (lhs === null || segs.some((s) => s === null)) { skipped++; continue; }
      checked++;
      const rhs = segs[segs.length - 1];
      if (!agrees(lhs, rhs)) bad.push({ line: i + 1, text: m[0].slice(0, 80), lhs, rhs });
    }
  });
  return { bad, checked, skipped };
}

describe('every worked calculation in the teaching prose computes', () => {
  it('no stated chain disagrees with its own arithmetic', () => {
    const offenders = [];
    let total = 0;
    for (const rel of FILES) {
      const { bad, checked } = scan(readFileSync(resolve(process.cwd(), rel), 'utf8'));
      total += checked;
      for (const b of bad) {
        offenders.push(`${rel}:${b.line} "${b.text}" — left side is ${b.lhs}, stated ${b.rhs}`);
      }
    }
    expect(offenders).toEqual([]);
    // If this drops to near zero the scan has stopped finding the prose at all,
    // which would make the test pass for the wrong reason.
    expect(total).toBeGreaterThan(20);
  });

  it('fires on a broken calculation and stays quiet on a correct one', () => {
    const correct = scan('x: "Right. 200 × 8,760 × 0.14 = 245,280 kWh."');
    const broken = scan('x: "Right. 200 × 8,760 × 0.14 = 300,000 kWh."');
    expect(correct.bad).toHaveLength(0);
    expect(correct.checked).toBe(1);
    expect(broken.bad).toHaveLength(1);
  });

  it('handles restated intermediates and unit rescales', () => {
    const chained = scan('x: "50×1 + 4×28 + 0.1×273 = 50 + 112 + 27.3 = 189.3 kg"');
    expect(chained.bad).toHaveLength(0);
    const chainedWrong = scan('x: "50×1 + 4×28 + 0.1×273 = 50 + 112 + 27.3 = 210.0 kg"');
    expect(chainedWrong.bad).toHaveLength(1);
    // kg stated as mt — a power-of-1,000 rescale, not an error
    const rescaled = scan('x: "OLD: 6,000 × 10.21 = 61.3 mt."');
    expect(rescaled.bad).toHaveLength(0);
  });

  it('ignores labels that merely look like equations', () => {
    const label = scan('x: "AR6 GWP-100 = 28 for methane."');
    expect(label.checked).toBe(0);
    expect(label.bad).toHaveLength(0);
  });
});
