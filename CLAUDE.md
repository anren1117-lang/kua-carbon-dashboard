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

Vitest. 996 tests across 60 files (every routed page has at least a mount-smoke test as of Phase 200; every /api/* handler, all of src/utils/, src/storage/, src/adapters/meter/, security-critical components, localStorage state stores, trajectory math, news + alert pipelines all under direct test):

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
- Emission factors live in `src/data/scopeTotals.js` (Scope 1/3 + sinks + renewables) and `src/data/gridMix.js` (Scope 2). Admin forms in `src/pages/admin/*` read these via `useFactor` / `useTable` from `_shared.js`.
- API handlers use `createRateLimit` + `getClientKey` from `src/utils/rateLimit.js` — token-bucket per IP. Mirror existing handlers when adding new ones.
