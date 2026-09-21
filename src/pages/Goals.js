import React from 'react';
import { Link } from 'react-router-dom';
import { ModulePage, ModuleSection, Pill } from '../components/ModuleShell.js';
import { LiveDataNotice } from '../components/LiveDataNotice.js';
import { AnimatedNumber, useAnimatedNumber } from '../components/AnimatedNumber.js';
import { AmbientParticles } from '../components/AmbientParticles.js';
import { Sparkline } from '../components/Sparkline.js';
import { TimeSeriesChart } from '../components/TimeSeriesChart.js';
import { useCardTilt } from '../hooks/useCardTilt.js';
import { useSpotlight } from '../hooks/useSpotlight.js';
import { useIsNarrow } from '../hooks/useViewport.js';
import { Icon } from '../components/Icon.js';
import { reductionTargets, targetTrajectoryAt, trajectoryStatus } from '../data/targets.js';
import { RESOURCE_CATEGORIES, GOAL_RESOURCES } from '../data/goalsResources.js';
import { ANNUAL_SEQUESTRATION_MT } from '../data/sinks.js';
import { SCOPE1_TOTAL_MT, SCOPE2_TOTAL_MT, SCOPE3_TOTAL_MT, GROSS_MT } from '../data/scopeTotals.js';
import { COMPOSED_ANNUAL_KWH } from '../data/composedYtd.js';
import { useMeasuredScopeTotals } from '../hooks/useMeasuredScopeTotals.js';

// Goals & Targets — KUA's reduction pathway. The page leads with a
// hero card centered on the headline 2030 target (gap-to-close +
// countdown + baseline-today-target axis), then a rollup grid of
// every target as a circular dial, then per-target detail cards.

const CURRENT_YEAR = 2026;

// Anchor id used to link the dial rollup to the per-target detail
// card below. Stable per target id so deep links survive (e.g.
// /goals#target-tg_scope2_2027).
function targetAnchor(id) {
  return `target-${id}`;
}

const ACTUAL_BY_SCOPE_FALLBACK = {
  gross: GROSS_MT,
  scope1: SCOPE1_TOTAL_MT,
  scope2: SCOPE2_TOTAL_MT,
  scope3: SCOPE3_TOTAL_MT,
  net: GROSS_MT - ANNUAL_SEQUESTRATION_MT,
  energy_kwh: COMPOSED_ANNUAL_KWH,
};

const SCOPE_ACCENT = {
  gross: '#fbbf24',
  scope1: '#ef4444',
  scope2: '#22d3ee',
  scope3: '#a855f7',
  net: '#86efac',
  energy_kwh: '#38bdf8',
};

// Glyph per scope. Pure semantic mapping — fire for fuel-burning
// (Scope 1), bolt for electricity (Scope 2), plane for travel-heavy
// Scope 3, leaf for net (after sinks), globe for cross-cutting
// gross. Renders next to titles + inside dial headers so a scanner
// can identify a target by its symbol at glance.
const SCOPE_ICON = {
  gross: Icon.Globe,
  scope1: Icon.Flame,
  scope2: Icon.Bolt,
  scope3: Icon.Plane,
  net: Icon.Leaf,
  energy_kwh: Icon.Bolt,
};

// Status-driven glow color for the headline hero card. The card
// already shifts based on the live target's progress; mapping its
// outer glow + border-tint to the status (on-track = green, lagging
// = amber, off-track = red) makes the visual mood match the data
// without the reader having to parse the badge text.
const STATUS_GLOW = {
  on_track:  { glow: 'rgba(134, 239, 172, 0.18)', border: 'rgba(134, 239, 172, 0.35)' },
  lagging:   { glow: 'rgba(251, 191, 36, 0.18)',  border: 'rgba(251, 191, 36, 0.35)'  },
  off_track: { glow: 'rgba(252, 165, 165, 0.20)', border: 'rgba(252, 165, 165, 0.40)' },
};

const STATUS_KIND  = { on_track: 'good', lagging: 'warn', off_track: 'bad' };
const STATUS_LABEL = { on_track: 'On track', lagging: 'Lagging', off_track: 'Off track' };

