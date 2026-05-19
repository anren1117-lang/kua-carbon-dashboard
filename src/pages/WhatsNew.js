import React from 'react';
import { Link } from 'react-router-dom';
import { ModulePage, ModuleSection, Pill } from '../components/ModuleShell.js';
import { Icon } from '../components/Icon.js';

// /whats-new — public changelog. Curated highlights, not a raw
// git log. Hand-edited so each entry has a real "why this
// matters" framing. Newest first.
//
// To add an entry: prepend it to ENTRIES. Keep titles tight,
// bodies one or two sentences, optionally link to the feature.
// Categories: 'feature', 'design', 'fix', 'data' — color-coded.

const ENTRIES = [
  {
    date: '2026-05-18',
    category: 'design',
    title: 'Cursor-following spotlight + Apple Vision Pro-style tilt on the homepage hero',
    body: 'Hover the homepage hero card and a soft cyan glow follows your cursor while the card subtly rotates toward you in 3D. Same effects you see on Linear, Vercel, and Apple\'s marketing pages.',
  },
  {
    date: '2026-05-18',
    category: 'feature',
    title: 'Cmd+K command palette',
    body: 'Press ⌘K (or Ctrl+K) anywhere on the dashboard to instantly search + jump to any page. Linear / Notion / Raycast-grade navigation.',
  },
  {
    date: '2026-05-18',
    category: 'design',
    title: 'Inter typography across the whole dashboard',
    body: 'Switched from the system font stack to Inter — the standard for premium dashboards. Numbers stack cleaner, headlines feel more refined.',
  },
  {
    date: '2026-05-18',
    category: 'feature',
    title: 'Compare any two buildings',
    body: 'New /compare-buildings page: pick any two of KUA\'s 19 buildings, see them head-to-head with per-metric winners.',
    link: '/compare-buildings',
  },
  {
    date: '2026-05-18',
    category: 'feature',
    title: 'Compare any two months',
    body: 'New /compare page: pick any two captured months, see the campus delta + which dorms moved up or down.',
    link: '/compare',
  },
  {
    date: '2026-05-18',
    category: 'feature',
    title: 'Monthly digest auto-generates',
    body: 'New /digest page assembles "what happened at KUA this month" automatically — most efficient dorm, biggest improver, campus delta, top emitter. Printable for newsletters.',
    link: '/digest',
  },
  {
    date: '2026-05-17',
    category: 'feature',
    title: 'Carbon math practice problems',
    body: 'New /carbon-math page: 8 interactive problems using real KUA numbers, three difficulty levels (Intro / Standard / AP). Designed for classroom use.',
    link: '/carbon-math',
  },
  {
    date: '2026-05-17',
    category: 'feature',
    title: 'Track your footprint over time',
    body: 'The personal-footprint calculator now saves snapshots to your browser. Come back in a few weeks and see your real trend, with a celebratory pill when you cut.',
    link: '/your-footprint',
  },
  {
    date: '2026-05-17',
    category: 'feature',
    title: 'Personal pledge + share text',
    body: 'After computing your footprint, save a 30%-reduction pledge to your browser and copy a tweet-length share string for dorm chats.',
    link: '/your-footprint',
  },
  {
    date: '2026-05-17',
    category: 'feature',
    title: 'Printable QR code posters for every dorm',
    body: 'New /dorm-posters page generates one QR per dorm, each linking to that dorm\'s detail page. Print, cut, post on dorm doors so residents scan to see live stats.',
    link: '/dorm-posters',
  },
  {
    date: '2026-05-17',
    category: 'design',
    title: '"What if every student did this" amplification',
    body: 'The footprint calculator now shows what your biggest reducible category cut, scaled across all KUA students, would mean for the campus — translated into cars, trees, and gasoline avoided.',
    link: '/your-footprint',
  },
  {
    date: '2026-05-17',
    category: 'design',
    title: 'Drop documents — AI does the rest',
    body: 'Surfaced the admin AI ingestion page as the easiest way to enter data. Drag any PDF, spreadsheet, or photo and the AI extracts the structured rows.',
  },
  {
    date: '2026-05-17',
    category: 'design',
    title: 'Photo + satellite modes on the campus map',
    body: 'The campus map now has four views: schematic, geographic, the official hand-drawn KUA map with energy dots overlaid, and real Esri satellite imagery.',
    link: '/campus-map',
  },
];

