import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ModulePage, ModuleSection, Pill } from '../components/ModuleShell.js';
import { EducationalCard } from '../components/EducationalCard';
import { SCOPE1_TOTAL_MT, SCOPE2_TOTAL_MT } from '../data/scopeTotals.js';
import { ANNUAL_SEQUESTRATION_MT } from '../data/sinks.js';
import { runScenario } from '../utils/scenarioModel.js';

// /scenarios — interactive what-if simulator. Pulls KUA's canonical
// baseline emissions, lets the visitor turn four knobs (cut
// electricity, electrify heating, install solar, plant trees), and
// shows the live impact on net mtCO2e + a side-by-side bar
// comparison. Every input's math is exposed inline.

// Named slider presets — represent commonly-discussed reduction
// strategies. Visitor clicks one to load all 4 sliders at once
// instead of manually tuning. Adjustable after loading.
const PRESETS = [
  {
    key: 'sbti2030',
    label: 'SBTi 2030 path',
    description: 'Science-Based Targets initiative recommendation for educational institutions: ~50% reduction by 2030 via aggressive efficiency + electrification + solar.',
    inputs: { electricityReductionPct: 25, heatingElectrifyPct: 50, solarKw: 250, treePlantingAcres: 20 },
  },
  {
    key: 'electrification',
    label: 'All-in heat pumps',
    description: 'Maximum heating-fuel electrification with no other reduction effort — tests how much heat pumps alone can move the needle.',
    inputs: { electricityReductionPct: 0, heatingElectrifyPct: 100, solarKw: 0, treePlantingAcres: 0 },
  },
  {
    key: 'solar',
    label: 'Solar-first',
    description: 'Big PV installation (500 kW) + modest other moves — assumes the school invests primarily in on-site renewables.',
    inputs: { electricityReductionPct: 10, heatingElectrifyPct: 25, solarKw: 500, treePlantingAcres: 0 },
  },
  {
    key: 'conservative',
    label: 'Behavioral-only',
    description: 'No capital projects — just efficiency + scheduling. Tests how far KUA can get without big spend.',
    inputs: { electricityReductionPct: 20, heatingElectrifyPct: 0, solarKw: 0, treePlantingAcres: 0 },
  },
];

