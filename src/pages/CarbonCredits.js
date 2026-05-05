import React from 'react';
import { EducationalCard } from '../components/EducationalCard';
import { ANNUAL_SEQUESTRATION_MT } from '../data/sinks.js';

// All ranges drawn from publicly available carbon-market data (Ecosystem
// Marketplace, Trove Research, Verra registries, Climate Action Reserve)
// as of 2024-2025. Voluntary market prices are notoriously volatile.

const categories = [
  {
    name: 'Forestry — Improved Forest Management (IFM)',
    relevance: 'highly relevant',
    relevanceColor: '#22c55e',
    desc: 'KUA\'s ~1,000-acre forest is the most directly applicable category. An IFM protocol pays a landowner for managing the forest in a way that increases carbon stock above a baseline (e.g., longer rotation, selective rather than clear-cut harvest). Verra (VCS) and Climate Action Reserve are the two main registries.',
    pricePerTon: '$8 – $40',
    annualRevenuePotential: `$${Math.round(ANNUAL_SEQUESTRATION_MT * 8 / 1000).toLocaleString()},000 – $${Math.round(ANNUAL_SEQUESTRATION_MT * 40 / 1000).toLocaleString()},000`,
    annualRevenueCalc: `~${Math.round(ANNUAL_SEQUESTRATION_MT).toLocaleString()} mtCO₂e/yr × $8–$40/ton`,
    caveat: 'Subject to additionality and permanence rules — the forest must be at risk of being managed differently without the credit revenue. School lands are sometimes hard to qualify because the forest would likely be conserved anyway.',
  },
  {
    name: 'Forestry — Afforestation / Reforestation (ARR)',
    relevance: 'partially relevant',
    relevanceColor: '#f59e0b',
    desc: 'Pays for converting non-forest land (lawn, athletic-field perimeter, abandoned pasture) into new forest. KUA could qualify on lawn-to-meadow conversions and tree plantings. Slower revenue ramp because new trees sequester little in early years.',
    pricePerTon: '$10 – $50',
    annualRevenuePotential: '$10 – $250 per acre planted, growing over 25–30 years',
    annualRevenueCalc: 'small in years 1–5; ramps to ~$50–$250 per acre per year at maturity',
    caveat: 'Long verification timelines (often 25–100 years of monitoring required). Best for new plantings of significant scale.',
  },
  {
    name: 'Forestry — Avoided Conversion (REDD+ analog)',
    relevance: 'situational',
    relevanceColor: '#f59e0b',
    desc: 'Pays a landowner NOT to convert forest to other uses (development, agriculture). Only relevant if there\'s genuine, documented pressure to develop. For KUA, this would only apply if there were a credible school-expansion plan that the credits replace.',
    pricePerTon: '$5 – $30',
    annualRevenuePotential: 'highly variable — hundreds to thousands per acre over the avoided-conversion period',
    annualRevenueCalc: 'tied to baseline projected emissions if conversion proceeded',
    caveat: 'Strict additionality requirements. Avoided-conversion credits have faced credibility challenges (fraudulent baselines), so registries scrutinize them heavily.',
  },
  {
    name: 'Renewable Energy Credits (RECs)',
    relevance: 'somewhat relevant',
    relevanceColor: '#f59e0b',
    desc: 'Distinct from carbon offsets: a REC represents 1 MWh of renewable electricity generation. KUA\'s solar PV exports could be sold as RECs separately from the kWh themselves. This is a separate revenue stream from forest carbon credits.',
    pricePerTon: 'sold per MWh, not per ton — ~$1–$45/MWh in NH/NE',
    annualRevenuePotential: 'depends on solar export volume',
    annualRevenueCalc: 'exported MWh × current REC market price (NH-eligible Class I RECs in 2024 ~$25–$45/MWh)',
    caveat: 'Selling RECs means KUA can NO LONGER claim those exported kWh as zero-carbon in its market-based Scope 2 reporting — they\'ve been sold to someone else. The dashboard already tracks self-consumed vs exported separately to handle this.',
  },
  {
    name: 'Methane / agricultural credits',
    relevance: 'not relevant',
    relevanceColor: '#64748b',
    desc: 'Landfill methane capture, agricultural manure management, etc. None apply to KUA — listed for completeness so the methodology page is honest about what we\'ve excluded.',
    pricePerTon: '$3 – $20',
    annualRevenuePotential: 'n/a',
    annualRevenueCalc: 'n/a',
    caveat: 'Excluded by design.',
  },
  {
    name: 'Direct air capture (DAC)',
    relevance: 'not relevant — buyer side only',
    relevanceColor: '#64748b',
    desc: 'Engineered removal of CO₂ from the atmosphere. Premium-priced ($300–$700/ton in 2024) and far too expensive to issue. KUA could conceivably BUY DAC credits as offsets, but they\'re cost-prohibitive for school budgets.',
    pricePerTon: '$300 – $700',
    annualRevenuePotential: 'n/a',
    annualRevenueCalc: 'n/a',
    caveat: 'Listed so the contrast with cheap forestry credits is visible. Quality matters: $30 forestry credits and $300 DAC credits are not equivalent.',
  },
];

