# KUA Carbon Dashboard

The active codebase for the KUA Carbon Operating System. This directory is the
Vite project; the repo root holds Vercel-side config (`vercel.json`) and the
serverless API routes under `/api/`.

## Setup

```bash
cd src
npm install
npm run dev       # http://localhost:5173
npm run build
npm run preview
npm test          # vitest
```

## Module map

The app is split into OS-level modules and the older scope-by-scope pages.
All OS modules read from the shared data layer in `src/data/` via the
utilities in `src/utils/`.

| Route               | Purpose |
|---------------------|---------|
| `/`                 | Executive overview (NetEstimate, scope donut, peer comparison, signposts) |
| `/hotspots`         | Ranked highest-emitting buildings + categories with severity badges |
| `/buildings`        | All buildings with sortable intensity views (kWh, kg/sqft, kg/occupant) and per-building drill-down (BMS join number, setpoints, occupancy) |
| `/dining`           | Meal-category emissions, supplier ranking, food-waste summary, menu-scenario "what-if" picker |
| `/transportation`   | Fleet, carpool savings, air travel, school trips, faculty/staff commute mix |
| `/waste`            | Waste streams + diversion rate + monthly trend |
| `/procurement`      | Spend-based Scope-3 estimates by category |
| `/actions`          | AI Carbon Advisor v1 — rule-based ranking of reduction actions |
| `/challenges`       | Dorm-level student leaderboard (privacy-by-design, opt-in for individual ranking) |
| `/teacher`          | Lesson modules, class progress (mock), discussion prompts auto-generated from KUA's data |
| `/chatbot`          | Carbon Learning Chatbot v1 — keyword-matched Q&A over the knowledge base + per-topic quizzes |
| `/data-admin`       | Adapter status, full emission-factor registry with citations, meter registry with BMS join numbers |
| `/scope-1` … `/sinks` | Pre-existing scope-detail pages |
| `/learn`            | Pre-existing self-paced learning agent (multi-path quizzes) |
| `/ask`              | Pre-existing free-form environmental Q&A (Anthropic API + web search) |
| `/admin`            | Password-gated CRUD admin |

## Architecture

```
src/
├── data/                Mock data + JSDoc-typed shapes. UI imports from here, never inlines.
│   ├── buildings.js     Building registry (sqft, occupants, hvac schedule)
│   ├── meters.js        Meter registry (one electricity meter per building + fuel masters)
│   ├── envysionSnapshot.js  Point-in-time Envysion observations (kW, voltage)
│   ├── gridMix.js       ISO-NE 2024 system mix
│   ├── seasonalPatterns.js  Day-of-week / month-of-year / hour-of-day shapes
│   ├── emissionFactors.js   kgCO2e per unit, with citations
│   ├── dorms.js         Dorm registry (joins to buildings.js by buildingId)
│   ├── students.js      600 mock student profiles, hashed IDs only
│   ├── staff.js         110 mock staff profiles, hashed IDs only
│   ├── dining.js        Menu items, vendors, ingredient purchases, food-waste logs, scenarios
│   ├── transportation.js  Fleet, commute, carpool, school trips, air travel
│   ├── waste.js         Monthly waste streams
│   ├── procurement.js   Paper / IT / cleaning / apparel records
│   ├── reductionActions.js  Action plans for the AI Carbon Advisor
│   ├── learningContent.js   Knowledge articles for the chatbot
│   └── index.js         Barrel export
│
├── adapters/meter/      Adapter pattern — every UI/API caller goes through this.
│   ├── MeterDataAdapter.js   Interface (JSDoc only)
│   ├── MockMeterAdapter.js   Working implementation (deterministic from baselines + shapes)
│   ├── CsvMeterAdapter.js          Stub — wire to CSV ingestion
│   ├── UtilityApiMeterAdapter.js   Stub — wire to Liberty Utilities / UtilityAPI.com
│   ├── BmsMeterAdapter.js          Stub — wire to Envysion / BACnet
│   └── index.js              Factory: getMeterAdapter() picks based on METER_SOURCE env
│
├── utils/
│   ├── emissions.js     quantityToKgCO2e, kgToMt, annualElectricityMt
│   ├── aggregation.js   sumBy, kwhByBuilding, allocateByGridMix, intensities
│   ├── anomaly.js       detectAnomalies (z-score, gap, flat, stale), qualityScore
│   ├── hash.js          hashUserId — privacy-safe ID generator
│   ├── comparison.js    percentChange, trendKind, yoyMonthly
│   ├── hotspots.js      buildingHotspots, rankActions
│   ├── equivalents.js   energyEquivalents (Tesla/iPhone/bulb), carbonEquivalents (cars, trees, homes)
│   └── chatbotMatch.js  matchQuery — keyword-matched intent for the chatbot
│
├── components/
│   ├── ModuleShell.js   Shared ModulePage / ModuleSection / MetricGrid / Pill primitives
│   ├── EnergyEquivalents.js  "Equal to X Teslas / iPhones / bulb-hours" card
│   └── (existing)       Layout, NetEstimate, ScopeDonut, LearnAgent, etc.
│
├── pages/               Route-level pages — see Module map above.
└── __tests__/dataLayer.test.js  29 vitest cases covering data integrity, math, adapter, chatbot
```

### Vercel API routes (in `/api/` at repo root)

