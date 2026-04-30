import React from 'react';
import { formStyles as s } from './formStyles';

const schema = [
  { col: 'fiscal_year', type: 'text', note: 'e.g. 2025-2026' },
  { col: 'purchasing_category', type: 'text', note: 'EPA Supply Chain category (food, paper, lab supplies, athletic, construction, ...)' },
  { col: 'spend_usd', type: 'numeric', note: 'Dollars spent in this fiscal year' },
  { col: 'eeio_factor', type: 'numeric', note: 'kg CO₂e per USD — pulled from versioned emission_factors table' },
  { col: 'data_quality', type: 'enum', note: 'measured · estimated · modeled' },
  { col: 'source', type: 'text', note: 'Pointer to ledger export or invoice batch' },
];

const styles = {
  schemaTable: { width: '100%', marginTop: 12, borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '8px 10px', fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6, borderBottom: '1px solid #1f2937', background: '#0b1220' },
  td: { padding: '8px 10px', fontSize: 13, borderBottom: '1px solid #1f2937', color: '#cbd5e1', verticalAlign: 'top' },
  mono: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', color: '#22d3ee' },
};

function Cat1PurchasedGoods() {
  return (
    <div>
      <div style={s.cat}>Scope 3 · Category 1</div>
      <h1 style={s.title}>Purchased Goods & Services</h1>
      <p style={s.subtitle}>
        Embodied emissions of food, paper, lab supplies, athletic equipment, and construction
        materials. Spend-based using EPA Supply Chain (EEIO) factors — less precise than
        supplier-specific data, but standard practice for institutional inventories.
      </p>
      <div style={s.factor}>
        Factor source: EPA Supply Chain GHG Emission Factors for US Industries (versioned)
      </div>

      <div style={s.card}>
        <h2 style={s.h2}>Planned schema · <code style={styles.mono}>purchased_goods</code></h2>
        <table style={styles.schemaTable}>
          <thead>
            <tr>
              <th style={styles.th}>Column</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {schema.map((c) => (
              <tr key={c.col}>
                <td style={{ ...styles.td, ...styles.mono, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', color: '#22d3ee' }}>{c.col}</td>
                <td style={styles.td}>{c.type}</td>
                <td style={styles.td}>{c.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Cat1PurchasedGoods;
