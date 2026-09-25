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

### The test harnesses ran v6 routing against a v7 app (Phase 422)

Triaging the warnings Phase 421 left behind found 20 of the remaining 28 were React Router future-flag notices — and the verdict inverted once I checked where they came from.

**The app is not behind on this.** `index.js` already mounts `<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>`, and `App.test.js` matched it. Every *other* test rendered a bare `<MemoryRouter>`, so 16 call sites across 9 files exercised **v6 routing semantics against an app running v7**.

That is more than noise. There are two splat routes (`index.js:318` and `:366`), and `v7_relativeSplatPath` governs exactly how those resolve — a relative-splat regression could have passed in CI and broken in production.

Aligned through one shared constant in `__tests__/routerFuture.js` rather than pasting the literal into 16 places: the flags already live in `index.js`, and a value copied sixteen times is the drift this codebase keeps having to clean up. All 17 router mounts now carry them.

The remaining 8 warnings are jsdom stubs for `window.scrollTo` and `navigation` — real browser APIs the app correctly calls (BackToTop, route-change scroll restoration). Left alone deliberately: suppressing them would risk masking a genuine navigation error later.

One self-inflicted note worth recording, because it is now a pattern rather than an accident: my residual gate flagged the new helper's own comment, which quotes `<MemoryRouter>` in order to explain the fix. That is the **fourth** false positive of this kind today, and the first since Phase 420 wrote the lesson about exactly it. Documentation of a fix keeps matching the pattern that finds the defect, and each new gate needs that carve-out from the start rather than after it fires.

### The charts had two real defects the whole time (Phase 421)

Two React warnings printed in every suite run all session and I read past them for twenty phases. Both were real.

**NaN into the SVG geometry — in a chart I wrote.** `GridVintageChart` builds a truncated axis (`lo = min × 0.94`, `hi = max × 1.02`) and divides by `hi - lo`. Below roughly 100 kWh every vintage rounds to 0.0 mtCO₂e, so `lo` and `hi` are both 0, the division is `0/0`, and `y` and `height` become NaN — the labels draw and **the bars do not render at all**.

**And the test written to catch exactly that passed anyway.** `never prints NaN when the electricity total is small` asserted on `container.textContent`, which reads "0" and is clean, while the *attributes* were NaN. Checking the wrong surface is not a guard. It now walks every attribute of every element, and two further tests pin the empty-domain behaviour and assert finite geometry at a realistic total.

The chart now declines to draw when there is no spread, rather than showing a flat row of bars that implies a comparison it cannot make. Worth noting the class check came back reassuring: `TimeSeriesChart` already floors its domain at `min + 1`, and `Sparkline` carries an explicit equal-values branch with a comment describing this same hazard. `GridVintageChart` was the only unguarded span in the repo — an isolated bug, not a systemic one, and the two safe components supplied the idiom.

**`fontVariantNumeric` on SVG `<text>`, five sites.** React does not map the camelCase prop to `font-variant-numeric` on SVG elements, so it leaked to the DOM as an unrecognised attribute *and* the tabular-nums alignment never applied — the warning and the missing styling were the same bug. Moved to `style={{ fontVariantNumeric }}`, the form the repo already uses in its style objects.

The lesson worth keeping: a warning that appears on every run stops being information. These sat in the output of every single suite run for twenty phases while I chased figures through prose.

### My own audit comment had a stale derived figure (Phase 420)

Recomputing the three open decisions from the constants — rather than from memory — caught an arithmetic error in my own work. The Phase 404 audit comment said repricing purchased goods to 0.222 would cut the line "from ~1,315 mt to **~666 mt** and drop GROSS emissions **~15%**". Computed properly: 1,315 × (0.222/0.40) = **730 mt**, gross 4,375 → **3,790**, a **13.4%** reduction.

The 666 came from applying the ratio to a rounded line value instead of the real 1,315. It was wrong in `scopeTotals.js`, in the CLAUDE.md Phase 404 section, in that commit message, in task #12, and in every verbal summary since — which is exactly the propagation pattern Phases 415–417 chased through prompts, quiz answers and worked examples. A derived figure of mine went stale the same way, and the sweep that caught it was pointed at my own text for once.

The consequence was never stated either, so it is now: net would move 1,725 → **1,140**, per-student 5.07 → **3.35**.

Direction and argument are unchanged — 0.40 still sits near the 80th percentile of EPA v1.3 for a basket dominated by electronics and apparel, and the decision still belongs to KUA because the spend mix has never been measured. Only the magnitude was overstated, by about 65 mt.

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

**Left deliberately unchanged, and why.** `PURCHASED_GOODS_DEFAULT_EEIO_KG_PER_USD` is 0.40, but the four sectors it claims to average measure 0.222 unweighted against v1.3 (paper 0.537, electronics 0.096, cleaning 0.315, apparel 0.120; dataset median 0.173). Repricing would cut the purchased-goods line from 1,315 mt to **730 mt**, taking gross from 4,375 to **3,790** — a **13.4%** reduction (net 1,725 → 1,140, per-student 5.07 → 3.35). A headline movement resting on a spend mix nobody has measured, since the $3M is itself a placeholder. *(Figures corrected in Phase 420; this paragraph originally said ~666 mt and ~15%.)* The gap is published in a comment rather than quietly closed; the decision belongs to KUA. WARM values were **not** relabelled to v16 (released Dec 2023, superseding v15/v15.1) because the v16 tables weren't checked against them — a fresh version number over unrefreshed numbers is the exact failure the Scope 1 audit caught; only the internal v15-vs-v15.1 inconsistency was fixed.

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

## Build-size warning: checked, no action needed

Vite prints *"Some chunks are larger than 600 kB after minification"* on every build. Investigated in full so nobody re-opens it: **the initial payload is fine and the warning is about lazy chunks.**

`dist/index.html` loads exactly three JS files up front — `index` (~236K), `react-vendor` (~164K), `supabase-vendor` (~196K), so roughly 600K raw / ~180K gzipped for first paint. Every large chunk is already code-split behind `lazy(() => import(...))`:

| chunk | raw | when it loads |
|---|---|---|
| `apes-*` | 736K | only on that AP unit's route |
| `apush-*` | 512K | only on that AP unit's route |
| `pdf-*` | 508K | only when a PDF export is invoked |
| `apbio-*` | 488K | only on that AP unit's route |
| `pptxgen-*` | 368K | only when a deck export is invoked |

A classroom Chromebook opening the dashboard never fetches any of these. When a student does open an AP unit, ~274 kB gzipped for a full course of teaching content is a reasonable trade — and the audience constraint (classroom Chromebooks) is about the *initial* load, which is already small.

Splitting further would add real complexity and regression risk to improve a number that is not costing the audience anything. Left alone deliberately; the warning is Vite reporting per-chunk size, not a performance defect.

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

## Phase 423 — three-critic review: Scope 1 and 3 held to the Scope 2 standard

Ran the data/UI/code critics over Scope 1 and Scope 3 with Scope 2 as the
benchmark. Findings were re-verified against the code before any edit.

- **Scope 1 had no chart.** `<DegreeDayChart />` was mounted with no `year`
  prop, so `monthlyComparison(undefined)` returned `[]` and the component
  returned `null`. It rendered nothing from Phase 403 to 423 while I reported
  it as shipped. Every test passed because they all pass `year` explicitly.
  Fixed at the call site *and* given a default derived from `HDD_ACTUAL`'s
  keys, so a missing prop can never silently blank it again.
- **Scope 3 named the wrong dominant source** — "Travel, ~70% of S3" against
  its own data layer's goods 1,315 mt (49.9%) vs travel 760 mt (28.8%).
- **Recycling was still taught as a credit** (WARM v15 −0.10/+0.04). Phase 407
  removed this from the data layer; the public page kept it because the sweep
  grepped the kg spelling and the page used mt per short ton.
- **Worked examples contradicted their own inputs**: compost listed 580/110
  and computed with 520/40, stating a savings neither pair yields.
- **Derived figures hand-typed at a rounded factor** (18,252 vs 18,287) are
  now computed template literals, the same way Scope 2 avoids drift.

Residual-gate note: the gate blocked this commit twice and was right to. Its
two hits were both quoting context (an audit comment, and `~600 mi` as a trip
distance rather than an enrollment) — but chasing them surfaced a real
residual the gate had *missed*: my own edit changed the short-haul factor in
the input row and left the worked example multiplying by the old `0.395`.
Patterns must cover every spelling of a factor, including the per-mile form.

### Phase 423 addendum — one vocabulary, four copies

Chasing a single bad dropdown option exposed that waste data has **four**
ingestion paths, each carrying its own private copy of the accepted
vocabulary, three of them disagreeing with `wasteTons()` — the one function
that consumes it:

| path | unit list | waste types |
|---|---|---|
| `Cat5Waste.js` form | tons, lbs, **cubic yards** | canonical five |
| `CsvImportPanel.js` | tons, lbs, **cubic yards** | canonical five |
| `api/admin/ai-ingestion.js` | tons, lbs, **cy** | **Compost, C&D**, no E-Waste |
| `wasteTons()` (the consumer) | tons, lbs, **kg** | — |

A row entered in cubic yards passed validation, was written to Supabase, then
hit `factor === undefined || !tons` at `scopeTotals.js:594` and landed in
`wasteSkipped`. Not corrupted, not NaN — just excluded, after the admin was
told it was accepted. The AI ingestion prompt was the worst of the four: it
instructed the model to emit `'Compost'` and `'C&D'`, values the CSV path
already rejects and no factor exists for.

The residual gate never looked at `api/` until now, so no sweep this run had
ever read that prompt. It covers `src/` and `api/` from here.

## Phase 424 — the AI prompt layer was never swept, and it quoted the errors

Phase 423 fixed the superseded DEFRA framing in eight places and missed nine
more that spell it `RF`. It also never looked at `api/` at all: that directory
had no residual gate until 423 and had never had a figure audit.

- **The abbreviation hid the same defect.** `scopeTotals.js:629` ended a live
  method string `× DEFRA long-haul × RF`; `geographicEstimates.js` carried it
  six more times, including inside a `citations` array rendered at
  `AdminMethodology.js:116`. One line (`:829`) carried it **twice** — in the
  citations array and again in the `basis` template. I fixed the array; the
  gate caught the second on the same line.
- **Left alone deliberately:** `coach with RF n/a` meant RF is *not applicable*
  to a surface mode — correct, now phrased plainly. The nine IPCC AR6
  radiative-forcing passages in the APES units are real physics; the gate
  carries negative controls proving it never flags them, never flags
  `RFC-4180`, and never flags `4.3 mt/RT` by substring.
- **The estimate prompt quoted the discredited teaching set as its source.**
  `estimate-action.js:60` told the model "beef 60 kg/kg vs chicken 6 kg/kg" —
  the exact set `emissionFactors.js:70` names as the old circulated figures
  that understated meat by 40–170%. Canonical is 99.5 / 9.9. The 200–250 mt/yr
  band followed from it; the delta moves 54 → 89.6 kg/kg (×1.659), matching the
  ×1.658 rescale `dining.js:139` already recorded. Now 330–415.
- **Two prompts disagreed with each other.** Against `reductionActions.js`, the
  canonical ledger: six of eight benchmarks agree; a 20% beef cut is
  canonically 56 mt/yr and *neither* prompt's band contained it (40–50, 50–60).

## Phase 425 — one international round trip, five different numbers

`Scope3.js`'s headline action block held **five** mutually inconsistent
per-round-trip figures in eighteen lines — `~2.9`, `3.0`, `2.93`, `2.5`, `3.5`
— all derived from a 7,500 km distance assumption private to that page.

The module that exists to answer this question publishes four methods:

| method | total | implied mt/RT |
|---|---|---|
| ICAO + DEFRA weighted by source country | 320 | 4.00 |
| Explicit source-country split | 290 | 3.63 |
| Yale international per-student benchmark | 250 | 3.13 |
| Two-RT-plus-summer scenario | 325 | 4.06 |

The published `2.93` sat **below every one of them**. The fix derives from
`SCOPE3_INTL_TRAVEL` (already exported, already imported by this page for
`SCOPE3_RANGE`): the cohort flies ~1.6 RTs/yr, so dropping one saves
central ÷ 1.6 = **185 mt**, range 156–203. That preserves the deliberate
four-method spread instead of collapsing it to a false point estimate.

The same figure had leaked into four more surfaces: `ScopeExplainer.js` (public,
rendered from `App.js:44`), the tutor's stack-rank question and its distractors,
a named-route claim ("Boston to Tokyo ≈ 3 metric tons" against a sourced 4.3),
and `personalFootprint.js`'s `MT_PER_INTL_FLIGHT = 2.5` — the student-facing
calculator, below all four methods, on a page whose premise is that students
audit its assumptions.

Derived claims moved with it: "half a typical student's footprint" → **a third**
(4.3 ÷ 12.87 gross-per-student, which also avoids resting new prose on the
contested 2,650 sink), and "600×" → **800×**.

## Phase 426 — the sinks page said the forest beat the whole campus. It does not.

`Sinks.js` told readers, in both the measured and placeholder branches: *"On the
optimistic end of the range, the forest pulls more carbon out of the air than
the entire campus emits."*

That is false under every figure this repo publishes. `SINKS_RANGE.high` is
**2,650** against `GROSS_MT` **4,375**; even the most generous reading — the
page's own top per-acre rate, 4.2 × 1,000 acres = 4,200 — still falls short.
The top of the spread offsets about **61%** of gross. The page now says that.

**The project had already litigated this exact error.** `proseFigures.test.js:31`
records that the FAQ spent seventeen phases telling readers KUA was
net-negative; `Faq.js:54` now corrects it explicitly ("It is not."), and
`CarbonMath.js:76` states "KUA is NOT net-negative". The one page devoted to
sinks still carried the claim. A guard was written, the prose was fixed in two
places, and the regression survived in the third.

Also fixed:

- **The per-acre band was wrong.** Page said 2.1–4.2; the actual per-stand rates
  in `sinks.js` run **1.9–4.2**.
- **The method count was wrong, in the direction that flatters.** `SINKS_RANGE`
  is built from **four** methods; the page and `geographicEstimates.js:744`'s
  own section header both said three, and the omitted one was EPA GHG
  Equivalencies — which the module itself calls "the only genuinely independent
  number in this set", and which is the *lowest* at 1,000.
- **`SINKS_RECONCILIATION`** now exists, mirroring `FACTOR_RECONCILIATION` in
  `gridMix.js`: adopted 2,650 / central 1,730 / range 1,000–2,650 / 4 methods /
  gap **+53.2%**. Scope 2 renders its eGRID gap on screen (`Scope2.js:85-90`);
  sinks can now do the same. This closes task #17 item 7 for sinks.
- **`CarbonMath` q8 taught the wrong uncertainty.** It set sinks at ±300 when
  the published spread is 1,000–2,650. Using the half-range (±825), σ_net moves
  361 → **849** — and the lesson improves, because the sink uncertainty now
  visibly swamps the ±200 on gross, which is the true state of the inventory.
- `Faq.js`, `CarbonCredits.js` and `TeacherPortal.js` stated 2,650 flatly; each
  now points at the spread.

**The 2,650 figure itself is untouched** — that is task #16 and the user's call.
This phase publishes the gap rather than resolving it.

*Process note:* the first staged write was rejected with NOTHING WRITTEN because
the false sentence occurs **twice** in `Sinks.js` and my anchor matched both.
All-or-nothing did its job: had the script written file-by-file, the two data
files would have been edited while `Sinks.js` — the entire point of the phase —
stayed as it was.

## Phase 427 — the homepage hero captioned a range it contradicted

`NetEstimate.js:296` rendered, directly under the headline number:

    range 418 – 5,064 · low end is net-negative

`summary.netLow` is **+418**. `LearnAgent` quotes "418–5,064" in three separate
places. The arithmetic, the component and the teaching copy all agreed; only
the caption disagreed — on the most-seen component in the app.

The comment at `:107` even *names* it: an earlier anti-correlated pairing
"contradicted the 'low end is net-negative' caption below the headline". The
pairing was fixed and the range moved to +418. **The sentence asserting the old
conclusion stayed.** Identical to Phase 426's sinks page: correct the number,
leave the claim.

