import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { NewsCardSkeleton } from './Skeleton.js';

// Homepage strip showing the top 3 current environmental-news
// headlines from /api/environment-news, with a "See all" link to
// /news. The point: visitors landing on / immediately see "here's
// what's happening in the world right now" without having to
// navigate to find it.
//
// Server cache (24h in api/environment-news.js) means this fetch
// costs nothing past the first daily call per warm instance, so
// adding the strip doesn't grow the LLM bill.

const TOPIC_COLOR = {
  climate:      '#fbbf24',
  energy:       '#a5b4fc',
  biodiversity: '#86efac',
  pollution:    '#fca5a5',
  policy:       '#7dd3fc',
  oceans:       '#67e8f9',
  land:         '#fdba74',
  agriculture:  '#bef264',
};

function hostnameFromUrl(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); }
  catch { return ''; }
}

export function NewsStrip() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch('/api/environment-news');
        const body = await r.json().catch(() => ({}));
        if (cancelled) return;
        if (!r.ok) {
          // Quietly hide the strip on error — homepage shouldn't show
          // a noisy "couldn't load news" box if the feed has a
          // transient issue. Admins can debug via /news directly.
          setError(body.error || `HTTP ${r.status}`);
        } else {
          setItems((body.items || []).slice(0, 3));
        }
      } catch (err) {
        if (!cancelled) setError(err?.message || 'fetch failed');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // If the feed is misconfigured or 0 items returned, render nothing
  // rather than a sad-empty-box. The Layout's News portal button
  // still gives visitors a way to reach the full page.
  if (error || (!loading && items.length === 0)) return null;

  return (
    <div style={styles.wrap}>
      <div style={styles.head}>
        <span style={styles.heading}>What's happening in the world</span>
        <Link to="/news" style={styles.seeAll}>See all stories →</Link>
      </div>
      <div style={styles.grid}>
        {loading ? (
          // Three skeleton cards while the feed loads — same shape +
          // padding as the real cards so the layout doesn't jump
          // when content arrives.
          <>
            <NewsCardSkeleton />
            <NewsCardSkeleton />
            <NewsCardSkeleton />
          </>
        ) : items.map((item, i) => {
          const topicColor = TOPIC_COLOR[item.topic] || TOPIC_COLOR.climate;
          const host = hostnameFromUrl(item.sourceUrl);
          return (
            <Link key={i} to="/news" style={styles.card}>
              <div style={{ ...styles.topic, color: topicColor }}>{item.topic}</div>
              <div style={styles.headline}>{item.headline}</div>
              {item.studentConnection && (
                <div style={styles.connection}>{item.studentConnection}</div>
              )}
              <div style={styles.source}>{item.sourceName}{host ? ` · ${host}` : ''}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    maxWidth: 1100,
    margin: '24px auto 0',
    padding: '0 16px',
  },
  head: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  heading: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  seeAll: {
    fontSize: 12,
    color: '#86efac',
    textDecoration: 'none',
    fontWeight: 600,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 12,
  },
  loading: {
    padding: '20px',
    color: '#64748b',
    fontSize: 13,
    gridColumn: '1 / -1',
    textAlign: 'center',
  },
  card: {
    display: 'block',
    padding: '14px 16px',
    background: '#0f172a',
    border: '1px solid #1f2937',
    borderRadius: 10,
    textDecoration: 'none',
    color: 'inherit',
    transition: 'border-color 120ms',
  },
  topic: {
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: 6,
  },
  headline: {
    fontSize: 14,
    fontWeight: 700,
    color: '#e5e7eb',
    lineHeight: 1.4,
    marginBottom: 8,
  },
  connection: {
    fontSize: 12,
    color: '#86efac',
    lineHeight: 1.5,
    marginBottom: 8,
    paddingLeft: 8,
    borderLeft: '2px solid #14532d',
  },
  source: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 6,
  },
};
