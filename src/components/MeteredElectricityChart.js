import React from 'react';
import { TimeSeriesChart } from './TimeSeriesChart.js';
import { ExplainChart } from './ExplainChart.js';
import { METERED_DAILY, METERED_TOTALS, METERED_MONTH_META } from '../data/meteredMonth.js';

// "Measured electricity — last 30 days." Real whole-campus grid draw from
// the Envysion power-meter export, rendered on the dep-free TimeSeriesChart
// and paired with the AI "explain this chart" caption. Unlike the Fermi
// Scope 2 estimate elsewhere on the dashboard, every point here is metered.

const series = METERED_DAILY.map((d) => ({ t: d.date, v: d.kwh }));

const chartForAI = {
  title: 'KUA measured campus electricity — daily, Aug 16 to Sep 14 2026',
  summary:
    'Whole-campus grid electricity consumption per day (kWh), measured hourly by ~110 building power meters and summed without double-counting. The school year starts in early September.',
  unit: 'kWh per day',
  points: series,
  note: `Over the window: ${METERED_TOTALS.kwh.toLocaleString()} kWh total, ${METERED_TOTALS.solarKwh.toLocaleString()} kWh on-site solar. The ~${METERED_TOTALS.grossMtCO2e} mtCO₂e figure is measured kWh × a published grid factor (an estimate, not a measurement). The ~${METERED_TOTALS.annualizedGrossMtCO2e} mtCO₂e/yr figure is a naive ×365 extrapolation of a term-startup month — not an annual estimate; the real year includes the summer trough and the full term.`,
};

function Stat({ label, value, sub, accent }) {
  return (
    <div style={styles.stat}>
      <div style={{ ...styles.statValue, color: accent || '#e5e7eb' }}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
      {sub && <div style={styles.statSub}>{sub}</div>}
    </div>
  );
}

export function MeteredElectricityChart() {
  const t = METERED_TOTALS;
  return (
    <section style={styles.card}>
      <div style={styles.head}>
        <span style={styles.badge}>Measured data</span>
        <h2 style={styles.title}>Campus electricity, measured — {METERED_MONTH_META.windowStart} to {METERED_MONTH_META.windowEnd}</h2>
        <p style={styles.blurb}>
          Real whole-campus grid draw from {METERED_MONTH_META.feedsMetered} building power meters, reported hourly
          and summed so service mains aren't double-counted against their own panels. Daily use rises from about
          2,400 kWh in mid-August, when campus is nearly empty, to about 6,000 kWh in early September as students
          return and the term begins.
        </p>
      </div>

      <div style={styles.statRow}>
        <Stat label="Total, window" value={`${(t.kwh / 1000).toFixed(1)} MWh`} sub={`${t.kwh.toLocaleString()} kWh · measured`} />
        <Stat label="Avg per full day" value={`${t.avgDailyKwh.toLocaleString()}`} sub="kWh/day · measured" />
        <Stat label="On-site solar" value={`${t.solarKwh.toLocaleString()}`} sub="kWh generated · measured" accent="#86efac" />
        <Stat label="Scope 2, gross" value={`${t.grossMtCO2e}`} sub="mtCO₂e · kWh × grid factor" accent="#f59e0b" />
        <Stat label="Annualized" value={`~${t.annualizedGrossMtCO2e}`} sub="mtCO₂e/yr · rough ×365" accent="#64748b" />
      </div>

      <div style={styles.chartWrap}>
        <TimeSeriesChart data={series} unit="kWh" width={1040} height={260} color="#22d3ee" />
      </div>
      <p style={styles.caption}>
        The bend near September 1 is the term start. The final point (Sep 14) is a partial day, ending 19:00 — its dip
        is truncation, not a real drop in use.
      </p>

      <p style={styles.foot}>
        Only the kWh and solar figures above are metered. The Scope 2 number multiplies measured kWh by a published
        ISO-NE grid factor (0.235 kg/kWh), so it's an estimate. The annualized figure is a naive ×365 extrapolation of
        this term-startup month — it lands in the same order of magnitude as the dashboard's modeled ~385 mtCO₂e/yr, but
        both share that grid factor and both extrapolate from partial windows, so read it as a sanity check on measured
        kWh, not a validated annual total.
      </p>

      <ExplainChart chart={chartForAI} label="Explain this chart with AI" />
    </section>
  );
}

const styles = {
  card: { maxWidth: 1100, margin: '24px auto 0', padding: '24px 28px', background: '#0f172a', border: '1px solid #1f2937', borderRadius: 14 },
  head: { marginBottom: 16 },
  badge: {
    display: 'inline-block',
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#67e8f9',
    background: '#082f36',
    border: '1px solid #155e6b',
    padding: '3px 9px',
    borderRadius: 999,
    marginBottom: 10,
  },
  title: { fontSize: 22, fontWeight: 700, color: '#e5e7eb', margin: 0, letterSpacing: '-0.01em' },
  blurb: { fontSize: 14, color: '#94a3b8', maxWidth: 760, marginTop: 8, lineHeight: 1.6 },
  statRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: 12,
    margin: '4px 0 18px',
  },
  stat: { padding: '12px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 10 },
  statValue: { fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' },
  statLabel: { fontSize: 12, color: '#cbd5e1', marginTop: 4, fontWeight: 600 },
  statSub: { fontSize: 11, color: '#64748b', marginTop: 2 },
  chartWrap: { width: '100%' },
  caption: { fontSize: 12, color: '#94a3b8', lineHeight: 1.55, marginTop: 8, marginBottom: 0 },
  foot: { fontSize: 12.5, color: '#64748b', lineHeight: 1.6, marginTop: 14, marginBottom: 0 },
};

export default MeteredElectricityChart;
