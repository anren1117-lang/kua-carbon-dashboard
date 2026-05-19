import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ModulePage, ModuleSection, Pill } from '../components/ModuleShell.js';
import { AnimatedNumber } from '../components/AnimatedNumber.js';
import { Icon } from '../components/Icon.js';
import { useSpotlight } from '../hooks/useSpotlight.js';
import { computeBuildingEmissions } from '../utils/buildingEmissions.js';
import { buildingMonthlyHistory, monthlyReports, campusMonthlyTotals } from '../data/monthlyConsumption.js';
import { COMPOSED_YTD_AS_OF } from '../data/composedYtd.js';

// /digest — "what happened this month at KUA, in one page."
// Designed for school newsletter, parent emails, RA handouts.
// Auto-generates from the most recent BMS-captured month:
//   - Champion dorm (lowest kWh/resident this month)
//   - Most-improved dorm (biggest reduction vs prior month)
//   - Campus total + delta from prior month
//   - Top emissions building of the month
//   - Print button for putting on the bulletin board
//
// Single-page intentional artifact, not a deep-dive.

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
function formatMonth(ym) {
  if (!ym) return '';
  const [y, m] = ym.split('-').map(Number);
  if (!Number.isFinite(m) || m < 1 || m > 12) return ym;
  return `${MONTH_NAMES[m - 1]} ${y}`;
}

const ISO_NE_KG_PER_KWH = 0.235;

export default function MonthlyDigest() {
  const heroSpotRef = useSpotlight();
  const monthly = campusMonthlyTotals().sort((a, b) => a.month.localeCompare(b.month));
  const latest  = monthly[monthly.length - 1] || null;
  const prior   = monthly[monthly.length - 2] || null;

  const { rows } = useMemo(() => computeBuildingEmissions(), []);
  const history = useMemo(() => buildingMonthlyHistory(), []);

  const dormStandings = useMemo(() => {
    if (!latest) return [];
    return rows
      .filter((r) => r.category === 'Dorm' && r.occupants > 0)
      .map((d) => {
        const thisKwh = history[d.id]?.[latest.month] || 0;
        const priorKwh = prior ? (history[d.id]?.[prior.month] || 0) : 0;
        const thisPer = d.occupants > 0 ? thisKwh / d.occupants : 0;
        const priorPer = d.occupants > 0 ? priorKwh / d.occupants : 0;
        const pctChange = priorPer > 0 ? ((thisPer - priorPer) / priorPer) * 100 : null;
        return { ...d, thisPer: Math.round(thisPer), priorPer: Math.round(priorPer), pctChange };
      })
      .filter((d) => d.thisPer > 0);
  }, [rows, history, latest, prior]);

  const champion = useMemo(() => {
    return [...dormStandings].sort((a, b) => a.thisPer - b.thisPer)[0] || null;
  }, [dormStandings]);

  const mostImproved = useMemo(() => {
    return [...dormStandings]
      .filter((d) => d.pctChange !== null && d.pctChange < -1)
      .sort((a, b) => a.pctChange - b.pctChange)[0] || null;
  }, [dormStandings]);

  const topEmitter = useMemo(() => {
    if (!latest) return null;
    return [...rows]
      .map((r) => ({ ...r, thisKwh: history[r.id]?.[latest.month] || 0 }))
      .sort((a, b) => b.thisKwh - a.thisKwh)[0] || null;
  }, [rows, history, latest]);

  const campusMt   = latest ? Math.round((latest.displayedTotal * ISO_NE_KG_PER_KWH) / 1000) : 0;
  const priorMt    = prior  ? Math.round((prior.displayedTotal  * ISO_NE_KG_PER_KWH) / 1000) : 0;
  const campusDelta = priorMt > 0 ? Math.round(((campusMt - priorMt) / priorMt) * 100) : null;
  const campusGoodDirection = campusDelta !== null && campusDelta < 0;

  if (!latest) {
    return (
      <ModulePage title="Monthly digest" subtitle="No monthly data captured yet.">
        <ModuleSection title="Waiting for the first month">
          <p style={styles.fineprint}>
            The digest auto-generates from the most recent month of BMS data. As soon as
            a full month is captured, this page lights up with that month's standings.
          </p>
        </ModuleSection>
      </ModulePage>
    );
  }

  return (
    <ModulePage
      title={`KUA carbon digest — ${formatMonth(latest.month)}`}
      subtitle={`Auto-generated summary of the most recent month of measured electricity data. Drop this on the bulletin board, attach to the parent newsletter, or share at a faculty meeting. Data fresh as of ${COMPOSED_YTD_AS_OF}.`}
      toolbar={
        <button
          type="button"
          onClick={() => window.print()}
          style={styles.printBtn}
          title="Print this digest or save as PDF"
        >
          🖨 Print / Save PDF
        </button>
      }
    >
      <ModuleSection title="Campus electricity this month" hint="">
        <div ref={heroSpotRef} style={{ ...styles.heroCard, position: 'relative' }} className="kua-card-hover kua-spotlight">
          <div style={styles.heroLabel}>{formatMonth(latest.month).toUpperCase()}</div>
          <div style={styles.heroValue}>
            <AnimatedNumber value={latest.displayedTotal} duration={1300} />
            <span style={styles.heroUnit}> kWh</span>
          </div>
          <div style={styles.heroSub}>
            ≈ <AnimatedNumber value={campusMt} duration={1300} /> mtCO₂e
            {campusDelta !== null && (
              <span style={{ marginLeft: 12 }}>
                <Pill kind={campusGoodDirection ? 'good' : 'warn'}>
                  {campusDelta < 0 ? '↓' : '↑'} {Math.abs(campusDelta)}% vs {formatMonth(prior.month)}
                </Pill>
              </span>
            )}
          </div>
        </div>
      </ModuleSection>

      <div style={styles.twoCol}>
        {champion && (
          <ModuleSection title="🏆 Most efficient dorm" hint="">
            <div style={styles.miniCard} className="kua-card-hover kua-champion-glow">
              <Link to={`/buildings/${champion.id}`} style={styles.miniName}>{champion.name}</Link>
              <div style={styles.miniValue}>
                <AnimatedNumber value={champion.thisPer} duration={1100} />
                <span style={styles.miniUnit}> kWh / resident</span>
              </div>
              <div style={styles.miniMeta}>{champion.occupants} residents this month</div>
            </div>
          </ModuleSection>
        )}

        {mostImproved && (
          <ModuleSection title="📈 Biggest improvement" hint="">
            <div style={styles.miniCard} className="kua-card-hover">
              <Link to={`/buildings/${mostImproved.id}`} style={styles.miniName}>{mostImproved.name}</Link>
              <div style={{ ...styles.miniValue, color: '#86efac' }}>
                ↓ <AnimatedNumber value={Math.abs(Math.round(mostImproved.pctChange))} duration={1100} />%
              </div>
              <div style={styles.miniMeta}>
                {mostImproved.priorPer} → {mostImproved.thisPer} kWh/resident vs {formatMonth(prior?.month)}
              </div>
            </div>
          </ModuleSection>
        )}
      </div>

      {topEmitter && topEmitter.thisKwh > 0 && (
        <ModuleSection title="🔌 Heaviest single building this month" hint="Usually a function of size + occupancy — not necessarily 'inefficient.'">
          <div style={styles.miniCard} className="kua-card-hover">
            <Link to={`/buildings/${topEmitter.id}`} style={styles.miniName}>{topEmitter.name}</Link>
            <div style={styles.miniValue}>
              <AnimatedNumber value={Math.round(topEmitter.thisKwh)} duration={1100} />
              <span style={styles.miniUnit}> kWh in {formatMonth(latest.month)}</span>
            </div>
            <div style={styles.miniMeta}>
              {topEmitter.category} · {topEmitter.sqft.toLocaleString()} sqft · {topEmitter.occupants.toLocaleString()} daily occupants
            </div>
          </div>
        </ModuleSection>
      )}

      <ModuleSection title="What's next" hint="">
        <ul style={styles.nextList}>
          <li><Link to="/dorm-leaderboard" style={styles.link}>Full dorm leaderboard →</Link> — annualized rankings, not just this month</li>
          <li><Link to="/challenge" style={styles.link}>Monthly dorm challenge →</Link> — two-champion scoreboard for RA energy challenges</li>
          <li><Link to="/your-footprint" style={styles.link}>Your personal footprint →</Link> — calculator + "what if everyone did this" projection</li>
          <li><Link to="/scenarios" style={styles.link}>Reduction simulator →</Link> — model what a 25% cut + heat pumps + solar would do campus-wide</li>
          <li><Link to="/campus-map" style={styles.link}>Campus map →</Link> — see every building, four view modes (including satellite)</li>
        </ul>
      </ModuleSection>

      <p style={styles.footer}>
        Auto-generated each time you load this page from the most recently captured BMS month.
        For an archive of past months or a richer historical view see
        the <Link to="/campus-map" style={styles.link}>campus map's time slider</Link>.
      </p>
    </ModulePage>
  );
}

