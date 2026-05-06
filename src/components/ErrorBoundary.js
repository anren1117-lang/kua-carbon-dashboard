import React from 'react';
import { Link } from 'react-router-dom';

// React error boundary. Catches render errors anywhere below and
// shows a friendly fallback instead of a blank white screen. Without
// this, a single component crash (a stale prop shape, a missing
// data field, a third-party library throwing) takes the whole
// dashboard offline.
//
// Two key behaviors:
//   1. The error is logged to console.error so devs can find it in
//      browser DevTools / Vercel runtime logs without the user
//      having to copy a stack trace.
//   2. A "Reset" button clears the error state — useful when the
//      crash was triggered by transient state (e.g. expired token).

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('Render error caught by ErrorBoundary:', error, info);
    this.setState({ info });
  }

  reset = () => {
    this.setState({ error: null, info: null });
  };

  render() {
    if (!this.state.error) return this.props.children;

    const message = this.state.error?.message || 'Unknown render error';
    const stack = this.state.error?.stack || '';
    const componentStack = this.state.info?.componentStack || '';

    return (
      <div style={styles.shell}>
        <div style={styles.card}>
          <div style={styles.icon} aria-hidden="true">⚠</div>
          <h1 style={styles.title}>Something went wrong rendering this page.</h1>
          <p style={styles.subtitle}>
            The rest of the dashboard is fine — only this view crashed. The error has been
            logged to your browser console. Try reloading, or use the link below to navigate
            elsewhere.
          </p>

          <div style={styles.actions}>
            <button type="button" style={styles.primaryBtn} onClick={() => window.location.reload()}>
              Reload page
            </button>
            <button type="button" style={styles.secondaryBtn} onClick={this.reset}>
              Try again
            </button>
            <Link to="/" style={styles.linkBtn}>Go home</Link>
          </div>

          <details style={styles.details}>
            <summary style={styles.summary}>Technical details</summary>
            <div style={styles.errMsg}>{message}</div>
            {stack && <pre style={styles.pre}>{stack}</pre>}
            {componentStack && (
              <>
                <div style={styles.componentLabel}>Component tree</div>
                <pre style={styles.pre}>{componentStack}</pre>
              </>
            )}
          </details>
        </div>
      </div>
    );
  }
}

const styles = {
  shell: { minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { maxWidth: 640, width: '100%', padding: 32, background: '#0f172a', border: '1px solid #1f2937', borderRadius: 12 },
  icon: { fontSize: 36, marginBottom: 12, color: '#fbbf24' },
  title: { margin: 0, fontSize: 22, color: '#e5e7eb', fontWeight: 700 },
  subtitle: { marginTop: 10, fontSize: 14, color: '#94a3b8', lineHeight: 1.6 },
  actions: { marginTop: 18, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' },
  primaryBtn: { padding: '8px 14px', background: '#22d3ee', color: '#0b1220', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  secondaryBtn: { padding: '8px 14px', background: 'transparent', color: '#cbd5e1', border: '1px solid #334155', borderRadius: 6, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' },
  linkBtn: { padding: '8px 14px', color: '#22d3ee', textDecoration: 'none', fontSize: 13, fontWeight: 700 },
  details: { marginTop: 18, fontSize: 12, color: '#94a3b8' },
  summary: { cursor: 'pointer', color: '#cbd5e1', fontWeight: 600 },
  errMsg: { marginTop: 10, padding: '8px 12px', background: '#3a0d12', border: '1px solid #7f1d1d', borderRadius: 4, color: '#fca5a5', fontFamily: 'ui-monospace, monospace', fontSize: 12 },
  componentLabel: { marginTop: 10, fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 },
  pre: { marginTop: 6, padding: '10px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 4, color: '#cbd5e1', fontFamily: 'ui-monospace, monospace', fontSize: 11, overflow: 'auto', maxHeight: 240 },
};

// Default export so callers can just `import ErrorBoundary from '...';`
export default ErrorBoundary;
