import { describe, it, expect } from 'vitest';
import { uploadToRows } from '../pages/admin/scope2/MeterTrendsUpload.js';

// Daily export with a main feed (+100 kWh/day) and a panel feed (+10 kWh/day).
function dailyCsv(startIso, endIso, { blankPanelDays = [] } = {}) {
  const lines = ['timestamp,PM_01_MainFeed_TotalKilowattHours,PM_01_HP01Feed_TotalKilowattHours,PM_02_PanelFeed_TotalKilowattHours'];
  const end = new Date(`${endIso}T12:00:00Z`);
  let i = 0;
  for (let d = new Date(`${startIso}T12:00:00Z`); d <= end; d.setUTCDate(d.getUTCDate() + 1), i++) {
    const day = d.toISOString().slice(0, 10);
    const panel = blankPanelDays.includes(day) ? '' : String(1000 + 10 * i);
    lines.push(`${day}T00:00:00.000,${5000 + 100 * i},${i},${panel}`);
  }
  return lines.join('\n');
}

describe('uploadToRows — daily Meter Trends export → ledger rows', () => {
  it('writes one campus-wide feed-sum row per month, ending the last month on the last full day', () => {
    const out = uploadToRows(dailyCsv('2026-01-01', '2026-02-03'), 'daily.csv');
    expect(out.skipped).toEqual([]);
    expect(out.rows).toHaveLength(2);
    expect(out.rows[0]).toMatchObject({
      period_start: '2026-01-01', period_end: '2026-01-31', kwh: 3410,
      building: null, source: 'meter_trends_feed_sum', data_quality: 'measured',
    });
    expect(out.rows[1]).toMatchObject({ period_start: '2026-02-01', period_end: '2026-02-02', kwh: 220 });
    expect(out.rows[0].notes).toContain('daily.csv');
  });

  it("skips a first month that starts part-way through", () => {
    const out = uploadToRows(dailyCsv('2026-01-15', '2026-03-01'), 'late.csv');
    expect(out.rows.map((r) => r.period_start)).toEqual(['2026-02-01']);
    expect(out.skipped[0]).toMatchObject({ month: '2026-01' });
    expect(out.skipped[0].reason).toMatch(/part-way/);
  });

  it('saves a month with too much missing feed load as estimated, so it cannot set the scale', () => {
    const blanks = Array.from({ length: 10 }, (_, k) => `2026-01-${String(k + 2).padStart(2, '0')}`);
    const out = uploadToRows(dailyCsv('2026-01-01', '2026-02-01', { blankPanelDays: blanks }), 'gaps.csv');
    expect(out.rows[0].data_quality).toBe('estimated');
  });

  it('finds no days in an hourly export', () => {
    const hourly = ['timestamp,PM_01_MainFeed_TotalKilowattHours', '2026-01-01T00:00:00.000,1', '2026-01-01T01:00:00.000,2'].join('\n');
    const out = uploadToRows(hourly, 'hourly.csv');
    expect(out.dayCount).toBe(0);
    expect(out.rows).toEqual([]);
  });
});
