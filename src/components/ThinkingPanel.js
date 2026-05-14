// Phase 168: collapsible panel exposing the model's extended-thinking
// trace so the admin can read HOW the agent reasoned before drafting.
// Useful for board presentations ("here's what the AI weighed") and
// for spotting hallucinated reasoning ("agent claimed Densmore is 80K
// sqft but it's 9K").
//
// Used wherever a streaming endpoint surfaces a `thinking` string in
// its done payload — plan, plan-narrative, plan-item-memo, ai-ingestion.

import React, { useState } from 'react';

export function ThinkingPanel({ thinking }) {
  const [open, setOpen] = useState(false);
  if (!thinking || thinking.length === 0) return null;
  const chars = thinking.length;
  return (
    <div style={thinkingStyles.wrap}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={thinkingStyles.toggle}
      >
        <span>{open ? '▼' : '▶'}</span>
        <span style={thinkingStyles.label}>🧠 Agent's reasoning</span>
        <span style={thinkingStyles.meta}>{chars >= 1000 ? `${(chars / 1000).toFixed(1)}K` : chars} chars</span>
      </button>
      {open && (
        <div style={thinkingStyles.body}>
          {thinking}
        </div>
      )}
    </div>
  );
}

const thinkingStyles = {
  wrap: { marginBottom: 16, background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8 },
  toggle: { display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '10px 14px', background: 'transparent', color: '#a5b4fc', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' },
  label: { textTransform: 'uppercase', letterSpacing: 0.6, flex: 1 },
  meta: { color: '#64748b', fontWeight: 600, fontVariantNumeric: 'tabular-nums' },
  body: { padding: '0 14px 14px', fontSize: 12, lineHeight: 1.6, color: '#cbd5e1', whiteSpace: 'pre-wrap', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', maxHeight: 400, overflowY: 'auto' },
};