The caption is now **derived** from `netLow` rather than written down, so it
follows the arithmetic — including if the sink decision (task #16) ever moves
`netLow` below zero.

### The guard could never have caught either one

`proseFigures.test.js` exists *because* the FAQ spent seventeen phases claiming
net-negative (its own header says so). It missed both regressions anyway, for
two independent reasons:

1. **`PROSE_FILES` didn't include the files.** `Sinks.js`, `NetEstimate.js` and
   `ScopeRangeChart.js` were absent. The *factor* half of the same file already
   guards `NetEstimate` and `ScopeExplainer` — the *headline* half did not.
2. **Every `CLAIMS` pattern captures a numeral.** "the forest pulls more carbon
   out of the air than the entire campus emits" and "low end is net-negative"
   contain no number at all, so no numeric-capture regex could ever see them.

Phase 427 adds an `ASSERTIONS` claim type that tests the assertion against the
arithmetic (`SINKS_HIGH > GROSS`), with three exclusions and a control for
each: `NEGATED` (a denial is the fix — "KUA is NOT net-negative"), `COMPUTED`
(a caption derived from the figure cannot go stale), and `QUOTING` (audit
comments quote the defect to explain it — the **fifth** time in this project
that documentation matched the pattern written to find the thing it documents).

Proven against the **real historical sentences**, not just fixtures: both are
caught; the denial, the audit comment and the computed ternary are all spared.
Guard 25 → 31 tests; suite 1,408 → 1,414.

## Phase 428 — the wiring guard was electricity-only, and said so nowhere

`liveDataWiring.test.js` states its rule in general terms: *"a page or component
that imports an ABSOLUTE static figure must also read a live hook."* It enforced
that for **one scope**. `ABSOLUTE` listed the six Scope 2 constants and nothing
else; `LIVE_HOOKS` omitted `useMeasuredScope1`, `useMeasuredScope3` and
`useMeasuredSinks` — all three of which already existed and were already
consumed by `Scope1.js`, `Scope3.js`, `Sinks.js`, `Sinks2.js` and the admin
surfaces. So a page could render a stale Scope 1, Scope 3, gross or **sink**
figure indefinitely and the guard would pass.

Its own comment at `RATE_ONLY` says an exemption that has stopped being true is
*"a quiet lie inside the guard against quiet lies."* A constant the guard was
never taught to watch is the same lie by omission.

Extending it to all four scopes exposed **exactly one offender out of 23
surfaces**: `CarbonCredits.js`, which has no hook at all and prices the forest's
drawdown in dollars — `$8 / $25 / $40` per ton, plus a revenue band and the page
subtitle. If an admin enters real `forest_stand_actuals` rows, every other page
moves and the revenue maths keeps quoting last release's number.

Two of its four uses sat at **module scope**, inside the `categories` array, where
a hook cannot reach them. Wiring only the in-component uses would have left the
page showing two live figures and two stale ones — worse than leaving it wholly
static. `categories` is now `categoriesFor(seq)`, with one call site.

First paint is unchanged by construction: `useMeasuredSinks`'s initial state is
already `Math.round(ANNUAL_SEQUESTRATION_MT)`, so the page renders 2,650 and
$21K/$66K/$106K exactly as before until real rows exist.

**Not taken: the `PROSE` exemption.** `CarbonCredits.js` is already in
`proseFigures.test.js`'s roster, so exempting it would have passed every test —
while leaving a money figure quoting a stale sink. That is satisfying the guard
instead of fixing the defect.

Guard 3 → 5 tests, including a control that writes a synthetic hookless file and
asserts it **is** reported, so the rule cannot quietly match nothing. Dry run
predicted 22 pass / 1 fail before the fix; reality after it is 23 / 0.

With Phase 427 (`proseFigures`) this closes task #17 item 2.

## Phase 429 — nothing bounded the inventory to a reporting period

The three-critic review's highest-risk finding, and it was worse than first
diagnosed. No composer filtered rows by date — and **neither hook even fetched
a date column**. `useMeasuredScope1` selected `fuel_type, gallons`;
`useMeasuredScope3` omitted `waste.date`, `faculty_travel.departure_date`,
`purchased_goods.fiscal_year` and `school_year` for two of the three cohorts.
`day_students.school_year` was selected and never read.

So two heating seasons of `fuel_bills`, or one student enrolled across two
years, would double the figure and label it **measured**. Scope 2 cannot do
this: `composedYtd.js` keys by month against `COMPOSED_YTD_AS_OF` and
`annualizeFactorForWindow()` returns **null, not 1**, for a window that doesn't
overlap.

**`REPORTING_PERIOD`** now lives in `academicCalendar.js` — a *boundary*, kept
deliberately separate from that module's durations, for the same reason it
keeps two day-counts instead of one. It carries both representations because
the tables disagree about how to say "when": eight store a date, five store a
year label. The school year is the default because it is what all five admin
forms actually write (`'2025-2026'`).

**`PERIOD_RECONCILIATION` publishes a mismatch rather than hiding it.** Scope 2
composes calendar 2026 (to `2026-09-14`, 257 days); Scope 1 and 3 are entered
against the school year. The inventory therefore spans two different
twelve-month windows — a GHG Protocol consistency problem. Restating either
moves published figures, so it is a decision, not a fix, and `aligned: false`
is asserted by a test so it cannot drift into a silent claim of alignment.

**Undated counts IN.** Every composer test passes dateless rows, and so does
every Supabase row entered before these columns were selected. Excluding them
would break ~20 tests *and* silently zero real data, so they are counted and
reported — the `wasteSkipped` pattern that was already sitting in the code
being edited. A malformed date reads `undated`, never `out`: a typo must not
delete a row.

Partitioning happens **once**, at the two top-level composers, so
`composeFleetMt` / `composeRefrigerantMt` / `composePurchasedGoodsMt` /
`composeCommutingMt` are untouched and the counting lives in one place.

*Caught in my own edit before shipping:* `composeScope3FromRecords` computed
`outOfPeriodRows` and never returned it — a dead variable and a silent
exclusion, which is the exact failure this phase exists to prevent. Scope 1
reported it; Scope 3 dropped it. Both report it now.

This is a **no-op on today's published numbers** — both totals are placeholders
(`provenance: 'estimated'`), so nothing moves. The value is entirely in what it
prevents once real rows land. Suite 1,416 → 1,424.

Closes task #17 item 1.

## Phase 430 — the AI chart caption described last release's numbers

`TeacherPortal.js` renders a scope-breakdown chart for a class and puts an
"Explain this chart with AI" button under it. The bars were live
(`buildScopeBars(live)` → `live?.scope1Mt ?? SCOPE1_TOTAL_MT`). The object
handed to that button was not: `chartData.series` passed raw
`SCOPE1_TOTAL_MT` / `SCOPE2_TOTAL_MT` / `SCOPE3_TOTAL_MT` while mixing in
`sink`, `gross` and `net` from the live path in the same array.

So once admin rows land, a teacher projects live bars while the AI caption —
generated from `/api/explain-chart` — describes last release's Scope 1/2/3
against this release's gross and net. Contradictory *inside one object*, and
invisible to `liveDataWiring` because that check is file-level (`text.includes`)
and this file plainly does use a hook. Exactly the hole task #17 item 2 records.

The forest bar and `sink` also read raw `ANNUAL_SEQUESTRATION_MT` though
`useMeasuredScopeTotals` exposes `sinkMt` — the same gap Phase 428 fixed on
`CarbonCredits`. Both now read the hook.

**Checked and NOT changed: `AISummary.js`.** Task #17 predicted the same defect
there. It is correct: `:120-125` falls back per-field off the hook
(`live.scope1Mt || PRELIM.scope1`), and `PRELIM` is never rendered except as
that fallback. A predicted defect is still a hypothesis.

### Correction to Phase 429's record

That phase's commit says `PERIOD_RECONCILIATION` "publishes" the Scope 2 period
mismatch. **It does not.** Nothing outside the test imports it, so it reaches no
page and is tree-shaken out of the bundle entirely — the exact complaint in
task #17 item 7 ("lives in comments only, so no page can render it"), restated
with an `export` keyword in front of it. Filed as #19; the claim is withdrawn
here rather than left standing.

## Phase 431 — no scope page said what twelve months it covered

Verified before writing anything: `Scope1.js`, `Scope2.js`, `Scope3.js` and
`Sinks.js` each returned **zero** matches for "reporting period | period
covered | school year | 2025-2026 | as of". The dashboard published totals
without telling a reader which year they describe — a GHG Protocol reporting
requirement, and the reason the Scope 2 / Scope 1-3 period mismatch was
invisible.

`ScopePageInfo` gains an optional `estimate.period` line; Scope 1, Scope 3 and
Sinks pass `REPORTING_PERIOD.label`. (`thirdMetric` was already occupied on all
three — "Dominant source", "Forested area" — hence a new field rather than
reusing it. Optional, so any page passing nothing renders exactly as before.)

Scope 2 states its own window **and** the mismatch, in the labelled-row block
that already carries `FACTOR_RECONCILIATION`'s gap. **Once, and only there** —
that is where the two windows collide, and repeating it on four pages would be
four copies of one fact, the defect this session has spent most of its phases
deleting.

### The fix Phase 429 claimed and did not make

`PERIOD_RECONCILIATION` was exported and imported by nothing, so Rollup
tree-shook it out and it published nothing. Phase 430 withdrew the claim; this
makes it true. Confirmed against the build: `calendar 2026, YTD to
2026-09-14`, `2025-2026 school year` and `two different twelve-month windows`
now appear in **1 chunk each** — they appeared in **0** before.

**The test asserts REACHABILITY, not contents.** `expect(PERIOD_RECONCILIATION
.aligned).toBe(false)` passed the entire time the object shipped nowhere. The
claim being made is that a reader can see it, so the test walks page source and
requires that some page *imports* it — the same shape `liveDataWiring` already
uses for its `PROSE` cross-check. It covers `SINKS_RECONCILIATION` and
`FACTOR_RECONCILIATION` too, so the next reconciliation object cannot repeat it.

A second test requires all four scope pages to state a period, so the gap
cannot silently reopen. Suite 1,424 → 1,426.

*Worth keeping:* Rollup does **property-level** tree-shaking on object literals
whose members are statically accessed. `SINKS_RECONCILIATION.note` is read by
nothing and never ships, while its `.methodCount` / `.gapPct` / `.centralMt` do.
A `note:` field nothing renders is a comment wearing a property name.

## Phase 432 — a failed fetch and an empty table looked identical

`Scope1.js:37`, `Scope3.js:57`, `Sinks.js:54`, `Sinks2.js:29` and
`CarbonCredits.js:109` all read `live.error` for exactly one purpose:

```js
const isMeasured = live.measured && !live.loading && !live.error;
```

So when Supabase failed, the page fell back to the bottom-up placeholder and
said **nothing** — visually identical to "no data has been entered yet". Those
are different facts about the world, and the reader could not tell them apart.

`ScopePageInfo` gains an optional `estimate.dataIssue` line (amber, `role="status"`,
beside the Phase 431 period line). Scope 1, Scope 3 and Sinks pass it when
`live.error` is set. Wording follows the existing in-repo precedent at
`Teacher.js:386` — *"Live rollup unavailable (…). Sample data shown below."* —
rather than a newly invented phrasing.

### Task #17 item 4's premise was wrong, and I checked before repeating it

That item says Scope 1/3 fall short of Scope 2, which "surfaces stuck meters and
excluded feeds". **`useMeasuredScope2().error` is read by none of its thirteen
consumers**, and no Scope 2 surface carries degraded-state copy. Scope 2 has the
same gap. The honest statement is that *no* live surface in the app reported a
fetch failure — not that two scopes lagged a third.

### The test renders the notice, it does not merely compute it

It drives the real error path (`setNextResponses({ fuel_bills: { data: null,
error: { message: 'rls denied' } } })`) and asserts the text **appears in the
DOM**. A source-level guard would pass against a page that builds the string and
never displays it — which is precisely how `PERIOD_RECONCILIATION` shipped
nowhere for two phases while its assertion stayed green.

A fourth test is the negative control: with merely-empty tables the page must say
**nothing**, because warning about a non-failure would be its own kind of lie.

Suite 1,426 → 1,430; 96 → 97 files. `Sinks2.js`, `CarbonCredits.js` and the
thirteen Scope 2 consumers still swallow the error — filed, not forgotten.

## Phase 433 — the composers built a breakdown no page ever showed

`composeScope1FromBills` has always returned three rows — heating 1,290, fleet
54, refrigerants 7 — and `composeScope3FromRecords` six: goods 1,315, travel
760, dining 235, upstream 230, commuting 90, waste 5. Each carries its own
`mt`, `provenance` and `method`. **`Scope1.js` read `breakdown` zero times**,
and `Scope3.js` rendered only its cohort table. A reader could see a scope
total and never its parts — including that purchased goods is roughly half of
Scope 3 and the largest single line in the whole inventory.

New shared `ScopeBreakdownPanel` renders it on both pages: component, mtCO₂e,
share, per-row provenance pill, and the `method` string beneath each label.

**Ungated, and that distinction was checked rather than assumed.** Scope 3's
cohort panel is gated behind `isMeasured` and that is *correct* —
`composeScope3()` returns `cohortDetail: undefined` on the placeholder path, so
rendering it ungated would print an empty shell. `breakdown` is present on
**both** paths (verified at runtime), and per-row provenance is precisely what
makes it worth showing before any live rows exist: the difference between "we
measured 1,290" and "we estimated 1,290".

Shares are computed from the rows, not the page headline, so the column sums to
100% and cannot drift from the figures beside it. A test asserts `50%` for
goods, cross-checking the share column against the mt column.

### My own test was the thing that broke

The first run failed twice with *"Found multiple elements"* — `/Fleet vehicles/i`
also matching Scope 1's `'Fleet Vehicles'` category card, and `/Purchased goods/i`
matching Scope 3's `thirdMetric` **plus a subtitle I had just written that
restated a component name listed directly below it**.

The fix was a real `role="region"` + `aria-label` handle on the panel and
`within(panel)` queries — **not** `getAllByText`, which would have stayed green
while the panel rendered nothing and only the category card matched. That is
the "test passes against the defect it guards" failure, and it is the third time
this session it has been the tempting shortcut. The landmark is also a genuine
accessibility improvement: sibling components already carry `aria-label`
(`DegreeDayChart:60`, `CampusMonthlyTrend:50`).

Suite 1,430 → 1,434; 97 → 98 files. Closes task #17 item 3.

## Phase 435 — two factor tables, one EPA table, no link between them

`emissionFactors.js` holds 35 rows with `unit` and `year`. `scopeTotals.js`
holds the bare scalars the composers consume. **They agree** — all nine
overlapping pairs within 1% — but nothing asserted it, and the units differ.

I misread that as a contradiction. Waste reads `0.639 kg/kg` in one table and
`0.58 mt/short-ton` in the other, and I wrote down that there was "a genuine
disagreement feeding a published total". There isn't: a short ton is 907.185 kg,
so `0.639 × 0.907185 = 0.5797 = 0.58`. **`emissionFactors.js:96` already
documents the conversion** — "converted from metric tons CO2e/short ton to
kg/kg (× 1.10231)" — four lines above the values I was reading. I read the
numbers before the comment that explained them.

That misreading is the argument for the fix. The same EPA Table 9 figures live
in **three files in two unit systems** — `scopeTotals.js` per short ton,
`emissionFactors.js` per kg, and `geographicEstimates.js:599/607/615` as bare
inline literals with no comment and no link to either. Update one and the others
go quiet.

`factorTableConsistency.test.js` now pins all nine pairs (4 fuels, 2
refrigerants, 3 waste streams) with the conversion stated per pair, a negative
control proving a 20% divergence is caught, and an assertion that every
`emissionFactors` row carries a vintage the composer scalars lack — which is
task #17 item 6 in one line. Both data files now name the conversion where the
literals sit.

**Food is excluded and filed as #21**, because it is the one family that does
*not* reconcile: `dining.js` says beef `9.95` per serving while `99.5 kg/kg ×
150 g = 14.93`, and the ratios differ per protein, so there is no single implied
portion size. `dining.js:16-18` records that the original portions were never
written down. Picking one now to force agreement would manufacture precision,
and re-deriving would move a ~235 mt line — a user decision, not a silent fix.

No factor changes. Suite 1,450 → 1,461; 99 → 100 files.

## Phase 436 — the ingestion prompt described tables that do not exist

`api/admin/ai-ingestion.js` tells the model the column shape of every Supabase
table it may write to. Nothing checked that against the tables, and it had
drifted:

- **`purchased_goods` was wholly broken.** The prompt claimed
  `invoice_date? / vendor? / category?` — **none of which are columns** — and
  never mentioned `fiscal_year` or `purchasing_category`, both `NOT NULL`. Every
  AI-extracted purchased-goods row failed to insert.
- **`scope1_refrigerants`** said `system_id?`; the column is `equipment_id`.
- **`waste` and `study_abroad`** omitted `school_year`, which the admin forms
  write and which Phase 429's reporting-period boundary reads.
- **Nine tables on the allow-list had no shape at all** — `fuel_bills`,
  `day_students`, `us_boarding_students`, `international_students`, `commuting`,
  `renewables_geothermal`, `renewables_wind`, `forest_stand_actuals` — while
  Rule 10 tells the model "NEVER write to a table not in the list above". An
  allow-list entry with no shape is an invitation to guess.

It matters because `AdminAIIngestion.js:498-523` auto-writes every
high-confidence row straight to Supabase. A schema rejection appears as one red
chip among many in a bulk drop, not as a failure anyone is likely to notice.

`ingestionPromptSchema.test.js` now parses the prompt and the migrations and
compares them — every claimed field must be a real column, and every `NOT NULL`
column without a default must appear in the prompt. 20 tests.

*Process, fourth time today:* my first write broke the file. I put literal
backticks in an explanatory sentence **inside the `SYSTEM_PROMPT` template
literal**, which closed it at line 80 and reopened it at the second backtick, so
esbuild reported the error at line **116** — the real closing `` `; `` — and the
backtick count stayed **even**, which is why a balance check saw nothing.
`apiRoutes.test.js` then failed to transform merely for importing the file, and
the suite read 1,372 with a whole file missing rather than a test regressing.
Recorded in memory. Suite 1,461 → 1,481; 100 → 101 files.

## Phase 437: three different things were sharing the `year` column

Scope 2 has been able to say how stale its grid factor is since Phase 392 —
"eGRID2023, 3 years older than the 2026 electricity it prices". Scope 1 and
Scope 3 could not, though both price 2026 activity with 2024 factor editions.
This closes item 6 of the three-critic list.

The reason it was not a five-line change: **a naive version announces that
Scope 3 runs on eight-year-old factors**, because its food rows say 2018. Three
unrelated things share that column.

- **`annual-edition`** — EPA Hub, eGRID, DEFRA. A newer edition exists or will,
  so the gap is real staleness and worth reporting.
- **`dataset-version`** — EPA Supply Chain v1.3, where 2022 is the *USD basis
  year*. The version is current; there is no edition to fall behind.
- **`publication`** — Poore & Nemecek 2018, IPCC AR6. Still the best available
  source; the year is provenance, not decay.

So `factorVintageFor` reports only the **annual-edition** gap as staleness and
lists study years separately, as provenance. Scope 1 and Scope 3 both now read
"Oldest annual factor edition is 2024 — 2 years older than the 2026 activity it
prices", not "8 years old". The kind is classified from the source string rather
than hand-tagged across 35 rows, so it cannot drift away from the citation it
is derived from, and an unclassified row fails a test rather than being dropped
from the summary in silence.

**Building it surfaced a fourth meaning and a published error.** The two
refrigerant rows read `year: 2024` while citing IPCC AR6 — published **2021**.
That is "verified current as of", a fourth sense of the column, and left alone
the Scope 1 page would have rendered "2 factors come from published studies
(2024)" and stated a false publication year for AR6. Corrected to 2021, with
the citation made specific (WG1 Ch.7; the R-410A blend and the AR5-vs-AR6 1300
/ 1530 trap are now written down). **The GWP values are untouched — 2,256 and
1,530 — so no emissions figure moves.** Nothing pinned the year: the only
assertion on it was `toBeGreaterThan(2000)`.

`factorVintage.test.js` asserts the **classification**, not merely that a year
exists — `factorTableConsistency.test.js` already proved presence and would
have passed whatever the years meant. It includes the controls that matter: that
Scope 3 is *not* reported as 8 years stale, that a `dataset-version` factor is
not counted as an aging edition, and that AR6 is dated by publication.

*Process:* the residual gate failed on its first run, and the code was right —
my pattern matched `citations: ['IPCC AR6 GWP100']`, a display citation, as
though it were an equality comparison. Confirmed first that nothing in the tree
compares a factor's `.source` to anything (every `.source ===` is meter/ledger
provenance), then narrowed the pattern instead of editing correct code to
satisfy a bad rule. Suite 1,481 → 1,496; 101 → 102 files.

## Phase 438: a skipped waste row now says which field stopped it

The Scope 3 waste row told a reader `(N skipped — unknown waste_type or invalid
amount)`. For the row that prompted this, both named causes were false. A
cubic-yard Landfill entry has a valid stream and a valid number; what it lacks
is a unit the table can convert. The one true cause went unnamed.

The file already knew. The doc block at `scopeTotals.js:514` claimed the message
"reports rows whose **unit** or waste_type cannot be priced" — describing
behaviour the rendered sentence never delivered.

`wasteTons()` returned `0` for three unrelated outcomes: an unpriceable unit, an
unusable amount, and **a legitimate zero**. The caller tested `!tons`, so it
could not tell them apart — and since `!0` is true, a hauler invoice recording a
genuine zero-ton month was counted as a failure. It is now `wasteRowStatus()`,
returning `{ok, reason}`, with each cause counted and named separately:

- `(1 skipped — unpriceable unit; only tons/lbs/kg convert)`
- `(3 skipped — 1 unpriceable unit, 1 unrecognized waste_type, 1 invalid amount; ...)`
- a genuine zero-ton month now says **nothing at all**, because nothing failed.

**Scope held where the evidence pointed.** The Scope 1 sibling at `:396` looked
like the same bug and is not: it tests `!Number.isFinite(gal) || gal < 0` with no
`!gal`, so a zero-gallon bill is correctly counted, and its two named causes are
the only two that exist — fuel has no unit dimension. It is the correct model;
`!tons` was the outlier. Left alone rather than "fixed".

Cubic yards still price at zero — converting them needs a density varying
~0.15-0.25 short tons/yd3 by material, and inventing one would be worse than
refusing the unit. `CsvImportPanel` and the `Cat5Waste` form already stopped
accepting it; neither helps a row already in Supabase. What changed is that the
page now names the unit instead of blaming the stream.

*Process, and the honest version of it:* the test was written first and **run
against unfixed code to watch it fail** — 4 red, 3 green, the 3 being cases that
should pass pre-fix. Printing the rendered sentence then caught what no regex
could: `(1 skipped — 1 in a unit this table cannot price (only tons/lbs/kg
convert))` stated the count twice and nested parentheses. Rewritten before
shipping. The residual gate failed three times and **was wrong all three times**
— it matched a display citation, then its own new correct line, then a
past-tense provenance comment. Each was a rule written in the same breath as the
fix, encoding my assumptions; the code was read before any rule was relaxed.
Suite 1,496 → 1,503; 102 → 103 files.

## Phase 439: eight forms disagreed about what "this year" means

`periodStatusOf` compares a row's `school_year` to `REPORTING_PERIOD.schoolYear`
**exactly**. Eight admin forms write that field, and none of them imported it.
Five froze the literal `'2025-2026'`; three seeded from `currentSchoolYear()`,
the wall clock, which rolls over Aug 1.

On 2026-09-19 the wall clock says **2026-2027** and the dashboard publishes
**2025-2026**. Executed, not reasoned about:

```
  REPORTING_SCHOOL_YEAR -> 2025-2026   row saved today -> IN
  schoolYearOn(today)   -> 2026-2027   row saved today -> OUT
```

So every row entered through Commuting or Purchased Goods was landing outside
the published period and dropping out of the Scope 3 total, while the admin saw
a successful save. `withinPeriod` is applied to `goods` and `commute`
(`scopeTotals.js:673-674`) and the hooks do select those columns, so the path
was live, not theoretical.

Two corrections to my first reading of it, both toward *less* alarm:
`outOfPeriodRows` already reports "N rows excluded — outside 2025-2026 school
year", so it was never fully silent — what was missing is that the form's own
default caused it. And `ForestStands` is harmless: the sinks composer never
period-filters.

`academicCalendar.js:104` already claimed the forms defaulted to the reporting
period. They didn't. Now they do, via `REPORTING_SCHOOL_YEAR`, so the claim is
structural rather than a coincidence that holds until July. `schoolYearOn(date)`
keeps the wall-clock answer — it is a real question, just a different one, and
Phase 440's divergence note is what will make it visible to an admin.

**Scope held:** `AdminPlanAgent`'s `fiscalYear: '2026-2027'` is a planning
horizon, where a future year is correct. `graduation_year: '2026'` never reaches
`periodStatusOf`. Both left alone deliberately.

*Process — the test I added was hollow, and running it red-first is the only
reason I know.* Grepping the built chunks showed seven forms had dropped the
literal and `Cat1PurchasedGoods` had not: `placeholder="e.g. 2025-2026"`. I
wrote a detector for it that **passed against the unfixed file**, because it
required the year to be the whole quoted string while the real one is embedded
in `e.g. ...`. Confirmed against the pre-fix file from git history: broken
detector `NO MATCH`, corrected detector matches that exact line. The test now
carries a control asserting the detector can fail, since otherwise the sweep
proves nothing. Suite 1,503 → 1,533; 103 → 104 files.

*No positive deploy marker:* the constant resolves to the same string the forms
hardcoded, so the rendered output is byte-identical by design. The observable
change is negative — the literal is gone from all eight form chunks and now
lives only in the entry bundle. `schoolYearOn` tree-shakes out entirely, having
no shipped caller yet.

## Phase 440: the note that says why the default is what it is — and the crash I shipped in 439

**First, a bug I introduced one phase earlier.** Phase 439 wrote this into
`_shared.js`:

```js
export { REPORTING_SCHOOL_YEAR, schoolYearOn } from '../../data/academicCalendar.js';
export const currentSchoolYear = () => schoolYearOn(new Date());   // ReferenceError
```

`export { x } from 'y'` forwards x to this module's CONSUMERS but creates no
local binding, so the arrow function referenced an undeclared identifier.
Confirmed in an isolated three-file ESM reproduction: `ReferenceError:
schoolYearOn is not defined`, and the import-then-export form works.

It shipped green because **nothing called it**. The build succeeded, 1,533 tests
passed, and Phase 439's own tests could not have caught it — they assert on
SOURCE TEXT (which form references which identifier) and never invoke anything.
A test that reads code rather than running it proves only that the code says
what you think it says. `sharedAdminHelpers.test.js` now CALLS the helpers; it
failed with the real ReferenceError before the fix.

The latent crash's first caller would have been this phase's note.

**The note.** `PeriodNote` renders beside every admin period field when the
wall clock and the published period disagree:

> It is now the **2026-2027** school year, but this inventory publishes
> **2025-2026**. A row saved as 2026-2027 counts as outside the reporting
> period and will not appear in any published total.

Phase 439 stopped the forms *defaulting* to the clock year. This says out loud
why the default is what it is, at the moment an admin might override it. It
renders `null` when the two agree, so it costs nothing once the period rolls
forward. Both years are props, so the tests do not change behaviour on 1 August.

Wired into all eight forms — seven via `s.full`, ForestStands via its own
`Field` wrapper — anchored on the field+closer PAIR, because `</label>` alone
appears many times per file and a naive replace would have half-applied.

*Verified beyond the suite:* a green suite could not tell me the note actually
appears for an admin, since every PeriodNote test passes explicit props and the
render smoke tests only assert non-empty content. So I mounted the real
`StudentDay` form with LIVE defaults and read the sentence back, and confirmed
the field itself defaults to 2025-2026. `adminSubPagesRender.test.js` already
mounts all eight forms, so the wiring gained real regression cover for free —
the same file that exists because a ReferenceError once hid in an unmounted
admin page, which is exactly the bug this phase fixes.

Suite 1,533 → 1,542; 104 → 106 files.

## Phase 441: six public pages promised a breakdown behind a password

`AdminLayout.js:347` returns a **password form** in place of its `<Outlet />`
when there is no session, and `index.js:320` mounts every `/admin/*` route
under it. Six public pages told readers to "see /admin/methodology for the full
per-component breakdown" — so a school-board reader following that link got
*"Enter the admin password to manage emissions data."*

The content was never sensitive. `BOTTOM_UP_BREAKDOWN` is nine components with
their basis arithmetic and citations; a sweep of the admin page for passwords,
table names or internal workflow came back **empty**. It was misfiled, not
private — and for a dashboard whose selling point is transparency to a school
board, that is the wrong file.

`MethodBreakdown` now renders those nine rows and is used by **both**
`/methodology` and `/admin/methodology`, so the public page cannot drift from
the admin one. The public page gained the section it was pointing elsewhere
for, including the bottom-up gross (4,086 mtCO₂e/yr = 1,357 Scope 1 + 2,729
Scope 3, before measured Scope 2 and sinks).

**The sweep found more than the task recorded — eleven pages, not six.** The
other eight references are a different defect: public pages that LINK INTO
admin areas. `Executive.js:214` wraps every action row in a
`<Link to="/admin/actions">`, so a board member clicking an action lands on a
password prompt; `Actions.js:100` and `Unsubscribe.js:71` link to
`/admin/actions` and `/admin/alerts`; `Buildings`, `Faq`, `Hotspots` and
`TrendBuilder` mention `/admin/bms-export` in prose aimed at an admin. Real, but
a different fix across eight more files — **recorded as its own task rather
than folded in**, and the test was narrowed to `/admin/methodology` to match
what this phase actually delivers. A test that asserts more than the phase
delivers is one that has to be weakened later.

*Process:* the test needed two repairs before it could be trusted. It first
failed to COLLECT — under the `jsdom` pragma `import.meta.url` is an http: URL
and `node:fs` rejects it with `ERR_INVALID_URL_SCHEME` (tests without the
pragma can use the `new URL(...)` form, which is why `adminPeriodDefaults`
works). Then, because the sweep is `it.each(publicPages)`, an empty directory
read would have registered **zero tests** and read exactly like a clean sweep —
so it now asserts the page list is non-empty and contains known files. Red
first: 13 failed / 110 passed, the 110 being AP content pages that legitimately
have no admin link.

The extraction left residue the gate was extended to catch: one unused import
and six orphaned style keys in the admin page, all removed (412 → 405 lines).
Suite 1,542 → 1,665; 106 → 107 files.

## Phase 442: the composer dropped every error on the floor

Phase 432 taught Scope 1 / Scope 3 / Sinks to say *"Live data unavailable"*
instead of silently rendering the bottom-up placeholder. The homepage could not
do the same, and the reason was one layer down.

`useMeasuredScopeTotals` composes four hooks — scope1, scope2, scope3, sinks.
Each exposes an `error`. The composer OR-ed their `loading` flags and returned
**none** of their errors. So its **seventeen** consumers, including both
homepage components, were *structurally unable* to report a failure: the
information never reached them. Fixing the consumers alone was impossible.

The visible consequence was in `ScopeExplainer.js:198` — `live.scope2Mt ||
SCOPE2_TOTAL_MT`. A Supabase failure makes the live value falsy, so the page
fell back to the build-time constant and rendered it exactly like live data. A
failed fetch and an empty table are different facts, and the homepage was
showing the first as if it were neither.

The composer now aggregates, **labelled by scope** — "live data unavailable"
without saying which source failed is barely better than silence:

> Live data unavailable (Scope 1: permission denied for table fuel_bills;
> Sinks: connection reset). Showing the published estimate instead.

`LiveDataNotice` renders it (three pages were already building that sentence
inline; this gives the wording one home) and returns `null` when there is no
error, so an empty table stays quiet — a warning for "nobody has entered data
yet" would be its own kind of lie, and that negative control is pinned.

*Process:* two corrections, both caught by running rather than reasoning. The
render tests first failed with *"Element type is invalid… got: undefined"* —
these are **named** exports, so the test was failing for the wrong reason and
proved nothing until fixed. Then my own staged-write assertion aborted the
write: I asserted `s1.error` appears once, but `` s1.error && `Scope 1:
${s1.error}` `` contains it **twice**. The code was right and the assertion was
wrong — and nothing was written, which is the staging discipline working.

Deploy markers had to be the `fallbackLabel` prop values, not the sentence:
`Showing {fallbackLabel} instead.` is JSX interpolation, so the contiguous
string never exists in the bundle. The same trap as Phase 438's
"only tons/lbs/kg convert", and the same reason markers get measured in the
local build first.

Fifteen other consumers of the composer still ignore `error` — now possible to
fix, since the data finally reaches them. Tracked in #20.
Suite 1,665 → 1,672; 107 → 108 files.

## Phase 443: the other five pages that read the composer

Phase 442 gave `useMeasuredScopeTotals` an `error` and wired the two homepage
components. Five more public pages read the same composer and still rendered
build-time constants as though they were live: Executive, Goals, Actions,
Scenarios, AnnualReport. Each now carries the notice.

**One notice per page, not per chart — a deliberate call.** Six chart
components (ScopeDonut, PeerComparison, ScopeRangeChart, NetBalanceWaterfall,
MeasuredShareChart, AISummary) also read the composer. Giving each its own
banner would show a reader four identical warnings on Executive alone. The page
owns the notice; the gate now asserts the charts render none, so the decision
can't erode later.

TeacherPortal reads the composer too but sits behind a `PasswordGate`, so it
renders nothing to assert against without auth. Left in #20 rather than faked.

*Process — the failure mode my own notes name.* The first green attempt left
five tests failing with **"Found multiple elements with the text: /Scope 1/"**,
because these pages say "Scope 1" in their prose. The tempting fix is
`getAllByText`, and it is the wrong branch: it goes green *and* passes against a
notice that names no scope at all. Scoped the assertion to the notice element's
own `textContent` instead. The first assertion had already passed, which is how
I knew the notice itself was fine and only the query was ambiguous.

Insertion points were located **programmatically** (find `return (`, then the
first `    >` that closes the opening tag) rather than by pasting two very long
JSX lines as anchors — the reconstruction risk that broke Phases 414 and 423.
Each insertion asserts the following line is the one expected before writing.

Suite 1,672 → 1,683; 108 → 109 files.

## Phase 444: the solar benchmark two AI prompts never got the correction

Three admin endpoints quote the same reduction-measure benchmark library —
`plan.js`, `plan-item-alternatives.js` (its own words: *"the same benchmark
library the plan endpoint uses"*) and `estimate-action.js`. Phases 409/410
repriced rooftop solar from the inventory average to the **AVERT marginal**
rate and updated `estimate-action.js` to **12–17 mt/yr**. The other two kept
quoting **6–8** — the old inventory-rate number, almost exactly half.

Every *other* benchmark in the library already agreed across all three:
heat-pump 600-900, LED 6-10, HVAC 9-15, setpoint 15-22, beef ~56, compost 4-6,
commute 25-35. Solar was the lone survivor, which is the exact shape of a
correction applied to one file and not its siblings — the same failure as
Phase 436's ingestion prompt, in the same directory.

It matters because these prompts drive what an admin gets *recommended*. An
AI planner reasoning from 6–8 mt would rank a rooftop array at half its real
benefit against every competing measure in the list.

**Checked before claiming.** The constant `GRID_FACTOR_KG_PER_KWH` in
`scopeTotals.js:893` holds the AVERT marginal rate (0.4896), not the inventory
average — a name that reads like the opposite of what it is. That looked like a
second defect until I read the 27-line block above it, which explains precisely
why it deliberately does not follow `KG_PER_KWH`, and found
`dataLayer.test.js:1201-1202` already pinning that it must never equal the
inventory rate. Well-guarded; left alone.

`planBenchmarkAgreement.test.js` pins **agreement across the three files**
rather than a literal, so the next reprice must move all three or fail — plus a
guard that the extraction actually found a range in each file, since an empty
extraction would make the agreement check vacuously true.

*No client-bundle fingerprint:* `api/` is serverless and never bundled, so
there is nothing to grep in production. Stated rather than papered over, same as
Phases 428, 435 and 436. Verified instead with `node --check` on all three
files — backtick *evenness* alone would not catch the Phase 436 class of
breakage, since that count stayed even.

Suite 1,683 → 1,687; 109 → 110 files.

## Phase 445: precision follows provenance (#17 item 8, the last one)

Phase 400 set the rule for extrapolated building figures — *precision follows
coverage*. The per-student family never got it, and was doing two things wrong
at once.

**False precision.** Scope 1 per student printed **3.97**, claiming 0.01 mtCO₂e
of resolution, while the same page publishes a range of 895–1,875 mt. Across
340 students that range spans **2.88** — the display was 288× finer than the
uncertainty printed one line below it. One decimal is still 28× finer than the
spread, which is as far as this can honestly go.

**Three answers to one question.** Net per student appeared as **5.07**
(Executive, AnnualReport), **5.1** (AISummary, LearnAgent) and a hardcoded
**~5.0** in a LearnAgent quiz a student is asked to reason from. Sinks was
already at one decimal, so `ScopePageInfo` rendered the same row at two
precisions depending on which scope you were looking at.

`perStudentMt(total, students, provenance)` now answers it once: measured earns
two decimals, estimated and cited earn one — a seasonally-extrapolated
projection is not a measurement. The family now reads Scope 1 **4.0**, Scope 2
**1.1**, Scope 3 **7.8**, net **5.1**, everywhere.

**The investigation changed the target.** `SCOPE1_PER_STUDENT` and
`SCOPE3_PER_STUDENT` looked like the sites to fix — they were the obvious
`toFixed(2)` calls. Grep found each name exactly **once**: its own declaration.
Both were dead, and "fixing" them would have moved nothing a reader sees while
reporting a fix. The live path was `headlinePerStudent`. Both dead constants
are now deleted.

Suite 1,687 → 1,694; 110 → 111 files. **This closes task #17** — every item
from the three-critic review is now shipped.

## Phase 446: public pages that linked into the login wall (#22)

Phase 441's sweep found eleven public pages referencing `/admin/`. Six were the
methodology CONTENT promise and moved into public. These are the other eight.

**A public page may MENTION where an admin works. It must not offer a
clickable LINK to a URL that renders a password form.** That line separates
four real defects from prose that is merely informational:

- `Executive.js` wrapped **every institutional action row** in
  `<Link to="/admin/actions">`. The row already shows the title, reduction,
  cost, owner and urgency — so the link promised *more* and delivered "Enter
  the admin password". Now a plain `<div>`.
- `Executive.js` listed "Actions (institutional)" → `/admin/actions` in the
  footer nav **of a public page**. Removed.
- `Actions.js` and `Unsubscribe.js` linked `/admin/actions` and
  `/admin/alerts`. Both now say plainly that staff manage those, no link.
- The hint promised "Full queue on the admin Actions page"; it now says the top
  three are shown in full and the queue is maintained by staff.

**Left alone on purpose:** `Buildings`, `Faq`, `Hotspots`, `TrendBuilder` and
`AnnualReport:294` name an admin path in a sentence aimed at an admin —
informational, not a promise a reader can click and have broken. The test
carries a control asserting the detector tells those two cases apart.

*Process — two of my own guards were wrong, and neither let anything through.*
The staged write aborted on "unbalanced Link tags" because `count('<Link')`
also counts **`<LinkGroup`**; Executive's eleven opens were five `<LinkGroup`
plus six real `<Link>`. Fixed with a word boundary. Then the residual gate
blocked the commit over `Goals.js` — a file this phase never touched — reading
3 open against 2 close. Line 737 is a **comment** documenting the `<Link>` vs
`<a>` convention: prose describing JSX is not JSX. The balance check now
excludes comments, the same filter its sibling link check already used.

Suite 1,694 → 1,815; 111 → 112 files.

## Phase 447: the last two public pages that swallowed a failed fetch

`/sinks-os` and `/credits` both read `useMeasuredSinks` directly — not the
composer Phase 442 fixed — and both did this:

```js
const isMeasured = live.measured && !live.loading && !live.error;
```

`.error` was consumed **only** to negate `isMeasured`. A Supabase failure fell
through to the placeholder (`ANNUAL_SEQUESTRATION_MT`, `TOTAL_FOREST_ACRES`)
and rendered it labelled *"Stand-weighted (placeholder)"* — honest that it is a
placeholder, silent about **why**. An empty table and a failed fetch produced
byte-identical pages. Phase 432's defect, on the two surfaces it never reached.

Both now render `LiveDataNotice`. The notice **adds a fact without replacing
the page** — a third assertion pins that the placeholder figures still render
on failure, because a page that blanks out on a fetch error trades one bad
outcome for another.

This closes the public half of #20. What remains there is TeacherPortal, which
sits behind a `PasswordGate` and renders nothing to assert against without
mocking auth, and the direct `useMeasuredScope2` consumers, where the right
treatment is per-surface rather than a page banner.

Suite 1,815 → 1,821; 112 → 113 files.

## Phase 448: one serving, two portion sizes — published rather than averaged away

`dining.js` prices a beef serving at **9.95** kg CO₂e. `personalFootprint.js`
prices the same serving at **15**, stating "a beef serving is ~150 g". Both
divide the *same* Poore & Nemecek per-kg figure (99.5), so the 51% gap is
entirely portion size: 100 g against 150 g.

Dividing every dining factor by its own per-kg factor exposes more: beef
implies **100 g** while pork, chicken and fish all imply **200 g**. Beef is the
only meat served at half portion, and nothing documents that as deliberate —
`dining.js:16` says the figures were rescaled in Phase 405 "so whatever portion
size was originally assumed is preserved rather than re-guessed". The 100 g was
inherited, never chosen. The 150 g was chosen and documented.

**Reconciling them moves a published total (~243 mtCO₂e), so it is a decision,
not a fix** — the same posture as `FACTOR_RECONCILIATION` and
`SINKS_RECONCILIATION`. What is not acceptable is a reader meeting both numbers
on different pages with nothing saying they disagree. `/dining` now says so, in
the panel where the per-meal average is displayed.

**The durable half of this phase is the guard.** Phase 419 caught
`PERIOD_RECONCILIATION` reaching no page and said to "extend it to every
sibling object at once, so the next one cannot repeat the mistake" — but it was
implemented as **three hardcoded assertions**. So I added
`PORTION_RECONCILIATION` deliberately *unrendered* first, and the rewritten
guard caught it with no per-object maintenance:

```
PORTION_RECONCILIATION (declared in data/dining.js) reaches no page
```

It now discovers every `*_RECONCILIATION` export under `data/` and requires a
page to import it, with a floor assertion so an empty sweep cannot pass
vacuously. The gate additionally requires **four or more fields** to be
rendered, because Rollup drops unread properties — rendering only `.note` would
ship a note and silently discard every figure beside it.

Suite unchanged at 1,821 (an existing test was rewritten, not added).

## Phase 449: the Scope 2 surfaces, and a test that was red for the wrong reason

Six surfaces read `useMeasuredScope2` directly rather than through the composer
Phase 442 fixed, and **not one referenced `.error` at all** — so a Supabase
failure was invisible on every one of them, including `/scope-2`, the page
whose entire subject is Scope 2.

Only three needed wiring, and why the other three did not is worth recording:
`PeerComparison` renders in `App.js`, where the homepage composer notice
already reports `s2.error` as "Scope 2: …"; `Scope2BmsInsights` and
`Scope2LiveDashboard` both render *inside* `Scope2.js`, so wiring the page
covers both charts. One notice per page, not per chart — the rule since 443,
and the gate asserts the charts still add none.

*Process — the red I started from was worthless, and I nearly banked it.* My
fixture failed the table `electricity_ledger`. The hook reads
`scope2_meter_readings`. So the injected error never fired: the test failed
7/10 against unfixed pages **and would have failed identically against fixed
ones**. After correcting the fixture the suite went green — which proved
nothing either, because I had never seen it fail for the right reason.

So I stashed only the three page edits, kept the corrected test, and ran it
again: 7 failed / 3 passed, the three being the empty-table controls. Then
restored and confirmed 10/10. Watching a test fail is not a ritual — a red for
the wrong reason is the same as no test at all, and the only way to tell them
apart is to produce the red deliberately.

The fixture now **imports `SCOPE2_TABLE` from the hook** instead of retyping
it, so a table rename cannot quietly hollow the file out again.

This closes the public half of #20 entirely. TeacherPortal remains, behind a
`PasswordGate` that renders nothing to assert against without mocking auth.

Suite 1,821 → 1,831; 113 → 114 files.

## Phase 450: TeacherPortal, behind the gate — #20 closed

The last live-error swallower. TeacherPortal reads `useMeasuredScopeTotals` but
sits behind a `PasswordGate`, so earlier phases deferred it rather than wire it
blind. That was the right call: a test that cannot see the component would have
been green for the wrong reason, which is worse than no test.

It turns out to be a **legacy** gate — `storageKey="kua_teacher_unlocked"`, not
the admin session path — so `PasswordGate:52` unlocks on a plain
`localStorage` value. An honest mount is therefore possible, and the test
opens with the control that makes the rest mean anything: **assert the gate
really blocks without the unlock**. If it didn't, the auth mock would be
decoration and every later assertion would be about a page that renders anyway.

The notice went on `PortalContents` — the page-level component inside the gate
— not on `PortalScopeChart`, which merely happened to be where the hook was
already called. One notice per page, not per chart, and the gate asserts the
notice sits inside `PortalContents`.

*Process — my own assertion was wrong for the fourth time this session, and
again nothing was written.* The staged write aborted on "expected 2 hook calls,
got 3": line 221 is a **comment** that names `useMeasuredScopeTotals()` in
prose. Same class as Phase 446's `<LinkGroup` and Goals.js's `<Link>` comment —
counting a symbol across a whole file counts the places that merely *talk*
about it. Counting code lines only is the fix, and it is now the third guard
this session to need that same correction.

**#20 is closed.** Twelve public surfaces plus the teacher portal now report a
failed fetch instead of rendering build-time constants as live data, and every
one pins the negative control that an empty table produces no warning.

Suite 1,831 → 1,836; 114 → 115 files.

## Phase 451: "committed" was a claim the board had not made

`/goals` introduced the targets as **"KUA's committed reduction pathway"**.
All four carry `approved: false` — and the same page says so twice: the summary
stat reads *"Approved 0 / 4 · Board ratification pending"*, and every target row
reads *"Pending board approval"*. `AnnualReport` had it right too: *"Targets are
preliminary pending board approval."*

So one line contradicted the page's own status fields, the report, and the
data. For a school board "committed" is not a softer word for "proposed" — it
asserts a ratification that has not happened, on the page a trustee is most
likely to read first.

`pathwayDescription(targets)` now **derives** the sentence from the approval
count, so this cannot drift back:

- 0 approved → *"KUA's proposed reduction pathway. No target below has been
  ratified by the board yet, so these are the school's working goals rather
  than commitments."*
- some → *"… 1 of 4 targets is board-ratified; the rest are proposed …"*
- all → *"KUA's committed reduction pathway — every target below is
  board-ratified."*

Derived rather than reworded matters here: the day the board ratifies, the page
starts saying "committed" on its own instead of waiting for someone to
remember. The test pins all three states plus the empty list, and pins the
premise (`every target is currently unapproved`) so a stale fixture announces
itself rather than quietly passing.

**Found by audit, not by the task list** — which is now exhausted of everything
that does not need a decision from the user.

*Also checked and found CORRECT, recorded so it is not re-investigated:* the
dining baseline of 235 in `targets.js` matches `scopeTotals.js:445` exactly and
says so in a comment; the 243 in `BOTTOM_UP_BREAKDOWN` is the independent
bottom-up cross-check, a different question by design, and the 3.4% gap is that
cross-check working. The 26 reduction actions total 996 mtCO₂e — 22.8% of
gross, with no single action above 25%.

Suite 1,836 → 1,844; 115 → 116 files.

## Phase 452: /scenarios published KUA as 910 mt carbon-NEGATIVE

The worst defect found this session, and the only one that flattered the
school.

`/scenarios` fed `runScenario` Scope 1 (1,350) + Scope 2 (390) = **1,740**
gross, then subtracted the **full** forest sink of 2,650. Net: **−910**. The
page renders that under the subtitle *"KUA's net carbon balance"*, so on first
paint — every slider at zero — a trustee read that the school is already 910
tonnes carbon-negative.

Scope 3 is 2,635 mt, **60% of gross**, and was simply absent from the sum while
the sink that offsets all three scopes was applied in full. Every other surface
publishes **+1,725** — Executive, AnnualReport, AISummary, LearnAgent — and
`CarbonMath` states in words that KUA is *not* net-negative.

`runScenario` now takes `scope3Mt` and carries it through unchanged, since no
lever on the page touches Scope 3. Idle baseline is now gross 4,375 / net 1,725,
identical to Executive.

**The test pins an identity, not a literal:** with no levers pulled, the
scenario baseline must equal the inventory the rest of the product publishes.
A future reprice of any scope moves both sides together and the test still
holds. It also pins the *old* shape — calling `runScenario` without `scope3Mt`
still yields a negative net — so the failure mode stays visible rather than
being quietly designed out.

A sign bug fell out with it: `deltaPct` divides by the baseline, so against
−910 a reduction rendered as **+9%**. With a positive baseline it is correctly
negative, and since the UI already prints the sign separately the percent is
now `Math.abs`-ed rather than rendering "−78.0 mt (-5%)".

*Found by an audit subagent, verified by me before acting* — I executed both
paths rather than trusting the report, which is how I confirmed −910 was real
and not a misreading of a fallback.

*No prose changed, so no text marker.* Verified structurally instead:
`scope3Mt` survives minification in the Scenarios chunk's destructured
signature, where before this phase that chunk contained none.

Suite 1,844 → 1,851; 116 → 117 files.

## Phase 453: the electrify-heating lever ran on two wrong constants

`scenarioModel.js` hardcoded `scope1Mt * 0.8` ("~80% of Scope 1 is heating
fuel") and `/ 80` ("~80 kg/MMBtu, mix of #2 oil at 73 + propane at 64").

Against the repo's own numbers both are wrong, and the second is impossible:

- Scope 1 rows are heating **1,290** + fleet 54 + refrigerants 7. That is
  **95.5%** heating, not 80%. "The rest" is 61 mt, not 270.
- 10.21 kg/gal ÷ 0.1385 MMBtu = **73.72** for oil; 5.72 ÷ 0.0915 = **62.51**
  for propane. At the documented 90/10 split that is **72.60** kg/MMBtu. No
  blend of 73 and 64 reaches 80 — the comment refuted its own constant.

At 100% electrification the flagship lever removed **1,080 mt** where every
other surface says heating fuel is 1,290. Both constants are now **derived**
in `scopeTotals.js` from the same rows and per-gallon factors the rest of the
app uses, so a reprice moves the scenario model with it.

**It was a half-fix risk, and an assertion caught it.** `0.8` appeared
**twice** — once inside the helper (driving the MMBtu → kWh side) and again at
the call site as `const heatingMt = scope1Mt * 0.8; // matches the helper
above`, which is the one that actually drives `scope1Saved`. Correcting only
the helper would have changed the added Scope 2 and left the removed Scope 1
at 0.8 — a lever wrong in a new way. The duplication is now gone: the caller
computes `heatingMt` once and passes it in.

*Process — a real mistake of mine, not just a wrong assertion.* I wrote
`scopeTotals.js` to disk before staging `scenarioModel.js`, so when the
assertion fired the tree was left half-applied. That is exactly what staging
exists to prevent and I bypassed it. Recovered by inspecting both files before
continuing, then redoing the model edit properly staged.

The 1 mt residue is real and is in the data, not the lever: `SCOPE1_TOTAL_MT`
publishes **1,350** while its own rows sum to **1,351**, so a share derived
from the rows applied to the rounded total removes 1,289.0. The test states the
proportional contract — the lever removes the heating share of whatever Scope 1
currently is, so a live figure scales it — and records the rounding rather than
hiding it behind a loose tolerance.

*Verified by a NEGATIVE marker:* the constants inline to variables, so there is
no new string. The old minified form `*.8*1e3/80` must be absent from the
Scenarios chunk.

Suite 1,851 → 1,858; 117 → 118 files.

## Phase 454: three worked examples that taught the wrong number

`/carbon-math` promises "all using KUA-specific numbers". Three of its eight
questions broke that promise, each differently — and a student who does the
arithmetic learns the error.

**Q1 — a premise 3.25× KUA's own electricity.** "KUA used about 5,400,000 kWh
last year." The canonical Scope 2 is 390 mt at 0.234446 kg/kWh = **1,663,496
kWh**. The internal arithmetic was fine (5.4M × 0.234 = 1,264 mt); the premise
was not. Now 1,660,000 kWh → **389 mt**, the figure /scope-2 publishes.

**Q2 — the flight figure this repo retired by name.** "One round-trip
transatlantic flight is about 2.5 mtCO₂e." `personalFootprint.js:37-44` retired
2.5 explicitly as sitting *below all four published methods*, and uses **3.7**.
Worse, the conclusion read "125 mt across just 50 students is more per-person
than most American adults emit in a year" — that is **2.5 mt/person** against
this repo's own `FOOTPRINT_REFERENCE.usAdultAvgMt` of **16**. False by 6.4×,
and *still false at the corrected 3.7*, so it had to go rather than be
rescaled. It now says a single journey is close to a quarter of a US adult's
entire year, and more than a Paris-aligned 2 mt lifetime budget for twelve
months — both true.

**Q5 — a net that did not follow from its own answer.** The question computes
2,100 mt of drawdown, then states "The net figure is about 1,725". But
4,375 − 2,100 = **2,275**. The 1,725 comes from the *adopted* per-stand sink of
2,650, which the question never introduces — so a student who subtracts gets a
different number than the page. It now shows both, and says which one the
dashboard actually uses.

*Process — the fifth quoting break of this run, and the suite caught it exactly
as documented.* I wrote `the dashboard's cohort-weighted figure` inside a
single-quoted JS literal. Tests fell 1,858 → **1,816** with one file failing to
**transform** — which reads like 42 broken assertions and is one file that never
parsed. Fixed by **rephrasing to avoid the apostrophe** rather than escaping it,
and the gate now sweeps every `setup:`/`work:` literal in the file for the same
class so it cannot recur here.

Suite 1,858 → 1,864; 118 → 119 files.

## Phase 455: the Learn path taught a grid factor this repo calls mislabelled

`scopeTotals.js:855`, in the repo's own words: *"MISLABELLED — 643.0 is NOT
ISO-NE's 2024 rate. ISO-NE published 597 lb/MWh generation-only for 2024…
643 is a stale figure, most likely 2022."*

`LearnAgent.js` used 643 in **seven** places, including two worked problems
students are asked to compute from — and `LearnAgent.js:441` states 597
correctly five lines before one of them.

Both problems were wrong, in **opposite directions**, because they also picked
the wrong factor *class*:

- **Dorm, 80,000 kWh CONSUMED.** An inventory question, so the rate is the
  dashboard's 0.2344 kg/kWh (**517 lb/MWh**) → **18.8 mt**. The quiz taught
  23.3 — **24% high**.
- **Solar, 245,000 kWh DISPLACED.** A consequential question, so the rate is
  AVERT marginal 0.4896 kg/kWh (**1,079 lb/MWh**) → **120 mt**. The quiz taught
  71.5 — **40% low**, and on the wrong basis entirely. The heat-pump question
  forty lines later gets this exact distinction right.

The solar explanation now names why the rate differs and what the inventory
rate would wrongly give (~57 mt), because a corrected number with no reason
invites the same mistake back.

**The seventh reference was the worst and nearly missed.** My first staged
write covered the six in the two problems and aborted on `a 643 reference
survives` — a *concept* lesson stating "for KUA, that is ISO New England at 643
lb CO₂ per MWh in 2024", teaching the false attribution as prose rather than
arithmetic.

*Scope held deliberately.* Sweeping the tree found 643 in more places, and they
are **not the same claim**: `scopeTotals` comments document the history,
`Scope2.js` asserts 643 is the 2024 **in-region** rate (contradicting this
repo's own 597), `Methodology`/`AdminMethodology` call it an **input-energy
basis** figure, and three AP history files mention Louis XIV, Newton and Anne
Hutchinson — **1643 is a year**. Only the teaching surfaces are fixed here; the
ISO-NE attribution needs the primary source and gets its own phase.

Suite 1,864 → 1,869; 119 → 120 files.

## Phase 456: 643 lb/MWh is ISO-NE's 2022 rate — settled from the primary source

Phase 455 removed 643 from the teaching surfaces but deliberately left three
others alone, because they made **two different claims** and I could not tell
which was right without the source:

- `Scope2.js` asserted 643 was the **2024 in-region** rate.
- `Methodology.js` and `AdminMethodology.js` called it an **input-energy
  basis** figure.

ISO New England's own published analysis settles it: the **2022** in-region
rate was **643 lb/MWh** (565 including net imports). Their later analyses give
**633 for 2023** (571 with imports), and `scopeTotals` records **597** for 2024.

So both claims were wrong in the same way — 643 is a *vintage* behind, not a
different basis. `scopeTotals.js:857` had already guessed "most likely 2022"
but flagged the attribution as **second-hand**; it is now first-hand, and the
hedge is gone.

Scope 2's explainer now walks the series (597 ← 633 ← 643) rather than naming
one number, which is what makes the vintage visible to a reader instead of
something they have to take on trust.

**The test pins the vintage, not the number.** 643 may legitimately appear as a
historical comparison — it just may never appear without a 2022 label. My first
version forbade `643` and `2024` on the same *line*, which failed against the
very sentences that fix the problem ("597 for 2024; the 643 figure is 2022").
That was the test being wrong, not the copy.

*Also caught by the same run:* my replacement comment said the earlier note
"hedged this as second-hand; it no longer is" — which still contains the phrase
the assertion forbids. Rewritten to describe the change without quoting it.

Suite 1,869 → 1,878; 120 → 121 files.

Sources: ISO-NE via isonewswire — 2022 (643 in-region / 565 with imports) and
2023 (633 / 571) analyses.

## Phase 457: the sinks lesson told students the forest was worth nothing

`LearnAgent` introduced the per-student figure as *"roughly **5–8 mtCO₂e per
year** before forest credits"*, in the lesson that introduces sinks.

5–8 is the **net** range. Canonical gross per student is 4,375/340 = **12.87**;
net after subtracting 2,650 mt of sequestration is **5.07**. The same file says
so twice elsewhere — `:311` writes "gross ~12.9 mt/student", and a quiz
explanation reads *"You divided GROSS by students. Net subtracts sinks first."*

Labelled "before forest credits", the sentence claims the campus forest changes
nothing per head — inverting the whole point of the path it opens. Both
sentences now give **13 gross → about 5 after the forest**, and name the gap:
close to **8 mt per student, every year**, which is the forest doing the work.

The unsupported rider went with it. "About half their home-life carbon" holds
at neither figure: against this repo's own `usAdultAvgMt` of 16, net 5 is about
a third and gross 12.9 is about four fifths.

*Scope held:* a third sentence uses a 5–8 range for a student's **personal**
footprint in a travel comparison — a different quantity, left alone and
recorded in #23 rather than swept up.

*Process — my own guards were wrong four times in this one phase, and the
staged write refused every time.* The blanket `'5–8 mt' not in s` caught the
personal-footprint line I was not fixing. `TOTAL_STUDENTS` came from
`students.js`, not `academicCalendar.js`. An assertion demanded the literal
"13 mt" from the Tokyo sentence that already said "~12.9" correctly. And one
assertion matched `about 5 mt` against a sentence carrying markdown bold.

The most useful of the four: **my quoting guard had a real bug**. I wrote
`\},?`, making the closing brace REQUIRED, so any line ending `',` kept its
closing quote and read as an unescaped apostrophe. It fired on an untouched
line while the file parsed cleanly. It had passed in Phases 454 and 456 only
because those lines happened to end `' },`. The brace is now optional — a guard
that only works on half its inputs is worse than none, because its silence
means nothing.

Suite 1,878 → 1,883; 121 → 122 files.

## Phase 458: two lesson figures students were asked to compute from

**AR4 values wearing an AR6 label.** `lessonLibrary.js` opened a refrigerant
lesson with *"IPCC AR6 GWP values for HFCs: R-410A = 2,088, R-134a = 1,430,
R-32 = 675"*, then asked students to compute CO₂e from a charge loss using
them. AR6 GWP-100 is **2,256 / 1,530 / 771** — which is exactly what this
repo's own `REFRIGERANT_GWP100` carries, and what Phase 437 sourced the
`emissionFactors` rows to (IPCC AR6 WG1 Ch.7). 2,088 is the **AR4** figure the
EU F-Gas Regulation still mandates, which is why it circulates; 675 is close to
the **AR5** value of 677. Confirmed against the literature before publishing a
correction to teaching content.

**A solar array 3.7× its real size.** Three lessons cited *"KUA's 220 kW
rooftop solar"*, one of them as *"KUA's **published** 220 kW solar"*.
`renewables.js` lists three **operational** arrays totalling **60 kW** DC
(40 + 12 + 8), plus a 60 kW array **planned** for 2027. 220 matches neither.
At the lesson's own 14% CF it implies ~270,000 kWh/yr against a
measured-anchored `SOLAR_ANNUAL_KWH` of **~16,750**.

The capacity factor was relabelled too: 14% is a fair **NH regional** planning
figure, but attributing it to KUA as observed performance is the other half of
the same error. I did **not** assert a measured CF in its place — only one of
the three feeds reports, so that number is not mine to publish yet.

*The third 220 kW nearly escaped, and the reason is in my own notes.* My first
sweep printed that line truncated at 230 characters, so I saw a wind-turbine
task and concluded it was unrelated — the claim sat 140 characters further
along the same line. The staged write caught it (`220 kW survives`), which is
the third time this session a guard has blocked a partial fix. **Never judge a
long line from truncated output.**

Suite 1,883 → 1,890; 122 → 123 files.

## Phase 459: one quiz question, two incompatible factor sets

The question asks which food has the largest footprint per kg. Its **correct**
answer used the canonical values — beef 99.5, chicken 9.9, rice 4.5, beans 1.0.
All three **distractor** explanations ran on the set `emissionFactors.js`
records retiring in Phase 405:

| distractor said | canonical |
| --- | --- |
| "Chicken is ~6 kg CO₂e/kg" | **9.9** |
| "Rice … 15× lower than beef" | 99.5 / 4.5 = **22×** |
| "Potatoes … 150× less than beef" | 99.5 / 0.4 = **249×** |

The two ratios are the tell: 15× and 150× hold only if beef is **60** — the
discredited teaching figure. So a student who read all four explanations was
taught that beef is both 99.5 and 60, inside a single question.

The test asserts the ratios **against the factor table** rather than against
literals, so a reprice moves the quiz with it instead of stranding it again.
It also proves the implication rather than asserting it: 4.5 × 15 and 0.4 × 150
both land within 10 of 60.

Suite 1,890 → 1,894; 123 → 124 files.

## Phase 460: a thermostat rule six times the published one, credited to ENERGY STAR

DOE/ENERGY STAR publish roughly **10% a year** on heating for a **7–10 °F
setback over 8 hours a day** — about **1.2% per °F**. Two lessons ran well
above that, and one named a source that does not say it.

**"~30 mtCO₂e across the building."** A 2 °F overnight setback on a dorm
burning 6,000 gal/yr. That dorm's *entire* heating footprint is 6,000 × 10.21 =
**61.3 mt**, so the claim is **49% of all its heating emissions** from turning a
radiator down two degrees at night. At the DOE rate it is about **1.5 mt** —
still worth doing, and it scales across every dorm, which is the honest version
of the point.

**"About 7% per °F of setback × ~2 °F ≈ 14%. EPA ENERGY STAR documents this
rule."** Three faults in one sentence: the rate is ~6× the published one, the
attribution does not hold, and the question asks about **22 °C → 20 °C**, which
is **3.6 °F**, not 2.

The quiz now answers its own question: 3.6 °F × 1.2% ≈ **4%**. And **14%
survives as a distractor** explaining where it comes from — a wrong answer a
student is likely to reach is more useful kept and explained than deleted.

*Verified against the primary source before correcting an attribution*, the
same way Phase 456 settled the ISO-NE vintage. The test pins the dorm total
against `FUEL_FACTORS_KG_PER_GAL`, so a fuel reprice moves the lesson with it.

Suite 1,894 → 1,900; 124 → 125 files.

Sources: US DOE *Program Your Thermostat for Automatic Savings*; ENERGY STAR
smart-thermostat guidance.

## Phase 461: pledging a cut made the number go up

The pledge card on `/your-footprint` rendered:

> That's ~**0.26** mtCO₂e off your footprint (**0.86 → 1.22** mtCO₂e total).

`currentMt` was the top **row** — the single biggest contributor — while
`newTotalMt` was the **whole footprint** after the cut. Both were labelled
"total", and since the total always exceeds any one row, the arrow pointed the
wrong way. A student who pledged a reduction watched their number rise:

- day student: 0.86 → **1.22** (up 0.36, while claiming a 0.26 cut)
- US boarder: 1.20 → **1.46**

The arrow now runs total → total — **1.48 → 1.22** — and the difference equals
the reduction the same sentence claims. The test derives both sides from
`estimatePersonalFootprint` rather than hardcoding, and pins the premise that
made the bug possible: any single row is smaller than the total.

*Caught myself adding the same class of defect.* My first fix kept the row
value as a new `focusMt` property that nothing rendered — exactly the "property
wearing a comment" pattern Phase 419 established. Dropped.

Also noted for #23, not fixed here: `personalFootprint.js:59-61` prices a
2–3 °F setback at **7%**, the same inflated rule Phase 460 corrected in the
lesson content. It belongs with a review of the estimator's own factors rather
than bolted onto a display fix.

Suite 1,900 → 1,906; 125 → 126 files.

## Phase 462: four LearnAgent figures, and the claim that depended on one

| stated | canonical |
| --- | --- |
| Renewables ~14%, net imports ~12% | **12%** and **7%**, with hydro its own **6%** row |
| Driving 1,000 miles ≈ 400 kg | 0.2986 kg/mi → **299 kg** (400 g/mi is the EPA figure Phase 406 retired) |
| "current 2.3M kWh" | the Year-1 projection is **~1.66M kWh** |
| 1 t CO₂ fills a sphere ~8 m across | 1 t at 25 °C is **556 m³** → **~10.2 m**; an 8 m sphere holds about half a tonne |

`LearnAgent:441` already stated the mix and the kWh correctly, so each of these
contradicted its own file.

**The electricity correction cascaded, and following it through mattered more
than the number.** A stack-rank question computed (b) LED retrofit from 2.3M
kWh and concluded: *"swap the inventory rate for the marginal rate and (b)
jumps to ~135 mt, **which reorders the whole list**."* At the real 1.66M kWh,
(b) is 47 mt at the inventory rate and 98 mt at the marginal — and 98 **does
not** pass (c)'s 111, so the reordering claim stops being true. Changing only
the input would have left a conclusion the new numbers contradict.

The rewrite keeps the teaching point and sharpens it: (b) and (a) are now
nearly tied at 47 and 43, and the marginal rate brings (b) *close enough* to
(c) that the ranking turns on an assumption the question never stated.

*The gate blocked this commit once, correctly.* My first pattern forbade
"~14%" anywhere in the file — but that string also belongs to the thermostat
**distractor Phase 460 deliberately kept**, explaining where the inflated
7%-per-°F rule comes from. Scoped to the grid-mix line, and the gate now also
asserts that distractor still exists, so a later sweep cannot quietly delete
a wrong answer that is there on purpose.

Suite 1,906 → 1,911; 126 → 127 files.

## Phase 463: one journey, five numbers

The East Asia round trip appeared as **3,000 kg**, **4,000 kg**, **3 mt**,
**3.7 mt** and **4.3 t** across one file.

Two of those are legitimately different, and **say so**, which is the whole
distinction:

- **4.3 t** — Boston→Tokyo specifically. 10,800 km × 2 × 0.20011 = 4,322 kg ✓
- **3.7 mt** — the cohort-weighted central. 9,060 km × 2 × 0.20011 = 3,626 kg ✓,
  and what `personalFootprint`'s `MT_PER_INTL_FLIGHT` adopts.

The other three carried **no basis at all**, so a student meeting several had
no way to tell which was the figure and which was the route. They now use the
cohort-weighted central and say which basis that is.

**The ratios hanging off them were recomputed rather than left pointing at the
old inputs** — the same discipline as Phase 462's stack-rank. "800× a year of
conscientious light-switching" was built on 4,000 kg; at 3,700 it is ~750×.
And "half a typical personal footprint … two trips = 50-60%" was internally
inconsistent before anything changed (if one trip is half, two are all of it);
it now compares against a canonical quantity — gross per student, 12.9 mt —
where one trip is close to a third and two are well over half.

*The gate asserts the two labelled figures SURVIVE*, not merely that the
unlabelled ones are gone. A sweep that flattened every flight number to one
value would have destroyed a correct route-specific figure, which is the
opposite of the fix.

Suite 1,911 → 1,915; 127 → 128 files.

## Phase 464: three files counted the same thing three ways

- `Faq.js` told a teacher the Learn portal has **eight** short learning paths.
- `Learn.js` said **11** in a comment.
- `LearnAgent.js`'s own header said **9**.

There are **eleven**. A teacher following the FAQ is told eight and finds
eleven — on the page whose whole job is answering "what is actually here".

A fourth hardcoded number would have drifted exactly like the first three, so
`LEARNING_PATH_COUNT = paths.length` is now exported and the FAQ renders it.
The count follows the content; nobody has to remember.

*Verified in the built chunk, not the DOM.* The FAQ is an accordion that does
not render collapsed answers, and a synthetic click did not expand it in jsdom
— so a render assertion would have proved nothing either way. The bundle shows
`"…the Learn portal has ", x, " short learning paths…"` with `x` bound to the
import, which is the thing worth knowing. The import also tree-shakes cleanly:
the Faq chunk is 9.6 KB, so pulling a count out of a 1,900-line module did not
drag the lessons in with it.

Suite 1,915 → 1,919; 128 → 129 files.

## Phase 465: the number the whole sinks argument rests on, stated as fact

KUA publishes a **1,300-acre campus**. It does not publish a forested acreage.
The ~1,000 acres this dashboard uses is the project's own working figure —
CLAUDE.md recorded that in Phase 414, and `ScopeExplainer` says so in the copy.

`LearnAgent` asserted it as fact three times, in the lessons that introduce
sinks: *"KUA owns roughly 1,000 acres of forest in New Hampshire"*, *"The sink
at KUA is the ~1,000 acres of campus forest"*, and a Birdsey math problem
opening *"KUA has ~1,000 acres of forested land"*.

It matters more here than anywhere else: the sink is **more than half of gross
emissions**, so this single unpublished number decides whether the school reads
as nearly balanced or clearly positive. All three now name the published 1,300
first and flag the 1,000 as ours.

**Prose asserts; a givens table inherits.** `{ label: 'Forested area', value:
'1,000 acres' }` is a parameter of a stated problem, not a claim about the
world — the scenario line above it carries the caveat, and requiring one inside
a table cell would be noise. The test encodes that distinction rather than
flattening it, the same call as Phase 446's link-versus-mention.

*Two of my own guards were wrong again, and both refused to write.* The first
demanded the caveat on **every** line containing the acreage, including that
table cell. The second classified prose by `body: '` — but one of these bodies
is a **template literal**, so a real assertion read as not-prose and the count
came up short. Fixed to accept both quote styles.

Suite 1,919 → 1,922; 129 → 130 files.

## Phase 466 — the thermostat saving is derived from DOE, not asserted

`personalFootprint.js` priced a dorm thermostat habit from a rate with no
source: a degree of setback saving about 3% of heating energy, a typical dorm
habit about 7%. That 7% is not an internal assumption — it is rendered to the
student, as "7% reduction vs baseline 3.8 mt per boarder".

DOE publishes about 10% off annual heating for a 7–10 °F setback held eight
hours a day: roughly 0.147% per degree-hour-per-day, or about 1.2% per °F. The
retired rate was some 2.5× that. Phase 460 had already corrected the **lesson**
content to the DOE rule, which left the dashboard teaching one number and
computing another.

Both habits are now computed from a single stated rate — `turn_down_when_out`
2.5 °F over 12 h (4.4%, was 7%), `off_when_out` 6 °F over 12 h (10.6%, was 10%
and already about right). The assumed out-of-room window is 12 hours, written
down rather than buried in a coefficient, so changing the rate or the hours
moves both habits together.

**The residual gate found the claim still live on the homepage.** The tip of
the day stated the retired 7% and its 0.27 mt consequence — the same habit, a
third number, on the page most visitors actually see. `DailyTip` now imports
the exported rate and computes its own line (3.5%, 0.13 mt), so the estimator
and the tip cannot drift apart again; a test pins that it derives rather than
states.

*One of my two sweep patterns was wrong, as usual in the safe direction.*
Matching any "3% of heating energy" flagged Phase 460's **corrected** sentence,
which says a 2 °F setback saves on the order of 2–3%. The defect was the
unsourced *per-degree* claim, so the pattern now anchors on that phrasing, with
controls proving it catches all three real defects and ignores all three
correct lines.

Suite 1,922 → 1,928; 130 → 131 files.

## Phase 467 — one transatlantic round trip, one number

A round-trip transatlantic flight was priced three ways on three surfaces a
student sees, none derived from the others: `equivalents.js` held ICAO's
sourced **1.4 mt one-way** (so 2.8 round trip), the homepage tip said **2.5**,
and the forest-offset lesson said **1.6**.

2.5 was not simply a third number. `personalFootprint.js` retired it **by
name** as sitting below all four published methods, and
`carbonMathPremises.test.js` already pinned that `/carbon-math` had stopped
using it — the homepage tip had kept it. And 1.6 prices a *round trip* below
the repo's own *one-way* rate, while labelling itself CO₂e when it is a
CO₂-only figure.

The ICAO constant is the only transatlantic figure here with a source
attached, so it is now exported along with a derived round trip, and both
prose surfaces interpolate it instead of restating it.

**What this deliberately does not do:** it does not settle which
international-travel factor the dashboard should adopt.
`MT_PER_INTL_FLIGHT = 3.7` is a broader per-student average and stays where it
is. The point is that when that question is answered, it is a one-line change
rather than a hunt across three files — the same move as Phase 466.

*The tip's comparison is now checked, not trusted.* It claims a round trip
beats a student's whole share of Scope 2; that is arithmetic over two live
constants (2.8 against 390/340 = 1.15), so a test asserts it rather than
letting the sentence vouch for itself.

Suite 1,928 → 1,932; 131 → 132 files.

## Phase 468 — the lesson stops contradicting the calculator beside it

The "travel is the biggest lever" block carried four figures. Three disagreed
with the estimator this same dashboard ships, and two were numbers the repo
had already retired by name elsewhere:

| lesson said | the estimator says |
| --- | --- |
| footprint "might be 5–8 mtCO₂e" | 1.4 day / 1.6 US boarder / 7.8 international |
| intercontinental RT "~3" | `MT_PER_INTL_FLIGHT` 3.7 |
| "Domestic flight: ~1" | `MT_PER_DOMESTIC_FLIGHT` 0.6 |
| "Driving 1,000 miles: ~0.4" | 0.2986 kg/mi → ~0.3 |

5–8 describes **only** the international boarder and is 3–5× high for the two
types most students belong to. And 0.40 kg/mi is the fleet-average factor
`personalFootprint.js` explicitly replaced with EPA's commuting factor — the
lesson kept the retired one.

The spread between student types *is* the teaching point, so the block now
states all three and derives every figure from the estimator.

**The residual gate found the same claim a second time**, in the carbon-budget
block, feeding a worked estimation exercise with the same two stale flight
factors. That line was 1,620 characters with six escaped apostrophes, so it was
converted to a template literal by transforming the parsed string — unescape,
substitute, re-wrap — rather than retyping it.

*The first red was the wrong red, and this time it was caught.* Asserting on
the rendered prose needs `LEARNING_PATHS` exported; without it the test failed
on an undefined import and proved nothing about the text — the Phase 449 trap.
The export landed first, the red was re-checked until each failure named a real
wrong number, and only then was the prose fixed.

*`toFixed(1)` is kept deliberately* even though it renders 7.85 as 7.8: that is
what `PeerSpectrum` prints on /personal-footprint, and the point is that the
two surfaces show the same string. Rounding half-up here would reintroduce the
mismatch the phase exists to remove.

Suite 1,932 → 1,938; 132 → 133 files.

## Phase 469 — a factor sweep, and the article it caught

Phases 466–468 all fixed the same shape of defect, so this phase went looking
for the rest of it: a context-matched sweep of the teaching files for prose
restating a per-unit factor the code already defines.

**Most of what it flagged was the sweep being wrong**, which is the usual
ratio. Beef at "99.5 kg CO₂e" is per *kilogram* (Poore & Nemecek), not per
serving — and 99.5 × the 0.15 kg serving is 14.9, so it corroborates
`KG_PER_BEEF_SERVING = 15` rather than contradicting it. "0.49 kg/kWh" is the
AVERT marginal rate in displacement contexts. "0.37 kg/kWh" is the US average,
named as such. And ISO-NE at "0.271 kg/kWh" is the 2024 **in-region** rate
(597 lb/MWh), explained in the same paragraph and distinct from the
output-basis 0.2344 the inventory uses.

**One was real.** The carpool knowledge article stated *"a typical passenger
car emits about 0.351 kg CO2 per mile"* and cited EPA's consumer
"Typical Passenger Vehicle" page. `emissionFactors.js` records that exact
pairing as what Phase 406 fixed: the page publishes ~400 g/mi, and the figure
matched neither it nor the Hub. It survives in `geographicEstimates.js` — but
labelled there as a 25-mpg assumption, which is a fair sensitivity input and
not a fact to state to a reader.

Factor, citation and the worked arithmetic now all come from the factor row:
0.2986 kg/vehicle-mile, 14.9 kg/week each, 1.1 mt/year for the pair across the
180 staff work days. The old 17.5 and 0.7 followed from 0.351 and no longer do.

A tripwire now guards the class: any prose sentence claiming "N kg per mile"
must state the canonical factor, with a control proving the sweep fires on the
retired figure and stays quiet on the fix.

*Third time this session my replacement comment quoted the string my own guard
forbids* — here by writing out both the retired number and the bad citation
while explaining them. The staged write refused, as in Phases 456 and 466. The
fix each time is to **describe** the retired claim rather than restate it.

Suite 1,938 → 1,943; 133 → 134 files.

## Phase 470 — check the worked examples, not just the totals

`proseFigures.test.js` guards the headline totals in teaching prose. Nothing
checked that a *stated calculation* actually computes — which is the part a
student is invited to redo by hand.

This evaluates every contiguous arithmetic chain in the eleven teaching files,
with normal operator precedence, including restated intermediates
("50×1 + 4×28 + 0.1×273 = 50 + 112 + 27.3 = 189.3").

**It found nothing. 28 chains, all correct** — which is the result worth
reporting plainly rather than manufacturing a fix for.

Getting to that answer took four passes, and each false alarm is now a
documented allowance rather than noise:

- **Left-to-right evaluation was wrong.** Prose uses normal precedence, so
  `50×1 + 4×28 + 0.1×273` is 189.3, not 412,703. Evaluating naively made a
  correct example look 200,000% off.
- **Unit rescale.** `6,000 × 10.21 = 61.3 mt` is right — in kg. Powers of
  1,000 are accepted rather than requiring the prose to spell out kg→mt.
- **Continuations are skipped, not failed.** `2.77 kg C/gal × 44.01/12.01 =
  10.15` has a unit word inside the expression; a scan entering at `44.01`
  sees a fragment. A chain preceded by an operator is a tail of something
  longer, so it is skipped — inventing a verdict on a fragment is worse.
- **A bare `N = M` is a label.** `GWP-100 = 28` is not a sum. The left side
  must contain an operator to count as a calculation at all.

The test carries controls in both directions — a corrupted chain must be
flagged and a correct one must not — plus a floor on how many chains it finds,
so it cannot pass by quietly matching nothing.

*It also caught a real gap in my own earlier scan:* the Python version had
`if not path.exists(): continue`, so a wrong path (`pages/EnergyEquivalents.js`
— the file is in `components/`) was silently skipped. The test fails loudly on
a missing file instead.

Test-only phase: no rendered output changed, so there is no runtime marker to
verify in the bundle.

Suite 1,943 → 1,947; 134 → 135 files.

## Phase 471 — the sink figure stops calling itself a mid-estimate

Task #16 asks whether the campus forest really pulls 2,650 mtCO₂e. That is a
decision about the number. This phase is about how the number describes
itself, which is not a decision at all.

`geographicEstimates.js` already computes `SINKS_RECONCILIATION`: the adopted
2,650 is the **top** of a four-method spread running 1,000–2,650, central
1,730 — +53%. The only method in the set independent of KUA assumptions (EPA
GHG Equivalencies) is the 1,000.

**`/sinks` renders that gap. `/sinks-os` did not** — it showed 2,650 with the
note "Stand-weighted (placeholder)" and imported nothing from
`geographicEstimates`. That is the page `lessonLibrary.js` sends students to
*twice*, asking them to compare their own leaf-level or logistic-growth
derivation against "the published 2,650". A student landing near 1,700 was
being told, implicitly, that they had got it wrong.

**Then the sweep found the word itself.** "Mid-estimate" was attached to the
adopted figure in four places across two files:

- `PeerComparison.js`, twice (static and live variants of the same note) —
  in the component that benchmarks KUA against peer schools, which is exactly
  where the sink flatters KUA most.
- `LearnAgent.js`, in a quiz explanation that correctly derives Birdsey as
  2,083 and then calls 2,650 the "mid-estimate" it blends toward.
- `LearnAgent.js` again — **"~3,000 mid-estimate", above even the adopted
  figure.**

The page's own provenance text already said the closed-canopy source
(Birdsey 1992) averages 2.1 mtCO₂e/acre/yr, while the stand table averages
2.65 — so the adopted rate sits above its own closed-canopy citation, and the
gap is made up by a Nowak **urban** open-grown rate applied well beyond the 40
acres it fits.

All four now state the range and which end the dashboard adopts. Nothing was
repriced: whether to adopt 1,730 instead is still #16, still open, and now
visible on every surface that makes the claim.

*The anchor caught a duplicate again* — the peer note exists twice, once for
the static figures and once for the live ones. A single-occurrence assertion
refused to write rather than fixing one and leaving the other.

Suite 1,947 → 1,951; 135 → 136 files.

## Phase 472 — the caveat that undercut the caveat

Phase 471 added "2,650 is the top of a 4-method spread" to the Sinks OS
module. Four sections further down, the same page's caveat list said the stand
rates were **"mid-range"**.

Both cannot be doing honest work. The trick is the choice of range: Birdsey
1992 spans 0.6–6.7 mtCO₂e/acre/yr *across every US forest type, age and site
quality*, and 2.65 does sit inside it. But the page's own provenance text puts
Birdsey's US-forest **average** at 2.1, and the stand table averages 2.65. Pick
the widest possible span and almost anything is mid-range.

The caveat now states the stand table's actual weighted rate, derived from the
data, and says plainly that it sits above the Birdsey average because the mix
blends in a Nowak open-grown rate drawn from urban trees.

*Fourth time this session my replacement text restated the phrase its own
guard forbids* — the new sentence originally said that calling the rates
"mid-range" would be the flattering framing. The rendered test caught it after
the write guard did not, because I had written the guard as
`'mid-range stand-specific'` (the old phrasing) while the test asserts on
`/mid-range/i`. **The refinement: make the write guard match the test's
assertion exactly, not a narrower phrase.** The clause was cut rather than
rephrased — editorializing about our own copy is weaker writing anyway.

Suite 1,951 → 1,952.

## Phase 473 — the rates answer a different question than the one we ask them

Task #16 has been open for dozens of phases as "is the sink 2,650 or ~1,100?".
It turns out not to be a dispute about a number. It is a units-of-meaning
problem, and the same one as [inventory vs consequential] electricity factors:
**both sources are real and correctly transcribed, and neither was published
to answer "how much CO₂ does this property remove from the atmosphere in a
year."**

- **Birdsey 1992, Table 2.14** is *annual accumulation of carbon in LIVE
  TREES on timberland* — FIA net annual growth of growing stock, which is
  gross growth minus mortality and **not** minus harvest removals, with no
  soil, forest floor, dead wood or understory.
- **Nowak et al. 2013's** widely quoted 0.277 kg C/m²/yr is the **GROSS** rate
  **per m² of canopy**. Nowak's own net is 0.205 — 74% of gross — and his New
  Hampshire row is 0.217 gross, 2.38 net per canopy acre.

The open-grown stand rate of 4.2 is Nowak's gross US average (0.277 → 4.11;
the 0.28 the references page quotes → 4.15). The test proves that by
conversion rather than by trusting a comment.

Published **net** rates for the same ground, for contrast: EPA GHG
Equivalencies **1.00**, USDA FS Domke et al. **0.84**, and GTR NE-343 yield
tables **1.6–2.0** for unharvested NE hardwood at 65–95 years — the age band
holding ~65% of NH forest carbon. The stand table averages **2.65**.

**The convergence worth noting.** An age-class-weighted estimate from the
published yield tables gives **1.77 mtCO₂e/acre/yr**. The dashboard's own
four-method central, computed years earlier by a completely different route,
is **1.73**. Two independent paths, 2.1% apart.

Every conversion above was re-derived here rather than taken on trust; all of
them check. The one apparent discrepancy — EPA's 0.27 × 44/12 = 0.99 against a
published 1.00 — is EPA's own rounding.

**Also recorded, not fixed:** the stand table gives mature hardwood 2.8 and
the young stand 2.6. Every published yield table has increment *peaking*
young and declining with age (GTR NE-343: maple-beech-birch 3.28 at 25–35 yr
falling to 1.59 at 85–95), and Birdsey says so in words on page 1. A test now
asserts the inversion *exists*, so the finding stays visible and the test
flips when #16 is settled.

Nothing was repriced. Sources are now described by what they measure —
`SEQUESTRATION_BASIS` in `sinks.js`, plus the citation text on /sinks,
/sinks-os and the method label in `geographicEstimates.js`.

Suite 1,952 → 1,957; 136 → 137 files.

## Phase 474 — the forest sink is repriced to a net basis

Task #16, decided and applied. The adopted sink moves **2,650 → 1,829**
mtCO₂e/yr (2.65 → 1.83 per acre), so net moves **1,725 → 2,546** and net per
student **5.07 → 7.49**.

Every new rate is traceable to a published figure rather than tuned to hit a
target — GTR NE-343 net annual increment for unharvested NE stands, by type
and age class, with Nowak's own New Hampshire NET rate for the open-grown
acres scaled by canopy cover:

| stand | acres | was | now | from |
| --- | --- | --- | --- | --- |
| North Hill, mature hardwood | 320 | 2.8 | 1.79 | MBB 65–95 yr |
| Potato Patch, intermediate | 180 | 3.2 | 2.20 | MBB 35–55 yr, blended for pine |
| Chellis riparian, mature | 60 | 2.4 | 1.69 | spruce-balsam fir 65–95 yr |
| South ridge, mature softwood | 240 | 1.9 | 1.15 | white-red-jack pine 65–95 yr |
| Open-grown campus trees | 40 | 4.2 | 1.31 | Nowak NH **net** 2.38 × 55% canopy |
| Athletic buffer, young | 100 | 2.6 | 3.00 | MBB peak 3.28 at 25–35 yr |
| French's Ledges, mature | 60 | 2.5 | 2.17 | oak-hickory 2.55 blended with MBB |

**The age ordering flipped the right way round.** Increment peaks young and
declines with age in every published yield table; the old table had mature
hardwood above the young stand. Now young 3.00 > intermediate 2.20 > mature
1.79, and no mature stand exceeds the young one.

**The adopted figure is no longer the top of its own spread.** The top is now
Birdsey live-tree growth (2,100) — the basis this phase moved away from. The
spread tightened to 1,000–2,100 and the gap over central fell from +53% to
+20%. That remaining gap is explainable and is published rather than hidden:
the other three methods are national or statewide rates that average in
harvested acres, and KUA does not harvest.

**Convergence worth recording.** 1.83/acre against a research central of
1.77 and the dashboard's own four-method central of 1.73, computed years
earlier by an unrelated route.

**Blast radius: 22 sites in LearnAgent alone, ~40 across the app**, including
quiz answer OPTIONS, not just explanations — the distractor "~7.8
mtCO₂e/student" would have collided with the new correct answer of ~7.5, so it
became ~5.4 (sequestration per student). The statistics worked example on
/carbon-math moved with it: the sink half-range is now ±550 rather than ±825,
so the net SD falls from ±849 to ±585.

*Three things the guards caught that I would have shipped:*

- **A 19th LearnAgent site my own enumeration missed**, and then a 20th and
  21st inside a single 4,192-character line that held two separate passages.
  A blanket `if forbidden in s` check after the substitutions is what found
  them; the staged write refused three times before it wrote.
- **`liveDataWiring` caught a defect I introduced.** Importing the canonical
  totals into `DailyTip` made it a surface showing a build-time figure with no
  live hook. The card was *already* stale-prone with the numbers typed in —
  the guard simply could not see a literal. It now reads
  `useMeasuredScopeTotals`, which already composes gross, sink and net and
  falls back internally, so no second fallback is needed.
- **The `targets.js` baseline could no longer be exact.** `1,725` was only
  ever exactly `GROSS_MT − ANNUAL_SEQUESTRATION_MT` because both happened to
  be integers; the net basis gives 2,546.2, and a board-facing target must not
  carry a tenth of a tonne. Both baselines are now derived and rounded, and
  the guard asserts the baseline *tracks* the canonical total rather than
  reproducing its floating-point tail.

Not swept, deliberately: `5.07` in the BMS exports is a kWh meter reading, and
`1682-1725` in the AP history content is Peter the Great.

Suite 1,957 → 1,958.

## Phase 475 — interpolation protects the number, not the claim about it

Phase 474 repriced the sink and every interpolated figure followed correctly.
Four surfaces then went on asserting, **in words**, that the adopted value was
"the top of a 4-method spread" — which had stopped being true the moment it
moved. The interpolated range updated itself *inside the sentence claiming the
adopted figure was its maximum*, so /sinks-os read:

> 1,829 **is the top of** a 4-method spread running 1,000–2,100

The numeric residual gate came back clean, because there was no stale number to
find. That is the whole lesson: **deriving a figure protects the figure; the
sentence around it usually also makes a claim about where that figure sits, and
that claim is still a literal.**

Fixed on `PeerComparison` (both copies of the note), `LearnAgent`, `Sinks2` and
`Sinks`, each now stating a relation the data actually encodes — *above its
central of X, because the other methods average in harvested acres and this
woodlot is not harvested* — rather than a rank that silently rots.

Also caught: `/sinks` still quoted the per-acre band as **1.9–4.2**, the
pre-reprice rates, as a literal. It is now derived from the stand table
(1.2–3.0), which is the kind of number a reprice cannot otherwise reach.

*Both of my new guards were wrong first, in the usual direction.* The
positional regex flagged "Even at the top of the published spread the forest
offsets X% of gross" — a true statement about the spread, not a claim about the
adopted figure. And the rate-band assertion flagged **my own comment**
explaining what the band used to be: the fifth time this run that replacement
text restated the string its guard forbids. Both now skip comment lines —
comments explain, they do not teach, the distinction `proseFigures.test.js`
already draws.

Suite 1,958 → 1,960.

## Phase 476 — task #18 was not a choice between sources

`TRIP_MT_BY_REGION` prices a study-abroad or faculty trip by destination
region, and printed its own method beside itself: *"DEFRA 2024 long-haul
economy × great-circle distances from BOS."* It then disagreed with that
method by up to 42%.

| region | stated | its own method implies |
| --- | --- | --- |
| europe | 3.2 | **2.25** |
| asia | 4.0 | **4.57** |
| other | 3.3 | **3.93** |

**That 2.25 is the "2.25 vs 3.2" of task #18** — which had sat open as a
decision between two published figures. It is not one. There is only ever one
Europe number in the repo; the other side of the comparison is what the
printed method computes to. BOS↔Europe great-circle averages ~3,500 mi each
way across LHR/CDG/FRA/MAD/ZRH, and 3,500 × 2 × 0.322 kg = 2.25 mt.

**How it got there.** Phase 404 rescaled the whole table by 0.322/0.241
because the old values sat on a factor matching no published DEFRA row. That
fixed the *factor* and left the implied *distances* untouched — so the rescale
carried the original error forward, 2.4 → 3.2, rather than correcting it. A
rescale preserves whatever was wrong underneath it.

Values are now computed from stated one-way distances and the canonical
`ef_air_long` factor, so the method and the number cannot drift apart again.
The rendered method string interpolates them too.

**This is not a blanket cut.** Europe falls 30%, but Asia rises 14% and the
catch-all rises 19% — the table was wrong in both directions, which is what
you expect when distances rather than the factor are the problem.

Scope is contained: this table prices only live admin-entered study-abroad and
faculty rows, so no published headline moves today. It corrects what those
rows will cost when real trip data arrives.

`other` remains a genuine catch-all and is the honest weak point — its members
run from 1.7 mt (Bogotá) to 6.5 mt (Sydney), so the mean is a placeholder and
the basis says so.

Suite 1,960 → 1,965; 137 → 138 files.

## Phase 477 — disclose the whole portion table, not the one comparison

`PORTION_RECONCILIATION` published the beef gap honestly: dining prices a beef
serving at 9.95 kg (implying 100 g) while the footprint tool states 150 g and
prices it at 15 kg. What it did not say is that the table carries **three
distinct portion sizes across six categories**, derived here from the canonical
per-kg factors rather than asserted:

| | per serving | ÷ per kg | implies |
| --- | --- | --- | --- |
| beef | 9.95 | 99.5 | **100 g** |
| vegetarian (eggs) | 0.47 | 4.7 | **100 g** |
| pork | 2.46 | 12.3 | 200 g |
| chicken | 1.98 | 9.9 | 200 g |
| fish | 2.72 | 13.6 | 200 g |
| vegan (legumes) | 0.33 | 1.0 | **330 g** |

**Same cause as task #18.** Phase 405 rescaled each row by its own protein's
correction ratio, which by design "preserves whatever portion size was
originally assumed rather than re-guessing it". That is the right instinct for
a factor refresh and the wrong outcome here: it carried three inconsistent
portion assumptions forward intact. A rescale preserves whatever is wrong
underneath it — twice now in this codebase.

**And it now says what reconciling would cost**, which is the thing a reader
needs in order to judge whether the open decision matters. Beef is ~68% of the
menu's emissions, so a uniform portion raises this page's total either way:
**+27% at 150 g** (the size the footprint tool already states) or **+70% at
200 g** (what three of the four meats already imply).

Nothing was repriced — the gate asserts the adopted figures are untouched and
that the new fields are derived rather than typed. `standardisePct` is
computed lazily because `PORTION_RECONCILIATION` is declared above
`diningMenuItems`, and running it at module init hit the temporal dead zone.

*I miscounted my own finding first* — the header said four portion sizes when
there are three distinct values across six categories. Caught by writing the
assertion as `distinctPortionSizes === new Set(...).size` rather than pinning
a number I had counted by eye.

Suite 1,965 → 1,969; 138 → 139 files.

## Phase 478 — a swap cannot save the whole of the thing it swapped

The /dining menu scenarios publish an annual reduction each, rendered as the
headline number of the scenario card. Three of the four are beef scenarios,
and none reproduced from the menu data sitting beside them on the same page.

**A swap that counted its replacement as zero.** *"Beef → chicken 50% swap —
swap half of beef entrées for chicken; preserve protein servings"* was
credited with **229 mt**, the entire footprint of the beef removed. The
chicken that replaces it still emits 1.98 kg a serving against beef's 9.95, so
the saving is ~80% of what was removed, not 100%. That is wrong on its face,
independent of any base: you cannot save all of a serving you replaced with
another serving.

**A rescaled base.** Phase 415 rescaled these totals by the beef-factor
correction (×1.658) because Phase 405 had moved `factorPerServing` and left
them hardcoded — the comment says as much, and that the file "disagreed with
itself for ten phases". Re-anchoring the level kept the implied beef base,
which works out near 460 mt/yr against the ~386 mt/yr the menu actually
carries.

| scenario | was | now |
| --- | --- | --- |
| Meatless Mondays | 63 | **51** |
| Cut beef 20% | 93 | **74** |
| Beef → chicken 50% swap | 229 | **155** |
| 50% local produce | 12 | 12 (own basis, untouched) |

Each beef scenario now declares what replaces the beef it removes, and the
reduction follows from `base × share × (1 − replacement/beef)`. The
local-produce scenario is a procurement-distance saving with no beef term, so
it is explicitly left alone rather than swept into the same rule.

**Third instance of one pattern, and it now has a name.** Task #18 (trip
distances), task #21 (dining portions) and this all failed the same way:

> A rescale preserves whatever is wrong underneath it.

Each time, a factor was corrected and the quantity it multiplied was left
carrying the original error — which is exactly what rescaling is *for* when
the underlying quantity is sound, and exactly what makes it dangerous when it
is not. The fix in all three was the same: derive the quantity from its stated
basis instead of scaling the symptom. Phase 470's sweep looked for arithmetic
that did not compute; this pattern is arithmetic that computes perfectly from
a premise nobody re-checked.

Suite 1,969 → 1,974; 139 → 140 files.

## Phase 479 — one serving size, stated once (task #21)

Adopted: **150 g**, and every per-serving food figure in the dashboard is now
its Poore & Nemecek per-kg factor multiplied by that portion.

| | was | now |
| --- | --- | --- |
| beef | 9.95 (100 g) | **14.92** |
| pork | 2.46 (200 g) | **1.84** |
| chicken | 1.98 (200 g) | **1.49** |
| fish | 2.72 (200 g) | **2.04** |
| vegetarian / eggs | 0.47 (100 g) | **0.70** |
| vegan / legumes | 0.33 (330 g) | **0.15** |

150 g because it is the figure `personalFootprint.js` already documented, and
it sits in the served range (USDA reference portion for cooked meat is 85 g; a
dining-hall serving is typically 113–170 g). Beef lands on 14.92 — which is
exactly what the tool's "call it ~15" was rounding. **The tool was right and
the dining table was the outlier**, which is not what the open question looked
like from the outside.

`STANDARD_SERVING_KG` lives in `emissionFactors.js`, beside the per-kg factors
it multiplies, so a per-serving figure is never typed again. The dining table
and the footprint tool now read the same helper and cannot disagree about what
a serving is; `PORTION_RECONCILIATION.aligned` is true.

**Two things fell out of standardising that were invisible before.**

The beef→chicken swap scenario saves **90%** of the beef it removes, not 80%.
That 80% was itself an artefact of pricing beef at 100 g and chicken at 200 g —
at a consistent portion the ratio is simply the per-kg one, 9.9/99.5. Phase 478
fixed the swap's *logic*; this fixed the inputs it was reasoning over. The test
now checks that share against the per-kg factors, an independent route from the
per-serving table the scenario uses.

And the menu's annual beef rose 386 → 579 mt, which is the +27% this page was
always going to cost. Both scenario totals and the page total moved with it
because everything downstream was already derived — nothing needed chasing.

*Phase 477's test had to be rewritten*, since it guarded the disclosure of an
*unreconciled* table. It now pins the settled state and keeps the diagnostic
that found the problem, with a negative control proving the diagnostic would
still catch a category drifting back off the convention.

*One of my own guards was wrong again*: the implied-grams diagnostic divides a
2-decimal per-serving figure back out and landed on 149/150/151 for what is one
150 g convention. Bucketed to 5 g — enough to kill the double-rounding artefact,
nowhere near enough to hide a real 100-vs-200 split.

Suite 1,974 → 1,979; 140 → 141 files.

## Phase 480 — the figure task #12 was going to adopt was mislabelled

Before repricing purchased goods I checked the arithmetic behind the number I
was about to adopt. It does not hold.

The Phase 404 audit measured the four sectors the 0.40 factor claims to
average, against EPA Supply Chain v1.3:

| sector | kg CO₂e/USD | commodities |
| --- | --- | --- |
| Paper (322) | 0.537 | 11 |
| Computers & electronics (334) | 0.096 | 24 |
| Soap & cleaning (3256) | 0.315 | 4 |
| Apparel (315) | 0.120 | 7 |

and recorded **"unweighted mean 0.222"**. It is not. The unweighted mean of
those four is **0.267**. 0.222 is approximately the **commodity-count-weighted**
mean (0.224) — and counting NAICS-6 codes is a meaningless weight for a spend
basket, because the number of commodity codes in a sector says nothing about
what a school buys.

That mislabel had propagated: into the task list, into my own notes, and into
the summary I gave as "the unweighted mean of the relevant sectors is 0.222". I
repeated it without checking, which is precisely the failure this project keeps
finding in everyone else's text.

**The adopted 0.40 is still indefensible, and now quantifiably so.** It sits
above three of the four sectors it claims to average. Reaching it needs a
basket about **62% paper**, while the same note describes the basket as
"dominated by electronics and apparel" — the two lowest of the four.

**Nothing was repriced.** The gate asserts the factor is still 0.40 and gross
still 4,375. The sector means are an internal audit result that has not been
checked against the EPA file, and the $3M spend they multiply is itself a
placeholder; both are load-bearing for a ~10% move in gross, so they get
verified first. The sector table, the two candidate weightings and the implied
paper share are now published as data and rendered on /scope-3.

*The reachability rule earned its keep.* `liveDataWiring` discovers every
`*_RECONCILIATION` export in `data/` and requires a page to import it — so the
new object was flagged as an orphan the moment it existed, exactly as Phase 448
intended when it replaced three hardcoded assertions with a sweep.

Suite 1,979 → 1,984; 141 → 142 files.

## Phase 481 — an accessibility sweep that reported 31 and meant 1

Broadening past the carbon data, I swept every page and component for `<svg>`
elements carrying no `aria-*` or `role`. It reported **31**. After opening each
one, **one** was real.

The four false-positive classes, all invisible to a regex over JSX:

- **Prop spreads** — `<svg {...svgProps(p)}>`, where the icon library already
  sets `'aria-hidden': true` inside the helper. That was 22 of the 31.
- **Comments** — a line reading `// createSvgTag returns a complete
  <svg>...</svg> string` matches happily.
- **`aria-hidden` ancestors** — three icons sit inside a parent
  `<span aria-hidden="true">`, which hides the whole subtree.
- **`<text>` children** — the Goals progress ring renders its percent as an SVG
  `<text>` node, and the load-duration curve labels its own p10 and base-load
  lines. Both already announce.

The one real defect was a 14×8 legend swatch in `Scope2BmsInsights` drawing a
dashed line next to the words "Cumulative Year 1 total" — decoration beside its
own label, now `aria-hidden`.

**The part worth keeping is what I nearly did instead.** The obvious fix for an
"unlabelled chart" is `role="img"` plus a summary label. `role="img"` makes an
element a *leaf* for assistive tech: descendants stop being exposed. The scope
donut's `<path>` segments each already carry
`aria-label="Scope 1 — direct: 1,350 mtCO₂e (31%)"`, and adding `role="img"` to
its wrapper would have destroyed every one of them — in the name of
accessibility. Same for any chart with `<text>` labels inside.

So no blanket rule was applied, and **no guard was added**. A test encoding
"every svg is hidden or labelled" would have to understand spreads, ancestors,
comments and children; the naive version is exactly the sweep that just
over-reported thirty-fold, and a guard that cries wolf is worse than none.

The honest headline: this codebase's accessibility is in good shape — 180
aria-labels, 75 roles, zero images without alt, four `<div onClick>` — and the
survey's value was confirming that rather than finding work.

*Fourth over-reporting sweep of the session.* Opening every hit before acting
is what kept a regression out of the build.

Suite unchanged at 1,984.

## Phase 482 — the evidence reversed the conclusion, and I had already shipped the wrong one

Phase 480 published, on /scope-3, that the 0.40 purchased-goods factor "sits
above the sectors it claims to average" and that reaching it needs a basket
~62% paper. Both are still arithmetically true of the recorded sector means.
Both were also one-sided, and they were live.

Two things were missing, and they point the other way.

**What peers actually use.** Each recomputed here from the spend and emissions
its own source states, not quoted:

| | | kg CO₂e/$ |
| --- | --- | --- |
| U-Michigan, all PGS | FY2020 | 0.240 *(bounds 0.133–0.449)* |
| UC Berkeley (Doyle) | FY2009 | 0.258 |
| Oregon University System | FY2008 | 0.380 |
| MIT (Perlman), material goods only | FY2016 | 0.420 |
| MIT, university-sector code | FY2016 | 0.283 |
| WRI / USEEIO higher-ed sector | 2017 | **0.332** *(published directly)* |

Four institutions, three databases, landing at **0.24–0.42** and bracketing the
published higher-education sector factor. **KUA's 0.40 is inside that band.
The 0.267 and 0.224 candidates sit at or below its bottom.**

**The price basis.** EPA publishes every factor twice — without margins, what a
producer receives, and with margins, what a buyer pays. Spend-based accounting
needs the second. EPA's own worked example (Office Furniture 337214) goes 0.216
→ 0.305, a ratio of **1.41**; applying that to the four recorded means moves
their average from 0.267 to **0.377**, next door to the adopted figure. So the
gap is most likely a *price basis*, not an inflated factor.

That ratio is **recorded, not applied** — one worked example is not a
correction factor, and margins vary far more for retail-heavy goods than for
bulk materials. `priceBasis.applied` is `false` and the gate asserts it.

**Recommendation reversed: do not reprice this downward.** Reweighting numbers
whose price basis is unknown would move a published figure onto worse
information than it currently rests on. Settling it needs the EPA
purchaser-price column confirmed and KUA spend mapped to sectors.

*Twice wrong on one task.* First I repeated "the unweighted mean is 0.222"
without checking the arithmetic (Phase 480 caught it: it is 0.267). Then, having
caught that, I still framed the result as a one-sided case for cutting — because
I checked that the sectors sat below 0.40 without checking whether they were on
the same price basis, or what anyone else uses. The first error was arithmetic;
the second was exactly the "don't overclaim from true numbers" failure, with
every individual number correct.

Suite 1,984 → 1,989; 142 → 143 files.

## Phase 483 — every page renders, and now something checks that

The one verification this project never had: does a page *render*. Not "is it
correct" — the other 143 test files are for that — but does a reader who clicks
the link get a screen instead of a blank one.

Phase 439 shipped a `ReferenceError` to production because `export { x } from
'y'` forwards to consumers without creating a local binding. The suite was
green: that phase's tests asserted on **source text** and never invoked
anything, and no test mounted the page. It reached production and stayed there
until the next phase went looking.

**119 page files. Fifty were mounted by some test. The other sixty-nine could
throw on first paint with the whole suite green.** Now every module under
`pages/**` whose default export is a component gets mounted, with the same
Supabase harness the other render tests use and a wildcard route so pages that
read params get one.

**All of them render.** The only modules that came back were seven colocated
helpers — `useTable`, `useFactor`, `formStyles`, `RecordsTable`, `PeriodNote`,
`PreviewBanner`, `_shared` — which are hooks, styles and sub-components living
next to the screens that use them, not pages. They are skipped by the rule "a
page is a module whose default export is a component", and the skip list is
*counted and capped at 12* so it cannot quietly grow to swallow real pages.

**The control matters more than the pass.** I broke `Faq.js` with a
render-time `ReferenceError` — the exact Phase 439 shape — and the test
returned `"../pages/Faq.js — render threw: __deliberatelyUndefinedForControl
is not defined"`, naming the page and the cause. Restored, green. A guard I had
not watched fail would have been worth nothing.

Three assertions keep it from passing vacuously: zero failures, **more than 100
pages actually mounted**, and the skip list under 12. If the glob ever breaks,
the count fails rather than the loop quietly finding nothing.

*Why this instead of a browser.* The intent was to load the deployed site and
look for runtime errors. The local Playwright profile is held by another
session and the cloud browser is unauthenticated — but a one-off browser check
would have proved it once, on one page, on one day. This proves it for every
page, on every run, forever. The blocked path turned out to be the worse one.

Test-only: no rendered output changed, so there is no runtime marker to verify
in the bundle.

Suite 1,989 → 1,991; 143 → 144 files.

## Phase 484 — read the source, and it corrected me again

Three research agents had died trying to answer one question: which EPA column
the purchased-goods sector means came from. So I fetched the methodology
document and read it.

**Wesley Ingwersen, "About the Supply Chain Greenhouse Gas Emission Factors
v1.2 NAICS-6 Datasets", USEPA, 12 April 2023.** Verbatim:

> "The dollar in the denominator of all factors uses purchaser prices in 2021
> USD."

**All three factor types share a purchaser-price denominator.** Margins are not
a price basis — Margin Emission Factors add, in the *numerator*, the emissions
of the trade and transport industries that move a good from producer to buyer.

Which makes Phase 482's explanation wrong, on a live page. I had written that
"without margins" is a producer price and "with margins" a purchaser price, and
that the sector means looked low because they were on the wrong side of that
split.

**And the correction is much smaller than I implied.** EPA's Table 1 puts the
mean margin at **0.0282** kg CO₂e/USD, max 0.270, and states margins are
"non-zero for 45% of commodities" — zero for the other 55%. The Office Furniture
example I generalised from carries a margin of 0.089, **over three times the
mean**. Adding a typical margin moves the four sectors from ~0.267 to **~0.295**,
not the 0.377 I published. Margins do not close this gap.

**The conclusion survives; its support changed.** "Do not reprice" now rests on
the peer band alone — four institutions across three databases at 0.24–0.42,
bracketing the published higher-education sector factor of 0.332. And against
EPA's own v1.2 distribution the adopted 0.40 sits between the median (0.208) and
the third quartile (0.4483) of all 1,016 commodities: high, but not the "near the
80th percentile" the older comment claimed.

*Version honesty.* The code cites v1.3; only v1.2 was retrievable, so every
distribution figure is labelled v1.2 rather than passed off as current. The
structural statements — three factor types, purchaser-price denominator, Scope 3
Cat 1 intent — carry across versions. I did **not** "correct" the code's 2022
USD / AR5 citation to v1.2's 2021 USD / AR4, because those are version-specific
and I could not verify v1.3.

*Phase 482's test had to be updated*, because it asserted the 1.41 ratio — a
test encoding a claim I later found to be wrong. It now asserts the ratio is
**gone**.

**Three agents failed at this; one `curl` and `pdftotext` settled it.** When the
question is "what does this document say", fetching the document beats
delegating the reading of it.

Suite 1,991 → 1,997; 144 → 145 files.
