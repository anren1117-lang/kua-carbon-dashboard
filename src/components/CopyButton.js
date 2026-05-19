import React, { useState } from 'react';
import { Icon } from './Icon.js';
import { toast } from './Toast.js';

// Small reusable "copy to clipboard" button. Three places already
// use this pattern (Pledge / Share QR / BuildingDetail share); this
// factors out the navigator.clipboard call + "Copied!" feedback
// so the look stays consistent.
//
// Props:
//   text        — the string to copy
//   label       — button label before copy ("Copy share text")
//   copiedLabel — button label after copy ("✓ Copied!")
//   title       — hover tooltip
//   style       — additional inline style merged on top of defaults
//   icon        — optional override of the leading icon (default: Icon.Share)
//
// Behavior: after click, shows the copied label for 2.2s, then
// reverts. Disabled state visually distinct.

export function CopyButton({
  text,
  label = 'Copy',
  copiedLabel = '✓ Copied!',
  title,
  style,
  icon,
  disabled,
}) {
  const [copied, setCopied] = useState(false);
  const IconComp = icon || Icon.Share;

  function onClick() {
    if (disabled || !text) return;
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
      // Also fire a global toast so the feedback is visible even
      // if the user's eye is elsewhere on the page.
      toast('Copied to clipboard', { kind: 'good' });
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        ...baseStyle,
        ...(copied ? copiedStyle : {}),
        ...(disabled ? disabledStyle : {}),
        ...(style || {}),
      }}
    >
      <IconComp size={12} />
      <span style={{ marginLeft: 6 }}>{copied ? copiedLabel : label}</span>
    </button>
  );
}

const baseStyle = {
  padding: '8px 14px',
  background: '#0b1220',
  color: '#22d3ee',
  border: '1px solid #1f2937',
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
  display: 'inline-flex',
  alignItems: 'center',
  transition: 'background 160ms ease, color 160ms ease, border-color 160ms ease',
};

const copiedStyle = {
  background: '#052e16',
  color: '#86efac',
  borderColor: '#16a34a',
};

const disabledStyle = {
  opacity: 0.5,
  cursor: 'not-allowed',
};
