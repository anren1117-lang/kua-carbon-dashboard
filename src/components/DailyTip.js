import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

// Daily-rotating "tip of the day" card. Picks a tip based on day
// of year so it changes every day without persistence. 30 tips =
// most days of the month have a unique one; visitors see something
// new on each visit if they come back within a few weeks.
//
// Pure presentational; no API call, no data fetch — fast enough
// to render in the initial homepage paint.

const TIPS = [
  {
    icon: '💡',
    title: 'Unplug your chargers',
    body: 'Phone + laptop chargers pull a small "phantom load" even when nothing\'s connected. A KUA dorm with 18 residents = ~18 chargers × ~1 W each × 24h = 158 kWh/yr just from idle bricks.',
    link: '/your-footprint',
    linkText: 'Calculate yours',
  },
  {
    icon: '🚿',
    title: 'Shorter showers',
    body: 'Cutting one minute off a daily shower saves ~2.5 gallons of hot water. Across 340 students that\'s ~310,000 gallons of water-heating energy avoided per year.',
    link: '/your-footprint',
    linkText: 'Try the calculator',
  },
  {
    icon: '🥗',
    title: 'Skip beef one day a week',
    body: 'Beef is the highest-carbon food per serving (~9 kg CO₂e per 150g portion). One beefless day per week per student = ~160 mt/year campus-wide.',
    link: '/your-footprint',
    linkText: 'See your beef impact',
  },
  {
    icon: '🌡',
    title: 'Turn the thermostat down when you leave',
    body: 'A 2°F setback for the hours your dorm room is empty saves ~7% of heating energy. That\'s ~0.27 mt CO₂e per boarder per year.',
  },
  {
    icon: '🚗',
    title: 'Carpool to school',
    body: 'A 7-mile one-way commute alone = ~0.95 mtCO₂e/year. Carpooling one day a week cuts that by 20%.',
    link: '/your-footprint',
    linkText: 'Day-student calculator',
  },
  {
    icon: '✈️',
    title: 'Combine trips',
    body: 'One round-trip transatlantic flight ≈ 2.5 mtCO₂e — more than KUA\'s entire scope 2 emissions per student per year. Combine breaks where possible.',
  },
  {
    icon: '♻️',
    title: 'Sort food waste cleanly',
    body: 'Contamination forces compost loads back to landfill. One clean dorm compost bin = ~0.8 mt CO₂e avoided per year vs. landfill.',
  },
  {
    icon: '💻',
    title: 'Close laptop, don\'t sleep it',
    body: 'A MacBook in sleep still pulls ~1 W; fully shut down = 0 W. Across a class, this is small but adds up.',
  },
  {
    icon: '🌳',
    title: 'The KUA forest does a LOT',
    body: 'The ~1,000 acres of forest on campus sequester roughly 2,100 mtCO₂e/year — that\'s why KUA\'s net footprint is so much smaller than gross.',
    link: '/sinks-os',
    linkText: 'See the math',
  },
  {
    icon: '🏆',
    title: 'Watch your dorm\'s rank',
    body: 'The dorm leaderboard updates monthly. Check where your dorm sits — friendly competition is a real lever.',
    link: '/dorm-leaderboard',
    linkText: 'See the rankings',
  },
  {
    icon: '📊',
    title: 'The biggest scope at KUA is travel',
    body: 'Scope 3 (mostly student + faculty travel) is ~2x larger than Scope 1 (heating fuel) + Scope 2 (electricity) combined. Travel is the biggest reducible category at a boarding school.',
    link: '/scope-3',
    linkText: 'See Scope 3',
  },
  {
    icon: '🔌',
    title: 'Use power strips',
    body: 'Group your dorm chargers + lamps on one power strip and flip it off when you leave for break. Cuts idle load to zero for weeks at a time.',
  },
  {
    icon: '🌍',
    title: 'New Hampshire\'s grid is cleaner than most',
    body: 'ISO-NE\'s effective electricity emissions factor is ~0.235 kg CO₂/kWh — about half the national average. KUA\'s scope 2 is small partly because of where we live.',
    link: '/scope-2',
    linkText: 'See Scope 2',
  },
  {
    icon: '🏠',
    title: 'Heat pumps would change everything',
    body: 'Electrifying KUA\'s heating fuel via heat pumps (COP ~3) cuts scope 1 by ~80% — at the cost of a smaller scope 2 bump. The /scenarios simulator lets you model this.',
    link: '/scenarios',
    linkText: 'Try the simulator',
  },
  {
    icon: '☀️',
    title: 'Solar pays back in NH',
    body: 'A 500 kW solar install would generate ~650,000 kWh/yr (NH capacity factor ~1,300 kWh/kW). That offsets ~150 mt of scope 2 emissions.',
    link: '/scenarios',
    linkText: 'Model it',
  },
  {
    icon: '✋',
    title: 'Make a pledge',
    body: 'The footprint calculator lets you save a personal pledge (30% reduction in your biggest category) to your browser. Share it with friends.',
    link: '/your-footprint',
    linkText: 'Pledge yours',
  },
  {
    icon: '📥',
    title: 'School staff: drop documents',
    body: 'If you have a fuel-delivery invoice, dining receipt, or travel record, the admin AI ingestion page extracts the data automatically. Less manual entry.',
    link: '/admin/ai-ingestion',
    linkText: 'Drop documents',
  },
  {
    icon: '🥇',
    title: 'Per-resident, not absolute',
    body: 'When comparing dorms, always look at kWh per resident — a 48-person dorm will always use more in absolute terms than a 14-person dorm. Per-resident is the fair metric.',
    link: '/dorm-leaderboard',
    linkText: 'Leaderboard',
  },
  {
    icon: '🎯',
    title: 'KUA committed to SBTi-aligned targets',
    body: '~50% reduction by 2030 + net-zero by 2050. The /goals page shows live progress against each milestone.',
    link: '/goals',
    linkText: 'Track progress',
  },
  {
    icon: '🗺',
    title: 'See every building',
    body: 'The campus map has 4 modes including real satellite imagery. Click any building dot to see its monthly trend.',
    link: '/campus-map',
    linkText: 'Open the map',
  },
];

