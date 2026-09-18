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

### The dorm registry never agreed with the cohort model (Phase 419)

Phase 414 corrected the boarding split to KUA's published 76%, moving boarding from 240 to ~258. It did not check the dorm data, and that turned out to matter: `dorms.js` sums to **228** and `buildings.js` `dormPopulation` sums to the same 228, against a cohort model of **258**. A 30-student gap.

The file explained itself as "about **67%** of the 340-student enrollment per KUA's public boarding/day mix" — 67% being the old 70/30 assumption the school's own site contradicts. So the registry was derived from a mix that is not KUA's.

**The headcounts were not changed, deliberately.** They divide into the kWh/student/day figure on `/buildings` and the `perResident` ranking on the dorm leaderboard. Inflating eleven houses to reach 258 would have moved a student-facing competitive ranking in order to tidy a disclosure problem — fixing the number where it is *stated* by corrupting it where it is *used*. Checked and confirmed first: `occupants` and `dormPopulation` agree on all 11 dorm buildings, so there is no live arithmetic error, only a false provenance claim.

Two things recorded instead. The note now states the gap and what would settle it (the residential-life roster — either ~30 boarders live somewhere unmodelled, or the per-dorm numbers are low). And it names the second trap: the two files agree at 228 because they were **typed to agree**. `dorms.js` imports nothing. That is duplication, not corroboration — the same pattern as the Phase 390 ledger and the Phase 411 sink cross-check, where agreement between figures sharing an origin was read as confirmation.

The existing tests checked topology only — every dorm maps to a building, every Dorm building is registered — and never compared totals, which is how 228 and 258 coexisted. A test now holds the two registries equal and pins the 228, so closing the gap becomes a deliberate edit with a roster behind it.

### The public FAQ said the school was net-negative (Phase 418)

Sweeping for the old sinks range turned up something worse than a stale range: an **older inventory**, still live on public pages, that reverses the dashboard's central conclusion.

`Faq.js` told readers "KUA's gross footprint is about **1,500** mtCO₂e/yr; the campus forest pulls back roughly **2,100** of those". That is 1,500 − 2,100 = **−600**: net-negative. The dashboard reports 4,375 gross, 2,650 sinks, **+1,725 net**. The FAQ is where a parent or a trustee starts, and it inverted the headline finding. `CarbonMath.js` said it outright too — "the forest sequestration is larger than gross emissions, which is why KUA can claim net-negative status" — and its AP problem worked from "gross 1,500 ± 200, sinks 2,100 ± 300", concluding "net negative 600 ± 361".

All corrected to 4,375 / 2,650 / 1,725. The σ-propagation problem keeps its answer: √(200² + 300²) = 361 is independent of the inputs, so only the premise and conclusion moved — the statistics lesson is intact and now describes the school that actually exists. `DailyTip` and three `lessonLibrary` tasks carried 2,100 as the sink and now say 2,650.

The FAQ's forest answer also asserted 1,000 forested acres as fact. Phase 414 established KUA publishes the 1,300-acre campus total and no forested acreage, so it now says the 1,000 is our own working figure and that 2,650 sits at the top of a 1,000–2,650 spread.

**Why this survived seventeen phases:** `proseFigures.test.js` guards seven files, and `Faq.js`, `CarbonMath.js` and `DailyTip.js` were not among them. All three are now in `PROSE_FILES`. The tripwire exists precisely for headline figures stated in sentences, and the most public sentence in the repo was outside it.

Worth noting what was checked and left alone: `NetEstimate.js`'s "low end is net-negative" is **correct** — the composite low end genuinely is — and `1,500` appears nowhere else, so this was a localised remnant rather than a second inventory running in parallel.

### Two pages were still computing with a stale grid literal (Phase 417)

The Phase 416 residual check reported non-zero and the commit went ahead anyway. Running it properly turned up 21 `0.235` sites — and two of them were not prose.

**The real bug.** `MonthCompare.js` and `MonthlyDigest.js` each declared their own `const ISO_NE_KG_PER_KWH = 0.235` and computed the campus mtCO₂e they display from it. Both already imported from `utils/buildingEmissions.js`, so the canonical factor was one line away. Those two pages had been reporting ~0.3% above every other surface since Phase 392 — the exact failure that phase existed to eliminate, surviving in the two places nobody thought to grep.

**Worked math**, all consumption so the inventory rate was right and only the value stale: the Scope 1 heat pump (whose savings line said 61.0 when its own previous line said 61.3 — now 43.0), the EV van, the Scope 3 EV bus, and CarbonMath q1, where the stored `answer` field had to move with the prose (1,269 → 1,264) or correct work would have been marked wrong.

**Stale ranges everywhere, and derived ones needed rebuilding rather than swapping.** Phase 416 fixed `estimate-action.js` and left the same literals in `chat.js`, `plan.js`, `AnnualReport`, `Executive`, `Scope1` and three `LearnAgent` lessons. Actual: **895–1,875** and **1,802–3,779**; the sinks range is **1,000–2,650** across four methods, not 2,100–2,650 across three.

The composite bands in `chat.js` were stale twice over — they predated both the range corrections *and* Scope 2 moving 385 → 390, which is why the old gross band reverse-engineered to a 366–405 Scope 2 instead of the current 371–410. Rebuilt: gross **3,068–6,064**, net **418–5,064**, per-student net **1.2–14.9**. The net band widened mostly because Phase 411 dropped the sinks lower bound to 1,000 — an honest consequence, and one an uncertainty lesson should display rather than hide.

