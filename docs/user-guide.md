# KUA Carbon Dashboard — User Guide

**Live at:** `https://kua-carbon-dashboard.vercel.app`
**Last updated:** Phase 362 (2026-05-19)

This guide is organized **by role**. Find your role below and read just that section. Most sections are 2–4 minutes. You don't need to read the rest.

> **Two universal shortcuts:** Press `⌘K` (Mac) or `Ctrl+K` (Windows/Linux) anywhere on the dashboard to open a search palette that jumps you to any page instantly. The big "KUA Carbon" wordmark in the upper-left always takes you home.

---

## 👨‍🎓 If you're a KUA student

**Start here:**

1. **`/your-footprint`** — Five questions about your year (commute, flights, beef, thermostat, showers). Tells you your annual carbon footprint, compares it to a typical student of your type (day / US boarder / international), and shows what would happen if every KUA student adopted your biggest reducible change.
2. **Save a pledge** (the green button at the bottom of `/your-footprint`). Commits you to a 30% cut in your biggest category. Saved to your browser — no account, no email.
3. **Copy share text** for the dorm chat. The pledge card has a one-click button that writes a tweet-length blurb to your clipboard.

**Also worth a few minutes:**

- **`/dorm-leaderboard`** — How does your dorm rank on kWh per resident? Click your dorm's name to drill into its full monthly trend.
- **`/challenge`** — Monthly competition between dorms. Two scoreboards: most efficient + biggest improver. Your RA may already be running this.
- **`/carbon-math`** — Eight interactive problems you might see in chem, bio, physics, or stats class. Built around real KUA numbers.

**Things you'll notice:**

- The big cyan dot under the homepage hero labeled "LIVE" pulses to show the data is real and current.
- Most cards lift slightly when you hover them — that means they're clickable.
- A "Tip of the day" card on the homepage rotates daily; some days are KUA-specific, some are general behavioral tips.

---

## 👩‍🏫 If you're a KUA teacher

**For class use:**

1. **`/carbon-math`** — Project this on the smart-board; eight problems (Intro / Standard / AP difficulty). "Show work" toggles reveal step-by-step reasoning. Hit "🖨 Print as worksheet" for a paper copy.
2. **`/learn`** — Eight curated learning paths with quizzes — Intro for any grade, Standard with KUA's specific data, AP-level deep dives.
3. **`/teacher`** — Assign lessons to your class, see student results.

**For your own teaching prep:**

- **`/methodology`** — Every emission factor + framework choice + citation used by the dashboard. EPA, IPCC, NREL, DEFRA, Birdsey, Nowak, Poore & Nemecek — all of it. Printable.
- **`/scenarios`** — Interactive what-if simulator with four sliders + four named presets. Useful for a "what would it actually take to cut KUA's footprint in half?" lesson.

**For interdisciplinary use:**

- Chem / bio: `/methodology` covers EPA Stationary Combustion factors and IPCC AR6 GWP values for refrigerants
- Physics: `/scenarios` has heat-pump COP math + solar capacity factor math
- Stats: `/carbon-math` Q8 covers variance propagation for independent error sources
- Civics / econ: `/executive` shows the policy levers and `/peer-comparison` lines KUA up against other schools

---

## 👨‍👩‍👧 If you're a KUA parent

**The two-minute version:**

1. **`/`** (homepage) — KUA's net annual carbon footprint at the top. Per-student figure right below.
2. **`/digest`** — What happened at KUA this month, in one shareable page. Updates automatically. Bookmark-able.

**If you have more time:**

- **`/scenarios`** — Interactive simulator. Move four sliders to see what different reduction strategies would do.
- **`/faq`** — Eleven common questions answered, each with a link to the page where the full detail lives.
- **`/methodology`** — Every number on the dashboard is cited. If you ever wonder "where does that number come from," start here.

**For comparison context:**

- The "Per-student" figure on the homepage (~5 mt/student/yr) puts KUA in the **lower middle** of peer boarding schools that report publicly. The `/executive` page has the side-by-side peer chart.

---

## 🏠 If you're an RA / dorm proctor

**For end-of-month rituals:**

1. **`/dorm-leaderboard`** — This month's standings. Click "🖨 Print leaderboard" for the bulletin board.
2. **`/challenge`** — Two champion cards (most efficient + biggest improver). Use both — a small dorm with low absolute use shouldn't lock out a big dorm that's actually cutting.

**For the first week of the term:**

1. **`/dorm-posters`** — Generates one QR code per dorm, each linking to that dorm's stats. Print the page, cut along the dashed borders, post a card on each dorm's front door. Residents scan to see their stats.

**Reframing the leaderboard:**

- Talk about **per-resident** kWh, not absolute. A 48-person dorm will always use more than a 14-person dorm in raw terms. The dashboard handles this for you, but it's worth saying out loud to residents.
- Reward **the improvement champion** as enthusiastically as the efficiency champion. Otherwise the same big-efficient dorms always win and the rest disengage.

---

## 👔 If you're a trustee / head of school

**The five-minute briefing:**

1. **`/executive`** — Headline numbers + per-student + peer comparison + scope-by-scope drill-down. Click "🖨 Print / Save PDF" for a board-ready PDF in 5 seconds.
2. **`/goals`** — Reduction trajectories. Each goal shows the target line, the current achieved line, the "where we should be by now" tick mark, and an "ahead / behind pace" pill. Also printable.
3. **`/report`** — Full annual report. The longest single document; designed to be printed end-to-end.

**For deeper confidence in the numbers:**

