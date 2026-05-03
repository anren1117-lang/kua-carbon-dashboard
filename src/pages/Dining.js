import React, { useState, useMemo } from 'react';
import { ModulePage, ModuleSection, MetricGrid, Pill } from '../components/ModuleShell.js';
import { TimeSeriesChart } from '../components/TimeSeriesChart.js';
import { diningMenuItems, diningVendors, ingredientPurchases, foodWasteLogs, menuScenarios } from '../data/dining.js';
import { getFactor } from '../data/emissionFactors.js';

const CATEGORY_COLORS = {
  beef:       '#ef4444',
  pork:       '#a855f7',
  chicken:    '#fbbf24',
  fish:       '#3b82f6',
  vegetarian: '#22c55e',
  vegan:      '#10b981',
  mixed:      '#94a3b8',
};

export default function Dining() {
  const [scenarioId, setScenarioId] = useState(menuScenarios[0]?.id);

  // Roll up servings + emissions per category over the menu window
  const byCategory = useMemo(() => {
    const out = {};
    for (const m of diningMenuItems) {
      if (!out[m.category]) out[m.category] = { servings: 0, kg: 0 };
      out[m.category].servings += m.servingsServed;
      out[m.category].kg += m.servingsServed * m.kgco2ePerServing;
    }
    return out;
  }, []);

  const totalServings = Object.values(byCategory).reduce((s, c) => s + c.servings, 0);
  const totalKg = Object.values(byCategory).reduce((s, c) => s + c.kg, 0);
  const avgKgPerServing = totalServings ? totalKg / totalServings : 0;

  // Vendor + ingredient rollup
  const vendorRows = useMemo(() => {
    const byVendor = {};
    for (const p of ingredientPurchases) {
      const factor = getFactor(p.factorId);
      const kg = factor ? p.quantityKg * factor.kgco2e_per_unit : 0;
      if (!byVendor[p.vendorId]) byVendor[p.vendorId] = { kg: 0, items: 0, spend: 0 };
      byVendor[p.vendorId].kg += kg;
      byVendor[p.vendorId].items += 1;
      byVendor[p.vendorId].spend += p.priceUsd;
    }
    return diningVendors.map((v) => ({
      ...v,
      kg: byVendor[v.id]?.kg ?? 0,
      items: byVendor[v.id]?.items ?? 0,
      spend: byVendor[v.id]?.spend ?? 0,
    })).sort((a, b) => b.kg - a.kg);
  }, []);

  // Waste rollup
  const wasteSummary = useMemo(() => {
    return foodWasteLogs.reduce((acc, w) => ({
      pre: acc.pre + w.preConsumerKg,
      post: acc.post + w.postConsumerKg,
      compost: acc.compost + w.compostedKg,
      landfill: acc.landfill + w.landfillKg,
    }), { pre: 0, post: 0, compost: 0, landfill: 0 });
  }, []);
  const wasteTotal = wasteSummary.pre + wasteSummary.post;
  const wasteDiversion = wasteTotal ? (wasteSummary.compost / (wasteSummary.compost + wasteSummary.landfill)) * 100 : 0;

  const selectedScenario = menuScenarios.find((s) => s.id === scenarioId);

  return (
    <ModulePage
      title="Dining Carbon"
      subtitle="Meals served by category, supplier emissions, food waste, and modeled menu scenarios. Numbers below cover the most recent 90 days of POS data."
    >
      <MetricGrid metrics={[
        { label: 'Meals served (90d)',  value: totalServings.toLocaleString(),       accent: '#22d3ee' },
        { label: 'Dining emissions',    value: (totalKg / 1000).toFixed(1), unit: 'mtCO₂e', accent: '#ef4444' },
        { label: 'Avg per meal',        value: avgKgPerServing.toFixed(2),  unit: 'kg CO₂e', accent: '#fbbf24' },
        { label: 'Waste diversion',     value: wasteDiversion.toFixed(0),   unit: '%',       accent: '#86efac', note: 'Compost / (Compost + Landfill)' },
      ]} />

      <ModuleSection
        title="Emissions by meal category"
        hint="Beef dominates per kg even at modest serving counts. Reducing beef has outsized impact."
      >
        <div style={styles.barList}>
          {Object.entries(byCategory)
            .sort(([, a], [, b]) => b.kg - a.kg)
            .map(([cat, { servings, kg }]) => {
              const share = totalKg ? (kg / totalKg) * 100 : 0;
              return (
                <div key={cat} style={styles.barRow}>
                  <div style={styles.barLeft}>
                    <span style={{ ...styles.dot, background: CATEGORY_COLORS[cat] }} />
                    <span style={styles.barCat}>{cat}</span>
                  </div>
                  <div style={styles.barTrack}>
                    <div style={{ ...styles.barFill, width: `${share}%`, background: CATEGORY_COLORS[cat] }} />
                  </div>
                  <div style={styles.barNums}>
                    <div>{(kg / 1000).toFixed(2)} mt</div>
                    <div style={styles.barSub}>{servings.toLocaleString()} servings · {share.toFixed(0)}%</div>
                  </div>
                </div>
              );
            })}
        </div>
      </ModuleSection>

      <ModuleSection
        title="Suppliers ranked by emissions"
        hint="Local + sustainable certifications shown. Switching beef supply or sourcing produce closer to campus moves the supplier-share figure."
      >
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Vendor</th>
              <th style={styles.th}>Region</th>
              <th style={styles.th}>Certifications</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>kg CO₂e</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Spend</th>
            </tr>
          </thead>
          <tbody>
            {vendorRows.map((v) => (
              <tr key={v.id}>
                <td style={styles.td}>{v.name}</td>
                <td style={styles.td}>{v.region}</td>
                <td style={styles.td}>{v.certifications.length ? v.certifications.join(', ') : '—'}</td>
                <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{v.kg.toFixed(0)}</td>
                <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>${v.spend.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ModuleSection>

      <ModuleSection
        title="Food waste"
        hint="Pre-consumer (kitchen prep) vs post-consumer (plate scrape) over the most recent 60 days."
      >
        <div style={styles.wasteGrid}>
          <WasteCell label="Pre-consumer" value={wasteSummary.pre} color="#fbbf24" />
          <WasteCell label="Post-consumer" value={wasteSummary.post} color="#ef4444" />
          <WasteCell label="Composted" value={wasteSummary.compost} color="#22c55e" />
          <WasteCell label="Landfilled" value={wasteSummary.landfill} color="#6b7280" />
        </div>
        <div style={{ marginTop: 16 }}>
          <TimeSeriesChart
            data={foodWasteLogs.map((w) => ({ t: w.date, v: w.preConsumerKg + w.postConsumerKg }))}
            unit="kg / day"
            color="#fbbf24"
            fill="rgba(251, 191, 36, 0.15)"
            width={900}
            height={200}
            title="Daily food waste (kitchen + plate-scrape combined)"
          />
        </div>
      </ModuleSection>

      <ModuleSection
        title="Menu scenarios — what-if"
        hint="Modeled annual reductions if each scenario were applied campus-wide. Values use Poore & Nemecek 2018 factors."
      >
        <div style={styles.chipRow}>
          {menuScenarios.map((s) => (
            <button
              key={s.id}
              type="button"
              style={{
                ...styles.chip,
                background: scenarioId === s.id ? '#22d3ee' : '#0b1220',
                color: scenarioId === s.id ? '#0b1220' : '#cbd5e1',
                borderColor: scenarioId === s.id ? '#22d3ee' : '#1f2937',
              }}
              onClick={() => setScenarioId(s.id)}
            >
              {s.name}
            </button>
          ))}
        </div>
        {selectedScenario && (
          <div style={styles.scenarioCard}>
            <div style={styles.scenarioHead}>
              <div>
                <div style={styles.scenarioTitle}>{selectedScenario.name}</div>
                <div style={styles.scenarioBody}>{selectedScenario.description}</div>
              </div>
              <div style={styles.scenarioImpact}>
                <div style={styles.scenarioValue}>{selectedScenario.estimatedAnnualReductionMt}</div>
                <div style={styles.scenarioUnit}>mtCO₂e/yr saved</div>
              </div>
            </div>
            <div style={styles.scenarioStats}>
              <span><Pill kind="warn">−{selectedScenario.beefReductionPct}% beef</Pill></span>
              <span><Pill kind="good">+{selectedScenario.vegetarianIncreasePct}% vegetarian</Pill></span>
            </div>
          </div>
        )}
      </ModuleSection>
    </ModulePage>
  );
}

function WasteCell({ label, value, color }) {
  return (
    <div style={{ ...styles.wasteCell, borderTop: `3px solid ${color}` }}>
      <div style={styles.wasteLabel}>{label}</div>
      <div style={styles.wasteValue}>{value.toFixed(0)}</div>
      <div style={styles.wasteUnit}>kg</div>
    </div>
  );
}

const styles = {
  barList: { display: 'grid', gap: 8 },
  barRow: { display: 'grid', gridTemplateColumns: 'minmax(120px, 160px) 1fr minmax(120px, 160px)', gap: 12, alignItems: 'center', padding: '10px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 },
  barLeft: { display: 'flex', alignItems: 'center', gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 999 },
  barCat: { color: '#cbd5e1', textTransform: 'capitalize', fontWeight: 600, fontSize: 14 },
  barTrack: { height: 12, background: '#0f172a', borderRadius: 6, overflow: 'hidden' },
  barFill: { height: '100%' },
  barNums: { textAlign: 'right', fontSize: 13, color: '#e5e7eb', fontVariantNumeric: 'tabular-nums' },
  barSub: { fontSize: 11, color: '#64748b', marginTop: 2 },

  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { textAlign: 'left', padding: '10px 8px', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontSize: 11, borderBottom: '1px solid #1f2937', fontWeight: 700 },
  td: { padding: '10px 8px', color: '#cbd5e1', borderBottom: '1px solid #1f2937' },

  wasteGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 },
  wasteCell: { padding: 14, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 },
  wasteLabel: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 },
  wasteValue: { fontSize: 24, color: '#e5e7eb', fontWeight: 800, marginTop: 6, lineHeight: 1, fontVariantNumeric: 'tabular-nums' },
  wasteUnit: { fontSize: 12, color: '#94a3b8', marginTop: 4 },

  chipRow: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  chip: { padding: '8px 14px', borderRadius: 999, fontSize: 13, border: '1px solid', cursor: 'pointer', fontWeight: 600 },
  scenarioCard: { padding: 18, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 10 },
  scenarioHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 },
  scenarioTitle: { fontSize: 17, color: '#e5e7eb', fontWeight: 700 },
  scenarioBody: { fontSize: 14, color: '#94a3b8', marginTop: 6, lineHeight: 1.6 },
  scenarioImpact: { textAlign: 'right' },
  scenarioValue: { fontSize: 32, color: '#86efac', fontWeight: 800, lineHeight: 1, fontVariantNumeric: 'tabular-nums' },
  scenarioUnit: { fontSize: 11, color: '#64748b', marginTop: 4 },
  scenarioStats: { marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' },
};