Where a surface can import, ranges are now **interpolated** from `SCOPE1_RANGE` / `SCOPE3_RANGE` instead of retyped — hardcoding computed values is what produced this drift. Literals remain only in the serverless prompts, which cannot import.

Two interpolations shipped without their imports and the suite caught both. The lasting change is procedural: **the residual sweep now gates the commit** instead of being printed after it — which is how the last four sites, including a fourth copy of the net band nobody had pointed at, got found before shipping rather than after.

### The AI prompts were the surface the sweeps kept missing (Phase 416)

Three phases running, a value got fixed in `src/` and left standing in `api/`. Phase 409 corrected the grid figure on Scope 2 and never looked at the prompts; Phase 415 swept `api/` but for *citation strings*, not values. So `0.235` was still being handed to two AI system prompts as fact.

Corrected here: `api/chat.js` and `api/admin/estimate-action.js` both stated the effective grid rate as 0.235 against a canonical 0.234, and the solar benchmark in the estimate prompt priced displaced generation at the **inventory** rate — the Phase 409/410 error, surviving in the one place that reasons from it. That benchmark moves from 6–8 mt to **12–17 mt** at the AVERT marginal rate, and the prompt now says explicitly which rate answers which question.

**The estimate prompt was stale in five ways at once**, which is what makes prompts dangerous: they read as prose, so a sweep for constants slides straight over them. It carried the pre-Phase-414 cohort split (~100 day / ~190 boarders), credited the sink to "Birdsey 1992 + Nowak 2013" after Phase 411 rebuilt that cross-check, and quoted Scope 1 and Scope 3 ranges that Phase 414's cohort correction had already moved — 891–1,867 and 1,726–3,720, against actual 895–1,875 and 1,802–3,779.

The canonical `SCOPE3_PLACEHOLDER_BREAKDOWN` was also still describing "100 day commuters + 190 US boarders" in its own method string, two phases after the counts changed. And five remaining `EEIO v2.0` citations moved to Supply Chain v1.3 — the two inside Phase 404's audit comments were left alone deliberately, because they quote the old name to explain what changed.

The generalisation worth keeping: **a number that lives inside a sentence is still a number.** Prompt text, estimate anchors, UI hints and worked examples are all places a stale figure hides from a search for the constant — and in a prompt it does not merely display wrong, it gets reasoned from.

### The corrections had not reached the prompts or the pages (Phase 415)

Fourteen phases moved a lot of numbers. `proseFigures.test.js` guards gross/net/Scope 2 across seven prose files and never looks at `api/` — so the question was simply: does anything still quote a figure this audit changed?

**The worst was an AI system prompt.** `api/chat.js` told the model "beef ~60 kgCO₂e/kg vs chicken ~6". Phase 405 corrected those to 99.5 and 9.9, so the chatbot would have stated superseded numbers to students with full confidence while every page around it disagreed. A stale prompt is worse than a stale page: the page is visibly a number, the prompt sounds like knowledge.

**Phase 405 had also missed its own file.** `dining.js` rescaled `factorPerServing` 6.0 → 9.95 but left `menuScenarios` on the old basis (38 / 56 / 138), so the file disagreed with itself — and those figures had propagated into the planning AI's estimate anchors (`estimate-action.js` 55 and 30 mt, `plan.js` `r_beef_cut20` 56, `plan-item-alternatives.js` "50-60 mt"). Rescaled to 63 / 93 / 229, 91, 50, 93, "85-100". Rescaling is right here precisely *because* the per-serving factor already moved: the physical reduction is unchanged, the carbon it avoids is not. Non-beef figures were left alone — the menu-label item, local produce, the FAO LEAP citation.

**Then the first sweep turned out to be under-scoped.** It covered `api/` only, and the same staleness was sitting in `src/pages/` — with wrong *values*, not just wrong version labels:

- `Waste.js` still told readers that "negative emissions for recycling/compost reflect avoided emissions", describing behaviour **Phase 407 deleted**. Every Category 5 factor is positive now.
- `Scope3.js` published the WARM landfill factor as **+520 kg/ton** and compost as **+40**; the corrected figures are **580** and **110**.
- `Scope3.js` also still carried the **pre-Phase-414 cohort split** (~100 day / ~190 US boarders).
- `AnnualReport.js` — the most board-facing page in the repo — carried 0.235 against a canonical 0.234, plus "WARM v15" and "EEIO v2.0". It was not in the prose tripwire; it is now.

The lesson: a correction is not finished when the constant changes. It is finished when everything *derived* from it changes too — and derived figures hide in prompt text, in estimate anchors, in UI hint strings, and in worked examples that read like prose. A sweep scoped to one directory will find one directory's worth of them.

### The denominators, checked at last (Phase 414)

Two phases were spent making per-student comparisons honest without once checking the **divisor**. `TOTAL_STUDENTS` and the forested acreage sit under every per-student figure on the dashboard and under the whole sink calculation, both credited to "Wikipedia + KUA 'By the Numbers'" — so both were read at source.

