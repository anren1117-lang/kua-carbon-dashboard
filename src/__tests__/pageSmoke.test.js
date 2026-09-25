// @vitest-environment jsdom
//
// Every page must RENDER. Not "be correct" — just not throw.
//
// Phase 439 shipped a ReferenceError to production: `export { x } from 'y'`
// forwards to consumers but creates no local binding, so a helper threw the
// first time anything called it. The suite was green because that phase's
// tests asserted on SOURCE TEXT and never invoked anything, and no test
// mounted the page. It reached production and nobody noticed until the next
// phase went looking.
//
// 119 pages, and before this only 50 were mounted by any test. The other 69
// could throw on first paint and the whole suite would stay green. This mounts
// every one of them.
//
// Deliberately a LOW bar. It does not assert content, because content is what
// the other 140 test files are for. It asserts the thing nothing else did:
// that a reader who clicks the link gets a page instead of a blank screen.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ROUTER_FUTURE } from './routerFuture.js';

// Same Supabase harness the other render tests use: every table resolves
// empty, so pages take their build-time fallback path.
const { makeQueryHarness } = vi.hoisted(() => {
  const makeQueryHarness = () => {
    function makeBuilder() {
      const promiseLike = {
        select() { return promiseLike; },
        order()  { return promiseLike; },
        limit()  { return promiseLike; },
        eq()     { return promiseLike; },
        then(resolve, reject) {
          return Promise.resolve({ data: [], error: null }).then(resolve, reject);
        },
      };
      return promiseLike;
    }
    return { from: () => makeBuilder() };
  };
  return { makeQueryHarness };
});
vi.mock('../supabaseClient.js', () => ({ supabase: makeQueryHarness() }));

// Vite resolves this at build time into a map of path -> dynamic importer.
const pageModules = import.meta.glob('../pages/**/*.js');

beforeEach(() => { cleanup(); });
afterEach(() => { cleanup(); });

describe('every page renders without throwing', () => {
  it('found the pages to test', () => {
    expect(Object.keys(pageModules).length).toBeGreaterThan(100);
  });

  it('mounts all of them', async () => {
    const failures = [];
    const skipped = [];
    let mounted = 0;
    // Some pages read route params (e.g. /buildings/:id). Mounting under a
    // wildcard route with a plausible entry gives them one rather than
    // exempting the page.
    for (const [path, load] of Object.entries(pageModules)) {
      let Page;
      try {
        const mod = await load();
        Page = mod.default;
      } catch (err) {
        failures.push(`${path} — import threw: ${err.message}`);
        continue;
      }
      if (typeof Page !== 'function') {
        // Not a page. The pages/ tree colocates helpers with the screens that
        // use them — hooks (useTable, useFactor), style objects (formStyles),
        // and sub-components (RecordsTable, PeriodNote). A page is a module
        // whose default export is a component; anything else is skipped and
        // counted, so this cannot quietly become "skip everything".
        skipped.push(path);
        continue;
      }
      try {
        render(
          <MemoryRouter future={ROUTER_FUTURE} initialEntries={['/x/1']}>
            <Routes>
              <Route path="/x/:id" element={<Page />} />
              <Route path="*" element={<Page />} />
            </Routes>
          </MemoryRouter>,
        );
        mounted += 1;
      } catch (err) {
        failures.push(`${path} — render threw: ${err.message}`);
      }
      cleanup();
    }
    expect(failures).toEqual([]);
    // A vacuous pass is the failure mode here: if the glob broke, or every
    // module got skipped, the loop above would find nothing and still be
    // green. Pin both the number actually MOUNTED and the size of the skip
    // list, so helpers cannot quietly grow to swallow real pages.
    expect(mounted).toBeGreaterThan(100);
    expect(skipped.length).toBeLessThanOrEqual(12);
  // 119 jsdom mounts do not fit in vitest's 5s default. One aggregate case
  // rather than 119, so a first run reports EVERY broken page at once
  // instead of stopping at the first.
  }, 180_000);
});