export default function Goals() {
  const live = useMeasuredScopeTotals();
  const isNarrow = useIsNarrow();

  const ACTUAL_BY_SCOPE = {
    gross:  live.grossMt  || ACTUAL_BY_SCOPE_FALLBACK.gross,
    scope1: live.scope1Mt || ACTUAL_BY_SCOPE_FALLBACK.scope1,
    scope2: live.scope2Mt || ACTUAL_BY_SCOPE_FALLBACK.scope2,
    scope3: live.scope3Mt || ACTUAL_BY_SCOPE_FALLBACK.scope3,
    net:    live.netMt   ?? ACTUAL_BY_SCOPE_FALLBACK.net,
    energy_kwh: ACTUAL_BY_SCOPE_FALLBACK.energy_kwh,
  };
  const PROVENANCE_BY_SCOPE = {
    gross:  live.scope1Measured && live.scope3Measured ? 'measured' : 'estimated',
    scope1: live.scope1Measured ? 'measured' : 'estimated',
    scope2: 'measured',
    scope3: live.scope3Measured ? 'measured' : 'estimated',
    net:    live.scope1Measured && live.scope3Measured && live.sinksMeasured ? 'measured' : 'estimated',
    energy_kwh: 'measured',
  };

  // Aggregate roll-ups for the headline metrics row under the hero.
  const approved = reductionTargets.filter((t) => t.approved).length;
  const onTrackCount = reductionTargets.reduce((n, t) => {
    const a = actualForTarget(t, ACTUAL_BY_SCOPE);
    return trajectoryStatus(t, a, CURRENT_YEAR) === 'on_track' ? n + 1 : n;
  }, 0);
  const earliestDeadline = Math.min(...reductionTargets.map((t) => t.targetYear));

  return (
    <ModulePage
      title="Goals & Targets"
      subtitle="KUA's committed reduction pathway. Each target plots a linear trajectory from its baseline year to the deadline; the dashboard tracks our measured progress against it."
      toolbar={
        <button
          type="button"
          onClick={() => window.print()}
          style={btnStyle}
          title="Print this page or save it as a PDF"
        >
          🖨 Print / Save PDF
        </button>
      }
    >
      <LiveDataNotice error={live.error} fallbackLabel="the published trajectory" />
      <HeadlineHero
        target={reductionTargets.find((t) => t.id === 'tg_gross_2030') || reductionTargets[0]}
        actualByScope={ACTUAL_BY_SCOPE}
        provenanceByScope={PROVENANCE_BY_SCOPE}
      />

      <div style={styles.summaryRow}>
        <SummaryStat label="Active targets" value={reductionTargets.length} accent="#22d3ee" />
        <SummaryStat label="On track today" value={`${onTrackCount} / ${reductionTargets.length}`} accent={onTrackCount === reductionTargets.length ? '#86efac' : '#fbbf24'} />
        <SummaryStat label="Approved" value={`${approved} / ${reductionTargets.length}`} accent="#86efac" note={approved === 0 ? 'Board ratification pending' : 'Board-ratified'} />
        <SummaryStat label="Earliest deadline" value={earliestDeadline} accent="#fbbf24" note={`${Math.max(0, earliestDeadline - CURRENT_YEAR)} yrs out`} />
      </div>

      <ModuleSection
        title="The pathway at a glance"
        hint="Every reduction target rolled up as a circular dial. Each ring fills clockwise as we close the gap to the goal; the small marker on the ring shows where the linear trajectory says we should be by today."
      >
        <div style={styles.dialGrid}>
          {reductionTargets.map((target) => {
            const actual = actualForTarget(target, ACTUAL_BY_SCOPE);
            const status = trajectoryStatus(target, actual, CURRENT_YEAR);
            return (
              <DialTile
                key={target.id}
                target={target}
                actual={actual}
                status={status}
                provenance={target.id === 'tg_dining_2028' ? 'estimated' : (PROVENANCE_BY_SCOPE[target.scope] || 'estimated')}
              />
            );
          })}
        </div>
      </ModuleSection>

      {reductionTargets.map((target) => {
        const actual = actualForTarget(target, ACTUAL_BY_SCOPE);
        const dataProvenance = target.id === 'tg_dining_2028'
          ? 'estimated'
          : (PROVENANCE_BY_SCOPE[target.scope] || 'estimated');
        const status = trajectoryStatus(target, actual, CURRENT_YEAR);
        const accent = SCOPE_ACCENT[target.scope] || '#22d3ee';

        const series = [];
        for (let y = target.baselineYear; y <= target.targetYear; y++) {
          series.push({ t: new Date(`${y}-07-01T00:00:00Z`).toISOString(), v: targetTrajectoryAt(target, y) });
        }
        const expectedNow = targetTrajectoryAt(target, CURRENT_YEAR);
        const reductionAchieved = ((target.baselineValue - actual) / target.baselineValue) * 100;
        const reductionNeeded   = target.percentReduction;
        const progressPct = Math.max(0, Math.min(100, (reductionAchieved / reductionNeeded) * 100));

        const yearsTotal   = target.targetYear - target.baselineYear;
        const yearsElapsed = Math.max(0, Math.min(yearsTotal, CURRENT_YEAR - target.baselineYear));
        const expectedProgressPct = yearsTotal > 0 ? (yearsElapsed / yearsTotal) * 100 : 0;
        const aheadOfPace = progressPct >= expectedProgressPct;
        const unitLabel = target.scope === 'energy_kwh' ? 'kWh' : 'mtCO₂e';

        return (
          <div key={target.id} id={targetAnchor(target.id)} style={{ scrollMarginTop: 80 }}>
          <ModuleSection
            title={target.title}
            hint={target.description}
          >
            <div style={isNarrow ? { ...styles.row, gridTemplateColumns: '1fr' } : styles.row}>
              <div style={styles.left}>
                <div style={styles.statRow}>
                  <Stat label="Baseline" value={Math.round(target.baselineValue).toLocaleString()} unit={unitLabel} sub={`${target.baselineYear}`} />
                  <Stat label="Target"   value={Math.round(target.baselineValue * (1 - target.percentReduction / 100)).toLocaleString()} unit={unitLabel} sub={`by ${target.targetYear}`} />
                  <Stat label="Current"  value={Math.round(actual).toLocaleString()} unit={unitLabel} sub={`${CURRENT_YEAR}`} />
                </div>

                <div style={styles.progressWrap}>
                  <div style={styles.progressLabel}>
                    <span>Progress: {reductionAchieved.toFixed(1)}% reduced of {reductionNeeded}% needed</span>
                    <span style={{ display: 'flex', gap: 6 }}>
                      <Pill kind={dataProvenance === 'measured' ? 'good' : 'neutral'}>
                        {dataProvenance === 'measured' ? '✓ Measured' : 'Estimated'}
                      </Pill>
                      <Pill kind={STATUS_KIND[status]}>{STATUS_LABEL[status]}</Pill>
                    </span>
                  </div>
                  <div style={styles.progressTrack}>
                    <div
                      className="kua-bar-grow"
                      style={{ ...styles.progressFill, '--target-width': `${progressPct}%`, width: `${progressPct}%`, background: `linear-gradient(90deg, ${accent}, ${accent}cc)`, boxShadow: `0 0 16px ${accent}66` }}
                    />
                    <div
                      style={{ ...styles.expectedMarker, left: `${expectedProgressPct}%` }}
                      title={`Expected by ${CURRENT_YEAR}: ${expectedProgressPct.toFixed(0)}% of the reduction. Linear trajectory ${target.baselineYear} → ${target.targetYear}.`}
                    />
                  </div>
                  <div style={styles.progressFootRow}>
                    <span style={{ ...styles.progressFootBadge, color: aheadOfPace ? '#86efac' : '#fbbf24' }}>
                      {aheadOfPace ? '✓ Ahead of pace' : '⚠ Behind pace'}
                    </span>
                    <span style={styles.progressFootText}>
                      {progressPct.toFixed(0)}% achieved vs {expectedProgressPct.toFixed(0)}% expected by {CURRENT_YEAR}
                      {' '}({yearsElapsed} of {yearsTotal} years elapsed)
                    </span>
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
                  unit={unitLabel}
                  color={accent}
                  fill={`${accent}26`}
                  width={isNarrow ? 320 : 520}
                  height={isNarrow ? 160 : 200}
                  title={`Linear trajectory — ${target.baselineYear} → ${target.targetYear}`}
                />
                <div style={styles.chartFoot}>
                  Trajectory at {CURRENT_YEAR}: <strong style={{ color: '#cbd5e1' }}>{Math.round(expectedNow).toLocaleString()}</strong> {unitLabel}
                  {' · '}
                  Actual: <strong style={{ color: status === 'on_track' ? '#86efac' : status === 'lagging' ? '#fbbf24' : '#fca5a5' }}>
                    {Math.round(actual).toLocaleString()}
                  </strong>
                </div>
              </div>
            </div>
          </ModuleSection>
          </div>
        );
      })}

      <ResourcesSection />

      <ModuleSection title="Why these specific targets?">
        <ul style={styles.notes}>
          <li>Targets follow the <strong>Science Based Targets initiative (SBTi)</strong> guidance for educational institutions: ~50% absolute reduction by 2030 + net-zero by 2050.</li>
          <li>Sub-targets (Scope 2 by 2027, dining by 2028) are <strong>milestones</strong>, not the whole picture — they're tracked because they're where KUA has the most direct control.</li>
          <li>"Approved" means the Board of Trustees has ratified the figure. Until then everything on this page is <strong>preliminary</strong> and shouldn't appear in external reporting.</li>
        </ul>
      </ModuleSection>

      <ModuleSection title="What would it take to hit these?">
        <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.7 }}>
          The simulator at <Link to="/scenarios" style={{ color: '#22d3ee', textDecoration: 'none', fontWeight: 700 }}>/scenarios →</Link>
          {' '}lets you move four sliders (electricity reduction, heat-pump electrification, solar PV,
          forest planting) and see live whether the combined lever moves are big enough to close
          the gap to a target. Useful for asking "is the 2030 target reachable without a heat pump
          program?" — turn that one to 0 and look at the modified net.
        </p>
      </ModuleSection>
    </ModulePage>
  );
}