const CATEGORY_STYLE = {
  feature: { label: 'New feature', kind: 'good',    icon: Icon.Sparkles },
  design:  { label: 'Polish',       kind: 'info',    icon: Icon.Leaf },
  fix:     { label: 'Fix',          kind: 'warn',    icon: Icon.Refresh },
  data:    { label: 'Data update',  kind: 'neutral', icon: Icon.Chart },
};

function formatDate(s) {
  const d = new Date(s + 'T12:00:00');
  return d.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function WhatsNew() {
  return (
    <ModulePage
      title="What's new"
      subtitle="Curated highlights of recent dashboard improvements. The full commit history lives on GitHub if you want the gory details."
      toolbar={
        <a
          href="https://github.com/anren1117-lang/kua-carbon-dashboard/commits/main"
          target="_blank"
          rel="noopener noreferrer"
          style={{ padding: '8px 14px', background: '#0f172a', color: '#22d3ee', border: '1px solid #1f2937', borderRadius: 6, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}
        >
          Full git history →
        </a>
      }
    >
      <ModuleSection title={`${ENTRIES.length} recent updates`} hint="">
        <ol style={styles.list}>
          {ENTRIES.map((entry, i) => {
            const cfg = CATEGORY_STYLE[entry.category] || CATEGORY_STYLE.feature;
            const CatIcon = cfg.icon;
            return (
              <li key={i} style={styles.item} className="kua-card-hover">
                <div style={styles.itemHead}>
                  <div style={styles.itemLeft}>
                    <span style={styles.itemIcon}><CatIcon size={14} /></span>
                    <Pill kind={cfg.kind}>{cfg.label}</Pill>
                  </div>
                  <span style={styles.itemDate}>{formatDate(entry.date)}</span>
                </div>
                <h3 style={styles.itemTitle}>{entry.title}</h3>
                <p style={styles.itemBody}>{entry.body}</p>
                {entry.link && (
                  <Link to={entry.link} style={styles.itemLink} className="kua-cta-card">
                    Try it now
                    <span className="kua-cta-arrow" style={{ display: 'inline-flex', marginLeft: 4 }}>
                      <Icon.ArrowRight size={12} />
                    </span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </ModuleSection>

      <ModuleSection title="See what's coming" hint="">
        <p style={styles.fineprint}>
          Open issues + active work live on the public
          {' '}<a href="https://github.com/anren1117-lang/kua-carbon-dashboard/issues" target="_blank" rel="noopener noreferrer" style={styles.link}>GitHub issues board →</a>
          {' '}— suggest a feature, report a bug, or read what's in flight.
        </p>
      </ModuleSection>
    </ModulePage>
  );
}

const styles = {
  list: { listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 },
  item: {
    padding: '18px 20px',
    background: '#0b1220',
    border: '1px solid #1f2937',
    borderRadius: 10,
  },
  itemHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 12, flexWrap: 'wrap' },
  itemLeft: { display: 'flex', alignItems: 'center', gap: 10 },
  itemIcon: { color: '#64748b', display: 'inline-flex' },
  itemDate: { fontSize: 11, color: '#64748b', fontWeight: 600 },
  itemTitle: { margin: 0, marginBottom: 8, fontSize: 18, fontWeight: 700, color: '#e5e7eb', letterSpacing: '-0.005em' },
  itemBody: { margin: 0, fontSize: 14, color: '#cbd5e1', lineHeight: 1.65 },
  itemLink: { display: 'inline-flex', alignItems: 'center', marginTop: 12, fontSize: 13, color: '#22d3ee', fontWeight: 700, textDecoration: 'none' },
  fineprint: { fontSize: 13, color: '#94a3b8', lineHeight: 1.7 },
  link: { color: '#22d3ee', textDecoration: 'none', fontWeight: 700 },
};
