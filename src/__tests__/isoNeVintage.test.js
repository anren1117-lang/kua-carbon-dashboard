// 643 lb CO2/MWh is ISO New England's **2022** in-region generation rate.
// Confirmed against ISO-NE's own published analysis (isonewswire, 11 Jan 2024:
// "2022 emission rate (lbs/MWh)" = 643 in-region, 565 including net imports).
// Their later analyses give 633 for 2023 (571 with imports) and a 2024 rate
// flat-to-down from there; scopeTotals records 597 generation-only for 2024.
//
// Three surfaces attributed 643 to the wrong year or the wrong basis:
//
//   Scope2.js          "In 2024 that was 643 lb/MWh from in-region
//                       generation" — the 2024 in-region rate is 597.
//   Methodology.js     "ISO-NE also publishes 643 lb CO2/MWh on an
//   AdminMethodology   input-energy basis" — 643 is not an input-energy
//                       figure, it is the 2022 output-basis in-region rate.
//
// scopeTotals.js:855 already suspected this and said so, but flagged the
// attribution as second-hand. It is now first-hand, so the hedge goes too.
//
// This pins the VINTAGE, not the number: 643 may legitimately appear as a
// historical comparison, but never labelled 2024, and never as a basis it is
// not.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (rel) => readFileSync(resolve(process.cwd(), rel), 'utf8');
const SURFACES = ['pages/Scope2.js', 'pages/Methodology.js', 'pages/admin/AdminMethodology.js'];

describe('643 is never attributed to 2024', () => {
  // NOT "643 and 2024 never share a line" — a sentence that CORRECTS the
  // attribution legitimately names both ("597 for 2024; the 643 figure is
  // 2022"). The defect is 643 presented AS the current rate, so that is what
  // this matches: 643 adjacent to a 2024/current claim with no 2022 label.
  it.each(SURFACES)('%s never presents 643 as the current rate', (f) => {
    const offenders = read(f).split('\n')
      .map((l, i) => [i + 1, l])
      .filter(([, l]) => l.includes('643'))
      .filter(([, l]) => !/2022/.test(l))
      .map(([n, l]) => `${f}:${n}: ${l.trim().slice(0, 120)}`);
    expect(offenders).toEqual([]);
  });

  it.each(SURFACES)('%s does not call 643 an input-energy basis', (f) => {
    const src = read(f);
    const offenders = src.split('\n')
      .filter((l) => l.includes('643') && /input-energy/i.test(l));
    expect(offenders).toEqual([]);
  });

  it('where 643 still appears, it is labelled 2022', () => {
    for (const f of SURFACES) {
      for (const line of read(f).split('\n')) {
        if (!line.includes('643')) continue;
        expect(line, `${f}: 643 without a 2022 label`).toMatch(/2022/);
      }
    }
  });

  it('Scope 2 states the real 2024 in-region rate', () => {
    expect(read('pages/Scope2.js')).toMatch(/597/);
  });

  it('scopeTotals no longer hedges the 2022 attribution as second-hand', () => {
    const src = read('data/scopeTotals.js');
    expect(src).toMatch(/643/);              // the history note stays
    expect(src).not.toMatch(/second-hand/);  // but is now confirmed
  });
});
