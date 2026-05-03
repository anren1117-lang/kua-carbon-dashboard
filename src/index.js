import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';

// All non-homepage routes are lazy-loaded so the initial bundle stays small.
// Homepage (App) and Layout stay eager so first paint is fast.
const Scope1 = lazy(() => import('./pages/Scope1'));
const Scope2 = lazy(() => import('./pages/Scope2'));
const Scope3 = lazy(() => import('./pages/Scope3'));
const Renewables = lazy(() => import('./pages/Renewables'));
const Renewables2 = lazy(() => import('./pages/Renewables2'));
const Sinks = lazy(() => import('./pages/Sinks'));
const Sinks2 = lazy(() => import('./pages/Sinks2'));
const Executive = lazy(() => import('./pages/Executive'));
const TrendBuilder = lazy(() => import('./pages/TrendBuilder'));
const Goals = lazy(() => import('./pages/Goals'));
const AnnualReport = lazy(() => import('./pages/AnnualReport'));
const Scenarios = lazy(() => import('./pages/Scenarios'));
const Methodology = lazy(() => import('./pages/Methodology'));
const CarbonCredits = lazy(() => import('./pages/CarbonCredits'));
const Learn = lazy(() => import('./pages/Learn'));
const Assistant = lazy(() => import('./pages/Assistant'));
const Hotspots = lazy(() => import('./pages/Hotspots'));
const Actions = lazy(() => import('./pages/Actions'));
const BuildingsPage = lazy(() => import('./pages/Buildings'));
const Dining = lazy(() => import('./pages/Dining'));
const Transportation = lazy(() => import('./pages/Transportation'));
const StudentChallenges = lazy(() => import('./pages/StudentChallenges'));
const DataAdmin = lazy(() => import('./pages/DataAdmin'));
const CarbonChat = lazy(() => import('./pages/CarbonChat'));
const Teacher = lazy(() => import('./pages/Teacher'));
const TeacherPortal = lazy(() => import('./pages/TeacherPortal'));
const LessonEditor = lazy(() => import('./pages/LessonEditor'));
const StudentLesson = lazy(() => import('./pages/StudentLesson'));
const LessonsCatalog = lazy(() => import('./pages/LessonsCatalog'));
const TeacherLessonResults = lazy(() => import('./pages/TeacherLessonResults'));
const Plan = lazy(() => import('./pages/Plan'));
const Drawdown = lazy(() => import('./pages/Drawdown'));
const Waste = lazy(() => import('./pages/Waste'));
const Procurement = lazy(() => import('./pages/Procurement'));

// Admin tree — also lazy. Most users never hit /admin.
const AdminPortal = lazy(() => import('./AdminPortal'));
const AdminHome = lazy(() => import('./pages/admin/AdminHome'));
const AdminScope1 = lazy(() => import('./pages/admin/AdminScope1'));
const AdminScope2 = lazy(() => import('./pages/admin/AdminScope2'));
const AdminScope3 = lazy(() => import('./pages/admin/AdminScope3'));
const AdminRenewables = lazy(() => import('./pages/admin/AdminRenewables'));
const AdminSinks = lazy(() => import('./pages/admin/AdminSinks'));
const AdminMethodology = lazy(() => import('./pages/admin/AdminMethodology'));
const AdminFramework = lazy(() => import('./pages/admin/AdminFramework'));
const AdminActions = lazy(() => import('./pages/admin/AdminActions'));
const AdminAIIngestion = lazy(() => import('./pages/admin/AdminAIIngestion'));
const HeatingOil = lazy(() => import('./pages/admin/scope1/HeatingOil'));
const Propane = lazy(() => import('./pages/admin/scope1/Propane'));
const Refrigerants = lazy(() => import('./pages/admin/scope1/Refrigerants'));
const Fleet = lazy(() => import('./pages/admin/scope1/Fleet'));
const MeterReading = lazy(() => import('./pages/admin/scope2/MeterReading'));
const Solar = lazy(() => import('./pages/admin/renewables/Solar'));
const Geothermal = lazy(() => import('./pages/admin/renewables/Geothermal'));
const Wind = lazy(() => import('./pages/admin/renewables/Wind'));
const TreeInventory = lazy(() => import('./pages/admin/sinks/TreeInventory'));
const SoilSample = lazy(() => import('./pages/admin/sinks/SoilSample'));
const Cat1PurchasedGoods = lazy(() => import('./pages/admin/scope3/Cat1PurchasedGoods'));
const Cat3UpstreamFuel = lazy(() => import('./pages/admin/scope3/Cat3UpstreamFuel'));
const Cat5Waste = lazy(() => import('./pages/admin/scope3/Cat5Waste'));
const Cat6BusinessTravel = lazy(() => import('./pages/admin/scope3/Cat6BusinessTravel'));
const Cat7Commuting = lazy(() => import('./pages/admin/scope3/Cat7Commuting'));
const StudentDay = lazy(() => import('./pages/admin/scope3/StudentDay'));
const StudentUSBoarding = lazy(() => import('./pages/admin/scope3/StudentUSBoarding'));
const StudentInternational = lazy(() => import('./pages/admin/scope3/StudentInternational'));
const StudyAbroad = lazy(() => import('./pages/admin/scope3/StudyAbroad'));

function PageFallback() {
  return (
    <div style={{ padding: 32, color: '#94a3b8', fontSize: 14, textAlign: 'center' }}>
      Loading…
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<App />} />
            <Route path="/scope-1" element={<Scope1 />} />
            <Route path="/scope-2" element={<Scope2 />} />
            <Route path="/scope-3" element={<Scope3 />} />
            <Route path="/renewables" element={<Renewables />} />
            <Route path="/renewables-os" element={<Renewables2 />} />
            <Route path="/sinks" element={<Sinks />} />
            <Route path="/sinks-os" element={<Sinks2 />} />
            <Route path="/executive" element={<Executive />} />
            <Route path="/trends" element={<TrendBuilder />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/report" element={<AnnualReport />} />
            <Route path="/scenarios" element={<Scenarios />} />
            <Route path="/methodology" element={<Methodology />} />
            <Route path="/credits" element={<CarbonCredits />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/ask" element={<Assistant />} />
            <Route path="/hotspots" element={<Hotspots />} />
            <Route path="/actions" element={<Actions />} />
            <Route path="/buildings" element={<BuildingsPage />} />
            <Route path="/dining" element={<Dining />} />
            <Route path="/transportation" element={<Transportation />} />
            <Route path="/challenges" element={<StudentChallenges />} />
            <Route path="/data-admin" element={<DataAdmin />} />
            <Route path="/chatbot" element={<CarbonChat />} />
            <Route path="/teacher" element={<TeacherPortal />} />
            <Route path="/teacher/lessons" element={<Teacher />} />
            <Route path="/teacher/create" element={<LessonEditor />} />
            <Route path="/lessons" element={<LessonsCatalog />} />
            <Route path="/lessons/:id" element={<StudentLesson />} />
            <Route path="/teacher/results/:lessonId" element={<TeacherLessonResults />} />
            <Route path="/plan" element={<Plan />} />
            <Route path="/drawdown" element={<Drawdown />} />
            <Route path="/waste" element={<Waste />} />
            <Route path="/procurement" element={<Procurement />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminHome />} />
            <Route path="framework" element={<AdminFramework />} />
            <Route path="ai-ingestion" element={<AdminAIIngestion />} />

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
            <Route path="actions" element={<AdminActions />} />
            <Route path="legacy" element={<AdminPortal />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>
);
