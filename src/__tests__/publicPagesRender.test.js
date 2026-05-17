// @vitest-environment jsdom
//
// Render smoke tests for every public page. Same defense as Phase 198
// for the admin pages: the AdminPlanAgent TDZ crash went undetected
// for many phases because no test ever mounted the page. Public pages
// are user-facing — even higher stakes if one breaks. Mount each in a
// MemoryRouter (parameterized routes get a Routes shell + a sample
// path) and assert non-empty content.
//
// Pages already covered by dedicated tests are skipped here:
//   - Executive  (Executive.test.js)
//   - Goals      (Goals.test.js)
//   - Renewables (Renewables.test.js)
//   - App.test.js does the top-level smoke

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import Actions             from '../pages/Actions.js';
import AnnualReport        from '../pages/AnnualReport.js';
import Assistant           from '../pages/Assistant.js';
import Buildings           from '../pages/Buildings.js';
import CarbonChat          from '../pages/CarbonChat.js';
import CarbonCredits       from '../pages/CarbonCredits.js';
import DataAdmin           from '../pages/DataAdmin.js';
import Dining              from '../pages/Dining.js';
import Drawdown            from '../pages/Drawdown.js';
import EnvironmentNews     from '../pages/EnvironmentNews.js';
import Unsubscribe         from '../pages/Unsubscribe.js';
import PersonalFootprint   from '../pages/PersonalFootprint.js';
import CampusMap           from '../pages/CampusMap.js';
import BuildingDetail      from '../pages/BuildingDetail.js';
import DormLeaderboard     from '../pages/DormLeaderboard.js';
import EnergyChallenge     from '../pages/EnergyChallenge.js';
import Hotspots            from '../pages/Hotspots.js';
import Learn               from '../pages/Learn.js';
import LessonEditor        from '../pages/LessonEditor.js';
import LessonsCatalog      from '../pages/LessonsCatalog.js';
import Methodology         from '../pages/Methodology.js';
import NotFound            from '../pages/NotFound.js';
import Plan                from '../pages/Plan.js';
import Procurement         from '../pages/Procurement.js';
import Renewables2         from '../pages/Renewables2.js';
import Scenarios           from '../pages/Scenarios.js';
import Scope1              from '../pages/Scope1.js';
import Scope2              from '../pages/Scope2.js';
import Scope3              from '../pages/Scope3.js';
import Sinks               from '../pages/Sinks.js';
import Sinks2              from '../pages/Sinks2.js';
import StudentChallenges   from '../pages/StudentChallenges.js';
import StudentLesson       from '../pages/StudentLesson.js';
import Teacher             from '../pages/Teacher.js';
import TeacherLessonResults from '../pages/TeacherLessonResults.js';
import TeacherPortal       from '../pages/TeacherPortal.js';
import Transportation      from '../pages/Transportation.js';
import TrendBuilder        from '../pages/TrendBuilder.js';
import Waste               from '../pages/Waste.js';

// Plain page → mount in a bare router.
const plain = (Component, name) => [name, () => render(<MemoryRouter><Component /></MemoryRouter>)];

// Parameterized page → wrap in Routes so useParams() resolves.
const param = (Component, name, path, sample) => [
  name,
  () => render(
    <MemoryRouter initialEntries={[sample]}>
      <Routes><Route path={path} element={<Component />} /></Routes>
    </MemoryRouter>,
  ),
];

const pages = [
  plain(Actions,             'Actions'),
  plain(AnnualReport,        'AnnualReport'),
  plain(Assistant,           'Assistant'),
  plain(Buildings,           'Buildings'),
  plain(CarbonChat,          'CarbonChat'),
  plain(CarbonCredits,       'CarbonCredits'),
  plain(DataAdmin,           'DataAdmin'),
  plain(Dining,              'Dining'),
  plain(Drawdown,            'Drawdown'),
  plain(EnvironmentNews,     'EnvironmentNews'),
  plain(Unsubscribe,         'Unsubscribe'),
  plain(PersonalFootprint,   'PersonalFootprint'),
  plain(CampusMap,           'CampusMap'),
  // BuildingDetail mounted with a real building id from the registry
  // so the layout doesn't take the "not found" path.
  param(BuildingDetail,      'BuildingDetail', '/buildings/:id', '/buildings/b_miller'),
  // Same component on a bogus id to exercise the not-found branch.
  param(BuildingDetail,      'BuildingDetail (not found)', '/buildings/:id', '/buildings/b_nope'),
  plain(DormLeaderboard,     'DormLeaderboard'),
  plain(EnergyChallenge,     'EnergyChallenge'),
  plain(Hotspots,            'Hotspots'),
  plain(Learn,               'Learn'),
  plain(LessonEditor,        'LessonEditor'),
  plain(LessonsCatalog,      'LessonsCatalog'),
  plain(Methodology,         'Methodology'),
  plain(NotFound,            'NotFound'),
  plain(Plan,                'Plan'),
  plain(Procurement,         'Procurement'),
  plain(Renewables2,         'Renewables2'),
  plain(Scenarios,           'Scenarios'),
  plain(Scope1,              'Scope1'),
  plain(Scope2,              'Scope2'),
  plain(Scope3,              'Scope3'),
  plain(Sinks,               'Sinks'),
  plain(Sinks2,              'Sinks2'),
  plain(StudentChallenges,   'StudentChallenges'),
  param(StudentLesson,       'StudentLesson', '/student/lesson/:id', '/student/lesson/sample'),
  plain(Teacher,             'Teacher'),
  param(TeacherLessonResults,'TeacherLessonResults', '/teacher/results/:id', '/teacher/results/sample'),
  plain(TeacherPortal,       'TeacherPortal'),
  plain(Transportation,      'Transportation'),
  plain(TrendBuilder,        'TrendBuilder'),
  plain(Waste,               'Waste'),
];

beforeEach(() => { localStorage.clear(); });
afterEach(() => { cleanup(); });

describe('public pages — render smoke tests', () => {
  for (const [name, mount] of pages) {
    it(`${name} mounts without throwing and renders content`, () => {
      let result;
      expect(() => { result = mount(); }).not.toThrow();
      expect(result.container.textContent.length).toBeGreaterThan(0);
    });
  }
});