const styles = {
  title: { margin: 0, fontSize: 36, fontWeight: 700 },
  subtitle: { marginTop: 10, color: '#94a3b8', maxWidth: 760, fontSize: 17, lineHeight: 1.6 },
  section: { marginTop: 32 },
  h2: { fontSize: 22, color: '#e5e7eb', marginBottom: 12, fontWeight: 700 },
  list: { marginTop: 24, display: 'grid', gap: 16 },
  catCard: { padding: 20, background: '#0f172a', border: '1px solid #1f2937', borderRadius: 12 },
  catHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, flexWrap: 'wrap', marginBottom: 12 },
  catName: { fontSize: 19, fontWeight: 700, color: '#e5e7eb' },
  relevancePill: (color) => ({ fontSize: 12, padding: '4px 10px', borderRadius: 999, background: color + '22', color, border: `1px solid ${color}55`, textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 }),
  catDesc: { fontSize: 15, color: '#cbd5e1', lineHeight: 1.7, marginBottom: 14 },
  metaGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 12 },
  metaCell: { padding: '10px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 },
  metaLabel: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600 },
  metaValue: { fontSize: 16, color: '#e5e7eb', marginTop: 4, fontWeight: 600 },
  metaCalc: { fontSize: 12, color: '#94a3b8', marginTop: 4, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' },
  caveat: { fontSize: 13, color: '#fbbf24', background: '#3a2a0d', border: '1px solid #92400e', borderRadius: 6, padding: '8px 12px', lineHeight: 1.6 },
  bigNum: { fontSize: 30, fontWeight: 700, color: '#86efac', marginTop: 4 },
  bigNumLabel: { fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600 },
  revenueCard: { marginTop: 16, padding: 24, background: '#052e1a', border: '1px solid #14532d', borderRadius: 12 },
  tradeOff: { marginTop: 16, padding: 16, background: '#0f172a', border: '1px solid #92400e', borderRadius: 10 },
  tradeOffTitle: { fontSize: 17, fontWeight: 700, color: '#fbbf24', marginBottom: 10 },
  tradeOffText: { fontSize: 15, color: '#cbd5e1', lineHeight: 1.7 },
};