// ─── HEADLINE HERO ──────────────────────────────────────────────────
// Big animated "gap to close" card for the most urgent target.
// Pattern mirrors the homepage NetEstimate hero: tilt + spotlight +
// AmbientParticles backdrop + countdown badge + baseline→today→target
// horizontal axis with measured marker.

function HeadlineHero({ target, actualByScope, provenanceByScope }) {
  const tiltRef = useCardTilt({ max: 4, scale: 1.005 });
  useSpotlight(tiltRef);
  const isNarrow = useIsNarrow();

  const actual = actualForTarget(target, actualByScope);
  const provenance = target.id === 'tg_dining_2028'
    ? 'estimated'
    : (provenanceByScope[target.scope] || 'estimated');

  const targetValue = target.baselineValue * (1 - target.percentReduction / 100);
  const gapToClose = Math.max(0, actual - targetValue);
  const unitLabel = target.scope === 'energy_kwh' ? 'kWh' : 'mtCO₂e';
  const accent = SCOPE_ACCENT[target.scope] || '#22d3ee';

  // Countdown to the target's deadline. Deadline anchored at end of
  // calendar year so "5y 0m" reads as "the year hasn't started yet."
  const deadlineDate = new Date(`${target.targetYear}-12-31T23:59:59Z`);
  const monthsRemaining = Math.max(0, Math.round((deadlineDate - new Date()) / (1000 * 60 * 60 * 24 * 30.4375)));
  const yearsRemaining = Math.floor(monthsRemaining / 12);
  const monthsAfterYears = monthsRemaining % 12;

  // Where SHOULD we be today vs where ARE we? Used for the axis tick
  // labels + percent-of-progress callout.
  const yearsTotal   = target.targetYear - target.baselineYear;
  const yearsElapsed = Math.max(0, Math.min(yearsTotal, CURRENT_YEAR - target.baselineYear));
  const expectedProgressPct = yearsTotal > 0 ? (yearsElapsed / yearsTotal) * 100 : 0;
  const reductionAchievedPct = ((target.baselineValue - actual) / target.baselineValue) * 100;
  const progressPct = Math.max(0, Math.min(100, (reductionAchievedPct / target.percentReduction) * 100));
  const aheadOfPace = progressPct >= expectedProgressPct;
  const status = trajectoryStatus(target, actual, CURRENT_YEAR);

  const ScopeIcon = SCOPE_ICON[target.scope] || Icon.Sparkles;
  const glow = STATUS_GLOW[status] || STATUS_GLOW.on_track;

  return (
    <section
      ref={tiltRef}
      className="kua-hero-card kua-tilt kua-spotlight"
      style={{
        ...styles.hero,
        borderColor: glow.border,
        boxShadow: `0 0 0 1px ${glow.border} inset, 0 20px 60px -20px ${glow.glow}`,
      }}
    >
      <AmbientParticles />
      <HeroOrnament accent={accent} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={styles.heroBadgeRow}>
          <span style={{ ...styles.heroIcon, color: accent, boxShadow: `0 0 20px ${accent}40, inset 0 0 0 1px ${accent}55` }}>
            <ScopeIcon size={18} />
          </span>
          <span style={styles.heroEyebrow}>Headline target · {target.targetYear}</span>
          <Pill kind={provenance === 'measured' ? 'good' : 'neutral'}>
            {provenance === 'measured' ? '✓ Measured' : 'Estimated'}
          </Pill>
          <Pill kind={STATUS_KIND[status]}>{STATUS_LABEL[status]}</Pill>
        </div>

        <h2 style={styles.heroTitle}>{target.title}</h2>

        <div style={isNarrow ? { ...styles.heroGrid, gridTemplateColumns: '1fr' } : styles.heroGrid}>
          <div>
            <div style={styles.heroGapLabel}>Gap to close</div>
            <div style={styles.heroGapValue}>
              <span style={{ color: accent, marginRight: 6 }}>▲</span>
              <AnimatedNumber value={Math.round(gapToClose)} duration={1400} />
              <span style={styles.heroGapUnit}>{unitLabel}</span>
            </div>
            <div style={styles.heroGapSub}>
              to reach <strong style={{ color: '#cbd5e1' }}>{Math.round(targetValue).toLocaleString()} {unitLabel}</strong> by {target.targetYear}
              {' '}— a {target.percentReduction}% cut vs the {target.baselineYear} baseline.
            </div>
          </div>

          <div style={styles.heroCountdown}>
            <div style={styles.heroCountdownLabel}>Time remaining</div>
            <div style={styles.heroCountdownValue}>
              <AnimatedNumber value={yearsRemaining} duration={900} /><span style={styles.heroCountdownUnit}>y</span>
              {' '}
              <AnimatedNumber value={monthsAfterYears} duration={900} /><span style={styles.heroCountdownUnit}>m</span>
            </div>
            <div style={styles.heroCountdownSub}>until {deadlineDate.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</div>
          </div>
        </div>

        <TrajectoryAxis
          baselineYear={target.baselineYear}
          baselineValue={target.baselineValue}
          targetYear={target.targetYear}
          targetValue={targetValue}
          actual={actual}
          unitLabel={unitLabel}
          accent={accent}
          aheadOfPace={aheadOfPace}
          progressPct={progressPct}
          expectedProgressPct={expectedProgressPct}
        />
      </div>
    </section>
  );
}

// ─── HERO ORNAMENT ──────────────────────────────────────────────────
// Decorative SVG drifting behind the hero card. Two faintly-tinted
// orbital rings + tick marks at compass cardinals — reads as a
// planning-instrument / target-reticle motif without being literal.
// Positioned absolutely at the right edge so it doesn't fight the
// gap-to-close + countdown content on the left. Drops out cleanly
// under prefers-reduced-motion (no animation, just static SVG).

function HeroOrnament({ accent }) {
  return (
    <svg
      width="320"
      height="320"
      viewBox="0 0 320 320"
      style={{
        position: 'absolute',
        right: '-40px',
        top: '50%',
        transform: 'translateY(-50%)',
        opacity: 0.08,
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="hero-ornament-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.8" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="160" cy="160" r="150" fill="url(#hero-ornament-grad)" />
      <circle cx="160" cy="160" r="140" stroke={accent} strokeWidth="1" fill="none" />
      <circle cx="160" cy="160" r="100" stroke={accent} strokeWidth="1" fill="none" />
      <circle cx="160" cy="160" r="60"  stroke={accent} strokeWidth="1" fill="none" />
      {/* Compass ticks at N / E / S / W */}
      <line x1="160" y1="10"  x2="160" y2="30"  stroke={accent} strokeWidth="2" />
      <line x1="160" y1="290" x2="160" y2="310" stroke={accent} strokeWidth="2" />
      <line x1="10"  y1="160" x2="30"  y2="160" stroke={accent} strokeWidth="2" />
      <line x1="290" y1="160" x2="310" y2="160" stroke={accent} strokeWidth="2" />
      {/* Inter-cardinals — shorter, hairline */}
      <line x1="55"  y1="55"  x2="70"  y2="70"  stroke={accent} strokeWidth="1" />
      <line x1="265" y1="55"  x2="250" y2="70"  stroke={accent} strokeWidth="1" />
      <line x1="55"  y1="265" x2="70"  y2="250" stroke={accent} strokeWidth="1" />
      <line x1="265" y1="265" x2="250" y2="250" stroke={accent} strokeWidth="1" />
      {/* Center dot */}
      <circle cx="160" cy="160" r="3" fill={accent} />
    </svg>
  );
}

// ─── TRAJECTORY AXIS ────────────────────────────────────────────────
// Horizontal axis with three nodes: baseline (left, filled), today
// (middle, position tracks years elapsed), target (right, hollow).
// Animated fill bar from baseline → today shows reduction achieved;
// dashed segment today → target shows the remaining gap. SVG so the
// node positions can use a clean coordinate system.

function TrajectoryAxis({
  baselineYear, baselineValue, targetYear, targetValue,
  actual, unitLabel, accent, aheadOfPace,
  progressPct, expectedProgressPct,
}) {
  const W = 800;
  const H = 96;
  const padL = 8;
  const padR = 8;
  const axisY = 44;
  const usable = W - padL - padR;

  // X position of "today" along the baseline→target axis. Uses the
  // expected-progress-by-time fraction (not the reduction fraction)
  // because the axis represents time, not progress.
  const todayFrac = Math.max(0, Math.min(1, expectedProgressPct / 100));
  const xBaseline = padL;
  const xToday    = padL + usable * todayFrac;
  const xTarget   = padL + usable;

  // Animated values for the node labels — counts up on mount.
  const baselineV = useAnimatedNumber(Math.round(baselineValue), 1200);
  const actualV   = useAnimatedNumber(Math.round(actual), 1400);
  const targetV   = useAnimatedNumber(Math.round(targetValue), 1200);

  return (
    <div style={styles.axisWrap}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }} role="img" aria-label="Baseline to target trajectory">
        {/* Full axis line (dashed for not-yet-traversed segment) */}
        <line x1={xToday} y1={axisY} x2={xTarget} y2={axisY} stroke="#334155" strokeWidth={2} strokeDasharray="4 4" />
        {/* Achieved segment, accent-colored, with glow */}
        <line x1={xBaseline} y1={axisY} x2={xToday} y2={axisY} stroke={accent} strokeWidth={3} strokeLinecap="round" />
        <line x1={xBaseline} y1={axisY} x2={xToday} y2={axisY} stroke={accent} strokeWidth={9} strokeLinecap="round" opacity={0.18} />

        {/* Baseline node */}
        <circle cx={xBaseline} cy={axisY} r={7} fill="#0b1220" stroke={accent} strokeWidth={2.5} />
        <text x={xBaseline} y={axisY - 18} fill="#94a3b8" fontSize="11" fontWeight="700" textAnchor="start" letterSpacing="0.5">{baselineYear} · BASELINE</text>
        <text x={xBaseline} y={axisY + 24} fill="#e5e7eb" fontSize="13" fontWeight="700" textAnchor="start" style={{ fontVariantNumeric: 'tabular-nums' }}>{baselineV.toLocaleString(undefined, { maximumFractionDigits: 0 })}</text>
        <text x={xBaseline} y={axisY + 38} fill="#64748b" fontSize="10" textAnchor="start">{unitLabel}</text>

        {/* Today node (centered on its x) */}
        <circle cx={xToday} cy={axisY} r={9} fill={accent} stroke="#0b1220" strokeWidth={2.5} />
        <circle cx={xToday} cy={axisY} r={14} fill="none" stroke={accent} strokeWidth={1.5} opacity={0.4} className="kua-pulse" />
        <text x={xToday} y={axisY - 18} fill={accent} fontSize="11" fontWeight="800" textAnchor="middle" letterSpacing="0.5">TODAY · {CURRENT_YEAR}</text>
        <text x={xToday} y={axisY + 24} fill="#e5e7eb" fontSize="13" fontWeight="700" textAnchor="middle" style={{ fontVariantNumeric: 'tabular-nums' }}>{actualV.toLocaleString(undefined, { maximumFractionDigits: 0 })}</text>
        <text x={xToday} y={axisY + 38} fill={aheadOfPace ? '#86efac' : '#fbbf24'} fontSize="10" fontWeight="700" textAnchor="middle">
          {aheadOfPace ? '✓ ahead of pace' : '⚠ behind pace'}
        </text>

        {/* Target node */}
        <circle cx={xTarget} cy={axisY} r={7} fill="#0b1220" stroke="#86efac" strokeWidth={2.5} strokeDasharray="3 2" />
        <text x={xTarget} y={axisY - 18} fill="#86efac" fontSize="11" fontWeight="700" textAnchor="end" letterSpacing="0.5">{targetYear} · GOAL</text>
        <text x={xTarget} y={axisY + 24} fill="#e5e7eb" fontSize="13" fontWeight="700" textAnchor="end" style={{ fontVariantNumeric: 'tabular-nums' }}>{targetV.toLocaleString(undefined, { maximumFractionDigits: 0 })}</text>
        <text x={xTarget} y={axisY + 38} fill="#64748b" fontSize="10" textAnchor="end">{unitLabel}</text>
      </svg>
      <div style={styles.axisFoot}>
        <span><strong style={{ color: '#e5e7eb' }}>{progressPct.toFixed(0)}%</strong> of the reduction achieved</span>
        <span style={{ color: '#64748b' }}>·</span>
        <span><strong style={{ color: '#cbd5e1' }}>{expectedProgressPct.toFixed(0)}%</strong> expected by today (linear)</span>
      </div>
    </div>
  );
}

// ─── DIAL TILE ──────────────────────────────────────────────────────
// One target, distilled to a circular SVG dial. Ring fills as we
// close the gap; the small notch on the ring shows where we should
// be today. Inline sparkline below shows the trajectory shape.

function DialTile({ target, actual, status, provenance }) {
  const accent = SCOPE_ACCENT[target.scope] || '#22d3ee';
  const reductionAchieved = ((target.baselineValue - actual) / target.baselineValue) * 100;
  const reductionNeeded   = target.percentReduction;
  const progressPct = Math.max(0, Math.min(100, (reductionAchieved / reductionNeeded) * 100));

  const yearsTotal   = target.targetYear - target.baselineYear;
  const yearsElapsed = Math.max(0, Math.min(yearsTotal, CURRENT_YEAR - target.baselineYear));
  const expectedProgressPct = yearsTotal > 0 ? (yearsElapsed / yearsTotal) * 100 : 0;
  const aheadOfPace = progressPct >= expectedProgressPct;

  // Concrete per-year reduction needed to stay on the linear pace.
  // Turns "−50% by 2030" from an abstract goal into a board-room
  // number ("drop ~364 mtCO₂e this year"). Bounded ≥ 0 so a
  // completed target doesn't show a phantom negative.
  const perYearReduction = yearsTotal > 0
    ? Math.max(0, target.baselineValue * (target.percentReduction / 100) / yearsTotal)
    : 0;

  // SVG dial geometry.
  const size = 110;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;

  // Animate the ring + the percent number on mount.
  const animPct  = useAnimatedNumber(progressPct, 1200);
  const dashOff  = circ * (1 - animPct / 100);
  const animDisplay = useAnimatedNumber(progressPct, 1200);

  // Position the "expected by now" notch on the ring. Convert percent
  // to an angle (top-anchored, clockwise).
  const expectedAngle = (expectedProgressPct / 100) * 2 * Math.PI - Math.PI / 2;
  const notchOuter = r + stroke / 2 + 2;
  const notchInner = r - stroke / 2 - 2;
  const nx1 = cx + Math.cos(expectedAngle) * notchInner;
  const ny1 = cy + Math.sin(expectedAngle) * notchInner;
  const nx2 = cx + Math.cos(expectedAngle) * notchOuter;
  const ny2 = cy + Math.sin(expectedAngle) * notchOuter;

  // Sparkline of the linear trajectory — flat-ish line that drops to
  // the target value. Visually communicates "this is a downward curve."
  const sparkData = [];
  for (let y = target.baselineYear; y <= target.targetYear; y++) {
    sparkData.push(targetTrajectoryAt(target, y));
  }

  const targetValue = target.baselineValue * (1 - target.percentReduction / 100);
  const unitLabel = target.scope === 'energy_kwh' ? 'kWh' : 'mtCO₂e';
  const yearsLeft = Math.max(0, target.targetYear - CURRENT_YEAR);

  function handleClick(e) {
    e.preventDefault();
    const el = document.getElementById(targetAnchor(target.id));
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const ScopeIcon = SCOPE_ICON[target.scope] || Icon.Sparkles;

  return (
    <a
      href={`#${targetAnchor(target.id)}`}
      onClick={handleClick}
      className="kua-card-hover"
      style={{ ...styles.dialCard, borderTopColor: accent }}
      aria-label={`Jump to ${target.title} details`}
    >
      <div style={styles.dialHeader}>
        <div style={styles.dialEyebrowRow}>
          <span style={{ ...styles.dialIcon, color: accent, boxShadow: `inset 0 0 0 1px ${accent}55` }}>
            <ScopeIcon size={12} />
          </span>
          <span style={styles.dialEyebrow}>{target.scope.toUpperCase()} · {target.targetYear}</span>
        </div>
        <Pill kind={STATUS_KIND[status]}>{STATUS_LABEL[status]}</Pill>
      </div>
      <div style={styles.dialTitle}>{target.title}</div>

      <div style={styles.dialBody}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
          {/* Track */}
          <circle cx={cx} cy={cy} r={r} stroke="#1f2937" strokeWidth={stroke} fill="none" />
          {/* Progress arc — rotated so 0% starts at 12 o'clock */}
          <circle
            cx={cx} cy={cy} r={r}
            stroke={accent}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={dashOff}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ filter: `drop-shadow(0 0 6px ${accent}88)` }}
          />
          {/* "Expected by now" tick on the ring */}
          {expectedProgressPct > 0 && expectedProgressPct < 100 && (
            <line x1={nx1} y1={ny1} x2={nx2} y2={ny2} stroke="#e5e7eb" strokeWidth={2} strokeLinecap="round" />
          )}
          {/* Center: percent readout. Scaled back from 22px → 17px so the
              right-side absolute "NOW → GOAL" numbers can carry equal
              visual weight. The ring fill already communicates
              progress visually; the percent number is the secondary
              read. */}
          <text x={cx} y={cy - 4} textAnchor="middle" dominantBaseline="middle" fill="#e5e7eb" fontSize="17" fontWeight="800" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {Math.round(animDisplay)}%
          </text>
          <text x={cx} y={cy + 14} textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="700" letterSpacing="0.6">
            OF GOAL
          </text>
        </svg>

        {/* Paired absolute-number display. NOW (current) and GOAL get
            the same font weight + ~18px size — perceptually balanced
            against the dial's ring fill rather than competing with a
            big center percent. The arrow + delta line ties them
            together as a "from → to" pair. */}
        <div style={styles.dialAbsBlock}>
          <div style={styles.dialAbsRow}>
            <span style={styles.dialAbsLabel}>NOW</span>
            <span style={styles.dialAbsValue}>
              {Math.round(actual).toLocaleString()}
              <span style={styles.dialAbsUnit}>{unitLabel}</span>
            </span>
          </div>
          <div style={styles.dialAbsArrow} aria-hidden="true">↓</div>
          <div style={styles.dialAbsRow}>
            <span style={{ ...styles.dialAbsLabel, color: '#86efac' }}>GOAL · {target.targetYear}</span>
            <span style={styles.dialAbsValue}>
              {Math.round(targetValue).toLocaleString()}
              <span style={styles.dialAbsUnit}>{unitLabel}</span>
            </span>
          </div>
          <div style={styles.dialAbsDelta}>
            <span>−{Math.round(target.baselineValue - targetValue).toLocaleString()} {unitLabel}</span>
            <span style={{ color: '#64748b' }}>·</span>
            <span>{yearsLeft} yrs left</span>
          </div>
        </div>
      </div>

      <div style={styles.dialSparkRow}>
        <Sparkline data={sparkData} color={accent} fill={`${accent}33`} width={220} height={28} />
        <span style={{ ...styles.dialPace, color: aheadOfPace ? '#86efac' : '#fbbf24' }}>
          {aheadOfPace ? '✓ ahead' : '⚠ behind'}
        </span>
      </div>

      {perYearReduction > 0 && (
        <div style={styles.dialPaceCallout}>
          <span style={styles.dialPaceLabel}>To stay on pace this year</span>
          <span style={{ ...styles.dialPaceValue, color: accent }}>
            −{Math.round(perYearReduction).toLocaleString()} <span style={styles.dialPaceUnit}>{unitLabel}/yr</span>
          </span>
        </div>
      )}

      <div style={styles.dialFoot}>
        <Pill kind={provenance === 'measured' ? 'good' : 'neutral'}>
          {provenance === 'measured' ? '✓ Measured' : 'Estimated'}
        </Pill>
        <span style={styles.dialOwner}>{target.owner}</span>
      </div>
    </a>
  );
}

