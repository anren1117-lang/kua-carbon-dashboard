import React from 'react';
import { ModulePage, ModuleSection, MetricGrid, Pill } from '../components/ModuleShell.js';
import { ProvenancePill } from '../components/ProvenancePill.js';
import { TimeSeriesChart } from '../components/TimeSeriesChart.js';
import { BMS_EXPORT_META, bmsExportMeters } from '../data/bmsExportApr2026.js';
import { buildings } from '../data/buildings.js';
import { envysionSnapshot } from '../data/envysionSnapshot.js';
import { reductionActions } from '../data/reductionActions.js';
import { GRID_MIX_TOTAL_KWH, GRID_MIX_TOTAL_MTCO2E } from '../data/gridMix.js';
import { monthlyPattern } from '../data/seasonalPatterns.js';
import { campusMonthlyTotals } from '../data/monthlyConsumption.js';
import { buildingHotspots, rankActions } from '../utils/hotspots.js';
import { getBmsMeterMap } from '../data/bmsExportMapping.js';
import { COMPOSED_ANNUALIZE_FACTOR, COMPOSED_ANNUAL_KWH } from '../data/composedYtd.js';
import { GRID_MIX_ANNUAL_MTCO2E } from '../data/gridMix.js';

// Hotspots — ranked view of where emissions are concentrated. Combines a
// magnitude rollup (per-building electricity) with a category-level summary
// and overlays the top suggested actions from the AI advisor.

const KG_PER_KWH_ISO_NE = (GRID_MIX_TOTAL_MTCO2E * 1000) / GRID_MIX_TOTAL_KWH; // ≈ 0.235 (output basis)

