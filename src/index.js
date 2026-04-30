import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import AdminPortal from './AdminPortal';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Scope1 from './pages/Scope1';
import Scope2 from './pages/Scope2';
import Scope3 from './pages/Scope3';
import Renewables from './pages/Renewables';
import Sinks from './pages/Sinks';
import Scenarios from './pages/Scenarios';
import Methodology from './pages/Methodology';
import AdminHome from './pages/admin/AdminHome';
import AdminScope1 from './pages/admin/AdminScope1';
import AdminScope2 from './pages/admin/AdminScope2';
import AdminScope3 from './pages/admin/AdminScope3';
import AdminRenewables from './pages/admin/AdminRenewables';
import AdminSinks from './pages/admin/AdminSinks';
import AdminMethodology from './pages/admin/AdminMethodology';
import AdminFramework from './pages/admin/AdminFramework';
import HeatingOil from './pages/admin/scope1/HeatingOil';
import Propane from './pages/admin/scope1/Propane';
import Refrigerants from './pages/admin/scope1/Refrigerants';
import Fleet from './pages/admin/scope1/Fleet';
import MeterReading from './pages/admin/scope2/MeterReading';
import Solar from './pages/admin/renewables/Solar';
import Geothermal from './pages/admin/renewables/Geothermal';
import Wind from './pages/admin/renewables/Wind';
import TreeInventory from './pages/admin/sinks/TreeInventory';
import SoilSample from './pages/admin/sinks/SoilSample';
import Cat1PurchasedGoods from './pages/admin/scope3/Cat1PurchasedGoods';
import Cat3UpstreamFuel from './pages/admin/scope3/Cat3UpstreamFuel';
import Cat5Waste from './pages/admin/scope3/Cat5Waste';
import Cat6BusinessTravel from './pages/admin/scope3/Cat6BusinessTravel';
import Cat7Commuting from './pages/admin/scope3/Cat7Commuting';
import StudentDay from './pages/admin/scope3/StudentDay';
import StudentUSBoarding from './pages/admin/scope3/StudentUSBoarding';
import StudentInternational from './pages/admin/scope3/StudentInternational';
import StudyAbroad from './pages/admin/scope3/StudyAbroad';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<App />} />
          <Route path="/scope-1" element={<Scope1 />} />
          <Route path="/scope-2" element={<Scope2 />} />
          <Route path="/scope-3" element={<Scope3 />} />
          <Route path="/renewables" element={<Renewables />} />
          <Route path="/sinks" element={<Sinks />} />
          <Route path="/scenarios" element={<Scenarios />} />
          <Route path="/methodology" element={<Methodology />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="framework" element={<AdminFramework />} />

          <Route path="scope-1" element={<AdminScope1 />} />
          <Route path="scope-1/heating-oil" element={<HeatingOil />} />
          <Route path="scope-1/propane" element={<Propane />} />
          <Route path="scope-1/refrigerants" element={<Refrigerants />} />
          <Route path="scope-1/fleet" element={<Fleet />} />

          <Route path="scope-2" element={<AdminScope2 />} />
          <Route path="scope-2/meter" element={<MeterReading />} />

          <Route path="scope-3" element={<AdminScope3 />} />
          <Route path="scope-3/cat-1" element={<Cat1PurchasedGoods />} />
          <Route path="scope-3/cat-3" element={<Cat3UpstreamFuel />} />
          <Route path="scope-3/cat-5" element={<Cat5Waste />} />
          <Route path="scope-3/cat-6" element={<Cat6BusinessTravel />} />
          <Route path="scope-3/cat-7" element={<Cat7Commuting />} />
          <Route path="scope-3/student-day" element={<StudentDay />} />
          <Route path="scope-3/student-us-boarding" element={<StudentUSBoarding />} />
          <Route path="scope-3/student-international" element={<StudentInternational />} />
          <Route path="scope-3/study-abroad" element={<StudyAbroad />} />

          <Route path="renewables" element={<AdminRenewables />} />
          <Route path="renewables/solar" element={<Solar />} />
          <Route path="renewables/geothermal" element={<Geothermal />} />
          <Route path="renewables/wind" element={<Wind />} />

          <Route path="sinks" element={<AdminSinks />} />
          <Route path="sinks/trees" element={<TreeInventory />} />
          <Route path="sinks/soil" element={<SoilSample />} />

          <Route path="methodology" element={<AdminMethodology />} />
          <Route path="legacy" element={<AdminPortal />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
