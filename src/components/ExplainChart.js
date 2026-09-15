import React, { useState } from 'react';

// "Explain this chart with AI" — a small, drop-in control that sits under
// any chart. Click it and it POSTs the chart's title + data to
// /api/explain-chart (OpenAI / ChatGPT) and renders a short plain-English
// caption a teacher can read aloud or paste onto a slide.
//
// Usage:
//   <ExplainChart chart={{
//     title: 'KUA emissions by scope',
//     summary: 'Gross annual emissions split into Scope 1/2/3',
//     unit: 'mtCO₂e',
//     series: [{ label: 'Scope 1', value: 1350 }, ...],
//   }} />
//
// The `chart` prop is passed straight through to the endpoint, which
// accepts `series` (categorical) and/or `points` (time series). Keep the
// title/summary human-readable — the model uses them verbatim.

export function ExplainChart({ chart, label = 'Explain this chart with AI', compact = false }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [error, setError] = useState(null);

  const run = async () => {
    setOpen(true);
    setLoading(true);
    setError(null);
    setText('');
    try {
      const res = await fetch('/api/explain-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chart }),
      });
      // Local dev without `vercel dev`: the SPA rewrite serves index.html
      // for /api/* with HTTP 200, so res.ok is true but the body is HTML.
      // Catch that here instead of falling through to a misleading
      // "No explanation returned."
      if (!res.headers.get('content-type')?.includes('application/json')) {
        setError({ kind: 'setup', message: 'The AI endpoint isn’t running here. Run `vercel dev` locally, or use the deployed site.' });
        setLoading(false);
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 503) {
          setError({ kind: 'setup', message: data.help || 'AI not configured.' });
        } else if (res.status === 429) {
          const secs = Math.ceil((data.retryAfterMs || 0) / 1000);
          setError({ kind: 'rate', message: `Too many requests — try again in ${secs || 'a few'} seconds.` });
        } else {
          setError({ kind: 'api', message: data.details ? JSON.stringify(data.details).slice(0, 200) : data.error || `HTTP ${res.status}` });
        }
        setLoading(false);
        return;
      }
      setText(data.content || 'No explanation returned.');
    } catch (err) {
      setError({ kind: 'network', message: err.message });
    }
    setLoading(false);
  };

  return (
    <div style={styles.wrap} className="no-print">
      <div style={styles.controls}>
        <button
          type="button"
          onClick={run}
          disabled={loading}
          style={{ ...styles.btn, ...(compact ? styles.btnCompact : null), ...(loading ? styles.btnLoading : null) }}
        >
          {loading ? 'Reading the data…' : (open && text ? 'Regenerate' : label)}
        </button>
        {open && !loading && (
          <button type="button" onClick={() => setOpen(false)} style={styles.dismiss} aria-label="Hide explanation">
            Hide
          </button>
        )}
      </div>

      {open && (
        <div style={styles.panel} role="region" aria-label="AI explanation of this chart" aria-live="polite">
          {loading && (
            <div style={styles.loadingRow}>
              <span style={styles.dot} className="kua-pulse" />
              <span style={styles.loadingText}>Asking ChatGPT to read the chart…</span>
            </div>
          )}

          {error?.kind === 'setup' && (
            <div style={styles.setupBox}>
              <strong style={{ color: '#fbbf24' }}>AI explanation isn't set up yet.</strong>
              <div style={styles.setupHelp}>{error.message}</div>
            </div>
          )}
          {error && error.kind !== 'setup' && (
            <div style={styles.errorBox}>
              {error.kind === 'rate' ? error.message
                : error.kind === 'network' ? `Network error: ${error.message}`
                : `Couldn't generate an explanation: ${error.message}`}
            </div>
          )}

          {!loading && !error && text && (
            <>
              <div style={styles.badgeRow}>
                <span style={styles.badge}>AI-generated · ChatGPT</span>
                <span style={styles.disclaimer}>Read before sharing — AI can misread data.</span>
              </div>
              <div style={styles.body}>{renderLight(text)}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Minimal renderer for the model's plain-text + **bold** + "- " bullets.
// Deliberately tiny — no markdown dependency in this codebase. Splits on
// blank lines into paragraphs; consecutive "- " lines become a <ul>.
function renderLight(text) {
  const blocks = text.split(/\n{2,}/);
  const out = [];
  blocks.forEach((block, bi) => {
    const lines = block.split('\n');
    const isList = lines.every((l) => /^\s*[-•]\s+/.test(l));
    if (isList) {
      out.push(
        <ul key={`ul-${bi}`} style={styles.ul}>
          {lines.map((l, li) => (
            <li key={li} style={styles.li}>{renderInline(l.replace(/^\s*[-•]\s+/, ''))}</li>
          ))}
        </ul>
      );
    } else {
      out.push(<p key={`p-${bi}`} style={styles.p}>{renderInline(block.replace(/\n/g, ' '))}</p>);
    }
  });
  return out;
}

// Inline **bold** → <strong>. Splits on the bold delimiter and toggles.
function renderInline(s) {
  const parts = s.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const m = /^\*\*([^*]+)\*\*$/.exec(part);
    if (m) return <strong key={i} style={styles.strong}>{m[1]}</strong>;
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

const styles = {
  wrap: { marginTop: 12 },
  controls: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    padding: '9px 15px',
    // Flat, calm control in the dashboard palette — cyan-accented ghost
    // button rather than a branded gradient. Provider attribution lives
    // in the panel's text badge, not the chrome.
    background: '#0b1220',
    color: '#67e8f9',
    border: '1px solid #155e6b',
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 13,
    cursor: 'pointer',
    letterSpacing: '-0.005em',
  },
  btnCompact: { padding: '7px 12px', fontSize: 12 },
  btnLoading: { opacity: 0.7, cursor: 'wait' },
  dismiss: {
    padding: '8px 12px',
    background: 'transparent',
    color: '#94a3b8',
    border: '1px solid #1f2937',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
  panel: {
    marginTop: 10,
    padding: '14px 16px',
    background: '#0b1220',
    border: '1px solid #1f2937',
    borderRadius: 10,
    borderLeft: '3px solid #22d3ee',
  },
  loadingRow: { display: 'flex', alignItems: 'center', gap: 9 },
  dot: { width: 8, height: 8, borderRadius: 999, background: '#22d3ee', display: 'inline-block' },
  loadingText: { color: '#94a3b8', fontSize: 13 },
  badgeRow: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 },
  badge: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#6ee7c4',
    background: '#052e26',
    border: '1px solid #0d5f4c',
    padding: '3px 8px',
    borderRadius: 999,
  },
  disclaimer: { fontSize: 12, color: '#d97706', fontWeight: 600 },
  body: { color: '#cbd5e1', fontSize: 13.5, lineHeight: 1.65 },
  p: { margin: '0 0 8px' },
  ul: { margin: '0 0 8px', paddingLeft: 20 },
  li: { marginBottom: 4 },
  strong: { color: '#e5e7eb', fontWeight: 700 },
  setupBox: { padding: '10px 12px', background: '#1c1917', border: '1px solid #78350f', borderRadius: 8 },
  setupHelp: { color: '#cbd5e1', fontSize: 12.5, marginTop: 6, lineHeight: 1.5 },
  errorBox: { padding: '10px 12px', background: '#1f1315', border: '1px solid #7f1d1d', borderRadius: 8, color: '#fca5a5', fontSize: 12.5, lineHeight: 1.5 },
};

export default ExplainChart;
