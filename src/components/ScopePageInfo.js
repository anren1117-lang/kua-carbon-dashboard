import React, { useState } from 'react';

const styles = {
  wrap: { marginTop: 24, display: 'grid', gap: 16 },
  card: (color) => ({
    background: '#0f172a',
    border: '1px solid #1f2937',
    borderRadius: 12,
    padding: 20,
    borderLeft: `3px solid ${color}`,
  }),
  cardTitle: { fontSize: 16, fontWeight: 600, color: '#e5e7eb', margin: 0, marginBottom: 12 },
  estimateRow: { display: 'flex', gap: 16, flexWrap: 'wrap' },
  estimateCell: { padding: '10px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8, minWidth: 140 },
  estimateLabel: { fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6 },
  estimateValue: { fontSize: 22, color: '#e5e7eb', fontWeight: 700, marginTop: 2 },
  estimateUnit: { fontSize: 11, color: '#94a3b8', marginLeft: 4, fontWeight: 400 },
  estimateRange: { fontSize: 11, color: '#64748b', marginTop: 2 },
  estimateNote: { marginTop: 12, fontSize: 13, color: '#cbd5e1', lineHeight: 1.6 },
  documented: { fontSize: 10, padding: '2px 8px', borderRadius: 999, background: '#052e1a', color: '#86efac', textTransform: 'uppercase', letterSpacing: 0.5, marginLeft: 8 },
  refList: { paddingLeft: 18, fontSize: 13, color: '#cbd5e1', lineHeight: 1.8, margin: 0 },
  refTitle: { color: '#e5e7eb', fontWeight: 600 },
  refSource: { color: '#64748b' },
  actionList: { display: 'grid', gap: 12, marginTop: 4 },
  actionRow: { padding: '12px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 },
  actionHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' },
  actionName: { fontSize: 14, color: '#e5e7eb', fontWeight: 600 },
  actionImpact: (color) => ({ fontSize: 12, color, fontWeight: 700, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }),
  actionDetail: { marginTop: 6, fontSize: 12, color: '#94a3b8', lineHeight: 1.5 },
  toggleBtn: { marginTop: 8, background: 'transparent', border: '1px solid #334155', color: '#cbd5e1', padding: '4px 10px', borderRadius: 4, fontSize: 11, cursor: 'pointer' },
  proofBox: { marginTop: 10, padding: '10px 12px', background: '#0f172a', border: '1px solid #1f2937', borderRadius: 6 },
  proofTitle: { fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600, marginBottom: 6 },
  dataTable: { width: '100%', borderCollapse: 'collapse', fontSize: 11 },
  dataTh: { textAlign: 'left', padding: '4px 6px', color: '#64748b', borderBottom: '1px solid #1f2937', fontWeight: 600 },
  dataTd: { padding: '4px 6px', color: '#cbd5e1', borderBottom: '1px solid #1f2937', verticalAlign: 'top' },
  dataSource: { color: '#64748b', fontSize: 10 },
  mathBlock: { marginTop: 8, padding: '8px 10px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 4, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 11, color: '#86efac', lineHeight: 1.7, whiteSpace: 'pre-wrap' },
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
          {estimate.documented && <span style={styles.documented}>Documented</span>}
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
            <div style={styles.estimateRange}>≈ 600 students</div>
          </div>
          {estimate.thirdMetric && (
            <div style={styles.estimateCell}>
              <div style={styles.estimateLabel}>{estimate.thirdMetric.label}</div>
              <div style={styles.estimateValue}>{estimate.thirdMetric.value}</div>
              <div style={styles.estimateRange}>{estimate.thirdMetric.note}</div>
            </div>
          )}
        </div>
        <p style={styles.estimateNote}>{estimate.note}</p>
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
        <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 0, marginBottom: 14, lineHeight: 1.6 }}>
          Estimated annual impact of each lever, ordered roughly by magnitude. Numbers are
          order-of-magnitude — exact values will tighten as the dashboard's reduction-scenario
          simulator (Phase 5) is wired up.
        </p>
        <div style={styles.actionList}>
          {actions.map((a, i) => <ActionRow key={i} a={a} color={color} />)}
        </div>
      </section>
    </div>
  );
}
