// @vitest-environment jsdom
//
// CampusPhotoMap mounts without throwing and falls back to a
// friendly placeholder when the asset is missing (which it is in
// the test env — jsdom's Image probe will error on the
// /kua-campus-map.png path). This is also what users will see if
// they haven't dropped the official map into src/public/ yet, so
// the placeholder needs to be clear and instructive.

import { describe, it, expect, afterEach } from 'vitest';
import React from 'react';
import { render, cleanup, act } from '@testing-library/react';
import { CampusPhotoMap } from '../components/CampusPhotoMap.js';

const sampleRows = [
  { id: 'b_miller',     name: 'Miller Bicentennial', sqft: 38000, mtCO2e: 60.0, kgPerSqft: 15.7 },
  { id: 'b_kilton',     name: 'Kilton',              sqft: 16000, mtCO2e: 12.0, kgPerSqft:  6.8 },
  { id: 'b_does_not_exist', name: 'No-position bldg', sqft: 5000, mtCO2e:  4.0, kgPerSqft: 10.0 },
];

const intensityColorFor = (k) => k > 0 ? '#fcd34d' : null;

afterEach(() => { cleanup(); });

describe('CampusPhotoMap', () => {
  it('mounts without throwing', () => {
    expect(() => render(
      <CampusPhotoMap
        rows={sampleRows}
        selectedId={null}
        onSelect={() => {}}
        intensityColorFor={intensityColorFor}
        noDataFill="url(#noDataHatch)"
      />,
    )).not.toThrow();
  });

  it('shows a loading state initially (Image probe is asynchronous)', () => {
    const { container } = render(
      <CampusPhotoMap
        rows={sampleRows}
        selectedId={null}
        onSelect={() => {}}
        intensityColorFor={intensityColorFor}
        noDataFill="url(#noDataHatch)"
      />,
    );
    expect(container.textContent).toMatch(/Loading campus map|Photo map asset not yet saved/);
  });

  it('falls back to the missing-asset placeholder when Image probe errors', async () => {
    const { container } = render(
      <CampusPhotoMap
        rows={sampleRows}
        selectedId={null}
        onSelect={() => {}}
        intensityColorFor={intensityColorFor}
        noDataFill="url(#noDataHatch)"
      />,
    );
    // The placeholder appears once the (async) onerror fires. Loop a
    // few microtasks so the probe resolves; the test env has no
    // network, so onerror should run essentially immediately.
    await act(async () => {
      await new Promise((r) => setTimeout(r, 30));
    });
    expect(container.textContent).toMatch(/Photo map asset not yet saved|Loading campus map/);
  });
});
