# KUA Carbon Operating System

A React + Vercel app that turns the Kimball Union Academy carbon
dashboard into a complete OS for measuring, learning from, and acting on
campus emissions.

This directory is the Vite project. The repo root holds Vercel-side
config (`vercel.json`, `/api/`), the on-campus relay (`/relay/`), and
Supabase migrations (`/supabase/migrations/`).

---

## Quickstart

```bash
cd src
npm install
npm run dev       # http://localhost:5173
npm run build
npm run preview
npm test          # vitest — 362 tests (15 files)
```

Run the on-campus relay (separate process, talks to the BMS):

```bash
cd relay
node server.js    # http://localhost:3001
```

---

## Module map

The nav is structured into three groups, surfaced in the public Layout:

- **Top nav** — the audience-agnostic core (Overview, Executive, Hotspots, Plan, Buildings, Methodology, Report).
- **Categories dropdown** — every source-specific page (Dining, Transport, Waste, Procurement, Drawdown, Credits, Scenarios, the Scope-N detail pages, plus standalone Goals/Actions/Renewables/Sinks/Trends).
- **Right-side portals** — Learn, Ask, Teacher, Admin. Each is its own audience and its own UI pattern.

Every OS module reads from `src/data/` via the utilities in `src/utils/`,
and every meter-driven view goes through the adapter at `src/adapters/meter/`.

| Route               | Purpose |
|---------------------|---------|
**Public**
| Route               | Purpose |
|---------------------|---------|
| `/`                 | Public homepage (NetEstimate, scope donut, peer comparison, signposts) |
| `/executive`        | Executive Dashboard — top metrics from every module + carbon equivalents |
| `/report`           | Annual Report — printable trustee-facing summary |
| `/hotspots`         | Ranked highest-emitting buildings + categories with severity badges |
| `/plan`             | **Combined** — Goals & Targets + Reduction Actions, tabbed |
| `/buildings`        | All buildings, sortable; per-building drill-down with live API + CSV download |
| `/methodology`      | Methodology |

**Categories** (under the Categories dropdown)
| Route               | Purpose |
|---------------------|---------|
| `/dining`           | Meal-category emissions, supplier ranking, food-waste, menu-scenario picker |
| `/transportation`   | Fleet, carpool savings, air travel, school trips, faculty/staff commute mix |
| `/waste`            | Waste streams + diversion rate + monthly trend |
| `/procurement`      | Spend-based Scope-3 Cat-1 estimates by category |
| `/drawdown`         | **Combined** — Renewables + Sinks, tabbed |
| `/credits`          | Carbon credits |
| `/scenarios`        | What-if scenarios |
| `/scope-1` `/scope-2` `/scope-3` | Pre-existing scope-detail pages |
| `/goals` `/actions` `/renewables-os` `/sinks-os` `/trends` | Standalone routes still reachable |

**Teacher portal** (`/teacher` is the hub)
| Route               | Purpose |
|---------------------|---------|
| `/teacher`          | **Password-gated** portal home — cards + "my lessons" panel |
| `/teacher/create`   | **NEW** — paste source material OR upload a file (.txt, .md, .csv, .json, .pdf up to 5 MB); AI generates reading + 5 four-option questions; publish a `/lessons/:id` URL to share with class |
| `/teacher/lessons`  | Curated lesson modules, class progress, auto-generated discussion prompts |
| `/lessons/:id`      | **NEW** — student-facing lesson view (reading + quiz). Attempts log to `/api/quiz/attempts` |
| `/chatbot`          | Carbon Learning Chatbot (rule-based; LLM-grounded when API key set) |
| `/learn`            | Self-paced learning agent (multi-path quizzes) |
| `/challenges`       | Dorm-level student leaderboard (privacy-by-design, opt-in) |

