import React, { useState, useRef, useEffect } from 'react';

const SUGGESTIONS = [
  'What is the greenhouse effect, in plain English?',
  'Why is aviation worse than just the fuel it burns?',
  'How does KUA\'s footprint compare to a typical US household?',
  'What\'s a heat pump and why does it reduce emissions?',
  'How do trees actually absorb CO₂?',
  'What\'s the difference between carbon offsets and on-campus sinks?',
  'What are the biggest things a student can do to reduce their footprint?',
  'How does the New England grid compare to other US regions?',
];

const styles = {
  wrap: { maxWidth: 880, margin: '0 auto', padding: '0 16px' },
  card: { background: 'linear-gradient(160deg, #0f172a 0%, #0b1220 100%)', border: '1px solid #1f2937', borderRadius: 16, padding: '28px 32px', borderLeft: '3px solid #06b6d4' },
  head: { marginBottom: 18 },
  badge: { fontSize: 11, padding: '4px 10px', borderRadius: 4, background: '#155e75', color: '#a5f3fc', textTransform: 'uppercase', letterSpacing: 1.4, fontWeight: 700, border: '1px solid #0e7490', display: 'inline-block' },
  title: { fontSize: 24, fontWeight: 700, color: '#e5e7eb', marginTop: 12 },
  subtitle: { fontSize: 15, color: '#94a3b8', marginTop: 8, lineHeight: 1.6 },
  empty: { padding: '40px 0' },
  emptyHead: { fontSize: 14, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 14 },
  suggestions: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 8 },
  suggestion: { padding: '12px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8, color: '#cbd5e1', fontSize: 14, cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.15s, background 0.15s' },
  thread: { display: 'grid', gap: 14, marginBottom: 16, maxHeight: 600, overflowY: 'auto', paddingRight: 4 },
  msgUser: { alignSelf: 'end', maxWidth: '85%', padding: '10px 14px', background: '#1e3a8a', color: '#dbeafe', borderRadius: '12px 12px 2px 12px', fontSize: 15, lineHeight: 1.6, whiteSpace: 'pre-wrap' },
  msgAssistant: { maxWidth: '95%', padding: '14px 18px', background: '#0b1220', border: '1px solid #1f2937', borderLeft: '3px solid #06b6d4', borderRadius: '12px 12px 12px 2px', color: '#e5e7eb', fontSize: 15, lineHeight: 1.7 },
  searchedRow: { marginTop: 10, paddingTop: 10, borderTop: '1px solid #1f2937', fontSize: 12, color: '#94a3b8' },
  searchedLabel: { color: '#22d3ee', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6, fontSize: 10, marginRight: 6 },
  citationsRow: { marginTop: 10, fontSize: 12 },
  citationLink: { color: '#22d3ee', textDecoration: 'none', display: 'block', marginTop: 4, wordBreak: 'break-word' },
  thinking: { padding: '14px 18px', background: '#0b1220', border: '1px solid #1f2937', borderLeft: '3px solid #06b6d4', borderRadius: '12px 12px 12px 2px', color: '#64748b', fontSize: 14, fontStyle: 'italic' },
  inputRow: { display: 'flex', gap: 8, marginTop: 8 },
  input: { flex: 1, padding: '12px 14px', background: '#0b1220', border: '1px solid #334155', borderRadius: 8, color: '#e5e7eb', fontSize: 15, fontFamily: 'inherit', resize: 'none', minHeight: 48 },
  send: { padding: '0 22px', background: '#06b6d4', color: '#0b1220', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' },
  sendDisabled: { padding: '0 22px', background: '#1e293b', color: '#475569', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'not-allowed' },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, fontSize: 12, color: '#64748b' },
  reset: { background: 'transparent', border: '1px solid #334155', color: '#cbd5e1', padding: '4px 10px', borderRadius: 6, fontSize: 12, cursor: 'pointer' },
  error: { padding: '12px 14px', background: '#3a0d0d', border: '1px solid #7f1d1d', borderRadius: 8, color: '#fca5a5', fontSize: 14, lineHeight: 1.6, marginTop: 12 },
  setupBox: { padding: '20px 22px', background: '#3a2a0d', border: '1px solid #92400e', borderRadius: 10, color: '#fbbf24', fontSize: 14, lineHeight: 1.7 },
  code: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', background: '#0b1220', padding: '2px 6px', borderRadius: 4, color: '#cbd5e1', fontSize: 13 },
};

