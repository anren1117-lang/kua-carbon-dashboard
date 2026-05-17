import React, { useState, useEffect } from 'react';
import { buildingPositionsPct } from '../data/buildingPositions.js';

// CampusPhotoMap — renders the official KUA campus map image with
// energy-intensity dots overlaid on each building. Each dot's
// position comes from buildingPositionsPct (the (x%, y%) coords
// eyeballed off the same official map), so the dots land on top
// of the building they represent.
//
// The image asset itself is served from /public/kua-campus-map.png
// (Vite copies /src/public/ → site root at build time). If the
// file is missing — i.e. nobody has saved the official map into
// the repo yet — we show a friendly placeholder with instructions
// rather than a broken image.
//
// Why this mode matters: students recognize the official campus
// map from admissions tours + the school's printed materials.
// Overlaying live energy data on a picture they already know is
// far more concrete than an abstract SVG layout — "the dorm with
// the big amber dot on the east side, by the road" lands faster
// than "Kilton Hall, 4,800 kWh/yr."

const ASSET_PATH = '/kua-campus-map.png';

export function CampusPhotoMap({ rows, selectedId, onSelect, intensityColorFor, noDataFill }) {
  const [imgStatus, setImgStatus] = useState('loading'); // 'loading' | 'loaded' | 'missing'

  // Probe the asset before rendering so we can swap to a friendly
  // placeholder if it 404s. Avoids the broken-image icon, which
  // looks like a bug.
  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.onload = () => { if (!cancelled) setImgStatus('loaded'); };
    img.onerror = () => { if (!cancelled) setImgStatus('missing'); };
    img.src = ASSET_PATH;
    return () => { cancelled = true; };
  }, []);

  if (imgStatus === 'missing') {
    return <MissingAssetPlaceholder />;
  }
  if (imgStatus === 'loading') {
    return <div style={styles.loading}>Loading campus map…</div>;
  }

  // Drop the dot only if we have a position for this building +
  // can color it. No-data buildings still get a dot, just styled
  // distinctly so the viewer knows it's a no-meter building.
  const dots = rows
    .map((r) => {
      const pos = buildingPositionsPct.find((p) => p.id === r.id);
      if (!pos) return null;
      const color = intensityColorFor(r.kgPerSqft);
      const hasData = color !== null;
      // Dot radius scales with sqft (sqrt) — same intent as the box
      // sizing in schematic mode. Min 14, max 32 in % terms is too
      // big; px units are fine since the SVG scales with the image.
      const minR = 12, maxR = 28;
      // sqft range across campus; use sqrt to compress
      const sqftSqrt = Math.sqrt(Math.max(1, r.sqft || 1));
      const allSqrt  = rows.map((x) => Math.sqrt(Math.max(1, x.sqft || 1)));
      const minSqrt = Math.min(...allSqrt);
      const maxSqrt = Math.max(...allSqrt);
      const norm = maxSqrt === minSqrt ? 0.5 : (sqftSqrt - minSqrt) / (maxSqrt - minSqrt);
      const r_ = minR + norm * (maxR - minR);
      return { id: r.id, row: r, pos, color, hasData, r: r_ };
    })
    .filter(Boolean);

  const positioned = dots.length;
  const total = rows.length;

  return (
    <div>
      <div style={styles.wrap}>
        <img
          src={ASSET_PATH}
          alt="Official KUA campus map"
          style={styles.img}
          draggable={false}
        />
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={styles.overlay}
          aria-label="Energy-intensity overlay"
        >
          <defs>
            <pattern id="photoNoDataHatch" patternUnits="userSpaceOnUse" width="3" height="3" patternTransform="rotate(45)">
              <rect width="3" height="3" fill="#1e293b" />
              <line x1="0" y1="0" x2="0" y2="3" stroke="#94a3b8" strokeWidth="1" />
            </pattern>
          </defs>
          {dots.map((d) => {
            const isSel = d.id === selectedId;
            const fill = d.hasData ? d.color : 'url(#photoNoDataHatch)';
            // r_ is in px but viewBox is 0-100, so convert by treating
            // it as a small absolute that gets visually scaled with the
            // image. We use a simpler scheme: dot radius in % of width
            // = clamp(r/8, 1.5, 4)
            const rPct = Math.max(1.5, Math.min(4, d.r / 8));
            return (
              <g key={d.id}>
                {/* Halo on hover/select */}
                <circle
                  cx={d.pos.xPct}
                  cy={d.pos.yPct}
                  r={rPct + (isSel ? 1.4 : 0.6)}
                  fill="rgba(0,0,0,0.55)"
                />
                <circle
                  cx={d.pos.xPct}
                  cy={d.pos.yPct}
                  r={rPct}
                  fill={fill}
                  stroke={isSel ? '#fff' : 'rgba(255,255,255,0.85)'}
                  strokeWidth={isSel ? 0.8 : 0.4}
                  style={{ cursor: 'pointer', pointerEvents: 'auto', transition: 'r 120ms ease, stroke-width 120ms ease' }}
                  onClick={() => onSelect(d.id === selectedId ? null : d.id)}
                >
                  <title>{`${d.row.name} — ${d.row.mtCO2e > 0 ? d.row.mtCO2e.toFixed(1) + ' mtCO₂e/yr' : 'no measured data'}`}</title>
                </circle>
              </g>
            );
          })}
        </svg>
      </div>
      <p style={styles.caption}>
        <strong style={{ color: '#cbd5e1' }}>{positioned}/{total} buildings positioned</strong>
        {' '}on the official KUA campus map. Dot color = per-sqft emissions intensity (same legend
        above). Dot size = building square footage. Click a dot to open that building's detail.
      </p>
    </div>
  );
}

function MissingAssetPlaceholder() {
  return (
    <div style={styles.missing}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>🗺️</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#cbd5e1', marginBottom: 8 }}>
        Photo map asset not yet saved
      </div>
      <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, maxWidth: 540, margin: '0 auto 12px' }}>
        Save the official KUA campus map image (the hand-illustrated bird's-eye view from Admissions)
        to <code style={styles.code}>src/public/kua-campus-map.png</code> and reload. The dashboard
        will automatically overlay live energy-intensity dots on each building's exact position
        (positions are already wired up — they came off the same map).
      </p>
      <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6, maxWidth: 540, margin: '0 auto' }}>
        In the meantime, use <strong>Schematic</strong> or <strong>Geographic</strong> mode above —
        both render without an asset.
      </p>
    </div>
  );
}

const styles = {
  wrap: {
    position: 'relative',
    width: '100%',
    maxWidth: 920,
    margin: '0 auto',
    background: '#0b1220',
    border: '1px solid #1f2937',
    borderRadius: 8,
    overflow: 'hidden',
    lineHeight: 0,
  },
  img: { width: '100%', height: 'auto', display: 'block', userSelect: 'none' },
  overlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' },
  caption: { marginTop: 10, fontSize: 12, color: '#94a3b8', lineHeight: 1.6 },
  loading: { padding: '60px 20px', textAlign: 'center', color: '#64748b', fontSize: 14 },
  missing: {
    padding: '40px 24px',
    textAlign: 'center',
    background: '#0b1220',
    border: '1px dashed #334155',
    borderRadius: 10,
  },
  code: { background: '#0f172a', color: '#86efac', padding: '2px 6px', borderRadius: 3, fontSize: 12 },
};