**Admin & Ops portal** (`/admin` is the hub)
| Route               | Purpose |
|---------------------|---------|
| `/admin`            | Portal home — cards linking to Data Admin, Trends, the structured CRUD tree, and live record counts |
| `/data-admin`       | Adapter status, live health probe, CSV upload, factor registry, meter quality |
| `/admin/scope-1` `/scope-2` `/scope-3` `/renewables` `/sinks` `/methodology` `/framework` `/ai-ingestion` | Structured CRUD admin tree |
| `/admin/legacy`     | Original password-gated admin portal |
| `/ask`              | Free-form environmental Q&A (Anthropic API + web search) |

---

## Architecture

```
src/
├── data/                   Mock data + JSDoc-typed shapes. UI imports from here, never inlines.
│   ├── buildings.js        Building registry (sqft, occupants, hvac, bmsNumber)
│   ├── meters.js           Meter registry (one electricity meter per building + fuel masters)
│   ├── envysionSnapshot.js Point-in-time Envysion observations (kW, voltage)
│   ├── gridMix.js          ISO-NE 2024 system mix
│   ├── seasonalPatterns.js Day-of-week / month / hour shapes
│   ├── emissionFactors.js  kgCO2e per unit, with citations
│   ├── dorms.js            Dorm registry (joins to buildings.js)
│   ├── students.js         600 mock student profiles, hashed IDs only
│   ├── staff.js            110 mock staff profiles, hashed IDs only
│   ├── dining.js           Menu items, vendors, ingredient purchases, food-waste, scenarios
│   ├── transportation.js   Fleet, commute, carpool, school trips, air travel
│   ├── waste.js            Monthly waste streams
│   ├── procurement.js      Paper / IT / cleaning / apparel records
│   ├── renewables.js       Solar sites + monthly generation pattern
│   ├── sinks.js            Forest stands + soil samples + sequestration math
│   ├── targets.js          Reduction targets + linear-trajectory helpers
│   ├── reductionActions.js Action plans for the AI Carbon Advisor
│   ├── learningContent.js  Knowledge articles for the chatbot
│   ├── quizLedger.js       In-memory quiz attempts (write-through to Supabase)
│   └── index.js            Barrel export
│
├── adapters/meter/         Adapter pattern — every UI/API caller goes through here.
│   ├── MeterDataAdapter.js   Interface (JSDoc only)
│   ├── MockMeterAdapter.js   Working — deterministic from baselines + shapes
│   ├── CsvMeterAdapter.js    Working — reads/writes via readingsStore (memory + Supabase)
│   ├── BmsMeterAdapter.js    Working scaffold — Distech Eclypse REST API; needs env + relay
│   ├── UtilityApiMeterAdapter.js   Stub
│   └── index.js              Factory: getMeterAdapter() picks based on METER_SOURCE env
│
├── storage/
│   ├── supabaseServer.js   Lazy server-side Supabase client (service-role key)
│   ├── quizStore.js        Quiz attempts: memory + Supabase write-through
│   └── readingsStore.js    CSV-imported readings: memory + Supabase write-through
│
├── utils/
│   ├── emissions.js        quantityToKgCO2e, kgToMt, annualElectricityMt
│   ├── aggregation.js      sumBy, kwhByBuilding, allocateByGridMix, intensities
│   ├── anomaly.js          detectAnomalies (z-score, gap, flat, stale), qualityScore
│   ├── hash.js             hashUserId — privacy-safe ID generator
│   ├── comparison.js       percentChange, trendKind, yoyMonthly
│   ├── hotspots.js         buildingHotspots, rankActions
│   ├── equivalents.js      energyEquivalents (Tesla/iPhone/bulb), carbonEquivalents
│   ├── chatbotMatch.js     matchQuery — keyword-matched intent for the chatbot
│   ├── csvMeterParser.js   CSV → MeterReading[] with PII guard
│   ├── csvMeterFormatter.js MeterReading[] → CSV (round-trips with parser)
│   ├── googleJwt.js        RS256 verification against Google JWKs (no extra dep)
│   └── rateLimit.js        Token-bucket rate limiter for /api/chatbot
│
├── components/
│   ├── ModuleShell.js      ModulePage / ModuleSection / MetricGrid / Pill primitives
│   ├── EnergyEquivalents.js  "Equal to X Teslas / iPhones / bulb-hours" card
│   ├── Sparkline.js        Tiny inline SVG sparkline
│   ├── TimeSeriesChart.js  Full SVG line chart with axes, grid, hover tooltip
│   └── (existing)          Layout, NetEstimate, ScopeDonut, LearnAgent, etc.
│
├── hooks/                  Live measured-data hooks. All return placeholder synchronously, upgrade to Supabase rows on mount.
│   ├── useMeasuredScope1.js     fuel_bills + scope1_heating_oil + scope1_propane + scope1_fleet + scope1_refrigerants
│   ├── useMeasuredScope3.js     8 admin tables (cohorts + travel + waste + purchased_goods + commuting)
│   ├── useMeasuredSinks.js      forest_stand_actuals
│   ├── useMeasuredRenewables.js renewables_solar + renewables_geothermal + renewables_wind
│   ├── useMeasuredScopeTotals.js Composer; folds the per-scope hooks together
│   └── measuredCache.js         Module-level promise cache; admin writes invalidate
│
├── pages/                  Route-level pages — see Module map.
└── __tests__/              15 test files, 362 cases:
    ├── dataLayer.test.js      130 — composer math (Scope 1/3 + sinks + renewables)
    ├── apiRoutes.test.js       91 — every /api/* handler incl. admin auth + audit-log
    ├── useMeasuredScope.test.js 23 — render-hook tests for measured-data hooks
    ├── freshness.test.js       21 — daysSince + cadence-aware buckets
    ├── csv.test.js             16 — toCsv + parseCsv round-trip + RFC-4180
    ├── adminFetch.test.js      13 — token-expiry detection
    ├── csvValidators.test.js   33 — the 7 CsvImportPanel validators
    ├── auditLogPaging.test.js   6 — fetchAllAuditLog with progress + maxRows
    ├── measuredCache.test.js    6 — promise-cache dedupe + invalidate
    ├── FreshnessAlert.test.js   9 — banner severity + grammar + link
    ├── Renewables.test.js       4 — public /renewables measured-flip behavior
    ├── Goals.test.js            3 — provenance pill flip on Goals
    ├── Executive.test.js        3 — cohort row + ScopeRow pills
    ├── ErrorBoundary.test.js    3 — fallback rendering
    └── App.test.js              1 — top-level smoke
```

