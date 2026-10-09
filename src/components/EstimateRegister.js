import React, { useState } from 'react';
import {
  ESTIMATE_REGISTER,
  TIER_LABEL,
  TIER_MEANING,
  MODELLED_SHARE_OF_GROSS,
  REGISTER_COUNTS,
  WHOLLY_MODELLED_SCOPES,
  NET_ESTIMATE_CAVEAT,
  MODELLED_SPREAD_EXAMPLE,
  REGISTER_RECONCILIATION,
} from '../data/estimateRegister.js';

/**
 * The estimate register, rendered.
 *
 * The point of this table is to be readable by a trustee who will not open a
 * second page. So the method is shown in full on request rather than linked
 * away, and the tier is a word rather than a colour — a reader printing this
 * to PDF in greyscale, which is how a board packet actually travels, must
 * still be able to tell a meter reading from a model.
 */

const TIER_STYLE = {
  measured: { background: '#064e3b', color: '#6ee7b7', border: '1px solid #065f46' },
  'partly-measured': { background: '#1e3a5f', color: '#93c5fd', border: '1px solid #1e40af' },
  modelled: { background: '#422006', color: '#fcd34d', border: '1px solid #78350f' },
};

const styles = {
  lede: { color: '#cbd5e1', lineHeight: 1.65, maxWidth: 780, marginTop: 0 },
  table: { width: '100%', borderCollapse: 'collapse', background: '#0f172a', border: '1px solid #1f2937', borderRadius: 8, overflow: 'hidden', marginTop: 16 },
  th: { textAlign: 'left', padding: '10px 12px', fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6, borderBottom: '1px solid #1f2937' },
  thNum: { textAlign: 'right', padding: '10px 12px', fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6, borderBottom: '1px solid #1f2937' },
  td: { padding: '10px 12px', fontSize: 14, borderBottom: '1px solid #1f2937', verticalAlign: 'top' },
  tdNum: { padding: '10px 12px', fontSize: 14, borderBottom: '1px solid #1f2937', verticalAlign: 'top', textAlign: 'right', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' },
  pill: { display: 'inline-block', padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: 0.3, whiteSpace: 'nowrap' },
  methodBtn: { background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: 13, padding: 0, fontFamily: 'inherit', textDecoration: 'underline' },
  method: { marginTop: 6, fontSize: 13, color: '#94a3b8', lineHeight: 1.6 },
  retired: { marginTop: 6, fontSize: 13, color: '#cbd5e1', lineHeight: 1.6 },
  key: { marginTop: 14, fontSize: 13, color: '#94a3b8', lineHeight: 1.7, paddingLeft: 18 },
};

function Row({ e }) {
  const [open, setOpen] = useState(false);
  const amount = typeof e.mt === 'number'
    ? `${e.mt < 0 ? '−' : ''}${Math.abs(e.mt).toLocaleString()}`
    : e.kwh ? `${e.kwh.toLocaleString()} kWh` : '—';
  return (
    <tr>
      <td style={styles.td}>
        <div style={{ fontWeight: 600, color: '#e5e7eb' }}>{e.label}</div>
        <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{e.scope}</div>
        <button type="button" style={styles.methodBtn} onClick={() => setOpen(!open)} aria-expanded={open}>
          {open ? 'Hide method' : 'How this is estimated'}
        </button>
        {open && (
          <>
            <div style={styles.method}>{e.method}</div>
            <div style={styles.retired}>
              <strong style={{ color: '#e5e7eb' }}>What would replace it:</strong> {e.retiredBy}
            </div>
          </>
        )}
      </td>
      <td style={styles.tdNum}>{amount}</td>
      <td style={styles.td}>
        <span style={{ ...styles.pill, ...TIER_STYLE[e.tier] }}>{TIER_LABEL[e.tier]}</span>
      </td>
    </tr>
  );
}

export function EstimateRegister() {
  return (
    <div>
      <p style={styles.lede}>
        <strong style={{ color: '#fcd34d' }}>
          About {MODELLED_SHARE_OF_GROSS}% of the gross figure on this dashboard is modelled, not measured.
        </strong>{' '}
        {WHOLLY_MODELLED_SCOPES.join(' and ')} carry no KUA-specific activity records yet — no fuel-delivery
        invoices, no travel-office records, no dining invoices. Those numbers are engineering estimates built
        from floor area, headcount, spend and published intensities. They are a reasonable first inventory and
        they are not the same kind of number as a meter reading. Electricity is the one metered series.
      </p>
      <p style={styles.lede}>
        {NET_ESTIMATE_CAVEAT}
      </p>
      <p style={styles.lede}>
        How wide is a modelled figure? {MODELLED_SPREAD_EXAMPLE.scope} run at three published intensity
        assumptions gives{' '}
        <strong style={{ color: '#e5e7eb' }}>
          {MODELLED_SPREAD_EXAMPLE.low.toLocaleString()}–{MODELLED_SPREAD_EXAMPLE.high.toLocaleString()} mtCO₂e
        </strong>{' '}
        around a central {MODELLED_SPREAD_EXAMPLE.central.toLocaleString()}. {MODELLED_SPREAD_EXAMPLE.note}
      </p>

      <table style={styles.table}>
        <caption style={{ captionSide: 'top', textAlign: 'left', padding: '0 0 8px', fontSize: 13, color: '#94a3b8' }}>
          All {REGISTER_COUNTS.total} figures behind the footprint: {REGISTER_COUNTS.modelled} modelled,{' '}
          {REGISTER_COUNTS.partlyMeasured} partly measured, {REGISTER_COUNTS.measured} measured outright.
        </caption>
        <thead>
          <tr>
            <th style={styles.th}>Figure</th>
            <th style={styles.thNum}>mtCO₂e/yr</th>
            <th style={styles.th}>Basis</th>
          </tr>
        </thead>
        <tbody>
          {ESTIMATE_REGISTER.map((e) => <Row key={e.id} e={e} />)}
        </tbody>
      </table>

      <ul style={styles.key}>
        {['measured', 'partly-measured', 'modelled'].map((t) => (
          <li key={t}>
            <strong style={{ color: '#e5e7eb' }}>{TIER_LABEL[t]}</strong> — {TIER_MEANING[t]}
          </li>
        ))}
      </ul>
      {!REGISTER_RECONCILIATION.reconciles && (
        <p style={{ ...styles.lede, color: '#fca5a5' }}>
          This register does not currently account for the whole gross figure
          ({REGISTER_RECONCILIATION.unaccountedMt.toLocaleString()} mtCO₂e unexplained). That is a defect in
          the register, not a correction to the footprint.
        </p>
      )}
    </div>
  );
}

export default EstimateRegister;