function CarbonCredits() {
  return (
    <div>
      <h1 style={styles.title}>Carbon Credits & Monetization</h1>
      <p style={styles.subtitle}>
        How can sequestered carbon become revenue? KUA's ~1,000 acres of forest pulls roughly
        {' '}{Math.round(ANNUAL_SEQUESTRATION_MT).toLocaleString()} mtCO₂e out of the atmosphere each year. In carbon-market terms, that drawdown is
        a tradable commodity — but turning it into money has rules, costs, and trade-offs.
      </p>

      <section style={styles.section}>
        <h2 style={styles.h2}>What is a carbon credit, in plain English?</h2>
        <EducationalCard
          title="The basics — one credit = one ton avoided or removed"
          sections={[
            {
              heading: 'How it works',
              body: [
                'A carbon credit represents one metric ton of CO₂-equivalent that was either prevented from being emitted (e.g., a wind farm replacing a coal plant) or removed from the atmosphere (e.g., a tree storing carbon).',
                'Companies that need to offset their emissions buy credits. The seller — the entity that did the avoiding or removing — gets paid.',
                'A third-party verifier (Verra, Climate Action Reserve, American Carbon Registry, Gold Standard) audits the project to make sure the ton is real, additional, permanent, and not double-counted.',
              ],
            },
            {
              heading: 'Two kinds of markets',
              body: [
                'Compliance markets are run by governments — California cap-and-trade, EU ETS, RGGI. Prices are higher ($25–$90/ton) because participation is mandatory for big emitters.',
                'Voluntary markets are where companies and institutions buy offsets to meet self-imposed goals. Prices are lower and more variable ($3–$50/ton typically) because participation is optional.',
                'KUA, as a school, would issue into the voluntary market.',
              ],
              citation: 'Ecosystem Marketplace State of the Voluntary Carbon Markets 2024; California Air Resources Board cap-and-trade auction reports.',
            },
            {
              heading: 'Quality matters more than quantity',
              body: [
                'Not all credits are equal. A $5 avoided-deforestation credit from a sketchy registry is not the same climate value as a $300 direct-air-capture credit.',
                'Buyers increasingly look for additionality (would this have happened anyway?), permanence (will the carbon stay sequestered?), and verifiability (can a third party confirm the math?).',
                'The integrity-of-credit conversation is active and unresolved.',
              ],
            },
          ]}
        />
      </section>

      <section style={styles.section}>
        <h2 style={styles.h2}>Categories of credits, ranked by relevance to KUA</h2>
        <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7, maxWidth: 760 }}>
          Six common categories. Two are highly relevant given KUA's land and physical assets;
          two are situational; two are listed for completeness and contrast.
        </p>
        <div style={styles.list}>
          {categories.map((c) => (
            <div key={c.name} style={styles.catCard}>
              <div style={styles.catHead}>
                <div style={styles.catName}>{c.name}</div>
                <span style={styles.relevancePill(c.relevanceColor)}>{c.relevance}</span>
              </div>
              <p style={styles.catDesc}>{c.desc}</p>
              <div style={styles.metaGrid}>
                <div style={styles.metaCell}>
                  <div style={styles.metaLabel}>Voluntary-market price</div>
                  <div style={styles.metaValue}>{c.pricePerTon}</div>
                </div>
                <div style={styles.metaCell}>
                  <div style={styles.metaLabel}>Annual revenue potential</div>
                  <div style={styles.metaValue}>{c.annualRevenuePotential}</div>
                  <div style={styles.metaCalc}>{c.annualRevenueCalc}</div>
                </div>
              </div>
              <div style={styles.caveat}>
                <strong>Caveat:</strong> {c.caveat}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.h2}>If KUA monetized its forest, what would the math look like?</h2>
        <div style={styles.revenueCard}>
          {(() => {
            const seq = Math.round(ANNUAL_SEQUESTRATION_MT);
            const fmt$ = (n) => `$${Math.round(n / 1000).toLocaleString()}K`;
            return (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                <div>
                  <div style={styles.bigNumLabel}>Eligible sequestration</div>
                  <div style={styles.bigNum}>~{seq.toLocaleString()}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>mtCO₂e/yr drawdown</div>
                </div>
                <div>
                  <div style={styles.bigNumLabel}>At low end ($8/ton)</div>
                  <div style={styles.bigNum}>{fmt$(seq * 8)}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>per year gross</div>
                </div>
                <div>
                  <div style={styles.bigNumLabel}>At mid market ($25/ton)</div>
                  <div style={styles.bigNum}>{fmt$(seq * 25)}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>per year gross</div>
                </div>
                <div>
                  <div style={styles.bigNumLabel}>At premium ($40/ton)</div>
                  <div style={styles.bigNum}>{fmt$(seq * 40)}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>per year gross</div>
                </div>
              </div>
            );
          })()}
          <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.7, marginTop: 16 }}>
            Net revenue is meaningfully lower. Subtract one-time setup ($20,000–$80,000 for project
            documentation and baseline establishment), annual verification ($5,000–$15,000), and
            registry fees (~$0.30/credit issued). Realistic net for a school-scale project:
            $10,000–$80,000/year if it qualifies at all.
          </p>
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.h2}>Why most schools don't actually monetize</h2>
        <ul style={{ fontSize: 16, color: '#cbd5e1', lineHeight: 1.9, paddingLeft: 24 }}>
          <li><strong>Additionality is hard to prove.</strong> A credit only counts if the carbon would not have been sequestered anyway. KUA would need to show a credible counterfactual where, without credit revenue, the forest would be cleared or under-managed.</li>
          <li><strong>Up-front costs.</strong> Verifier engagement, baseline studies, and ongoing monitoring can run $30,000–$100,000 over the first two years, before any credits are sold.</li>
          <li><strong>Permanence commitments.</strong> Most forestry protocols require 40–100 years of monitoring. Selling credits today means committing future students and administrators to a specific land-use posture.</li>
          <li><strong>Reputational risk.</strong> Recent scrutiny of forestry-credit integrity (REDD+ scandals, low-quality projects) has made institutional buyers cautious; some schools prefer to claim sinks in their own footprint rather than sell them.</li>
        </ul>
      </section>

      <section style={styles.section}>
        <h2 style={styles.h2}>The trade-off: monetize or claim — pick one</h2>
        <div style={styles.tradeOff}>
          <div style={styles.tradeOffTitle}>You can't have both</div>
          <p style={styles.tradeOffText}>
            If KUA sells the ~2,650 mtCO₂e/year of forest sequestration as carbon credits, those credits are claimed by the
            buyer. KUA can no longer subtract them from its own gross emissions — the dashboard's
            net balance would jump from ~1,700 mtCO₂e/yr up to ~4,350 mtCO₂e/yr because the
            sequestration line goes to zero from the school's accounting perspective.
          </p>
          <p style={{ ...styles.tradeOffText, marginTop: 10 }}>
            For most schools, claiming sinks in their own footprint (showing a smaller net number)
            is more institutionally valuable than the modest cash from selling credits. The
            calculation flips for institutions with budget pressure, very large land holdings, or
            existing carbon-finance partnerships.
          </p>
          <p style={{ ...styles.tradeOffText, marginTop: 10 }}>
            The dashboard is built to support either choice transparently: the <code>renewables_solar</code>
            table already separates self-consumed kWh (claimed by KUA) from exported kWh (claimed
            by Liberty/buyer). The same pattern would apply to forestry credits when the time comes.
          </p>
        </div>
      </section>
    </div>
  );
}

export default CarbonCredits;