**Enrolment 340 is correct.** KUA's own page says "340 Unique and kind students live and learn at KUA"; the Wikipedia infobox says "approx. 340". Third-party aggregators list 345, which would have shifted every per-student figure by 1.5% — a cited number does not get changed on aggregator evidence, and the school's own figure agrees with what was already there. **1,300-acre campus** is confirmed by both too.

**The boarding/day split was wrong.** The code said "roughly 70% boarding / 30% day" and encoded 100 day / 190 US boarding. KUA publishes **"76 Percent of students board"** — so ~258 board and ~82 are day students. The day count was **22% too high**, and it drives the day-student travel estimate. Now 82 / 208 / 50.

**The international count is an assumption and now says so.** KUA publishes "23 Countries represented" — countries, not students. There is no public international headcount, so 50 is a working estimate with US boarders as the remainder. It was previously indistinguishable from the sourced figures around it.

**"~1,000 forested acres" is in neither cited source.** `NetEstimate` claimed the "Total 1,000-acre figure is cited (KUA disclosure + Wikipedia)". Both give 1,300 for the *campus*; neither publishes forested acreage. The 1,000 is our own working figure, and `TOTAL_FOREST_ACRES` summing the seven stands to exactly 1,000 is fitted to it rather than derived. Same class of error as the Middlebury and Valls-Val embellishments: a real source cited for a number it does not contain. `ScopeExplainer` also called it a "~1,000-acre campus" when the campus is 1,300.

**And the student body was defined twice with nothing tying it together** — `TOTAL_ENROLLMENT` in `students.js`, a `COHORTS` split in `geographicEstimates.js`, agreeing at 340 by coincidence of maintenance. `COHORTS` is now exported and a test holds the three counts to enrolment and the boarding share to the published 76%. This is the failure `liveDataWiring.test.js` was written for, in a place it did not reach.

### The citations, checked against the papers (Phase 413)

Phase 412 found a false claim about a named school. The same question applies to the academic citations, and one number was doing an enormous amount of work: **"Valls-Val & Bovea (2021) reviewed 35 university footprint studies" appears in nine places**, including the visible caveat on the peer chart. One unverified figure repeated nine times reads as established fact.

**It checks out.** *Clean Technologies and Environmental Policy*, PMID 34456663 — "of the articles reviewed, 35 are aimed specifically at calculating the CF of HEI." The methodology findings are real too: no standardisation of "the time metric (year, semester), functional unit (student, employee, area) and data collection boundary".

**But one attribution was embellished.** The sink lesson said the paper found sequestration "rarely measured **even at institutions with significant forested land**". That clause is not in the paper. What the paper actually says is sharper and now replaces it: only **14%** of the 35 studies calculated any compensation potential, and where they did it offset **0.09%–18%** of gross; another 26% raised reforestation as a recommendation rather than a measurement.

**The paper also handed over something better.** It normalises the 35 footprints to **mean 2.67 mtCO₂e/student, range 0.06–10.94** — a genuinely citable per-student benchmark. That now appears on the peer chart, where it is worth more than the seven illustrative rows, and KUA's ~5.1 is stated as sitting *above* the mean.

**A test was enforcing an unread number.** `dataLayer.test.js` asserted per-student net inside a "2–15 mt envelope" credited to Gutiérrez-Mosquera et al. 2024. The paper is real but paywalled (Springer 303s to an identity provider), and the envelope could not be confirmed — so a test was policing a figure nobody had read. It now asserts the verified 0.06–10.94 range. Deliberately the range only: KUA falling below the 2.67 mean would be an improvement, not a regression, so pinning that direction would have been wrong.

**Cordero et al. (2020) was understated, not overstated.** Four places said students "made measurable behavior changes for years afterward". PLOS ONE pone.0206266 is more specific and more useful: graduates surveyed **at least five years** after an intensive one-year course cut about **2.86 tCO₂e per person per year**. Vagueness is not always the safe direction — here it gave away the strongest evidence for the dashboard's own premise.

Three sites (`:1155`, `:1173`, `:1216`, `:1243`) were checked and left alone because they were accurate. Also committed here: `peers` is now exported and guarded by a test asserting every non-KUA row stays `estimated` with no claimed sink, so Phase 412's correction cannot quietly revert.

### The peer chart made a false claim about a named school (Phase 412)

The peer comparison is the dashboard's most load-bearing external claim — that KUA is low per student — and it had never been checked. Two findings.

**Not one peer row traces to a published figure.** All seven are hand-typed, almost every value a multiple of 0.5, and no row carries a report name, year or URL. Checking what these schools actually publish: **Exeter** has a 2023 plan with *targets* (75% Scope 1+2 cut from 2005 by 2031, ~60% achieved) and no per-student inventory; **Andover** has a 2019–2030 plan with a 30% reduction target and FY tracking, no per-student inventory; **Yale** publishes percentage progress (Scope 1+2 −28% vs 2015; 2005 baseline 263,119 mtCO₂e), not a per-FTE figure. Lawrenceville, Choate and Williams were not researched, and now say so rather than implying a search came up empty. Every row is labelled `provenance: 'estimated'`, and the disclosure moved out of the collapsed "caveats" toggle into the visible blurb.

Also fixed: `sinks: 0` on every peer was rendering as a measured zero when it means *not quantified* — the same conflation the rest of the audit has been removing, and the one that flatters KUA, since the entire "we look low because we measure our forest" story rests on it.

