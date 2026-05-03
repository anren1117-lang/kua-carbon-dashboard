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

## Architecture (Phase 1 — data + adapter layer)

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
│   └── hotspots.js      buildingHotspots, rankActions
│
├── components/          UI components. Read from data/ and call api/ for live values.
├── pages/               Route-level pages.
└── __tests__/dataLayer.test.js  Smoke tests for the data + adapter contract
```

### Vercel API routes (in `/api/` at repo root)

| Method | Path                              | Purpose |
|--------|-----------------------------------|---------|
| GET    | `/api/meters`                     | List meters (filter by building/type) |
| GET    | `/api/meters/readings`            | Interval readings for a window |
| POST   | `/api/meters/readings/import`     | Bulk-import readings (mock no-op) |
| GET    | `/api/meters/quality`             | Anomaly + gap report per meter |
| GET    | `/api/buildings/[id]/energy`      | Per-building rollup (kWh, peak kW, mtCO2e, intensities) |
| POST   | `/api/emissions/calculate`        | Convert any activity quantity to kgCO2e using a stored factor |
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

## Roadmap

This commit lands roadmap steps 1 + 2 (data models + meter adapter).
Steps 3–6 (Hotspots, Buildings, Dining, Transportation, Student
Challenges, Learning Chatbot, Data Admin pages, AI Carbon Advisor,
README polish) follow in subsequent PRs.
