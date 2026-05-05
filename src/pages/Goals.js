import React from 'react';
import { ModulePage, ModuleSection, MetricGrid, Pill } from '../components/ModuleShell.js';
import { TimeSeriesChart } from '../components/TimeSeriesChart.js';
import { reductionTargets, targetTrajectoryAt, trajectoryStatus } from '../data/targets.js';
import { GRID_MIX_TOTAL_MTCO2E } from '../data/gridMix.js';
import { ANNUAL_SEQUESTRATION_MT } from '../data/sinks.js';
import { SCOPE1_TOTAL_MT, SCOPE2_TOTAL_MT, SCOPE3_TOTAL_MT, GROSS_MT } from '../data/scopeTotals.js';

// Goals & Targets — KUA's reduction pathway. Each target shows a
// linear trajectory between baseline and target year, with the current
// measured value plotted against it. Status pill says on-track,
// lagging, or off-track.

const CURRENT_YEAR = 2026;

// "Actual" snapshot now derived from the single-source-of-truth
// scope totals — flows through automatically when measured data lands.
const ACTUAL_BY_SCOPE = {
  gross: GROSS_MT,
  scope1: SCOPE1_TOTAL_MT,
  scope2: SCOPE2_TOTAL_MT,
  scope3: SCOPE3_TOTAL_MT,
  net: GROSS_MT - ANNUAL_SEQUESTRATION_MT,
  energy_kwh: 2316469,
};

const SCOPE_ACCENT = {
  gross: '#fbbf24',
  scope1: '#ef4444',
  scope2: '#22d3ee',
  scope3: '#a855f7',
  net: '#86efac',
};

const STATUS_KIND = {
  on_track: 'good',
  lagging:  'warn',
  off_track: 'bad',
};

const STATUS_LABEL = {
  on_track: 'On track',
  lagging:  'Lagging',
  off_track: 'Off track',
};

