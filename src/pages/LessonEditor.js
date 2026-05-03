import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModulePage, ModuleSection, Pill } from '../components/ModuleShell.js';
import { hashUserId } from '../utils/hash.js';
import { extractFileText, FILE_LIMITS } from '../utils/extractFileText.js';

// Lesson editor — teacher pastes source material, picks reading level
// + topic, hits Generate. The /api/teacher/lessons endpoint calls
// Anthropic with strict grounding rules and returns the generated
// reading + 4-option questions. Teacher reviews + publishes; the
// resulting URL (/lessons/:id) is what they share with students.

const TOPICS = [
  { id: 'climate_basics', label: 'Climate basics' },
  { id: 'scopes',         label: 'Scopes 1/2/3' },
  { id: 'energy',         label: 'Energy + grid' },
  { id: 'food',           label: 'Food emissions' },
  { id: 'transport',      label: 'Transportation' },
  { id: 'waste',          label: 'Waste + recycling' },
  { id: 'sinks',          label: 'Sinks + sequestration' },
  { id: 'kua_specific',   label: 'KUA campus' },
  { id: 'action',         label: 'Personal/dorm action' },
];

const LEVELS = [
  { id: 'novice',       label: 'Novice — short, plain language' },
  { id: 'intermediate', label: 'Intermediate — uses scope/GWP terms' },
  { id: 'advanced',     label: 'Advanced — AP-level with calculations' },
];

