// @vitest-environment jsdom
//
// The manual Scope 2 form wrote rows that reached nothing.
//
// /admin/scope-2/meter seeds `source: 'campus_meter'` — a free-text field whose
// placeholder suggests exactly that string. The campus ledger accepts only
// 'bms_master_monthly' or 'meter_trends_feed_sum', so rowsToLedgerInputs
// rejects it as 'not a ledger source'. The row saves, appears in the admin
// records table, counts in /admin/data-quality's row count, and never reaches
// Scope 2. An admin entering a real campus reading sees a green "saved" beside
// an unchanged figure — indistinguishable from the dashboard being broken.
//
// Three destinations exist for a scope2_meter_readings row:
//
//   campus ledger  bms_master_monthly | meter_trends_feed_sum, no building
//   per-building   building_monthly, with a building, whole calendar month
//   nowhere        anything else — including the form's own default
//
// LedgerDestinationNote runs BOTH real filters on the in-progress row, so it
// cannot drift from the behaviour it reports. Same posture as RowPeriodNote:
// call the function that decides, never re-derive the decision.

import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { LedgerDestinationNote } from '../pages/admin/scope2/LedgerDestinationNote.js';
import { rowsToLedgerInputs, SOURCE_MASTER, SOURCE_FEED_SUM } from '../data/electricityLedger.js';
import { SOURCE_BUILDING_MONTHLY } from '../data/buildingMonths.js';

const read = (rel) => readFileSync(resolve(process.cwd(), rel), 'utf8');
const base = { period_start: '2026-08-01', period_end: '2026-08-31', kwh: '25000', building: '', data_quality: 'measured' };
const text = () => screen.getByRole('status').textContent;

// Renders accumulate in one jsdom document otherwise, and getByRole('status')
// then finds every note this file has ever drawn.
afterEach(cleanup);

describe('the form says which total a row will actually reach', () => {
  it("warns on the form's own default source", () => {
    render(<LedgerDestinationNote row={{ ...base, source: 'campus_meter' }} />);
    expect(text()).toMatch(/will not reach any total/i);
    expect(text()).toMatch(/not a ledger source/i);
  });

  it('that default really is rejected by the ledger — not a theoretical case', () => {
    const r = rowsToLedgerInputs([{ ...base, kwh: 25000, source: 'campus_meter' }]);
    expect(r.masterMonths).toHaveLength(0);
    expect(r.feedMonths).toHaveLength(0);
    expect(r.ignored[0].reason).toMatch(/not a ledger source/);
    // and it is the string the form seeds
    expect(read('pages/admin/scope2/MeterReading.js')).toMatch(/source: 'campus_meter'/);
  });

  it('confirms a master-meter total will count', () => {
    render(<LedgerDestinationNote row={{ ...base, source: SOURCE_MASTER }} />);
    expect(text()).toMatch(/counts toward scope 2/i);
    expect(text()).toMatch(/master-meter total/i);
  });

  it('confirms a feed-sum will count, and whether it can calibrate', () => {
    render(<LedgerDestinationNote row={{ ...base, source: SOURCE_FEED_SUM }} />);
    expect(text()).toMatch(/feed-sum/i);
    expect(text()).toMatch(/calibrate/i);
  });

  it('a partial-month master total is rejected, and says why', () => {
    render(<LedgerDestinationNote row={{ ...base, period_end: '2026-08-15', source: SOURCE_MASTER }} />);
    expect(text()).toMatch(/whole month/i);
  });

  it('a building row is not an error — it has its own destination', () => {
    render(<LedgerDestinationNote row={{ ...base, building: 'b_miller', source: SOURCE_BUILDING_MONTHLY }} />);
    expect(text()).toMatch(/per-building/i);
    expect(text()).not.toMatch(/will not reach/i);
  });

  it('says nothing until there is a kWh value to judge', () => {
    const { container } = render(<LedgerDestinationNote row={{ ...base, kwh: '', source: 'campus_meter' }} />);
    expect(container.innerHTML).toBe('');
  });

  it('reuses the real filters rather than re-deriving them', () => {
    const src = read('pages/admin/scope2/LedgerDestinationNote.js');
    expect(src).toContain('rowsToLedgerInputs');
    expect(src).toContain('rowsToBuildingMonths');
    // no hand-rolled source comparison that could drift from the ledger
    expect(src).not.toMatch(/source\s*===\s*'bms_master_monthly'/);
  });

  it('is rendered by the form it guards', () => {
    expect(read('pages/admin/scope2/MeterReading.js')).toMatch(/<LedgerDestinationNote row=\{form\} \/>/);
  });
});
