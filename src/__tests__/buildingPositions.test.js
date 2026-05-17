// Sanity tests for the buildingPositions data file. The positions
// came off the official KUA campus map (the hand-illustrated bird's-
// eye view), so the most useful test is structural — every row has
// a valid id + lat + lng + cited provenance, and the helpers behave.

import { describe, it, expect } from 'vitest';
import {
  buildingPositions,
  getBuildingPosition,
  allPositionsAreEstimated,
  allPositionsAreCitedOrBetter,
} from '../data/buildingPositions.js';
import { buildings } from '../data/buildings.js';

describe('buildingPositions — shape', () => {
  it('has at least 10 positioned buildings', () => {
    expect(buildingPositions.length).toBeGreaterThanOrEqual(10);
  });

  it('every row has id + finite lat + finite lng + provenance', () => {
    for (const p of buildingPositions) {
      expect(typeof p.id).toBe('string');
      expect(p.id.length).toBeGreaterThan(0);
      expect(Number.isFinite(p.lat)).toBe(true);
      expect(Number.isFinite(p.lng)).toBe(true);
      expect(['estimated', 'cited', 'measured']).toContain(p.provenance);
    }
  });

  it('every id corresponds to a real building in the registry', () => {
    const knownIds = new Set(buildings.map((b) => b.id));
    for (const p of buildingPositions) {
      expect(knownIds.has(p.id)).toBe(true);
    }
  });

  it('lat/lng are anchored near KUA (43.7°N, -72.2°W)', () => {
    for (const p of buildingPositions) {
      expect(p.lat).toBeGreaterThan(43.7);
      expect(p.lat).toBeLessThan(43.8);
      expect(p.lng).toBeGreaterThan(-72.3);
      expect(p.lng).toBeLessThan(-72.2);
    }
  });
});

describe('buildingPositions — helpers', () => {
  it('getBuildingPosition returns null for unknown id', () => {
    expect(getBuildingPosition('b_does_not_exist')).toBeNull();
  });

  it('getBuildingPosition returns the row for a known id', () => {
    const sample = buildingPositions[0];
    const fetched = getBuildingPosition(sample.id);
    expect(fetched).toEqual(sample);
  });

  it('allPositionsAreEstimated is false now that positions came off the official map', () => {
    expect(allPositionsAreEstimated()).toBe(false);
  });

  it('allPositionsAreCitedOrBetter is true', () => {
    expect(allPositionsAreCitedOrBetter()).toBe(true);
  });
});
