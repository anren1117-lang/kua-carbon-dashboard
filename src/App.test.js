// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from './App.js';

// Smoke test for the homepage. Replaced the CRA-leftover "learn react"
// test that referenced text the dashboard never had. App uses <Link>
// from react-router-dom, so it must render inside a Router. Uses plain
// truthy assertions so we don't have to wire up jest-dom's custom
// matchers (the existing test setup is matcherless vitest).
describe('App (homepage)', () => {
  test('renders the KUA brand and the headline section', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Kimball Union Academy/i)).toBeTruthy();
    expect(screen.getByText(/Net annual carbon footprint/i)).toBeTruthy();
  });
});
