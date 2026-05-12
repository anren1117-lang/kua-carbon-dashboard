import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const stages = [
  { num: 1, name: 'Ingestion',     desc: 'PDFs → OCR text · spreadsheets → structured rows · email attachments → router by document type', status: 'Planned' },
  { num: 2, name: 'Extraction',    desc: 'LLM prompted against a published schema converts raw text into candidate JSON records. Per Dagdelen et al. (2024), modern LLMs match purpose-built parsers on this task.', status: 'Planned' },
  { num: 3, name: 'Normalization', desc: 'Unit conversions to dashboard canonical units (kWh, gallons, kg). Date strings → ISO. Categorical values mapped to the controlled vocabulary in emission_factors.', status: 'Planned' },
  { num: 4, name: 'Validation',    desc: 'Range checks (gallons must be > 0, percent ∈ [0,100]). Trend checks (new month within ±3σ of historical mean for that source). Duplicate detection vs existing records.', status: 'Planned' },
  { num: 5, name: 'Routing',       desc: 'High-confidence rows → Supabase write. Low-confidence rows → review queue. Failed rows → alert with original document attached.', status: 'Planned' },
];

const styles = {
  title: { margin: 0, fontSize: 32, fontWeight: 700 },
  subtitle: { marginTop: 8, color: '#94a3b8', maxWidth: 760 },
  card: { marginTop: 24, background: '#0f172a', border: '1px solid #1f2937', borderRadius: 12, padding: 20 },
  upload: { padding: 24, border: '2px dashed #334155', borderRadius: 8, textAlign: 'center', color: '#94a3b8' },
  uploadActive: { borderColor: '#22d3ee', background: '#0b1220' },
  pipelineRow: { display: 'flex', gap: 12, marginTop: 16, overflowX: 'auto' },
  stage: { flex: '0 0 200px', padding: 14, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 },
  stageNum: { fontSize: 11, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 },
  stageName: { marginTop: 4, fontSize: 16, fontWeight: 600 },
  stageDesc: { marginTop: 8, fontSize: 12, color: '#94a3b8', lineHeight: 1.5 },
  stageStatus: { marginTop: 8, fontSize: 10, padding: '2px 6px', borderRadius: 999, background: '#3a2a0d', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: 0.5, display: 'inline-block' },
  arrow: { alignSelf: 'center', color: '#475569', fontSize: 18 },
  queue: { marginTop: 16 },
  queueHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  queueTitle: { fontSize: 16, fontWeight: 600 },
  queueCount: { fontSize: 12, color: '#64748b' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#0f172a' },
  th: { textAlign: 'left', padding: '8px 10px', fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6, borderBottom: '1px solid #1f2937', background: '#0b1220' },
  td: { padding: '8px 10px', fontSize: 13, borderBottom: '1px solid #1f2937', color: '#cbd5e1' },
  empty: { padding: 16, color: '#64748b', fontSize: 13, fontStyle: 'italic' },
  footnote: { marginTop: 16, padding: 12, background: '#0b1220', border: '1px dashed #334155', borderRadius: 8, fontSize: 12, color: '#94a3b8', lineHeight: 1.6 },
  fileMeta: { marginTop: 12, padding: 10, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, fontSize: 12, color: '#cbd5e1', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' },
};

function AdminAIIngestion() {
  const [pendingFiles, setPendingFiles] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [draftCount, setDraftCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, count } = await supabase
          .from('framework_drafts')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .limit(10);
        if (cancelled) return;
        setDrafts(data || []);
        setDraftCount(count ?? 0);
      } catch {
        // Supabase not configured (dev) or table doesn't exist — leave
        // drafts empty rather than logging an unhandled rejection.
        if (!cancelled) { setDrafts([]); setDraftCount(0); }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const onPick = (e) => {
    const fs = Array.from(e.target.files || []);
    setPendingFiles((prev) => [...prev, ...fs.map((f) => ({ name: f.name, size: f.size, type: f.type, received: new Date().toISOString() }))]);
  };

  return (
    <div>
      <div style={{ fontSize: 12, color: '#64748b', letterSpacing: 1, textTransform: 'uppercase' }}>Admin · AI agent</div>
      <h1 style={styles.title}>Document Ingestion Pipeline</h1>
      <p style={styles.subtitle}>
        Heterogeneous source documents — heating-oil delivery PDFs, facilities spreadsheets,
        waste-hauler reports, Liberty bills used as reconciliation — flow through a five-stage
        pipeline. Per the proposal, the agent is held to the same validation standards as a human
        admin: high-confidence rows write to Supabase directly, lower-confidence rows enter the
        review queue, and every record links back to its source document.
      </p>

      <div style={styles.card}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Drop documents to ingest</h2>
        <div style={{ ...styles.upload, marginTop: 14 }}>
          <input type="file" multiple onChange={onPick} aria-label="Select documents to ingest" style={{ display: 'block', margin: '0 auto' }} />
          <div style={{ marginTop: 10 }}>PDFs, spreadsheets, images. Files are recorded but not yet processed — the LLM extraction stage is wired up in Phase 3.</div>
        </div>
        {pendingFiles.length > 0 && (
          <div style={styles.fileMeta}>
            {pendingFiles.length} file{pendingFiles.length === 1 ? '' : 's'} queued:
            <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
              {pendingFiles.map((f, i) => (
                <li key={i}>{f.name} <span style={{ color: '#64748b' }}>· {(f.size / 1024).toFixed(1)} KB · {f.type || 'unknown'}</span></li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div style={styles.card}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Pipeline stages</h2>
        <div style={styles.pipelineRow}>
          {stages.map((st, i) => (
            <React.Fragment key={st.num}>
              <div style={styles.stage}>
                <div style={styles.stageNum}>Stage {st.num}</div>
                <div style={styles.stageName}>{st.name}</div>
                <div style={styles.stageDesc}>{st.desc}</div>
                <div style={styles.stageStatus}>{st.status}</div>
              </div>
              {i < stages.length - 1 && <div style={styles.arrow}>→</div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.queueHead}>
          <span style={styles.queueTitle}>Review queue (low-confidence rows)</span>
          <span style={styles.queueCount}>{draftCount} total in framework_drafts · showing latest 10</span>
        </div>
        {drafts.length === 0 ? (
          <div style={styles.empty}>No drafts yet. Rows the agent flags as needing human review will appear here. You can also use the Framework page to add entries by hand.</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>When</th>
                <th style={styles.th}>Scope</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Label</th>
                <th style={styles.th}>Value</th>
                <th style={styles.th}>Quality</th>
              </tr>
            </thead>
            <tbody>
              {drafts.map((d) => (
                <tr key={d.id}>
                  <td style={styles.td}>{new Date(d.created_at).toLocaleString()}</td>
                  <td style={styles.td}>{d.scope}</td>
                  <td style={styles.td}>{d.category || '—'}</td>
                  <td style={styles.td}>{d.label}</td>
                  <td style={styles.td}>{d.value != null ? `${d.value}${d.unit ? ' ' + d.unit : ''}` : '—'}</td>
                  <td style={styles.td}>{d.data_quality || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={styles.footnote}>
        Methodology: Dagdelen et al. (2024, Nature Communications) showed that modern LLMs reliably
        extract structured JSON from unstructured scientific text — the same approach applies here.
        Every extracted row carries a confidence score; thresholds for auto-write vs review queue
        will be calibrated against a held-out document set during Phase 3 development.
      </div>
    </div>
  );
}

export default AdminAIIngestion;