function dayOfYear(d = new Date()) {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function DailyTip() {
  const tip = useMemo(() => TIPS[dayOfYear() % TIPS.length], []);
  return (
    <div style={styles.wrap}>
      <section style={styles.card} className="kua-card-hover">
        <div style={styles.head}>
          <span style={styles.eyebrow}>💡 Tip of the day</span>
          <span style={styles.dateStamp}>{new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</span>
        </div>
        <div style={styles.body}>
          <div style={styles.icon} aria-hidden="true">{tip.icon}</div>
          <div style={{ flex: 1 }}>
            <h3 style={styles.title}>{tip.title}</h3>
            <p style={styles.text}>{tip.body}</p>
            {tip.link && (
              <Link to={tip.link} style={styles.link} className="kua-cta-card">
                {tip.linkText} →
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  wrap: { maxWidth: 1100, margin: '24px auto 0', padding: '0 16px' },
  card: {
    padding: '20px 24px',
    background: 'linear-gradient(135deg, rgba(58, 42, 13, 0.4) 0%, #0f172a 70%)',
    border: '1px solid #1f2937',
    borderLeft: '3px solid #fcd34d',
    borderRadius: 14,
  },
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14, gap: 12, flexWrap: 'wrap' },
  eyebrow: { fontSize: 11, color: '#fcd34d', textTransform: 'uppercase', letterSpacing: 1.4, fontWeight: 800 },
  dateStamp: { fontSize: 11, color: '#64748b', fontWeight: 600 },
  body: { display: 'flex', alignItems: 'flex-start', gap: 18 },
  icon: { fontSize: 36, lineHeight: 1, flexShrink: 0 },
  title: { fontSize: 18, fontWeight: 700, color: '#e5e7eb', margin: 0, marginBottom: 6, letterSpacing: '-0.005em' },
  text: { fontSize: 14, color: '#cbd5e1', lineHeight: 1.7, margin: 0, marginBottom: 12 },
  link: { fontSize: 13, color: '#fcd34d', textDecoration: 'none', fontWeight: 700 },
};
