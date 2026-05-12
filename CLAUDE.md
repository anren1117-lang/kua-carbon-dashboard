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

## Tests

Vitest. 362 tests across 15 files:

- `src/__tests__/dataLayer.test.js` (130) — composer math: Scope 1/3 + sinks + renewables + per-component helpers (compose*Mt + composeSolar/Geothermal/WindFromRecords).
- `src/__tests__/apiRoutes.test.js` (91) — every `/api/*` handler incl. admin auth flow (login 503/400/401/200/429, token verify, expired/tampered/fresh) + audit-log GET pagination/filter params.
- `src/__tests__/useMeasuredScope.test.js` (23) — render-hook tests for useMeasuredScope1/3/Sinks/Renewables + scope3CohortDetail passthrough.
- `src/__tests__/freshness.test.js` (21) — daysSince + cadence-aware freshnessBucket buckets.
- `src/__tests__/csv.test.js` (16) — toCsv + parseCsv round-trip + RFC-4180 escaping + downloadCsv plumbing.
- `src/__tests__/adminFetch.test.js` (13) — token-expiry detection in the browser fetch wrapper.
- `src/__tests__/csvValidators.test.js` (33) — the 7 CsvImportPanel validators.
- `src/__tests__/auditLogPaging.test.js` (6) — fetchAllAuditLog progress + maxRows ceiling + error short-circuit.
- `src/__tests__/measuredCache.test.js` (6) — promise-cache dedupe + invalidate.
- `src/__tests__/FreshnessAlert.test.js` (9) — AdminHome banner severity + grammar + link target.
- `src/__tests__/Renewables.test.js` (4) — public /renewables measured-flip rendering.
- `src/__tests__/Goals.test.js` (3) — provenance pill flip on Goals.
- `src/__tests__/Executive.test.js` (3) — cohort row + ScopeRow pills.
- `src/__tests__/ErrorBoundary.test.js` (3) — fallback rendering on caught errors.
- `src/App.test.js` (1) — top-level smoke test.

When adding a measured-data path, mirror the existing test shape: empty/null fallback, math sanity, skip-invalid-row, factor-table exposure, round-trip with the placeholder version.

## Conventions

- Styling is done with inline `style={{...}}` objects and a small `App.css`. There is no CSS framework, no component library, and no shared style module — matching the existing inline-style patterns is fine.
- Emission factors live in `src/data/scopeTotals.js` (Scope 1/3 + sinks + renewables) and `src/data/gridMix.js` (Scope 2). Admin forms in `src/pages/admin/*` read these via `useFactor` / `useTable` from `_shared.js`.
- API handlers use `createRateLimit` + `getClientKey` from `src/utils/rateLimit.js` — token-bucket per IP. Mirror existing handlers when adding new ones.
