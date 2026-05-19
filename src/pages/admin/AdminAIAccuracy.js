import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// /admin/ai-accuracy — Priority 4 of the capstone plan.
//
// Renders the headline accuracy + per-field breakdown from
// docs/ai-ingestion-benchmark-results.json — the file written by
// scripts/runAiBenchmark.mjs. The runner is responsible for copying
// the JSON to src/public/ai-ingestion-benchmark-results.json so this
// page can fetch it at runtime as a static asset.
//
// Empty state (no benchmark results yet) is shown explicitly with a
// pointer to docs/ai-ingestion-benchmark.md — so a reviewer who
// lands here mid-development knows what's coming and where it'll
// appear.

const RESULTS_PATH = '/ai-ingestion-benchmark-results.json';

export default function AdminAIAccuracy() {
  const [status, setStatus] = useState('loading'); // 'loading' | 'loaded' | 'empty' | 'error'
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(RESULTS_PATH, { cache: 'no-store' });
        if (cancelled) return;
        if (!r.ok) {
          setStatus('empty');
          return;
        }
        const body = await r.json();
        if (cancelled) return;
        setData(body);
        setStatus('loaded');
      } catch (e) {
        if (cancelled) return;
        setErr(e?.message || String(e));
        setStatus('error');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.eyebrow}>Capstone · Research Question 3</div>
        <h1 style={styles.title}>AI ingestion agent accuracy</h1>
        <p style={styles.subtitle}>
          How accurately does the dashboard's document-ingestion agent extract
          structured fields from real KUA source documents? Runs on a hand-tagged
          benchmark dataset; results below are the latest score from{' '}
          <code style={styles.code}>scripts/runAiBenchmark.mjs</code>.
        </p>
      </header>

      {status === 'loading' && (
        <div style={styles.state}>Loading benchmark results…</div>
      )}

      {status === 'empty' && <EmptyState />}

      {status === 'error' && (
        <div style={styles.stateError}>
          Could not load benchmark results: {err}
        </div>
      )}

      {status === 'loaded' && data && <Results data={data} />}

      <FooterContext />
    </div>
  );
}

function EmptyState() {
  return (
    <div style={styles.empty}>
      <div style={styles.emptyIcon} aria-hidden="true">📊</div>
      <h2 style={styles.emptyTitle}>No benchmark results yet</h2>
      <p style={styles.emptyBody}>
        The benchmark scaffold is in place but no cases have been run yet. To
        produce results that will appear here:
      </p>
      <ol style={styles.emptySteps}>
        <li>Collect 5–10 real KUA source documents (heating-oil invoice, dining
          invoice, travel itinerary, waste report, etc.) and strip PII.</li>
        <li>Tag each document in{' '}
          <code style={styles.code}>src/data/aiIngestionBenchmark.js</code>{' '}
          with expected fields + per-field tolerances. See{' '}
          <a href="https://github.com/anren1117-lang/kua-carbon-dashboard/blob/main/docs/ai-ingestion-benchmark.md" target="_blank" rel="noopener noreferrer" style={styles.link}>
            docs/ai-ingestion-benchmark.md →
          </a>
        </li>
        <li>Run <code style={styles.code}>node scripts/runAiBenchmark.mjs</code>.</li>
        <li>The runner writes{' '}
          <code style={styles.code}>docs/ai-ingestion-benchmark-results.json</code>{' '}
          and copies it to{' '}
          <code style={styles.code}>src/public/</code> for this page to read.</li>
        <li>Refresh this page — results appear here automatically.</li>
      </ol>
      <p style={styles.emptyTargets}>
        <strong>Targets (from the capstone proposal):</strong><br />
        Routine fields (date, kWh, gallons, etc.): <strong>≥ 95%</strong> accuracy<br />
        Safety-critical fields (account numbers, units, fuel type): <strong>100%</strong> accuracy
      </p>
    </div>
  );
}

