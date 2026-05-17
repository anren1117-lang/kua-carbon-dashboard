// @vitest-environment jsdom
//
// CampusSatelliteMap smoke test — the real-imagery mode of
// /campus-map. Renders the pigeon-maps <Map> with our building
// markers on top of Esri World Imagery tiles. The test
// environment can't actually fetch tiles, but the component
// should at least mount without throwing.

import { describe, it, expect, afterEach } from 'vitest';
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { CampusSatelliteMap } from '../components/CampusSatelliteMap.js';

const sampleRows = [
  { id: 'b_miller',     name: 'Miller Bicentennial', sqft: 38000, mtCO2e: 60.0, kgPerSqft: 15.7 },
  { id: 'b_kilton',     name: 'Kilton',              sqft: 16000, mtCO2e: 12.0, kgPerSqft:  6.8 },
  { id: 'b_does_not_exist', name: 'Unpositioned',    sqft:  5000, mtCO2e:  4.0, kgPerSqft: 10.0 },
];

const intensityColorFor = (k) => k > 0 ? '#fcd34d' : null;

afterEach(() => { cleanup(); });

describe('CampusSatelliteMap', () => {
  it('mounts without throwing', () => {
    expect(() => render(
      <CampusSatelliteMap
        rows={sampleRows}
        selectedId={null}
        onSelect={() => {}}
        intensityColorFor={intensityColorFor}
      />,
    )).not.toThrow();
  });

  it('renders the recenter button', () => {
    const { container } = render(
      <CampusSatelliteMap
        rows={sampleRows}
        selectedId={null}
        onSelect={() => {}}
        intensityColorFor={intensityColorFor}
      />,
    );
    expect(container.textContent).toMatch(/Recenter on KUA/);
  });
});
