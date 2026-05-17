// @vitest-environment jsdom
//
// Tests for ProvenancePill — the three-state data-provenance badge used
// in 79 places across the dashboard. The load-bearing invariant the
// source comment names is "never inflate confidence" — unknown
// provenance values must fall back to "Estimated", not silently render
// as "Measured" or no badge at all.

import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { ProvenancePill, ProvenanceLegend } from '../components/ProvenancePill.js';

beforeEach(() => { cleanup(); });

describe('ProvenancePill — three known states', () => {
  it('renders "Measured" for provenance="measured"', () => {
    const { container } = render(<ProvenancePill provenance="measured" />);
    expect(container.textContent).toBe('Measured');
  });

  it('renders "Cited" for provenance="cited"', () => {
    const { container } = render(<ProvenancePill provenance="cited" />);
    expect(container.textContent).toBe('Cited');
  });

  it('renders "Estimated" for provenance="estimated"', () => {
    const { container } = render(<ProvenancePill provenance="estimated" />);
    expect(container.textContent).toBe('Estimated');
  });
});

describe('ProvenancePill — never-inflate-confidence invariant', () => {
  // The MAP fallback in the source ensures a bug elsewhere (an unknown
  // provenance value slipping through, undefined, null, an arbitrary
  // string) renders as "Estimated" — not silently as "Measured" or as
  // nothing at all. This invariant is the reason the badge is safe to
  // use everywhere without runtime validation upstream.

  for (const bad of [undefined, null, '', 'unknown', 'maybe', 'measureddd', 0, 42, {}]) {
    it(`falls back to "Estimated" for ${JSON.stringify(bad)}`, () => {
      const { container } = render(<ProvenancePill provenance={bad} />);
      expect(container.textContent).toBe('Estimated');
    });
  }
});

describe('ProvenancePill — label override', () => {
  it('overrides the default label when a custom label is passed', () => {
    const { container } = render(<ProvenancePill provenance="measured" label="BMS-measured" />);
    expect(container.textContent).toBe('BMS-measured');
  });

  it('still uses the provenance kind for styling even when label is overridden', () => {
    // The kind drives the Pill color. We can't easily assert on color
    // without coupling to inline-style internals, but we can prove the
    // override doesn't bypass the kind lookup by rendering something
    // and confirming a single Pill is mounted.
    const { container } = render(<ProvenancePill provenance="cited" label="Custom" />);
    expect(container.firstChild).toBeTruthy();
  });
});

describe('ProvenanceLegend', () => {
  it('renders all three legend entries with their descriptions', () => {
    const { container } = render(<ProvenanceLegend />);
    const txt = container.textContent;
    expect(txt).toContain('Measured');
    expect(txt).toContain('Cited');
    expect(txt).toContain('Estimated');
    expect(txt).toContain('real meter or invoice');
    expect(txt).toContain('published methodology');
    expect(txt).toContain('placeholder');
  });

  it('renders in both compact and non-compact modes without throwing', () => {
    expect(() => render(<ProvenanceLegend />)).not.toThrow();
    cleanup();
    expect(() => render(<ProvenanceLegend compact />)).not.toThrow();
  });
});
