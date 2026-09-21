// @vitest-environment jsdom
//
// Six public pages told readers to "see /admin/methodology for the full
// per-component breakdown". AdminLayout.js:347 renders a PASSWORD FORM instead
// of <Outlet /> when there is no session, and index.js:320 mounts every
// /admin/* route under it — so a school-board reader following that link got
// "Enter the admin password to manage emissions data."
//
// The content was never sensitive: BOTTOM_UP_BREAKDOWN is nine components with
// their basis arithmetic and citations. A sweep of AdminMethodology for
// passwords, table names or internal workflow came back empty. It was misfiled,
// not private.
//
// The invariant pinned here is the general one — no public page may direct a
// reader to a login-gated URL — so the next /admin/ link someone adds to a
// public page fails too, rather than only the six that exist today.

import { describe, it, expect, afterEach } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Methodology from '../pages/Methodology.js';
import { BOTTOM_UP_BREAKDOWN } from '../data/geographicEstimates.js';

afterEach(cleanup);

// Top-level src/pages/*.js are the public routes; src/pages/admin/** is not.
//
// Resolved from cwd, not `new URL(..., import.meta.url)`: under the jsdom
// pragma import.meta.url is an http: URL and node:fs rejects it with
// ERR_INVALID_URL_SCHEME. (Tests without the pragma can use the URL form.)
const PAGES_DIR = resolve(process.cwd(), 'pages');
const publicPages = readdirSync(PAGES_DIR).filter((f) => f.endsWith('.js'));
const readPage = (f) => readFileSync(resolve(PAGES_DIR, f), 'utf8');

describe('no public page points a reader at the login wall', () => {
  it('actually found the public pages to sweep', () => {
    // An empty list would make it.each register ZERO tests, and a sweep that
    // runs nothing reads exactly like a sweep that found nothing wrong.
    expect(publicPages.length).toBeGreaterThan(30);
    expect(publicPages).toContain('Methodology.js');
    expect(publicPages).toContain('Scope1.js');
    expect(publicPages).toContain('AnnualReport.js');
  });

  // Scoped to /admin/methodology — the CONTENT promise this phase fixes.
  //
  // The sweep also found eight references of a different kind: public pages
  // that LINK INTO admin areas (Executive.js wraps every action row in a
  // <Link to="/admin/actions">, Unsubscribe and Actions link to /admin/alerts
  // and /admin/actions, and Buildings/Faq/Hotspots/TrendBuilder mention
  // /admin/bms-export in prose aimed at an admin). Those are a real UX defect
  // — a board member clicking an action row lands on a password prompt — but a
  // different fix across eight more files. Recorded as its own task rather
  // than widened into this assertion, because a test that asserts more than
  // the phase delivers is a test that has to be weakened later.
  it.each(publicPages)('%s does not send a reader to /admin/methodology', (f) => {
    const hits = readPage(f).split('\n')
      .map((l, i) => [i + 1, l])
      .filter(([, l]) => !l.trim().startsWith('//') && !l.trim().startsWith('*'))
      .filter(([, l]) => l.includes('/admin/methodology'))
      .map(([n, l]) => `${f}:${n}: ${l.trim().slice(0, 110)}`);
    expect(hits).toEqual([]);
  });

  it('the sweep can actually fail', () => {
    // Otherwise a regex that matches nothing would read as a clean sweep.
    const probe = 'see /admin/methodology for the breakdown';
    expect(probe.includes('/admin/methodology')).toBe(true);
    expect('see /methodology for the breakdown'.includes('/admin/methodology')).toBe(false);
  });
});

describe('the breakdown the public pages promise is publicly reachable', () => {
  it('renders every component from BOTTOM_UP_BREAKDOWN', () => {
    const { container } = render(<MemoryRouter><Methodology /></MemoryRouter>);
    const panel = container.querySelector('[role="region"][aria-label="Per-component method breakdown"]');
    expect(panel).toBeTruthy();
    for (const row of BOTTOM_UP_BREAKDOWN) {
      expect(panel.textContent).toContain(row.component);
    }
  });

  it('shows each component\'s basis and citations, not just a number', () => {
    const { container } = render(<MemoryRouter><Methodology /></MemoryRouter>);
    const panel = container.querySelector('[role="region"][aria-label="Per-component method breakdown"]');
    // A number alone is not a methodology; the basis arithmetic is the point.
    for (const row of BOTTOM_UP_BREAKDOWN) {
      for (const c of row.citations) expect(panel.textContent).toContain(c);
    }
    expect(panel.textContent).toMatch(/EPA Hub/);
  });
});