export default function Scenarios() {
  // Slider state — all knobs start at 0 so initial render shows
  // "no change" (modified = baseline). The visitor explores
  // departures from baseline by moving sliders.
  const [electricityReductionPct, setElectricityReductionPct] = useState(0);
  const [heatingElectrifyPct,     setHeatingElectrifyPct]     = useState(0);
  const [solarKw,                 setSolarKw]                 = useState(0);
  const [treePlantingAcres,       setTreePlantingAcres]       = useState(0);

  const result = useMemo(() => runScenario({
    scope1Mt: SCOPE1_TOTAL_MT,
    scope2Mt: SCOPE2_TOTAL_MT,
    sinksMt:  ANNUAL_SEQUESTRATION_MT,
    electricityReductionPct,
    heatingElectrifyPct,
    solarKw,
    treePlantingAcres,
  }), [electricityReductionPct, heatingElectrifyPct, solarKw, treePlantingAcres]);

  const reset = () => {
    setElectricityReductionPct(0);
    setHeatingElectrifyPct(0);
    setSolarKw(0);
    setTreePlantingAcres(0);
  };

  const applyPreset = (inputs) => {
    setElectricityReductionPct(inputs.electricityReductionPct);
    setHeatingElectrifyPct(inputs.heatingElectrifyPct);
    setSolarKw(inputs.solarKw);
    setTreePlantingAcres(inputs.treePlantingAcres);
  };

  // Detect whether the current slider configuration matches a
  // preset exactly so we can highlight it as "active." A user who
  // tweaks any slider after picking a preset will fall out of
  // active-match (no highlight) — that's intentional, signals the
  // configuration is a custom modification, not a named preset.
  const activePresetKey = PRESETS.find((p) => (
    p.inputs.electricityReductionPct === electricityReductionPct
    && p.inputs.heatingElectrifyPct === heatingElectrifyPct
    && p.inputs.solarKw === solarKw
    && p.inputs.treePlantingAcres === treePlantingAcres
  ))?.key ?? null;

  const hasChanges = electricityReductionPct + heatingElectrifyPct + solarKw + treePlantingAcres > 0;

  return (
    <ModulePage
      title="Reduction scenarios — interactive what-if"
      subtitle="Move the sliders to model what would happen to KUA's net carbon balance under different reduction strategies. Every step exposes its math — no black-box answers."
    >
      <ModuleSection title="Try a named strategy" hint="Each preset loads a commonly-discussed reduction strategy across all 4 sliders. Adjust after loading to see how the math shifts.">
        <div style={styles.presetGrid}>
          {PRESETS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => applyPreset(p.inputs)}
              style={{
                ...styles.presetBtn,
                ...(activePresetKey === p.key ? styles.presetBtnActive : {}),
              }}
            >
              <div style={styles.presetLabel}>{p.label}</div>
              <div style={styles.presetDesc}>{p.description}</div>
            </button>
          ))}
        </div>
      </ModuleSection>

      <ModuleSection title="Turn the knobs" hint="Each slider changes one lever. Math is honest — heat-pump electrification trades Scope 1 for Scope 2 at COP 3, solar offsets Scope 2 at NH typical capacity, etc.">
        <Slider
          label="Cut overall electricity use by"
          unit="%"
          value={electricityReductionPct}
          onChange={setElectricityReductionPct}
          min={0} max={50} step={1}
          color="#fbbf24"
          help="LED retrofits, scheduling, behavioral change. Realistic ceiling for a school: 20–30%."
        />
        <Slider
          label="Electrify heating fuel (oil + propane → heat pumps)"
          unit="%"
          value={heatingElectrifyPct}
          onChange={setHeatingElectrifyPct}
          min={0} max={100} step={5}
          color="#ef4444"
          help={`Each % shifts heating BTUs from oil/propane to electric heat pumps at COP ${'3.0'}. Cuts Scope 1, adds to Scope 2 — net win if grid is cleaner than oil/propane (it is, in ISO-NE).`}
        />
        <Slider
          label="Install solar PV capacity"
          unit=" kW"
          value={solarKw}
          onChange={setSolarKw}
          min={0} max={1000} step={25}
          color="#22d3ee"
          help="At NH typical 1,300 kWh/kW/yr. KUA's existing 30 kW Whittemore array would be ~30 here; 500 kW is roughly 1.5 acres of panels."
        />
        <Slider
          label="Plant additional acres of forest"
          unit=" acres"
          value={treePlantingAcres}
          onChange={setTreePlantingAcres}
          min={0} max={100} step={1}
          color="#86efac"
          help="At Birdsey (1992) closed-canopy ~2.1 mt CO₂e/acre/yr. KUA already has ~1,000 wooded acres; this is what NEW planting would add."
        />

        {hasChanges && (
          <button type="button" onClick={reset} style={styles.resetBtn}>
            ↺ Reset all sliders
          </button>
        )}
      </ModuleSection>

      <ModuleSection title="Live result" hint="Reflects every slider change instantly.">
        <ResultPanel result={result} />
      </ModuleSection>

      <ModuleSection title="Step-by-step math" hint="Each row shows the equation behind the slider you moved. The total below matches the change above.">
        {result.steps.length === 0 ? (
          <p style={styles.empty}>
            All sliders are at 0 — modified scenario equals baseline. Move any slider above to see the math fill in here.
          </p>
        ) : (
          <ol style={styles.stepList}>
            {result.steps.map((s, i) => (
              <li key={i} style={styles.step}>
                <div style={styles.stepHead}>
                  <span style={styles.stepLabel}>{s.label}</span>
                  <Pill kind={s.deltaMt < 0 ? 'good' : 'warn'}>
                    {s.deltaMt < 0 ? '↓' : '↑'} {Math.abs(s.deltaMt).toFixed(1)} mt
                  </Pill>
                </div>
                <div style={styles.stepNote}>{s.note}</div>
              </li>
            ))}
            <li style={styles.stepTotal}>
              <span>Net change vs baseline</span>
              <strong style={{ color: result.deltaMt < 0 ? '#86efac' : '#fca5a5' }}>
                {result.deltaMt < 0 ? '−' : '+'}{Math.abs(result.deltaMt).toFixed(1)} mt
                {' '}({result.deltaPct.toFixed(0)}%)
              </strong>
            </li>
          </ol>
        )}
      </ModuleSection>

      <EducationalCard
        title={'What "what-if" modeling is, and why it has to be honest'}
        sections={[
          {
            heading: 'Counterfactual reasoning',
            body: 'A counterfactual asks "what would have happened instead?" When we credit the geothermal system for avoided fossil heat, we\'re comparing reality (electric heat pump) against a counterfactual world (oil boiler doing the same job). The avoided emissions are the difference. Every reduction scenario the dashboard models is built the same way — the simulator above is the same idea, exposed as sliders.',
          },
          {
            heading: 'Why uncertainty matters more than the point estimate',
            body: [
              'Every input — gallons delivered, kWh consumed, EEIO factor — has some range of plausible values. A scenario whose ranking flips when those ranges are taken into account is not a safe basis for policy.',
              'The honest format is: "switching Building X from oil to a heat pump reduces emissions by 28 ± 6 tons/year, dominated by uncertainty in the COP under cold-climate operation." Every interval comes with the dominant source named. The simulator above uses point estimates for simplicity; the production reduction plan on /plan documents the uncertainty intervals.',
            ],
          },
          {
            heading: 'Forecasting and weather normalization',
            body: [
              'Heating-degree-days and cooling-degree-days quantify how hard a year was to heat or cool. A weather-normalized comparison answers "did we use less energy because we were efficient, or because the winter was mild?" — the answer is usually some of both.',
              'A net-zero trajectory model projects emissions forward under different assumptions about behavior, building stock, and grid mix. The point isn\'t to predict the future — it\'s to make explicit which assumptions matter most.',
            ],
            citation: 'STL decomposition for seasonal pattern separation; rolling z-score for anomaly detection.',
          },
        ]}
      />

      <p style={styles.fineprint}>
        See <Link to="/methodology" style={styles.link}>Methodology</Link> for every emission factor + citation,
        or <Link to="/plan" style={styles.link}>Plan</Link> for the production reduction trajectory.
      </p>
    </ModulePage>
  );
}

