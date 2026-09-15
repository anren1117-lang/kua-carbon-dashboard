import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Layout from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary.js';
import { hydrateBmsMeterMap } from './data/bmsExportMapping.js';

// AdminLayout is heavy (nav dropdowns, login form, breadcrumb,
// expiry handlers) and only matters for the small subset of users
// who hit /admin. Lazy-loading it shaves several KB off the
// public-site initial bundle.
const AdminLayout = lazy(() => import('./components/AdminLayout'));

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
const APESContent = lazy(() => import('./pages/APESContent'));
const APESWorksheet = lazy(() => import('./pages/APESWorksheet'));
const APBioContent = lazy(() => import('./pages/APBioContent'));
const APBioWorksheet = lazy(() => import('./pages/APBioWorksheet'));
const APChemContent = lazy(() => import('./pages/APChemContent'));
const APChemWorksheet = lazy(() => import('./pages/APChemWorksheet'));
const APStatsContent = lazy(() => import('./pages/APStatsContent'));
const APStatsWorksheet = lazy(() => import('./pages/APStatsWorksheet'));
const APUSGovContent = lazy(() => import('./pages/APUSGovContent'));
const APUSGovWorksheet = lazy(() => import('./pages/APUSGovWorksheet'));
const APCalcABContent = lazy(() => import('./pages/APCalcABContent'));
const APCalcABWorksheet = lazy(() => import('./pages/APCalcABWorksheet'));
const APPsychContent = lazy(() => import('./pages/APPsychContent'));
const APPsychWorksheet = lazy(() => import('./pages/APPsychWorksheet'));
const APMacroContent = lazy(() => import('./pages/APMacroContent'));
const APMacroWorksheet = lazy(() => import('./pages/APMacroWorksheet'));
const APMicroContent = lazy(() => import('./pages/APMicroContent'));
const APMicroWorksheet = lazy(() => import('./pages/APMicroWorksheet'));
const APHugContent = lazy(() => import('./pages/APHugContent'));
const APHugWorksheet = lazy(() => import('./pages/APHugWorksheet'));
const APCSPContent = lazy(() => import('./pages/APCSPContent'));
const APCSPWorksheet = lazy(() => import('./pages/APCSPWorksheet'));
const APPhys1Content = lazy(() => import('./pages/APPhys1Content'));
const APPhys1Worksheet = lazy(() => import('./pages/APPhys1Worksheet'));
const APUSHContent = lazy(() => import('./pages/APUSHContent'));
const APUSHWorksheet = lazy(() => import('./pages/APUSHWorksheet'));
const APWorldContent = lazy(() => import('./pages/APWorldContent'));
const APWorldWorksheet = lazy(() => import('./pages/APWorldWorksheet'));
const APEngLangContent = lazy(() => import('./pages/APEngLangContent'));
const APEngLangWorksheet = lazy(() => import('./pages/APEngLangWorksheet'));
const APCSAContent = lazy(() => import('./pages/APCSAContent'));
const APCSAWorksheet = lazy(() => import('./pages/APCSAWorksheet'));
const APEngLitContent = lazy(() => import('./pages/APEngLitContent'));
const APEngLitWorksheet = lazy(() => import('./pages/APEngLitWorksheet'));
const APEuroContent = lazy(() => import('./pages/APEuroContent'));
const APEuroWorksheet = lazy(() => import('./pages/APEuroWorksheet'));
const APCompContent = lazy(() => import('./pages/APCompContent'));
const APCompWorksheet = lazy(() => import('./pages/APCompWorksheet'));
const APArtContent = lazy(() => import('./pages/APArtContent'));
const APArtWorksheet = lazy(() => import('./pages/APArtWorksheet'));
const APMusicContent = lazy(() => import('./pages/APMusicContent'));
const APMusicWorksheet = lazy(() => import('./pages/APMusicWorksheet'));
const APSpanishContent = lazy(() => import('./pages/APSpanishContent'));
const APSpanishWorksheet = lazy(() => import('./pages/APSpanishWorksheet'));
const APFrenchContent = lazy(() => import('./pages/APFrenchContent'));
const APFrenchWorksheet = lazy(() => import('./pages/APFrenchWorksheet'));
const APLatinContent = lazy(() => import('./pages/APLatinContent'));
const APLatinWorksheet = lazy(() => import('./pages/APLatinWorksheet'));
const APCalcBCContent = lazy(() => import('./pages/APCalcBCContent'));
const APCalcBCWorksheet = lazy(() => import('./pages/APCalcBCWorksheet'));
const APPhys2Content = lazy(() => import('./pages/APPhys2Content'));
const APPhys2Worksheet = lazy(() => import('./pages/APPhys2Worksheet'));
const APPrecalcContent = lazy(() => import('./pages/APPrecalcContent'));
const APPrecalcWorksheet = lazy(() => import('./pages/APPrecalcWorksheet'));
const APPhysCMechContent = lazy(() => import('./pages/APPhysCMechContent'));
const APPhysCMechWorksheet = lazy(() => import('./pages/APPhysCMechWorksheet'));
const APPhysCEMContent = lazy(() => import('./pages/APPhysCEMContent'));
const APPhysCEMWorksheet = lazy(() => import('./pages/APPhysCEMWorksheet'));
const APAfAmContent = lazy(() => import('./pages/APAfAmContent'));
const APAfAmWorksheet = lazy(() => import('./pages/APAfAmWorksheet'));
const APSeminarContent = lazy(() => import('./pages/APSeminarContent'));
const APSeminarWorksheet = lazy(() => import('./pages/APSeminarWorksheet'));
const APResearchContent = lazy(() => import('./pages/APResearchContent'));
const APResearchWorksheet = lazy(() => import('./pages/APResearchWorksheet'));
const APItalianContent = lazy(() => import('./pages/APItalianContent'));
const APItalianWorksheet = lazy(() => import('./pages/APItalianWorksheet'));
const APGermanContent = lazy(() => import('./pages/APGermanContent'));
const APGermanWorksheet = lazy(() => import('./pages/APGermanWorksheet'));
const APIndex = lazy(() => import('./pages/APIndex'));
const Plan = lazy(() => import('./pages/Plan'));
const Drawdown = lazy(() => import('./pages/Drawdown'));
const Waste = lazy(() => import('./pages/Waste'));
const Procurement = lazy(() => import('./pages/Procurement'));
const EnvironmentNews = lazy(() => import('./pages/EnvironmentNews'));
const Unsubscribe = lazy(() => import('./pages/Unsubscribe'));
const PersonalFootprint = lazy(() => import('./pages/PersonalFootprint'));
const CampusMap = lazy(() => import('./pages/CampusMap'));
const BuildingDetail = lazy(() => import('./pages/BuildingDetail'));
const DormLeaderboard = lazy(() => import('./pages/DormLeaderboard'));
const EnergyChallenge = lazy(() => import('./pages/EnergyChallenge'));
const Faq = lazy(() => import('./pages/Faq'));
const Share = lazy(() => import('./pages/Share'));
const MonthlyDigest = lazy(() => import('./pages/MonthlyDigest'));
const DormPosters = lazy(() => import('./pages/DormPosters'));
const CarbonMath = lazy(() => import('./pages/CarbonMath'));
const MonthCompare = lazy(() => import('./pages/MonthCompare'));
const CompareBuildings = lazy(() => import('./pages/CompareBuildings'));
const WhatsNew = lazy(() => import('./pages/WhatsNew'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin tree — also lazy. Most users never hit /admin.
const AdminHome = lazy(() => import('./pages/admin/AdminHome'));
const AdminScope1 = lazy(() => import('./pages/admin/AdminScope1'));
const AdminScope2 = lazy(() => import('./pages/admin/AdminScope2'));
const AdminScope3 = lazy(() => import('./pages/admin/AdminScope3'));
const AdminRenewables = lazy(() => import('./pages/admin/AdminRenewables'));
const AdminSinks = lazy(() => import('./pages/admin/AdminSinks'));
const AdminMethodology = lazy(() => import('./pages/admin/AdminMethodology'));
const AdminAuditLog = lazy(() => import('./pages/admin/AdminAuditLog'));
const AdminDataQuality = lazy(() => import('./pages/admin/AdminDataQuality'));
const AdminFramework = lazy(() => import('./pages/admin/AdminFramework'));
const AdminActions = lazy(() => import('./pages/admin/AdminActions'));
const AdminPlanAgent = lazy(() => import('./pages/admin/AdminPlanAgent'));
const AdminStagePlanner = lazy(() => import('./pages/admin/AdminStagePlanner'));
const AdminFacilities = lazy(() => import('./pages/admin/AdminFacilities'));
const AdminBmsExport = lazy(() => import('./pages/admin/AdminBmsExport'));
const AdminAIIngestion = lazy(() => import('./pages/admin/AdminAIIngestion'));
const AdminAIAccuracy = lazy(() => import('./pages/admin/AdminAIAccuracy'));
const AdminAlerts = lazy(() => import('./pages/admin/AdminAlerts'));
const HeatingOil = lazy(() => import('./pages/admin/scope1/HeatingOil'));
const Propane = lazy(() => import('./pages/admin/scope1/Propane'));
const Refrigerants = lazy(() => import('./pages/admin/scope1/Refrigerants'));
const Fleet = lazy(() => import('./pages/admin/scope1/Fleet'));
const MeterReading = lazy(() => import('./pages/admin/scope2/MeterReading'));
const MeterTrendsUpload = lazy(() => import('./pages/admin/scope2/MeterTrendsUpload'));
const Solar = lazy(() => import('./pages/admin/renewables/Solar'));
const Geothermal = lazy(() => import('./pages/admin/renewables/Geothermal'));
const Wind = lazy(() => import('./pages/admin/renewables/Wind'));
const TreeInventory = lazy(() => import('./pages/admin/sinks/TreeInventory'));
const SoilSample = lazy(() => import('./pages/admin/sinks/SoilSample'));
const ForestStands = lazy(() => import('./pages/admin/sinks/ForestStands'));
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

// Fill the shared meter→building mapping cache at startup. A missing table or
// a slow network just leaves this browser's localStorage copy in place; pages
// rendered before it lands pick it up on the next navigation.
void hydrateBmsMeterMap();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ErrorBoundary>
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
            <Route path="/news" element={<EnvironmentNews />} />
            <Route path="/unsubscribe" element={<Unsubscribe />} />
            <Route path="/your-footprint" element={<PersonalFootprint />} />
            <Route path="/campus-map" element={<CampusMap />} />
            <Route path="/buildings/:id" element={<BuildingDetail />} />
            <Route path="/dorm-leaderboard" element={<DormLeaderboard />} />
            <Route path="/challenge" element={<EnergyChallenge />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/share" element={<Share />} />
            <Route path="/digest" element={<MonthlyDigest />} />
            <Route path="/dorm-posters" element={<DormPosters />} />
            <Route path="/carbon-math" element={<CarbonMath />} />
            <Route path="/compare" element={<MonthCompare />} />
            <Route path="/compare-buildings" element={<CompareBuildings />} />
            <Route path="/whats-new" element={<WhatsNew />} />
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
            <Route path="/teacher/ap/apes" element={<APESContent />} />
            <Route path="/teacher/ap/apes/unit/:unitNum/worksheet" element={<APESWorksheet />} />
            <Route path="/teacher/ap/apbio" element={<APBioContent />} />
            <Route path="/teacher/ap/apbio/unit/:unitNum/worksheet" element={<APBioWorksheet />} />
            <Route path="/teacher/ap/apchem" element={<APChemContent />} />
            <Route path="/teacher/ap/apchem/unit/:unitNum/worksheet" element={<APChemWorksheet />} />
            <Route path="/teacher/ap/apstats" element={<APStatsContent />} />
            <Route path="/teacher/ap/apstats/unit/:unitNum/worksheet" element={<APStatsWorksheet />} />
            <Route path="/teacher/ap/apusgov" element={<APUSGovContent />} />
            <Route path="/teacher/ap/apusgov/unit/:unitNum/worksheet" element={<APUSGovWorksheet />} />
            <Route path="/teacher/ap/apcalcab" element={<APCalcABContent />} />
            <Route path="/teacher/ap/apcalcab/unit/:unitNum/worksheet" element={<APCalcABWorksheet />} />
            <Route path="/teacher/ap/appsych" element={<APPsychContent />} />
            <Route path="/teacher/ap/appsych/unit/:unitNum/worksheet" element={<APPsychWorksheet />} />
            <Route path="/teacher/ap/apmacro" element={<APMacroContent />} />
            <Route path="/teacher/ap/apmacro/unit/:unitNum/worksheet" element={<APMacroWorksheet />} />
            <Route path="/teacher/ap/apmicro" element={<APMicroContent />} />
            <Route path="/teacher/ap/apmicro/unit/:unitNum/worksheet" element={<APMicroWorksheet />} />
            <Route path="/teacher/ap/aphug" element={<APHugContent />} />
            <Route path="/teacher/ap/aphug/unit/:unitNum/worksheet" element={<APHugWorksheet />} />
            <Route path="/teacher/ap/apcsp" element={<APCSPContent />} />
            <Route path="/teacher/ap/apcsp/unit/:unitNum/worksheet" element={<APCSPWorksheet />} />
            <Route path="/teacher/ap/apphys1" element={<APPhys1Content />} />
            <Route path="/teacher/ap/apphys1/unit/:unitNum/worksheet" element={<APPhys1Worksheet />} />
            <Route path="/teacher/ap/apush" element={<APUSHContent />} />
            <Route path="/teacher/ap/apush/unit/:unitNum/worksheet" element={<APUSHWorksheet />} />
            <Route path="/teacher/ap/apworld" element={<APWorldContent />} />
            <Route path="/teacher/ap/apworld/unit/:unitNum/worksheet" element={<APWorldWorksheet />} />
            <Route path="/teacher/ap/apenglang" element={<APEngLangContent />} />
            <Route path="/teacher/ap/apenglang/unit/:unitNum/worksheet" element={<APEngLangWorksheet />} />
            <Route path="/teacher/ap/apcsa" element={<APCSAContent />} />
            <Route path="/teacher/ap/apcsa/unit/:unitNum/worksheet" element={<APCSAWorksheet />} />
            <Route path="/teacher/ap/apenglit" element={<APEngLitContent />} />
            <Route path="/teacher/ap/apenglit/unit/:unitNum/worksheet" element={<APEngLitWorksheet />} />
            <Route path="/teacher/ap/apeuro" element={<APEuroContent />} />
            <Route path="/teacher/ap/apeuro/unit/:unitNum/worksheet" element={<APEuroWorksheet />} />
            <Route path="/teacher/ap/apcomp" element={<APCompContent />} />
            <Route path="/teacher/ap/apcomp/unit/:unitNum/worksheet" element={<APCompWorksheet />} />
            <Route path="/teacher/ap/apart" element={<APArtContent />} />
            <Route path="/teacher/ap/apart/unit/:unitNum/worksheet" element={<APArtWorksheet />} />
            <Route path="/teacher/ap/apmusic" element={<APMusicContent />} />
            <Route path="/teacher/ap/apmusic/unit/:unitNum/worksheet" element={<APMusicWorksheet />} />
            <Route path="/teacher/ap/apspanish" element={<APSpanishContent />} />
            <Route path="/teacher/ap/apspanish/unit/:unitNum/worksheet" element={<APSpanishWorksheet />} />
            <Route path="/teacher/ap/apfrench" element={<APFrenchContent />} />
            <Route path="/teacher/ap/apfrench/unit/:unitNum/worksheet" element={<APFrenchWorksheet />} />
            <Route path="/teacher/ap/aplatin" element={<APLatinContent />} />
            <Route path="/teacher/ap/aplatin/unit/:unitNum/worksheet" element={<APLatinWorksheet />} />
            <Route path="/teacher/ap/apcalcbc" element={<APCalcBCContent />} />
            <Route path="/teacher/ap/apcalcbc/unit/:unitNum/worksheet" element={<APCalcBCWorksheet />} />
            <Route path="/teacher/ap/apphys2" element={<APPhys2Content />} />
            <Route path="/teacher/ap/apphys2/unit/:unitNum/worksheet" element={<APPhys2Worksheet />} />
            <Route path="/teacher/ap/apprecalc" element={<APPrecalcContent />} />
            <Route path="/teacher/ap/apprecalc/unit/:unitNum/worksheet" element={<APPrecalcWorksheet />} />
            <Route path="/teacher/ap/apphyscmech" element={<APPhysCMechContent />} />
            <Route path="/teacher/ap/apphyscmech/unit/:unitNum/worksheet" element={<APPhysCMechWorksheet />} />
            <Route path="/teacher/ap/apphyscem" element={<APPhysCEMContent />} />
            <Route path="/teacher/ap/apphyscem/unit/:unitNum/worksheet" element={<APPhysCEMWorksheet />} />
            <Route path="/teacher/ap/apafam" element={<APAfAmContent />} />
            <Route path="/teacher/ap/apafam/unit/:unitNum/worksheet" element={<APAfAmWorksheet />} />
            <Route path="/teacher/ap/apseminar" element={<APSeminarContent />} />
            <Route path="/teacher/ap/apseminar/unit/:unitNum/worksheet" element={<APSeminarWorksheet />} />
            <Route path="/teacher/ap/apresearch" element={<APResearchContent />} />
            <Route path="/teacher/ap/apresearch/unit/:unitNum/worksheet" element={<APResearchWorksheet />} />
            <Route path="/teacher/ap/apitalian" element={<APItalianContent />} />
            <Route path="/teacher/ap/apitalian/unit/:unitNum/worksheet" element={<APItalianWorksheet />} />
            <Route path="/teacher/ap/apgerman" element={<APGermanContent />} />
            <Route path="/teacher/ap/apgerman/unit/:unitNum/worksheet" element={<APGermanWorksheet />} />
            <Route path="/teacher/ap" element={<APIndex />} />
            <Route path="/plan" element={<Plan />} />
            <Route path="/drawdown" element={<Drawdown />} />
            <Route path="/waste" element={<Waste />} />
            <Route path="/procurement" element={<Procurement />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminHome />} />
            <Route path="framework" element={<AdminFramework />} />
            <Route path="ai-ingestion" element={<AdminAIIngestion />} />
            <Route path="ai-accuracy" element={<AdminAIAccuracy />} />

            <Route path="scope-1" element={<AdminScope1 />} />
            <Route path="scope-1/heating-oil" element={<HeatingOil />} />
            <Route path="scope-1/propane" element={<Propane />} />
            <Route path="scope-1/refrigerants" element={<Refrigerants />} />
            <Route path="scope-1/fleet" element={<Fleet />} />

            <Route path="scope-2" element={<AdminScope2 />} />
            <Route path="scope-2/meter" element={<MeterReading />} />
            <Route path="scope-2/meter-trends" element={<MeterTrendsUpload />} />

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
            <Route path="sinks/stands" element={<ForestStands />} />
            <Route path="sinks/trees" element={<TreeInventory />} />
            <Route path="sinks/soil" element={<SoilSample />} />

            <Route path="methodology" element={<AdminMethodology />} />
            <Route path="audit-log" element={<AdminAuditLog />} />
            <Route path="data-quality" element={<AdminDataQuality />} />
            <Route path="actions" element={<AdminActions />} />
            <Route path="plan-agent" element={<AdminPlanAgent />} />
            <Route path="stage-planner" element={<AdminStagePlanner />} />
            <Route path="facilities" element={<AdminFacilities />} />
            <Route path="bms-export" element={<AdminBmsExport />} />
            <Route path="alerts" element={<AdminAlerts />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);