**The Middlebury claim was simply wrong.** Five places said Middlebury "reaches net zero by purchasing offsets equal to gross emissions — a financial drawdown, not physical", contrasted against KUA's "REAL" forest. The record: a $12M biomass plant cut No. 6 fuel oil **91%** (2M → ~185,000 gal), three solar arrays totalling 1,150 kW supply ~8% of electricity, 87 Efficiency Vermont projects saved 4.52M kWh, and the residual was closed with credits quantified from **their own 2,100 acres of Bread Loaf forestland** under a Vermont Land Trust easement. So neutrality came mostly from real reductions, and the offsets are their own land — the very thing KUA claims as its differentiator. The repo also contradicted itself: the AASHE-STARS lesson already described it accurately.

The honest distinction, now used everywhere: KUA reports its forest as a **sink inside the inventory**; Middlebury **monetised** theirs as tradable credits. Same physical carbon, different accounting treatment — and a credit carries an obligation a sink does not, since it is sold once and the forest must stay unlogged for the claim to hold. Middlebury's unsourced `offsets: -5.5` was removed rather than re-guessed.

Worth stating plainly: this was a false statement about a third party, published to a school-board audience, and it happened to flatter the school publishing it. Those are the claims to check first, not last.

### The forest sink had never been audited (Phase 411)

Scopes 1, 2 and 3 all got audited. Sinks did not — and at ~2,650 mtCO₂e it is the **single largest number in the inventory**, larger than any Scope 3 component, and the one that produces the net-negative framing and the "KUA looks low because we measure our forest" claim. Three defects, none of which required a primary source to see:

**A circular corroboration.** The "3-method cross-check" had Method B labelled *USDA NH Forest Inventory Analysis* — but it used 2.65 mtCO₂e/acre/yr, which is exactly the per-stand inventory's own average, i.e. Method C's number. Its comment even conceded it ("KUA stands per sinks.js average ~2.65"). So two of three methods were one number wearing two hats, both landing on 2,650, and the range test passed trivially because the adopted figure *was* the high end. This is the Phase 390 failure repeating: agreement between figures that share a source is not agreement.

**A double unit conversion.** Method B's stated derivation read "31.8 tons C/acre × ~1% annual growth ≈ 1.17 mt C/acre/yr × 44/12 = 4.3 mtCO₂e". But 31.8 × 1% = 0.318 t C/acre/yr, and 0.318 × 44/12 **is** 1.17 mtCO₂e — the 1.17 was the answer, not an intermediate. Applying 44/12 again inflated it 3.67×. The method then used neither 1.17 nor 4.3; it used 2.65.

**A citation stretched past its scope.** The open-grown rate of 4.2 comes from Nowak et al. 2013, an **urban-tree** study — correct for the 40 acres of open-grown campus trees, a stretch across the other 960 acres of closed canopy. `Methodology.js` also named the wrong journal: the 7.69 kg C/m² and 0.28 kg C/m²/yr figures are from *Environmental Pollution* 178, not *Urban Forestry & Urban Greening*.

**What replaced it.** EPA's GHG Equivalencies figure — **1.00 mtCO₂e per acre per year** for average US forest, from USDA Forest Service data in the Inventory of U.S. GHG Emissions and Sinks 1990–2022 — is now Method D, and the only genuinely independent number in the set. The spread became:

| method | mt | rate |
|---|---|---|
| EPA GHG Equivalencies (net) | 1,000 | 1.00 |
| USDA NH FIA (standing C × growth) | 1,170 | 1.17 |
| Birdsey 1992 (US closed-canopy avg) | 2,100 | 2.10 |
| KUA per-stand inventory (**adopted**) | 2,650 | 2.65 |

Central 1,730, and the adopted figure sits at the very top.

**Why they differ, and why 2.65 is not automatically wrong.** EPA's 1.00 covers all five carbon pools and is *net* of harvest, removals and decomposition, so it is dragged down by logging across the national estate. Birdsey's 2.1 and Nowak's 4.2 are growth of standing trees. An unharvested woodlot should legitimately beat the national net average — this is the same unit-versus-question split as the grid factor, not a straightforward error. But adopting a rate above even Birdsey's closed-canopy average is a **choice**, resting on per-stand rates that the file's own header admits are placeholders rather than a forest inventory.