---

## API endpoints (`/api/`)

| Method | Path                              | Purpose |
|--------|-----------------------------------|---------|
| GET    | `/api/meters`                     | List meters (filter by building/type) |
| GET    | `/api/meters/readings`            | Interval readings for a window |
| POST   | `/api/meters/readings/import`     | Bulk-import readings (mirrors to Supabase if configured) |
| GET    | `/api/meters/readings/export`     | Returns CSV; round-trips with import |
| GET    | `/api/meters/quality`             | Anomaly + gap report per meter |
| GET    | `/api/buildings/[id]/energy`      | Per-building rollup |
| POST   | `/api/emissions/calculate`        | Convert any activity to kgCO2e |
| POST   | `/api/quiz/attempts`              | Log quiz attempt; GET to read or `?rollup=class` |
| POST   | `/api/chatbot`                    | Curriculum-bounded chatbot (rule-based + grounded LLM rewrite) |
| POST   | `/api/auth/session`               | Verifies Google OIDC token; returns hashed identity |
| POST   | `/api/auth/logout`                | Clears server-side session state |
| POST   | `/api/teacher/lessons`            | **NEW** — generates AI reading + 4-option questions from pasted source material; persists |
| GET    | `/api/teacher/lessons?id=` / `?createdByHash=` | Read a lesson, or list a teacher's lessons |
| PATCH  | `/api/teacher/lessons`            | Update a lesson (publish/unpublish) |
| DELETE | `/api/teacher/lessons?id=`        | Delete a lesson |
| GET    | `/api/health`                     | Component status (adapter, Supabase, factors) |
| POST   | `/api/cron/sync-bms`              | Hourly cron — pulls last hour from adapter, persists to Supabase |
| POST   | `/api/chat`                       | Existing — proxies to Anthropic API for /ask |