// ─── RESOURCES ──────────────────────────────────────────────────────
// 38-entry curated library that gives the page substance beyond the
// dashboards above: frameworks the targets conform to, peer-school
// climate plans, funding programs we can stack, planning tools, the
// concrete action levers, and the deeper KUA-internal pages. The
// section is collapsible by default — it's a reference layer, not the
// main read.

function ResourcesSection() {
  const groups = RESOURCE_CATEGORIES.map((cat) => ({
    ...cat,
    items: GOAL_RESOURCES.filter((r) => r.category === cat.id),
  })).filter((g) => g.items.length > 0);

  return (
    <ModuleSection
      title={`Resources & references (${GOAL_RESOURCES.length})`}
      hint="The library that backs this page — frameworks our targets conform to, peer schools further along the curve, funding programs we can stack, tools we use, and the concrete action levers per target. Click any heading to expand."
      collapsible
      defaultOpen={false}
    >
      {groups.map((group, gi) => {
        const CatIcon = CATEGORY_ICON[group.id] || Icon.Sparkles;
        const accent = CATEGORY_ACCENT[group.id] || '#22d3ee';
        return (
          <details key={group.id} open={gi === 0} style={resStyles.group}>
            <summary style={resStyles.groupSummary}>
              <span style={resStyles.groupTitleRow}>
                <span style={{ ...resStyles.groupIcon, color: accent, boxShadow: `inset 0 0 0 1px ${accent}55` }}>
                  <CatIcon size={14} />
                </span>
                <span style={resStyles.groupTitle}>{group.title}</span>
              </span>
              <span style={resStyles.groupCount}>{group.items.length}</span>
            </summary>
            <p style={resStyles.groupBlurb}>{group.blurb}</p>
            <div style={resStyles.cardGrid}>
              {group.items.map((item) => (
                <ResourceCard key={item.title} item={item} categoryId={group.id} />
              ))}
            </div>
          </details>
        );
      })}
    </ModuleSection>
  );
}

