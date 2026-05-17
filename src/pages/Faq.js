import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ModulePage, ModuleSection } from '../components/ModuleShell.js';

// /faq — common questions for parents, prospective students, and
// curious visitors. Each Q is collapsible (closed by default) and
// links to the relevant deep page where more detail lives. Goal:
// answer the question in two sentences + a link, not a wall of
// text on the FAQ page itself.

// Hoisted above the FAQ array so JSX inside the answers can
// reference them. The FAQ array's JSX evaluates at module-load
// time when imported by the page-render smoke test, so hoisting
// is required (TDZ otherwise).
const linkStyle = { color: '#22d3ee', textDecoration: 'none', fontWeight: 600 };
const codeStyle = { background: '#0b1220', padding: '1px 6px', borderRadius: 3, fontSize: 12, color: '#86efac' };

const FAQ = [
  {
    q: "What's a carbon footprint?",
    a: (
      <>
        It's the total amount of greenhouse gas (mostly CO₂) emitted by an activity, building,
        or organization in a year — expressed in metric tons of CO₂-equivalent (mtCO₂e). KUA's
        gross footprint is about 1,500 mtCO₂e/yr; the campus forest pulls back roughly 2,100
        of those, so the <strong>net</strong> figure shown on the homepage is the more honest
        number. <Link to="/" style={linkStyle}>See the headline number →</Link>
      </>
    ),
  },
  {
    q: "What are Scopes 1, 2, and 3?",
    a: (
      <>
        It's the standard accounting framework (GHG Protocol). <strong>Scope 1</strong> is
        emissions from things KUA burns directly (heating oil, propane, fleet gasoline).
        <strong> Scope 2</strong> is emissions from electricity KUA buys — we don't burn the
        fuel, but the power plant does on our behalf. <strong>Scope 3</strong> is everything
        else (student travel, supply chain, waste). The four-card scope breakdown on the
        homepage walks through each one. <Link to="/" style={linkStyle}>See the scopes →</Link>
      </>
    ),
  },
  {
    q: "How is this measured?",
    a: (
      <>
        Scope 2 (electricity) is real measured data from the Distech Eclypse building
        management system — every kWh used on campus is captured monthly. Scope 1 and Scope 3
        are still placeholders pending integration with fuel-delivery and travel records, but
        each uses cited cross-check methodologies. Every emission factor on the dashboard has
        a citation. <Link to="/methodology" style={linkStyle}>See the methodology →</Link>
      </>
    ),
  },
  {
    q: "What can I personally do?",
    a: (
      <>
        Try the personal-footprint calculator — five inputs about your commute, flights, diet,
        and dorm habits give you a per-year estimate plus suggestions targeted at YOUR biggest
        reducible rows. <Link to="/your-footprint" style={linkStyle}>Calculate your footprint →</Link>
      </>
    ),
  },
  {
    q: "Which dorms use the least energy?",
    a: (
      <>
        See the live dorm leaderboard — ranks all 11 student dorms by kWh per resident per year
        (the only fair comparison, since a 48-person dorm always uses more in absolute terms).
        There's also a monthly competition view for RA-run challenges.
        <Link to="/dorm-leaderboard" style={linkStyle}> Open the leaderboard →</Link>
        {' · '}
        <Link to="/challenge" style={linkStyle}>Monthly challenge →</Link>
      </>
    ),
  },
  {
    q: "Where can I see the campus on a map?",
    a: (
      <>
        The campus map page shows every tracked building's emissions in four modes: a
        category-grouped schematic, a geographic projection, the official KUA bird's-eye
        illustration with energy dots overlaid, and real satellite imagery. Click any
        building for its full detail page. <Link to="/campus-map" style={linkStyle}>Open the map →</Link>
      </>
    ),
  },
  {
    q: "What is the campus forest worth in carbon terms?",
    a: (
      <>
        Roughly 1,000 acres of KUA's 1,300-acre campus is forested, sequestering an estimated
        2,100 mtCO₂e/year via tree growth and soil carbon. This is what makes KUA's net
        footprint substantially smaller than peer boarding schools that don't measure their
        forest. <Link to="/sinks-os" style={linkStyle}>See the sinks page →</Link>
      </>
    ),
  },
  {
    q: "What would it take to hit net-zero?",
    a: (
      <>
        Try the interactive simulator — four sliders (electricity cuts, heat-pump
        electrification, solar PV, additional tree planting) let you model different reduction
        strategies and see live whether the combined impact closes the gap to a target year.
        <Link to="/scenarios" style={linkStyle}> Open the simulator →</Link>
      </>
    ),
  },
  {
    q: "How current is this data?",
    a: (
      <>
        BMS electricity data is captured monthly (latest captured month visible on the campus
        map's time slider). Environmental news is refreshed every 24 hours. Heating fuel +
        travel data updates whenever Facilities and Admissions feed records into the admin
        portal. Each metric on the dashboard carries a provenance pill showing whether it's
        <strong> measured</strong>, <strong>cited</strong>, or <strong>estimated</strong>.
      </>
    ),
  },
  {
    q: "Can I subscribe to alerts?",
    a: (
      <>
        Yes — KUA staff can subscribe to data-quality and anomaly alerts through the admin
        portal at <code style={codeStyle}>/admin/alerts</code>. Alerts fire when something
        unusual happens (a meter goes dead, monthly numbers drift far from expected). One-click
        unsubscribe is on every email.
      </>
    ),
  },
  {
    q: "I'm a teacher — is there content I can use in class?",
    a: (
      <>
        Yes — the Learn portal has eight short learning paths (Intro for any grade, Standard
        with KUA's specific data, AP-level deep dives in chem / bio / physics / stats). The
        Teacher portal lets you assign lessons + see results. <Link to="/learn" style={linkStyle}>Open Learn →</Link>
        {' · '}<Link to="/teacher" style={linkStyle}>Teacher portal →</Link>
      </>
    ),
  },
  {
    q: "Is the source code public?",
    a: (
      <>
        Yes — the entire dashboard codebase (React frontend, Vercel serverless API, methodology,
        emission factors, all of it) is open source on GitHub. Every commit ships with a
        descriptive message explaining the change. If you find a methodology error, please
        open an issue.
      </>
    ),
  },
];

export default function Faq() {
  // Track open state per-question. Start with the first 3 open as
  // "preview" so first-time visitors see substance immediately;
  // they can close them and explore others.
  const [open, setOpen] = useState(() => new Set([0, 1, 2]));
  const toggle = (i) => setOpen((prev) => {
    const next = new Set(prev);
    if (next.has(i)) next.delete(i); else next.add(i);
    return next;
  });

  return (
    <ModulePage
      title="Frequently asked questions"
      subtitle="Answers to the things parents, prospective students, and curious visitors ask most often. Each answer is short, with a link to the page where the full detail lives."
    >
      <ModuleSection title="" hint="">
        <ol style={styles.list}>
          {FAQ.map((item, i) => {
            const isOpen = open.has(i);
            return (
              <li key={i} style={styles.item}>
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  style={{ ...styles.qBtn, color: isOpen ? '#22d3ee' : '#e5e7eb' }}
                  aria-expanded={isOpen}
                >
                  <span style={styles.qArrow}>{isOpen ? '▼' : '▶'}</span>
                  <span style={styles.qText}>{item.q}</span>
                </button>
                {isOpen && (
                  <div style={styles.answer}>
                    {item.a}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </ModuleSection>

      <ModuleSection title="Didn't find your question?" hint="">
        <p style={styles.fineprint}>
          The Ask portal lets you chat with an AI tutor trained on KUA's
          methodology, factors, and data shape. It's connected to the same
          sources documented on the <Link to="/methodology" style={linkStyle}>Methodology page</Link>.
          {' '}<Link to="/ask" style={linkStyle}>Open Ask →</Link>
        </p>
      </ModuleSection>
    </ModulePage>
  );
}

const styles = {
  list: { listStyle: 'none', padding: 0, margin: 0 },
  item: { padding: '6px 0', borderBottom: '1px solid #1f2937' },
  qBtn: {
    width: '100%',
    background: 'transparent',
    border: 'none',
    padding: '12px 0',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'inherit',
    fontSize: 15,
    fontWeight: 600,
  },
  qArrow: { fontSize: 10, color: '#64748b', width: 12 },
  qText:  { flex: 1 },
  answer: { padding: '4px 22px 14px 22px', fontSize: 14, color: '#cbd5e1', lineHeight: 1.7 },
  fineprint: { fontSize: 14, color: '#94a3b8', lineHeight: 1.7 },
};