Repricing to ~1,000–1,200 mt would roughly **double** the net balance (1,725 → ~3,300) and move per-student net from ~5.0 to ~9–10, which relocates KUA from the low end of the peer chart to mid-pack. Far too large to change autonomously, so it is filed (#16) and the range is published honestly instead, with the adopted figure named as the top of it.

New test: the cross-check methods must be **distinct numbers**. A range assembled from an echo overstates agreement, and nothing previously caught that.

### Sweeping the inventory-vs-marginal error on purpose (Phase 410)

By this point the same error had been found five times — the grid factor, the heat-pump quiz, the recycling credit, purchased goods, the solar lever — and **every one of them turned up by accident** while looking for something else. So this pass went hunting: every calculation whose language is *avoided / displaced / offset*, checked against the factor it actually uses.

Most of the surface was clean. `scenarioModel.js`, `GRID_FACTOR_KG_PER_KWH`, LearnAgent's heat-pump quiz and the Phase 409 solar lever all use the AVERT marginal rate and say why; Drawdown and Scenarios carry no factors of their own.

Two were not. `Scope2BmsInsights.js` priced each solar feed's "avoided" figure at the **inventory** rate, understating measured on-campus generation by about half — and it contradicted the repo's own house rule, since `composeSolarFromRecords()` prices both self-consumed and exported solar at the marginal rate and tags its output `factorBasis: 'marginal (displaced generation)'` precisely so a caller cannot mistake it. Its neighbours were checked and left alone: net Scope 2 in window, and EV charger load, are **consumption**, where the inventory rate belongs.

`DailyTip` conflated two quantities rather than being flatly wrong — "offsets ~150 mt of scope 2" used the inventory rate for something it called an offset. It now states both: ~152 mt off the reported Scope 2, ~318 mt actually avoided at the margin.

The lesson worth keeping: this class of defect does not announce itself, because the units always match and the arithmetic is always right. It is only visible if you ask which *question* a factor was published to answer.

### The solar lever was priced at the wrong rate (Phase 409)

Scope 2's action blocks carried eight hardcoded `0.235` figures against a canonical 0.2344. Most were harmless display drift — the LED and HVAC blocks already **computed** with `KG_PER_KWH` and only the printed formula said 0.235, so the number on screen was right and the caption describing it was wrong. Those are now interpolated rather than retyped.

One was not cosmetic. The solar block priced displaced generation at the inventory average: `127,000 × 0.235 = 29,800 kg ≈ 30 mtCO₂e/yr`. Solar displaces whichever plant is running at the margin, and that plant is dirtier than the average, so at the AVERT rate the same array avoids **~62 mt** — roughly double. The range and impact band moved with it (~44–85 per 100 kW). This was the Phase 392 error still sitting in a student-facing worked example, two phases after the data layer was fixed.

Also fixed: a data row claiming "matches gridMix.js" while showing a value `gridMix.js` does not produce, and `scenarioModel`'s JSDoc advertising a `0.235` default when the real default is `KG_PER_KWH`. `Scope2.js` joined the prose tripwire — with the literals replaced by interpolation there is nothing left for it to catch today, which is the point: it fires the moment someone retypes a factor into the copy.

### The methodology page catches up with the audit (Phase 408)

The school-board-facing source list still described the factors as they were before Phases 404–407. Waste said WARM *"net factors"* — the exact phrasing Phase 407 disproved, since it implies credits. Air travel said "DEFRA conversion factors" with no year and no statement of the non-CO₂ basis. Purchased goods said "EEIO" with no version and no dollar-year, which is the whole ballgame for a spend-based factor. Food and passenger vehicles had no rows at all, despite both driving visible numbers.

Each row now names its exact table and basis, including the two places where the choice of basis decides the answer: DEFRA's with/without non-CO₂ sets, and EPA's Category 5 waste factors versus WARM's life-cycle ones.

`Methodology.js` was also **not** in the prose drift tripwire despite being the most citation-critical page in the repo — and it carried the grid factor as 0.235 against a canonical 0.234. Both fixed.

No new surface was built: `/whats-new` and `/methodology` already existed, so the audit narrative went into the existing changelog (three entries, written for a non-specialist reader) rather than a new page.

### Recycling is not a credit in an inventory (Phase 407)

Phase 404 deliberately refused to relabel the waste factors "v16" without checking them. Checking them found something bigger than a version bump.

The repo priced recycling at **−0.10** and composting at **−0.18** — negative, on the stated reasoning that those pathways are "a net carbon avoidance vs the assumed counterfactual." WARM's Exhibit 1-1 does publish such figures (mixed recyclables recycled: −2.80 MTCO₂E/short ton), because WARM is a *life-cycle* model crediting avoided virgin production.

That is the wrong question for an inventory, and EPA says so directly. The GHG Emission Factors Hub, **Table 9 — "Scope 3 Category 5: Waste Generated in Operations"** — notes the factors *"do not include avoided emissions impact from any of the disposal methods. This exclusion is an adjustment to the life-cycle factors in the WARM tool. Thus the waste factors presented above will not directly match the factors published in the WARM tool."* Recycling excludes avoided process energy and forest carbon storage; composting excludes fertilizer offset and soil carbon storage; landfilling excludes energy recovery and sequestration.

So **every Cat 5 factor is positive**, and the repo's negatives were crediting KUA for virgin manufacturing it never performed — the identical error to pricing avoided electricity at the inventory grid rate. Adopted (MT CO₂e/short ton, AR4): Landfill 0.52 → **0.58**, Recycling −0.10 → **+0.09**, Composting 0.04 → **+0.11**, E-Waste 0.30 → **+0.02**. `emissionFactors.js` converts at ×1.10231: 0.467 → **0.639**, −1.07 → **+0.099**, −0.18 → **+0.121**.

How much this mattered: `geographicEstimates`' best-case waste method returned a **negative total footprint** (about −4.6 mt) — the campus earning carbon by throwing things away. The three methods now come out near 13.8 / 19.7 / 32.7 mt.

The teaching claim survives intact and gets sharper: composting still beats landfilling, 0.11 against 0.58. It is a **smaller emission, not a credit** — which is the more useful thing for a student to know.

Two things left alone on purpose. `Hazardous` (0.50) has no WARM or Hub category and is now labelled unsourced rather than given an invented value. And the placeholder breakdown's hardcoded `Waste: 5 mt` sums into `SCOPE3_PLACEHOLDER_MT`; the corrected basis implies ~22 mt, but moving it would desync that headline constant, so the gap is stated in place.

### One car, three EPA numbers (Phase 406)

`Scope3.js` showed a solo-car factor of 0.404 kg CO₂e/passenger-mi; the data layer used 0.351 (and 0.218 kg/km). Both cited EPA. Checking the sources found **three** different published figures answering slightly different questions:

| source | value | implied mpg |
|---|---|---|
| EPA Green Vehicle Guide, "typical passenger vehicle" | 0.400 kg CO₂/mi | 22.2 |
| **EPA GHG Emission Factors Hub 2025, Table 10, Passenger Car** | **0.2986 kg CO₂e/mi** | ~29.6 |
| what the repo used | 0.351 / 0.404 | 25 / — |

Neither 0.351 nor 0.404 is an EPA number. 0.351 is 8.78 kg/gal at a 25 mpg assumption wearing an EPA label; 0.404 was cited to "EPA GHG Hub Mobile Combustion", a table that says 0.297.

The Hub settles it without a judgement call: **Table 10 is "Scope 3 Category 6: Business Travel and Category 7: Employee Commuting"**, distance-based — exactly the calculation the commuting model performs. Passenger Car is 0.297 kg CO₂ + 0.0059 g CH₄ + 0.0053 g N₂O per vehicle-mile, so 0.29857 kg CO₂e at AR5 GWPs, or 0.1855 kg/km.

Adopted as canonical wherever the repo cites EPA: `COMMUTE_FACTORS_KG_PER_KM` (0.218 → 0.1855, carpool 0.087 → 0.0742), `ef_car_avg`, `transportation.js` carpool avoidance, `reductionActions`, `Scope3.js` (whose worked carpool example recomputes to 41.8 / 20.9 / 20.9 mt), and `personalFootprint.js` (0.40 → 0.2986, since that file computes a commute and its header promises Hub sourcing).

**Kept at 0.351 where 25 mpg is an explicit premise**, relabelled as an assumption rather than an EPA citation: the LearnAgent drive-vs-fly quizzes state "25 mpg" in the problem, and `geographicEstimates`' commuting Methods A/B/C deliberately cross-check three fleet bases (25 mpg, ICCT EV-adjusted 0.30, ICCT 2018 0.366). Collapsing A onto the EPA figure would have destroyed a spread that exists on purpose — the label was wrong there, not the number.

Incidental corroboration: Hub Table 2 gives Diesel at **10.21 kg/gallon**, independently confirming the Phase 401 correction. Table 10 also publishes a short-haul air factor (0.207 kg CO₂/passenger-mile), an EPA alternative to the DEFRA figures Phase 404 made consistent — noted, not adopted.

### The food factors were not the slice they claimed (Phase 405)

Phase 404 filed the food factors as "looks wrong, probably isn't" — the file's comment said **cradle-to-farm-gate**, which would have explained meat sitting below the headline figures. Pulling OWID's per-stage supply-chain breakdown (land-use change / farm / feed / processing / transport / retail / packaging / losses) disproved it:

| food | farm-gate | full chain | repo had |
|---|---|---|---|
| Beef (beef herd) | 82.15 | 99.48 | **60** |
| Lamb & mutton | 30.96 | 39.72 | **24** |
| Fish (farmed) | 11.09 | 13.63 | **5** |
| Poultry | 6.89 | 9.87 | **6** |
| Rice | 3.53 | 4.45 | **4.0** |
| Peas | 0.72 | 0.98 | **0.9** |
| Other vegetables | 0.18 | 0.53 | **0.5** |

The plant rows, eggs and dairy were already at the **full-chain** values; only the meat rows were low, and low against farm-gate too. So it was never one slice applied consistently — it was the older circulated "beef 60 / chicken 6" teaching set mixed with current totals, with the meat rows understating by 40–170%. All rows now carry OWID's per-kg compilation of Poore & Nemecek, cited that way because the paper published per 100 g protein and per 1,000 kcal — the per-kg figures are OWID's derivation.

Beef uses the beef-herd figure (99.48). Dairy-herd beef is 33.3 and US supply is a mix, so this is deliberately the conservative-high end rather than an unsourced blend — the same call the repo makes on the eGRID gap.

**No headline moved.** `SCOPE3_DINING_RANGE` is built from per-*meal* benchmarks (0.70 / 0.85 / 1.10 kg CO₂e/meal), not from these factors, so the 235 mt dining line is untouched. `ef_food_*` reaches only the `/dining` demo purchase table — and roughly eight student-facing teaching surfaces, which is the real reason this mattered.

Dependent content corrected with it: `KG_PER_BEEF_SERVING` 9 → 15 (150 g × 99.5), the beef-swap quiz (292 → 484 kg, so its correct option moved), the "10× less than a flight" claim (now ~6×), `DailyTip`, `learningContent`, `chatbotMatch`, and an APES worked example. `dining.js` per-serving values were rescaled by each protein's own correction ratio so the original portion assumptions survive rather than being re-guessed.

Three teaching claims were checked and **survive** the correction: beef:chicken is still ~10× (99.48/9.87 = 10.1), wheat is still ~60× lower than beef (63×), and lamb still ranks below beef. Beef vs plant foods moves from "50–100×" to "100–200×".

### Scope 3 factor audit (Phase 404)

Scope 3 is ~2,635 mt — the largest and least-verified scope. Every load-bearing factor was checked against the primary source. Three were wrong, one is wrong but too consequential to change alone, and one looks wrong but isn't.

**Air travel: two conflicting live factor sets, both citing "DEFRA 2024."** `geographicEstimates.js` used 0.255 short / 0.241 long (driving the 760 mt cohort model); `emissionFactors.js` used 0.395 short / 0.193 long (driving the public `/transportation` page). Neither matched the published table, and both put SHORT-haul above LONG-haul. Parsing the actual DEFRA 2024 condensed set ("Business travel- air"): economy, including the indirect effects of non-CO₂ emissions — the set DEFRA's own guidance tells organisations to use — is **0.18287** short and **0.20011** long kg CO₂e/passenger-km; ×1.609344 gives **0.294** and **0.322** per passenger-mile. Long-haul economy is *higher* than short-haul in this set. The old 0.193 turns out to be the long-haul figure *excluding* non-CO₂ effects, so that two-row table was mixing bases. Derived values rescaled with it: `A_mtPerRt` 3.0 → 4.0, and `TRIP_MT_BY_REGION` by 0.322/0.241 = 1.336 (europe 2.4 → 3.2, asia 3.0 → 4.0, other 2.5 → 3.3; domestic unchanged, it's drive-dominated).

