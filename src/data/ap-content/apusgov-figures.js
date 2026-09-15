// AP US Government — inline SVG figures.
import React from 'react';

const COL = {
  green: '#22c55e', cyan: '#22d3ee', amber: '#fbbf24', red: '#ef4444',
  slate: '#94a3b8', dim: '#475569', text: '#e5e7eb', textDim: '#cbd5e1',
  bgLight: '#0f172a',
};

// 1.6 Checks and balances
const ChecksBalances = () => (
  <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" aria-label="Checks and balances among three branches">
    <rect x="0" y="0" width="600" height="280" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Checks and Balances — three branches keep each other in check</text>
    {/* Three branches in triangle */}
    {[
      { x: 300, y: 60,  label: 'Legislative', detail: 'Congress', col: COL.cyan },
      { x: 120, y: 180, label: 'Executive', detail: 'President', col: COL.red },
      { x: 480, y: 180, label: 'Judicial', detail: 'Supreme Court', col: COL.green },
    ].map((b, i) => (
      <g key={i}>
        <circle cx={b.x} cy={b.y} r="42" fill={b.col} opacity="0.2" stroke={b.col} strokeWidth="2" />
        <text x={b.x} y={b.y - 6} textAnchor="middle" fill={b.col} fontSize="13" fontWeight="700">{b.label}</text>
        <text x={b.x} y={b.y + 10} textAnchor="middle" fill={COL.text} fontSize="11">{b.detail}</text>
      </g>
    ))}
    {/* Arrows between */}
    <line x1="270" y1="95" x2="155" y2="160" stroke={COL.slate} markerEnd="url(#cbArr)" />
    <line x1="330" y1="95" x2="445" y2="160" stroke={COL.slate} markerEnd="url(#cbArr)" />
    <line x1="170" y1="200" x2="430" y2="200" stroke={COL.slate} markerEnd="url(#cbArr)" />
    <line x1="430" y1="180" x2="170" y2="180" stroke={COL.slate} markerEnd="url(#cbArr)" />
    <text x="200" y="125" fill={COL.slate} fontSize="9">veto, appoint</text>
    <text x="400" y="125" fill={COL.slate} fontSize="9">appoint, treaties</text>
    <text x="300" y="220" textAnchor="middle" fill={COL.slate} fontSize="9">judicial review · impeach</text>
    <text x="300" y="255" textAnchor="middle" fill={COL.slate} fontSize="10">Federalist 51: "Ambition must be made to counteract ambition."</text>
    <defs>
      <marker id="cbArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill={COL.slate} />
      </marker>
    </defs>
  </svg>
);

// 2.1 Bicameral Congress
const Bicameral = () => (
  <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" aria-label="Bicameral Congress">
    <rect x="0" y="0" width="600" height="240" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Bicameral Congress — two chambers, different rules</text>
    {[
      { x: 40, label: 'House of Representatives', col: COL.cyan, items: ['435 members', '2-year terms', 'Based on population', 'Originates revenue bills', 'Initiates impeachment', 'Speaker leads'] },
      { x: 320, label: 'Senate', col: COL.green, items: ['100 senators', '6-year terms', '2 per state', 'Ratifies treaties (2/3)', 'Confirms appointments', 'Tries impeachments'] },
    ].map((c, i) => (
      <g key={i}>
        <rect x={c.x} y="50" width="240" height="180" rx="8" fill={c.col} opacity="0.12" stroke={c.col} strokeWidth="1.5" />
        <text x={c.x + 120} y="78" textAnchor="middle" fill={c.col} fontSize="14" fontWeight="700">{c.label}</text>
        {c.items.map((it, j) => (
          <text key={j} x={c.x + 16} y={108 + j * 20} fill={COL.text} fontSize="11">• {it}</text>
        ))}
      </g>
    ))}
  </svg>
);

// 5.8 Electoral college
const ElectoralCollege = () => (
  <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" aria-label="Electoral College">
    <rect x="0" y="0" width="600" height="260" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Electoral College — 538 electors, 270 to win</text>
    {/* Big number */}
    <text x="300" y="100" textAnchor="middle" fill={COL.cyan} fontSize="48" fontWeight="800">538</text>
    <text x="300" y="125" textAnchor="middle" fill={COL.textDim} fontSize="12">total electors</text>
    <text x="300" y="155" textAnchor="middle" fill={COL.green} fontSize="28" fontWeight="700">270</text>
    <text x="300" y="172" textAnchor="middle" fill={COL.textDim} fontSize="11">needed to win</text>
    {/* Composition */}
    <text x="120" y="210" textAnchor="middle" fill={COL.amber} fontSize="11" fontWeight="700">435</text>
    <text x="120" y="225" textAnchor="middle" fill={COL.slate} fontSize="10">House seats</text>
    <text x="300" y="210" textAnchor="middle" fill={COL.amber} fontSize="11" fontWeight="700">100</text>
    <text x="300" y="225" textAnchor="middle" fill={COL.slate} fontSize="10">Senate seats</text>
    <text x="480" y="210" textAnchor="middle" fill={COL.amber} fontSize="11" fontWeight="700">3</text>
    <text x="480" y="225" textAnchor="middle" fill={COL.slate} fontSize="10">DC electors</text>
    <text x="300" y="250" textAnchor="middle" fill={COL.slate} fontSize="9">Most states: winner-take-all. Maine and Nebraska split by congressional district.</text>
  </svg>
);

