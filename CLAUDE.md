# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All active development happens **inside `src/`** (see "Repo layout quirk" below). Run commands from there:

```bash
cd src
npm install
npm run dev       # Vite dev server on http://localhost:5173
npm run build     # production build → src/dist/
npm run preview   # serve the built bundle
npm test          # vitest
```

To run a single test: `npx vitest run path/to/file.test.js` (or `npx vitest path/to/file` for watch mode).

## Repo layout quirk (important)

There are **two `package.json` files** with different toolchains. Only one is live:

- `/package.json` — **stale** Create-React-App scaffolding. Does not host the dev server or build pipeline anymore. The one durable role it plays: `"type": "module"` so the `api/*.js` Vercel functions parse as ESM. Don't add new deps here.
- `/src/package.json` — **active**. Vite + React 18 + Vitest. This is the one to install against and run. `src/index.html` is the Vite entry, `src/public/` is the static-asset dir Vite copies through (favicon, manifest, logos), and Vite treats `src/` as the project root.

If `npm start` is requested, redirect to `npm run dev` from `src/`. If changing React or build tooling, update `src/package.json`, not the root.

## Architecture

Single-page React app routed in `src/index.js`. Two top-level surfaces:

- **Public dashboard** (`/`, `/scope-1`, `/scope-2`, `/scope-3`, `/sinks`, `/executive`, `/goals`, `/plan`, etc.) — emissions, methodology, learn, peer comparison.
- **Admin portal** (`/admin`, `/admin/methodology`, `/admin/actions`, `/admin/plan-agent`, `/admin/stage-planner`, `/admin/scope-3/*`) — password-gated CRUD over Supabase + AI-driven planning.

### Canonical scope numbers (single source of truth)

`src/data/scopeTotals.js` exports the headline numbers every page reads. As of the latest fork-collapse, the placeholder values match the bottom-up multi-method cross-check centrals from `src/data/geographicEstimates.js` — there is **one** number per scope, not two:

| Scope | Headline | Range (cross-check) |
|---|---|---|
| Scope 1 | **1,350 mt** (heating 1,290 + fleet 54 + refrigerants 7) | 891 – 1,867 across 3 methods × 3 components |
| Scope 2 | **385 mt** (BMS-measured kWh × ISO-NE 2024) | ±5% measured band |
| Scope 3 | **2,635 mt** | 1,726 – 3,720 across 3-4 methods × 8 components |
| Sinks | **2,650 mt** (forest sequestration, 1,000 acres) | 2,100 – 2,650 across Birdsey / NH FIA / Nowak |
| Gross | **4,370 mt** | composite 2,983 – 5,992 |
| Net | **1,720 mt** | composite 333 – 3,892 |
| Per-student net | **5.0 mt** | composite 1.0 – 11.4 |

When you change a placeholder, recheck: targets.js baselines, LearnAgent narrative, Teacher / TeacherPortal / chatbotMatch quizzes, all three API system prompts (`api/chat.js`, `api/admin/plan.js`, `api/admin/estimate-action.js`), Executive provenance row, AnnualReport methodology note, CarbonCredits trade-off section. The composite range arithmetic in `api/chat.js` line 95 is independent — only edit it if you change the underlying per-scope ranges in `geographicEstimates.js`.

### Live measured-data hooks

The dashboard upgrades from "estimated" to "measured" automatically as admins enter data. The pattern:

1. **Pure helpers** in `scopeTotals.js`: `composeScope1FromBills(bills, opts?)`, `composeScope3FromRecords(records)`, `composeSinksFromActuals(rows)`, plus per-component helpers `composeFleetMt`, `composeRefrigerantMt`, `composePurchasedGoodsMt`, `composeCommutingMt`, `composeSolarFromRecords`, `composeGeothermalFromRecords`, `composeWindFromRecords`. Each takes Supabase rows, returns same shape as the placeholder composer with `provenance: 'measured'` when rows are present, fallback to placeholder when empty.
2. **Per-scope hook** in `src/hooks/`: `useMeasuredScope1()`, `useMeasuredScope3()`, `useMeasuredSinks()`, `useMeasuredRenewables()` — fetch from Supabase on mount, apply helper, return `{ totalMt, breakdown, provenance, loading, error, measured }` (or component-specific shape for renewables). Each tolerates "table doesn't exist" by falling back to the placeholder so the dashboard still renders before the migrations are applied.
3. **Composer hook**: `useMeasuredScopeTotals()` returns measured-or-fallback for ALL scopes + sinks + gross/net + `scope3CohortDetail` so consumers (Executive, Goals, NetEstimate, AdminHome, AdminDataQuality, AnnualReport) read one consistent measured-aware view.
4. **Promise cache**: `src/hooks/measuredCache.js` dedupes Supabase round-trips across pages. Admin writes invalidate via `logAdminWrite()` so the next read re-fetches.

Pages already wired to live data:
- `Scope1.js` → `useMeasuredScope1()`
- `Scope3.js` → `useMeasuredScope3()`
- `Sinks.js`, `Sinks2.js` → `useMeasuredSinks()`
- `Renewables.js`, `Renewables2.js` (+ `Drawdown.js` tab wrapper) → `useMeasuredRenewables()`
- `Executive.js`, `Goals.js`, `NetEstimate.js`, `AdminHome.js`, `AdminDataQuality.js`, `AdminMethodology.js`, `AnnualReport.js` → `useMeasuredScopeTotals()`

When adding a new measured-data table to Supabase, follow the same pattern: helper in scopeTotals.js, hook in src/hooks/, wire to the page that displays it. Each component flips estimated → measured independently — it's fine to have heating measured + fleet still estimated, etc.

### Scope 2 electricity ledger (admin-fed)

Scope 2 kWh is composed in exactly one place: `src/data/electricityLedger.js` (pure rules), seeded by `src/data/monthlyConsumption.js` (master-meter monthly totals) + `src/data/contiguousMonths2026.js` (monthly campus feed-sums). Rules: per month a BMS All Meters master total wins; otherwise the feed-sum is scaled by master ÷ feed-sum, calibrated on months that have both with complete feed coverage and a sane ratio (0.5–1.5). The YTD runs contiguously from Jan 1 of the reported year — the latest year that has a January — and stops at the first missing month and after the first partial month; anything it can't use comes back in `uncounted` with a reason. Month-range labels ("Jan–Apr") are derived via `ledgerSourceText()`, so page copy never hardcodes which months came from where.

`useMeasuredScope2()` lays admin rows from `scope2_meter_readings` (campus-wide rows whose `source` is `bms_master_monthly` or `meter_trends_feed_sum`) over that seed and composes with the same functions. With no rows the result equals the static exports in `composedYtd.js` / `gridMix.js`, so the dashboard is unchanged until someone enters data. Admin entry: `/admin/scope-2/meter-trends` — daily Meter Trends CSV parsed in the browser (`feedMonthSums.js`) into one monthly row, or a typed master total, with a preview of the public composition before saving. `notes` on a row is admin-facing (filenames, capture details) and never reaches the public page; public caveats are derived, or carried from the seed month.