function ResourceCard({ item, categoryId }) {
  const isInternal = item.href.startsWith('/');
  const kindAccent = CATEGORY_ACCENT[categoryId] || '#22d3ee';
  const scopeAccent = item.scope ? SCOPE_ACCENT[item.scope] : null;

  // External links open in a new tab; internal links use <Link>. Both
  // share the same card chrome so the visual treatment doesn't shift
  // by URL flavor.
  const inner = (
    <>
      <div style={resStyles.cardHeader}>
        <span style={{ ...resStyles.cardKind, color: kindAccent, borderColor: kindAccent, background: `${kindAccent}14` }}>
          {isInternal ? 'IN-DASH' : 'EXTERNAL'}
        </span>
        {item.scope && (
          <span style={{ ...resStyles.cardScope, color: scopeAccent, borderColor: `${scopeAccent}66` }}>
            {item.scope.toUpperCase()}
          </span>
        )}
      </div>
      <div style={resStyles.cardTitle}>{item.title}</div>
      <div style={resStyles.cardBlurb}>{item.blurb}</div>
      <div style={resStyles.cardHref}>
        {isInternal ? item.href : item.href.replace(/^https?:\/\//, '').replace(/\/$/, '')}
        <span style={resStyles.cardArrow} aria-hidden="true">→</span>
      </div>
    </>
  );

  if (isInternal) {
    return (
      <Link to={item.href} className="kua-card-hover" style={resStyles.card}>
        {inner}
      </Link>
    );
  }
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="kua-card-hover"
      style={resStyles.card}
    >
      {inner}
    </a>
  );
}

// Category accent palette — distinct hue per category so a reader can
// tell at a glance whether a card is a framework / peer / funding /
// tool / action / internal.
const CATEGORY_ACCENT = {
  framework: '#22d3ee',
  peer:      '#a855f7',
  funding:   '#fbbf24',
  tool:      '#38bdf8',
  action:    '#86efac',
  internal:  '#f472b6',
};

// Matching glyphs for each resource category. Same Feather-style
// stroke icons used elsewhere in the dashboard.
const CATEGORY_ICON = {
  framework: Icon.BookOpen,
  peer:      Icon.Building,
  funding:   Icon.DollarSign,
  tool:      Icon.Wrench,
  action:    Icon.Target,
  internal:  Icon.Home,
};

const resStyles = {
  group: {
    border: '1px solid #1f2937',
    borderRadius: 8,
    padding: '10px 14px',
    marginBottom: 10,
    background: '#0b1220',
  },
  groupSummary: {
    cursor: 'pointer',
    listStyle: 'none',
    outline: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  groupTitleRow: { display: 'inline-flex', alignItems: 'center', gap: 10 },
  groupIcon: {
    width: 26,
    height: 26,
    borderRadius: 6,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(15, 23, 42, 0.7)',
    flexShrink: 0,
  },
  groupTitle: {
    fontSize: 15,
    color: '#e5e7eb',
    fontWeight: 700,
    letterSpacing: '-0.005em',
  },
  groupCount: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: 700,
    padding: '2px 10px',
    borderRadius: 999,
    background: '#1e293b',
    border: '1px solid #334155',
    letterSpacing: 0.5,
  },
  groupBlurb: {
    fontSize: 13,
    color: '#94a3b8',
    margin: '8px 0 14px',
    lineHeight: 1.55,
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 10,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    padding: 12,
    background: '#0f172a',
    border: '1px solid #1f2937',
    borderRadius: 8,
    textDecoration: 'none',
    color: 'inherit',
    cursor: 'pointer',
  },
  cardHeader: { display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  cardKind: {
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: 0.7,
    padding: '2px 7px',
    borderRadius: 4,
    border: '1px solid',
    textTransform: 'uppercase',
  },
  cardScope: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 0.7,
    padding: '2px 7px',
    borderRadius: 4,
    border: '1px solid',
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 14,
    color: '#e5e7eb',
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: '-0.005em',
    marginTop: 2,
  },
  cardBlurb: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 1.5,
  },
  cardHref: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: 600,
    letterSpacing: 0.2,
    marginTop: 4,
    paddingTop: 6,
    borderTop: '1px dashed #1f2937',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 6,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  cardArrow: {
    color: '#94a3b8',
    fontWeight: 700,
    flexShrink: 0,
  },
};

