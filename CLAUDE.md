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

- `/package.json` — **stale**. Create-React-App / `react-scripts` / React 19. Do not use. The `/build/` directory is a leftover CRA artifact.
- `/src/package.json` — **active**. Vite + React 18 + Vitest. This is the one to install against and run. `src/index.html` is the Vite entry, and Vite treats `src/` as the project root.

If `npm start` is requested, redirect to `npm run dev` from `src/`. If changing React or build tooling, update `src/package.json`, not the root.

## Architecture

Single-page React app with two routes wired in `src/index.js`:

- `/`  → `App.js` — public carbon dashboard. Renders live-ticking emissions counters, the ISO New England 2024 energy mix (Natural Gas / Nuclear / Renewables / Hydro / Imports), and per-building energy data from Envysion. **Most of this data is hardcoded inline** as JS arrays/constants (`buildingsData`, `emissionsData`, `yearlyEmissions = 221.53`, `totalKwh = 2316469`). Updating the dashboard with new figures means editing these literals in `App.js`.
- `/admin` → `AdminPortal.js` — password-gated CRUD UI over Supabase. Single tabbed component covering fuel, students (day / US boarding / international), travel (study abroad / faculty), and waste. Auth is a hardcoded password (`KUA2026`) compared client-side; a successful login sets `localStorage.adminLoggedIn = 'true'` and `useEffect` rehydrates the session on mount. Emission factors (`fuelFactors`, `wasteFactors` in kg CO₂ per unit) are defined as inline constants at the top of the component.

### Supabase

`src/supabaseClient.js` exports a single client with the project URL and a publishable (anon) key hardcoded. The admin portal reads/writes these tables — keep names in sync when touching schema:

`fuel_bills`, `day_students`, `us_boarding_students`, `international_students`, `study_abroad`, `faculty_travel`, `waste`.

`AdminPortal.fetchAllData` pulls all seven in parallel; inserts/deletes happen through per-table handlers in the same file.

### Orphaned admin files

`AdminFuel.js`, `AdminStudents.js`, `AdminTravel.js`, `AdminWaste.js` exist in `src/` but are **not routed or imported anywhere** — the most recent commit ("Fresh Admin Portal") consolidated them into `AdminPortal.js`. Treat them as dead code: don't edit them expecting changes to appear in the app, and prefer modifying `AdminPortal.js`. They can likely be deleted, but confirm with the user before removing.

## Conventions

- Styling is done with inline `style={{...}}` objects and a small `App.css`. There is no CSS framework, no component library, and no shared style module — matching the existing inline-style patterns is fine.
- Emission factors and grid-mix numbers are duplicated between `App.js` (display) and `AdminPortal.js` (data entry). If you change one, check whether the other needs the same update.