- **`docs/spot-check-sheet.md`** (in the GitHub repo) — A one-page faculty-verifiable checklist of every number on the dashboard, with notes on which scopes are measured vs. estimated and what records to request from Facilities to firm up the estimates.
- **`docs/capstone-results.md`** — The capstone author's paper-ready findings on the four research questions, with every number linked to its source file.
- **`/admin/ai-accuracy`** — How accurate is the AI ingestion agent at extracting data from invoices and travel records? (Currently empty pending benchmark; will populate once a tagged document set is committed.)

**Honest framing for board conversations:**

- **Scope 2 (electricity) is measured**, with 4+ months of BMS captures from the Distech Eclypse system.
- **Scope 1 (heating fuel) and Scope 3 (travel + dining + procurement)** are still cited bottom-up estimates pending records integration. The dashboard surfaces this provenance with color-coded pills throughout, not just in the fine print.
- **Forest sequestration** uses Birdsey / Nowak rates against hand-estimated per-stand acreage. A proper forest inventory would tighten this.
- **The headline net figure (~1,700 mtCO₂e or ~5 mt/student/yr)** is a defensible preliminary baseline, not a measured fact.

---

## 🎓 If you're a STEM Scholar capstone reviewer

**Start with the docs, then the dashboard:**

1. **`docs/capstone-results.md`** — Paper-ready findings for the four research questions, each numerical claim linked to its source file.
2. **`docs/spot-check-sheet.md`** — Faculty-verification checklist for every headline number.
3. **`docs/ai-ingestion-benchmark.md`** — Protocol for adding tagged source documents and running the AI agent accuracy benchmark (Q3).
4. **`scripts/captureHeadlineNumbers.mjs`** — Run this to dump a JSON snapshot of every live number. Diff against the prose in `capstone-results.md` to confirm the paper still matches the codebase.

**Live pages most relevant to the capstone:**

- **`/methodology`** — Every emission factor + citation
- **`/admin/ai-accuracy`** — Q3 results (empty until benchmark runs)
- **`/scenarios`** — Q4 reduction-lever simulator with cited assumptions
- **`/executive`** — Q1 + Q2 headline scope breakdown
- **`/whats-new`** — Curated changelog of recent dashboard improvements
- **GitHub: `https://github.com/anren1117-lang/kua-carbon-dashboard`** — Full source, 1,108 tests, deployed continuously

**Reproducibility:**

- Every number on every page traces back to a named export in `src/data/`
- 1,108 unit + integration tests under `src/__tests__/`
- Live continuous deployment on Vercel from `main`
- No proprietary dependencies — entire stack is open source

---

## 👩‍💻 If you're a KUA Facilities / IT staff member

**For day-to-day data entry:**

1. **`/admin`** — Sign in (school SSO or password gate). The Quick Actions tile labeled "📥 Drop a document" is the easiest way to load fuel invoices, dining receipts, travel itineraries, or waste hauler reports. The AI agent extracts structured rows; you review and accept.
2. **`/admin/scope-1`, `/admin/scope-2`, `/admin/scope-3`** — Structured forms when you need to enter data by hand instead of dropping a document.
3. **`/admin/bms-export`** — Where to upload a fresh BMS Meter Trends CSV to refresh the live Scope 2 numbers.

**For alerts:**

- **`/admin/alerts`** — Subscribe + manage notification emails for stale data, dead meters, and anomalies. One-click unsubscribe is on every email.

**For audit:**

- **`/admin/audit-log`** — Every admin write recorded with timestamp + user + before/after. Used for AASHE STARS submission.

---

## 🔍 Universal navigation tips

**Search anywhere:** Press `⌘K` / `Ctrl+K` to open the command palette. Type any word — fuzzy matched against all 50+ pages and 5 quick actions ("Print this page," "Copy URL," "Suggest a feature").

**Get back fast:** The "KUA Carbon" wordmark in the header is always home. The cyan circle with an up-arrow in the bottom-right appears when you've scrolled and takes you back to the top.

**Find a feature you remember:** The footer is divided into three columns (Insights / Plan & finance / Operations) covering every page that doesn't fit in the top nav. Hover any pill — it lifts.

**On a phone:** The top nav collapses into a hamburger menu. Drawer slides in from the right.

**To share a view with someone:** Use the Cmd+K palette → "Copy current page URL" → paste. Every page has a stable URL.

**To make a PDF of any page:** Most pages have a "🖨 Print / Save PDF" button in their toolbar. The dashboard's print stylesheet hides nav + footer so the printed output is clean.

---

## What this dashboard is NOT

**Honest disclaimers** to set expectations:

- **Not a real-time energy meter.** The most-current data point is at most a few weeks old (whenever the BMS export was last captured).
- **Not an audited carbon report.** Scope 1 and Scope 3 are bottom-up estimates pending records integration. The headline number is a defensible preliminary baseline, not a verified fact.
- **Not a billing system.** Liberty Utilities + Dead River + Sodexo etc. all have their own systems; the dashboard reads from + cross-checks against them but is not the source of truth for any of them.
- **Not personally identifying.** No student names, no dorm-assignment data, no PII anywhere. Per-student figures are statistical aggregates.
- **Not a substitute for a forester / energy auditor.** Use the dashboard to find hotspots; bring in domain experts for actual interventions.

---

## How to get help

- **Found a bug?** Open an issue at https://github.com/anren1117-lang/kua-carbon-dashboard/issues/new
- **Want a feature?** Same place — describe the use case.
- **Have a question about the methodology?** Start at `/methodology`. If that doesn't answer it, open an issue and tag it `methodology-question`.
- **Need to verify a number for an external audit?** Use `docs/spot-check-sheet.md` as a checklist, then open an issue if anything doesn't reconcile.

---

*This guide is part of the KUA Carbon Dashboard repository. To suggest edits, open a PR against `docs/user-guide.md`.*
