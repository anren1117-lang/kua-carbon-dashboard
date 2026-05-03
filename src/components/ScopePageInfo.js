import React, { useState } from 'react';
import { ProvenancePill } from './ProvenancePill.js';

const styles = {
  wrap: { marginTop: 24, display: 'grid', gap: 16 },
  card: (color) => ({
    background: '#0f172a',
    border: '1px solid #1f2937',
    borderRadius: 12,
    padding: 22,
    borderLeft: `4px solid ${color}`,
  }),
  cardTitle: { fontSize: 'clamp(17px, 3vw, 19px)', fontWeight: 700, color: '#e5e7eb', margin: 0, marginBottom: 14 },
  estimateRow: { display: 'flex', gap: 16, flexWrap: 'wrap' },
  estimateCell: { padding: '12px 16px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8, minWidth: 150 },
  estimateLabel: { fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600 },
  estimateValue: { fontSize: 'clamp(20px, 4.5vw, 26px)', color: '#e5e7eb', fontWeight: 700, marginTop: 4 },
  estimateUnit: { fontSize: 13, color: '#94a3b8', marginLeft: 4, fontWeight: 400 },
  estimateRange: { fontSize: 13, color: '#64748b', marginTop: 4 },
  estimateNote: { marginTop: 14, fontSize: 16, color: '#cbd5e1', lineHeight: 1.7 },
  documented: { fontSize: 12, padding: '3px 10px', borderRadius: 999, background: '#052e1a', color: '#86efac', textTransform: 'uppercase', letterSpacing: 0.5, marginLeft: 10, fontWeight: 700 },
  methodBlock: { marginTop: 16, paddingTop: 14, borderTop: '1px solid #1f2937', display: 'grid', gap: 8 },
  methodRow: { fontSize: 14, color: '#cbd5e1', lineHeight: 1.6 },
  methodLabel: { color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase', fontSize: 10, letterSpacing: 0.7, marginRight: 8 },
  provHeadPill: { marginLeft: 10 },
  refList: { paddingLeft: 22, fontSize: 16, color: '#cbd5e1', lineHeight: 1.9, margin: 0 },
  refTitle: { color: '#e5e7eb', fontWeight: 700 },
  refSource: { color: '#94a3b8' },
  actionList: { display: 'grid', gap: 14, marginTop: 4 },
  actionRow: { padding: '16px 18px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 10 },
  actionHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' },
  actionName: { fontSize: 17, color: '#e5e7eb', fontWeight: 700 },
  actionImpact: (color) => ({ fontSize: 14, color, fontWeight: 700, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }),
  actionDetail: { marginTop: 8, fontSize: 15, color: '#cbd5e1', lineHeight: 1.7 },
  toggleBtn: { marginTop: 12, background: 'transparent', border: '1px solid #334155', color: '#cbd5e1', padding: '6px 14px', borderRadius: 4, fontSize: 13, cursor: 'pointer' },
  proofBox: { marginTop: 12, padding: '14px 16px', background: '#0f172a', border: '1px solid #1f2937', borderRadius: 6 },
  proofTitle: { fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, marginBottom: 8 },
  dataTable: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  dataTh: { textAlign: 'left', padding: '6px 8px', color: '#94a3b8', borderBottom: '1px solid #1f2937', fontWeight: 700 },
  dataTd: { padding: '6px 8px', color: '#cbd5e1', borderBottom: '1px solid #1f2937', verticalAlign: 'top' },
  dataSource: { color: '#64748b', fontSize: 12 },
  mathBlock: { marginTop: 10, padding: '12px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 4, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 13, color: '#86efac', lineHeight: 1.8, whiteSpace: 'pre-wrap' },
};

function ActionRow({ a, color }) {
  const [show, setShow] = useState(false);
  const hasProof = (a.data && a.data.length) || (a.math && a.math.length);
  return (
    <div style={styles.actionRow}>
      <div style={styles.actionHead}>
        <div style={styles.actionName}>{a.action}</div>
        <div style={styles.actionImpact(color)}>{a.impact}</div>
      </div>
      <div style={styles.actionDetail}>{a.detail}</div>
      {hasProof && (
        <>
          <button type="button" style={styles.toggleBtn} onClick={() => setShow((v) => !v)}>
            {show ? 'Hide data + math' : 'Show data + math'}
          </button>
          {show && (
            <div style={styles.proofBox}>
              {a.data && a.data.length > 0 && (
                <>
                  <div style={styles.proofTitle}>Inputs</div>
                  <table style={styles.dataTable}>
                    <thead>
                      <tr>
                        <th style={styles.dataTh}>Quantity</th>
                        <th style={styles.dataTh}>Value</th>
                        <th style={styles.dataTh}>Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {a.data.map((d, i) => (
                        <tr key={i}>
                          <td style={styles.dataTd}>{d.input}</td>
                          <td style={styles.dataTd}>{d.value}</td>
                          <td style={{ ...styles.dataTd, ...styles.dataSource }}>{d.source}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
              {a.math && a.math.length > 0 && (
                <>
                  <div style={{ ...styles.proofTitle, marginTop: 10 }}>Calculation</div>
                  <pre style={styles.mathBlock}>{a.math.join('\n')}</pre>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function ScopePageInfo({ color, estimate, references, actions }) {
  return (
    <div style={styles.wrap}>
      <section style={styles.card(color)}>
        <h2 style={styles.cardTitle}>
          KUA's preliminary estimate
          {estimate.provenance
            ? <span style={styles.provHeadPill}><ProvenancePill provenance={estimate.provenance} /></span>
            : estimate.documented && <span style={styles.documented}>Documented</span>
          }
        </h2>
        <div style={styles.estimateRow}>
          <div style={styles.estimateCell}>
            <div style={styles.estimateLabel}>Annual total</div>
            <div style={styles.estimateValue}>
              {estimate.totalPrefix || ''}{estimate.total}<span style={styles.estimateUnit}>mtCO₂e/yr</span>
            </div>
            <div style={styles.estimateRange}>range {estimate.totalRange}</div>
          </div>
          <div style={styles.estimateCell}>
            <div style={styles.estimateLabel}>Per student</div>
            <div style={styles.estimateValue}>
              {estimate.perStudent}<span style={styles.estimateUnit}>mtCO₂e</span>
            </div>
            <div style={styles.estimateRange}>≈ 340 students</div>
          </div>
          {estimate.thirdMetric && (
            <div style={styles.estimateCell}>
              <div style={styles.estimateLabel}>{estimate.thirdMetric.label}</div>
              <div style={styles.estimateValue}>{estimate.thirdMetric.value}</div>
              <div style={styles.estimateRange}>{estimate.thirdMetric.note}</div>
            </div>
          )}
        </div>
        {estimate.note && <p style={styles.estimateNote}>{estimate.note}</p>}
        {(estimate.currentMethod || estimate.futureMethod) && (
          <div style={styles.methodBlock}>
            {estimate.currentMethod && (
              <div style={styles.methodRow}>
                <span style={styles.methodLabel}>Today:</span>{estimate.currentMethod}
              </div>
            )}
            {estimate.futureMethod && (
              <div style={styles.methodRow}>
                <span style={styles.methodLabel}>Target:</span>{estimate.futureMethod}
              </div>
            )}
          </div>
        )}
      </section>

      <section style={styles.card(color)}>
        <h2 style={styles.cardTitle}>References</h2>
        <ul style={styles.refList}>
          {references.map((r, i) => (
            <li key={i}>
              <span style={styles.refTitle}>{r.title}</span>
              {r.source && <> — <span style={styles.refSource}>{r.source}</span></>}
              {r.use && <> · {r.use}</>}
            </li>
          ))}
        </ul>
      </section>

      <section style={styles.card(color)}>
        <h2 style={styles.cardTitle}>How action changes KUA's number</h2>
        <p style={{ fontSize: 16, color: '#94a3b8', marginTop: 0, marginBottom: 16, lineHeight: 1.7 }}>
          Estimated annual impact of each lever, ordered roughly by magnitude. Click "Show data
          + math" on any row to see the cited inputs and the worked calculation. Numbers are
          order-of-magnitude — exact values tighten as real measured data is loaded.
        </p>
        <div style={styles.actionList}>
          {actions.map((a, i) => <ActionRow key={i} a={a} color={color} />)}
        </div>
      </section>
    </div>
  );
}
