// Unit tests for the lat/lng → SVG layout used by the geographic
// mode of the campus map. Pure function; no DOM.

import { describe, it, expect } from 'vitest';
import { layoutBoxesGeo } from '../utils/geoLayout.js';

const samplePositions = [
  { id: 'a', lat: 43.7460, lng: -72.1190, provenance: 'estimated' },
  { id: 'b', lat: 43.7445, lng: -72.1200, provenance: 'estimated' },
  { id: 'c', lat: 43.7440, lng: -72.1180, provenance: 'estimated' },
];
const sampleRows = [
  { id: 'a', sqft: 10_000 },
  { id: 'b', sqft:  5_000 },
  { id: 'c', sqft:  2_000 },
];

describe('layoutBoxesGeo — basic shape', () => {
  it('returns one box per row that has a matching position', () => {
    const { boxes, missingPositions } = layoutBoxesGeo(sampleRows, { width: 800, height: 500, positions: samplePositions });
    expect(boxes).toHaveLength(3);
    expect(missingPositions).toBe(0);
  });

  it('counts rows without a position', () => {
    const { boxes, missingPositions } = layoutBoxesGeo(
      [...sampleRows, { id: 'd', sqft: 1000 }],
      { width: 800, height: 500, positions: samplePositions },
    );
    expect(boxes).toHaveLength(3);
    expect(missingPositions).toBe(1);
  });

  it('returns empty boxes when nothing is positionable', () => {
    const { boxes, missingPositions } = layoutBoxesGeo(
      [{ id: 'z', sqft: 1000 }],
      { width: 800, height: 500, positions: samplePositions },
    );
    expect(boxes).toEqual([]);
    expect(missingPositions).toBe(1);
  });
});

describe('layoutBoxesGeo — projection', () => {
  it('keeps every box inside the canvas (within padding)', () => {
    const W = 800, H = 500, padding = 24;
    const { boxes } = layoutBoxesGeo(sampleRows, { width: W, height: H, padding, positions: samplePositions });
    for (const b of boxes) {
      // Centers are clamped to inside the canvas. Box edges may
      // extend slightly past padding because boxes are sized
      // relative to sqft, but never off-canvas.
      const cx = b.x + b.w / 2;
      const cy = b.y + b.h / 2;
      expect(cx).toBeGreaterThanOrEqual(padding - 1);
      expect(cx).toBeLessThanOrEqual(W - padding + 1);
      expect(cy).toBeGreaterThanOrEqual(padding - 1);
      expect(cy).toBeLessThanOrEqual(H - padding + 1);
    }
  });

  it('places north-most lat at the top of the canvas', () => {
    const { boxes } = layoutBoxesGeo(sampleRows, { width: 800, height: 500, positions: samplePositions });
    // sample 'a' is the northern-most (lat 43.7460); should have the smallest y.
    const a = boxes.find((b) => b.row.id === 'a');
    const c = boxes.find((b) => b.row.id === 'c');
    expect(a.y).toBeLessThan(c.y);
  });

  it('places western-most lng on the left', () => {
    const { boxes } = layoutBoxesGeo(sampleRows, { width: 800, height: 500, positions: samplePositions });
    // sample 'b' is the western-most (lng -72.1200); smallest x.
    const b = boxes.find((x) => x.row.id === 'b');
    const c = boxes.find((x) => x.row.id === 'c');
    expect(b.x).toBeLessThan(c.x);
  });
});

describe('layoutBoxesGeo — sqft scaling', () => {
  it('bigger sqft → bigger box', () => {
    const { boxes } = layoutBoxesGeo(sampleRows, { width: 800, height: 500, positions: samplePositions });
    const a = boxes.find((x) => x.row.id === 'a'); // 10k sqft
    const c = boxes.find((x) => x.row.id === 'c'); // 2k sqft
    expect(a.w).toBeGreaterThan(c.w);
    expect(a.h).toBeGreaterThan(c.h);
  });

  it('all boxes equal size when sqft is uniform', () => {
    const rows = [
      { id: 'a', sqft: 5000 },
      { id: 'b', sqft: 5000 },
      { id: 'c', sqft: 5000 },
    ];
    const { boxes } = layoutBoxesGeo(rows, { width: 800, height: 500, positions: samplePositions });
    expect(boxes[0].w).toBe(boxes[1].w);
    expect(boxes[1].w).toBe(boxes[2].w);
  });
});

describe('layoutBoxesGeo — degenerate inputs', () => {
  it('handles all-same-position rows without dividing by zero', () => {
    const samePos = [
      { id: 'a', lat: 43.7448, lng: -72.1192 },
      { id: 'b', lat: 43.7448, lng: -72.1192 },
    ];
    const rows = [{ id: 'a', sqft: 1000 }, { id: 'b', sqft: 2000 }];
    const { boxes } = layoutBoxesGeo(rows, { width: 800, height: 500, positions: samePos });
    expect(boxes).toHaveLength(2);
    expect(boxes.every((b) => Number.isFinite(b.x) && Number.isFinite(b.y))).toBe(true);
  });
});