**Who reads the live composition.** Migrated to the hooks (Phase 378), so an admin-entered month moves them: ScopeDonut, AISummary, ScopeExplainer, PeerComparison, NetEstimate (hero + the Scope 2 breakdown row), Actions, Scenarios, TeacherPortal, Hotspots, Executive, AnnualReport, Buildings (seasonal sparkline), AdminMethodology, AdminDataQuality, AdminPlanAgent (its AI-prompt context already synced via `useMeasuredScopeTotals`). Each keeps the static export as its first-paint fallback (`live.scope2Mt || SCOPE2_TOTAL_MT`).

Note that `KG_PER_KWH`-style constants — `(GRID_MIX_TOTAL_MTCO2E * 1000) / GRID_MIX_TOTAL_KWH` in Buildings, Hotspots, Executive, StudentChallenges, Renewables2, equivalents.js — are a *rate* (≈0.2344 kg/kWh) and don't move with the composed kWh (verified 400k–2.5M kWh). Leave them static.

**Per-building months.** Rows in `scope2_meter_readings` with a `building` and `source: 'building_monthly'` are per-building readings, not part of the campus ledger (which ignores them). `src/data/buildingMonths.js` maps them and `useBuildingMonthlyHistory()` merges them over `buildingMonthlyHistory()` from monthlyConsumption.js. Everything per-building — campus map, building detail, dorm leaderboard and its homepage preview, dorm posters, compare-buildings, month compare, monthly digest, energy challenge — reads `computeBuildingEmissions({ monthlyHistory })` with that merged history, so one entry moves all of them and they can't drift apart. A per-building row must cover a whole calendar month, because `computeBuildingEmissions` annualizes from whole months: it divides measured kWh by the SEASONAL share of the year those months cover (`seasonalYearFraction()` in `seasonalPatterns.js`), so a half month would quietly halve that building's year. Phase 390 replaced the old `(measured/monthsCovered) × 12` rule, which treated January (1.25× an average month) and July (0.59×) as interchangeable — harmless while every building carried the same seed months, but once admin entry makes coverage uneven it ranks dorms by which month someone happened to enter. Same 1,000 kWh now annualizes to 9,240 in January and 19,576 in July instead of a flat 12,000 for both. `seasonalYearFraction()` is the `share = multiplier / multSum` construction `projectYear1()` used to compute inline; Phase 390 collapsed that duplication, so `projectYear1()` now calls `seasonalShares()` and there is genuinely one seasonal dialect (verified bit-identical — same reduce, same divisor). Don't weight buildings by `year1Months` instead: it is partly pattern-derived, and it would make entering a *campus* month silently reshuffle the dorm leaderboard. Rows carry `yearFraction` (full precision — it's a divisor someone may reconstruct `annualKwh` from; round it at render), and it travels in the campus-map CSV so a board/STARS reader can reproduce the annualization from the file's own columns.

Two honesty notes on this rule, both from review — don't let either drift back out of the docs:
- **The campus ledger does not corroborate it.** The ledger and the building roll-up read two columns of the *same* BMS capture (`displayedTotal` vs the submeter `rows[]`), which `monthlyConsumption.js` documents as drifting 5–10% apart from CT calibration. The building sum sitting ~7% above the ledger is that instrument gap, not seasonal error; putting the master column through this same rule lands within 1.7%. And because every building currently has identical coverage, switching rules multiplies every figure by the same constant (1.1584), so "it moved closer to the campus total" is one datum that would look identical for a fabricated seasonal shape. The argument for the rule is fairness under uneven coverage, not goodness of fit.
- **One campus curve is applied to 19 unlike buildings.** `monthlyPattern` is heating-dominated. A dorm empties June–August, so its real winter peak is sharper than campus and a winter-only reading still overstates its year; an athletic building running summer camps is flatter or summer-peaking and is understated. The rule removes month-of-entry sensitivity for buildings shaped like campus and reduces it for the rest — it does not eliminate it. `/dorm-leaderboard` discloses this in its methodology note. Fixing it properly needs a full year of per-building data.

**Investigated and NOT a defect — don't "fix" it.** `SNAPSHOT_ANNUALIZE_FACTOR` (used by `Scope2LiveDashboard`, `Buildings`, `StudentChallenges`, `Hotspots`) looked like a rival per-building annualization rule competing with `seasonalYearFraction`. It isn't. The two handle different data shapes and each is right for its own: `envysionSnapshot` rows are a **123-day window ending mid-May**, which needs day-resolution annualization (`annualizeFactorForWindow`), while `buildingMonths` are **whole calendar months**, which `seasonalYearFraction` handles. Applying the whole-month rule to a window ending 3 May would be wrong. Both ultimately rest on the same `monthlyPattern` shares, so they agree closely by construction.

The one real observation: `annualizeFactorForWindow` reads `year1Months`, which `projectYear1` builds partly from measured admin data — so entering a **campus** month does shift the snapshot factor. Measured: **1.71%** against the same window computed from the pure pattern, and because the factor is a scalar multiplier it **cannot reorder buildings** (verified — rankings identical under both). It moves the scale of every building together, never their order, and better knowledge of the year's shape arguably *should* improve a window annualization. The CLAUDE.md invariant about not weighting buildings by `year1Months` still stands for **building-months**, where it would be near-circular; it does not apply to annualizing a window.

### The grid is not a constant (Phase 391)

`src/data/gridMixHistory.js` holds EPA eGRID NEWE by vintage (2019–2023: CO₂/CO₂e lb/MWh, grid loss, generation, and the per-fuel resource mix), plus ISO-NE's own operational rates (2023/2024) and the ISO-NE 2025 %-of-net-energy-for-load mix. Every figure was read out of the cited primary document, not a secondary summary — a search-engine synthesis of this same series reported 2019 as 488.9, which is NEWE's **CO₂** rate, not its **CO₂e** rate (493.8); the columns sit adjacent and are easy to conflate.

**Two series, two denominators — never mix them.** eGRID's resource mix is *generation inside New England* and has **no imports column**; ISO-NE's is *% of net energy for load* and **includes 7% imports**. Their percentages are not comparable line by line. eGRID's total output emission rate is what GHG Protocol location-based Scope 2 asks for and is the reporting basis; ISO-NE's rate is context and cross-check only.

**State the trend carefully — the striking version is a cherry-pick.** Carbon per kWh rose ~10% from 2019 to 2023 (493.8 → 543.2 lb/MWh), but **2019 is the minimum of the series in three independent datasets** (eGRID, ISO-NE operational, EIA six-state) and starting at 2016 reverses the sign. 2019 was unusually clean: cheap gas pushed coal and oil nearly out of dispatch while nuclear held flat (Seabrook skipped a refuelling outage). Intensity rose after 2020 because nuclear share fell. The defensible summary is **down ~20–28% since 2010, bottomed in 2019, record low in 2024 (597 lb/MWh generation-only), likely up ~4% in 2025** on record gas share and weak hydro. A test pins 2019 as the series minimum so this framing can't quietly drift back. What actually matters for a school is the magnitude, not the direction: `scope2MtAtVintage(kwh)` prices one year's kWh at every vintage, and the same 1.66M kWh is 372.6 mtCO₂e at the 2019 grid versus 410.5 at the 2021 grid — a swing larger than most efficiency projects, with no change in KUA's behaviour. Hold carbon intensity fixed and the grid's movements get misread as the school's.

