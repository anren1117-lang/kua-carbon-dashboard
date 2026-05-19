import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ModulePage, ModuleSection, Pill } from '../components/ModuleShell.js';
import { estimatePersonalFootprint, FOOTPRINT_REFERENCE, typicalFootprintFor, allTypicalFootprints } from '../utils/personalFootprint.js';
import { AnimatedNumber } from '../components/AnimatedNumber.js';
import { CopyButton } from '../components/CopyButton.js';
import { toast } from '../components/Toast.js';
import { TOTAL_STUDENTS } from '../data/students.js';
import { carbonEquivalents } from '../utils/equivalents.js';

// /your-footprint — a public student-facing personal carbon estimator.
// Five inputs, transparent math, three reference comparisons, and
// 1-2 suggestions targeting the dominant components.

const STUDENT_TYPES = [
  { value: 'day',           label: 'Day student' },
  { value: 'us_boarding',   label: 'US boarder' },
  { value: 'international', label: 'International boarder' },
];

const BEEF = [
  { value: 'never',          label: 'Never' },
  { value: 'weekly',         label: 'Once a week' },
  { value: 'few_times_week', label: '2–4 times a week' },
  { value: 'daily',          label: 'Daily' },
];

const THERMOSTAT = [
  { value: 'always_on',         label: 'Leave it on all day' },
  { value: 'turn_down_when_out', label: 'Turn it down when I leave' },
  { value: 'off_when_out',      label: 'Turn it off when I leave' },
];