---

## Environment variables

See `.env.example` at repo root. Summary:

| Var | Used by | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | `/api/chat`, `/api/chatbot` | Optional; chatbot falls back to rule-based when missing |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | client | Public — read-only access |
| `SUPABASE_URL` / `SUPABASE_SERVICE_KEY` | API handlers | Required for write-through persistence |
| `METER_SOURCE` (or `VITE_METER_SOURCE`) | meter adapter factory | `mock` (default) / `csv` / `utility_api` / `bms` |
| `BMS_BASE_URL` / `BMS_USERNAME` / `BMS_PASSWORD` / `BMS_POINT_MAP` | BmsMeterAdapter | Required when METER_SOURCE=bms |
| `AUTH_GOOGLE_AUDIENCE` / `AUTH_ALLOWED_DOMAINS` / `AUTH_DEV_MODE` | `/api/auth/session` | Production needs the first two; dev mode skips signature verification |
| `CRON_SECRET` | `/api/cron/sync-bms` | Required — endpoint refuses every request without it |
| `PORT` | relay/server.js | Defaults to 3001 |

---

## Switching meter data sources

The dashboard is data-source-agnostic. Set `METER_SOURCE` to one of:

- `mock` (default) — deterministic readings from baseline shapes. Works with no setup.
- `csv` — readings come from CSV uploads via `/data-admin` or POSTs to `/api/meters/readings/import`.
- `bms` — Distech Eclypse REST API. Requires `BMS_*` env vars and an on-campus relay (cloud Vercel can't reach `10.1.1.27` directly).
- `utility_api` — stub.

### On-campus relay

Cloud-hosted Vercel can't open TCP connections to RFC1918 addresses, so
the BMS at `10.1.1.27` is unreachable from cloud functions. The relay
in `/relay/` solves this:

1. Run `node relay/server.js` on a campus machine (Mac mini, Pi, VM) joined to the LAN.
2. Expose it via Cloudflare Tunnel / Tailscale Funnel / static-IP rule.
3. Set `BMS_BASE_URL` on Vercel to the tunnel's public URL.
4. Optionally, declare the hourly Vercel cron in `vercel.json` (already done) and set `CRON_SECRET` so `/api/cron/sync-bms` can run automatically.

See `/relay/README.md` for LaunchAgent / systemd unit examples.

---

## Privacy model

Every user-linked record stores `*_id_hash`, never a name or SIS ID.

- `hashUserId(role, canonicalId)` produces stable, role-scoped hashes — the same person hashes differently across `student` / `staff` / `parent`.
- Public dashboards aggregate at dorm/grade/department level. Individual ranking is opt-in only.
- The `quiz_attempts` Supabase table enforces the hashed-identifier format with a `CHECK` constraint at the database boundary.
- The CSV parser rejects uploads with `name` / `email` / `student_id` / `sis_id` / `address` / `phone` columns up-front.

---

## Storage

- `quizStore.js` and `readingsStore.js` are write-through abstractions. Always write to in-process memory; additionally mirror to Supabase when `SUPABASE_URL` + `SUPABASE_SERVICE_KEY` are set server-side.
- Tables live in `supabase/migrations/`.
- Reads prefer Supabase when configured, fall back to memory if the read fails — a brief Supabase outage degrades to "stale until next read" rather than hard failure.

---

## Production guardrails

- **Rate limit** on `/api/chatbot`: token bucket, 12 req/min per IP, returns 429 with `Retry-After`.
- **Cron auth**: `/api/cron/sync-bms` refuses every request unless `CRON_SECRET` is set and matches.
- **JWT verification**: `/api/auth/session` uses Node's built-in crypto to verify RS256 against Google's published JWKs (cached 6h).
- **Bundle guardrail**: GitHub Actions CI fails the build if the initial bundle exceeds 600 KB (today's value: ~285 KB).
- **CI**: `.github/workflows/ci.yml` runs vitest + build on every push and PR.

---

## Accessibility

- Skip-to-content link as first focusable element.
- `:focus-visible` global style — 2px cyan outline that's readable on every dark card.
- Chat thread is `role="log"` + `aria-live="polite"`.
- Disclosure rows on `/buildings` and `/actions` are real `<button>` elements with `aria-expanded` + `aria-controls`.
- `prefers-reduced-motion` respected.
- Print stylesheet hides nav + footer, force light theme on `/report`.

---

## Roadmap status

| Phase | Status |
|------|--------|
| 1. Data models, mock data, calc utilities | ✅ |
| 2. Meter API + adapter (Mock + Eclypse + CSV adapters working) | ✅ |
| 3. OS module pages (16 routes) | ✅ |
| 4. AI Carbon Advisor + recommendation ranking | ✅ |
| 5. Privacy / hash IDs / dorm-level aggregation / DB-level constraint | ✅ |
| 6. Production guardrails (rate limit, JWT, cron auth, CI, bundle budget) | ✅ |
| 7. Storage (Supabase write-through + memory fallback) | ✅ |
| 8. Live data UX (Trend Builder, CSV download, health panel) | ✅ |
| 9. Trustee artifacts (Goals & Targets, Annual Report) | ✅ |

### Open items for future phases

- Stand up the on-campus relay against the real Eclypse REST endpoints. Cloud Vercel is wired; just needs the relay tunnel + env vars.
- Replace `matchQuery()` keyword retrieval with vector-similarity over embedded knowledge content for better long-tail chatbot accuracy.
- Wire cookie-based auth + Supabase session rows; today the session hash lives in `sessionStorage` only.

---

## Live measured-data path (Phases 1-57)

Every scope component + renewables flips estimated → measured automatically as
admins enter data through `/admin/scope-1`, `/admin/scope-2`, `/admin/scope-3`,
`/admin/sinks`, `/admin/renewables/*`. The pattern is consistent:

1. **Pure composer** in `src/data/scopeTotals.js` — takes Supabase rows, returns
   `{ totalMt, breakdown, provenance, ... }`. Empty input → safe placeholder.
2. **Per-component hook** in `src/hooks/useMeasured*.js` — fetches from Supabase
   on mount via `cachedFetch`, applies the composer. Tolerates "table doesn't
   exist" so the page renders before migrations are applied.
3. **Composer hook** `useMeasuredScopeTotals` — folds them together for the
   summary pages (Executive, AnnualReport, Goals, NetEstimate, AdminHome,
   AdminDataQuality).

Pages already wired:
`Scope1`, `Scope2`, `Scope3`, `Sinks`, `Sinks2`, `Renewables`, `Renewables2`,
`Drawdown`, `Executive`, `Goals`, `NetEstimate`, `AdminHome`, `AdminMethodology`,
`AdminDataQuality`, `AnnualReport`, `Buildings`, `Hotspots`.

---

## Admin portal

- **Auth**: `POST /api/admin/login` with timing-safe compare against
  `ADMIN_PASSWORD`. Returns HMAC-signed token (8h TTL) via `ADMIN_TOKEN_SECRET`.
  Both env vars have public fallbacks so login Just Works on a fresh deploy.
- **CRUD**: insert + update + delete + duplicate + CSV import + CSV export on
  every canonical admin table (17 tables). Edits flow through `AdminPortal.js`
  for the legacy table-by-table view, or through the per-scope pages
  `AdminScope1` / `AdminScope3` / `AdminSinks` / `AdminRenewables`.
- **Audit log**: every admin write captured in `admin_audit_log`. Viewer at
  `/admin/audit-log` with date filter, pagination, refresh, CSV export of
  visible page, and "Export all filtered" with paged progress + 50K-row ceiling.
- **Data quality**: `/admin/data-quality` summarizes measured-vs-estimated
  state per scope component, plus per-table cadence-aware freshness pills
  (fresh / aging / stale / empty / irregular). Cadence buckets are
  monthly 60/120d, quarterly 120/365d, annual 540/720d, irregular = no check.
- **AdminHome**: top-of-page freshness alert when any table is stale/aging/empty,
  plus "Data ingestion status" panel covering all 6 scope rows incl. renewables.
