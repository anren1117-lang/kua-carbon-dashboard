// @vitest-environment jsdom
//
// The last item of #20. TeacherPortal reads useMeasuredScopeTotals but sits
// behind a PasswordGate, so earlier phases deferred it rather than wire it
// blind — a test that cannot see the component would have been green for the
// wrong reason, which is worse than no test.
//
// It is a LEGACY gate (storageKey 'kua_teacher_unlocked', not the admin
// session path), so PasswordGate:52 unlocks on localStorage === 'true'. That
// makes an honest mount possible: unlock, inject a real fetch failure, and
// assert on the rendered DOM.
//
// The notice goes on PortalContents — the page-level component inside the gate
// — not on PortalScopeChart, which is where the hook happened to be called.
// One notice per page, not per chart, as since Phase 443.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ROUTER_FUTURE } from './routerFuture.js';

const { setNextResponses, makeQueryHarness } = vi.hoisted(() => {
  let responses = {};
  const setNextResponses = (next) => { responses = next; };
  const makeQueryHarness = () => {
    function makeBuilder(table) {
      const p = { select() { return p; }, order() { return p; }, limit() { return p; }, eq() { return p; },
        then(res, rej) { return Promise.resolve(responses[table] ?? { data: [], error: null }).then(res, rej); } };
      return p;
    }
    return { from: (table) => makeBuilder(table) };
  };
  return { setNextResponses, makeQueryHarness };
});

vi.mock('../supabaseClient.js', () => ({ supabase: makeQueryHarness() }));

import TeacherPortal from '../pages/TeacherPortal.js';
import { _resetCacheForTests } from '../hooks/measuredCache.js';

const TEACHER_KEY = 'kua_teacher_unlocked';
const unlock = () => localStorage.setItem(TEACHER_KEY, 'true');
const mount = () => render(<MemoryRouter future={ROUTER_FUTURE}><TeacherPortal /></MemoryRouter>);

beforeEach(() => { cleanup(); localStorage.clear(); _resetCacheForTests?.(); setNextResponses({}); });
afterEach(() => { cleanup(); localStorage.clear(); });

describe('TeacherPortal reports a failed fetch to the teacher', () => {
  it('the gate really is closed without the unlock — so the tests below mean something', () => {
    // If the gate never blocked, every assertion here would be about a page
    // that renders regardless, and the auth mock would be decoration.
    setNextResponses({});
    mount();
    expect(screen.queryByText(/Author AI-generated lessons/i)).toBeNull();
  });

  it('unlocking the gate renders the portal', async () => {
    unlock();
    setNextResponses({});
    mount();
    await waitFor(() => expect(screen.getByText(/Author AI-generated lessons/i)).toBeTruthy());
  });

  it('surfaces a failed fetch once the portal is open', async () => {
    unlock();
    setNextResponses({ fuel_bills: { data: null, error: { message: 'rls denied' } } });
    mount();
    await waitFor(() => expect(screen.getByText(/Live data unavailable/i)).toBeTruthy());
    expect(screen.getByText(/Live data unavailable/i).textContent).toMatch(/Scope 1/);
  });

  it('stays quiet when the tables are merely empty', async () => {
    unlock();
    setNextResponses({});
    mount();
    await waitFor(() => expect(screen.getByText(/Author AI-generated lessons/i)).toBeTruthy());
    expect(screen.queryByText(/Live data unavailable/i)).toBeNull();
  });

  it('shows ONE notice, not one per chart', async () => {
    unlock();
    setNextResponses({ fuel_bills: { data: null, error: { message: 'rls denied' } } });
    mount();
    await waitFor(() => expect(screen.getByText(/Live data unavailable/i)).toBeTruthy());
    expect(screen.getAllByText(/Live data unavailable/i)).toHaveLength(1);
  });
});
