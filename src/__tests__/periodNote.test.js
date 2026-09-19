// @vitest-environment jsdom
//
// The note exists because a form field can be saved successfully and still
// never reach a total: periodStatusOf() matches the period label exactly, so
// a row stamped with the wall-clock year is classified 'out'.
//
// Both years are props. A test that read the real clock would change
// behaviour on 1 August — precisely the kind of silent drift this phase is
// about.
//
// Assertions are plain truthy checks, not jest-dom matchers: the package is a
// dependency but no setup file registers it, as App.test.js notes.

import { describe, it, expect, afterEach } from 'vitest';
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { PeriodNote } from '../pages/admin/scope3/PeriodNote';
import { periodStatusOf } from '../data/scopeTotals.js';

afterEach(cleanup);

describe('PeriodNote', () => {
  it('renders nothing when the clock and the published period agree', () => {
    const { container } = render(<PeriodNote published="2025-2026" clock="2025-2026" />);
    expect(container.textContent).toBe('');
  });

  it('names BOTH years when they diverge', () => {
    const { container } = render(<PeriodNote published="2025-2026" clock="2026-2027" />);
    const note = container.querySelector('[role="status"]');
    expect(note).toBeTruthy();
    expect(note.textContent).toContain('2026-2027');
    expect(note.textContent).toContain('2025-2026');
    expect(note.textContent).toMatch(/will not appear in any published total/i);
  });

  it('the year it warns about really is out of period', () => {
    // Ties the warning to the rule that causes it, rather than to a string.
    expect(periodStatusOf({ school_year: '2026-2027' })).toBe('out');
    expect(periodStatusOf({ school_year: '2025-2026' })).toBe('in');
  });

  it('survives missing values instead of rendering a half sentence', () => {
    expect(render(<PeriodNote published="" clock="2026-2027" />).container.textContent).toBe('');
    cleanup();
    expect(render(<PeriodNote published="2025-2026" clock="" />).container.textContent).toBe('');
  });

  it('uses live defaults without throwing', () => {
    expect(() => render(<PeriodNote />)).not.toThrow();
  });
});