export default function Goals() {
  return (
    <ModulePage
      title="Goals & Targets"
      subtitle="The reduction pathway KUA is committing to. Each target shows the linear trajectory between baseline and target year, plus the most recent measured value plotted against it."
    >
      <MetricGrid metrics={[
        { label: 'Active targets',  value: reductionTargets.length, accent: '#22d3ee' },
        { label: 'Approved',        value: reductionTargets.filter((t) => t.approved).length,                 accent: '#86efac', note: 'Board-ratified' },
        { label: 'Earliest deadline', value: Math.min(...reductionTargets.map((t) => t.targetYear)),          accent: '#fbbf24' },
        { label: 'Net-zero year',   value: reductionTargets.find((t) => t.scope === 'net')?.targetYear ?? '—', accent: '#22c55e' },
      ]} />

      {reductionTargets.map((target) => {
        const actual = ACTUAL_BY_SCOPE[target.scope === 'scope3' && target.id === 'tg_dining_2028' ? 'dining' : target.scope] ?? target.baselineValue;
        // Dining target uses a sub-slice of Scope 3, not the whole.
        const actualForTarget = target.id === 'tg_dining_2028' ? 800 : actual;
        const status = trajectoryStatus(target, actualForTarget, CURRENT_YEAR);
        const accent = SCOPE_ACCENT[target.scope] || '#22d3ee';

        // Build the trajectory series + a measured marker at the current year.
        const series = [];
        for (let y = target.baselineYear; y <= target.targetYear; y++) {
          series.push({ t: new Date(`${y}-07-01T00:00:00Z`).toISOString(), v: targetTrajectoryAt(target, y) });
        }
        const expectedNow = targetTrajectoryAt(target, CURRENT_YEAR);
        const reductionAchieved = ((target.baselineValue - actualForTarget) / target.baselineValue) * 100;
        const reductionNeeded   = target.percentReduction;
        const progressPct = Math.max(0, Math.min(100, (reductionAchieved / reductionNeeded) * 100));

        return (
          <ModuleSection
            key={target.id}
            title={target.title}
            hint={target.description}
          >
            <div style={styles.row}>
              <div style={styles.left}>
                <div style={styles.statRow}>
                  <Stat label="Baseline" value={Math.round(target.baselineValue).toLocaleString()} unit={target.scope === 'energy_kwh' ? 'kWh' : 'mtCO₂e'} sub={`${target.baselineYear}`} />
                  <Stat label="Target" value={Math.round(target.baselineValue * (1 - target.percentReduction / 100)).toLocaleString()} unit={target.scope === 'energy_kwh' ? 'kWh' : 'mtCO₂e'} sub={`by ${target.targetYear}`} />
                  <Stat label="Current" value={Math.round(actualForTarget).toLocaleString()} unit={target.scope === 'energy_kwh' ? 'kWh' : 'mtCO₂e'} sub={`${CURRENT_YEAR}`} />
                </div>

                <div style={styles.progressWrap}>
                  <div style={styles.progressLabel}>
                    <span>Progress: {reductionAchieved.toFixed(1)}% reduced of {reductionNeeded}% needed</span>
                    <Pill kind={STATUS_KIND[status]}>{STATUS_LABEL[status]}</Pill>
                  </div>
                  <div style={styles.progressTrack}>
                    <div style={{ ...styles.progressFill, width: `${progressPct}%`, background: accent }} />
                  </div>
                </div>

                <div style={styles.meta}>
                  <span><strong style={{ color: '#cbd5e1' }}>Owner:</strong> {target.owner}</span>
                  <span><strong style={{ color: '#cbd5e1' }}>Status:</strong> {target.approved ? 'Approved' : 'Pending board approval'}</span>
                </div>
              </div>

              <div style={styles.chart}>
                <TimeSeriesChart
                  data={series}
                  unit={target.scope === 'energy_kwh' ? 'kWh' : 'mtCO₂e'}
                  color={accent}
                  fill={`${accent}26`}
                  width={520}
                  height={200}
                  title={`Linear trajectory — ${target.baselineYear} → ${target.targetYear}`}
                />
                <div style={styles.chartFoot}>
                  Trajectory at {CURRENT_YEAR}: <strong style={{ color: '#cbd5e1' }}>{Math.round(expectedNow).toLocaleString()}</strong> {target.scope === 'energy_kwh' ? 'kWh' : 'mtCO₂e'}
                  {' · '}
                  Actual: <strong style={{ color: status === 'on_track' ? '#86efac' : status === 'lagging' ? '#fbbf24' : '#fca5a5' }}>
                    {Math.round(actualForTarget).toLocaleString()}
                  </strong>
                </div>
              </div>
            </div>
          </ModuleSection>
        );
      })}

      <ModuleSection title="Why these specific targets?">
        <ul style={styles.notes}>
          <li>Targets follow the <strong>Science Based Targets initiative (SBTi)</strong> guidance for educational institutions: ~50% absolute reduction by 2030 + net-zero by 2050.</li>
          <li>Sub-targets (Scope 2 by 2027, dining by 2028) are <strong>milestones</strong>, not the whole picture — they're tracked because they're where KUA has the most direct control.</li>
          <li>"Approved" means the Board of Trustees has ratified the figure. Until then everything on this page is <strong>preliminary</strong> and shouldn't appear in external reporting.</li>
        </ul>
      </ModuleSection>
    </ModulePage>
  );
}

function Stat({ label, value, unit, sub }) {
  return (
    <div style={styles.stat}>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>
        {value}<span style={styles.statUnit}>{unit}</span>
      </div>
      <div style={styles.statSub}>{sub}</div>
    </div>
  );
}

const styles = {
  row: { display: 'grid', gap: 16, gridTemplateColumns: 'minmax(280px, 1fr) minmax(360px, 2fr)', alignItems: 'flex-start' },
  left: {},
  statRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 },
  stat: { padding: 10, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6 },
  statLabel: { fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 },
  statValue: { fontSize: 18, color: '#e5e7eb', fontWeight: 800, marginTop: 4, fontVariantNumeric: 'tabular-nums' },
  statUnit: { fontSize: 10, color: '#94a3b8', marginLeft: 4, fontWeight: 500 },
  statSub: { fontSize: 11, color: '#64748b', marginTop: 4 },

  progressWrap: { marginBottom: 10 },
  progressLabel: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#94a3b8', marginBottom: 6 },
  progressTrack: { height: 12, background: '#0f172a', border: '1px solid #1f2937', borderRadius: 6, overflow: 'hidden' },
  progressFill: { height: '100%' },

  meta: { display: 'flex', gap: 16, fontSize: 12, color: '#94a3b8', flexWrap: 'wrap' },
  chart: {},
  chartFoot: { marginTop: 8, fontSize: 12, color: '#94a3b8' },

  notes: { margin: 0, paddingLeft: 22, color: '#cbd5e1', fontSize: 14, lineHeight: 1.7 },
};
