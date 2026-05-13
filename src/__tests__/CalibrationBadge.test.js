// @vitest-environment jsdom
//
// Component-level tests for the CalibrationBadge on the plan agent's
// history block (Phase 134). The math + suppression rules are easy
// to break with a careless edit; this locks them in.

import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { CalibrationBadge } from '../pages/admin/AdminPlanAgent.js';

beforeEach(() => { cleanup(); });

describe('CalibrationBadge', () => {
  it('renders nothing when completed is empty or undefined', () => {
    const { container: c1 } = render(<CalibrationBadge completed={[]} />);
    expect(c1.firstChild).toBeNull();
    const { container: c2 } = render(<CalibrationBadge completed={undefined} />);
    expect(c2.firstChild).toBeNull();
  });

  it('renders nothing with a single shipped item (below sample-size floor)', () => {
    const { container } = render(<CalibrationBadge completed={[
      { expectedMt: 50, mtSaved: 55 },
    ]} />);
    expect(container.firstChild).toBeNull();
  });

  it('ignores items missing expected or actual', () => {
    const { container } = render(<CalibrationBadge completed={[
      { expectedMt: 50, mtSaved: 55 },
      { mtSaved: 12 },                    // no expectedMt
      { expectedMt: 30 },                 // no mtSaved
      { expectedMt: 0, mtSaved: 0 },      // expected=0, divide-by-zero risk
    ]} />);
    // Only one valid pair → still below the 2-pair floor → no render.
    expect(container.firstChild).toBeNull();
  });

  it('renders + verdict text when actuals exceed estimates by ≥5%', () => {
    render(<CalibrationBadge completed={[
      { expectedMt: 100, mtSaved: 120 },  // +20%
      { expectedMt: 50,  mtSaved: 60 },   // +20%
    ]} />);
    expect(screen.getByText(/beating estimates/i)).toBeTruthy();
    // (180 - 150) / 150 = 20.0%
    expect(screen.getByText(/\+20\.0%/)).toBeTruthy();
    // "2" and "shipped items" land in separate DOM nodes (strong + text);
    // match against the full normalised text content of the role="status".
    const badge = screen.getByRole('status');
    expect(badge.textContent).toMatch(/2.+shipped items/i);
  });

  it('renders − verdict text when actuals miss estimates by ≥5%', () => {
    render(<CalibrationBadge completed={[
      { expectedMt: 100, mtSaved: 80 },
      { expectedMt: 50,  mtSaved: 40 },
    ]} />);
    expect(screen.getByText(/underdelivering vs estimates/i)).toBeTruthy();
    // (120 - 150) / 150 = -20.0%
    expect(screen.getByText(/-20\.0%/)).toBeTruthy();
  });

  it('renders neutral verdict text inside the ±5% band', () => {
    render(<CalibrationBadge completed={[
      { expectedMt: 100, mtSaved: 101 },
      { expectedMt: 50,  mtSaved: 51 },
    ]} />);
    expect(screen.getByText(/tracking estimates/i)).toBeTruthy();
  });

  it('shows totals — actual and estimate mt values in the body', () => {
    render(<CalibrationBadge completed={[
      { expectedMt: 100, mtSaved: 120 },
      { expectedMt: 200, mtSaved: 180 },
    ]} />);
    // 300 expected, 300 actual = 0% → neutral, plus the formatted totals
    expect(screen.getByText(/300 mt vs estimate 300 mt/)).toBeTruthy();
  });
});
