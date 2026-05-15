// @vitest-environment jsdom
//
// Render smoke tests for the admin per-scope sub-route pages — the
// ones reached at /admin/scope-1/heating-oil, /admin/scope-3/cat-1,
// etc. These are the data-entry forms admins use day-to-day, so a
// crash here blocks data going in. Same defense as phases 198-199.

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// scope1
import HeatingOil   from '../pages/admin/scope1/HeatingOil.js';
import Propane      from '../pages/admin/scope1/Propane.js';
import Fleet        from '../pages/admin/scope1/Fleet.js';
import Refrigerants from '../pages/admin/scope1/Refrigerants.js';
// scope2
import MeterReading from '../pages/admin/scope2/MeterReading.js';
// scope3
import Cat1PurchasedGoods from '../pages/admin/scope3/Cat1PurchasedGoods.js';
import Cat3UpstreamFuel   from '../pages/admin/scope3/Cat3UpstreamFuel.js';
import Cat5Waste          from '../pages/admin/scope3/Cat5Waste.js';
import Cat6BusinessTravel from '../pages/admin/scope3/Cat6BusinessTravel.js';
import Cat7Commuting      from '../pages/admin/scope3/Cat7Commuting.js';
import StudentDay         from '../pages/admin/scope3/StudentDay.js';
import StudentUSBoarding  from '../pages/admin/scope3/StudentUSBoarding.js';
import StudentInternational from '../pages/admin/scope3/StudentInternational.js';
import StudyAbroad        from '../pages/admin/scope3/StudyAbroad.js';
// sinks
import ForestStands from '../pages/admin/sinks/ForestStands.js';
import TreeInventory from '../pages/admin/sinks/TreeInventory.js';
import SoilSample   from '../pages/admin/sinks/SoilSample.js';
// renewables
import Solar      from '../pages/admin/renewables/Solar.js';
import Geothermal from '../pages/admin/renewables/Geothermal.js';
import Wind       from '../pages/admin/renewables/Wind.js';

const pages = [
  ['HeatingOil',           HeatingOil],
  ['Propane',              Propane],
  ['Fleet',                Fleet],
  ['Refrigerants',         Refrigerants],
  ['MeterReading',         MeterReading],
  ['Cat1PurchasedGoods',   Cat1PurchasedGoods],
  ['Cat3UpstreamFuel',     Cat3UpstreamFuel],
  ['Cat5Waste',            Cat5Waste],
  ['Cat6BusinessTravel',   Cat6BusinessTravel],
  ['Cat7Commuting',        Cat7Commuting],
  ['StudentDay',           StudentDay],
  ['StudentUSBoarding',    StudentUSBoarding],
  ['StudentInternational', StudentInternational],
  ['StudyAbroad',          StudyAbroad],
  ['ForestStands',         ForestStands],
  ['TreeInventory',        TreeInventory],
  ['SoilSample',           SoilSample],
  ['Solar',                Solar],
  ['Geothermal',           Geothermal],
  ['Wind',                 Wind],
];

beforeEach(() => { localStorage.clear(); });
afterEach(() => { cleanup(); });

describe('admin sub-route pages — render smoke tests', () => {
  for (const [name, Component] of pages) {
    it(`${name} mounts without throwing and renders content`, () => {
      let result;
      expect(() => { result = render(<MemoryRouter><Component /></MemoryRouter>); }).not.toThrow();
      expect(result.container.textContent.length).toBeGreaterThan(0);
    });
  }
});