**Two LearnAgent quizzes had their answer keys inverted by this.** At the real rate, solo driving a 25-mpg car is *worse* than flying economy at both 700 and 1,000 miles (246 vs 206 kg; 351 vs 294 kg). Both quizzes taught the opposite because 0.395 matched no published row. The genuine lesson — occupancy, not mode, decides it — is now stated explicitly: two people in that car beat the flight.

**Procurement factors were hand-set round numbers** cited to "US EPA EEIO v2.0," which is a model, not a published factor set. The real dataset is EPA's Supply Chain GHG Emission Factors **v1.3** (kg CO₂e per **2022 USD at purchaser prices**, AR5 GWP100, 1,016 NAICS-6 commodities). Each row now carries the value for the commodity its purchases actually are: paper 0.420 → **0.296** (322230), IT 0.380 → **0.058** (334111 — overstated ~6.5×), cleaning 0.330 → **0.355** (325611), apparel 0.510 → **0.120** (315 — overstated ~4.25×).

**Left deliberately unchanged, and why.** `PURCHASED_GOODS_DEFAULT_EEIO_KG_PER_USD` is 0.40, but the four sectors it claims to average measure 0.222 unweighted against v1.3 (paper 0.537, electronics 0.096, cleaning 0.315, apparel 0.120; dataset median 0.173). Repricing would cut the purchased-goods line from ~1,315 mt to ~666 mt and drop **gross emissions ~15%** — a headline movement resting on a spend mix nobody has measured, since the $3M is itself a placeholder. The gap is published in a comment rather than quietly closed; the decision belongs to KUA. WARM values were **not** relabelled to v16 (released Dec 2023, superseding v15/v15.1) because the v16 tables weren't checked against them — a fresh version number over unrefreshed numbers is the exact failure the Scope 1 audit caught; only the internal v15-vs-v15.1 inconsistency was fixed.

