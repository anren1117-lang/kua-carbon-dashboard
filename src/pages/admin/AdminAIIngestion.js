import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { adminFetch } from '../../utils/adminFetch.js';
import { extractFileText } from '../../utils/extractFileText.js';

// /admin/ai-ingestion
//
// Drop a delivery invoice / spreadsheet / receipt / travel itinerary
// → the page parses the text (PDFs via pdfjs in the existing
// extractFileText util), sends it to /api/admin/ai-ingestion, and
// renders the structured rows the LLM extracted.
//
// The admin reviews each row, edits as needed, and clicks "Send to
// Supabase" to insert. Low-confidence rows can be sent to the review
// queue (framework_drafts) instead of writing directly.

const styles = {
  title: { margin: 0, fontSize: 32, fontWeight: 700 },
  subtitle: { marginTop: 8, color: '#94a3b8', maxWidth: 760 },
  card: { marginTop: 24, background: '#0f172a', border: '1px solid #1f2937', borderRadius: 12, padding: 20 },
  upload: { padding: 24, border: '2px dashed #334155', borderRadius: 8, textAlign: 'center', color: '#94a3b8' },
  imageStrip: { marginTop: 14, padding: '12px 14px', background: '#0b1220', border: '1px solid #1f2937', borderLeft: '3px solid #a855f7', borderRadius: 8 },
  imageStripLabel: { fontSize: 11, color: '#a855f7', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, marginBottom: 10 },
  imageGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 },
  imageCell: { position: 'relative', padding: 8, background: '#0f172a', border: '1px solid #1f2937', borderRadius: 6 },
  imageThumb: { width: '100%', height: 100, objectFit: 'cover', borderRadius: 4, display: 'block' },
  imageName: { marginTop: 6, fontSize: 11, color: '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  imageRemoveBtn: { position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: 11, background: '#0b1220', color: '#fca5a5', border: '1px solid #7f1d1d', fontSize: 14, lineHeight: '20px', textAlign: 'center', cursor: 'pointer', fontWeight: 700, padding: 0 },
  textarea: { width: '100%', boxSizing: 'border-box', minHeight: 180, padding: 12, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, color: '#e5e7eb', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 13, marginTop: 12, resize: 'vertical' },
  hintInput: { width: '100%', boxSizing: 'border-box', padding: '8px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, color: '#e5e7eb', fontSize: 14, marginTop: 8 },
  actionRow: { display: 'flex', gap: 10, marginTop: 14, alignItems: 'center', flexWrap: 'wrap' },
  submit: { padding: '8px 16px', background: '#0e3a1f', color: '#86efac', border: '1px solid #16a34a', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer' },
  clear: { padding: '8px 14px', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: 6, fontSize: 13, cursor: 'pointer' },
  busy: { color: '#fbbf24', fontSize: 13 },
  flagBox: { marginTop: 12, padding: '10px 14px', background: '#3a2a0e', border: '1px solid #ca8a04', borderLeft: '3px solid #fbbf24', borderRadius: 6, color: '#fde68a', fontSize: 13 },
  summaryBox: { marginTop: 12, padding: '10px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, color: '#cbd5e1', fontSize: 13 },
  rowsHead: { marginTop: 20, fontSize: 14, fontWeight: 700, color: '#e5e7eb' },
  row: { marginTop: 10, padding: '12px 14px', background: '#0b1220', border: '1px solid #1f2937', borderLeft: '3px solid #475569', borderRadius: 8 },
  rowHead: { display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' },
  rowTable: { fontFamily: 'ui-monospace, monospace', fontSize: 12, color: '#22d3ee', fontWeight: 700 },
  rowScope: { fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6 },
  pillHigh:   { fontSize: 10, padding: '2px 6px', borderRadius: 3, background: '#0e3a1f', color: '#86efac', border: '1px solid #16a34a', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 },
  sourceDocPill: { fontSize: 10, padding: '2px 8px', borderRadius: 3, background: '#0f172a', color: '#94a3b8', border: '1px solid #334155', fontFamily: 'ui-monospace, monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 280 },
  pillMedium: { fontSize: 10, padding: '2px 6px', borderRadius: 3, background: '#3a2a0e', color: '#fbbf24', border: '1px solid #ca8a04', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 },
  pillLow:    { fontSize: 10, padding: '2px 6px', borderRadius: 3, background: '#3a0d0d', color: '#fca5a5', border: '1px solid #7f1d1d', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 },
  fields: { marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 6 },
  field: { fontSize: 12, color: '#cbd5e1' },
  fieldLabel: { color: '#64748b', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700, marginBottom: 2 },
  fieldValue: { color: '#e5e7eb', fontFamily: 'ui-monospace, monospace', fontSize: 13 },
  fieldsEdit: { marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 },
  fieldEditCell: { display: 'block' },
  fieldInput: { width: '100%', boxSizing: 'border-box', padding: '6px 8px', background: '#0f172a', border: '1px solid #334155', borderRadius: 4, color: '#e5e7eb', fontSize: 13, fontFamily: 'ui-monospace, monospace', marginTop: 4 },
  editToggleBtn: { marginLeft: 'auto', padding: '2px 8px', background: 'transparent', color: '#22d3ee', border: '1px solid #155e75', borderRadius: 3, fontSize: 11, cursor: 'pointer', fontWeight: 700 },
  resetBtn: { padding: '2px 8px', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: 3, fontSize: 11, cursor: 'pointer' },
  editedBadge: { color: '#fbbf24', textTransform: 'none', letterSpacing: 0, fontWeight: 600, fontSize: 10 },
  quote: { marginTop: 10, padding: '8px 10px', background: '#0f172a', border: '1px solid #1f2937', borderRadius: 4, fontSize: 11, color: '#94a3b8', fontStyle: 'italic', borderLeft: '2px solid #475569' },
  rowActions: { marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' },
  acceptBtn: { padding: '4px 12px', background: '#0e3a1f', color: '#86efac', border: '1px solid #16a34a', borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: 'pointer' },
  draftBtn: { padding: '4px 12px', background: 'transparent', color: '#fbbf24', border: '1px solid #92400e', borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: 'pointer' },
  rejectBtn: { padding: '4px 12px', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: 4, fontSize: 12, cursor: 'pointer' },
  accepted: { fontSize: 11, color: '#86efac', marginTop: 6, fontWeight: 700 },
  acceptedErr: { fontSize: 11, color: '#fca5a5', marginTop: 6, fontWeight: 700 },
  empty: { padding: 16, color: '#64748b', fontSize: 13, fontStyle: 'italic' },
  error: { marginTop: 12, padding: '10px 14px', background: '#3a0d0d', border: '1px solid #7f1d1d', color: '#fca5a5', borderRadius: 6, fontSize: 13 },
};

function ConfidencePill({ level }) {
  const s = level === 'high' ? styles.pillHigh : level === 'medium' ? styles.pillMedium : styles.pillLow;
  return <span style={s}>{level} confidence</span>;
}

function AdminAIIngestion() {
  const [text, setText] = useState('');
  const [hint, setHint] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null); // { mode, summary, extractedRows, flags }
  const [rowStates, setRowStates] = useState({}); // index → 'idle'|'sending'|'inserted'|'drafted'|'rejected'|`error:<msg>`
  const [rowFields, setRowFields] = useState({}); // index → { ...editable copy of fields }
  const [editMode, setEditMode] = useState({});   // index → boolean (true = field inputs, false = read-only)
  const [fileName, setFileName] = useState(null);
  // images: [{ name, media_type, data: base64 }, ...]. Either text or
  // images (or both) feeds the extraction; for scanned invoices /
  // photos the image path bypasses pdfjs entirely.
  const [images, setImages] = useState([]);
  const [recentDrafts, setRecentDrafts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase
          .from('framework_drafts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(8);
        if (!cancelled) setRecentDrafts(data || []);
      } catch {
        if (!cancelled) setRecentDrafts([]);
      }
    })();
    return () => { cancelled = true; };
  }, [result]);

  // Read a File as base64 (no data: prefix — just the encoded bytes).
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = String(reader.result || '');
        const idx = result.indexOf('base64,');
        resolve(idx >= 0 ? result.slice(idx + 7) : result);
      };
      reader.onerror = () => reject(new Error('Could not read file'));
      reader.readAsDataURL(file);
    });
  }

  async function onFile(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setError(null);
    setBusy(true);
    try {
      const newImages = [];
      const newTexts = [];
      for (const f of files) {
        // Image branch — send directly to Claude vision.
        if (/^image\/(png|jpeg|jpg|gif|webp)$/i.test(f.type) || /\.(png|jpe?g|gif|webp)$/i.test(f.name)) {
          if (f.size > 5 * 1024 * 1024) {
            setError(`Image "${f.name}" is too large (>5 MB).`);
            continue;
          }
          const mediaType = f.type === 'image/jpg' ? 'image/jpeg' : (f.type || 'image/png');
          const data = await fileToBase64(f);
          newImages.push({ name: f.name, media_type: mediaType, data });
        } else {
          // Text/PDF branch — extract via pdfjs + FileReader.
          const out = await extractFileText(f);
          newTexts.push({ name: f.name, text: out.text, kind: out.kind });
        }
      }
      if (newImages.length > 0) {
        setImages((prev) => [...prev, ...newImages]);
      }
      if (newTexts.length > 0) {
        const joined = newTexts.map((t) => `--- ${t.name} ---\n${t.text}`).join('\n\n');
        setText((prev) => prev ? `${prev}\n\n${joined}` : joined);
      }
      if (files.length === 1) setFileName(files[0].name);
      else setFileName(`${files.length} files`);
    } catch (err) {
      setError(`Could not read file: ${err.message}`);
    } finally {
      setBusy(false);
    }
  }

  function removeImage(idx) {
    setImages((arr) => arr.filter((_, i) => i !== idx));
  }

  async function submit() {
    if (text.trim().length < 20 && images.length === 0) {
      setError('Paste at least 20 characters of source text or attach an image.');
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    setRowStates({});
    try {
      const r = await adminFetch('/api/admin/ai-ingestion', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          text: text || undefined,
          hint: hint || undefined,
          images: images.length > 0
            ? images.map(({ media_type, data }) => ({ media_type, data }))
            : undefined,
        }),
      });
      const body = await r.json();
      if (!r.ok) throw new Error(body.error || `HTTP ${r.status}`);
      setResult(body);
      // Seed editable copies of each row's fields so the admin can
      // tweak before sending. We deep-clone so edits don't mutate the
      // shared `result.extractedRows[i].fields` object.
      const initialFields = {};
      (body.extractedRows || []).forEach((row, i) => {
        initialFields[i] = { ...(row.fields || {}) };
      });
      setRowFields(initialFields);
      setEditMode({});
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function clear() {
    setText('');
    setHint('');
    setResult(null);
    setError(null);
    setRowStates({});
    setFileName(null);
    setImages([]);
  }

  // Coerce empty strings to null + numeric strings to numbers so the
  // edited row matches the column types Supabase expects.
  function normaliseFields(fields) {
    const out = {};
    for (const [k, v] of Object.entries(fields)) {
      if (v === '' || v === undefined) continue; // omit empty
      // Try numeric coercion for fields the LLM originally typed as numbers.
      if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v)) && /^-?\d+(\.\d+)?$/.test(v.trim())) {
        out[k] = Number(v);
      } else {
        out[k] = v;
      }
    }
    return out;
  }

  function activeFields(i, row) {
    return rowFields[i] !== undefined ? normaliseFields(rowFields[i]) : (row.fields || {});
  }

  async function acceptRow(i, row) {
    setRowStates((s) => ({ ...s, [i]: 'sending' }));
    try {
      const { error: insErr } = await supabase.from(row.table).insert(activeFields(i, row));
      if (insErr) throw new Error(insErr.message);
      setRowStates((s) => ({ ...s, [i]: 'inserted' }));
      setEditMode((m) => ({ ...m, [i]: false }));
    } catch (err) {
      setRowStates((s) => ({ ...s, [i]: `error:${err.message}` }));
    }
  }

  async function draftRow(i, row) {
    setRowStates((s) => ({ ...s, [i]: 'sending' }));
    try {
      const fields = activeFields(i, row);
      const draft = {
        scope: row.scope,
        category: row.table,
        label: `AI: ${row.table} row`,
        value: typeof fields?.gallons === 'number' ? fields.gallons
             : typeof fields?.gross_kwh === 'number' ? fields.gross_kwh
             : typeof fields?.amount === 'number' ? fields.amount
             : null,
        unit: fields?.unit || (fields?.gallons ? 'gallons' : fields?.gross_kwh ? 'kWh' : null),
        date: fields?.delivery_date || fields?.date || fields?.period_end || null,
        data_quality: row.confidence === 'high' ? 'measured' : 'estimated',
        notes: row.sourceQuote || null,
        source_doc: JSON.stringify({ fields, ai: true, originalFields: row.fields }),
      };
      const { error: insErr } = await supabase.from('framework_drafts').insert(draft);
      if (insErr) throw new Error(insErr.message);
      setRowStates((s) => ({ ...s, [i]: 'drafted' }));
      setEditMode((m) => ({ ...m, [i]: false }));
    } catch (err) {
      setRowStates((s) => ({ ...s, [i]: `error:${err.message}` }));
    }
  }

  function toggleEdit(i) {
    setEditMode((m) => ({ ...m, [i]: !m[i] }));
  }

  function setFieldValue(i, key, value) {
    setRowFields((rf) => ({
      ...rf,
      [i]: { ...(rf[i] || {}), [key]: value },
    }));
  }

  function resetFields(i, row) {
    setRowFields((rf) => ({ ...rf, [i]: { ...(row.fields || {}) } }));
  }

  function rejectRow(i) {
    setRowStates((s) => ({ ...s, [i]: 'rejected' }));
  }

  return (
    <div>
      <div style={{ fontSize: 12, color: '#64748b', letterSpacing: 1, textTransform: 'uppercase' }}>Admin · AI ingestion agent</div>
      <h1 style={styles.title}>Document → Structured rows</h1>
      <p style={styles.subtitle}>
        Drop a heating-oil invoice, vendor PO, travel itinerary, or any
        emissions-related document. The agent reads the text, identifies
        which canonical admin table the data belongs in, and proposes
        structured rows for your review. Accept directly, send to the
        review queue, or reject.
      </p>

      <div style={styles.card}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Source document</h2>
        <div style={{ ...styles.upload, marginTop: 14 }}>
          <input
            type="file"
            accept=".txt,.md,.csv,.json,.pdf,.png,.jpg,.jpeg,.gif,.webp,image/*"
            onChange={onFile}
            aria-label="Pick a document to ingest"
            disabled={busy}
            multiple
            style={{ display: 'block', margin: '0 auto' }}
          />
          <div style={{ marginTop: 10, fontSize: 13 }}>
            {fileName ? `Loaded: ${fileName}` : 'PDF, .txt, .md, .csv, .json, or image (PNG/JPG/GIF/WebP) — or paste below.'}
          </div>
        </div>

        {images.length > 0 && (
          <div style={styles.imageStrip}>
            <div style={styles.imageStripLabel}>
              {images.length} image{images.length === 1 ? '' : 's'} attached · Claude vision
            </div>
            <div style={styles.imageGrid}>
              {images.map((img, i) => (
                <div key={i} style={styles.imageCell}>
                  <img
                    src={`data:${img.media_type};base64,${img.data}`}
                    alt={img.name}
                    style={styles.imageThumb}
                  />
                  <div style={styles.imageName}>{img.name}</div>
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    style={styles.imageRemoveBtn}
                    aria-label={`Remove ${img.name}`}
                    disabled={busy}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <label style={{ display: 'block', marginTop: 14 }}>
          <span style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 }}>
            Or paste source text
          </span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste the document content here — invoice text, BMS export, vendor PO, etc."
            style={styles.textarea}
            disabled={busy}
          />
        </label>

        <label style={{ display: 'block', marginTop: 14 }}>
          <span style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 }}>
            Hint (optional) — tells the agent what to expect
          </span>
          <input
            type="text"
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            placeholder='e.g. "FW Webb heating-oil delivery invoice" or "Sodexo monthly purchase order"'
            style={styles.hintInput}
            disabled={busy}
            maxLength={280}
          />
        </label>

        <div style={styles.actionRow}>
          <button type="button" style={styles.submit} onClick={submit} disabled={busy || (text.trim().length < 20 && images.length === 0)}>
            {busy ? 'Extracting…' : '🧠 Extract structured rows'}
          </button>
          <button type="button" style={styles.clear} onClick={clear} disabled={busy}>
            Clear
          </button>
          {busy && <span style={styles.busy}>Reading document + calling Claude…</span>}
        </div>

        {error && <div role="alert" style={styles.error}>Error: {error}</div>}
      </div>

      {result && (
        <div style={styles.card}>
          <h2 style={{ margin: 0, fontSize: 18 }}>
            Extraction result {result.mode === 'unavailable' && <span style={{ fontSize: 12, color: '#fbbf24', marginLeft: 8 }}>(LLM not configured)</span>}
          </h2>

          {result.summary && (
            <div style={styles.summaryBox}>{result.summary}</div>
          )}

          {result.flags && result.flags.length > 0 && (
            <div style={styles.flagBox}>
              <strong>Flags</strong>
              <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
                {result.flags.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
          )}

          <div style={styles.rowsHead}>
            {result.extractedRows.length === 0
              ? 'No emissions-relevant rows extracted.'
              : `${result.extractedRows.length} row${result.extractedRows.length === 1 ? '' : 's'} proposed`}
          </div>

          {result.extractedRows.map((row, i) => {
            const state = rowStates[i] || 'idle';
            const editing = !!editMode[i];
            const editedFields = rowFields[i] !== undefined ? rowFields[i] : row.fields;
            const accentColor = row.confidence === 'high' ? '#16a34a' : row.confidence === 'medium' ? '#ca8a04' : '#7f1d1d';
            const fieldKeys = Object.keys(editedFields);
            return (
              <div key={i} style={{ ...styles.row, borderLeftColor: accentColor }}>
                <div style={styles.rowHead}>
                  <span style={styles.rowTable}>{row.table}</span>
                  <span style={styles.rowScope}>· {row.scope}</span>
                  <ConfidencePill level={row.confidence} />
                  {row.sourceDocument && (
                    <span style={styles.sourceDocPill} title={`Extracted from ${row.sourceDocument}`}>
                      📄 {row.sourceDocument}
                    </span>
                  )}
                  {state === 'idle' && (
                    <button type="button" onClick={() => toggleEdit(i)} style={styles.editToggleBtn}>
                      {editing ? '✓ Done editing' : '✎ Edit fields'}
                    </button>
                  )}
                  {editing && state === 'idle' && (
                    <button type="button" onClick={() => resetFields(i, row)} style={styles.resetBtn} title="Restore the AI's original values">
                      ↻ Reset to AI
                    </button>
                  )}
                </div>
                {!editing ? (
                  <div style={styles.fields}>
                    {fieldKeys.map((k) => {
                      const v = editedFields[k];
                      const changed = JSON.stringify(v) !== JSON.stringify(row.fields[k]);
                      return (
                        <div key={k} style={styles.field}>
                          <div style={styles.fieldLabel}>{k}{changed && <span style={styles.editedBadge}> · edited</span>}</div>
                          <div style={styles.fieldValue}>{v === null || v === undefined || v === '' ? '—' : String(v)}</div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={styles.fieldsEdit}>
                    {fieldKeys.map((k) => {
                      const v = editedFields[k];
                      const original = row.fields[k];
                      const changed = JSON.stringify(v) !== JSON.stringify(original);
                      return (
                        <label key={k} style={styles.fieldEditCell}>
                          <span style={styles.fieldLabel}>
                            {k}{changed && <span style={styles.editedBadge}> · edited</span>}
                          </span>
                          <input
                            type="text"
                            value={v === null || v === undefined ? '' : String(v)}
                            onChange={(e) => setFieldValue(i, k, e.target.value)}
                            style={styles.fieldInput}
                            placeholder={original === null || original === undefined ? '' : String(original)}
                          />
                        </label>
                      );
                    })}
                  </div>
                )}
                {row.sourceQuote && (
                  <div style={styles.quote}>“{row.sourceQuote}”</div>
                )}
                <div style={styles.rowActions}>
                  {state === 'idle' && (
                    <>
                      <button type="button" style={styles.acceptBtn} onClick={() => acceptRow(i, row)}>
                        ✓ Send to {row.table}
                      </button>
                      <button type="button" style={styles.draftBtn} onClick={() => draftRow(i, row)}>
                        → Review queue
                      </button>
                      <button type="button" style={styles.rejectBtn} onClick={() => rejectRow(i)}>
                        Reject
                      </button>
                    </>
                  )}
                  {state === 'sending' && <span style={{ fontSize: 12, color: '#fbbf24' }}>Sending…</span>}
                </div>
                {state === 'inserted' && <div style={styles.accepted}>✓ Inserted into {row.table}.</div>}
                {state === 'drafted' && <div style={styles.accepted}>✓ Sent to framework_drafts review queue.</div>}
                {state === 'rejected' && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>Rejected — won't be sent.</div>}
                {typeof state === 'string' && state.startsWith('error:') && (
                  <div style={styles.acceptedErr} role="alert">✗ {state.slice('error:'.length)}</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div style={styles.card}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Recent review-queue drafts</h2>
        {recentDrafts.length === 0 ? (
          <div style={styles.empty}>No drafts yet. Rows you "Send to review queue" land here for an extra approval step before they reach a canonical table.</div>
        ) : (
          <table style={{ width: '100%', marginTop: 12, borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '6px 10px', fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6 }}>When</th>
                <th style={{ textAlign: 'left', padding: '6px 10px', fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6 }}>Scope</th>
                <th style={{ textAlign: 'left', padding: '6px 10px', fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6 }}>Table</th>
                <th style={{ textAlign: 'left', padding: '6px 10px', fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6 }}>Value</th>
                <th style={{ textAlign: 'left', padding: '6px 10px', fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6 }}>Quality</th>
              </tr>
            </thead>
            <tbody>
              {recentDrafts.map((d) => (
                <tr key={d.id}>
                  <td style={{ padding: '6px 10px', fontSize: 12, color: '#cbd5e1', borderTop: '1px solid #1f2937', fontFamily: 'ui-monospace, monospace' }}>{new Date(d.created_at).toLocaleString()}</td>
                  <td style={{ padding: '6px 10px', fontSize: 13, color: '#cbd5e1', borderTop: '1px solid #1f2937' }}>{d.scope}</td>
                  <td style={{ padding: '6px 10px', fontSize: 12, color: '#22d3ee', borderTop: '1px solid #1f2937', fontFamily: 'ui-monospace, monospace' }}>{d.category || '—'}</td>
                  <td style={{ padding: '6px 10px', fontSize: 13, color: '#cbd5e1', borderTop: '1px solid #1f2937' }}>{d.value != null ? `${d.value}${d.unit ? ' ' + d.unit : ''}` : '—'}</td>
                  <td style={{ padding: '6px 10px', fontSize: 13, color: '#cbd5e1', borderTop: '1px solid #1f2937' }}>{d.data_quality || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminAIIngestion;