function Results({ data }) {
  const {
    runAt,
    apiBase,
    cases,
    routineFields,
    routineCorrect,
    routineAccuracy,
    safetyCriticalFields,
    safetyCriticalCorrect,
    safetyCriticalAccuracy,
    targets,
    pass,
    caseResults,
  } = data;

  const routinePct = (routineAccuracy * 100).toFixed(1);
  const safetyPct = safetyCriticalAccuracy === null ? null : (safetyCriticalAccuracy * 100).toFixed(1);

  return (
    <>
      <section style={styles.headlineGrid}>
        <Metric
          label="Routine accuracy"
          value={`${routinePct}%`}
          sub={`${routineCorrect} / ${routineFields} fields · target ≥ ${(targets.routine * 100).toFixed(0)}%`}
          good={pass.routine}
        />
        <Metric
          label="Safety-critical accuracy"
          value={safetyPct === null ? '—' : `${safetyPct}%`}
          sub={safetyPct === null
            ? 'No safety-critical fields tagged in benchmark yet'
            : `${safetyCriticalCorrect} / ${safetyCriticalFields} fields · target ${(targets.safetyCritical * 100).toFixed(0)}%`}
          good={pass.safetyCritical}
        />
        <Metric
          label="Cases run"
          value={String(cases)}
          sub={`Last run ${new Date(runAt).toLocaleString()}`}
          neutral
        />
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Per-case breakdown</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Case</th>
              <th style={styles.th}>Doc type</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Fields correct</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Safety-critical</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Accuracy</th>
            </tr>
          </thead>
          <tbody>
            {caseResults.map((r) => {
              if (r.error) {
                return (
                  <tr key={r.id}>
                    <td style={styles.td}><code>{r.id}</code></td>
                    <td style={styles.td}>{r.docType}</td>
                    <td colSpan={3} style={{ ...styles.td, color: '#fca5a5' }}>
                      ERROR — {r.error}
                    </td>
                  </tr>
                );
              }
              const acc = r.overallAccuracy * 100;
              return (
                <tr key={r.id}>
                  <td style={styles.td}><code>{r.id}</code></td>
                  <td style={styles.td}>{r.docType}</td>
                  <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                    {r.correctFields} / {r.totalFields}
                  </td>
                  <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                    {r.safetyCriticalTotal > 0
                      ? `${r.safetyCriticalCorrect} / ${r.safetyCriticalTotal}`
                      : '—'}
                  </td>
                  <td style={{
                    ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums',
                    color: acc >= 95 ? '#86efac' : acc >= 80 ? '#fcd34d' : '#fca5a5',
                    fontWeight: 700,
                  }}>
                    {acc.toFixed(0)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Per-field error breakdown</h2>
        <FieldBreakdown caseResults={caseResults} />
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Worked examples</h2>
        <p style={styles.fineprint}>
          The first three cases below show what the agent extracted vs.
          what the ground-truth tag specified, field-by-field. Use these to
          spot patterns in the agent's failure modes.
        </p>
        <WorkedExamples caseResults={caseResults.slice(0, 3)} />
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Run metadata</h2>
        <dl style={styles.metaList}>
          <dt style={styles.metaKey}>API base</dt>
          <dd style={styles.metaVal}><code>{apiBase}</code></dd>
          <dt style={styles.metaKey}>Run at</dt>
          <dd style={styles.metaVal}>{new Date(runAt).toISOString()}</dd>
          <dt style={styles.metaKey}>Routine target</dt>
          <dd style={styles.metaVal}>{(targets.routine * 100).toFixed(0)}%</dd>
          <dt style={styles.metaKey}>Safety-critical target</dt>
          <dd style={styles.metaVal}>{(targets.safetyCritical * 100).toFixed(0)}%</dd>
        </dl>
      </section>
    </>
  );
}

function Metric({ label, value, sub, good, neutral }) {
  const color = neutral ? '#22d3ee' : good ? '#86efac' : '#fca5a5';
  return (
    <div style={styles.metricCard}>
      <div style={styles.metricLabel}>{label}</div>
      <div style={{ ...styles.metricValue, color }}>{value}</div>
      <div style={styles.metricSub}>{sub}</div>
    </div>
  );
}

function FieldBreakdown({ caseResults }) {
  // Aggregate per-field-key correctness across all cases
  const byField = new Map();
  for (const c of caseResults) {
    if (!Array.isArray(c.perRow)) continue;
    for (const row of c.perRow) {
      for (const f of row.fields) {
        const e = byField.get(f.key) || { key: f.key, total: 0, correct: 0, safetyCritical: f.safetyCritical };
        e.total += 1;
        if (f.correct) e.correct += 1;
        if (f.safetyCritical) e.safetyCritical = true;
        byField.set(f.key, e);
      }
    }
  }
  const rows = [...byField.values()].sort((a, b) => (a.correct / a.total) - (b.correct / b.total));
  if (rows.length === 0) return <p style={styles.fineprint}>No fields scored.</p>;
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Field</th>
          <th style={styles.th}>Critical?</th>
          <th style={{ ...styles.th, textAlign: 'right' }}>Correct / total</th>
          <th style={{ ...styles.th, textAlign: 'right' }}>Accuracy</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => {
          const acc = (r.correct / r.total) * 100;
          return (
            <tr key={r.key}>
              <td style={styles.td}><code>{r.key}</code></td>
              <td style={styles.td}>{r.safetyCritical ? '⚠ yes' : '—'}</td>
              <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                {r.correct} / {r.total}
              </td>
              <td style={{
                ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums',
                color: acc >= 95 ? '#86efac' : acc >= 80 ? '#fcd34d' : '#fca5a5',
                fontWeight: 700,
              }}>
                {acc.toFixed(0)}%
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function WorkedExamples({ caseResults }) {
  if (!caseResults || caseResults.length === 0) {
    return <p style={styles.fineprint}>No cases to show.</p>;
  }
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {caseResults.map((r) => {
        if (r.error) return null;
        return (
          <div key={r.id} style={styles.exampleCard}>
            <div style={styles.exampleHead}>
              <code style={styles.exampleId}>{r.id}</code>
              <span style={styles.exampleType}>{r.docType}</span>
              <span style={{
                marginLeft: 'auto',
                fontVariantNumeric: 'tabular-nums',
                color: r.overallAccuracy >= 0.95 ? '#86efac' : r.overallAccuracy >= 0.8 ? '#fcd34d' : '#fca5a5',
                fontWeight: 700,
              }}>
                {(r.overallAccuracy * 100).toFixed(0)}%
              </span>
            </div>
            {(r.perRow || []).map((row, ri) => (
              <table key={ri} style={{ ...styles.table, marginTop: 10 }}>
                <thead>
                  <tr>
                    <th style={styles.th}>Field</th>
                    <th style={styles.th}>Expected</th>
                    <th style={styles.th}>Extracted</th>
                    <th style={{ ...styles.th, width: 60 }}>Match</th>
                  </tr>
                </thead>
                <tbody>
                  {row.fields.map((f) => (
                    <tr key={f.key}>
                      <td style={styles.td}>
                        <code>{f.key}</code>{f.safetyCritical && <span style={{ color: '#fcd34d', marginLeft: 6 }}>⚠</span>}
                      </td>
                      <td style={styles.td}><code style={styles.codeMono}>{String(f.expected)}</code></td>
                      <td style={styles.td}>
                        <code style={styles.codeMono}>
                          {f.extracted === undefined || f.extracted === null
                            ? <span style={{ color: '#64748b' }}>(missing)</span>
                            : String(f.extracted)}
                        </code>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center', color: f.correct ? '#86efac' : '#fca5a5', fontWeight: 700 }}>
                        {f.correct ? '✓' : '✗'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function FooterContext() {
  return (
    <section style={{ ...styles.section, marginTop: 32 }}>
      <h2 style={styles.sectionTitle}>How this page fits the capstone</h2>
      <p style={styles.fineprint}>
        This page is the visible answer to capstone <strong>Research Question 3:
        How accurate is the AI ingestion agent?</strong> The full method, the
        targets, and the protocol for adding new benchmark cases live in{' '}
        <a href="https://github.com/anren1117-lang/kua-carbon-dashboard/blob/main/docs/ai-ingestion-benchmark.md" target="_blank" rel="noopener noreferrer" style={styles.link}>
          docs/ai-ingestion-benchmark.md →
        </a>
        {' '}The paper's discussion of accuracy + calibration draws directly
        from the JSON file rendered above; a faculty reviewer can replicate
        any number on this page by cloning the repo, populating the benchmark
        cases, and running <code style={styles.code}>node scripts/runAiBenchmark.mjs</code>.
      </p>
      <p style={styles.fineprint}>
        Related capstone artifacts: <Link to="/methodology" style={styles.link}>/methodology</Link> for emission factors;{' '}
        <a href="https://github.com/anren1117-lang/kua-carbon-dashboard/blob/main/docs/capstone-results.md" target="_blank" rel="noopener noreferrer" style={styles.link}>
          docs/capstone-results.md
        </a> for Q1, Q2, Q4 results; the{' '}
        <a href="https://github.com/anren1117-lang/kua-carbon-dashboard/blob/main/docs/spot-check-sheet.md" target="_blank" rel="noopener noreferrer" style={styles.link}>
          spot-check sheet
        </a> for faculty verification of Scope 1/2/3 numbers.
      </p>
    </section>
  );
}

const styles = {
  page: { maxWidth: 1100, margin: '0 auto', padding: '0 16px' },
  header: { marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid #1f2937' },
  eyebrow: { fontSize: 11, color: '#22d3ee', letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 800, marginBottom: 8 },
  title: { fontSize: 'clamp(26px, 5vw, 36px)', color: '#e5e7eb', fontWeight: 800, margin: 0, letterSpacing: '-0.015em' },
  subtitle: { fontSize: 15, color: '#94a3b8', margin: '10px 0 0', lineHeight: 1.55, maxWidth: 800 },
  code: { background: '#0b1220', border: '1px solid #1f2937', padding: '1px 6px', borderRadius: 3, fontSize: 12, color: '#86efac', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' },
  codeMono: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12, color: '#cbd5e1' },
  link: { color: '#22d3ee', textDecoration: 'none', fontWeight: 700 },

  state: { padding: '40px 20px', textAlign: 'center', color: '#94a3b8', fontSize: 14 },
  stateError: { padding: '20px', background: '#3a0d12', border: '1px solid #7f1d1d', borderRadius: 8, color: '#fca5a5', marginTop: 20 },

  empty: { marginTop: 24, padding: '32px 28px', background: '#0f172a', border: '1px solid #1f2937', borderRadius: 12 },
  emptyIcon: { fontSize: 36, marginBottom: 14 },
  emptyTitle: { margin: 0, fontSize: 22, color: '#e5e7eb', fontWeight: 700 },
  emptyBody: { fontSize: 14, color: '#cbd5e1', lineHeight: 1.7, marginTop: 12 },
  emptySteps: { paddingLeft: 22, fontSize: 14, color: '#cbd5e1', lineHeight: 1.9, marginTop: 12 },
  emptyTargets: { marginTop: 18, padding: '14px 16px', background: '#0b1220', border: '1px dashed #334155', borderRadius: 8, fontSize: 13, color: '#cbd5e1', lineHeight: 1.7 },

  headlineGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginTop: 24 },
  metricCard: { padding: '18px 22px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 10 },
  metricLabel: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700 },
  metricValue: { fontSize: 38, fontWeight: 800, marginTop: 6, lineHeight: 1, fontVariantNumeric: 'tabular-nums' },
  metricSub: { fontSize: 12, color: '#94a3b8', marginTop: 8, lineHeight: 1.5 },

  section: { marginTop: 28, padding: 'clamp(18px, 3vw, 24px)', background: '#0f172a', border: '1px solid #1f2937', borderRadius: 12 },
  sectionTitle: { margin: 0, marginBottom: 12, fontSize: 18, color: '#e5e7eb', fontWeight: 700 },
  fineprint: { fontSize: 13, color: '#94a3b8', lineHeight: 1.7, margin: '8px 0' },

  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { textAlign: 'left', padding: '8px 10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700, fontSize: 11, borderBottom: '1px solid #1f2937' },
  td: { padding: '10px 10px', color: '#cbd5e1', borderBottom: '1px solid #1f2937', verticalAlign: 'top' },

  exampleCard: { padding: '14px 16px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 },
  exampleHead: { display: 'flex', alignItems: 'center', gap: 12, fontSize: 13 },
  exampleId: { color: '#22d3ee', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontWeight: 700 },
  exampleType: { color: '#94a3b8' },

  metaList: { display: 'grid', gridTemplateColumns: '180px 1fr', gap: '6px 18px', fontSize: 13, color: '#cbd5e1', margin: 0 },
  metaKey: { color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 11, fontWeight: 700 },
  metaVal: { margin: 0 },
};
