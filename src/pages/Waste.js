import React, { useMemo } from 'react';
import { ModulePage, ModuleSection, MetricGrid, Pill } from '../components/ModuleShell.js';
import { wasteLogs } from '../data/waste.js';
import { getFactor } from '../data/emissionFactors.js';

const STREAM_COLORS = {
  landfill:   '#6b7280',
  recycling:  '#3b82f6',
  compost:    '#22c55e',
  food_waste: '#fbbf24',
  e_waste:    '#a855f7',
};

const STREAM_FACTOR = {
  landfill:   'ef_waste_landfill_mixed',
  recycling:  'ef_waste_recycling',
  compost:    'ef_waste_compost',
  food_waste: 'ef_waste_compost', // assume composted
};

export default function Waste() {
  const byStream = useMemo(() => {
    const out = {};
    for (const w of wasteLogs) {
      if (!out[w.stream]) out[w.stream] = { kg: 0, mt: 0 };
      out[w.stream].kg += w.kg;
      const f = getFactor(STREAM_FACTOR[w.stream]);
      if (f) out[w.stream].mt += (w.kg * f.kgco2e_per_unit) / 1000;
    }
    return out;
  }, []);

  const totalKg = Object.values(byStream).reduce((s, c) => s + c.kg, 0);
  const totalMt = Object.values(byStream).reduce((s, c) => s + c.mt, 0);
  const divertedKg = (byStream.recycling?.kg ?? 0) + (byStream.compost?.kg ?? 0) + (byStream.food_waste?.kg ?? 0);
  const diversionRate = totalKg ? (divertedKg / totalKg) * 100 : 0;

  // Monthly trend
  const monthly = useMemo(() => {
    const out = {};
    for (const w of wasteLogs) {
      const month = w.date.slice(0, 7);
      if (!out[month]) out[month] = 0;
      out[month] += w.kg;
    }
    return Object.entries(out).sort(([a], [b]) => a.localeCompare(b));
  }, []);
  // Math.max() with no args returns -Infinity, and Math.max(0, ...) on
  // a no-data set returns 0 — either of which would have produced a
  // bar width of NaN/Infinity% below. Floor at 1 so the divisor is
  // safe and empty months render as zero-width bars instead of
  // breaking the layout.
  const peakMonthly = Math.max(1, ...monthly.map(([, kg]) => kg));

  return (
    <ModulePage
      title="Waste & Recycling"
      subtitle="Annual waste streams, diversion rate, and emissions impact. Recycling and composting reduce net emissions because they avoid landfill methane and virgin-material production."
    >
      <MetricGrid metrics={[
        { label: 'Total waste',     value: Math.round(totalKg).toLocaleString(), unit: 'kg/yr', accent: '#94a3b8' },
        { label: 'Net emissions',   value: totalMt.toFixed(2), unit: 'mtCO₂e', accent: '#ef4444', note: 'After avoidance credits' },
        { label: 'Diversion rate',  value: diversionRate.toFixed(0), unit: '%', accent: '#86efac', note: 'Diverted / total' },
        { label: 'Streams tracked', value: Object.keys(byStream).length, accent: '#22d3ee' },
      ]} />

      <ModuleSection
        title="By stream"
        hint="Negative emissions for recycling/compost reflect avoided emissions vs landfill or virgin production (EPA WARM v15)."
      >
        <div style={styles.streamGrid}>
          {Object.entries(byStream)
            .sort(([, a], [, b]) => b.kg - a.kg)
            .map(([stream, { kg, mt }]) => (
              <div key={stream} style={{ ...styles.streamCard, borderLeftColor: STREAM_COLORS[stream] }}>
                <div style={styles.streamHead}>
                  <div style={styles.streamName}>{stream.replace('_', ' ')}</div>
                  <Pill kind={mt < 0 ? 'good' : mt > 1 ? 'bad' : 'neutral'}>
                    {mt > 0 ? `+${mt.toFixed(1)}` : mt.toFixed(1)} mt
                  </Pill>
                </div>
                <div style={styles.streamValue}>{Math.round(kg).toLocaleString()}</div>
                <div style={styles.streamUnit}>kg / yr</div>
                <div style={styles.streamShare}>
                  {totalKg > 0 ? `${((kg / totalKg) * 100).toFixed(0)}% of total stream` : ''}
                </div>
              </div>
            ))}
        </div>
      </ModuleSection>

      <ModuleSection
        title="Monthly trend"
        hint="Total kg waste shipped per month across all streams. Summer dip = students off-campus."
      >
        <div style={styles.barList}>
          {monthly.map(([month, kg]) => (
            <div key={month} style={styles.barRow}>
              <div style={styles.barMonth}>{month}</div>
              <div style={styles.barTrack}>
                <div style={{ ...styles.barFill, width: `${(kg / peakMonthly) * 100}%` }} />
              </div>
              <div style={styles.barValue}>{Math.round(kg).toLocaleString()} kg</div>
            </div>
          ))}
        </div>
      </ModuleSection>

      <ModuleSection
        title="Recent shipments"
        hint="Most-recent rows per stream. Hauler invoices feed this in production."
      >
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Stream</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>kg</th>
              <th style={styles.th}>Hauler</th>
            </tr>
          </thead>
          <tbody>
            {[...wasteLogs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 12).map((w, i) => (
              <tr key={i}>
                <td style={styles.td}>{w.date}</td>
                <td style={{ ...styles.td, textTransform: 'capitalize' }}>{w.stream.replace('_', ' ')}</td>
                <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{w.kg.toLocaleString()}</td>
                <td style={{ ...styles.td, color: '#94a3b8' }}>{w.hauler ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ModuleSection>
    </ModulePage>
  );
}

const styles = {
  streamGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 },
  streamCard: { padding: '14px 16px', background: '#0b1220', border: '1px solid #1f2937', borderLeft: '4px solid #94a3b8', borderRadius: 8 },
  streamHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 8 },
  streamName: { fontSize: 13, color: '#e5e7eb', fontWeight: 700, textTransform: 'capitalize' },
  streamValue: { fontSize: 24, color: '#e5e7eb', fontWeight: 800, lineHeight: 1, fontVariantNumeric: 'tabular-nums' },
  streamUnit: { fontSize: 11, color: '#94a3b8', marginTop: 4 },
  streamShare: { fontSize: 11, color: '#64748b', marginTop: 8 },

  barList: { display: 'grid', gap: 6 },
  barRow: { display: 'grid', gridTemplateColumns: '60px 1fr 100px', gap: 10, alignItems: 'center', padding: '6px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6 },
  barMonth: { fontSize: 12, color: '#94a3b8', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' },
  barTrack: { height: 10, background: '#0f172a', borderRadius: 5, overflow: 'hidden' },
  barFill: { height: '100%', background: '#22d3ee' },
  barValue: { fontSize: 12, color: '#cbd5e1', textAlign: 'right', fontVariantNumeric: 'tabular-nums' },

  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { textAlign: 'left', padding: '10px 8px', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontSize: 11, borderBottom: '1px solid #1f2937', fontWeight: 700 },
  td: { padding: '10px 8px', color: '#cbd5e1', borderBottom: '1px solid #1f2937' },
};
