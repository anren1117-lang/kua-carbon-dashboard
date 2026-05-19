import React, { useEffect, useState } from 'react';

// Tiny toast system — singleton subscribe/publish pattern, no
// React Context overhead. Mount <ToastHost /> once at the Layout
// level; call `toast(message, opts)` from anywhere.
//
// Usage:
//   import { toast } from './Toast.js';
//   toast('Pledge saved');
//   toast('Copied to clipboard', { kind: 'good' });
//   toast('Something broke', { kind: 'bad', duration: 5000 });
//
// kinds: 'good' | 'warn' | 'bad' | 'info' (defaults to info)
// duration: ms before auto-dismiss (default 3000)

const subscribers = new Set();
let nextId = 1;

export function toast(message, opts = {}) {
  const entry = {
    id: nextId++,
    message,
    kind: opts.kind || 'info',
    duration: opts.duration || 3000,
    createdAt: Date.now(),
  };
  for (const s of subscribers) s(entry);
  return entry.id;
}

function subscribe(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

const KIND_STYLE = {
  good: { bg: '#052e16', fg: '#86efac', border: '#16a34a', icon: '✓' },
  warn: { bg: '#3a2a0d', fg: '#fcd34d', border: '#92400e', icon: '⚠' },
  bad:  { bg: '#3a0d12', fg: '#fca5a5', border: '#7f1d1d', icon: '✕' },
  info: { bg: '#0c2a3a', fg: '#67e8f9', border: '#0e7490', icon: '•' },
};

export function ToastHost() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    function onToast(t) {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, t.duration);
    }
    return subscribe(onToast);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div style={styles.stack} aria-live="polite" aria-atomic="false">
      {toasts.map((t) => {
        const cfg = KIND_STYLE[t.kind] || KIND_STYLE.info;
        return (
          <div
            key={t.id}
            style={{
              ...styles.toast,
              background: cfg.bg,
              color: cfg.fg,
              borderColor: cfg.border,
            }}
            className="kua-toast-enter"
          >
            <span style={styles.icon} aria-hidden="true">{cfg.icon}</span>
            <span style={styles.msg}>{t.message}</span>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  stack: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    zIndex: 250,
    display: 'flex',
    flexDirection: 'column-reverse',
    gap: 8,
    pointerEvents: 'none',
  },
  toast: {
    padding: '12px 16px',
    borderRadius: 8,
    border: '1px solid',
    boxShadow: '0 8px 24px -4px rgba(0,0,0,0.5)',
    fontSize: 14,
    fontWeight: 600,
    minWidth: 220,
    maxWidth: 360,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    pointerEvents: 'auto',
  },
  icon: { fontSize: 16, flexShrink: 0 },
  msg: { lineHeight: 1.4 },
};