export default function PersonalFootprint() {
  const [studentType, setStudentType] = useState('us_boarding');
  const [commuteMiles, setCommuteMiles] = useState(8);
  const [flights, setFlights] = useState(2);
  const [beef, setBeef] = useState('weekly');
  const [thermostat, setThermostat] = useState('turn_down_when_out');
  const [showers, setShowers] = useState(7);
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(() => estimatePersonalFootprint({
    studentType,
    commuteMilesOneWay: commuteMiles,
    flightsPerYear: flights,
    beefFrequency: beef,
    thermostatHabit: thermostat,
    showersPerWeek: showers,
  }), [studentType, commuteMiles, flights, beef, thermostat, showers]);

  const isDay = studentType === 'day';
  const isBoarder = studentType !== 'day';

  return (
    <ModulePage
      title="Your personal footprint"
      subtitle="A quick estimate of YOUR annual carbon footprint at KUA, based on five things you actually control. All math is transparent — every row shows its assumption inline."
      toolbar={
        <button
          type="button"
          onClick={() => window.print()}
          style={{ padding: '8px 14px', background: '#0e7490', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit' }}
          title="Print your footprint result"
        >
          🖨 Print my result
        </button>
      }
    >
      <ModuleSection title="Tell us about your year" hint="Update any field — the estimate recomputes live.">
        <form style={styles.form} onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
          <Field label="What kind of student are you?">
            <RadioGroup name="student-type" value={studentType} onChange={setStudentType} options={STUDENT_TYPES} />
          </Field>

          {isDay && (
            <Field label="How far do you live from KUA?" sublabel="One-way miles">
              <input
                type="number" min="0" max="60" step="0.5"
                value={commuteMiles}
                onChange={(e) => setCommuteMiles(Number(e.target.value))}
                style={styles.input}
              />
              <span style={styles.unit}>miles</span>
            </Field>
          )}

          {isBoarder && (
            <Field label="Round trips home per year?" sublabel="Flights for breaks, holidays, etc.">
              <input
                type="number" min="0" max="20" step="1"
                value={flights}
                onChange={(e) => setFlights(Number(e.target.value))}
                style={styles.input}
              />
              <span style={styles.unit}>flights/year</span>
            </Field>
          )}

          <Field label="How often do you eat beef?">
            <RadioGroup name="beef" value={beef} onChange={setBeef} options={BEEF} />
          </Field>

          {isBoarder && (
            <Field label="What do you do with your dorm thermostat?">
              <RadioGroup name="thermostat" value={thermostat} onChange={setThermostat} options={THERMOSTAT} />
            </Field>
          )}

          <Field label="Showers per week?">
            <input
              type="number" min="0" max="21" step="1"
              value={showers}
              onChange={(e) => setShowers(Number(e.target.value))}
              style={styles.input}
            />
            <span style={styles.unit}>per week</span>
          </Field>
        </form>
      </ModuleSection>

      <ModuleSection title="Your estimate">
        <div style={styles.hero}>
          <div style={styles.heroNumber}>
            <AnimatedNumber value={result.totalMt} decimals={2} duration={1000} />
          </div>
          <div style={styles.heroUnit}>mtCO₂e / year</div>
        </div>

        <div style={styles.compare}>
          <ComparisonRow
            label="vs KUA per-student average"
            yourMt={result.totalMt}
            refMt={FOOTPRINT_REFERENCE.kuaPerStudentNetMt}
            note="Net (gross emissions minus campus-forest sequestration), divided by ~340 students."
          />
          <ComparisonRow
            label="vs US per-person average"
            yourMt={result.totalMt}
            refMt={FOOTPRINT_REFERENCE.usAdultAvgMt}
            note="EPA / WRI: ~16 mt per person per year for the average US adult."
          />
          <ComparisonRow
            label="vs 1.5 °C-aligned target"
            yourMt={result.totalMt}
            refMt={FOOTPRINT_REFERENCE.parisAlignedMt}
            note="IPCC SR1.5: roughly 2 mt per person per year by 2030 to keep warming under 1.5 °C."
          />
        </div>
      </ModuleSection>

      <ModuleSection title="You vs similar KUA students" hint="Where you sit relative to the average student of each type. The marker on your row shows your number; the bars show the typical footprint for each cohort.">
        <PeerSpectrum yourTotalMt={result.totalMt} yourType={studentType} />
      </ModuleSection>

      <ModuleSection title="Breakdown" hint="Each row shows the exact assumption used. Audit + push back on any of them.">
        <ul style={styles.breakdown}>
          {result.components.map((c, i) => (
            <li key={i} style={styles.bdRow}>
              <div style={styles.bdLabel}>{c.label}</div>
              <div style={styles.bdMt}>
                {c.mt > 0 ? `${c.mt.toFixed(2)} mt/yr` : '—'}
              </div>
              <div style={styles.bdNote}>{c.note}</div>
            </li>
          ))}
        </ul>
      </ModuleSection>

      {result.suggestions.length > 0 && (
        <ModuleSection title="Things you can change" hint="Targeted at your biggest reducible rows — not a generic eco-checklist.">
          <ul style={styles.suggestions}>
            {result.suggestions.map((s, i) => (
              <li key={i} style={styles.suggestion}>{s}</li>
            ))}
          </ul>
        </ModuleSection>
      )}

      <CampusAmplification yourComponents={result.components} />

      <FootprintHistory currentMt={result.totalMt} studentType={studentType} />

      <PledgeSection totalMt={result.totalMt} components={result.components} studentType={studentType} />


      <ModuleSection title="What about everything else?" hint="">
        <p style={styles.fineprint}>
          This estimator covers what you personally control day-to-day. It doesn't include
          things like KUA's heating fuel for academic buildings, the supply-chain emissions
          of stuff you buy, or the upstream emissions of the energy mix on the ISO-NE grid.
          Those are covered on the <Link to="/" style={styles.link}>main dashboard</Link>.
        </p>
        <p style={styles.fineprint}>
          Want to dig into where KUA's institutional numbers come from?
          See <Link to="/methodology" style={styles.link}>Methodology</Link> for every emission
          factor + citation.
        </p>
      </ModuleSection>
    </ModulePage>
  );
}

// History: store each computed footprint in localStorage with a
// timestamp + student type, then show the user their trend over
// time. Closes the "I'm trying to reduce" loop — every visit
// shows whether they've actually moved their number.
function FootprintHistory({ currentMt, studentType }) {
  const [history, setHistory] = React.useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem('kua-footprint-history') || '[]');
      return Array.isArray(raw) ? raw : [];
    } catch { return []; }
  });

  function saveSnapshot() {
    const entry = { mt: +currentMt.toFixed(2), at: new Date().toISOString(), studentType };
    const next = [...history, entry].slice(-12); // keep last 12 snapshots
    try { localStorage.setItem('kua-footprint-history', JSON.stringify(next)); } catch {}
    setHistory(next);
    toast(`Snapshot saved (${entry.mt} mt)`, { kind: 'good' });
  }

  function clearHistory() {
    try { localStorage.removeItem('kua-footprint-history'); } catch {}
    setHistory([]);
  }

  const last = history.length > 0 ? history[history.length - 1] : null;
  const first = history.length > 1 ? history[0] : null;
  const trend = (last && first) ? last.mt - first.mt : null;
  const trendPct = (last && first && first.mt > 0) ? ((last.mt - first.mt) / first.mt) * 100 : null;

  return (
    <ModuleSection
      title="Your footprint history"
      hint="Snapshot your current number. The dashboard saves it to your browser only — no account, no email. Take another snapshot in a few weeks to see your trend."
    >
      <div style={historyStyles.actions}>
        <button type="button" onClick={saveSnapshot} style={historyStyles.saveBtn} className="kua-cta-card">
          ✓ Save today's number ({currentMt.toFixed(2)} mt)
        </button>
        {history.length > 0 && (
          <button type="button" onClick={clearHistory} style={historyStyles.clearBtn}>
            Clear history
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p style={historyStyles.empty}>
          No snapshots yet. Save your current number above to start tracking your trend.
        </p>
      ) : (
        <>
          {trend !== null && Math.abs(trend) > 0.01 && (
            <div style={historyStyles.trendBox}>
              <Pill kind={trend < 0 ? 'good' : 'warn'}>
                {trend < 0 ? '↓' : '↑'} {Math.abs(trendPct).toFixed(0)}% since your first snapshot
              </Pill>
              <span style={historyStyles.trendText}>
                {trend < 0
                  ? `You've cut ${Math.abs(trend).toFixed(2)} mt off your footprint since you started tracking. 🎉`
                  : `Your footprint is ${trend.toFixed(2)} mt higher than your first snapshot — what changed?`}
              </span>
            </div>
          )}

          <ol style={historyStyles.list}>
            {[...history].reverse().map((entry, i) => {
              const date = new Date(entry.at);
              const dateLabel = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
              const prev = history[history.length - 2 - i];
              const delta = prev ? entry.mt - prev.mt : null;
              return (
                <li key={entry.at} style={historyStyles.row} className="kua-card-hover">
                  <span style={historyStyles.rowDate}>{dateLabel}</span>
                  <span style={historyStyles.rowMt}>
                    <strong>{entry.mt.toFixed(2)}</strong> mt
                  </span>
                  <span style={historyStyles.rowDelta}>
                    {delta === null
                      ? <Pill kind="neutral">first</Pill>
                      : Math.abs(delta) < 0.01
                        ? <Pill kind="neutral">no change</Pill>
                        : delta < 0
                          ? <Pill kind="good">↓ {Math.abs(delta).toFixed(2)} mt</Pill>
                          : <Pill kind="warn">↑ {delta.toFixed(2)} mt</Pill>}
                  </span>
                </li>
              );
            })}
          </ol>

          <p style={historyStyles.note}>
            Stored locally in your browser only — never sent to any server.
            Saves up to your last 12 snapshots; older entries get dropped automatically.
          </p>
        </>
      )}
    </ModuleSection>
  );
}

