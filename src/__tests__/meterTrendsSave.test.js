import { describe, it, expect } from 'vitest';
import { planMonthSave } from '../pages/admin/scope2/MeterTrendsUpload.js';

const saved = (id, month, source, kwh, extra = {}) => ({
  id, period_start: `${month}-01`, period_end: `${month}-28`, source, kwh, building: null, ...extra,
});
const incoming = (month, source, kwh) => ({
  period_start: `${month}-01`, period_end: `${month}-28`, source, kwh, building: null,
});

const MASTER = 'bms_master_monthly';
const FEED = 'meter_trends_feed_sum';
const BUILDING = 'building_monthly';

describe('planMonthSave — replace-by-month write order', () => {
  it('inserts the replacement before deleting the row it replaces', () => {
    const ops = planMonthSave([saved('old', '2026-02', MASTER, 185478)], [incoming('2026-02', MASTER, 190000)]);
    expect(ops.map((o) => o.op)).toEqual(['insert', 'delete']);
    expect(ops[0].row.kwh).toBe(190000);
    expect(ops[1].id).toBe('old');
    // The audit entry carries what was replaced, not just an id.
    expect(ops[1].meta).toMatchObject({ period_start: '2026-02-01', source: MASTER, kwh: 185478 });
  });

  it('is insert-only for a month with nothing saved yet', () => {
    const ops = planMonthSave([], [incoming('2026-06', FEED, 99338)]);
    expect(ops).toHaveLength(1);
    expect(ops[0].op).toBe('insert');
  });

  it('matches on source, so a feed-sum upload never deletes a master total', () => {
    const ops = planMonthSave([saved('master-may', '2026-05', MASTER, 120000)], [incoming('2026-05', FEED, 141633)]);
    expect(ops.map((o) => o.op)).toEqual(['insert']);
  });

  it("a campus-wide row never replaces a building's row", () => {
    const ops = planMonthSave([saved('b1', '2026-05', FEED, 5000, { building: 'b_miller' })], [incoming('2026-05', FEED, 141633)]);
    expect(ops.map((o) => o.op)).toEqual(['insert']);
  });

  it('replaces only the same building’s month', () => {
    const existing = [
      saved('miller-may', '2026-05', BUILDING, 41000, { building: 'b_miller' }),
      saved('fitch-may', '2026-05', BUILDING, 12000, { building: 'b_fitch' }),
    ];
    const ops = planMonthSave(existing, [{ ...incoming('2026-05', BUILDING, 42000), building: 'b_miller' }]);
    expect(ops.map((o) => o.op)).toEqual(['insert', 'delete']);
    expect(ops[1].id).toBe('miller-may');
  });

  it('clears every duplicate of a month, not just the first', () => {
    // Insert-before-delete tolerates a mid-save failure leaving a duplicate;
    // the next save has to clean up all of them or they accumulate.
    const existing = [
      saved('dup-1', '2026-02', MASTER, 185478),
      saved('dup-2', '2026-02', MASTER, 185478),
    ];
    const ops = planMonthSave(existing, [incoming('2026-02', MASTER, 190000)]);
    expect(ops.map((o) => o.op)).toEqual(['insert', 'delete', 'delete']);
    expect(ops.slice(1).map((o) => o.id).sort()).toEqual(['dup-1', 'dup-2']);
  });

  it('plans each month of a multi-month upload independently', () => {
    const existing = [saved('jun', '2026-06', FEED, 99000)];
    const ops = planMonthSave(existing, [incoming('2026-06', FEED, 99338), incoming('2026-07', FEED, 116706)]);
    expect(ops.map((o) => o.op)).toEqual(['insert', 'delete', 'insert']);
    expect(ops[1].id).toBe('jun');
  });
});
