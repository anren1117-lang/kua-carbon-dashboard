// Projects per-building lat/lng coordinates into SVG (x, y) box
// positions sized by sqft. Equirectangular projection — fine for a
// campus-scale viewport where curvature is invisible at <1 km.
//
// Pure function; no React. CampusMap chooses between this layout
// and the by-category schematic depending on user toggle.

import { buildingPositions } from '../data/buildingPositions.js';

/**
 * @param {Array<{ id: string, sqft: number, [k: string]: any }>} rows  Building rows from computeBuildingEmissions.
 * @param {object} opts
 * @param {number} opts.width
 * @param {number} opts.height
 * @param {number} [opts.padding=24]    Margin from SVG edge to the bbox.
 * @param {Array} [opts.positions]      Inject for tests.
 * @returns {{
 *   boxes: Array<{ row: object, x: number, y: number, w: number, h: number, hasPosition: boolean }>,
 *   missingPositions: number,
 *   totalHeight: number,
 * }}
 */
export function layoutBoxesGeo(rows, { width, height, padding = 24, positions } = {}) {
  const list = positions || buildingPositions;
  const positionById = Object.fromEntries(list.map((p) => [p.id, p]));

  const withCoords = rows
    .map((r) => ({ row: r, pos: positionById[r.id] }))
    .filter(({ pos }) => pos && Number.isFinite(pos.lat) && Number.isFinite(pos.lng));

  const missingPositions = rows.length - withCoords.length;

  if (withCoords.length === 0) {
    return { boxes: [], missingPositions, totalHeight: height };
  }

  // Bounding box of all positioned buildings.
  const lats = withCoords.map((x) => x.pos.lat);
  const lngs = withCoords.map((x) => x.pos.lng);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  // Avoid divide-by-zero if all coords collapse to one point.
  const dLat = Math.max(maxLat - minLat, 1e-6);
  const dLng = Math.max(maxLng - minLng, 1e-6);

  // Aspect-correct: a degree of longitude is shorter than a degree of
  // latitude at 43°N. Use ~cos(lat) to scale x so the campus doesn't
  // look horizontally squashed. Picks the center lat as the
  // reference.
  const refLat = (minLat + maxLat) / 2;
  const xScale = Math.cos((refLat * Math.PI) / 180);
  const scaledDLng = dLng * xScale;
  // Same aspect ratio applied to the available canvas — center the
  // bounding box inside the canvas so longer axes get more room.
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;
  const sourceAspect = scaledDLng / dLat;
  const targetAspect = innerW / innerH;
  let drawW, drawH, offsetX, offsetY;
  if (sourceAspect > targetAspect) {
    drawW = innerW;
    drawH = innerW / sourceAspect;
    offsetX = padding;
    offsetY = padding + (innerH - drawH) / 2;
  } else {
    drawH = innerH;
    drawW = innerH * sourceAspect;
    offsetX = padding + (innerW - drawW) / 2;
    offsetY = padding;
  }

  // Box-size scaling: same √sqft heuristic the schematic layout uses,
  // but compressed since geo positions don't lend themselves to
  // wrapping — buildings need to sit on their coordinates without
  // overlapping their neighbors too aggressively.
  const sqfts = rows.map((r) => r.sqft || 1);
  const minSq = Math.min(...sqfts);
  const maxSq = Math.max(...sqfts);
  const sqrtMin = Math.sqrt(minSq);
  const sqrtMax = Math.sqrt(maxSq);
  const MIN_BOX = 28;
  const MAX_BOX = 72;
  const boxSize = (sqft) => {
    if (sqrtMax === sqrtMin) return (MIN_BOX + MAX_BOX) / 2;
    const norm = (Math.sqrt(sqft || 1) - sqrtMin) / (sqrtMax - sqrtMin);
    return MIN_BOX + norm * (MAX_BOX - MIN_BOX);
  };

  const boxes = withCoords.map(({ row, pos }) => {
    const nx = ((pos.lng - minLng) * xScale) / scaledDLng;       // 0..1 left→right
    const ny = 1 - (pos.lat - minLat) / dLat;                    // 0..1 top→bottom (north up)
    const w = boxSize(row.sqft);
    const h = w * 0.7;
    return {
      row,
      x: offsetX + nx * drawW - w / 2,
      y: offsetY + ny * drawH - h / 2,
      w,
      h,
      hasPosition: true,
    };
  });

  return { boxes, missingPositions, totalHeight: height };
}
