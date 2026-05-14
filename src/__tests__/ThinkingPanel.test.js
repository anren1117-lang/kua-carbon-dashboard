// @vitest-environment jsdom
//
// Tests for the shared ThinkingPanel component (Phase 168, extracted
// in Phase 178). Used by AdminPlanAgent + AdminAIIngestion to surface
// the model's extended-thinking trace under each AI result. Locks
// down: empty/null suppression, collapse/expand toggle, char-count
// formatting (raw under 1K, "X.XK" at/above 1K).

import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { ThinkingPanel } from '../components/ThinkingPanel.js';

beforeEach(() => { cleanup(); });

describe('ThinkingPanel', () => {
  it('renders nothing when thinking is null', () => {
    const { container } = render(<ThinkingPanel thinking={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when thinking is undefined', () => {
    const { container } = render(<ThinkingPanel thinking={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when thinking is the empty string', () => {
    const { container } = render(<ThinkingPanel thinking="" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the toggle but hides the body by default', () => {
    render(<ThinkingPanel thinking="The agent thought about heat pumps." />);
    const toggle = screen.getByRole('button');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByText(/heat pumps/)).toBeNull();
  });

  it('expands the body when the toggle is clicked', () => {
    render(<ThinkingPanel thinking="The agent thought about heat pumps." />);
    const toggle = screen.getByRole('button');
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('The agent thought about heat pumps.')).toBeTruthy();
  });

  it('collapses again on a second click', () => {
    render(<ThinkingPanel thinking="hidden text" />);
    const toggle = screen.getByRole('button');
    fireEvent.click(toggle);
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByText('hidden text')).toBeNull();
  });

  it('renders raw char count when under 1000', () => {
    render(<ThinkingPanel thinking={'x'.repeat(742)} />);
    expect(screen.getByText(/742/)).toBeTruthy();
    expect(screen.getByText(/chars/)).toBeTruthy();
  });

  it('formats char count as "N.NK" at exactly 1000 chars', () => {
    render(<ThinkingPanel thinking={'x'.repeat(1000)} />);
    expect(screen.getByText(/1\.0K/)).toBeTruthy();
  });

  it('formats char count as "N.NK" for >= 1000', () => {
    render(<ThinkingPanel thinking={'x'.repeat(3456)} />);
    expect(screen.getByText(/3\.5K/)).toBeTruthy();
  });

  it('preserves whitespace-bearing content in the rendered body', () => {
    // testing-library's getByText normalizes whitespace; assert via
    // textContent on the body so we can compare the literal string.
    const text = 'Step 1: do thing\nStep 2: do other thing';
    const { container } = render(<ThinkingPanel thinking={text} />);
    fireEvent.click(screen.getByRole('button'));
    // The body div is the sibling immediately after the toggle button.
    const body = container.querySelector('button + div');
    expect(body.textContent).toBe(text);
  });
});