const styles = {
  printBtn: { padding: '8px 14px', background: '#0e7490', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit' },

  heroCard: {
    padding: '24px 26px',
    background: 'linear-gradient(135deg, rgba(8, 51, 68, 0.5) 0%, #0f172a 70%)',
    border: '1px solid #1f2937',
    borderLeft: '4px solid #22d3ee',
    borderRadius: 12,
  },
  heroLabel: { fontSize: 11, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: 1.6, fontWeight: 800, marginBottom: 10 },
  heroValue: {
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
  heroUnit: { fontSize: 18, color: '#94a3b8', marginLeft: 8, fontWeight: 500, WebkitBackgroundClip: 'initial', WebkitTextFillColor: 'initial', background: 'none', filter: 'none' },
  heroSub: { fontSize: 14, color: '#cbd5e1', marginTop: 12, display: 'flex', alignItems: 'center', flexWrap: 'wrap' },

  twoCol: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, marginTop: 8 },

  miniCard: {
    padding: '18px 20px',
    background: '#0b1220',
    border: '1px solid #1f2937',
    borderRadius: 10,
  },
  miniName: {
    fontSize: 19,
    fontWeight: 700,
    color: '#22d3ee',
    textDecoration: 'none',
    display: 'block',
    marginBottom: 10,
  },
  miniValue: {
    fontSize: 26,
    fontWeight: 800,
    color: '#e5e7eb',
    fontVariantNumeric: 'tabular-nums',
    marginBottom: 6,
  },
  miniUnit: { fontSize: 14, color: '#94a3b8', fontWeight: 500 },
  miniMeta: { fontSize: 12, color: '#94a3b8', lineHeight: 1.5 },

  nextList: { listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10, fontSize: 14, color: '#cbd5e1', lineHeight: 1.5 },
  link: { color: '#22d3ee', textDecoration: 'none', fontWeight: 700 },

  footer: { fontSize: 12, color: '#64748b', fontStyle: 'italic', marginTop: 24, lineHeight: 1.6 },
  fineprint: { fontSize: 13, color: '#94a3b8', lineHeight: 1.7 },
};