export default function Hotspots() {
  const buildingsById = Object.fromEntries(buildings.map((b) => [b.id, b]));
  // Per-building kWh: prefer BMS-mapped measured data, fall back to
  // envysionSnapshot. Same priority ladder as /buildings — Hotspots
  // should rank from the same source of truth, not a different one.
  // Both sources annualized the same way so values across rows are
  // comparable (envysionSnapshot is YTD through 2026-05-03, not annual).
  const meterMap = getBmsMeterMap();
  const bmsByBuilding = {};
  for (const m of bmsExportMeters) {
    if (m.direction === 'stuck') continue;
    const bId = meterMap[m.id];
    if (!bId) continue;
    bmsByBuilding[bId] = (bmsByBuilding[bId] || 0) + m.totalKwh * COMPOSED_ANNUALIZE_FACTOR;
  }
  // Snapshot rows are YTD; annualize for comparability.
  const snapshotByBuilding = Object.fromEntries(envysionSnapshot.map((r) => [r.buildingId, r.energyUsedKwh * COMPOSED_ANNUALIZE_FACTOR]));
  const buildingsKwh = buildings.map((b) => ({
    id: b.id,
    name: b.name,
    kwh: bmsByBuilding[b.id] ?? snapshotByBuilding[b.id] ?? 0,
    source: bmsByBuilding[b.id] !== undefined ? 'bms' : (snapshotByBuilding[b.id] !== undefined ? 'snapshot' : 'none'),
  })).filter((b) => b.kwh > 0);
  // Sum of buildings is what we have data for; canonical campus total
  // comes from composedYtd. They differ because not every building is
  // mapped + in envysionSnapshot. Show both honestly.
  const sumOfBuildings = buildingsKwh.reduce((s, b) => s + b.kwh, 0);
  const totalKwh = COMPOSED_ANNUAL_KWH;
  const ranked = buildingHotspots(buildingsKwh, totalKwh, KG_PER_KWH_ISO_NE);

  // Categories rolled up from the same kWh source the rank uses.
  const byCategory = {};
  for (const b of buildingsKwh) {
    const cat = buildingsById[b.id]?.category ?? 'Other';
    byCategory[cat] = (byCategory[cat] || 0) + b.kwh;
  }
  const categoryRows = Object.entries(byCategory)
    .map(([category, kwh]) => ({
      category,
      kwh,
      mt: (kwh * KG_PER_KWH_ISO_NE) / 1000,
      share: (kwh / totalKwh) * 100,
    }))
    .sort((a, b) => b.kwh - a.kwh);

  const topActions = rankActions(reductionActions).slice(0, 5);

  const totalMt = GRID_MIX_ANNUAL_MTCO2E;
  const buildingsCoverage = (sumOfBuildings / totalKwh) * 100;
  const top3Share = ranked.slice(0, 3).reduce((s, h) => s + h.percentOfTotal, 0);

  // Annual emissions trend.
  // - Months we have measured BMS data for: use displayedTotal × ISO-NE factor.
  // - Months we don't: fall back to the synthetic seasonal-pattern shape,
  //   apportioned across the canonical Year 1 Scope 2 budget so the y-axis
  //   sits at the right magnitude (monthlyPattern.emissions itself is
  //   calibrated to a legacy ~213 mt baseline — we'd undercount otherwise).
  // The two are merged into a single series; the chart hint flags which
  // months are real vs projected.
  const measuredMonths = Object.fromEntries(
    campusMonthlyTotals().map((r) => [r.month, r.displayedTotal]),
  );
  const _multSum = monthlyPattern.reduce((s, m) => s + m.multiplier, 0);
  const trendSeries = monthlyPattern.map((m, i) => {
    const monthKey = `2026-${String(i + 1).padStart(2, '0')}`;
    const measuredKwh = measuredMonths[monthKey];
    const measured = measuredKwh != null;
    const projectedMt = (m.multiplier / _multSum) * GRID_MIX_ANNUAL_MTCO2E;
    const mt = measured
      ? (measuredKwh * KG_PER_KWH_ISO_NE) / 1000
      : projectedMt;
    return {
      t: new Date(2026, i, 15).toISOString(),
      v: mt,
      measured,
    };
  });
  const measuredMonthCount = Object.keys(measuredMonths).length;

  return (
    <ModulePage
      title="Carbon Hotspots"
      subtitle="Where emissions are concentrated, ordered by magnitude. Top of the list is where any reduction effort gets the most leverage per hour spent."
    >
      <MetricGrid metrics={[
        { label: 'Campus electricity', value: Math.round(totalKwh).toLocaleString(), unit: 'kWh/yr', accent: '#fbbf24', note: 'Year 1 from composedYtd' },
        { label: 'Equivalent emissions', value: totalMt.toFixed(1), unit: 'mtCO₂e', accent: '#ef4444' },
        { label: 'Building-level coverage', value: `${buildingsCoverage.toFixed(0)}%`, accent: buildingsCoverage > 80 ? '#22c55e' : '#f59e0b', note: `${Math.round(sumOfBuildings).toLocaleString()} kWh sum of ranked rows below` },
        { label: 'Top 3 buildings', value: `${top3Share.toFixed(0)}%`, unit: 'of campus', accent: '#22d3ee', note: 'Concentration of impact' },
        { label: 'Open actions', value: reductionActions.filter((a) => a.status === 'proposed' || a.status === 'in_progress').length, unit: 'in queue', accent: '#86efac' },
      ]} />

      <ModuleSection
        title="Monthly emissions trend"
        hint={
          <>
            Monthly mtCO₂e for the campus. {measuredMonthCount > 0 ? <strong>{measuredMonthCount} month{measuredMonthCount === 1 ? '' : 's'} of real BMS data</strong> : 'No measured months yet'}{measuredMonthCount > 0 ? ` (${Object.keys(measuredMonths).join(', ')})` : ''} — remaining months use the seasonal-pattern proxy until the BMS feeds them in. Hover any point: ● = measured, ○ = projected.
          </>
        }
      >
        <div style={hsStyles.trendProv}>
          <div style={hsStyles.trendProvRow}>
            <ProvenancePill provenance="measured" />
            <span style={hsStyles.trendProvLabel}>Months {Object.keys(measuredMonths).map((k) => k.slice(5)).join(', ') || '(none yet)'}</span>
          </div>
          <div style={hsStyles.trendMethod}><span style={hsStyles.trendMethodLabel}>Today:</span> KUA Distech Eclypse BMS All Meters page, monthly displayed totals × ISO-NE 2024 grid factor (0.235 kg/kWh effective). One row per measured month at <code>src/data/monthlyConsumption.js</code>.</div>
          <div style={hsStyles.trendMethod}><span style={hsStyles.trendMethodLabel}>Target:</span> Add a measured row each month as the BMS export ships. By Jan 2027 the full year is measured and the projected segment disappears.</div>
          <div style={{ ...hsStyles.trendProvRow, marginTop: 14, paddingTop: 14, borderTop: '1px solid #1f2937' }}>
            <ProvenancePill provenance="estimated" />
            <span style={hsStyles.trendProvLabel}>Months {monthlyPattern.map((_, i) => `2026-${String(i + 1).padStart(2, '0')}`).filter((k) => !measuredMonths[k]).map((k) => k.slice(5)).join(', ') || '(none — full year measured)'}</span>
          </div>
          <div style={hsStyles.trendMethod}><span style={hsStyles.trendMethodLabel}>Today:</span> Synthetic seasonal-pattern shape (winter heating peak, summer trough) from <code>src/data/seasonalPatterns.js</code>, scaled to plausible NH boarding-school monthly magnitudes. Pattern shape is informed by ISO-NE seasonal load curves; absolute values are placeholders.</div>
          <div style={hsStyles.trendMethod}><span style={hsStyles.trendMethodLabel}>Target:</span> Each month flips estimated → measured the moment its BMS export is added to monthlyConsumption.js. The seasonal-pattern proxy is purely a placeholder until then; it will be removed entirely once a full year is captured.</div>
        </div>
        <TimeSeriesChart
          data={trendSeries}
          unit="mtCO₂e"
          color="#ef4444"
          fill="rgba(239, 68, 68, 0.12)"
          width={900}
          height={220}
          title={measuredMonthCount > 0 ? `Jan → Dec, monthly mtCO₂e (${measuredMonthCount} measured + ${12 - measuredMonthCount} projected)` : 'Jan → Dec, monthly mtCO₂e (all projected)'}
        />
      </ModuleSection>

      {(() => {
        // Build a campus-daily series from the parsed BMS export. PM_03
        // is the largest single MainFeed in the export (35,472 kWh over
        // 30 days), used here as a proxy for the campus daily pattern.
        // When more PM devices are mapped to buildings, this can sum
        // across all the mapped main feeds for a proper campus total.
        const PM_KEY = 'PM_03_MainFeed';
        const meter = bmsExportMeters.find((m) => m.id === PM_KEY);
        if (!meter || !meter.daily?.length) return null;
        const dailySeries = meter.daily.map((d) => {
          // Parse "YYYY-MM-DD" as a local-midnight Date so the chart's
          // tooltip renders the same calendar day across timezones.
          // Passing the raw string would let TimeSeriesChart's
          // new Date(string) treat it as UTC midnight, which back-rolls
          // a day in any negative-offset zone (Apr 15 → Apr 14 in ET).
          const [yyyy, mm, dd] = d.date.split('-').map((s) => parseInt(s, 10));
          return {
            t: new Date(yyyy, mm - 1, dd),
            v: +(d.kwh * KG_PER_KWH_ISO_NE / 1000).toFixed(3), // mtCO₂e
            measured: true,
          };
        });
        const totalKwh = meter.daily.reduce((s, d) => s + d.kwh, 0);
        const totalMt  = totalKwh * KG_PER_KWH_ISO_NE / 1000;
        return (
          <ModuleSection
            title="Daily emissions — BMS export window"
            hint={`Real measured daily data from the parsed Distech Eclypse Meter Trends export. Source: ${PM_KEY}. ${meter.daily.length} days of measured data, ${BMS_EXPORT_META.windowStartIso.slice(0, 10)} → ${BMS_EXPORT_META.windowEndIso.slice(0, 10)}.`}
          >
            <div style={hsStyles.trendProv}>
              <div style={hsStyles.trendProvRow}>
                <ProvenancePill provenance="measured" />
                <span style={hsStyles.trendProvLabel}>{meter.daily.length} days · {Math.round(totalKwh).toLocaleString()} kWh · {totalMt.toFixed(1)} mtCO₂e</span>
              </div>
              <div style={hsStyles.trendMethod}>
                <span style={hsStyles.trendMethodLabel}>Today:</span>
                Daily kWh totals from the parsed BMS export ({PM_KEY} cumulative kWh diffs) × ISO-NE 2024 grid factor (~0.235 kg/kWh effective). Solid dots — every point is measured.
              </div>
              <div style={hsStyles.trendMethod}>
                <span style={hsStyles.trendMethodLabel}>Target:</span>
                Once more PM main-feed devices are mapped to buildings on /admin/bms-export, this series sums across ALL main feeds for a true campus total. Today it uses just PM_03 as a proxy.
              </div>
            </div>
            <TimeSeriesChart
              data={dailySeries}
              unit="mtCO₂e"
              color="#22c55e"
              fill="rgba(34, 197, 94, 0.12)"
              width={900}
              height={200}
              title={`Daily mtCO₂e from PM_03_MainFeed (measured)`}
            />
          </ModuleSection>
        );
      })()}

      <ModuleSection
        title="Highest-emitting buildings"
        hint="Severity is set by share of total: high ≥ 8%, medium ≥ 3%."
      >
        <div style={styles.list}>
          {ranked.map((h) => (
            <div key={h.id} style={styles.row}>
              <div style={styles.rowLeft}>
                <span style={styles.rank}>#{ranked.indexOf(h) + 1}</span>
                <div>
                  <div style={styles.rowTitle}>{h.name}</div>
                  <div style={styles.rowMeta}>
                    {h.mtCO2eAnnual.toFixed(1)} mtCO₂e/yr · {h.percentOfTotal.toFixed(1)}% of campus
                  </div>
                </div>
              </div>
              <Pill kind={h.severity === 'high' ? 'bad' : h.severity === 'medium' ? 'warn' : 'neutral'}>
                {h.severity}
              </Pill>
            </div>
          ))}
        </div>
      </ModuleSection>

      <ModuleSection
        title="By building category"
        hint="Aggregated across all buildings of each type."
      >
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Category</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>kWh/yr</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>mtCO₂e/yr</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Share</th>
            </tr>
          </thead>
          <tbody>
            {categoryRows.map((r) => (
              <tr key={r.category}>
                <td style={styles.td}>{r.category}</td>
                <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{Math.round(r.kwh).toLocaleString()}</td>
                <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{r.mt.toFixed(1)}</td>
                <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{r.share.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ModuleSection>

      <ModuleSection
        title="Top recommended actions"
        hint="Suggested by the rule-based advisor — see the Actions page for the full list."
      >
        <div style={styles.actionList}>
          {topActions.map(({ action }) => (
            <div key={action.id} style={styles.actionRow}>
              <div style={styles.actionHead}>
                <div style={styles.actionTitle}>{action.title}</div>
                <Pill kind={action.urgency === 'high' ? 'bad' : action.urgency === 'medium' ? 'warn' : 'neutral'}>
                  {action.urgency} urgency
                </Pill>
              </div>
              <div style={styles.actionMeta}>
                ~{action.expectedReductionMtCO2e} mtCO₂e/yr · {action.estimatedCostUsd === 0 ? 'no cost' : `$${action.estimatedCostUsd.toLocaleString()}`} · {action.owner}
              </div>
            </div>
          ))}
        </div>
      </ModuleSection>
    </ModulePage>
  );
}

const hsStyles = {
  trendProv: { padding: '12px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8, marginBottom: 14 },
  trendProvRow: { display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 },
  trendProvLabel: { fontSize: 13, color: '#e5e7eb', fontWeight: 600, fontVariantNumeric: 'tabular-nums' },
  trendMethod: { fontSize: 12, color: '#cbd5e1', lineHeight: 1.6, marginTop: 4 },
  trendMethodLabel: { color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase', fontSize: 10, letterSpacing: 0.7, marginRight: 6 },
};

const styles = {
  list: { display: 'grid', gap: 8 },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 },
  rowLeft: { display: 'flex', alignItems: 'center', gap: 14 },
  rank: { fontSize: 13, color: '#64748b', fontWeight: 700, fontVariantNumeric: 'tabular-nums', minWidth: 32 },
  rowTitle: { fontSize: 15, color: '#e5e7eb', fontWeight: 600 },
  rowMeta: { fontSize: 13, color: '#94a3b8', marginTop: 4 },

  table: { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
  th: { textAlign: 'left', padding: '10px 8px', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontSize: 11, borderBottom: '1px solid #1f2937', fontWeight: 700 },
  td: { padding: '10px 8px', color: '#cbd5e1', borderBottom: '1px solid #1f2937' },

  actionList: { display: 'grid', gap: 10 },
  actionRow: { padding: '14px 16px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 },
  actionHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' },
  actionTitle: { fontSize: 15, color: '#e5e7eb', fontWeight: 600 },
  actionMeta: { fontSize: 13, color: '#94a3b8', marginTop: 8 },
};