const historyStyles = {
  actions: { display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 },
  saveBtn: { padding: '10px 16px', background: 'linear-gradient(135deg, #052e16 0%, #14532d 100%)', color: '#86efac', border: '1px solid #16a34a', borderRadius: 8, fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' },
  clearBtn: { padding: '10px 16px', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' },
  empty: { fontSize: 13, color: '#94a3b8', fontStyle: 'italic' },
  trendBox: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, marginBottom: 14, flexWrap: 'wrap' },
  trendText: { fontSize: 13, color: '#cbd5e1', lineHeight: 1.5 },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 120px 120px',
    gap: 12,
    alignItems: 'center',
    padding: '10px 14px',
    background: '#0b1220',
    border: '1px solid #1f2937',
    borderRadius: 6,
    marginBottom: 6,
    fontSize: 13,
  },
  rowDate: { color: '#cbd5e1' },
  rowMt: { color: '#e5e7eb', fontVariantNumeric: 'tabular-nums', textAlign: 'right' },
  rowDelta: { textAlign: 'right' },
  note: { fontSize: 11, color: '#64748b', fontStyle: 'italic', marginTop: 14 },
};

// Personal pledge: pick the biggest reducible row and commit to a
// 30% reduction. Saves the chosen pledge to localStorage so it
// survives reloads, and offers a "copy to clipboard" share string
// the user can post on a bulletin board or paste into a group chat.
function PledgeSection({ totalMt, components, studentType }) {
  const [pledged, setPledged] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem('kua-footprint-pledge') || 'null');
    } catch { return null; }
  });

  // Top reducible row drives the suggested pledge focus.
  const top = (components || [])
    .filter((c) => c.mt > 0.1)
    .sort((a, b) => b.mt - a.mt)[0];

  function savePledge() {
    if (!top) return;
    const pledge = {
      focus: top.label,
      currentMt: top.mt,
      targetReductionPct: 30,
      reductionMt: +(top.mt * 0.30).toFixed(2),
      newTotalMt: +(totalMt - top.mt * 0.30).toFixed(2),
      pledgedAt: new Date().toISOString(),
      studentType,
    };
    try { localStorage.setItem('kua-footprint-pledge', JSON.stringify(pledge)); } catch {}
    setPledged(pledge);
    toast(`Pledge saved — you'll cut ~${pledge.reductionMt} mt this year`, { kind: 'good', duration: 4000 });
  }

  function clearPledge() {
    try { localStorage.removeItem('kua-footprint-pledge'); } catch {}
    setPledged(null);
  }

  const shareText = pledged
    ? `I pledged to cut my ${pledged.focus.toLowerCase()} by 30% this year — that's `
      + `~${pledged.reductionMt} mtCO₂e off my personal carbon footprint. `
      + `What's yours? Calculate at kua-carbon-dashboard.vercel.app/your-footprint`
    : '';

  if (!top) return null;

  return (
    <ModuleSection title="Make a pledge" hint="Save your commitment to your browser, share it with friends or your dorm.">
      {!pledged ? (
        <div style={pledgeStyles.wrap}>
          <p style={pledgeStyles.intro}>
            Your biggest reducible row is <strong style={{ color: '#cbd5e1' }}>{top.label}</strong>{' '}
            at <strong style={{ color: '#cbd5e1' }}>{top.mt.toFixed(2)} mtCO₂e</strong>.
            Pledge a 30% cut and we'll save it to your browser — no account, no email.
          </p>
          <button type="button" onClick={savePledge} style={pledgeStyles.cta} className="kua-cta-card">
            ✓ I'll cut my {top.label.toLowerCase()} by 30%
          </button>
          <p style={pledgeStyles.note}>
            Saved locally only. Clearing your browser data wipes it. No personal info leaves your device.
          </p>
        </div>
      ) : (
        <div style={pledgeStyles.wrap}>
          <div style={pledgeStyles.savedCard} className="kua-card-hover">
            <div style={pledgeStyles.savedBadge}>✓ Pledge saved</div>
            <div style={pledgeStyles.savedTitle}>
              Cut "{pledged.focus}" by 30% this year
            </div>
            <div style={pledgeStyles.savedMeta}>
              That's ~{pledged.reductionMt} mtCO₂e off your footprint
              {' '}({pledged.currentMt.toFixed(2)} → {pledged.newTotalMt.toFixed(2)} mtCO₂e total).
            </div>
            <div style={pledgeStyles.btnRow}>
              <CopyButton
                text={shareText}
                label="📋 Copy share text"
                copiedLabel="✓ Copied!"
                title="Copy a share-ready blurb to your clipboard"
                style={{ color: '#86efac', borderColor: '#14532d' }}
              />
              <button type="button" onClick={clearPledge} style={pledgeStyles.clearBtn}>
                Clear pledge
              </button>
            </div>
          </div>
        </div>
      )}
    </ModuleSection>
  );
}