Also note: eGRID was **biennial before 2018** (no 2017 or 2024 edition), so anything plotting the series as continuous annual data should say where editions actually fall; and eGRID reads 100–140 lb/MWh below ISO-NE for the same grid because it **subtracts biogenic CO₂** from biomass and MSW — a boundary difference, which is why the two series must never be spliced to fill gaps.

**Deliberately NOT done, and why.** The per-fuel reconstruction in `gridMix.js` yields 0.2344 kg/kWh; published eGRID for the reporting vintage is 0.2464 — so Scope 2 is understated ~5%, in the flattering direction. `FACTOR_RECONCILIATION` and `VINTAGE_GAP` publish the gap rather than closing it, because the 390 mt headline is *also* `targets.js`'s `baselineValue` (board sign-off pending, already revised three times), the impact and $115K cost of the REC recommendation in the admin plan agent, and a figure baked into three API system prompts (`api/chat.js`, `api/admin/plan.js`, `api/admin/estimate-action.js`). Repricing the inventory invalidates board-facing targets and a costed procurement recommendation — it needs its own phase and a human decision, not a constant edited in passing.

Also fixed in 391: `Scope2LiveDashboard` displayed a hardcoded **0.096 kg CO₂/kWh** emission-factor card (wrong by 2.4× against the site's own arithmetic) and a hardcoded **48%** zero-emission share (the real figure is 41%), plus seven hand-typed mix percentages. All three now derive from the live composed mix via `effectiveKgPerKwh()`, `zeroEmissionPercent()` and a map over the rows.

### Show the precision the evidence supports (Phase 400)

`utils/modelledPrecision.js`. `/buildings/:id` rendered **"22,213 kWh"** and `mtCO₂e.toFixed(2)` for figures extrapolated from **four** metered months divided by a seasonal share — every digit past the third an artefact of a model that itself moved 13.7% in Phase 390 and 5% again in Phase 392. False precision is not cosmetic: it is a silent claim about data quality to a reader with no way to check it.

**Precision follows coverage**, using the `yearFraction` every row already carries: ≥90% of the year → 4 s.f., otherwise 3 s.f., nothing measured → 2. A fully-metered building earns its digits back. Applied to `BuildingDetail` (annual kWh, mtCO₂e, per-resident) and `CampusMap`'s detail panel; the headline hint now reads "estimated from 4 metered months (39% of a year)".

**Deliberately NOT applied to measured readings.** A single month's metered kWh, and the live API window on `/buildings`, are measurements — `toFixed(3)` there is fine. This is only for extrapolations.

**I got the threshold wrong first, and real data caught it.** My first cut dropped to 2 s.f. below half a year. Against actual buildings that rounded Miller 375,543 **up** to 380,000 — overstating by 4,457 while claiming to be more careful — and collapsed Kilton (139,527) and Fitch (138,546) onto the same displayed number. At 3 s.f. worst-case error is +473 and all 19 buildings stay distinct. My unit tests had *encoded* the 2-s.f. choice, so they passed throughout: they confirmed internal consistency, not that the choice was good. The real-data check is what found it.

**What was left alone, on purpose.** A UI critic flagged the medals, `kua-champion-glow` and gradient hero numbers as game polish. `CLAUDE.md` documents those as commissioned design work (Phases 266–355), so they stay — that's the user's aesthetic, not mine to overrule on a critic's say-so. One line did change, because it over-claimed rather than over-styled: "🎉 This dorm is in the top 3 — keep doing whatever you're doing differently" congratulated a dorm for an unidentified behaviour on four months of data, using a ranking Phase 390 proved can move with coverage.

### A boarder is not on campus for 52 weeks (Phase 399)

`personalFootprint.js` priced beef and dorm showers at `WEEKS_PER_YEAR = 52` — a full calendar year of campus meals and dorm hot water for students who go home for summer, winter and spring. `academicCalendar.js` now exports **`STUDENT_RESIDENCY_WEEKS = 34`**, a *third* quantity distinct from both day-counts above: residency includes weekends inside a term, which teaching weeks don't, and excludes the breaks, which the calendar year doesn't.

**34 is an estimate and the file states its bounds**: `INSTRUCTIONAL_DAYS` implies ~36 teaching weeks, boarders are resident across weekends within a term, and summer plus winter plus spring removes roughly 14–16 weeks — so the defensible band is ~32–38 and 34 sits mid-range. Not derived from a published calendar, because the Major Dates Calendar that would settle it still isn't in the repo (same gap as Phase 395). A test pins it inside that band.

**The assumption is now visible where the student is asked to audit it.** `/your-footprint` renders each row's note under "Audit + push back on any of them" — but the beef row didn't show its weeks multiplier at all while the shower row did. Both now read "× 34 weeks on campus", and the shower row adds "term-time only — breaks excluded". Tests assert both notes contain the constant and that neither says 52.

Effect on a typical boarder: beef 0.92 mt, showers 0.11 mt — down about a third from the calendar-year basis. No test pinned those absolute figures before, which is why the overstatement survived; three now do.

### The tripwire had a unit-shaped blind spot (Phase 398)

Phase 392 added a grid-factor drift guard to `proseFigures.test.js`, context-matched on the word "effective". It missed the first thing it should have caught: `learningContent.js` taught the effective rate as **"about 235 g CO2/kWh"**, and the regex only matched a **kg** form (`\d\.\d{3}\s*kg`). A guard against stale figures that only recognises one unit is a guard with a hole in it. There is now a grams pattern too, with a fixture test proving it fires — and a second fixture proving it still ignores the legitimate US-average "~370 g/kWh" sitting in the same sentence (requiring `CO` after the `g` is what separates them).

Corrected to **234 g**, which is `Math.round(KG_PER_KWH * 1000)` — checked rather than assumed, since 234.4 could plausibly have rounded either way.

**The 48% / 41% split is now taught, not hidden.** The lesson said "nuclear plus hydro plus renewables plus clean imports = ~48% zero-emission" while the Scope 2 card says 41%. Both are defensible: the difference is whether the 7% of imports (mostly Québec hydro) counts as clean, and `zeroEmissionPercent()` excludes them because their emission factor is 0.0003, not 0. Rather than force one number, the lesson now explains the choice and names which one the dashboard reports — a student who learns *why* two honest definitions disagree has learned something real about inventory accounting. If a future change makes these agree by accident, the lesson text needs revisiting too.

### The scenario model asks two questions (Phase 397)

`utils/scenarioModel.js` took a single `gridKgPerKwh` and used it for two opposite things: step 2 **adds** Scope 2 when heating electrifies (new load consumed → location-based average, correct) and step 3 **offsets** Scope 2 for new solar (generation displaced → marginal rate). Pricing displacement at the inventory average understated modelled solar by about half on `/scenarios`, a public planning surface whose presets go to 500 kW.

Now two parameters: `gridKgPerKwh` (inventory, `KG_PER_KWH`) and `solarDisplacedKgPerKwh` (marginal, `avertAvoidedKgPerKwh()`). Two tests guard the split in both directions — one fails if they're merged back (solar offset drops ~2×), one fails if electrification ever starts using the marginal rate (electrifying would look ~2× worse than it is). Same unit-versus-question distinction as Phase 392's `composeSolarFromRecords`.

**`NH_SOLAR_KWH_PER_KW_YR = 1300` deliberately stays**, and the file now says why. Three solar figures coexist and are *different quantities*, not rivals to reconcile: AVERT's 0.1823 (~1,597 kWh/kW/yr) is a **regional average** for pricing displaced generation; `renewables.js` describes **KUA's actual installation**; and 1,300 is a **planning assumption for arrays that don't exist yet**. I briefly filed the spread between them as a defect — it wasn't, and the investigation is recorded so it isn't re-filed.

**Two real findings for Facilities, surfaced while scoping**, both about KUA's existing solar rather than the model: of three "operational" arrays only one reports — `PM_15_FieldSolarFeed` is stuck at −25,226 across the whole window, and `PM_19_SolarFeed` reads as a *net consumer* (counter rising day and night: reversed CT clamp, or not a solar feed). So `SOLAR_ANNUAL_KWH` rests on a single array's single measured month scaled by a PVWatts shape, and `capacityKwDc` is estimated from peak kW × 1.2 rather than inverter nameplate.

### One academic calendar, two day-counts (Phase 395)

`src/data/academicCalendar.js`. Four places counted the school year and two disagreed: `personalFootprint.js` used **170** while `geographicEstimates.js` used **180** for the same day-student commute, and `scopeTotals.js` defaulted admin-entered rows to 5 × 36 (= 180). A student using `/personal-footprint` was shown "170 school days" while the institutional inventory assumed 180 — about 6% apart, on a figure the same person could see twice in one sitting.

**Two constants, deliberately — do not merge them.** `INSTRUCTIONAL_DAYS` (students attend) and `STAFF_WORK_DAYS` (staff also work orientation, exam periods, professional days, duty weekends). Both are 180 today *only because both are assumed*; a measured staff figure will almost certainly be higher. Collapsing them into one `SCHOOL_DAYS` would repeat the Phase 392 error of unifying two values because they share a **unit** rather than a **question** — a test asserts both exports exist separately, so a future tidy-up fails loudly instead of silently re-creating the conflation.

**Provenance is `estimated`, and stays that way until sourced.** KUA runs three trimesters and publishes a Major Dates Calendar per year; its instructional-day count is not in this repo, and deriving one from trimester boundaries would manufacture precision the figure doesn't have. 180 was chosen because three of the four call sites already assumed it, so aligning changes the fewest published numbers and moves the remaining one (the student calculator) *up* — the unflattering direction. A test blocks upgrading provenance to `cited` without adding a real source.

**Known adjacent issue, recorded not fixed:** `personalFootprint.js` prices beef and showers at `WEEKS_PER_YEAR = 52` — a full calendar year for a boarding student who is away for summer, winter and spring breaks. Deciding what a "student-year" means for dining and hot water is a separate question from commuting and wants its own constant.

### Weather is measured now (Phase 393)

`src/data/degreeDays.js` holds heating degree days for **KLEB (Lebanon Municipal Airport)**, ~13 miles from campus, base 65°F. Until this existed there was **no weather data anywhere in the tree** — seasonality was asserted by the multiplier table in `seasonalPatterns.js` and never measured, so a mild winter read as an efficiency win the school didn't earn. That matters more since Phase 390, because the per-building annualization divides by that same assumed shape.

It is not a small effect: **Jan–Aug 2026 ran 9.1% milder than normal** (March −17.8%, April −18.3%, August −85.2%). `/scope-2`'s methodology card now says so, in weather terms rather than energy terms — heating at KUA is oil and propane (Scope 1), so this is context for reading the figure, not a claim about electricity.

**Provenance.** Actuals from NOAA's Regional Climate Centers **ACIS** service; normals are **1991–2020**, verified two independent ways — ACIS and NCEI's published normals agree month for month (1401.1/1401 … 1184.2/1184), annual 7,333.5 both ways. The NWS climate sheet for this station is **still 1961–1990** and totals 7,825 HDD, 6.7% above the current normal (equivalently today's normal is 6.3% below it — mind which denominator). Normalizing against the old sheet would inject the bias this module removes.

**Partial months are excluded, never averaged in.** September 2026 held 15 of 30 days when captured, so `hddActual(2026, 9)` returns `null` and `compareToNormal(2026)` compares 8 months, not 9 — the same whole-month rule as `buildingMonths.js`.

**There is deliberately no `weatherNormalizedKwh()`.** ENERGY STAR Portfolio Manager (Kissock's E-Tracker) fits a per-fuel change-point regression of monthly energy against temperature, needs **24 months (12 minimum)** and a minimum **R² of 0.4–0.7**, and warns some buildings have *no usable fit* because base load swamps weather — plausible here, since KUA heats with fuel, not electricity. KUA has 4 measured building-months and 9 campus feed-months. `NORMALIZATION_READINESS.ready` is `false` with the reason and citation attached, and a test asserts no function matching `/normaliz/` is exported, so a fitted-on-9-points number can't appear by accident.

### One kWh, one number (Phase 392)

**`KG_PER_KWH` in `gridMix.js` is THE grid emission factor.** Everything that turns kilowatt-hours into mtCO₂e imports it. Before Phase 392 the same quantity was valued four ways: 0.2344 (the Scope 2 composition), **0.235** hardcoded in five modules (`buildingEmissions`, `CampusMonthlyTrend`, `scenarioModel`, `personalFootprint`, the `emissionFactors` catalog), **0.2917** driving renewables avoided-emissions, and a lesson teaching students **0.292**. So /campus-map, /renewables and /scope-2 disagreed by up to 24% about the carbon of one kilowatt-hour.

**Avoided emissions is the ONE place "one number" does not apply.** `scopeTotals.js` carried `GRID_FACTOR_LB_PER_MWH = 643.0` labelled "ISO-NE 2024" — wrong twice over (ISO-NE's 2024 in-region rate is **597**; 643 is stale, likely 2022). My first pass repointed it at the canonical `KG_PER_KWH`, and that was a mistake worth remembering: it made the figure *worse* than the wrong number it replaced.

Scope 2 asks what consumption **emitted** — an inventory question, location-based **average**. Avoided emissions asks what the solar **displaced** — a consequential question, and what backs down in New England is the **marginal** unit, almost always gas. EPA **AVERT** v4.3 puts New England rooftop-scale (distributed) PV at **1,079.4 lb/MWh (2023) ≈ 0.49 kg/kWh**, roughly double the average. GHG Protocol treats avoided emissions as consequential/system-wide modelling *explicitly outside* Scope 2 inventory accounting, which is what licenses two factors. The series lives in `gridMixHistory.js` as `AVERT_NEW_ENGLAND_DISTRIBUTED_PV` (2017–2023), and `composeSolarFromRecords` returns `factorBasis: 'marginal (displaced generation)'` so a caller can't mistake it for the inventory factor.

**Two deferred items from the same investigation**, both real:
- `scenarioModel.js` passes ONE `gridKgPerKwh` to two opposite questions — line 85 adds Scope 2 when heating electrifies (inventory → average, correct) and line 98 offsets Scope 2 for new solar (displacement → arguably AVERT). They should probably not share a parameter.
- AVERT's own capacity factor for New England distributed PV is **0.1823** (~1,597 kWh/kW/yr) against `scenarioModel`'s hardcoded **1,300** (CF 0.148) — a ~23% gap against the authority now cited elsewhere in the file.

`LearnAgent.js` taught that ISO-NE's 2024 factor was "643 lb CO₂ per MWh... about 0.292 kg/kWh" and called imports "Canadian hydro imports (12%)" — wrong cited facts in teaching material (imports are 7%, renewables 12%). Corrected to 597 lb/MWh ≈ 0.271, with the record-low framing from `gridMixHistory.js`.

**Tests derive, they don't re-type.** Seven test files pinned the old literals; all now compute from `KG_PER_KWH`, so the next factor change moves expectations instead of breaking seven files. Exactly one place pins the literal value: `gridMixFactors.test.js`. `proseFigures.test.js` gained a grid-factor tripwire that is **context-matched** on the word "effective" — prose legitimately carries other kg/kWh figures (ISO-NE operational ~0.271, published eGRID ~0.246, US average ~0.37) that must not be flagged as stale copies of this one.

The headline stayed at 390 mtCO₂e. Campus-map moved 418.68 → 417.69 (the 0.24% from retiring 0.235). When the repricing decision in the section above is finally taken, every surface now moves together instead of one page at a time — which is the whole point of the consolidation. Entry is the "Enter one building's month" form on `/admin/scope-2/meter-trends`.

**Meter → building mapping.** `src/data/bmsExportMapping.js` decides which building each PM_* meter belongs to, and so which buildings show measured electricity. Precedence is DEFAULT_MAPPING → this browser's localStorage → the shared `bms_meter_map` table (shared wins: the mapping is a fact about the campus, not a per-admin preference). `getBmsMeterMap()` stays synchronous for the render paths that call it; `hydrateBmsMeterMap()` fills a module cache once at startup, and writes go to both stores. If the migration (`supabase/migrations/20260915120000_bms_meter_map.sql`) hasn't been applied, everything falls back to localStorage and `/admin/bms-export` says so.

**Still seed-only:** `data/learningContent.js` and the LearnAgent narrative/quiz strings (module-level content, no hook available — the figures are written into prose and updated by hand when the headline moves), and `SCOPE2_TOTAL_MT` / `GROSS_MT` in `scopeTotals.js`, which are the fallback chain by design. If the headline moves materially, grep for the old value across `src/data/ap-content` excluded paths and update the prose.

### Supabase tables (canonical)

17 tables drive the live dashboard. The canonical list lives in `src/data/adminTableSources.js` (used by both AdminHome and AdminDataQuality):

- **Scope 1**: `fuel_bills`, `scope1_heating_oil`, `scope1_propane`, `scope1_fleet`, `scope1_refrigerants`
- **Scope 3**: `day_students`, `us_boarding_students`, `international_students`, `study_abroad`, `faculty_travel`, `waste`, `purchased_goods`, `commuting`
- **Sinks**: `forest_stand_actuals`
- **Renewables**: `renewables_solar`, `renewables_geothermal`, `renewables_wind`
- **Audit trail**: `admin_audit_log`

Migrations in `supabase/migrations/`. The per-scope admin pages + live-measured hooks read/write all of them.

### Data quality + freshness

`/admin/data-quality` shows per-table row counts, last-entry dates, and cadence-aware freshness pills (fresh / aging / stale / empty / irregular). Cadence buckets in `src/utils/freshness.js`:

- `monthly`:    fresh < 60d,   aging 60–120d,   stale > 120d
- `quarterly`:  fresh < 120d,  aging 120–365d,  stale > 365d
- `annual`:     fresh < 540d,  aging 540–720d,  stale > 720d
- `irregular`:  no staleness check (event-driven tables — refrigerant service, faculty trips, forest walks, wind asset status)

AdminHome surfaces a top-of-page freshness alert when any table is stale/aging/empty. Both pages import the cadence map from `adminTableSources.js`.

### Admin audit log + CSV export/import

Every successful admin write through the per-scope pages fires `logAdminWrite()` (`src/utils/adminAudit.js`) → `POST /api/admin/audit-log`. Reads via `GET /api/admin/audit-log` (paginated, optional `table` + `dateFrom` / `dateTo` filters) surface in the `/admin/audit-log` viewer page. The endpoint passes through to the same anon Supabase client the rest of the dashboard uses; the bearer-token gate IS the auth boundary, not RLS. No service-role key required.

CSV utilities live in `src/utils/csv.js`: `toCsv(rows, columns?)` for export (RFC-4180 escaping, JSON-stringifies jsonb), `parseCsv(text)` for import (single-pass tokenizer; returns `{ rows, columns, errors }`). Bulk-import UIs are wired into every canonical admin table via the shared `<CsvImportPanel>` component — paste CSV → preview + per-row validation → batch insert + audit log entry. The 7 validators are tested in `csvValidators.test.js`.

Audit-log paging: `fetchAuditLog(opts)` pulls a single page; `fetchAllAuditLog(opts)` walks offsets until the announced total is reached or a short page signals end-of-data, with optional `onProgress(fetched, total)` and a `maxRows` ceiling (default 50,000). The audit-log viewer uses the second for "Export all filtered".

### Admin auth (server-checked)

The `KUA2026` literal compare on the client is gone. The flow is now:

1. `POST /api/admin/login` with `{ password }` — server compares timing-safe against `process.env.ADMIN_PASSWORD`. Rate-limited 6 attempts/IP.
2. On success, returns `{ token, expiresAt }`. Token is HMAC-SHA256 signed via `process.env.ADMIN_TOKEN_SECRET` (32+ chars), payload `{ iat, exp, role: 'admin' }`, 8h TTL.
3. Client stores the blob in `localStorage.kua_admin_session` and sends `Authorization: Bearer <token>` on every admin API call (use `adminFetch()` from `src/utils/adminFetch.js`).
4. Server-side admin endpoints call `verifyAdminRequest(req)` from `src/utils/adminToken.js` and 401 on missing/expired/tampered tokens.

**Optional env vars for production hardening:**
- `ADMIN_PASSWORD` — defaults to `KUA2026` (public fallback). Override in Vercel env to use a different password.
- `ADMIN_TOKEN_SECRET` — defaults to a baked-in 64-char constant (public fallback). Override with `openssl rand -hex 32` to prevent token forgery by anyone reading the source.

Login Just Works on a fresh deploy without setting either — the fallbacks ship in the source. Threat model: "keep casual visitors out of /admin," not "keep determined attackers out." Set `ADMIN_TOKEN_SECRET` when you need the latter.

### Public-facing student/staff pages (added Phases 218–262)

The dashboard's public surface beyond the scope detail pages:
- `/` — Net-balance hero + scope donut + peer comparison + news strip + dorm-leaderboard preview + quick-links pill row (FAQ, footprint calc, scenarios, share QR, methodology). The hero shows tangible equivalents (cars/homes/flights/trees).
- `/your-footprint` — 5-input personal calculator. Full self-tracking loop: gradient hero result → peer comparison (you vs typical day/US/international student) → "what if every student did this" amplification → save your history to localStorage with auto-trend → make a pledge + copy share text. Printable.
- `/news` — environment news feed (24h cache, student-connection field, per-IP rate limit).
- `/dorm-leaderboard` — annualized kWh-per-resident ranking across 11 dorms with champion card + monthly trend column.
- `/challenge` — month-over-month dorm competition with two scoreboards (most efficient + biggest improvement) for RA-run challenges.
- `/campus-map` — four modes: Schematic (by-category zones), Geographic (lat/lng on blank canvas), Photo (energy dots on official KUA bird's-eye illustration at `/kua-campus-map.png`), Satellite (real Esri World Imagery via pigeon-maps with markers at cited lat/lng).
- `/buildings/:id` — per-building drill-down with photo slot (`/buildings/{id}.jpg`), dorm-rank spotlight callout (when category === 'Dorm'), monthly bar chart, peer ranking, BMS export panel, live API panel, "Share stats" CopyButton.
- `/scenarios` — interactive what-if simulator with 4 sliders (electricity cuts, heat-pump electrification, solar PV, tree planting) + 4 named presets (SBTi 2030, all-in heat pumps, solar-first, behavioral-only).
- `/faq` — 12 common questions accordion with deep-page links + #anchor deep-linking.
- `/share` — printable QR code generator (8 preset destinations + custom URL, SVG/PNG download).
- `/digest` — auto-generated monthly highlights (most efficient dorm, biggest improver, top emitter, campus delta vs prior month). Printable. Designed for parent newsletter / dorm bulletin / faculty meeting hand-out.
- `/dorm-posters` — printable sheet of QR codes, one per dorm, each linking to that dorm's /buildings/:id detail. RAs print + cut + post on dorm doors so residents can scan to see their dorm's stats.
- `/carbon-math` — 8 interactive practice problems (intro / standard / AP difficulty) using KUA-specific numbers + cited factors. Teachers project + students work through them. "Show work" toggle on each. Printable as a worksheet.
- `/compare` — pick any two captured months, see campus delta + dorm rank movement. Two-champion callouts (biggest improver / biggest regression).
- `/compare-buildings` — pick any two of KUA's 19 tracked buildings, see them side-by-side (sqft, kWh, mt, intensity, occupants) with winner-per-metric highlighting.
- `/whats-new` — curated changelog of recent dashboard improvements (hand-edited highlights, not auto-generated from git). Each entry has a category pill + optional "Try it now" link. Toolbar link to full git history on GitHub.
- `/methodology`, `/credits`, `/sinks-os`, `/renewables-os`, `/drawdown`, `/scope-1`, `/scope-2`, `/scope-3` — canonical scope/methodology surfaces.

### Admin entry points

Admin entry happens through the per-scope pages under `/admin/scope-1`, `/admin/scope-2`, `/admin/scope-3`, `/admin/sinks`, `/admin/renewables`. The legacy single-file `AdminPortal.js` was removed in Phase 84.

### AI plan agent (`/admin/plan-agent`)

The institutional planning agent is the most active AI surface — `src/pages/admin/AdminPlanAgent.js` (~3700 lines) plus the `/api/admin/plan*` endpoint family. All endpoints stream Server-Sent Events.

Endpoints:

- `plan.js` — primary plan generation (12-item prioritized list). Default Opus 4.7, optional Sonnet 4.6. Extended thinking opt-in via UI checkbox (`THINKING_KEY` localStorage).
- `plan-narrative.js` — board brief: 7-section, 2-page strategic narrative. Opus 4.7. Extended thinking default ON (Phase 171). Self-critique pass (Phase 172).
- `plan-item-memo.js` — per-item 8-section implementation memo (weekly schedule, stakeholders, budget, etc.). Sonnet 4.6. Extended thinking default ON (Phase 173).
- `plan-item-alternatives.js` — generate 3 alternatives for swapping into a plan slot. Sonnet 4.6. No thinking.
- `plan-item-chat.js`, `plan-chat.js` — follow-up chat threads (per-item and plan-level).
- `plan-diff.js` — narrate the diff between prior plan and freshly regenerated one (Phase 150).

Streaming protocol (`src/utils/anthropicStream.js` server-side, `src/utils/sseClient.js` client-side):

- `event: progress` `{ charCount }` — text accumulation pings every ~200 chars
- `event: delta` `{ text }` — per-chunk text (chat endpoints with typewriter feel)
- `event: thinking` `{ charCount }` — extended-thinking accumulation (Phase 168+, every ~800 chars)
- `event: item` — individual plan items as they materialize (Phase 157, plan endpoint only)
- `event: done` — final structured payload with usage + thinking + model
- `event: error` `{ message }`

`parseSSE(response, onDelta, onProgress, onThinking)` consumes the stream client-side; `streamAnthropicJson({...})` serves it. Both have unit tests (`sseClient.test.js`, `anthropicStream.test.js`).

UX patterns to mirror when adding new AI endpoints:
- Live progress in the busy button label: "🧠 Thinking… 3.2K chars" → "Drafting… 12s · 1.4K chars" → result.
- AbortController for cancel button (memo + narrative + plan all support this).
- `recordUsage(usage, model, label)` on every `done` for the session-wide AdminHome tally.
- `<ThinkingPanel thinking={x} />` collapsible reasoning panel on the result card.

## Tests

Vitest. 1,106 tests across 71 files (every routed page has at least a mount-smoke test as of Phase 200; every /api/* handler, all of src/utils/, src/storage/, src/adapters/meter/, security-critical components, localStorage state stores, trajectory math, news + alert pipelines, the personal-footprint calculator + peer-comparison helpers, the geographic-map projection + cited building positions, the viewport hook + Layout responsive behavior, the /scenarios reduction simulator math all under direct test):

- `src/__tests__/dataLayer.test.js` (130) — composer math: Scope 1/3 + sinks + renewables + per-component helpers (compose*Mt + composeSolar/Geothermal/WindFromRecords).
- `src/__tests__/apiRoutes.test.js` (107) — every `/api/*` handler incl. admin auth flow (login 503/400/401/200/429, token verify, expired/tampered/fresh) + audit-log GET pagination/filter params.
- `src/__tests__/csvValidators.test.js` (33) — the 7 CsvImportPanel validators.
- `src/__tests__/csvMeterParser.test.js` (30) — meter-CSV parsing: PII-column blocklist, required-column checks, per-row validation, RFC-4180 splitter, empty-cell guards.
- `src/__tests__/emissions.test.js` (24) — core emission math (quantity→kgCO2e, kg/mt) + aggregation roll-ups (sumBy, grid-mix allocation, intensities, meter baselines).
- `src/__tests__/useMeasuredScope.test.js` (23) — render-hook tests for useMeasuredScope1/3/Sinks/Renewables + scope3CohortDetail passthrough.
- `src/__tests__/googleJwt.test.js` (22) — Google OIDC verification: real RS256 keypair, alg-confusion rejects, exp/nbf/aud claims, JWKS cache.
- `src/__tests__/anthropicStream.test.js` (22) — server-side streaming: createItemExtractor + tryParseJsonLoose + streamAnthropicJson (text/thinking/usage/progress/delta/item events, mocked fetch).
- `src/__tests__/freshness.test.js` (21) — daysSince + cadence-aware freshnessBucket buckets.
- `src/__tests__/csv.test.js` (19) — toCsv + parseCsv round-trip + RFC-4180 escaping + downloadCsv plumbing.
- `src/__tests__/adminToken.test.js` (17) — HMAC token sign + verify; Infinity/NaN exp defense; verifyAdminRequest header handling.
- `src/__tests__/targets.test.js` (17) — linear trajectory math + on_track/lagging/off_track bands + reductionTargets invariants.
- `src/__tests__/anomaly.test.js` (16) — meter anomaly detection: spike/flat/gap/stale detectors + qualityScore penalty curve.
- `src/__tests__/lessonStore.test.js` (16) — teacher-lesson save/list/delete + createdAt-preserve regression.
- `src/__tests__/assetInventory.test.js` (16) — seed + edits + decommissioned + added layers, seed-id collision throw, provenance tagging.
- `src/__tests__/customActions.test.js` (20) — admin custom-action + stage-plan localStorage CRUD + rollupPlan math + createdAt-preserve regression.
- `src/__tests__/rateLimit.test.js` (14) — token-bucket consume/refill/cap + retryAfterMs + getClientKey precedence.
- `src/__tests__/quizLedger.test.js` (13) — quiz-attempt ledger + storage wrapper (per-class rollup, lesson filter, per-student results).
- `src/__tests__/comparison.test.js` (13) — percentChange / trendKind bands / yoyMonthly month-join.
- `src/__tests__/unsubscribeToken.test.js` (12) — HMAC-signed unsubscribe tokens + token-based unsubscribe endpoint.
- `src/__tests__/environmentNews.test.js` (14) — /api/environment-news Anthropic+web_search wrapper, cache, force-refresh, studentConnection validation.
- `src/__tests__/alertCron.test.js` (21) — alert evaluator (stale-table + dead-meter), email composition, cron handler auth.
- `src/__tests__/alertsApi.test.js` (27) — subscribe/unsubscribe/list endpoints, sendEmail Resend wrapper, isLikelyEmail.
- `src/__tests__/alertCronState.test.js` (6) — persistent alert dedup state (memory fallback + Supabase upsert).
- `src/__tests__/alertHistory.test.js` (12) — append-only alert-email audit trail + admin read endpoint.
- `src/__tests__/personalFootprint.test.js` (15) — student footprint estimator math + suggestion targeting.
- `src/__tests__/geoLayout.test.js` (8) — geographic mode of /campus-map: lat/lng → SVG equirectangular projection, sqft scaling, missing-position counting, degenerate same-coord handling.
- `src/__tests__/buildingEmissions.test.js` (varies) — per-building emissions roll-up + month filtering used by /campus-map, /buildings/:id, /dorm-leaderboard.
- `src/__tests__/useViewport.test.js` (6) — useIsNarrow + useViewportWidth: mount value, resize event reactivity, custom breakpoint, exported NARROW_BREAKPOINT.
- `src/__tests__/LayoutResponsive.test.js` (4) — Layout swaps between desktop horizontal nav and the mobile hamburger drawer based on viewport width; verifies drawer open/close + that high-traffic routes are reachable from the drawer.
- `src/__tests__/buildingPositions.test.js` (8) — every position row has a valid id + finite lat/lng + cited provenance; helpers (getBuildingPosition, allPositionsAreEstimated/CitedOrBetter) work; lat/lng cluster near KUA.
- `src/__tests__/CampusPhotoMap.test.js` (3) — Photo mode of /campus-map: mounts, loading state, missing-asset fallback when the official KUA map PNG isn't present.
- `src/__tests__/CampusSatelliteMap.test.js` (2) — Satellite mode of /campus-map: mounts the pigeon-maps Esri imagery layer + recenter button.
- `src/__tests__/scenarioModel.test.js` (13) — /scenarios what-if math: baseline identity, per-lever effects (electricity reduction / heat-pump electrification / solar / tree planting), multi-slider layering, zero-baseline safety.
- `src/__tests__/DormLeaderboardPreview.test.js` (3) — homepage strip: renders top 3 dorm rows + links to /dorm-leaderboard + per-dorm links to /buildings/:id.
- `src/__tests__/adminFetch.test.js` (13) — token-expiry detection in the browser fetch wrapper.
- `src/__tests__/PasswordGate.test.js` (13) — admin auth gate: server login flow, session restore, expired/malformed session rejects, logout.
- `src/__tests__/chatbotMatch.test.js` (12) — keyword-scoring chatbot matcher + QUIZ_BANK invariants.
- `src/__tests__/bmsExportMapping.test.js` (12) — BMS meter→building localStorage map: default merge, override/delete, reverse lookup.
- `src/__tests__/sseClient.test.js` (11) — client-side parseSSE wire protocol (delta / progress / thinking / done / error).
- `src/__tests__/hotspots.test.js` (11) — buildingHotspots severity/sort + rankActions scoring.
- `src/__tests__/csvMeterFormatter.test.js` (11) — MeterReading→CSV escaping + round-trip with parseMeterCsv.
- `src/__tests__/FreshnessAlert.test.js` (11) — AdminHome banner severity + grammar + link target.
- `src/__tests__/CsvMeterAdapter.test.js` (11) — CSV meter adapter: ingest, NaN/missing-field filter, getBuildingEnergy math.
- `src/__tests__/readingsStore.test.js` (10) — in-memory meter-readings store: dedupe-by-id idempotency + half-open time window.
- `src/__tests__/extractFileText.test.js` (10) — teacher-upload text extraction: size cap, type/extension routing, truncation.
- `src/__tests__/ThinkingPanel.test.js` (10) — shared extended-thinking panel: suppression, expand/collapse, char-count formatting.
- `src/__tests__/MockMeterAdapter.test.js` (10) — synthetic meter generator: determinism, interval count, getBuildingEnergy rollup.
- `src/__tests__/BmsExportMeterAdapter.test.js` (9) — BMS export synthesis: the honest-synthesis invariant (hourly sums to daily total) + mock fallback.
- `src/__tests__/useMeasuredScopeTotals.test.js` (8) — composer hook: gross/net identities + measuredScopes [1,4] bounds + scope2 constant.
- `src/__tests__/hash.test.js` (8) — quickHash/hashUserId determinism + per-role domain-prefix collision avoidance.
- `src/__tests__/aiUsageTally.test.js` (8) — session-wide token usage tally on AdminHome.
- `src/__tests__/meterAdapterFactory.test.js` (7) — getMeterAdapter source selection + cache lifecycle.
- `src/__tests__/equivalents.test.js` (7) — kWh / mtCO2e real-world equivalents + zero-guards.
- `src/__tests__/CalibrationBadge.test.js` (7) — calibration pill display.
- `src/__tests__/BmsMeterAdapter.test.js` (7) — Eclypse REST adapter config contract + read-only guarantee.
- `src/__tests__/auditLogPaging.test.js` (6) — fetchAllAuditLog progress + maxRows ceiling + error short-circuit.
- `src/__tests__/measuredCache.test.js` (6) — promise-cache dedupe + invalidate.
- `src/__tests__/supabaseServer.test.js` (5) — cached server client: no-env null, race-condition Promise cache, reset.
- `src/__tests__/Renewables.test.js` (4) — public /renewables measured-flip rendering.
- `src/__tests__/Goals.test.js` (3) — provenance pill flip on Goals.
- `src/__tests__/Executive.test.js` (3) — cohort row + ScopeRow pills.
- `src/__tests__/ErrorBoundary.test.js` (3) — fallback rendering on caught errors.
- `src/__tests__/AdminPlanAgent.test.js` (2) — TDZ regression guard for the keyboard-shortcuts deps array (Phase 197).
- `src/App.test.js` (1) — top-level smoke test.
- **Page sweeps** — `publicPagesRender.test.js` (32), `adminSubPagesRender.test.js` (20), `adminPagesRender.test.js` (15) mount every routed page (admin + public + per-scope sub-route) and assert non-empty content. Net under future deps-array TDZ / undefined-import / render-time crashes — these caught the Phase 197 plan-agent crash that had shipped since Phase 128.

When adding a measured-data path, mirror the existing test shape: empty/null fallback, math sanity, skip-invalid-row, factor-table exposure, round-trip with the placeholder version.

`src/utils/`, `src/storage/`, every adapter in `src/adapters/meter/`, every `/api/*` handler, and every routed page are under test. The thinnest remaining surface is `src/components/` (interactive child components reached only by user action — page smoke tests mount the top-level but don't click through to children).

## Conventions

- Styling is done with inline `style={{...}}` objects and a small `App.css`. There is no CSS framework, no component library, and no shared style module — matching the existing inline-style patterns is fine.
- Mobile / responsive: because the codebase doesn't have media queries, responsive branches live in JS. Components that need a different layout on phones import `useIsNarrow` from `src/hooks/useViewport.js` (default breakpoint 720px, custom-breakpoint arg supported) and swap their style branch. Desktop code path stays unchanged when `isNarrow === false`. Layout collapses to a hamburger drawer on narrow viewports.
- Visual polish primitives (Phases 266–355): `<AnimatedNumber>` + `useAnimatedNumber` hook for counting hero stats (the hook works inside SVG `<text>` where the component's `<span>` doesn't); `<AmbientParticles>` for the homepage hero backdrop; `<Skeleton>` + `<NewsCardSkeleton>` for async loads; `<Icon>` for stroke SVG icons (Leaf, Trophy, Sparkles, Bolt, ArrowLeft/Right, Chart, Map, HelpCircle, Share, Download, Refresh); `<BackToTop>` floating scroll-to-top button (mounted at Layout level, appears past 500px); `<CommandPalette>` (Cmd+K / Ctrl+K) — Linear/Notion-grade fuzzy-search jump-to-anywhere, mixed navigation + action items (Print, Copy URL, Open issue, Scroll to top, etc.); `<RouteProgress>` top-of-page cyan bar on every route change; `<CopyButton>` reusable clipboard primitive. `MetricGrid` auto-animates any numeric `value` field. `SectionHeader` accepts an optional `icon` prop. `Pill` (in ModuleShell) has inset accent-color glow per kind. Inter variable font loaded from rsms.me/inter with `cv11 ss01 ss03 cv02` feature settings; tightened letter-spacing on h1/h2/h3. **3D / cursor effects:** `useCardTilt(opts)` hook applies Apple Vision Pro-style perspective rotation following the cursor; `useSpotlight(externalRef?)` hook updates `--kua-mx`/`--kua-my` CSS custom props so `.kua-spotlight::after` paints a 600px radial cyan glow at the cursor — both used on the homepage hero + applied via opt-in class to AISummary, ScopeDonut, PeerComparison, MonthlyDigest hero, Learn CTA. Animation utility classes live in `src/App.css`: `.kua-hero-card` (drifting gradient + glow), `.kua-card-hover` (lift + accent on hover), `.kua-cta-card` / `.kua-cta-arrow` (sliding-arrow CTA pattern), `.kua-back-arrow` (sliding-left back-link arrow), `.kua-bar-grow` (bar fills 0→target via CSS custom prop), `.kua-trend-bar` (scale-up from baseline), `.kua-champion-glow` (gold-aurora pulse for winner cards), `.kua-pulse` (slow scale-fade for live indicators), `.kua-donut-segment` (sequential reveal), `.kua-metric-card` (stagger entry), `.kua-faq-answer` (FAQ slide-in expansion), `.kua-detail-slide` (campus-map detail panel slide-in), `.kua-spark-area` (Sparkline + TimeSeriesChart area fade-in), `.kua-header-scrolled` (glassmorphism backdrop blur), `.kua-logo-enter` (homepage KUA mark entrance), `.kua-tilt` (3D perspective container), `.kua-spotlight` (cursor-following radial glow), `.page-fade-in` (route-change fade, used by public Layout AND AdminLayout). The Tools dropdown menu uses `kuaMenuOpen` keyframe + backdrop blur for glassmorphism. Native `<details>` markers replaced with a CSS-only rotating SVG chevron via `summary::before`. Every animation is wrapped in `@media (prefers-reduced-motion: reduce)` and disabled cleanly. Range sliders, text inputs, scrollbars all themed globally. Both public Layout + AdminLayout share the Leaf icon brand mark (cyan + amber respectively).
- Public nav structure (Phase 273 trim): top-nav 9 items + "Tools" dropdown 5 items (student-facing) + 5 portal buttons. The 14 routes that moved out of the visible nav (Hotspots, Sinks, Report, Drawdown, Credits, Renewables, Goals/Actions standalone, Dining/Transportation/Waste/Procurement, Trend Builder, Share QR) live in 3 themed footer columns (Insights / Plan & finance / Operations). Every URL still resolves. Header gains a glassmorphism backdrop blur when scrolled past 60px.
- Loading states: for async-loading components, prefer the `<NewsCardSkeleton>` (or generic `<Skeleton>`) primitive in `src/components/Skeleton.js` over a "Loading…" text label — keeps the layout shape locked in so content doesn't pop when remote data arrives. The skeleton injects its CSS keyframes once on mount; no global stylesheet change required.
- Static assets in `src/public/` get copied to the site root at build time. Drop images at `src/public/{path}.png` and reference them as `/{path}.png` in components. The `/campus-map` Photo mode + `/buildings/:id` photo slot both use this pattern with a graceful "asset missing" fallback so a missing file never throws.
- Map of campus is available in four modes on `/campus-map`: Schematic (by-category zones), Geographic (lat/lng on a blank canvas), Photo (energy dots overlaid on the official KUA bird's-eye-view illustration at `/kua-campus-map.png`), Satellite (real Esri World Imagery via pigeon-maps with markers at each building's cited lat/lng). Building positions live in `src/data/buildingPositions.js` — they came off the official KUA campus map (provenance: cited, not GPS-surveyed).
- Emission factors live in `src/data/scopeTotals.js` (Scope 1/3 + sinks + renewables) and `src/data/gridMix.js` (Scope 2). Admin forms in `src/pages/admin/*` read these via `useFactor` / `useTable` from `_shared.js`.
- API handlers use `createRateLimit` + `getClientKey` from `src/utils/rateLimit.js` — token-bucket per IP. Mirror existing handlers when adding new ones.
