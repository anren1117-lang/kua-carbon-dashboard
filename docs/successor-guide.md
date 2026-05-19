# KUA Carbon Dashboard — Successor Guide

**Audience:** The KUA student (or faculty member) who picks this up after the original capstone author graduates.

**Goal:** Get you to the point where you can keep the dashboard alive, refresh data when it lands, and ship one new feature on your own — without breaking anything.

**Time budget:** One afternoon to read this guide + browse the codebase. After that you should be productive.

---

## 1. The five-minute orientation

This is a React + Vite frontend + Vercel serverless backend. It deploys automatically from the `main` branch of [github.com/anren1117-lang/kua-carbon-dashboard](https://github.com/anren1117-lang/kua-carbon-dashboard) to [kua-carbon-dashboard.vercel.app](https://kua-carbon-dashboard.vercel.app).

**There is no separate staging environment.** Every commit to `main` lands in production within ~60 seconds. The safety net is `npm test` — 1,108+ tests covering every page mount, every utility function, every API handler. If those pass, you're 95% safe.

**There is no traditional backend database the public site queries.** All the "data" — emission factors, building registry, monthly BMS captures, forest stands — lives as JavaScript modules under `src/data/`. The dashboard reads them at build time. The only runtime backend is the admin-only Supabase tables for writes (`fuel_bills`, `scope3_*`, etc.).

**Most pages are static.** A handful (admin pages, `/news`, `/admin/plan-agent`) call Vercel serverless functions in `api/`. The rest are pure client renders.

---

## 2. Set up your local environment

```bash
git clone git@github.com:anren1117-lang/kua-carbon-dashboard.git
cd kua-carbon-dashboard/src
npm install
npm run dev   # http://localhost:5173
```

That's it. You can browse the entire dashboard locally with no environment variables. The pages that need API keys (AI ingestion, plan agent, news) will gracefully degrade to empty states without them.

If you want to test the AI features, copy `.env.example` to `.env.local` and add your `ANTHROPIC_API_KEY`. **Never commit `.env.local`.**

**Test command:**

```bash
cd src
npx vitest run     # full suite, ~5 seconds
npx vitest         # watch mode
```

**Build command:**

```bash
cd src
npx vite build
```

If both pass, Vercel will deploy successfully when you push.

---

## 3. The four files that matter most

If you understand these four files, you understand the dashboard:

1. **`src/data/scopeTotals.js`** — Single source of truth for the headline scope totals. Every page that displays "KUA's emissions are X mt" imports from here. `composeScope1()`, `composeScope3()`, `SCOPE1_TOTAL_MT`, `SCOPE3_TOTAL_MT`, `GROSS_MT`.

2. **`src/data/gridMix.js`** — Scope 2 composer. Reads `COMPOSED_YTD_KWH` from `composedYtd.js`, multiplies by ISO-NE 2024 per-fuel factors, exports `GRID_MIX_ANNUAL_MTCO2E`.

3. **`src/data/monthlyConsumption.js`** — Raw BMS captures from the on-campus Distech Eclypse dashboard at `10.1.1.27`. One entry per captured month. **This is the file you'll edit most often** — each new month adds one entry here.

4. **`src/components/Layout.js`** — Top-level shell: header, nav, footer, command palette, toast host, route progress bar. Adding a new public page means: create the page, add a `<Route>` in `src/index.js`, add a link in the right place in `Layout.js`.

Read those four end-to-end before you change anything.

---

## 4. Where each piece of data comes from + how to refresh it

| Data | Source | How to refresh |
|---|---|---|
| **Monthly BMS captures (Scope 2)** | Distech Eclypse "All Meters" page at `10.1.1.27` on the KUA network | Each month: visit the page, copy the master-meter `displayedTotal` + per-building submeter rows, append a new entry to `monthlyConsumption.js`. Total elapsed time: ~5 minutes. |
| **High-resolution BMS export** | Distech "Meter Trends" CSV export, full per-meter hourly history | When you want to extend the time-series detail, run `node scripts/parseBmsExport.mjs <path-to-csv>` and commit the resulting `src/data/bmsExportApr2026.js` (rename to reflect the new period). |
| **YTD snapshot** | `envysionSnapshot.js`, captured 2026-05-03 | Update by re-reading the same Distech page on a new date. Replace `SNAPSHOT_AS_OF`, `SNAPSHOT_DAYS_INTO_YEAR`, and the per-building `energyUsedKwh` array. |
| **Heating fuel (Scope 1)** | KUA Facilities annual fuel-delivery invoices (heating oil + propane) | Once integrated: enter via `/admin/scope-1/heating-oil` form. Or use the AI ingestion agent: drag a PDF invoice into `/admin/ai-ingestion`. The Supabase `fuel_bills` table flips this from estimated to measured. |
| **Fleet (Scope 1)** | KUA fuel-card statements for the 5 vehicles in the registry | Enter via `/admin/scope-1/fleet` once integrated. Each row = one fuel-card statement. |
| **Refrigerants (Scope 1)** | HVAC service reports (lb recharged − lb reclaimed) | Enter via `/admin/scope-1/refrigerants` per service event. |
| **Student travel (Scope 3)** | Travel office: international student departures + US boarder break-trip records | Three admin forms under `/admin/scope-3`: `StudentDay`, `StudentUSBoarding`, `StudentInternational`. |
| **Dining (Scope 3)** | Sodexo / SAGE monthly invoices, item-level | Currently the easiest path is to drop the invoice PDF into `/admin/ai-ingestion`. Will flow into `scope3_dining` Supabase table. |
| **Waste (Scope 3)** | Casella + KUA Composting + eWorks NH hauler invoices | Enter monthly via `/admin/scope-3/cat5-waste` once integrated. |
| **Purchased goods (Scope 3)** | Business Office annual spend report mapped to USEEIO sectors | Enter via `/admin/scope-3/cat1-purchased-goods` once mapped. |
| **Commuting (Scope 3)** | HR commute survey (home zip + days/week on campus per staff) | Once collected, enter via `/admin/scope-3/cat7-commuting`. |
| **Forest sinks** | A real forester walk-through inventory (currently hand-estimated) | Replace `forestStands` array in `src/data/sinks.js` once you have real per-stand acres + dominant species. |
| **Solar generation** | BMS submeters PM_15_RoofTopSolarFeed + PM_15_FieldSolarFeed + PM_19_SolarFeed | Two of the three feeds are currently broken (see `src/data/renewables.js` comments). Have Facilities investigate the CT clamps. The third feed updates automatically when BMS captures land. |
| **News (homepage)** | `/api/environment-news` calls Anthropic + web_search | Auto-refreshes every 24 hours. No manual action needed. |

---

## 5. The most likely things you'll need to do

Listed in order of probability. Each one has a "minimal change" recipe.

### 5a. Add a new month of BMS data

1. Visit `http://10.1.1.27` on the KUA network. Open "All Meters."
2. Copy the master-meter `displayedTotal` for the month (top of page) and every submeter row's monthly kWh.
3. Open `src/data/monthlyConsumption.js`. Copy the most recent month's entry as a template.
4. Replace the values; update `month`, `capturedAt`, `displayedTotal`, `sumOfRows`, and each `rows[].kwh`.
5. `npx vitest run` — should still pass.
6. Commit with message `Phase XXX: BMS capture for YYYY-MM` and push. Vercel will deploy.

### 5b. Add a new building photo

1. Save the photo as a JPG sized roughly 1200×900.
2. Put it at `src/public/buildings/<building_id>.jpg`. The `building_id` must match an `id` in `src/data/buildings.js` (`b_miller`, `b_kilton`, etc.).
3. No code changes. The photo will appear at the top of `/buildings/<id>` automatically. Vercel copies `src/public/*` to the site root at build.

### 5c. Refresh the headline-numbers snapshot

```bash
node scripts/captureHeadlineNumbers.mjs
```

Writes a new `docs/headline-numbers-YYYYMMDD.json`. Use after any data change to confirm `docs/capstone-results.md` prose still matches the codebase.

### 5d. Add a new page

1. Create `src/pages/MyNewPage.js`. Use an existing page as a template (`src/pages/Faq.js` is the simplest).
2. In `src/index.js`, add `const MyNewPage = lazy(() => import('./pages/MyNewPage'));` near the other lazy imports, and `<Route path="/my-new-page" element={<MyNewPage />} />` in the Routes block.
3. Add a link to it in `src/components/Layout.js` — either in `categoryItems` (Tools dropdown) or `moreGroups` (footer).
4. Add it to the smoke test sweep at `src/__tests__/publicPagesRender.test.js`.
5. `npx vitest run` — confirm the new test passes.

### 5e. Run the AI agent accuracy benchmark

1. Read `docs/ai-ingestion-benchmark.md`.
2. Collect 5–10 real KUA source documents (PII stripped).
3. Tag each in `src/data/aiIngestionBenchmark.js`.
4. `node scripts/runAiBenchmark.mjs` — writes results to `docs/` AND `src/public/`.
5. Visit `/admin/ai-accuracy` to see the results rendered.

### 5f. Update an emission factor

All factors live in `src/data/scopeTotals.js` (Scope 1/3 + sinks + renewables) or `src/data/gridMix.js` (Scope 2). Find the constant, change the number, add a one-line comment explaining the source + date.

**Important:** Add a corresponding update to `/methodology` (the public-facing citations page) so external reviewers can see what changed. The factor and the citation should always be in sync.

---

## 6. Architecture quirks to know

These will save you hours if you internalize them now.

**Project root vs. `src/`:** The repo's `package.json` at the root is stale (CRA boilerplate). The actual project is in `src/`. **Always `cd src/` before running any npm or vitest command.** This is the single most common gotcha.

**Inline styles, no CSS framework:** Every component uses inline `style={{...}}` objects. There is no Tailwind, no styled-components, no Emotion. A small `src/App.css` holds global rules + animation keyframes. Match the existing pattern when adding new components.

**Provenance taxonomy is sacred:** Every number has one of three provenance tags — `measured`, `cited`, `estimated`. The dashboard surfaces this with colored pills throughout. **Never write "measured" on a number that isn't from a real meter or invoice.** Default to `estimated` when in doubt.

**`prefers-reduced-motion` is respected everywhere.** Every CSS animation has a `@media (prefers-reduced-motion: reduce)` opt-out. Match this pattern when adding new animations.

**Lazy loading is universal:** Every page (except the homepage `App.js`) is `React.lazy()`-loaded. This keeps the initial bundle small. The cost is that you need to add a route in `src/index.js` for any new page; it won't auto-discover.

**Tests are smoke-tests for pages:** `publicPagesRender.test.js` and `adminPagesRender.test.js` just mount every page and assert it doesn't throw. This catches 95% of "I broke something" mistakes. If you add a page, add it to the sweep.

**Vite's `src/public/` → site root:** Files in `src/public/` get copied to the site root at build time. That's why the campus map image lives at `src/public/kua-campus-map.png` but is fetched at runtime from `/kua-campus-map.png`. Same pattern for building photos.

**Admin auth is HMAC-token-based:** Set the `ADMIN_PASSWORD` env var in Vercel. Login flows through `/api/admin/login` which signs an HMAC token; the browser stores it in localStorage. No Supabase user table needed.

**Supabase is optional:** Most admin tables have an in-memory write-through fallback so the admin UI works locally without Supabase credentials. Production reads + writes use Supabase via the `SUPABASE_URL` + `SUPABASE_ANON_KEY` env vars.

---

## 7. Things to avoid

- **Don't run `npm test` from the repo root.** It picks up the stale root `package.json` and fails confusingly. Always `cd src/` first.
- **Don't `git push --force` to `main`.** There's no staging environment; a force-push could destroy production state.
- **Don't bypass git hooks.** If `npm test` fails on a commit, fix the test — don't `--no-verify`.
- **Don't add a new dependency without thinking about bundle size.** The dashboard bundle is ~330 KB; doubling it would hurt mobile users. Look for lightweight alternatives first.
- **Don't put PII in `src/data/`.** That directory is open source on GitHub. No student names, no staff personal addresses, no credit-card numbers.
- **Don't claim "measured" for an estimated number.** Provenance integrity is the single most-load-bearing thing in this codebase. Faculty review depends on it.

---

## 8. When you graduate

Update `docs/successor-guide.md` (this file) with anything you wish someone had told you. Specifically:

- Any data sources that came online or went offline during your tenure
- Any system credentials / env vars you set up — leave a note for the next person on where they live (1Password, Vercel dashboard, KUA IT)
- Any bugs that bit you so the next person can avoid them

The repo is the artifact. If you write nothing else down, the next person will figure it out from `git log` — but two paragraphs of notes will save them an afternoon.

---

## 9. Where to start your first day

1. Read this guide (you're doing it).
2. Read `docs/user-guide.md` — understand the dashboard from a user's perspective before you start changing it.
3. Read `docs/capstone-results.md` — understand the research the dashboard was built to support.
4. Read `docs/spot-check-sheet.md` — understand what's measured vs. estimated.
5. Open `src/data/scopeTotals.js` and `src/data/gridMix.js` and `src/data/monthlyConsumption.js` and read them end-to-end. They're not long.
6. Visit the live dashboard at `kua-carbon-dashboard.vercel.app`. Click into every page in the top nav + Tools dropdown.
7. Press `⌘K` / `Ctrl+K` and try the command palette.
8. Sign in to `/admin` — credentials in 1Password or ask the previous maintainer.
9. Visit `/admin/data-quality` — see what's measured vs. estimated at a glance.
10. Pick one of the items in section 5 and do it.

Welcome to the project. The dashboard is solid; the next student's job is to keep the data flowing and add new measured records as KUA's data integrations mature. Not to add more features — there are plenty already.

---

## 10. Contact

The original capstone author left these contact points for the next maintainer:

- **GitHub issues:** [the repo](https://github.com/anren1117-lang/kua-carbon-dashboard/issues) — best place for technical questions
- **KUA Sustainability Committee:** [add contact when known]
- **KUA Facilities Director:** [add contact when known] — for fuel-delivery + BMS questions
- **KUA Business Office:** [add contact when known] — for procurement spend data
- **KUA Travel Office:** [add contact when known] — for student-travel records
- **Sodexo / dining services contact:** [add contact when known]

Fill these in as you learn them. The next person will thank you.

---

*Last updated alongside Phase 362. To extend, open a PR against `docs/successor-guide.md`.*
