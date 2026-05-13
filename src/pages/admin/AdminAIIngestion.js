import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { adminFetch } from '../../utils/adminFetch.js';
import { extractFileText } from '../../utils/extractFileText.js';
import { logAdminWrite } from '../../utils/adminAudit.js';
import { ADMIN_TABLE_SOURCES } from '../../data/adminTableSources.js';

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
  upload: { padding: 24, border: '2px dashed #334155', borderRadius: 8, textAlign: 'center', color: '#94a3b8', transition: 'border-color 0.15s ease, background 0.15s ease' },
  uploadDragOver: { borderColor: '#22d3ee', background: '#0c2a3a', color: '#22d3ee' },
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
  bulkBar: { marginTop: 10, padding: '10px 14px', background: '#0b1220', border: '1px solid #1f2937', borderLeft: '3px solid #22d3ee', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  bulkBarLabel: { fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 },
  bulkAccept: { padding: '6px 12px', background: '#0e3a1f', color: '#86efac', border: '1px solid #16a34a', borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: 'pointer' },
  bulkDraft:  { padding: '6px 12px', background: 'transparent', color: '#fbbf24', border: '1px solid #92400e', borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: 'pointer' },
  bulkReject: { padding: '6px 12px', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: 4, fontSize: 12, cursor: 'pointer' },
  reExtract:  { padding: '6px 12px', background: 'transparent', color: '#fbbf24', border: '1px solid #92400e', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' },
  autoWriteToggle: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, fontSize: 12, color: '#cbd5e1', cursor: 'pointer', userSelect: 'none' },
  confReason: { marginTop: 8, padding: '6px 10px', background: '#0f172a', border: '1px solid #1f2937', borderRadius: 4, fontSize: 12, color: '#cbd5e1', lineHeight: 1.5 },
  confReasonLabel: { fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, marginRight: 6 },
  tablePicker: { padding: '2px 6px', background: '#0f172a', border: '1px solid #155e75', borderRadius: 3, color: '#22d3ee', fontSize: 12, fontFamily: 'ui-monospace, monospace', fontWeight: 700, cursor: 'pointer' },
  reclassifiedBadge: { color: '#fbbf24', fontSize: 10, fontWeight: 600, fontFamily: 'inherit', textTransform: 'none', letterSpacing: 0, marginLeft: 4 },
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

function ConfidencePill({ level, reason }) {
  const s = level === 'high' ? styles.pillHigh : level === 'medium' ? styles.pillMedium : styles.pillLow;
  return (
    <span style={s} title={reason || `${level} confidence — no explanation provided`}>
      {level} confidence{reason ? ' · why?' : ''}
    </span>
  );
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
  const [tableOverride, setTableOverride] = useState({}); // index → table name when admin re-classified the row
  const [fileName, setFileName] = useState(null);
  // images: [{ name, media_type, data: base64 }, ...]. Either text or
  // images (or both) feeds the extraction; for scanned invoices /
  // photos the image path bypasses pdfjs entirely.
  const [images, setImages] = useState([]);
  // Phase 108: optional auto-write toggle. When ON, rows the agent
  // tags as high-confidence get inserted into Supabase immediately
  // after extraction — no per-row click. Medium + low still queue
  // for review. Off by default; admins opt in when they trust the
  // agent on a familiar document type.
  const AUTO_WRITE_KEY = 'kua_admin_ai_autowrite';
  const [autoWrite, setAutoWrite] = useState(() => {
    try { return localStorage.getItem(AUTO_WRITE_KEY) === '1'; } catch { return false; }
  });
  useEffect(() => {
    try { localStorage.setItem(AUTO_WRITE_KEY, autoWrite ? '1' : '0'); } catch {}
  }, [autoWrite]);
  const [recentDrafts, setRecentDrafts] = useState([]);

  // Phase 139: persist the in-progress extraction across reloads so an
  // accidental refresh doesn't dump 30 reviewed rows. Saves whenever
  // result becomes non-null; clears on `clear()`. Only the LLM
  // output + admin's per-row edits are persisted — not text/hint/images
  // (those would re-upload the source on next mount, which is wasted).
  const DRAFT_KEY = 'kua_admin_ai_draft';
  // One-time hydration on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (!saved || !saved.result) return;
      // Don't auto-restore — let the admin opt in so a stale draft
      // doesn't surprise them.
      setStashedDraft(saved);
    } catch {}
  }, []);
  const [stashedDraft, setStashedDraft] = useState(null);
  // Save in-progress state whenever it materially changes.
  useEffect(() => {
    if (!result) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({
        savedAt: Date.now(),
        result,
        rowStates,
        rowFields,
        editMode,
        tableOverride,
        hint,
        fileName,
      }));
    } catch {}
  }, [result, rowStates, rowFields, editMode, tableOverride, hint, fileName]);

  function restoreDraft() {
    if (!stashedDraft) return;
    setResult(stashedDraft.result || null);
    setRowStates(stashedDraft.rowStates || {});
    setRowFields(stashedDraft.rowFields || {});
    setEditMode(stashedDraft.editMode || {});
    setTableOverride(stashedDraft.tableOverride || {});
    if (typeof stashedDraft.hint === 'string') setHint(stashedDraft.hint);
    if (typeof stashedDraft.fileName === 'string') setFileName(stashedDraft.fileName);
    setStashedDraft(null);
  }
  function dismissDraft() {
    setStashedDraft(null);
    try { localStorage.removeItem(DRAFT_KEY); } catch {}
  }

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

  // Heuristic guess: turn a filename like "FW-Webb-Invoice-2026-03.pdf"
  // into a hint like "FW Webb invoice — 2026-03". Pure-text, runs
  // before any LLM call, so wrong guesses cost nothing.
  function guessHintFromFilename(name) {
    if (!name || typeof name !== 'string') return '';
    const stem = name.replace(/\.[^.]+$/, '');
    const cleaned = stem.replace(/[_\-]+/g, ' ').replace(/\s+/g, ' ').trim();
    if (!cleaned) return '';
    // Common emissions-document keywords → standardized hint stems.
    const lower = cleaned.toLowerCase();
    const matchers = [
      [/\b(fw[ -]?webb|cohen|irving|dead river)\b.*\b(oil|propane|fuel|delivery)\b/i, (s) => `Heating-oil delivery invoice — ${s}`],
      [/\b(invoice|bill|statement|receipt)\b/i,                                       (s) => `Invoice — ${s}`],
      [/\b(sodexo|aramark|sage)\b/i,                                                  (s) => `Dining services purchase order — ${s}`],
      [/\b(itinerary|travel|flight|airfare|booking)\b/i,                              (s) => `Travel itinerary — ${s}`],
      [/\b(bms|envysion|meter|trends?)\b/i,                                           (s) => `BMS meter export — ${s}`],
      [/\b(waste|landfill|recycl|compost|haul)\b/i,                                   (s) => `Waste hauler report — ${s}`],
      [/\b(liberty|electric|utility|kwh)\b/i,                                         (s) => `Liberty Utilities electricity bill — ${s}`],
      [/\b(solar|inverter|generation)\b/i,                                            (s) => `Solar generation export — ${s}`],
      [/\b(refrigerant|hvac|service|maintenance)\b/i,                                 (s) => `HVAC service report — ${s}`],
    ];
    for (const [re, build] of matchers) {
      if (re.test(lower)) return build(cleaned).slice(0, 200);
    }
    return `Source: ${cleaned}`.slice(0, 200);
  }

  async function processFiles(files) {
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
      // Apply auto-hint to whatever filenames came in.
      // Auto-populate the hint from filenames if the admin hasn't
      // typed one yet. Joins multiple filenames so multi-file
      // uploads still get a useful hint.
      if (!hint.trim()) {
        const guesses = files.map((f) => guessHintFromFilename(f.name)).filter(Boolean);
        if (guesses.length === 1) {
          setHint(guesses[0]);
        } else if (guesses.length > 1) {
          // Same-prefix guesses are common (3 monthly statements);
          // emit one hint covering the batch.
          const uniq = [...new Set(guesses)];
          setHint(uniq.length === 1 ? `${uniq[0]} (${guesses.length} files)` : `Mixed batch: ${uniq.slice(0, 3).join(' / ')}`.slice(0, 200));
        }
      }
    } catch (err) {
      setError(`Could not read file: ${err.message}`);
    } finally {
      setBusy(false);
    }
  }

  function removeImage(idx) {
    setImages((arr) => arr.filter((_, i) => i !== idx));
  }

  // Bridge for the <input type="file"> change event.
  async function onFile(e) {
    const files = Array.from(e.target.files || []);
    await processFiles(files);
    // Reset the input so re-selecting the same file fires a change.
    e.target.value = '';
  }

  // Drag-and-drop. Tracks dragOver state so the drop zone gives
  // visual feedback when files hover over it.
  const [dragOver, setDragOver] = useState(false);
  function onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDragOver(true);
  }
  function onDragLeave(e) {
    e.preventDefault();
    setDragOver(false);
  }
  async function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    if (busy) return;
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length === 0) return;
    await processFiles(files);
  }

  // Live char-count + elapsed-time progress while the streaming
  // extraction runs.
  const [streamChars, setStreamChars] = useState(0);
  const [streamStartedAt, setStreamStartedAt] = useState(null);
  const [streamElapsed, setStreamElapsed] = useState(0);
  useEffect(() => {
    if (!busy || !streamStartedAt) {
      setStreamElapsed(0);
      return;
    }
    const id = setInterval(() => {
      setStreamElapsed(Math.floor((Date.now() - streamStartedAt) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [busy, streamStartedAt]);

  // Phase 128: keyboard shortcuts.
  //   ⌘/Ctrl + Enter  — submit extraction (when input is ready + not busy)
  //   Esc             — clear form (no in-flight extract)
  useEffect(() => {
    function inForm(target) {
      const tag = target?.tagName?.toLowerCase();
      // Allow Cmd-Enter from inside the hint/text inputs — that's the
      // natural place admin presses it after pasting text.
      return tag === 'select' || target?.isContentEditable;
    }
    function onKey(e) {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === 'Enter') {
        if (inForm(e.target)) return;
        if (!busy && (text.trim().length >= 20 || images.length > 0)) {
          e.preventDefault();
          submit();
        }
      } else if (e.key === 'Escape') {
        const tag = e.target?.tagName?.toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;
        if (!busy && (text || images.length > 0 || result)) {
          clear();
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [busy, text, images, result]);

  async function submit() {
    if (text.trim().length < 20 && images.length === 0) {
      setError('Paste at least 20 characters of source text or attach an image.');
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    setRowStates({});
    setStreamChars(0);
    setStreamStartedAt(Date.now());
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
          stream: true,
        }),
      });
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${r.status}`);
      }
      // SSE parsing (mirrors the plan endpoint client in Phase 119).
      const reader = r.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let finalBody = null;
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buffer.indexOf('\n\n')) >= 0) {
          const chunk = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 2);
          const eventLine = chunk.split('\n').find((l) => l.startsWith('event: '));
          const dataLine  = chunk.split('\n').find((l) => l.startsWith('data: '));
          if (!eventLine || !dataLine) continue;
          const event = eventLine.slice(7).trim();
          let payload = null;
          try { payload = JSON.parse(dataLine.slice(6)); } catch {}
          if (!payload) continue;
          if (event === 'progress')      setStreamChars(payload.charCount || 0);
          else if (event === 'done')     finalBody = payload;
          else if (event === 'error')    throw new Error(payload.message || 'stream error');
        }
      }
      if (!finalBody) throw new Error('Stream ended without extraction result');
      const body = finalBody;
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
      // Auto-write fast path. Immediately insert every high-confidence
      // row after extraction. Each insert runs through the same
      // acceptRow path so logAdminWrite + audit-log entries still fire.
      // We pause briefly to let React commit the initial render before
      // mutating row states.
      if (autoWrite) {
        const rows = body.extractedRows || [];
        // Use setTimeout so the result panel renders first, then
        // auto-writes start as the user can see them tick over.
        setTimeout(async () => {
          for (let i = 0; i < rows.length; i++) {
            if (rows[i].confidence !== 'high') continue;
            // Use the row's own fields (no edits possible yet) — we
            // call the same Supabase insert path as acceptRow but
            // inline since acceptRow reads from rowFields state.
            try {
              setRowStates((s) => ({ ...s, [i]: 'sending' }));
              const { error: insErr } = await supabase.from(rows[i].table).insert(rows[i].fields);
              if (insErr) throw new Error(insErr.message);
              logAdminWrite({
                action: 'insert',
                table: rows[i].table,
                payload: rows[i].fields,
                note: `AI ingestion · auto-write · high-confidence${rows[i].sourceDocument ? ` · ${rows[i].sourceDocument}` : ''}`,
              });
              setRowStates((s) => ({ ...s, [i]: 'inserted' }));
            } catch (err) {
              setRowStates((s) => ({ ...s, [i]: `error:${err.message}` }));
            }
          }
        }, 80);
      }
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
    setRowFields({});
    setEditMode({});
    setTableOverride({});
    setFileName(null);
    setImages([]);
    try { localStorage.removeItem(DRAFT_KEY); } catch {}
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

  function activeTable(i, row) {
    return tableOverride[i] || row.table;
  }

  async function acceptRow(i, row) {
    setRowStates((s) => ({ ...s, [i]: 'sending' }));
    try {
      const fields = activeFields(i, row);
      const targetTable = activeTable(i, row);
      const { error: insErr } = await supabase.from(targetTable).insert(fields);
      if (insErr) throw new Error(insErr.message);
      const reclassified = targetTable !== row.table;
      logAdminWrite({
        action: 'insert',
        table: targetTable,
        payload: fields,
        note: `AI ingestion · ${row.confidence}-confidence${row.sourceDocument ? ` · ${row.sourceDocument}` : ''}${reclassified ? ` · re-classified from ${row.table}` : ''}`,
      });
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
      const targetTable = activeTable(i, row);
      const draft = {
        scope: row.scope,
        category: targetTable,
        label: `AI: ${targetTable} row${targetTable !== row.table ? ` (re-classified from ${row.table})` : ''}`,
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

  // Bulk action: apply a per-row handler to every row whose current
  // state is 'idle' AND that matches the filter predicate. Sequenced
  // serially (not Promise.all) so the per-row state machine displays
  // a clean "Sending…" → "Inserted" progression instead of N parallel
  // races.
  async function bulkApply(filterFn, handlerName) {
    const handler = handlerName === 'accept' ? acceptRow : handlerName === 'draft' ? draftRow : rejectRow;
    const rows = result?.extractedRows || [];
    for (let i = 0; i < rows.length; i++) {
      if ((rowStates[i] || 'idle') !== 'idle') continue;
      if (!filterFn(rows[i])) continue;
      // For reject the handler is synchronous; for accept/draft it's async.
      // We await regardless — sync handlers just resolve to undefined.
      // eslint-disable-next-line no-await-in-loop
      await handler(i, rows[i]);
    }
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

      {stashedDraft && !result && (
        <div
          role="status"
          style={{
            marginTop: 12,
            padding: '12px 16px',
            background: '#0f172a',
            border: '1px solid #312e81',
            borderLeft: '4px solid #6366f1',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: 1, fontSize: 13, color: '#cbd5e1' }}>
            <strong style={{ color: '#a5b4fc' }}>Resume previous extraction?</strong>
            {' '}{(stashedDraft.result?.extractedRows || []).length} row{(stashedDraft.result?.extractedRows || []).length === 1 ? '' : 's'}
            {stashedDraft.fileName ? ` from "${stashedDraft.fileName}"` : ''}
            {stashedDraft.savedAt ? ` · saved ${new Date(stashedDraft.savedAt).toLocaleString()}` : ''}
          </div>
          <button
            type="button"
            onClick={restoreDraft}
            style={{ padding: '6px 12px', background: '#312e81', color: '#e0e7ff', border: '1px solid #6366f1', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
          >
            Restore
          </button>
          <button
            type="button"
            onClick={dismissDraft}
            style={{ padding: '6px 10px', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}
          >
            Dismiss
          </button>
        </div>
      )}

      <div style={styles.card}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Source document</h2>
        <div
          style={{
            ...styles.upload,
            marginTop: 14,
            ...(dragOver ? styles.uploadDragOver : null),
          }}
          onDragOver={onDragOver}
          onDragEnter={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          role="region"
          aria-label="File drop zone"
        >
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
            {dragOver
              ? '⬇ Release to upload'
              : (fileName ? `Loaded: ${fileName}` : 'PDF, .txt, .md, .csv, .json, or image (PNG/JPG/GIF/WebP) — drag & drop or click above.')}
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
          {!busy && (
            <span style={{ fontSize: 11, color: '#64748b', alignSelf: 'center' }}>
              ⌘↵ extract · Esc clear
            </span>
          )}
          <button type="button" style={styles.clear} onClick={clear} disabled={busy}>
            Clear
          </button>
          <label style={styles.autoWriteToggle} title="When ON, rows the agent tags as high-confidence get inserted into Supabase immediately after extraction. Medium + low still queue for review.">
            <input
              type="checkbox"
              checked={autoWrite}
              onChange={(e) => setAutoWrite(e.target.checked)}
              disabled={busy}
            />
            <span>Auto-write high-confidence rows</span>
          </label>
          {busy && (
            <span style={styles.busy}>
              {streamChars > 0
                ? `Extracting… ${streamElapsed}s · ${streamChars.toLocaleString()} chars`
                : `Reading document… ${streamElapsed}s`}
            </span>
          )}
        </div>

        {error && <div role="alert" style={styles.error}>Error: {error}</div>}
      </div>

      {result && (
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 12 }}>
            <h2 style={{ margin: 0, fontSize: 18 }}>
              Extraction result {result.mode === 'unavailable' && <span style={{ fontSize: 12, color: '#fbbf24', marginLeft: 8 }}>(LLM not configured)</span>}
            </h2>
            <button
              type="button"
              onClick={submit}
              disabled={busy}
              style={styles.reExtract}
              title="Re-run extraction on the same source. Tweak the hint above first to nudge the agent toward different output."
            >
              {busy ? 'Re-extracting…' : '↻ Re-extract with updated hint'}
            </button>
          </div>

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

          {result.extractedRows.length > 1 && (() => {
            // Tally idle rows by confidence for the bulk-action labels.
            const idleByConf = { high: 0, medium: 0, low: 0 };
            result.extractedRows.forEach((r, i) => {
              if ((rowStates[i] || 'idle') === 'idle') {
                idleByConf[r.confidence] = (idleByConf[r.confidence] || 0) + 1;
              }
            });
            const totalIdle = idleByConf.high + idleByConf.medium + idleByConf.low;
            if (totalIdle <= 1) return null;
            return (
              <div style={styles.bulkBar}>
                <span style={styles.bulkBarLabel}>Bulk actions ({totalIdle} pending):</span>
                {idleByConf.high > 0 && (
                  <button
                    type="button"
                    onClick={() => bulkApply((r) => r.confidence === 'high', 'accept')}
                    style={styles.bulkAccept}
                  >
                    ✓ Accept all high-confidence ({idleByConf.high})
                  </button>
                )}
                {(idleByConf.medium > 0 || idleByConf.low > 0) && (
                  <button
                    type="button"
                    onClick={() => bulkApply((r) => r.confidence === 'medium' || r.confidence === 'low', 'draft')}
                    style={styles.bulkDraft}
                  >
                    → Draft all medium + low ({idleByConf.medium + idleByConf.low})
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => bulkApply(() => true, 'reject')}
                  style={styles.bulkReject}
                >
                  Reject remaining ({totalIdle})
                </button>
              </div>
            );
          })()}

          {result.extractedRows.map((row, i) => {
            const state = rowStates[i] || 'idle';
            const editing = !!editMode[i];
            const editedFields = rowFields[i] !== undefined ? rowFields[i] : row.fields;
            const accentColor = row.confidence === 'high' ? '#16a34a' : row.confidence === 'medium' ? '#ca8a04' : '#7f1d1d';
            const fieldKeys = Object.keys(editedFields);
            return (
              <div key={i} style={{ ...styles.row, borderLeftColor: accentColor }}>
                <div style={styles.rowHead}>
                  {editing ? (
                    <select
                      value={tableOverride[i] || row.table}
                      onChange={(e) => setTableOverride((m) => {
                        const next = { ...m };
                        if (e.target.value === row.table) delete next[i];
                        else next[i] = e.target.value;
                        return next;
                      })}
                      style={styles.tablePicker}
                      title="Re-classify this row to a different admin table"
                    >
                      {ADMIN_TABLE_SOURCES.map((src) => (
                        <option key={src.table} value={src.table}>
                          {src.table} ({src.scope})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span style={styles.rowTable}>
                      {tableOverride[i] || row.table}
                      {tableOverride[i] && tableOverride[i] !== row.table && (
                        <span style={styles.reclassifiedBadge}> · re-classified from {row.table}</span>
                      )}
                    </span>
                  )}
                  <span style={styles.rowScope}>· {row.scope}</span>
                  <ConfidencePill level={row.confidence} reason={row.confidenceReason} />
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
                {row.confidenceReason && (
                  <div style={styles.confReason}>
                    <span style={styles.confReasonLabel}>Why this confidence:</span> {row.confidenceReason}
                  </div>
                )}
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
                        ✓ Send to {tableOverride[i] || row.table}
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
                {state === 'inserted' && <div style={styles.accepted}>✓ Inserted into {tableOverride[i] || row.table}.</div>}
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