**The food factors look wrong and are not.** OWID's per-kg Poore & Nemecek figures are full-supply-chain (beef 99.48, lamb 39.72, poultry 9.87) against the repo's 60 / 24 / 6. But the repo's own comment labels its set **cradle-to-farm-gate** — a different slice of the same paper — and the plant foods match closely (peas 0.98 vs 0.9, vegetables 0.53 vs 0.5, eggs 4.67 vs 4.5). Same unit, different question. Resolving it needs the paper's per-stage SI, so it is filed, not edited. Same call on `Scope3.js`'s solo-car 0.404 kg/passenger-mi vs the data layer's 0.351: EPA fleet-average (~22 mpg) vs an explicit 25-mpg assumption, not proven drift.

### Charts mounted where they teach (Phase 403)

Five chart components existed but four were never mounted, and `Scope2.js` referenced `GridVintageChart` with no import — the page was broken on disk. Now: `DegreeDayChart` on Scope 1 (weather against the 1991–2020 normal), `GridVintageChart` on Scope 2 (same kWh, five eGRID vintages), and `NetBalanceWaterfall` / `ScopeRangeChart` / `MeasuredShareChart` in a band under "By scope" on the homepage.

The three homepage charts are built to be read in one order: **what the total is made of**, **how sure each part is**, and **how much of it rests on meters**. The last one is the one that visibly redraws when admin data lands — today roughly 9% of the gross footprint is measured, and the hatched slices are the work remaining. `ScopeRangeChart` carries the claim the dashboard had only ever made in prose: Scope 3's uncertainty band alone is several times the entire Scope 2 figure, so the biggest number is also the least trustworthy one.