// ─── HELPERS ─────────────────────────────────────────────────────────

// Dining target uses a sub-slice of Scope 3 we don't measure directly
// yet — pin it to baseline so the bar reads honestly rather than
// inheriting the whole-scope flip.
function actualForTarget(target, actualByScope) {
  if (target.id === 'tg_dining_2028') return target.baselineValue;
  return actualByScope[target.scope] ?? target.baselineValue;
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

function SummaryStat({ label, value, accent, note }) {
  const numeric = typeof value === 'number' ? value : null;
  return (
    <div className="kua-card-hover" style={{ ...styles.summaryCard, borderLeftColor: accent }}>
      <div style={styles.summaryLabel}>{label}</div>
      <div style={styles.summaryValue}>
        {numeric !== null ? <AnimatedNumber value={numeric} duration={900} /> : value}
      </div>
      {note && <div style={styles.summaryNote}>{note}</div>}
    </div>
  );
}

const btnStyle = {
  padding: '8px 14px',
  background: '#0e7490',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
  fontWeight: 700,
  fontSize: 13,
  fontFamily: 'inherit',
};

const styles = {
  // Hero
  hero: {
    position: 'relative',
    overflow: 'hidden',
    padding: 'clamp(20px, 3vw, 32px)',
    marginTop: 8,
    marginBottom: 16,
    border: '1px solid #1f2937',
    borderRadius: 16,
    background: 'linear-gradient(135deg, #0f172a 0%, #0d1525 60%, #11202e 100%)',
  },
  heroBadgeRow: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 14 },
  heroIcon: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(4px)',
  },
  heroEyebrow: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  heroTitle: {
    fontSize: 'clamp(20px, 3.4vw, 28px)',
    color: '#e5e7eb',
    fontWeight: 800,
    margin: 0,
    marginBottom: 20,
    letterSpacing: '-0.01em',
    lineHeight: 1.2,
  },
  heroGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(260px, 2fr) minmax(140px, 1fr)',
    gap: 24,
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  heroGapLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  heroGapValue: {
    fontSize: 'clamp(40px, 8vw, 64px)',
    color: '#e5e7eb',
    fontWeight: 800,
    lineHeight: 1.02,
    marginTop: 6,
    fontVariantNumeric: 'tabular-nums',
    letterSpacing: '-0.035em',
    fontFeatureSettings: '"cv11", "ss01"',
  },
  heroGapUnit: { fontSize: '0.4em', color: '#94a3b8', marginLeft: 10, fontWeight: 600 },
  heroGapSub: { fontSize: 14, color: '#94a3b8', marginTop: 8, lineHeight: 1.5, maxWidth: 520 },
  heroCountdown: {
    padding: '14px 16px',
    background: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid #1f2937',
    borderRadius: 10,
    textAlign: 'center',
    backdropFilter: 'blur(4px)',
  },
  heroCountdownLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  heroCountdownValue: {
    fontSize: 'clamp(24px, 4.5vw, 32px)',
    color: '#e5e7eb',
    fontWeight: 800,
    lineHeight: 1.1,
    marginTop: 6,
    fontVariantNumeric: 'tabular-nums',
  },
  heroCountdownUnit: { fontSize: '0.55em', color: '#94a3b8', marginLeft: 2, marginRight: 6, fontWeight: 600 },
  heroCountdownSub: { fontSize: 11, color: '#64748b', marginTop: 4 },

  // Axis
  axisWrap: { marginTop: 8 },
  axisFoot: {
    marginTop: 6,
    display: 'flex',
    gap: 10,
    justifyContent: 'center',
    flexWrap: 'wrap',
    fontSize: 12,
    color: '#94a3b8',
  },

  // Summary row
  summaryRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    padding: '14px 16px',
    background: '#0b1220',
    border: '1px solid #1f2937',
    borderLeft: '4px solid #22d3ee',
    borderRadius: 8,
  },
  summaryLabel: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 },
  summaryValue: { fontSize: 'clamp(20px, 4vw, 26px)', color: '#e5e7eb', fontWeight: 800, marginTop: 6, lineHeight: 1, fontVariantNumeric: 'tabular-nums' },
  summaryNote: { fontSize: 12, color: '#64748b', marginTop: 6, lineHeight: 1.5 },

  // Dial grid
  dialGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 14,
  },
  dialCard: {
    padding: 16,
    background: '#0b1220',
    border: '1px solid #1f2937',
    borderTop: '3px solid #22d3ee',
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    textDecoration: 'none',
    color: 'inherit',
    cursor: 'pointer',
  },
  dialPaceCallout: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 8,
    padding: '8px 10px',
    background: 'rgba(15, 23, 42, 0.7)',
    border: '1px solid #1f2937',
    borderRadius: 6,
  },
  dialPaceLabel: { fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 },
  dialPaceValue: { fontSize: 14, fontWeight: 800, fontVariantNumeric: 'tabular-nums' },
  dialPaceUnit: { fontSize: 10, color: '#94a3b8', fontWeight: 500, marginLeft: 2 },
  dialHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  dialEyebrowRow: { display: 'inline-flex', alignItems: 'center', gap: 6 },
  dialIcon: {
    width: 22,
    height: 22,
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(15, 23, 42, 0.5)',
  },
  dialEyebrow: { fontSize: 10, color: '#94a3b8', fontWeight: 800, letterSpacing: 1.0, textTransform: 'uppercase' },
  dialTitle: { fontSize: 14, color: '#e5e7eb', fontWeight: 700, lineHeight: 1.35 },
  dialBody: { display: 'flex', alignItems: 'center', gap: 14 },
  // Paired NOW → GOAL block. Designed so the two absolute values
  // sit at the same visual weight as the dial's center percent —
  // 18px tabular-nums bold, 10px uppercase eyebrow above each.
  // The arrow + delta row underneath ties them together.
  dialAbsBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    flex: 1,
    minWidth: 0,
  },
  dialAbsRow: { display: 'flex', flexDirection: 'column', gap: 2 },
  dialAbsLabel: {
    fontSize: 9,
    color: '#64748b',
    fontWeight: 800,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  dialAbsValue: {
    fontSize: 18,
    color: '#e5e7eb',
    fontWeight: 800,
    lineHeight: 1.1,
    fontVariantNumeric: 'tabular-nums',
    letterSpacing: '-0.01em',
  },
  dialAbsUnit: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: 500,
    marginLeft: 4,
    letterSpacing: 0,
  },
  dialAbsArrow: {
    fontSize: 12,
    color: '#475569',
    fontWeight: 700,
    lineHeight: 1,
    margin: '1px 0',
  },
  dialAbsDelta: {
    display: 'flex',
    gap: 6,
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: 600,
    marginTop: 4,
    paddingTop: 4,
    borderTop: '1px dashed #1f2937',
    fontVariantNumeric: 'tabular-nums',
  },
  dialSparkRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  dialPace: { fontSize: 11, fontWeight: 700, letterSpacing: 0.3 },
  dialFoot: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingTop: 6, borderTop: '1px solid #1f2937' },
  dialOwner: { fontSize: 11, color: '#64748b', textAlign: 'right', maxWidth: '60%', lineHeight: 1.3 },

  // Per-target detail rows (kept from prior design with refinements)
  row: { display: 'grid', gap: 16, gridTemplateColumns: 'minmax(280px, 1fr) minmax(360px, 2fr)', alignItems: 'flex-start' },
  left: {},
  statRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 },
  stat: { padding: 10, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6 },
  statLabel: { fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 },
  statValue: { fontSize: 18, color: '#e5e7eb', fontWeight: 800, marginTop: 4, fontVariantNumeric: 'tabular-nums' },
  statUnit: { fontSize: 10, color: '#94a3b8', marginLeft: 4, fontWeight: 500 },
  statSub: { fontSize: 11, color: '#64748b', marginTop: 4 },

  progressWrap: { marginBottom: 14 },
  progressLabel: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#94a3b8', marginBottom: 6, gap: 8, flexWrap: 'wrap' },
  progressTrack: { position: 'relative', height: 14, background: '#0f172a', border: '1px solid #1f2937', borderRadius: 7, overflow: 'visible' },
  progressFill: { height: '100%', borderRadius: 6, transition: 'width 700ms ease-out' },
  expectedMarker: {
    position: 'absolute',
    top: -4,
    bottom: -4,
    width: 3,
    background: '#e5e7eb',
    borderRadius: 1,
    boxShadow: '0 0 0 1px rgba(0,0,0,0.6)',
    pointerEvents: 'auto',
    cursor: 'help',
  },
  progressFootRow: { marginTop: 8, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  progressFootBadge: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 },
  progressFootText: { fontSize: 11, color: '#94a3b8' },

  meta: { display: 'flex', gap: 16, fontSize: 12, color: '#94a3b8', flexWrap: 'wrap' },
  chart: {},
  chartFoot: { marginTop: 8, fontSize: 12, color: '#94a3b8' },

  notes: { margin: 0, paddingLeft: 22, color: '#cbd5e1', fontSize: 14, lineHeight: 1.7 },
};
