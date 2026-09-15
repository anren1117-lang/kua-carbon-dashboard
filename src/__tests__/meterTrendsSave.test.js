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

  it('ignores building-level rows when looking for what to replace', () => {
    const ops = planMonthSave([saved('b1', '2026-05', FEED, 5000, { building: 'b_miller' })], [incoming('2026-05', FEED, 141633)]);
    expect(ops.map((o) => o.op)).toEqual(['insert']);
  });

  it('plans each month of a multi-month upload independently', () => {
    const existing = [saved('jun', '2026-06', FEED, 99000)];
    const ops = planMonthSave(existing, [incoming('2026-06', FEED, 99338), incoming('2026-07', FEED, 116706)]);
    expect(ops.map((o) => o.op)).toEqual(['insert', 'delete', 'insert']);
    expect(ops[1].id).toBe('jun');
  });
});
