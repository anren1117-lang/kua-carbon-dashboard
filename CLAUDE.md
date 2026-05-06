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

1. **Pure helper** in `scopeTotals.js`: `composeScope1FromBills(bills, opts?)`, `composeScope3FromRecords(records)`, `composeSinksFromActuals(rows)` — take Supabase rows, return same shape as the placeholder composer with `provenance: 'measured'` when rows are present, fallback to placeholder when empty. Also: `composeFleetMt`, `composeRefrigerantMt` for the Scope 1 sub-components.
2. **Per-scope hook** in `src/hooks/`: `useMeasuredScope1()`, `useMeasuredScope3()`, `useMeasuredSinks()` — fetch from Supabase on mount, apply helper, return `{ totalMt, breakdown, provenance, loading, error, measured }`. Each tolerates "table doesn't exist" by falling back to the placeholder so the dashboard still renders before the migrations are applied.
3. **Composer hook**: `useMeasuredScopeTotals()` returns measured-or-fallback for ALL scopes + sinks + gross/net so consumers (Executive, Goals, NetEstimate, AdminHome, AdminDataQuality) read one consistent measured-aware view.

Pages already wired to live data:
- `Scope1.js` → `useMeasuredScope1()`
- `Scope3.js` → `useMeasuredScope3()`
- `Sinks.js`, `Sinks2.js` → `useMeasuredSinks()`
- `Executive.js`, `Goals.js`, `NetEstimate.js`, `AdminHome.js`, `AdminDataQuality.js` → `useMeasuredScopeTotals()`

When adding a new measured-data table to Supabase, follow the same pattern: helper in scopeTotals.js, hook in src/hooks/, wire to the page that displays it. Each component flips estimated → measured independently — it's fine to have heating measured + fleet still estimated, etc.

### Supabase tables (canonical)

`fuel_bills`, `day_students`, `us_boarding_students`, `international_students`, `study_abroad`, `faculty_travel`, `waste`, `scope1_fleet_records`, `scope1_refrigerant_logs`, `forest_stand_actuals`, `admin_audit_log`. Migrations in `supabase/migrations/`. `AdminPortal.fetchAllData` pulls the original 7; the live-measured hooks pull the rest as needed.

### Admin audit log + CSV export/import

Every successful admin write through `AdminPortal.js` fires `logAdminWrite()` (`src/utils/adminAudit.js`) → `POST /api/admin/audit-log`. Reads via `GET /api/admin/audit-log` (paginated, optional `table` + `dateFrom` / `dateTo` filters) surface in the `/admin/audit-log` viewer page. The endpoint passes through to the same anon Supabase client the rest of the dashboard uses; the bearer-token gate IS the auth boundary, not RLS. No service-role key required.

CSV utilities live in `src/utils/csv.js`: `toCsv(rows, columns?)` for export (RFC-4180 escaping, JSON-stringifies jsonb), `parseCsv(text)` for import (single-pass tokenizer; returns `{ rows, columns, errors }`). Bulk-import UIs are wired into the fuel + waste tabs of `AdminPortal.js` — paste CSV → preview + per-row validation → batch insert + audit log entry.

### Admin auth (server-checked)

The `KUA2026` literal compare on the client is gone. The flow is now:

1. `POST /api/admin/login` with `{ password }` — server compares timing-safe against `process.env.ADMIN_PASSWORD`. Rate-limited 6 attempts/IP.
2. On success, returns `{ token, expiresAt }`. Token is HMAC-SHA256 signed via `process.env.ADMIN_TOKEN_SECRET` (32+ chars), payload `{ iat, exp, role: 'admin' }`, 8h TTL.
3. Client stores the blob in `localStorage.kua_admin_session` and sends `Authorization: Bearer <token>` on every admin API call (use `adminFetch()` from `src/utils/adminFetch.js`).
4. Server-side admin endpoints call `verifyAdminRequest(req)` from `src/utils/adminToken.js` and 401 on missing/expired/tampered tokens.

**Required env vars to make admin auth work in production:**
- `ADMIN_PASSWORD` — the secret password admins type into the gate
- `ADMIN_TOKEN_SECRET` — 32+ random bytes (`openssl rand -hex 32`) used to sign tokens

Without them, `/api/admin/login` 503s and `/api/admin/estimate-action` + `/api/admin/plan` 401 on every request.

### Admin entry points

`AdminPortal.js` is the legacy single-file Supabase CRUD UI (still routed at `/admin/legacy`). Day-to-day admin entry now happens through the per-scope pages under `/admin/scope-1`, `/admin/scope-2`, `/admin/scope-3`, etc. The old per-table singletons (`AdminFuel.js`, `AdminStudents.js`, `AdminTravel.js`, `AdminWaste.js`) were deleted in Phase 12b — modify the per-scope pages or `AdminPortal.js` instead.

## Tests

Vitest. ~240 tests across:
- `src/__tests__/dataLayer.test.js` — pure data-layer + composer helpers (composeScope1FromBills, composeScope3FromRecords, composeSinksFromActuals, composeFleetMt, composeRefrigerantMt, geographic estimates, hotspots, canonical-arithmetic invariants).
- `src/__tests__/apiRoutes.test.js` — all `/api/*` handlers including admin auth flow (login 503/400/401/200/429, token verify, expired/tampered/fresh) + audit-log GET pagination/filter params.
- `src/__tests__/useMeasuredScope.test.js` — render-hook tests for useMeasuredScope1/3/Sinks with mocked Supabase.
- `src/__tests__/adminFetch.test.js` — token-expiry detection in the browser fetch wrapper.
- `src/__tests__/ErrorBoundary.test.js` — fallback rendering on caught errors.
- `src/__tests__/csv.test.js` — toCsv + parseCsv round-trip + RFC-4180 escaping + downloadCsv plumbing.
- `src/App.test.js` — top-level smoke test.

When adding a measured-data path, mirror the existing test shape: empty/null fallback, math sanity, skip-invalid-row, factor-table exposure, round-trip with the placeholder version.

## Conventions

- Styling is done with inline `style={{...}}` objects and a small `App.css`. There is no CSS framework, no component library, and no shared style module — matching the existing inline-style patterns is fine.
- Emission factors and grid-mix numbers are duplicated between `App.js` (display) and `AdminPortal.js` (data entry). If you change one, check whether the other needs the same update.
- API handlers use `createRateLimit` + `getClientKey` from `src/utils/rateLimit.js` — token-bucket per IP. Mirror existing handlers when adding new ones.
