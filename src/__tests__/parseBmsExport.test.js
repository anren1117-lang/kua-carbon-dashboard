import { describe, it, expect } from 'vitest';
import { parseMeterTrendsHourly, parseCsv } from '../data/parseBmsExport.js';

// One hourly CSV with three meters:
//   PM_01_MainFeed  — a normal consumption counter, +10 kWh/h
//   PM_02_SolarFeed — bidirectional, counting DOWN while exporting
//   PM_03_DeadFeed  — stuck: the counter never moves
function hourlyCsv(hours = 6, startIso = '2026-08-17T00:00:00.000') {
  const header = [
    'timestamp',
    'PM_01_MainFeed_TotalKilowattHours',
    'PM_01_MainFeed_TotalPeakDemand',
    'PM_02_SolarFeed_TotalKilowattHours',
    'PM_03_DeadFeed_TotalKilowattHours',
    'PM_01_MainFeed_MeasuredVoltage_L1_L2',
  ].join(',');
  const rows = [];
  const start = new Date(startIso);
  for (let i = 0; i < hours; i++) {
    const t = new Date(start.getTime() + i * 3600000);
    const stamp = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}T${String(t.getHours()).padStart(2, '0')}:00:00.000`;
    rows.push([stamp, 1000 + 10 * i, 12.5, 5000 - 3 * i, 777, 208].join(','));
  }
  return [header, ...rows].join('\n');
}

describe('parseMeterTrendsHourly', () => {
  it('summarises each meter and ignores non-energy columns', () => {
    const { meta, meters } = parseMeterTrendsHourly(hourlyCsv(), 'MeterTrends_test.csv');
    expect(meta.meterCount).toBe(3);           // voltage column doesn't make a meter
    expect(meta.hoursCovered).toBe(6);
    expect(meta.sourceFile).toBe('MeterTrends_test.csv');
    expect(meters.map((m) => m.id).sort()).toEqual(['PM_01_MainFeed', 'PM_02_SolarFeed', 'PM_03_DeadFeed']);
  });

  it('reads a rising counter as consumption', () => {
    const { meters } = parseMeterTrendsHourly(hourlyCsv());
    const main = meters.find((m) => m.id === 'PM_01_MainFeed');
    expect(main.direction).toBe('consumption');
    expect(main.totalKwh).toBe(50);            // 5 intervals × 10 kWh
    expect(main.avgKw).toBe(10);
    expect(main.peakKw).toBe(12.5);            // from the TotalPeakDemand column
  });

  it('reads a falling counter as generation and keeps the magnitude', () => {
    const { meters } = parseMeterTrendsHourly(hourlyCsv());
    const solar = meters.find((m) => m.id === 'PM_02_SolarFeed');
    expect(solar.direction).toBe('generation');
    expect(solar.totalKwh).toBe(15);           // |−3| × 5 intervals
    expect(solar.signedCumulative).toBe(-15);
  });

  it('reports a stuck counter as zero rather than as a real reading', () => {
    const { meters } = parseMeterTrendsHourly(hourlyCsv());
    const dead = meters.find((m) => m.id === 'PM_03_DeadFeed');
    expect(dead.direction).toBe('stuck');
    expect(dead.totalKwh).toBe(0);
  });

  it('keeps the honest-synthesis invariant: hourly buckets reconcile with the daily totals', () => {
    const { meters } = parseMeterTrendsHourly(hourlyCsv(24));
    const main = meters.find((m) => m.id === 'PM_01_MainFeed');
    const dailySum = main.daily.reduce((s, d) => s + d.kwh, 0);
    expect(+dailySum.toFixed(1)).toBe(main.totalKwhIntegrated);
    expect(Math.abs(dailySum - main.totalKwh)).toBeLessThanOrEqual(0.1);
  });

  it('refuses a file that is not a Meter Trends export', () => {
    expect(() => parseMeterTrendsHourly('date,value\n2026-01-01,5')).toThrow(/timestamp/);
  });

  it('refuses a file with nothing to diff', () => {
    expect(() => parseMeterTrendsHourly('timestamp,PM_01_MainFeed_TotalKilowattHours\n2026-01-01T00:00:00.000,1')).toThrow(/two readings/);
  });

  it('parseCsv drops blank trailing lines', () => {
    const { header, rows } = parseCsv('timestamp,a\n2026-01-01T00:00:00.000,1\n\n');
    expect(header).toEqual(['timestamp', 'a']);
    expect(rows).toHaveLength(1);
  });
});