const pledgeStyles = {
  wrap: {},
  intro: { fontSize: 14, color: '#cbd5e1', lineHeight: 1.7, marginTop: 0, marginBottom: 14 },
  cta: { padding: '12px 18px', background: 'linear-gradient(135deg, #052e16 0%, #14532d 100%)', color: '#86efac', border: '1px solid #16a34a', borderRadius: 8, fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' },
  note: { fontSize: 11, color: '#64748b', marginTop: 12, fontStyle: 'italic' },
  savedCard: { padding: '20px 22px', background: 'linear-gradient(135deg, #052e16 0%, #14532d 100%)', border: '1px solid #16a34a', borderLeft: '4px solid #86efac', borderRadius: 10 },
  savedBadge: { fontSize: 11, color: '#86efac', textTransform: 'uppercase', letterSpacing: 1.4, fontWeight: 800, marginBottom: 10 },
  savedTitle: { fontSize: 18, color: '#dcfce7', fontWeight: 700, marginBottom: 6 },
  savedMeta: { fontSize: 13, color: '#bbf7d0', lineHeight: 1.6, marginBottom: 14 },
  btnRow: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  clearBtn: { padding: '8px 14px', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: 6, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' },
};

// Amplification: if every KUA student adopted YOUR biggest reducible
// change, how much would the school cut? Multiplies the user's most
// impactful component by TOTAL_STUDENTS and translates the result
// into tangible equivalents. Ties personal action to institutional
// impact, which is the deepest motivational frame for this calculator.
function CampusAmplification({ yourComponents }) {
  if (!Array.isArray(yourComponents) || yourComponents.length === 0) return null;
  // Pick the biggest mt row that's reducible (excludes structural rows
  // like "no commute" with mt=0).
  const top = yourComponents
    .filter((c) => c.mt > 0.1)
    .sort((a, b) => b.mt - a.mt)[0];
  if (!top) return null;

  // If every student matched your biggest row's footprint AND reduced
  // by 30% (a realistic single-change target), the campus saves...
  const perStudentReduction = top.mt * 0.30;
  const campusReduction = perStudentReduction * TOTAL_STUDENTS;
  const eq = carbonEquivalents(campusReduction);

  return (
    <ModuleSection
      title="What if every student did this?"
      hint={`Your biggest reducible category is "${top.label}" at ${top.mt.toFixed(2)} mt. If every one of KUA's ${TOTAL_STUDENTS} students cut that by 30%…`}
    >
      <div style={amp.wrap}>
        <div style={amp.headline}>
          <div style={amp.headlineLabel}>Campus reduction</div>
          <div style={amp.headlineValue}>
            <AnimatedNumber value={campusReduction} decimals={0} duration={1100} />
            <span style={amp.headlineUnit}> mtCO₂e / yr</span>
          </div>
          <div style={amp.headlineSub}>
            {perStudentReduction.toFixed(2)} mt × {TOTAL_STUDENTS.toLocaleString()} students = {campusReduction.toFixed(0)} mt
          </div>
        </div>

        <div style={amp.equivGrid}>
          <div style={amp.equivCell} className="kua-card-hover">
            <div style={amp.equivIcon}>🚗</div>
            <div style={amp.equivValue}><AnimatedNumber value={eq.carYears} duration={1300} /></div>
            <div style={amp.equivText}>cars off the road for a year</div>
          </div>
          <div style={amp.equivCell} className="kua-card-hover">
            <div style={amp.equivIcon}>🌳</div>
            <div style={amp.equivValue}><AnimatedNumber value={eq.treeYears} duration={1300} /></div>
            <div style={amp.equivText}>trees planted (1 yr of growth)</div>
          </div>
          <div style={amp.equivCell} className="kua-card-hover">
            <div style={amp.equivIcon}>⛽</div>
            <div style={amp.equivValue}><AnimatedNumber value={eq.galsGasoline} duration={1300} /></div>
            <div style={amp.equivText}>gallons of gasoline not burned</div>
          </div>
        </div>

        <p style={amp.footer}>
          One person's choice doesn't move KUA's footprint visibly — but multiply by every
          student and the same choice rivals a real reduction project on the institutional plan.
          The same scaling logic appears on <Link to="/scenarios" style={styles.link}>/scenarios →</Link>
          {' '}for whole-campus levers.
        </p>
      </div>
    </ModuleSection>
  );
}

// Side-by-side bar comparison of your footprint against the typical
// footprint for each of the three student types. The bar for "your"
// student type is highlighted, and your personal value is drawn as
// a vertical marker on top so you can see whether you're above or
// below the cohort average.
function PeerSpectrum({ yourTotalMt, yourType }) {
  const peers = allTypicalFootprints().map((p, i) => ({
    ...p,
    key: ['day', 'us_boarding', 'international'][i],
  }));
  const max = Math.max(yourTotalMt, ...peers.map((p) => p.totalMt), 1);

  // Whether the user is above the typical for THEIR own type
  const myPeer = peers.find((p) => p.key === yourType);
  const delta  = myPeer ? yourTotalMt - myPeer.totalMt : 0;
  const deltaPct = myPeer && myPeer.totalMt > 0 ? (delta / myPeer.totalMt) * 100 : 0;

  return (
    <div>
      <div style={spectrum.bars}>
        {peers.map((p) => {
          const isYou = p.key === yourType;
          const widthPct = (p.totalMt / max) * 100;
          const yourPct  = (yourTotalMt / max) * 100;
          return (
            <div key={p.key} style={spectrum.row}>
              <div style={{ ...spectrum.label, color: isYou ? '#22d3ee' : '#94a3b8', fontWeight: isYou ? 700 : 500 }}>
                {p.label}{isYou ? ' (your group)' : ''}
              </div>
              <div style={spectrum.barTrack}>
                <div style={{
                  ...spectrum.barFill,
                  width: `${widthPct}%`,
                  background: isYou ? '#0e3a5f' : '#1f2937',
                  borderColor: isYou ? '#22d3ee' : 'transparent',
                }} />
                <div style={{
                  ...spectrum.barValue,
                  color: isYou ? '#22d3ee' : '#cbd5e1',
                }}>
                  {p.totalMt.toFixed(1)} mt/yr typical
                </div>
                {isYou && (
                  <div
                    title={`Your footprint: ${yourTotalMt.toFixed(2)} mt/yr`}
                    style={{ ...spectrum.youMarker, left: `${Math.min(99, yourPct)}%` }}
                  >
                    <span style={spectrum.youMarkerLabel}>you: {yourTotalMt.toFixed(2)} mt</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {myPeer && Math.abs(delta) > 0.05 && (
        <p style={spectrum.deltaNote}>
          You're <strong style={{ color: delta < 0 ? '#86efac' : '#fbbf24' }}>
            {Math.abs(deltaPct).toFixed(0)}% {delta < 0 ? 'below' : 'above'}
          </strong> the average {myPeer.label.toLowerCase().replace('average ', '')} ({myPeer.totalMt.toFixed(1)} mt/yr).
          {delta < 0
            ? ' Solid — keep doing whatever you\'re doing differently.'
            : ' Look at the suggestions below for the easiest wins.'}
        </p>
      )}
    </div>
  );
}

function Field({ label, sublabel, children }) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>
        {label}
        {sublabel && <span style={styles.sublabel}> · {sublabel}</span>}
      </label>
      <div style={styles.fieldInput}>{children}</div>
    </div>
  );
}

function RadioGroup({ name, value, onChange, options }) {
  return (
    <div style={styles.radioRow}>
      {options.map((o) => (
        <label key={o.value} style={{ ...styles.radio, ...(value === o.value ? styles.radioActive : {}) }}>
          <input
            type="radio"
            name={name}
            value={o.value}
            checked={value === o.value}
            onChange={() => onChange(o.value)}
            style={styles.radioInput}
          />
          {o.label}
        </label>
      ))}
    </div>
  );
}

function ComparisonRow({ label, yourMt, refMt, note }) {
  const ratio = refMt > 0 ? yourMt / refMt : 0;
  const pct = Math.round(ratio * 100);
  const kind = ratio < 0.6 ? 'good' : ratio < 1.0 ? 'info' : 'warn';
  return (
    <div style={styles.compareRow}>
      <div style={styles.compareHead}>
        <span style={styles.compareLabel}>{label}</span>
        <Pill kind={kind}>
          {ratio < 1.0
            ? `${pct}% of reference`
            : ratio < 1.5
              ? `${pct}% of reference`
              : `${Math.round(ratio)}× reference`}
        </Pill>
      </div>
      <div style={styles.compareBar}>
        <div style={{ ...styles.compareFill, width: `${Math.min(100, Math.max(2, pct))}%`, background: kind === 'good' ? '#22c55e' : kind === 'info' ? '#22d3ee' : '#dc2626' }} />
      </div>
      <div style={styles.compareNote}>{note}</div>
    </div>
  );
}

const styles = {
  form: { display: 'grid', gap: 18 },
  field: { display: 'grid', gap: 8 },
  label: { fontSize: 13, color: '#e5e7eb', fontWeight: 700 },
  sublabel: { color: '#94a3b8', fontWeight: 400, fontStyle: 'italic' },
  fieldInput: { display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' },
  input: { padding: '8px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, color: '#e5e7eb', fontSize: 14, fontFamily: 'inherit', width: 100 },
  unit: { fontSize: 12, color: '#94a3b8' },
  radioRow: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  radio: { padding: '8px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, color: '#cbd5e1', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 },
  radioActive: { background: '#0e3a5f', borderColor: '#22d3ee', color: '#22d3ee', fontWeight: 600 },
  radioInput: { margin: 0 },
  hero: { textAlign: 'center', padding: '24px 0' },
  heroNumber: {
    fontSize: 62,
    fontWeight: 800,
    lineHeight: 1,
    letterSpacing: '-0.02em',
    // Same gold-amber gradient + glow treatment as the homepage hero
    // for cross-page consistency.
    background: 'linear-gradient(135deg, #67e8f9 0%, #22d3ee 50%, #06b6d4 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    WebkitTextFillColor: 'transparent',
    filter: 'drop-shadow(0 0 16px rgba(34, 211, 238, 0.25))',
    display: 'inline-block',
  },
  heroUnit: { fontSize: 14, color: '#94a3b8', marginTop: 6, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 },
  compare: { display: 'grid', gap: 18, marginTop: 20 },
  compareRow: { },
  compareHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  compareLabel: { fontSize: 13, color: '#e5e7eb', fontWeight: 600 },
  compareBar: { height: 8, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 4, overflow: 'hidden' },
  compareFill: { height: '100%', transition: 'width 200ms' },
  compareNote: { fontSize: 11, color: '#64748b', marginTop: 4 },
  breakdown: { listStyle: 'none', padding: 0, margin: 0 },
  bdRow: { padding: '10px 0', borderBottom: '1px solid #1f2937', display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 },
  bdLabel: { fontSize: 14, color: '#e5e7eb', fontWeight: 600 },
  bdMt: { fontSize: 14, color: '#22d3ee', fontWeight: 700, fontVariantNumeric: 'tabular-nums' },
  bdNote: { gridColumn: '1 / -1', fontSize: 11, color: '#64748b', lineHeight: 1.5 },
  suggestions: { listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 },
  suggestion: { padding: '12px 16px', background: '#052e16', border: '1px solid #14532d', borderLeft: '3px solid #86efac', borderRadius: 6, color: '#dcfce7', fontSize: 14, lineHeight: 1.6 },
  fineprint: { fontSize: 13, color: '#94a3b8', lineHeight: 1.7, margin: '8px 0' },
  link: { color: '#22d3ee', textDecoration: 'none' },
};

const amp = {
  wrap: {},
  headline: {
    padding: '20px 22px',
    background: 'linear-gradient(135deg, rgba(8, 51, 68, 0.5) 0%, rgba(15, 23, 42, 0.95) 100%)',
    border: '1px solid #1f2937',
    borderLeft: '4px solid #22d3ee',
    borderRadius: 10,
    marginBottom: 18,
  },
  headlineLabel: { fontSize: 11, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: 1.4, fontWeight: 800, marginBottom: 8 },
  headlineValue: {
    fontSize: 'clamp(40px, 8vw, 56px)',
    fontWeight: 800,
    lineHeight: 1,
    letterSpacing: '-0.02em',
    background: 'linear-gradient(135deg, #67e8f9 0%, #22d3ee 50%, #06b6d4 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    WebkitTextFillColor: 'transparent',
    filter: 'drop-shadow(0 0 14px rgba(34, 211, 238, 0.25))',
    display: 'inline-block',
  },
  headlineUnit: { fontSize: 18, color: '#94a3b8', marginLeft: 8, fontWeight: 500, WebkitBackgroundClip: 'initial', WebkitTextFillColor: 'initial', background: 'none', filter: 'none' },
  headlineSub: { fontSize: 13, color: '#94a3b8', marginTop: 10 },

  equivGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 16 },
  equivCell: { textAlign: 'center', padding: '14px 10px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 },
  equivIcon: { fontSize: 24, marginBottom: 6 },
  equivValue: { fontSize: 22, color: '#e5e7eb', fontWeight: 800, fontVariantNumeric: 'tabular-nums', marginBottom: 4 },
  equivText: { fontSize: 11, color: '#94a3b8', lineHeight: 1.3 },

  footer: { fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginTop: 14 },
};

const spectrum = {
  bars: { display: 'grid', gap: 14 },
  row: { display: 'grid', gridTemplateColumns: 'minmax(160px, 220px) 1fr', gap: 14, alignItems: 'center' },
  label: { fontSize: 13 },
  barTrack: { position: 'relative', height: 36, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, overflow: 'visible' },
  barFill: { position: 'absolute', top: 0, bottom: 0, left: 0, border: '1px solid', borderRadius: 5, transition: 'width 200ms ease' },
  barValue: { position: 'absolute', top: 0, bottom: 0, right: 10, display: 'flex', alignItems: 'center', fontSize: 12, fontWeight: 700, fontVariantNumeric: 'tabular-nums' },
  youMarker: { position: 'absolute', top: -8, bottom: -8, width: 3, background: '#fcd34d', borderRadius: 1, boxShadow: '0 0 0 1px rgba(0,0,0,0.4)' },
  youMarkerLabel: { position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)', fontSize: 10, fontWeight: 700, color: '#fcd34d', whiteSpace: 'nowrap', background: '#0b1220', padding: '2px 6px', borderRadius: 3, border: '1px solid #fcd34d' },
  deltaNote: { fontSize: 13, color: '#94a3b8', marginTop: 16, lineHeight: 1.6 },
};
