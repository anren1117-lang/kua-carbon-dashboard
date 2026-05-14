// @vitest-environment jsdom
//
// Smoke test for the /admin/plan-agent page. Regression guard for a
// temporal-dead-zone crash: the keyboard-shortcuts useEffect's deps
// array referenced generatePlan / planChatOpen / narrative — all
// `const`s declared further down the component body. A deps array is
// evaluated synchronously at render, so this threw
// "Cannot access 'planChatOpen' before initialization" on every
// mount, and the page only ever showed the ErrorBoundary fallback.
// Introduced in Phase 128, fixed by moving the effect below those
// declarations.

import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminPlanAgent from '../pages/admin/AdminPlanAgent.js';

beforeEach(() => { cleanup(); localStorage.clear(); });

describe('AdminPlanAgent — render smoke test', () => {
  it('mounts without throwing a temporal-dead-zone ReferenceError', () => {
    expect(() => render(<MemoryRouter><AdminPlanAgent /></MemoryRouter>)).not.toThrow();
  });

  it('renders actual page content, not an empty tree', () => {
    const { container } = render(<MemoryRouter><AdminPlanAgent /></MemoryRouter>);
    expect(container.textContent.length).toBeGreaterThan(0);
    // The institutional-context step is the entry point of the page.
    expect(screen.getAllByText(/context/i).length).toBeGreaterThan(0);
  });
});
