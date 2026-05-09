# KUA Carbon Dashboard

A live carbon-accounting dashboard for Kimball Union Academy (Plainfield NH).
Tracks Scopes 1/2/3 + on-campus forest sequestration. Public emissions counters,
methodology references, peer comparison, learn modules, an admin portal for
data entry, and an AI-driven institutional planning agent.

## Quick start

All active development happens **inside `src/`** (Vite + React 18 + Vitest).

```bash
cd src
npm install
npm run dev       # Vite dev server on http://localhost:5173
npm run build     # production build → src/dist/
npm test          # vitest (362 tests across 15 files)
```

The root `/package.json` is stale CRA scaffolding — its only durable role
is providing `"type": "module"` so the `api/*.js` Vercel functions parse
as ESM.

## Deploying to Vercel

This project deploys to Vercel as a Vite app + serverless `api/*` functions.

### Env vars (recommended for production hardening)

The admin portal works out-of-the-box on a fresh deploy with no env-var
setup — login accepts the password **`KUA2026`** by default. To harden,
override either or both with stronger values via the Vercel dashboard:

| Var | Purpose | Default | How to override |
|---|---|---|---|
| `ADMIN_PASSWORD` | Password admins type into the gate | `KUA2026` (public fallback) | `vercel env add ADMIN_PASSWORD production` |
| `ADMIN_TOKEN_SECRET` | HMAC-SHA256 secret used to sign admin session tokens. Must be ≥ 32 chars. | A baked-in 64-char string (public fallback) | `vercel env add ADMIN_TOKEN_SECRET production` then paste `openssl rand -hex 32` |

The fallbacks are intentional: KUA's threat model is "keep casual visitors
out of the admin portal," not "keep determined attackers out." Anyone reading
the public source can mint forged tokens with the default secret — set
`ADMIN_TOKEN_SECRET` in Vercel to close that gap when you care.

### Env vars (optional)

| Var | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Enables LLM-driven `/api/admin/estimate-action` + `/api/admin/plan`. When unset, both endpoints fall back to a rule-based response so the admin UI still works. |
| `CRON_SECRET` | Required for `/api/cron/*` routes. Vercel cron sends this in the Authorization header. |
| `AUTH_GOOGLE_AUDIENCE`, `AUTH_ALLOWED_DOMAINS` | Required for `/api/auth/session` Google SSO (used by chatbot persistence + teacher portal). |
| `AUTH_DEV_MODE=1` | Local dev only — accepts mock session tokens without Google SSO. **Never set in production.** |

### Setting env vars

Either through the Vercel dashboard (Project Settings → Environment Variables)
or via the Vercel CLI:

```bash
npm i -g vercel              # if not installed
vercel link                  # one-time, links this local dir to the Vercel project
vercel env add ADMIN_PASSWORD production
vercel env add ADMIN_TOKEN_SECRET production
vercel deploy --prod         # redeploy so the new env takes effect
```

### Push to deploy

The repo is wired for Vercel auto-deploy on push to `main`. Local commits
won't go live until they're pushed:

```bash
git push origin main
```

## Architecture cheat sheet

- **Canonical scope numbers** live in `src/data/scopeTotals.js`. Today's
  values match the bottom-up multi-method cross-check centrals from
  `src/data/geographicEstimates.js`: Scope 1 = 1,350 mt, Scope 2 = 385 mt,
  Scope 3 = 2,635 mt, sinks = 2,650 mt → gross 4,370 / net 1,720 / per-student 5.0.

- **Live measured-data hooks** (`src/hooks/useMeasured{Scope1,Scope3,Sinks,Renewables}.js`
  + composer `useMeasuredScopeTotals.js`) upgrade the headline numbers from
  "estimated" to "measured" the moment admins enter rows into the corresponding
  Supabase tables. Pages already wired: Scope1, Scope2, Scope3, Sinks, Sinks2,
  Renewables, Renewables2, Drawdown, Executive, Goals, AnnualReport,
  NetEstimate (homepage hero), AdminHome, AdminMethodology, AdminDataQuality,
  Buildings, Hotspots. Each component flips estimated → measured independently.
  A module-level promise cache in `src/hooks/measuredCache.js` dedupes
  Supabase round-trips across pages; admin writes invalidate it via
  `logAdminWrite()`.

- **Admin auth** is server-checked: `/api/admin/login` validates against
  `ADMIN_PASSWORD` and returns an HMAC-signed session token. Client uses
  `adminFetch()` from `src/utils/adminFetch.js` to attach `Authorization:
  Bearer <token>` automatically; 401 responses clear the local token and
  emit a `kua-admin-auth-expired` event so the AdminLayout can re-prompt
  for login.

- **Supabase** tables that drive the live dashboard (17 canonical):
  - **Scope 1**: `fuel_bills`, `scope1_heating_oil`, `scope1_propane`,
    `scope1_fleet`, `scope1_refrigerants`
  - **Scope 3**: `day_students`, `us_boarding_students`, `international_students`,
    `study_abroad`, `faculty_travel`, `waste`, `purchased_goods`, `commuting`
  - **Sinks**: `forest_stand_actuals`
  - **Renewables**: `renewables_solar`, `renewables_geothermal`, `renewables_wind`
  - **Audit trail**: `admin_audit_log` (every admin write)

  Read/written through the publishable anon key client in
  `src/supabaseClient.js`. The bearer-token gate at `/api/admin/login` IS the
  auth boundary — there's no service-role key in the client. RLS policies +
  schemas live in `supabase/migrations/*.sql`.

- **Data quality dashboard** at `/admin/data-quality` shows per-table row
  counts, last-entry timestamps, and cadence-aware freshness pills (fresh /
  aging / stale / empty / irregular). AdminHome surfaces the same as a
  top-of-page alert when any table is stale.

- **Audit log** at `/admin/audit-log` lists every admin write with date
  filtering, pagination, refresh button, CSV export of the visible page, and
  "Export all filtered" with paged progress (50K-row ceiling).

For deeper context (data flow, conventions, where to make which kind of
edit), see [CLAUDE.md](CLAUDE.md).
