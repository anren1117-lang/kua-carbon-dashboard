import React from 'react';

// Minimal skeleton-shimmer primitive. Used by NewsStrip (and other
// async-loading components) instead of blank-text or a sad "loading…"
// label so the homepage doesn't pop when remote data arrives.
//
// Style: subtle pulse animation, dark-mode tuned colors that match
// the existing palette. The CSS animation is defined inline via a
// <style> tag injected once (no global App.css change required) so
// this stays a self-contained component.

let injected = false;
function ensureKeyframes() {
  if (injected || typeof document === 'undefined') return;
  const css = `
@keyframes kuaSkeletonShimmer {
  0%   { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}
.kua-skeleton {
  animation: kuaSkeletonShimmer 1.4s ease-in-out infinite;
  background: linear-gradient(90deg, #0b1220 0%, #1f2937 50%, #0b1220 100%);
  background-size: 200px 100%;
  border-radius: 4px;
  display: block;
}
`;
  const tag = document.createElement('style');
  tag.dataset.kuaSkeleton = 'true';
  tag.textContent = css;
  document.head.appendChild(tag);
  injected = true;
}

export function Skeleton({ width = '100%', height = 14, style = {} }) {
  ensureKeyframes();
  return (
    <span
      className="kua-skeleton"
      style={{ width, height, ...style }}
      aria-hidden="true"
    />
  );
}

// Convenience: skeleton in the shape of a news card (matches the
// NewsStrip card spacing + line heights so cards don't jump when
// real content arrives).
export function NewsCardSkeleton() {
  ensureKeyframes();
  return (
    <div
      aria-hidden="true"
      style={{
        padding: '14px 16px',
        background: '#0f172a',
        border: '1px solid #1f2937',
        borderRadius: 10,
      }}
    >
      <Skeleton width={70}  height={10} style={{ marginBottom: 8 }} />
      <Skeleton width="92%" height={14} style={{ marginBottom: 6 }} />
      <Skeleton width="78%" height={14} style={{ marginBottom: 10 }} />
      <Skeleton width="60%" height={12} style={{ marginBottom: 6 }} />
      <Skeleton width={100} height={10} />
    </div>
  );
}