**A factor sweep came out of it.** Phase 401 corrected heating oil 10.16 → 10.21 in `scopeTotals.js` but nine other files still cited the old value — `emissionFactors.js` (a live data row), `CarbonMath.js`, `Methodology.js`, two admin pages, `ScopeExplainer.js`, `NetEstimate.js`, and four `LearnAgent.js` quiz blocks. Two quizzes had their **correct option change** (95,000 gal: 965 → 970 mt; the heat-pump retrofit: 38 → 43 mt), which is why the answer keys were read in full before editing rather than regex-replaced. `LearnAgent.js` also still carried `0.292 kg/kWh`, a grid factor that stopped existing in Phase 392.

Two of those quizzes now teach the inventory-vs-marginal distinction outright instead of hiding it: a retrofit's saving is ~43 mt against the location-based inventory rate (what KUA reports) but only ~23 mt against the AVERT marginal rate (what the atmosphere sees). In the stack-rank question the choice of factor **reorders the answer**, and the distractor that is correct under a marginal factor says so rather than being marked simply wrong.

Unrelated defect found in the same file: the four-boiler cumulative question said four dorms, walked five in its explanation, derived 1,520, then contradicted its own option text (1,160) in a parenthetical. Rebuilt on the question's own premise — 34 dorm-years, ~1,460 mtCO₂e.

`teachingCharts.test.js` mocks the composer hook rather than Supabase, so the empty, partial and missing-field states are exercised directly — including a regression guard for `sinkMt` vs `sinksMt`, where the wrong name renders nothing at all instead of throwing.

### The campus map defaults to the real map (Phase 402)

`/campus-map` opened in **Schematic** mode — flat teal boxes grouped by category — when the page has had a **Photo** mode since Phase 249 that overlays energy dots on KUA's official hand-illustrated campus map. The user's words: *"the map is so ugly just keep the original map."* Photo is now the default; Schematic stays one click away as the magnitude-comparison view.

**Why Schematic reads badly at current data:** the intensity legend advertises five colour bands (<4 / 4–8 / 8–16 / 16–30 / >30 kg per sqft), but every building on campus falls in the first band — Barrette tops out at 3.62. So every box renders identical teal and the colour encoding, which is the whole point of the view, conveys nothing. That's the *data*, not a bug, so it wasn't "fixed" by faking colour.

**The heading and hint were hardcoded for schematic.** With photo as the default the page read "Campus zones — Schematic layout grouped by category, **not geographically accurate** (we don't yet have building coordinates)" directly above a geographically accurate illustration of the campus, and called the dots "boxes". `LAYOUT_COPY` now keys title and hint off `layoutMode` for all four modes.

**The campus total was still 417.69 mtCO₂e** — 10 kg resolution on a sum of nineteen four-month extrapolations. Phase 400 fixed this one level down and left the headline; it now takes the same coverage-based rounding (418).

Also trimmed: the subtitle had grown to four dense lines of methodology across Phases 390/391/400. The caveat that matters ("estimated for a full year from the months actually metered") stays; the rest was accumulation.

### Scope 1 factor audit (Phase 401)

The session had spent itself on Scope 2 — **390 mt, and the only measured scope** — while Scope 1 (~1,350 mt) and Scope 3 (~2,635 mt) carry ±40% bands and lines ending "not yet integrated". This is the start of correcting that imbalance. Every factor checked against the **EPA GHG Emission Factors Hub 2025** (extracted locally from EPA's own xlsx) and **IPCC AR6**, not from memory.

**Four wrong values, all under confident citations:**
- `FUEL_FACTORS_KG_PER_GAL['Heating Oil']` was **10.16**, matching no EPA row — No. 1 oil is 10.18, No. 2 is 10.21. KUA burns No. 2 (the 138,500 BTU/gal constant confirms it). Now 10.21. **Live**: moves the heating line 1,236.4 → 1,242.0 mt, ~0.5% inside a stated 891–1,867 band, so a citation fix rather than a materiality one.
- `FLEET_FACTORS_KG_PER_GAL.Gasoline` was **8.89**, also matching no EPA row; Motor Gasoline is **8.78**, already what two other files used. **Live** — KUA's fleet is three petrol vehicles.
- Stationary `'Diesel'` was **10.18**, which is the No. 1 *oil* row, not diesel. Corrected to 10.21 but **not reached** — only 'Heating Oil' and 'Propane' ever enter `composeScope1FromBills`.
- `REFRIGERANT_GWP100['R-1234yf']` was **4** — the AR4-era / EU F-Gas figure — inside a map labelled "IPCC AR6". AR6 gives **0.501**. The other six GWPs verified correct. A ~10-day atmospheric lifetime cannot yield a GWP-100 of 4, which is the physical check that settles it.

**Propane 5.72 is right** — my 5.68 suspicion was wrong. EPA lists "Propane" (5.72) and "LPG" (5.68) as *different rows*, and the code picked correctly; only the label said LPG.

**These are CO₂, not CO₂e.** The Hub keeps CH₄/N₂O in separate columns, and mobile CH₄/N₂O is keyed by vehicle type *and model year*, which this codebase doesn't collect. The old `FLEET_FACTORS` comment claimed the values included N₂O and CH₄; they don't.

**Stationary and mobile stay separate maps** even where values now coincide — EPA publishes them separately and they can diverge. Merging them would repeat the unit-vs-question error.

Tests derive from the exported maps; **one** test pins the literals, so a future EPA edition changes that test and nothing else.

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
