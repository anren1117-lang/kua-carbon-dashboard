import React, { useMemo } from 'react';
import { ModulePage, ModuleSection, MetricGrid, Pill } from '../components/ModuleShell.js';
import { procurementRecords } from '../data/procurement.js';
import { getFactor } from '../data/emissionFactors.js';

const CATEGORY_COLORS = {
  paper:        '#3b82f6',
  it_equipment: '#a855f7',
  cleaning:     '#22c55e',
  apparel:      '#fbbf24',
  lab:          '#06b6d4',
  athletic:     '#ef4444',
};

export default function Procurement() {
  const enriched = useMemo(() => {
    return procurementRecords.map((p) => {
      const f = getFactor(p.factorId);
      const kg = f ? p.spendUsd * f.kgco2e_per_unit : 0;
      return { ...p, kgco2e: kg, factor: f };
    });
  }, []);

  const totalSpend = enriched.reduce((s, p) => s + p.spendUsd, 0);
  const totalMt = enriched.reduce((s, p) => s + p.kgco2e, 0) / 1000;
  const recordCount = enriched.length;

  const byCategory = useMemo(() => {
    const out = {};
    for (const p of enriched) {
      if (!out[p.category]) out[p.category] = { spend: 0, kg: 0, count: 0 };
      out[p.category].spend += p.spendUsd;
      out[p.category].kg += p.kgco2e;
      out[p.category].count += 1;
    }
    return Object.entries(out)
      .map(([category, v]) => ({ category, ...v, mt: v.kg / 1000 }))
      .sort((a, b) => b.kg - a.kg);
  }, [enriched]);

  return (
    <ModulePage
      title="Procurement"
      subtitle="Paper, IT, cleaning, apparel, and other purchased goods. Emissions estimated using the EPA EEIO v2.0 spend-based factors — useful for screening high-impact categories before deeper LCA work."
    >
      <MetricGrid metrics={[
        { label: 'Total spend',     value: `$${totalSpend.toLocaleString()}`, accent: '#fbbf24' },
        { label: 'Estimated emissions', value: totalMt.toFixed(2), unit: 'mtCO₂e', accent: '#ef4444', note: 'Spend-based estimate' },
        { label: 'Records tracked', value: recordCount, accent: '#22d3ee' },
        { label: 'Categories',      value: byCategory.length, accent: '#86efac' },
      ]} />

      <ModuleSection
        title="Emissions by category"
        hint="Spend-based factors are coarse — a $10k IT order with energy-efficient hardware will look the same here as one without. Switch to product-level factors when supplier data is available."
      >
        <div style={styles.catList}>
          {byCategory.map((c) => {
            const share = totalMt > 0 ? (c.mt / totalMt) * 100 : 0;
            return (
              <div key={c.category} style={styles.catRow}>
                <div style={styles.catLeft}>
                  <span style={{ ...styles.dot, background: CATEGORY_COLORS[c.category] || '#94a3b8' }} />
                  <span style={styles.catName}>{c.category.replace('_', ' ')}</span>
                  <Pill kind="info">{c.count} records</Pill>
                </div>
                <div style={styles.catTrack}>
                  <div style={{ ...styles.catFill, width: `${share}%`, background: CATEGORY_COLORS[c.category] || '#94a3b8' }} />
                </div>
                <div style={styles.catNums}>
                  <div>{c.mt.toFixed(2)} mt</div>
                  <div style={styles.catSub}>${c.spend.toLocaleString()} · {share.toFixed(0)}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </ModuleSection>

      <ModuleSection
        title="All purchase records"
      >
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Vendor</th>
              <th style={styles.th}>Category</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Qty</th>
              <th style={styles.th}>Unit</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Spend</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>kg CO₂e</th>
            </tr>
          </thead>
          <tbody>
            {enriched.map((p) => (
              <tr key={p.poId}>
                <td style={styles.td}>{p.date}</td>
                <td style={styles.td}>{p.vendor}</td>
                <td style={{ ...styles.td, textTransform: 'capitalize' }}>{p.category.replace('_', ' ')}</td>
                <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{p.quantity}</td>
                <td style={{ ...styles.td, color: '#94a3b8', fontSize: 12 }}>{p.unit}</td>
                <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>${p.spendUsd.toLocaleString()}</td>
                <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{p.kgco2e.toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ModuleSection>
    </ModulePage>
  );
}

const styles = {
  catList: { display: 'grid', gap: 8 },
  catRow: { display: 'grid', gridTemplateColumns: 'minmax(200px, 240px) 1fr minmax(120px, 160px)', gap: 12, alignItems: 'center', padding: '10px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 },
  catLeft: { display: 'flex', alignItems: 'center', gap: 10 },
  dot: { width: 10, height: 10, borderRadius: 999 },
  catName: { fontSize: 13, color: '#e5e7eb', textTransform: 'capitalize', fontWeight: 600 },
  catTrack: { height: 10, background: '#0f172a', borderRadius: 5, overflow: 'hidden' },
  catFill: { height: '100%' },
  catNums: { textAlign: 'right', fontSize: 13, color: '#e5e7eb', fontVariantNumeric: 'tabular-nums' },
  catSub: { fontSize: 11, color: '#64748b', marginTop: 2 },

  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { textAlign: 'left', padding: '10px 8px', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontSize: 11, borderBottom: '1px solid #1f2937', fontWeight: 700 },
  td: { padding: '10px 8px', color: '#cbd5e1', borderBottom: '1px solid #1f2937' },
};
