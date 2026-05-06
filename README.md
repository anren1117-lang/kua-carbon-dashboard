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
npm test          # vitest (188+ tests)
```

The root `/package.json` is stale CRA scaffolding — its only durable role
is providing `"type": "module"` so the `api/*.js` Vercel functions parse
as ESM.

## Deploying to Vercel

This project deploys to Vercel as a Vite app + serverless `api/*` functions.

### Env vars (required for production)

The admin portal won't work in production until both of these are set in
the Vercel project. Without them, `/api/admin/login` returns 503 and every
authenticated admin route 401s.

| Var | Purpose | How to generate |
|---|---|---|
| `ADMIN_PASSWORD` | Password admins type into the gate | Pick a strong password — nothing fancy required |
| `ADMIN_TOKEN_SECRET` | HMAC-SHA256 secret used to sign admin session tokens. **Must be ≥ 32 chars.** | `openssl rand -hex 32` |

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

- **Live measured-data hooks** (`src/hooks/useMeasuredScope1.js`,
  `useMeasuredScope3.js`, `useMeasuredScopeTotals.js`) upgrade the headline
  numbers from "estimated" to "measured" the moment admins enter rows into
  the corresponding Supabase tables. Pages already wired: Scope1, Scope3,
  Executive, Goals, NetEstimate (homepage hero), AdminHome.

- **Admin auth** is server-checked: `/api/admin/login` validates against
  `ADMIN_PASSWORD` and returns an HMAC-signed session token. Client uses
  `adminFetch()` from `src/utils/adminFetch.js` to attach `Authorization:
  Bearer <token>` automatically; 401 responses clear the local token and
  emit a `kua-admin-auth-expired` event so the AdminLayout can re-prompt
  for login.

- **Supabase** tables that drive the live dashboard:
  `fuel_bills`, `day_students`, `us_boarding_students`,
  `international_students`, `study_abroad`, `faculty_travel`, `waste`.
  Read/written through the publishable anon key client in
  `src/supabaseClient.js`. RLS policies live in
  `supabase/migrations/*.sql`.

For deeper context (data flow, conventions, where to make which kind of
edit), see [CLAUDE.md](CLAUDE.md).
