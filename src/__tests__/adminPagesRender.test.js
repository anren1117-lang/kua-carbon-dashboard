// @vitest-environment jsdom
//
// Render smoke tests for every admin page. AdminPlanAgent had a
// temporal-dead-zone crash that went undetected for many phases
// because no test ever mounted the page (Phase 197). The other admin
// pages are the same risk: complex state, multiple useEffects, lots
// of dependencies — exactly the conditions where TDZ ordering bugs
// hide. One test per page, each asserts mount-without-throwing plus
// non-empty content. Catches the next ReferenceError before it ships.
//
// AdminPlanAgent has its own dedicated test file with that bug's
// regression detail; not duplicated here.

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import AdminAIIngestion  from '../pages/admin/AdminAIIngestion.js';
import AdminAIAccuracy   from '../pages/admin/AdminAIAccuracy.js';
import AdminActions      from '../pages/admin/AdminActions.js';
import AdminAlerts       from '../pages/admin/AdminAlerts.js';
import AdminAuditLog     from '../pages/admin/AdminAuditLog.js';
import AdminBmsExport    from '../pages/admin/AdminBmsExport.js';
import AdminDataQuality  from '../pages/admin/AdminDataQuality.js';
import AdminFacilities   from '../pages/admin/AdminFacilities.js';
import AdminFramework    from '../pages/admin/AdminFramework.js';
import AdminHome         from '../pages/admin/AdminHome.js';
import AdminMethodology  from '../pages/admin/AdminMethodology.js';
import AdminRenewables   from '../pages/admin/AdminRenewables.js';
import AdminScope1       from '../pages/admin/AdminScope1.js';
import AdminScope2       from '../pages/admin/AdminScope2.js';
import AdminScope3       from '../pages/admin/AdminScope3.js';
import AdminSinks        from '../pages/admin/AdminSinks.js';
import AdminStagePlanner from '../pages/admin/AdminStagePlanner.js';

const pages = [
  ['AdminHome',         AdminHome,         '/admin'],
  ['AdminAIIngestion',  AdminAIIngestion,  '/admin/ai-ingestion'],
  ['AdminAIAccuracy',   AdminAIAccuracy,   '/admin/ai-accuracy'],
  ['AdminActions',      AdminActions,      '/admin/actions'],
  ['AdminAlerts',       AdminAlerts,       '/admin/alerts'],
  ['AdminAuditLog',     AdminAuditLog,     '/admin/audit-log'],
  ['AdminBmsExport',    AdminBmsExport,    '/admin/bms-export'],
  ['AdminDataQuality',  AdminDataQuality,  '/admin/data-quality'],
  ['AdminFacilities',   AdminFacilities,   '/admin/facilities'],
  ['AdminFramework',    AdminFramework,    '/admin/framework'],
  ['AdminMethodology',  AdminMethodology,  '/admin/methodology'],
  ['AdminRenewables',   AdminRenewables,   '/admin/renewables'],
  ['AdminScope1',       AdminScope1,       '/admin/scope-1'],
  ['AdminScope2',       AdminScope2,       '/admin/scope-2'],
  ['AdminScope3',       AdminScope3,       '/admin/scope-3'],
  ['AdminSinks',        AdminSinks,        '/admin/sinks'],
  ['AdminStagePlanner', AdminStagePlanner, '/admin/stage-planner'],
];

// AdminScope* pages route by sub-path (e.g. /admin/scope-1/heating-oil),
// so wrap them in a Routes shell rather than rendering bare. Bare
// rendering still exercises the mount path, which is the TDZ-catching
// part of this sweep.
function mountAt(Component, path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={`${path}/*`} element={<Component />} />
        <Route path={path} element={<Component />} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => { localStorage.clear(); });
afterEach(() => { cleanup(); });

describe('admin pages — render smoke tests', () => {
  for (const [name, Component, path] of pages) {
    it(`${name} mounts without throwing and renders content`, () => {
      let result;
      expect(() => { result = mountAt(Component, path); }).not.toThrow();
      expect(result.container.textContent.length).toBeGreaterThan(0);
    });
  }
});