function Slider({ label, unit, value, onChange, min, max, step, color, help }) {
  return (
    <div style={styles.slider}>
      <div style={styles.sliderHead}>
        <label style={styles.sliderLabel}>{label}</label>
        <span style={{ ...styles.sliderValue, color }}>
          {value.toLocaleString()}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ ...styles.sliderInput, accentColor: color }}
      />
      <div style={styles.sliderHelp}>{help}</div>
    </div>
  );
}

function ResultPanel({ result }) {
  const { baseline, modified, deltaMt, deltaPct } = result;
  const isReduction = deltaMt < 0;
  const isSame = Math.abs(deltaMt) < 0.05;

  // Bar widths: scale relative to baseline gross so a 100% reduction
  // would collapse to width 0. Use net (after sinks) for the headline.
  const maxScale = Math.max(baseline.grossMt, modified.grossMt, 1);

  return (
    <div style={styles.resultWrap}>
      <div style={styles.headlineRow}>
        <div>
          <div style={styles.headlineLabel}>Modified net emissions</div>
          <div style={{ ...styles.headlineValue, color: isReduction ? '#86efac' : isSame ? '#e5e7eb' : '#fca5a5' }}>
            {modified.netMt.toFixed(1)} mt
          </div>
          <div style={styles.headlineSub}>
            vs baseline {baseline.netMt.toFixed(1)} mt
            {!isSame && (
              <> · <strong style={{ color: isReduction ? '#86efac' : '#fca5a5' }}>
                {isReduction ? '−' : '+'}{Math.abs(deltaMt).toFixed(1)} mt ({deltaPct.toFixed(0)}%)
              </strong></>
            )}
          </div>
        </div>
      </div>

      <BarRow label="Baseline gross" value={baseline.grossMt} max={maxScale} color="#475569" />
      <BarRow label="Modified gross" value={modified.grossMt} max={maxScale} color={isReduction ? '#22c55e' : '#dc2626'} />

      <div style={styles.scopeGrid}>
        <ScopeStat label="Scope 1" before={baseline.scope1Mt} after={modified.scope1Mt} />
        <ScopeStat label="Scope 2" before={baseline.scope2Mt} after={modified.scope2Mt} />
        <ScopeStat label="Sinks (drawdown)" before={baseline.sinksMt} after={modified.sinksMt} negative />
      </div>
    </div>
  );
}