// Tiny markdown-ish renderer: bold, code, paragraphs, lists.
// Avoid bringing in a full markdown lib for this small surface area.
function Markdown({ text }) {
  const lines = text.split('\n');
  const out = [];
  let listBuf = null;
  const flushList = () => {
    if (listBuf) {
      out.push(<ul key={'ul-' + out.length} style={{ paddingLeft: 22, margin: '8px 0' }}>{listBuf}</ul>);
      listBuf = null;
    }
  };
  const fmt = (s) =>
    s
      .split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
      .filter(Boolean)
      .map((tok, j) => {
        if (tok.startsWith('**') && tok.endsWith('**')) return <strong key={j}>{tok.slice(2, -2)}</strong>;
        if (tok.startsWith('`') && tok.endsWith('`')) return <code key={j} style={styles.code}>{tok.slice(1, -1)}</code>;
        return <React.Fragment key={j}>{tok}</React.Fragment>;
      });
  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (/^[-*]\s/.test(trimmed)) {
      if (!listBuf) listBuf = [];
      listBuf.push(<li key={i}>{fmt(trimmed.replace(/^[-*]\s/, ''))}</li>);
    } else if (/^#+\s/.test(trimmed)) {
      flushList();
      const level = (trimmed.match(/^#+/) || [''])[0].length;
      const Tag = level === 1 ? 'h3' : level === 2 ? 'h4' : 'h5';
      out.push(<Tag key={i} style={{ margin: '10px 0 4px', fontSize: level === 1 ? 17 : 15, color: '#e5e7eb' }}>{fmt(trimmed.replace(/^#+\s/, ''))}</Tag>);
    } else if (trimmed === '') {
      flushList();
      out.push(<div key={i} style={{ height: 6 }} />);
    } else {
      flushList();
      out.push(<p key={i} style={{ margin: '0 0 6px' }}>{fmt(trimmed)}</p>);
    }
  });
  flushList();
  return <>{out}</>;
}

export function EnvironmentalAgent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const threadRef = useRef(null);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const userMsg = { role: 'user', content };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 503) {
          setError({ kind: 'setup', message: data.help || 'API key not configured.' });
        } else {
          setError({ kind: 'api', message: data.details ? JSON.stringify(data.details).slice(0, 200) : data.error || `HTTP ${res.status}` });
        }
        setLoading(false);
        return;
      }

      setMessages([
        ...next,
        {
          role: 'assistant',
          content: data.content,
          citations: data.citations || [],
          searchedTopics: data.searchedTopics || [],
        },
      ]);
    } catch (err) {
      setError({ kind: 'network', message: err.message });
    }
    setLoading(false);
  };

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const reset = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div style={styles.wrap}>
      <section style={styles.card}>
        <div style={styles.head}>
          <span style={styles.badge}>AI environmental assistant</span>
          <h2 style={styles.title}>Ask anything about climate, environment, or sustainability</h2>
          <p style={styles.subtitle}>
            Free-form environmental Q&amp;A. Searches the web for current data, knows KUA's
            specific numbers, and stays strictly on environmental topics — off-topic questions
            get politely redirected.
          </p>
        </div>

        {error?.kind === 'setup' && (
          <div style={styles.setupBox}>
            <strong style={{ color: '#fbbf24' }}>Setup needed.</strong>
            <p style={{ marginTop: 8, marginBottom: 0 }}>
              The assistant needs an Anthropic API key to run. In the Vercel dashboard:
            </p>
            <ol style={{ paddingLeft: 22, marginTop: 8 }}>
              <li>Open the <code style={styles.code}>kua-carbon-dashboard</code> project</li>
              <li>Settings → Environment Variables</li>
              <li>Add <code style={styles.code}>ANTHROPIC_API_KEY</code> (get one at <code style={styles.code}>console.anthropic.com</code>)</li>
              <li>Redeploy</li>
            </ol>
          </div>
        )}

        {messages.length > 0 || loading ? (
          <div ref={threadRef} style={styles.thread}>
            {messages.map((m, i) => (
              <div key={i} style={m.role === 'user' ? styles.msgUser : styles.msgAssistant}>
                {m.role === 'assistant' ? <Markdown text={m.content} /> : m.content}
                {m.role === 'assistant' && m.searchedTopics && m.searchedTopics.length > 0 && (
                  <div style={styles.searchedRow}>
                    <span style={styles.searchedLabel}>Searched the web for</span>
                    {m.searchedTopics.map((q, j) => (
                      <span key={j}>{j > 0 ? ' · ' : ''}<em>{q}</em></span>
                    ))}
                  </div>
                )}
                {m.role === 'assistant' && m.citations && m.citations.length > 0 && (
                  <div style={styles.citationsRow}>
                    <span style={styles.searchedLabel}>Sources</span>
                    {m.citations.slice(0, 5).map((c, j) => (
                      <a key={j} href={c.url} target="_blank" rel="noopener noreferrer" style={styles.citationLink}>
                        [{j + 1}] {c.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && <div style={styles.thinking}>Thinking{messages.length > 0 ? ' (may search the web)' : ''}…</div>}
          </div>
        ) : (
          <div style={styles.empty}>
            <div style={styles.emptyHead}>Try one of these</div>
            <div style={styles.suggestions}>
              {SUGGESTIONS.map((q) => (
                <button key={q} type="button" style={styles.suggestion} onClick={() => send(q)}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && error.kind !== 'setup' && (
          <div style={styles.error}>
            <strong>Couldn't reach the assistant.</strong> {error.message}
          </div>
        )}

        <div style={styles.inputRow}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder="Ask anything — about KUA, your own footprint, the global picture…"
            style={styles.input}
            rows={1}
            disabled={loading}
          />
          <button
            type="button"
            style={loading || !input.trim() ? styles.sendDisabled : styles.send}
            onClick={() => send()}
            disabled={loading || !input.trim()}
          >
            Send
          </button>
        </div>

        <div style={styles.toolbar}>
          <span>{messages.length === 0 ? 'No conversation yet' : `${messages.length} message${messages.length === 1 ? '' : 's'}`}</span>
          {messages.length > 0 && (
            <button type="button" style={styles.reset} onClick={reset}>Clear conversation</button>
          )}
        </div>
      </section>
    </div>
  );
}
