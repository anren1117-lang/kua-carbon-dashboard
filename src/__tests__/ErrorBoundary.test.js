// @vitest-environment jsdom

// Tests for the ErrorBoundary component. We assert two things:
//   1. When children render successfully, the boundary is invisible.
//   2. When a child throws during render, the boundary catches it
//      and surfaces the friendly fallback instead of crashing the
//      whole tree.

import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ErrorBoundary } from '../components/ErrorBoundary.js';

// Tiny component that throws on demand. Used to feed the boundary a
// reproducible render error.
function Boom({ message = 'kaboom' }) {
  throw new Error(message);
}

function NotBoom() {
  return <div data-testid="ok">All good</div>;
}

beforeEach(() => {
  cleanup();
  // React logs the error to console.error when the boundary catches.
  // Silence the spam so test output stays readable; the test still
  // verifies the boundary fired by checking the DOM.
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('ErrorBoundary', () => {
  it('renders children unchanged when nothing throws', () => {
    render(
      <MemoryRouter>
        <ErrorBoundary>
          <NotBoom />
        </ErrorBoundary>
      </MemoryRouter>
    );
    expect(screen.getByTestId('ok')).toBeTruthy();
    expect(screen.queryByText(/something went wrong/i)).toBeNull();
  });

  it('catches a thrown render error and shows the fallback', () => {
    render(
      <MemoryRouter>
        <ErrorBoundary>
          <Boom message="test-crash-marker" />
        </ErrorBoundary>
      </MemoryRouter>
    );
    // The headline appears in <h1>, distinct from the stack-trace
    // pre. Heading-role match avoids the multiple-elements problem.
    expect(screen.getByRole('heading', { name: /something went wrong/i })).toBeTruthy();
    // Reload + Try again buttons + Go home link all rendered.
    expect(screen.getByRole('button', { name: /reload page/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /try again/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /go home/i })).toBeTruthy();
  });

  it('error message surfaces inside the technical-details panel', () => {
    render(
      <MemoryRouter>
        <ErrorBoundary>
          <Boom message="UNIQUE_MESSAGE_FOR_TEST" />
        </ErrorBoundary>
      </MemoryRouter>
    );
    // The error message is rendered in two places (the err panel and
    // the stack trace pre) — getAllByText so the duplicate is fine.
    const matches = screen.getAllByText(/UNIQUE_MESSAGE_FOR_TEST/);
    expect(matches.length).toBeGreaterThan(0);
  });
});