| Method | Path                              | Purpose |
|--------|-----------------------------------|---------|
| GET    | `/api/meters`                     | List meters (filter by building/type) |
| GET    | `/api/meters/readings`            | Interval readings for a window |
| POST   | `/api/meters/readings/import`     | Bulk-import readings (CsvMeterAdapter persists to in-memory store) |
| GET    | `/api/meters/readings/export`     | Returns CSV (round-trips with the import format) |
| GET    | `/api/meters/quality`             | Anomaly + gap report per meter |
| GET    | `/api/buildings/[id]/energy`      | Per-building rollup (kWh, peak kW, mtCO2e, intensities) |
| POST   | `/api/emissions/calculate`        | Convert any activity quantity to kgCO2e using a stored factor |
| POST   | `/api/quiz/attempts`              | Log a quiz attempt; GET to read or `?rollup=class` to aggregate |
| POST   | `/api/chatbot`                    | Curriculum-bounded chatbot: rule-based, with optional LLM rewrite when `ANTHROPIC_API_KEY` is set |
| POST   | `/api/auth/session`               | Verifies Google OIDC token (or accepts mockSubject in `AUTH_DEV_MODE=1`) and returns a hashed identity |
| GET    | `/api/health`                     | Component status — meter adapter, Supabase, emission factors |
| POST   | `/api/cron/sync-bms`              | Pulls last hour from active adapter, persists to Supabase. Auth: Bearer `CRON_SECRET`. Vercel cron schedule: hourly |
| POST   | `/api/chat`                       | Existing — proxies to Anthropic API for the Ask agent |

## Switching meter data sources

Set `METER_SOURCE` (or `VITE_METER_SOURCE` for client-side) to one of
`mock`, `csv`, `utility_api`, `bms`. Defaults to `mock`.

### BMS (Distech Eclypse) — environment

The `BmsMeterAdapter` targets the Distech Eclypse REST API. Set:

| Env var          | Purpose                                                              |
|------------------|----------------------------------------------------------------------|
| `BMS_BASE_URL`   | e.g. `https://campus-relay.kua.org` (NOT `10.1.1.27` from the cloud) |
| `BMS_USERNAME`   | Eclypse REST username                                                |
| `BMS_PASSWORD`   | Eclypse REST password                                                |
| `BMS_POINT_MAP`  | JSON: `{ "<meterId>": "<eclypse object path>" }`                     |

Example `BMS_POINT_MAP`:

```json
{
  "m_elec_b_miller":     "protocols/bacnet/local/objects/analog-value,5/present-value",
  "m_elec_b_whittemore": "protocols/bacnet/local/objects/analog-value,11/present-value"
}
```

### On-campus relay (required for cloud Vercel)

The Eclypse controller at `10.1.1.27` is reachable only on the KUA LAN.
Vercel Functions can't open that connection. To bridge:

1. Run a small relay (Raspberry Pi, on-campus VM, or any machine joined to the campus network) that exposes the same `/api/...` endpoints as this app.
2. Make the relay reachable from the public internet using Cloudflare Tunnel, Tailscale Funnel, or a static-IP firewall rule.
3. Set `BMS_BASE_URL=https://<relay-host>` in the Vercel project so cloud-side requests get proxied through the relay onto the campus network.

`CsvMeterAdapter` and `UtilityApiMeterAdapter` remain stubs.

## Privacy model

Every user-linked record stores `*_id_hash`, never a name or SIS ID. The
`hashUserId(role, canonicalId)` utility produces stable, role-scoped hashes
so the same person hashes differently across record types. Public
dashboards must aggregate at dorm/grade/department level; individual
ranking is opt-in only.

## Roadmap status

| Step | Status |
|------|--------|
| 1. Data models, mock data, calc utilities | ✅ |
| 2. Meter API + adapter (Mock + Eclypse scaffold) | ✅ |
| 3. OS module pages (Hotspots, Buildings, Dining, Transport, Waste, Procurement, Actions, Challenges, Teacher, Chatbot, Data Admin) | ✅ |
| 4. Rule-based AI Carbon Advisor + recommendation ranking | ✅ |
| 5. Privacy / hash IDs / dorm-level aggregation | ✅ |
| 6. README + Vercel build verification | ✅ |

### Storage

Two storage paths land together in `src/storage/`:

- `quizStore.js` and `readingsStore.js` are write-through abstractions. They always write to an in-process memory store (so dev / tests work with no setup), and additionally mirror writes to Supabase whenever both `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are set in the server-side env.
- Tables are defined in `supabase/migrations/20260503000000_quiz_and_csv_storage.sql`. The `quiz_attempts` table enforces the `hashUserId()` format with a `CHECK` constraint so raw names / SIS IDs are rejected at the database boundary.
- Reads prefer Supabase when configured, with a memory fallback if the call fails — so a brief Supabase outage downgrades to "stale until next read" rather than a hard failure.

### Next phases (not yet started)
- **Live data ingestion.** Stand up the on-campus relay against the real Eclypse REST endpoints and set `BMS_BASE_URL` on Vercel. Replace static `envysionSnapshot` with periodic API calls to `/api/buildings/[id]/energy`.
- **Chatbot grounding upgrade.** The current `/api/chatbot` LLM mode passes the matched articles into the system prompt. Phase 2 replaces keyword retrieval with vector-similarity over embedded knowledge content for better article selection on long-tail queries.
