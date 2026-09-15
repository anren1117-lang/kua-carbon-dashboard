import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { APCSP_UNITS } from '../data/ap-content/apcsp.js';

// Per-unit printable worksheet. Designed for Ctrl+P → "Save as PDF"
// or direct printing. Layout is plain black-on-white with question
// blocks and writing space; no dashboard chrome on the printed page.
//
// Sections (per unit):
//   1. Header: course, unit, student name + period + date blanks
//   2. Reading checkpoints — one short-answer per subunit (drawn from
//      the subunit's title turned into a prompt)
//   3. Practice problems — the unit's existing practice Qs with
//      space for work + an answer line. Answers hidden (no key on
//      student copy).
//   4. Key vocab — bullet list pulled from keyConcepts
//   5. Footer: page count, source attribution

export default function APCSPWorksheet() {
  const { unitNum } = useParams();
  const unit = useMemo(
    () => APCSP_UNITS.find((u) => String(u.number) === String(unitNum)) || APCSP_UNITS[0],
    [unitNum],
  );

  const cleanTitle = (unit.title || '').replace(/^[^—]+—\s*/, '').trim();

  return (
    <div style={styles.page} className="kua-worksheet-page">
      {/* Screen-only toolbar — hidden when printing */}
      <div className="no-print" style={styles.toolbar}>
        <Link to="/teacher/ap/apcsp" style={styles.toolbarBack}>
          ← Back to APES content
        </Link>
        <button onClick={() => window.print()} style={styles.toolbarPrint}>
          🖨️ Print / Save as PDF
        </button>
      </div>

      <article style={styles.sheet} className="kua-worksheet-sheet">
        <header style={styles.head}>
          <div style={styles.headLine1}>AP Computer Science Principles · Unit {unit.number}</div>
          <h1 style={styles.headTitle}>{cleanTitle} — Worksheet</h1>
          <div style={styles.headMeta}>
            Weight: {unit.weight} · {unit.subunits?.length || 0} subunits
          </div>
          <div style={styles.studentBar}>
            <span>Name: ______________________________</span>
            <span>Period: ______</span>
            <span>Date: ______________</span>
          </div>
        </header>

        {/* Reading checkpoints — one per subunit */}
        {unit.subunits?.length > 0 && (
          <section style={styles.section}>
            <h2 style={styles.h2}>Part A · Reading checkpoints</h2>
            <p style={styles.instructions}>
              Read each subunit in your text or on the dashboard. In two
              or three sentences, explain the main idea in your own words.
            </p>
            <ol style={styles.ol}>
              {unit.subunits.map((s) => (
                <li key={s.code} style={styles.olItem}>
                  <div style={styles.qText}>
                    <strong>{s.code}</strong> · {s.title}
                  </div>
                  <div style={styles.writeLines}>
                    <div style={styles.line} className="kua-worksheet-line" />
                    <div style={styles.line} className="kua-worksheet-line" />
                    <div style={styles.line} className="kua-worksheet-line" />
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Practice problems */}
        {unit.practice?.length > 0 && (
          <section style={styles.section}>
            <h2 style={styles.h2}>Part B · Practice problems</h2>
            <p style={styles.instructions}>
              Show your work. For numeric answers, include units. For
              short-answer items, two to three sentences is plenty.
            </p>
            <ol style={styles.ol}>
              {unit.practice.map((p, i) => (
                <li key={i} style={styles.olItem}>
                  <div style={styles.qText}>{p.q}</div>
                  <div style={styles.workBox} className="kua-worksheet-workbox">Work:</div>
                  <div style={styles.answerLine}>
                    <span style={styles.answerLabel}>Answer:</span>
                    <span style={styles.answerSpace} />
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Key vocabulary */}
        {unit.keyConcepts?.length > 0 && (
          <section style={styles.section}>
            <h2 style={styles.h2}>Part C · Key concepts to know</h2>
            <p style={styles.instructions}>
              For the quiz, you should be able to state each of these
              from memory and give a one-sentence example.
            </p>
            <ul style={styles.ulPlain}>
              {unit.keyConcepts.map((k, i) => (
                <li key={i} style={styles.kcLi}>{k}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Formulas reference */}
        {unit.formulas?.length > 0 && (
          <section style={styles.section}>
            <h2 style={styles.h2}>Part D · Formula reference</h2>
            {unit.formulas.map((f, i) => (
              <div key={i} style={styles.formulaBlock} className="kua-worksheet-formula-block">
                <div style={styles.formulaName}>{f.name}</div>
                <div style={styles.formulaEq}>{f.equation}</div>
                <div style={styles.formulaMeaning}>{f.meaning}</div>
              </div>
            ))}
          </section>
        )}

        <footer style={styles.footer}>
          AP Computer Science Principles · Unit {unit.number} · {cleanTitle} · KUA Carbon Dashboard
        </footer>
      </article>

      <PrintStyles />
    </div>
  );
}

// Embedded print stylesheet — strips the dashboard chrome on print
// and forces black-on-white, sized for US Letter.
function PrintStyles() {
  return (
    <style>{`
      @media print {
        body, html { background: #fff !important; }
        nav, header.app-header, .no-print, [class*="header"], [class*="nav"] { display: none !important; }
        .kua-worksheet-page { background: #fff !important; padding: 0 !important; }
        .kua-worksheet-sheet {
          background: #fff !important;
          color: #000 !important;
          box-shadow: none !important;
          border: none !important;
          max-width: none !important;
          padding: 0.5in 0.6in !important;
          margin: 0 !important;
        }
        .kua-worksheet-sheet h1,
        .kua-worksheet-sheet h2,
        .kua-worksheet-sheet h3,
        .kua-worksheet-sheet p,
        .kua-worksheet-sheet li,
        .kua-worksheet-sheet span,
        .kua-worksheet-sheet div {
          color: #000 !important;
        }
        .kua-worksheet-line {
          border-bottom: 1px solid #000 !important;
        }
        .kua-worksheet-workbox {
          border: 1px solid #000 !important;
          background: #fff !important;
        }
        .kua-worksheet-formula-block {
          background: #fff !important;
          border: 1px solid #000 !important;
        }
        @page { size: letter; margin: 0.5in; }
      }
    `}</style>
  );
}

// All styles for screen view (dark) with className hooks for print
// override above.
const styles = {
  page: {
    background: '#0b1220',
    minHeight: '100vh',
    padding: '20px 16px 40px',
  },
  toolbar: {
    maxWidth: 920,
    margin: '0 auto 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  toolbarBack: {
    padding: '8px 14px',
    background: '#0f172a',
    border: '1px solid #1f2937',
    borderRadius: 6,
    color: '#cbd5e1',
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 600,
  },
  toolbarPrint: {
    padding: '8px 16px',
    background: '#22c55e',
    color: '#052e1a',
    border: 'none',
    borderRadius: 6,
    fontWeight: 700,
    fontSize: 13,
    cursor: 'pointer',
  },
  sheet: {
    maxWidth: 920,
    margin: '0 auto',
    padding: '40px 44px 56px',
    background: '#fff',
    color: '#111827',
    borderRadius: 4,
    boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: 14,
    lineHeight: 1.55,
  },
  // className hook for print override
  // (apply via className="kua-worksheet-sheet" wrap class below)
  head: {
    paddingBottom: 16,
    marginBottom: 20,
    borderBottom: '2px solid #111827',
  },
  headLine1: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#374151',
    marginBottom: 6,
  },
  headTitle: {
    fontSize: 26,
    margin: '0 0 4px',
    fontWeight: 700,
    letterSpacing: '-0.01em',
    lineHeight: 1.2,
  },
  headMeta: { fontSize: 12, color: '#6b7280', marginBottom: 14 },
  studentBar: {
    display: 'flex',
    gap: 24,
    flexWrap: 'wrap',
    fontSize: 13,
    color: '#374151',
    marginTop: 12,
  },
  section: { marginTop: 28, pageBreakInside: 'avoid' },
  h2: {
    fontSize: 17,
    margin: '0 0 6px',
    fontWeight: 700,
    letterSpacing: '-0.005em',
    paddingBottom: 4,
    borderBottom: '1px solid #d1d5db',
  },
  instructions: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#4b5563',
    margin: '6px 0 14px',
  },
  ol: { margin: 0, paddingLeft: 22 },
  olItem: { marginBottom: 18, pageBreakInside: 'avoid' },
  qText: { fontSize: 13.5, marginBottom: 8, lineHeight: 1.5 },
  writeLines: { marginTop: 4 },
  line: {
    borderBottom: '1px solid #374151',
    height: 22,
  },
  workBox: {
    border: '1px solid #374151',
    minHeight: 80,
    padding: '4px 8px',
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: 6,
  },
  answerLine: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 4,
  },
  answerLabel: { fontSize: 13, fontWeight: 600, color: '#111827' },
  answerSpace: {
    flex: 1,
    borderBottom: '1px solid #111827',
    height: 18,
  },
  ulPlain: { margin: 0, paddingLeft: 22 },
  kcLi: { marginBottom: 6, fontSize: 13.5 },
  formulaBlock: {
    border: '1px solid #d1d5db',
    borderLeft: '4px solid #374151',
    padding: '10px 14px',
    marginBottom: 10,
    background: '#f9fafb',
  },
  formulaName: { fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 4 },
  formulaEq: { fontFamily: 'Consolas, Menlo, monospace', fontSize: 14, fontWeight: 700, marginBottom: 4 },
  formulaMeaning: { fontSize: 12.5, color: '#374151', lineHeight: 1.55 },
  footer: {
    marginTop: 32,
    paddingTop: 12,
    borderTop: '1px solid #d1d5db',
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'center',
  },
};
