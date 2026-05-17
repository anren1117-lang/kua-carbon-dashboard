import React, { useState } from 'react';
import { Map, Overlay } from 'pigeon-maps';
import { buildingPositions } from '../data/buildingPositions.js';

// CampusSatelliteMap — real satellite imagery of KUA campus via
// Esri World Imagery tiles (free, no API key), with the same
// energy-intensity dots overlaid on each building's actual lat/lng.
//
// This is the "real picture" map: an actual aerial photograph of
// Plainfield NH, not a hand-illustration. Students can pan + zoom
// the way they would in Google Maps, and the colored markers sit on
// top of the buildings as captured from space.
//
// Positions still come from the 'cited' buildingPositions data
// (eyeballed off the official KUA map and converted to lat/lng),
// so markers will land in roughly the right place but not perfectly.
// Upgrading to surveyor-grade lat/lng per building would tighten
// the alignment — see the docstring on buildingPositions.js for how.

// Esri World Imagery — free for non-commercial + attribution. We
// thread the {z}/{y}/{x} into their REST tile endpoint. This is the
// same tile source the ArcGIS Online basemap uses.
function esriImageryProvider(x, y, z) {
  return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;
}

const KUA_CENTER = [43.7426, -72.2502];
const DEFAULT_ZOOM = 16;

export function CampusSatelliteMap({ rows, selectedId, onSelect, intensityColorFor }) {
  const [center, setCenter] = useState(KUA_CENTER);
  const [zoom, setZoom]     = useState(DEFAULT_ZOOM);

  const positionById = Object.fromEntries(buildingPositions.map((p) => [p.id, p]));

  // Marker radius scales with sqft (sqrt) — same shape as the photo
  // overlay. Keep it modest so markers stay readable on the imagery.
  const allSqrt = rows.map((r) => Math.sqrt(Math.max(1, r.sqft || 1)));
  const minSqrt = Math.min(...allSqrt);
  const maxSqrt = Math.max(...allSqrt);
  function radiusPx(sqft) {
    const sqrt = Math.sqrt(Math.max(1, sqft || 1));
    const norm = maxSqrt === minSqrt ? 0.5 : (sqrt - minSqrt) / (maxSqrt - minSqrt);
    return 10 + norm * 14; // 10–24 px
  }

  return (
    <div>
      <div style={styles.wrap}>
        <Map
          provider={esriImageryProvider}
          center={center}
          zoom={zoom}
          height={500}
          onBoundsChanged={({ center: c, zoom: z }) => { setCenter(c); setZoom(z); }}
          attribution={<span style={styles.attribution}>Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community</span>}
        >
          {rows.map((r) => {
            const pos = positionById[r.id];
            if (!pos) return null;
            const color = intensityColorFor(r.kgPerSqft);
            const hasData = color !== null;
            const isSel = r.id === selectedId;
            const rPx = radiusPx(r.sqft);
            return (
              <Overlay key={r.id} anchor={[pos.lat, pos.lng]} offset={[rPx, rPx]}>
                <div
                  onClick={() => onSelect(r.id === selectedId ? null : r.id)}
                  title={`${r.name} — ${r.mtCO2e > 0 ? r.mtCO2e.toFixed(1) + ' mtCO₂e/yr' : 'no measured data'}`}
                  style={{
                    width: rPx * 2,
                    height: rPx * 2,
                    borderRadius: '50%',
                    background: hasData ? color : 'transparent',
                    backgroundImage: hasData ? undefined : 'repeating-linear-gradient(45deg, #1e293b 0 3px, #475569 3px 6px)',
                    border: isSel ? '3px solid #fff' : '2px solid rgba(255,255,255,0.85)',
                    boxShadow: '0 0 0 1px rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.5)',
                    cursor: 'pointer',
                    transition: 'border-width 120ms ease, transform 120ms ease',
                    transform: isSel ? 'scale(1.15)' : 'scale(1)',
                  }}
                />
              </Overlay>
            );
          })}
        </Map>
      </div>
      <div style={styles.controls}>
        <button
          type="button"
          onClick={() => { setCenter(KUA_CENTER); setZoom(DEFAULT_ZOOM); }}
          style={styles.recenterBtn}
        >
          ↺ Recenter on KUA
        </button>
        <span style={styles.helpText}>
          Pan + zoom with mouse / touch. Markers sit on each building's lat/lng (sourced from the
          official KUA campus map — positions are <strong>cited</strong>, not GPS-surveyed, so
          they may be off by 10–30m).
        </span>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    width: '100%',
    maxWidth: 920,
    margin: '0 auto',
    border: '1px solid #1f2937',
    borderRadius: 8,
    overflow: 'hidden',
    background: '#0b1220',
  },
  attribution: { fontSize: 10, color: '#cbd5e1', background: 'rgba(15,23,42,0.85)', padding: '2px 6px', borderRadius: 3 },
  controls: { marginTop: 10, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  recenterBtn: { padding: '6px 12px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 4, color: '#22d3ee', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700 },
  helpText: { fontSize: 12, color: '#94a3b8', lineHeight: 1.5 },
};
