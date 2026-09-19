// A waste row can fail to price for three unrelated reasons, and until Phase
// 438 all three arrived at the reader as one sentence naming two of them:
//
//   "(N skipped — unknown waste_type or invalid amount)"
//
// A cubic-yard Landfill row has a VALID waste_type and a VALID amount. Both
// named causes are false for it, and the one true cause — a unit this table
// cannot convert — went unnamed. `Cat5Waste.js` dropped the cubic-yard option
// from the form and `CsvImportPanel` now refuses the unit, but neither helps
// a row already stored in Supabase: those still price at zero, and the page
// blamed the wrong field.
//
// The file's own doc block at scopeTotals.js:514 already CLAIMED the message
// reported "rows whose unit or waste_type cannot be priced". It did not.
//
// These assert on the rendered `method` string — what a reader actually sees —
// not on an internal counter.

import { describe, it, expect } from 'vitest';
import { composeScope3FromRecords } from '../data/scopeTotals.js';

const wasteRow = (r) => composeScope3FromRecords({ wasteRecords: r })
  .breakdown.find((b) => b.source.toLowerCase() === 'waste');

describe('a skipped waste row says WHY it was skipped', () => {
  it('names the unit — not waste_type, not amount — for a cubic-yard row', () => {
    const w = wasteRow([
      { waste_type: 'Landfill', amount: 10, unit: 'tons' },        // counted
      { waste_type: 'Landfill', amount: 50, unit: 'cubic yards' }, // valid stream, valid number
    ]);
    expect(w.method).toMatch(/unpriceable unit/i);
    expect(w.method).toMatch(/only tons\/lbs\/kg convert/);
    // The two causes the old message asserted are both FALSE for this row.
    expect(w.method).not.toMatch(/unrecognized waste_type/i);
    expect(w.method).not.toMatch(/invalid amount/i);
    expect(w.mt).toBe(6); // 10 short tons × 0.58 = 5.8 → 6; the yd3 row adds nothing
    // One skipped row states its count once, not twice ("1 skipped — 1 in a...").
    expect(w.method).not.toMatch(/1 skipped — 1 /);
    expect(w.method).not.toMatch(/\(\(|\)\)/); // no nested parentheses
  });

  it('names waste_type when the stream is unrecognized', () => {
    const w = wasteRow([{ waste_type: 'NotAStream', amount: 50, unit: 'tons' }]);
    expect(w.method).toMatch(/unrecognized waste_type/i);
    expect(w.method).not.toMatch(/unpriceable unit/i);
  });

  it('names the amount when it is not a usable number', () => {
    const w = wasteRow([{ waste_type: 'Landfill', amount: 'banana' }]);
    expect(w.method).toMatch(/invalid amount/i);
    expect(w.method).not.toMatch(/unpriceable unit/i);
  });

  it('reports all three causes separately when all three occur', () => {
    const w = wasteRow([
      { waste_type: 'Landfill',   amount: 10, unit: 'tons' },
      { waste_type: 'Landfill',   amount: 50, unit: 'cubic yards' },
      { waste_type: 'NotAStream', amount: 50, unit: 'tons' },
      { waste_type: 'Landfill',   amount: -5, unit: 'tons' },
    ]);
    expect(w.method).toMatch(/3 skipped/);
    expect(w.method).toMatch(/1 unpriceable unit/i);
    expect(w.method).toMatch(/unrecognized waste_type/i);
    expect(w.method).toMatch(/invalid amount/i);
  });
});

describe('a legitimate zero is not a failure', () => {
  it('counts a zero-amount row instead of calling it skipped', () => {
    // `if (!tons)` treated 0 as a skip, because !0 is true. A hauler invoice
    // recording a genuine zero-ton month is data, not an error.
    const w = wasteRow([
      { waste_type: 'Landfill',   amount: 10, unit: 'tons' },
      { waste_type: 'Composting', amount: 0,  unit: 'tons' },
    ]);
    expect(w.method).not.toMatch(/skipped/i);
    expect(w.mt).toBe(6);
  });

  it('says nothing about skipping when every row prices', () => {
    const w = wasteRow([
      { waste_type: 'Landfill',  amount: 10, unit: 'tons' },
      { waste_type: 'Recycling', amount: 5,  unit: 'tons' },
    ]);
    expect(w.method).not.toMatch(/skipped/i);
  });
});

describe('the existing contract still holds', () => {
  it('keeps the "N skipped" count phrasing dataLayer.test.js pins', () => {
    const w = wasteRow([
      { waste_type: 'Landfill',   amount: 10, unit: 'tons' },
      { waste_type: 'NotAStream', amount: 50, unit: 'tons' },
      { waste_type: 'Landfill',   amount: 'banana' },
    ]);
    expect(w.method).toMatch(/2 skipped/);
  });
});