// 2.2 How a bill becomes law
const BillToLaw = () => (
  <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" aria-label="How a bill becomes a law">
    <rect x="0" y="0" width="600" height="240" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">How a bill becomes a law</text>
    {[
      { x: 20,  label: 'Introduced', col: COL.cyan },
      { x: 130, label: 'Committee', col: COL.green },
      { x: 240, label: 'Floor vote', col: COL.amber },
      { x: 350, label: 'Other chamber', col: COL.amber },
      { x: 460, label: 'Conference', col: '#f97316' },
      { x: 540, label: 'President', col: COL.red },
    ].slice(0, 6).map((s, i) => (
      <g key={i}>
        <rect x={s.x} y="80" width="95" height="100" rx="6" fill={s.col} opacity="0.18" stroke={s.col} />
        <text x={s.x + 47} y="120" textAnchor="middle" fill={s.col} fontSize="11" fontWeight="700">{i + 1}.</text>
        <text x={s.x + 47} y="140" textAnchor="middle" fill={COL.text} fontSize="10">{s.label}</text>
        {i < 5 && <line x1={s.x + 95} y1="130" x2={s.x + 108} y2="130" stroke={COL.slate} markerEnd="url(#blawArr)" />}
      </g>
    ))}
    <text x="300" y="210" textAnchor="middle" fill={COL.slate} fontSize="10">Most bills die in committee. Of ~10,000 bills introduced per Congress, ~3-5% become law.</text>
    <defs>
      <marker id="blawArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill={COL.slate} />
      </marker>
    </defs>
  </svg>
);

// 4.7 Party platforms
const PartyPlatforms = () => (
  <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" aria-label="Democratic vs Republican platforms">
    <rect x="0" y="0" width="600" height="280" fill={COL.bgLight} />
    <text x="300" y="22" textAnchor="middle" fill={COL.amber} fontSize="13" fontWeight="700">Major party positions (simplified)</text>
    {[
      { x: 30, label: 'Democratic', col: COL.cyan, items: ['Active government', 'Higher taxes on wealthy', 'Climate action', 'Universal healthcare', 'Pro-choice', 'Gun control', 'Path to citizenship'] },
      { x: 320, label: 'Republican', col: COL.red, items: ['Limited government', 'Lower taxes', 'Energy independence', 'Market healthcare', 'Pro-life', 'Strong 2nd Amendment', 'Border security'] },
    ].map((p, i) => (
      <g key={i}>
        <rect x={p.x} y="50" width="250" height="210" rx="8" fill={p.col} opacity="0.12" stroke={p.col} strokeWidth="1.5" />
        <text x={p.x + 125} y="80" textAnchor="middle" fill={p.col} fontSize="14" fontWeight="700">{p.label}</text>
        {p.items.map((it, j) => (
          <text key={j} x={p.x + 16} y={108 + j * 22} fill={COL.text} fontSize="11">• {it}</text>
        ))}
      </g>
    ))}
  </svg>
);

export const APUSGOV_FIGURES = {
  '1.6': [{ id: 'cb', Cmp: ChecksBalances, caption: 'The three branches check and balance each other to prevent tyranny.', source: 'Federalist 51 framework' }],
  '2.1': [{ id: 'bicam', Cmp: Bicameral, caption: 'Bicameral Congress: House (popular, short terms) + Senate (states-equal, long terms).', source: 'Great Compromise 1787' }],
  '2.2': [{ id: 'bill', Cmp: BillToLaw, caption: 'A bill must pass committee, both chambers, conference, and the president.', source: 'KUA Carbon Dashboard · authored' }],
  '4.7': [{ id: 'parties', Cmp: PartyPlatforms, caption: 'Major party platforms (simplified). Both parties have internal factions.', source: 'KUA Carbon Dashboard · authored' }],
  '5.8': [{ id: 'ec', Cmp: ElectoralCollege, caption: '538 electors, 270 to win. Mostly winner-take-all by state.', source: 'KUA Carbon Dashboard · authored' }],
};
