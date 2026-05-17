// Unit tests for the small monthly-consumption helpers. The data is
// hardcoded BMS captures; these functions just project + look up over
// it. Tests focus on the contract rather than specific kWh numbers
// (so a new BMS capture rolling into the fixture doesn't churn them).

import { describe, it, expect } from 'vitest';
import { monthlyReports } from '../data/monthlyConsumption.js';
import {
  getMonthlyReport, buildingMonthlyHistory, campusMonthlyTotals,
} from '../data/monthlyConsumption.js';

describe('getMonthlyReport', () => {
  it('returns the matching report for a known month', () => {
    const known = monthlyReports[0].month;
    const r = getMonthlyReport(known);
    expect(r).toBeTruthy();
    expect(r.month).toBe(known);
    expect(Array.isArray(r.rows)).toBe(true);
  });

  it('returns null for an unknown month', () => {
    expect(getMonthlyReport('1999-01')).toBeNull();
  });
});

describe('buildingMonthlyHistory', () => {
  it('returns { buildingId: { month: kwh } } for every building × month appearance', () => {
    const hist = buildingMonthlyHistory();
    const firstReport = monthlyReports[0];
    const firstRow = firstReport.rows[0];
    expect(hist[firstRow.buildingId]).toBeDefined();
    expect(hist[firstRow.buildingId][firstReport.month]).toBe(firstRow.kwh);
  });

  it('aggregates a building across multiple months', () => {
    // Pick a building that appears in every monthly report.
    const id = monthlyReports[0].rows[0].buildingId;
    const monthsForThis = monthlyReports
      .filter((r) => r.rows.some((row) => row.buildingId === id))
      .map((r) => r.month);
    const hist = buildingMonthlyHistory();
    for (const m of monthsForThis) {
      expect(typeof hist[id][m]).toBe('number');
    }
  });
});

describe('campusMonthlyTotals', () => {
  it('returns one entry per report with displayedTotal + sumOfRows', () => {
    const totals = campusMonthlyTotals();
    expect(totals).toHaveLength(monthlyReports.length);
    for (const t of totals) {
      expect(typeof t.month).toBe('string');
      expect(typeof t.displayedTotal).toBe('number');
      expect(typeof t.sumOfRows).toBe('number');
    }
  });

  it('preserves the source-data quirk that displayedTotal ≠ sumOfRows (the BMS drift the module documents)', () => {
    // The module header explains the two totals diverge 5-10%; one of
    // the captures should show a non-trivial gap. The test pins the
    // documented behavior so a future "helpful" reconciliation that
    // forces them equal would fail visibly.
    const totals = campusMonthlyTotals();
    const drifted = totals.some((t) => Math.abs(t.displayedTotal - t.sumOfRows) > 0);
    expect(drifted).toBe(true);
  });
});
