import React, { useEffect, useState, useCallback } from 'react';
import { ModulePage, ModuleSection, Pill } from '../components/ModuleShell.js';

// What's happening in the world — public environmental-news feed.
// Visitors landing on the dashboard can see live environmental news
// without leaving the site. Backed by /api/environment-news (Anthropic +
// web_search), cached server-side for 6h and client-side for one
// session so the page paints instantly after the first call.

const STORAGE_KEY = 'kua_env_news_cache_v1';
const CLIENT_TTL_MS = 24 * 60 * 60 * 1000; // 24h — matches server cache

const TOPIC_STYLE = {
  climate:      { color: '#fbbf24', label: 'Climate' },
  energy:       { color: '#a5b4fc', label: 'Energy' },
  biodiversity: { color: '#86efac', label: 'Biodiversity' },
  pollution:    { color: '#fca5a5', label: 'Pollution' },
  policy:       { color: '#7dd3fc', label: 'Policy' },
  oceans:       { color: '#67e8f9', label: 'Oceans' },
  land:         { color: '#fdba74', label: 'Land use' },
  agriculture:  { color: '#bef264', label: 'Agriculture' },
};

function readClientCache() {
  if (typeof sessionStorage === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.generatedAt) return null;
    if (Date.now() - new Date(parsed.generatedAt).getTime() > CLIENT_TTL_MS) return null;
    return parsed;
  } catch { return null; }
}
function writeClientCache(payload) {
  if (typeof sessionStorage === 'undefined') return;
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); } catch {}
}

function relativeTime(iso) {
  if (!iso) return '';
  const ms = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(ms) || ms < 0) return '';
  const m = Math.floor(ms / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function hostnameFromUrl(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); }
  catch { return ''; }
}

export default function EnvironmentNews() {
  const [data, setData] = useState(() => readClientCache());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async ({ force = false } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`/api/environment-news${force ? '?force=true' : ''}`);
      const body = await r.json().catch(() => ({}));
      if (!r.ok) {
        const msg = body.error === 'not_configured'
          ? 'The news feed isn\'t configured on this deploy yet — an admin needs to set ANTHROPIC_API_KEY.'
          : body.error === 'rate_limited'
            ? 'Too many requests in the last minute — try again shortly.'
            : `Could not load the feed (${body.error || `HTTP ${r.status}`}).`;
        setError(msg);
      } else {
        setData(body);
        writeClientCache(body);
      }
    } catch (err) {
      setError(err?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }, []);

  // On first mount, fetch only if we don't already have a fresh session
  // cache. Subsequent navigations within the session pop from cache
  // instantly.
  useEffect(() => {
    if (!data) load({ force: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items = data?.items || [];

  return (
    <ModulePage
      title="What's happening in the world"
      subtitle="Live environmental news — climate, energy, biodiversity, pollution, policy. Updates from the last few weeks, summarized for KUA students."
      toolbar={
        <div style={toolbarStyles.row}>
          {data?.generatedAt && (
            <span style={toolbarStyles.meta}>
              Updated {relativeTime(data.generatedAt)}
              {data.fromCache && <span style={toolbarStyles.cached}> · cached</span>}
            </span>
          )}
          <button
            type="button"
            onClick={() => load({ force: true })}
            disabled={loading}
            style={toolbarStyles.refreshBtn}
          >
            {loading ? 'Refreshing…' : '↻ Refresh'}
          </button>
        </div>
      }
    >
      <ModuleSection title="Latest stories" hint="Compiled by an AI curator from current reporting — every card links out to the original source.">
        {error && (
          <div role="alert" style={styles.error}>{error}</div>
        )}

        {!data && loading && (
          <div style={styles.loading}>Pulling the latest from the web…</div>
        )}

        {data && items.length === 0 && (
          <div style={styles.empty}>No items returned. Try refreshing.</div>
        )}

        <div style={styles.grid}>
          {items.map((item, i) => {
            const topic = TOPIC_STYLE[item.topic] || TOPIC_STYLE.climate;
            const host = hostnameFromUrl(item.sourceUrl);
            return (
              <article key={i} style={styles.card}>
                <div style={styles.cardHead}>
                  <Pill kind="neutral">
                    <span style={{ color: topic.color, fontWeight: 700 }}>{topic.label}</span>
                  </Pill>
                  {item.dateApprox && (
                    <span style={styles.dateApprox}>{item.dateApprox}</span>
                  )}
                </div>
                <h3 style={styles.headline}>{item.headline}</h3>
                <p style={styles.summary}>{item.summary}</p>
                {item.studentConnection && (
                  <div style={styles.connection}>
                    <div style={styles.connectionLabel}>What this means for you</div>
                    <p style={styles.connectionText}>{item.studentConnection}</p>
                  </div>
                )}
                <div style={styles.cardFoot}>
                  <span style={styles.sourceLabel}>Source:</span>
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.sourceLink}
                  >
                    {item.sourceName}{host ? ` · ${host}` : ''} ↗
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        <p style={styles.disclaimer}>
          Stories above are surfaced by an AI assistant using live web search.
          Headlines and summaries are written for a student audience; always
          click through to the original source for the full context.
        </p>
      </ModuleSection>
    </ModulePage>
  );
}

const toolbarStyles = {
  row:        { display: 'flex', alignItems: 'center', gap: 12 },
  meta:       { fontSize: 12, color: '#94a3b8' },
  cached:     { color: '#64748b' },
  refreshBtn: {
    padding: '6px 12px',
    background: '#0f172a',
    color: '#22d3ee',
    border: '1px solid #22d3ee',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
};

const styles = {
  error: {
    marginBottom: 16,
    padding: '10px 14px',
    background: '#3a0d12',
    border: '1px solid #7f1d1d',
    borderRadius: 6,
    color: '#fca5a5',
    fontSize: 13,
  },
  loading: {
    padding: '40px 20px',
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 14,
  },
  empty: {
    padding: '20px',
    color: '#94a3b8',
    fontSize: 13,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: 14,
    marginTop: 4,
  },
  card: {
    padding: '16px 18px',
    background: '#0f172a',
    border: '1px solid #1f2937',
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  cardHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  dateApprox: {
    fontSize: 11,
    color: '#64748b',
    fontVariantNumeric: 'tabular-nums',
  },
  headline: {
    margin: 0,
    fontSize: 16,
    fontWeight: 700,
    color: '#e5e7eb',
    lineHeight: 1.35,
  },
  summary: {
    margin: 0,
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 1.55,
  },
  connection: {
    marginTop: 4,
    padding: '10px 12px',
    background: '#052e16',
    border: '1px solid #14532d',
    borderLeft: '3px solid #86efac',
    borderRadius: 6,
  },
  connectionLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: '#86efac',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: 4,
  },
  connectionText: {
    margin: 0,
    fontSize: 13,
    color: '#dcfce7',
    lineHeight: 1.55,
  },
  cardFoot: {
    marginTop: 'auto',
    paddingTop: 8,
    borderTop: '1px solid #1f2937',
    display: 'flex',
    alignItems: 'baseline',
    gap: 6,
  },
  sourceLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sourceLink: {
    fontSize: 12,
    color: '#22d3ee',
    textDecoration: 'none',
    fontWeight: 600,
  },
  disclaimer: {
    marginTop: 20,
    fontSize: 11,
    color: '#64748b',
    lineHeight: 1.6,
  },
};
