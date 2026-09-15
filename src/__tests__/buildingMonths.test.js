import { describe, it, expect } from 'vitest';
import {
  rowsToBuildingMonths,
  mergeBuildingMonthlyHistory,
  adminBuildingMonthKeys,
  SOURCE_BUILDING_MONTHLY,
} from '../data/buildingMonths.js';

const row = (building, month, kwh, extra = {}) => {
  const [y, m] = month.split('-').map(Number);
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return {
    id: `${building}-${month}`,
    period_start: `${month}-01`,
    period_end: `${month}-${String(last).padStart(2, '0')}`,
    building,
    kwh,
    data_quality: 'measured',
    source: SOURCE_BUILDING_MONTHLY,
    ...extra,
  };
};

describe('rowsToBuildingMonths', () => {
  it('maps whole-month rows per building, newest wins', () => {
    const { history, ignored } = rowsToBuildingMonths([
      row('b_miller', '2026-05', 41000),
      row('b_miller', '2026-06', 33000),
      row('b_miller', '2026-05', 42000),
      row('b_fitch', '2026-05', 12000),
    ]);
    expect(history).toEqual({
      b_miller: { '2026-05': 42000, '2026-06': 33000 },
      b_fitch: { '2026-05': 12000 },
    });
    expect(ignored).toEqual([]);
  });

  it('accepts a string kWh, the way PostgREST returns numerics', () => {
    const { history } = rowsToBuildingMonths([row('b_miller', '2026-05', '41000.5')]);
    expect(history.b_miller['2026-05']).toBe(41000.5);
  });

  it('rejects a part-month, which would otherwise halve the building year', () => {
    const { history, ignored } = rowsToBuildingMonths([
      { ...row('b_miller', '2026-05', 20000), period_end: '2026-05-15' },
    ]);
    expect(history).toEqual({});
    expect(ignored[0].reason).toMatch(/whole month/);
  });

  it('leaves campus-wide and other-source rows to the electricity ledger', () => {
    const { history, ignored } = rowsToBuildingMonths([
      { ...row('b_miller', '2026-05', 1000), building: null },
      { ...row('b_miller', '2026-06', 1000), source: 'bms_master_monthly' },
    ]);
    expect(history).toEqual({});
    expect(ignored).toHaveLength(2);
  });

  it('rejects zero, negative and non-numeric readings', () => {
    const { history, ignored } = rowsToBuildingMonths([
      row('b_miller', '2026-05', 0),
      row('b_fitch', '2026-05', -10),
      row('b_bryant', '2026-05', 'abc'),
    ]);
    expect(history).toEqual({});
    expect(ignored).toHaveLength(3);
  });
});

describe('mergeBuildingMonthlyHistory', () => {
  const seed = { b_miller: { '2026-01': 41938, '2026-02': 40000 }, b_fitch: { '2026-01': 14856 } };

  it('lets an admin month replace the seed month, keeping the rest', () => {
    const merged = mergeBuildingMonthlyHistory(seed, { b_miller: { '2026-02': 44000 } });
    expect(merged.b_miller).toEqual({ '2026-01': 41938, '2026-02': 44000 });
    expect(merged.b_fitch).toEqual({ '2026-01': 14856 });
  });

  it('adds months and buildings the seed has never seen', () => {
    const merged = mergeBuildingMonthlyHistory(seed, { b_new: { '2026-07': 5000 } });
    expect(merged.b_new).toEqual({ '2026-07': 5000 });
    expect(Object.keys(merged).sort()).toEqual(['b_fitch', 'b_miller', 'b_new']);
  });

  it('does not mutate the seed history', () => {
    mergeBuildingMonthlyHistory(seed, { b_miller: { '2026-02': 44000 } });
    expect(seed.b_miller['2026-02']).toBe(40000);
  });
});

describe('adminBuildingMonthKeys', () => {
  it('lists building|month pairs an admin entered', () => {
    const keys = adminBuildingMonthKeys({ b_miller: { '2026-05': 1, '2026-06': 2 } });
    expect([...keys].sort()).toEqual(['b_miller|2026-05', 'b_miller|2026-06']);
  });
});
