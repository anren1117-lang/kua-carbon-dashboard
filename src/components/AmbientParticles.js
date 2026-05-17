import React, { useMemo } from 'react';

// Subtle ambient particles that drift upward behind the homepage
// hero. Read as carbon molecules rising / leaves floating — organic
// motion that suits a sustainability dashboard. Pure SVG + CSS
// animation; no JS frame loop.
//
// Each particle's position, size, drift duration, and delay are
// randomized once at mount so the pattern doesn't repeat. The whole
// thing sits behind the hero content with pointer-events: none so
// it never interferes with clicks.
//
// Respects prefers-reduced-motion via the App.css class media query
// (the .kua-particle keyframe is disabled when the user opts out).

const PARTICLE_COUNT = 14;

function randomBetween(a, b) { return a + Math.random() * (b - a); }

function makeParticle(idx) {
  // Spread starting positions across the width; vary size + travel
  // time so the cluster doesn't look mechanically uniform.
  return {
    id: idx,
    leftPct: randomBetween(2, 98),
    size: randomBetween(4, 12),
    duration: randomBetween(14, 26), // seconds for one full rise
    delay: randomBetween(-26, 0),    // negative so animation starts mid-cycle on mount
    drift: randomBetween(-30, 30),   // horizontal sway in px
    opacity: randomBetween(0.08, 0.22),
    hue: Math.random() > 0.5 ? 'cyan' : 'green',
  };
}

export function AmbientParticles() {
  const particles = useMemo(
    () => Array.from({ length: PARTICLE_COUNT }, (_, i) => makeParticle(i)),
    [],
  );
  return (
    <div style={styles.wrap} aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="kua-particle"
          style={{
            left: `${p.leftPct}%`,
            width: p.size,
            height: p.size,
            background: p.hue === 'cyan' ? '#22d3ee' : '#86efac',
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            // CSS reads this custom prop to add horizontal sway
            '--kua-particle-drift': `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

const styles = {
  wrap: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: 0,
    borderRadius: 16,
  },
};