function BarRow({ label, value, max, color }) {
  const pct = (value / max) * 100;
  return (
    <div style={styles.barRow}>
      <div style={styles.barLabel}>{label}</div>
      <div style={styles.barTrack}>
        <div style={{ ...styles.barFill, width: `${pct}%`, background: color }} />
        <span style={styles.barValue}>{value.toFixed(1)} mt</span>
      </div>
    </div>
  );
}

function ScopeStat({ label, before, after, negative }) {
  const delta = after - before;
  // For sinks, MORE is good (delta positive = drawdown grew → good)
  const good = negative ? delta > 0 : delta < 0;
  return (
    <div style={styles.scopeStat}>
      <div style={styles.scopeLabel}>{label}</div>
      <div style={styles.scopeValue}>{after.toFixed(1)} mt</div>
      {Math.abs(delta) > 0.05 && (
        <div style={{ ...styles.scopeDelta, color: good ? '#86efac' : '#fca5a5' }}>
          {delta > 0 ? '+' : ''}{delta.toFixed(1)} vs baseline
        </div>
      )}
    </div>
  );
}

const styles = {
  slider: { marginBottom: 22 },
  sliderHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 },
  sliderLabel: { fontSize: 14, color: '#e5e7eb', fontWeight: 600 },
  sliderValue: { fontSize: 18, fontWeight: 800, fontVariantNumeric: 'tabular-nums' },
  sliderInput: { width: '100%', cursor: 'pointer' },
  sliderHelp: { fontSize: 11, color: '#64748b', marginTop: 6, lineHeight: 1.5 },

  resetBtn: { marginTop: 8, padding: '8px 14px', background: 'transparent', border: '1px solid #334155', color: '#cbd5e1', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' },

  resultWrap: { },
  headlineRow: { marginBottom: 18 },
  headlineLabel: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.7, fontWeight: 700, marginBottom: 6 },
  headlineValue: { fontSize: 44, fontWeight: 800, lineHeight: 1, fontVariantNumeric: 'tabular-nums' },
  headlineSub: { fontSize: 13, color: '#94a3b8', marginTop: 6 },

  barRow: { marginBottom: 10 },
  barLabel: { fontSize: 11, color: '#94a3b8', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 },
  barTrack: { position: 'relative', height: 28, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 4, overflow: 'hidden' },
  barFill: { position: 'absolute', top: 0, bottom: 0, left: 0, transition: 'width 200ms ease, background 200ms ease' },
  barValue: { position: 'absolute', top: 0, bottom: 0, right: 10, display: 'flex', alignItems: 'center', fontSize: 13, color: '#e5e7eb', fontWeight: 700, fontVariantNumeric: 'tabular-nums' },

  scopeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginTop: 18 },
  scopeStat: { padding: '10px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6 },
  scopeLabel: { fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.7, fontWeight: 700 },
  scopeValue: { fontSize: 18, color: '#e5e7eb', fontWeight: 700, fontVariantNumeric: 'tabular-nums', marginTop: 4 },
  scopeDelta: { fontSize: 11, marginTop: 2, fontWeight: 700, fontVariantNumeric: 'tabular-nums' },

  empty: { fontSize: 13, color: '#94a3b8', fontStyle: 'italic' },

  stepList: { listStyle: 'none', padding: 0, margin: 0 },
  step: { padding: '12px 0', borderBottom: '1px solid #1f2937' },
  stepHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  stepLabel: { fontSize: 14, color: '#e5e7eb', fontWeight: 600 },
  stepNote: { fontSize: 12, color: '#94a3b8', marginTop: 6, lineHeight: 1.6 },
  stepTotal: { padding: '14px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 15, color: '#e5e7eb', fontWeight: 700 },

  fineprint: { fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginTop: 18 },
  link: { color: '#22d3ee', textDecoration: 'none' },

  presetGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 },
  presetBtn:  { padding: '12px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8, color: '#cbd5e1', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', flexDirection: 'column', gap: 6 },
  presetBtnActive: { background: '#0e3a5f', borderColor: '#22d3ee', color: '#22d3ee' },
  presetLabel: { fontSize: 14, fontWeight: 700 },
  presetDesc:  { fontSize: 12, color: '#94a3b8', lineHeight: 1.5 },
};