function getTeacherHash() {
  // Phase-1: derive a stable hash from a sessionStorage marker that
  // gets set when the password gate is unlocked. Phase-2 swaps in the
  // SSO-issued hash from /api/auth/session.
  try {
    let id = sessionStorage.getItem('kua_teacher_id');
    if (!id) {
      id = `teacher-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem('kua_teacher_id', id);
    }
    return hashUserId('staff', id);
  } catch {
    return hashUserId('staff', `anon_${Date.now()}`);
  }
}

export default function LessonEditor() {
  const nav = useNavigate();
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState(TOPICS[0].id);
  const [readingLevel, setReadingLevel] = useState('intermediate');
  const [classId, setClassId] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [sourceMaterial, setSourceMaterial] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [draft, setDraft] = useState(null); // { lessonId, reading, questions }

  const charCount = sourceMaterial.length;
  const overLimit = charCount > 12000;

  // File upload state
  const fileInputRef = useRef(null);
  const [uploadInfo, setUploadInfo] = useState(null);  // { name, kind, charsExtracted, truncated }
  const [uploadError, setUploadError] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  async function handleFiles(files) {
    if (!files || !files.length) return;
    const file = files[0];
    setExtracting(true);
    setUploadError(null);
    setUploadInfo(null);
    try {
      const result = await extractFileText(file);
      if (!result.text) {
        throw new Error('Could not extract any text from this file. PDFs that are scanned images need OCR — try a text-based PDF, or paste the text manually.');
      }
      setSourceMaterial(result.text);
      setUploadInfo({
        name: result.sourceFileName,
        kind: result.kind,
        charsExtracted: result.text.length,
        truncated: result.truncated,
      });
      // Default the title from the filename if blank
      if (!title.trim()) {
        const base = result.sourceFileName.replace(/\.[^.]+$/, '');
        setTitle(base.replace(/[-_]/g, ' ').slice(0, 140));
      }
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setExtracting(false);
    }
  }

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer?.files);
  }

  async function generate(targetStatus) {
    if (!title.trim() || !sourceMaterial.trim() || overLimit) return;
    setBusy(true); setError(null); setDraft(null);
    try {
      const r = await fetch('/api/teacher/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherIdHash: getTeacherHash(),
          title: title.trim(),
          topic,
          readingLevel,
          classId: classId.trim() || undefined,
          numQuestions,
          sourceMaterial,
          status: targetStatus,
        }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error || `HTTP ${r.status}`);
      }
      const j = await r.json();
      setDraft(j.lesson);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function viewAsStudent() {
    if (!draft?.id) return;
    nav(`/lessons/${draft.id}`);
  }

  return (
    <ModulePage
      title="Create a lesson"
      subtitle="Paste source material — an article excerpt, lecture notes, a research paper section. The AI rewrites it at the chosen reading level and generates five 4-option questions, grounded only in what you provided."
    >
      <ModuleSection title="Source material">
        <div style={styles.formGrid}>
          <Field label="Title">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Why methane matters more in the short term"
              style={styles.input}
              maxLength={140}
            />
          </Field>
          <Field label="Topic">
            <select value={topic} onChange={(e) => setTopic(e.target.value)} style={styles.input}>
              {TOPICS.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </Field>
          <Field label="Reading level">
            <select value={readingLevel} onChange={(e) => setReadingLevel(e.target.value)} style={styles.input}>
              {LEVELS.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
            </select>
          </Field>
          <Field label="Class (optional)">
            <input
              type="text"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              placeholder="e.g. APES-Period-3"
              style={styles.input}
              maxLength={64}
            />
          </Field>
          <Field label={`Number of questions (${numQuestions})`}>
            <input
              type="range"
              min={3}
              max={10}
              step={1}
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              style={{ width: '100%' }}
              aria-label="Number of questions to generate"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', marginTop: 4 }}>
              <span>3</span><span>5</span><span>10</span>
            </div>
          </Field>
        </div>

        <div style={{ marginTop: 14 }}>
          <div style={styles.label}>
            <span>Upload a file (optional)</span>
            <span style={{ color: '#64748b', fontSize: 11 }}>.txt, .md, .csv, .json, .pdf · up to 5 MB</span>
          </div>
          <div
            style={{
              ...styles.dropZone,
              borderColor: dragOver ? '#22d3ee' : extracting ? '#fbbf24' : '#334155',
              background: dragOver ? '#0c2a3a' : '#0b1220',
            }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
            aria-label="Upload a file — drop here or click to pick"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.markdown,.csv,.json,.pdf,text/plain,text/markdown,text/csv,application/json,application/pdf"
              onChange={(e) => handleFiles(e.target.files)}
              style={{ display: 'none' }}
            />
            <div style={styles.dropIcon} aria-hidden="true">📎</div>
            <div style={styles.dropMain}>
              {extracting
                ? 'Extracting text…'
                : uploadInfo
                  ? <><strong style={{ color: '#22d3ee' }}>{uploadInfo.name}</strong> — {uploadInfo.charsExtracted.toLocaleString()} chars extracted{uploadInfo.truncated ? ' (truncated to 12,000)' : ''}</>
                  : 'Drop a file here, or click to pick'}
            </div>
            {uploadInfo && (
              <div style={styles.dropSub}>
                Source <Pill kind="info">{uploadInfo.kind === 'pdf' ? 'PDF' : 'TEXT'}</Pill> · review the extracted text below before generating
              </div>
            )}
          </div>
          {uploadError && <div style={styles.uploadError}>{uploadError}</div>}
        </div>

        <div style={{ marginTop: 14 }}>
          <div style={styles.label}>
            <span>Source material {uploadInfo ? '(extracted from file — edit if needed)' : '(paste or upload)'}</span>
            <span style={{ color: overLimit ? '#fca5a5' : '#64748b', fontSize: 11 }}>
              {charCount.toLocaleString()} / {FILE_LIMITS.MAX_CHARS.toLocaleString()} chars
            </span>
          </div>
          <textarea
            value={sourceMaterial}
            onChange={(e) => setSourceMaterial(e.target.value)}
            placeholder="Paste an article excerpt, lecture notes, or a chapter section — or upload a file above."
            rows={12}
            style={styles.textarea}
          />
          <p style={styles.hint}>
            The AI is instructed to use ONLY this material. It will not invent KUA-specific
            facts. If the material is too thin, the questions will be sparse — feed it a
            substantial paragraph or two of real content for best results.
          </p>
        </div>

        <div style={styles.actions}>
          <button
            type="button"
            onClick={() => generate('draft')}
            disabled={busy || !title.trim() || !sourceMaterial.trim() || overLimit}
            style={styles.draftBtn}
          >
            {busy ? 'Generating…' : 'Generate as draft'}
          </button>
          <button
            type="button"
            onClick={() => generate('published')}
            disabled={busy || !title.trim() || !sourceMaterial.trim() || overLimit}
            style={styles.publishBtn}
          >
            {busy ? 'Generating…' : 'Generate + publish'}
          </button>
        </div>

        {error && <div style={styles.error}>Error: {error}</div>}
      </ModuleSection>

      {draft && (
        <ModuleSection title="Generated lesson">
          <div style={{ marginBottom: 14 }}>
            <Pill kind={draft.status === 'published' ? 'good' : 'warn'}>{draft.status}</Pill>
            <span style={{ marginLeft: 8, fontSize: 12, color: '#94a3b8' }}>
              ID: {draft.id} · share URL: <code style={styles.code}>/lessons/{draft.id}</code>
            </span>
          </div>

          <div style={styles.preview}>
            <h3 style={styles.previewTitle}>{draft.title}</h3>
            <div style={styles.previewBody}>{draft.generatedReading}</div>
            <div style={styles.previewQList}>
              {draft.questions.map((q, i) => (
                <div key={i} style={styles.previewQ}>
                  <div style={styles.previewQHead}>Q{i + 1}. {q.question}</div>
                  <ol style={styles.previewOpts}>
                    {q.options.map((o, j) => (
                      <li key={j} style={{ color: o.correct ? '#86efac' : '#cbd5e1', marginBottom: 4 }}>
                        <strong>{o.text}</strong> — {o.explanation}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.actions}>
            <button type="button" onClick={viewAsStudent} style={styles.publishBtn}>
              Open student view →
            </button>
          </div>
        </ModuleSection>
      )}
    </ModulePage>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <div style={styles.label}>{label}</div>
      {children}
    </div>
  );
}

const styles = {
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 },
  label: { display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, marginBottom: 6 },
  input: { width: '100%', boxSizing: 'border-box', padding: '8px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, color: '#e5e7eb', fontSize: 14, fontFamily: 'inherit' },
  textarea: { width: '100%', boxSizing: 'border-box', padding: 12, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 6, color: '#cbd5e1', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12, lineHeight: 1.6, resize: 'vertical' },
  hint: { fontSize: 12, color: '#64748b', marginTop: 8, lineHeight: 1.6 },
  dropZone: { border: '2px dashed #334155', borderRadius: 10, padding: 20, textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.15s, background 0.15s' },
  dropIcon: { fontSize: 32, marginBottom: 8 },
  dropMain: { fontSize: 14, color: '#cbd5e1' },
  dropSub: { marginTop: 8, fontSize: 12, color: '#94a3b8' },
  uploadError: { marginTop: 10, padding: '8px 12px', background: '#3a0d12', border: '1px solid #7f1d1d', borderRadius: 6, color: '#fca5a5', fontSize: 13 },
  actions: { marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' },
  draftBtn: { padding: '10px 18px', background: 'transparent', border: '1px solid #334155', color: '#cbd5e1', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit' },
  publishBtn: { padding: '10px 18px', background: '#22d3ee', color: '#0b1220', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'inherit' },
  error: { marginTop: 14, padding: '10px 14px', background: '#3a0d12', border: '1px solid #7f1d1d', borderRadius: 6, color: '#fca5a5', fontSize: 13 },

  preview: { padding: 18, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 10 },
  previewTitle: { color: '#e5e7eb', margin: '0 0 12px', fontSize: 18 },
  previewBody: { fontSize: 14, color: '#cbd5e1', lineHeight: 1.7, whiteSpace: 'pre-wrap', marginBottom: 16 },
  previewQList: { display: 'grid', gap: 14 },
  previewQ: { padding: 12, background: '#0f172a', border: '1px solid #1f2937', borderRadius: 8 },
  previewQHead: { fontSize: 14, color: '#e5e7eb', fontWeight: 600, marginBottom: 8 },
  previewOpts: { margin: 0, paddingLeft: 20, fontSize: 13, lineHeight: 1.6 },
  code: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', background: '#0b1220', padding: '2px 6px', borderRadius: 4, color: '#22d3ee' },
};
