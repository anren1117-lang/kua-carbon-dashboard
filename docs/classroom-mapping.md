# KUA classroom mapping — how to use the dashboard in class

A course-by-course map of how every department at Kimball Union Academy
can pull material from the KUA Carbon Dashboard, plus the practical
mechanics of *getting* the material into a lesson plan, Google Classroom,
a printed worksheet, or a smart-board.

**Last updated:** 2026-05-19 (researched against the public kua.org
catalog and the 2025–26 School Profile).

**Audience:** any KUA faculty member, plus the chairs of Science,
Math, History, English, Visual Arts, and the Gosselin Learning Center.

**Live site:** [kua-carbon-dashboard.vercel.app](https://kua-carbon-dashboard.vercel.app)
**Source:** [github.com/anren1117-lang/kua-carbon-dashboard](https://github.com/anren1117-lang/kua-carbon-dashboard)

---

## 1. KUA academic context (what we mapped against)

The dashboard was built around the school's actual structure, not a
generic curriculum. Quick recap so future maintainers know what we
mapped against:

- **Three trimesters** (Fall / Winter / Spring). Most academic courses
  are full-year; some electives are single-trimester.
- **Five core courses per term** (sixth requires Dean approval).
- **Seven-period rotation** (A–G blocks), ~60 minutes each.
- **Saturday classes** (C / D / E periods, 8:30–11:40).
- **Sports & Activities** is a hard block 3:00–5:00 pm — the carbon
  dashboard is *not* something you can assign as a Sports & Activities
  alternative; it's classroom + advisory material.
- **Advisory** meets once a week as a dedicated block plus inside
  Friday's All-School Meeting.

The single highest-leverage course on campus for this dashboard is
**Tenth-Grade Sustainability** (Gosselin Learning Center) — every
sophomore takes it and the course's stated focus is "sustainable
resource use and renewable energy across the 280-acre campus." See
§2.7 below.

---

## 2. Course-by-course material map

Each subsection names the course as it appears in the live kua.org
catalog, then lists the dashboard pages that fit, then suggests one or
two concrete classroom activities. Don't treat these as scripts —
they're starting points for the teacher who actually knows the kids.

### 2.1 Science — Conceptual Physics / Physics / Physics Honors / AP Physics C

**Best-fit dashboard pages:**

- `/scope-2` — live electricity counter; energy flow in real units (kWh,
  Joules, watts of running load).
- `/scenarios` — the heat-pump electrification slider needs students to
  reason about coefficient-of-performance (typically 2.5–4×) and where
  the "free" energy comes from.
- `/methodology` — solar capacity-factor math (NH ~14%) and per-fuel
  emission factors.

**Classroom hook:**

> "The dashboard says KUA's rooftop solar runs at ~14% capacity factor.
> Why isn't it 100%? Compute the energy a 220 kW system delivers per
> year at 14% CF vs. 100%, and propose the three biggest physical
> reasons for the gap."

That's a 25-minute lesson covering energy units, capacity factor, and
solar-irradiance geometry — and the numbers on screen are KUA's actual
panels.

### 2.2 Science — Biology / Biology Honors / AP Biology

**Best-fit dashboard pages:**

- `/sinks-os` — campus forest sequestration; biomass growth math
  (Birdsey 1992 tables for New England hardwoods).
- `/scope-3` → food subsection — beef vs. plant-protein lifecycle
  emissions (Poore & Nemecek 2018 dataset).
- `/methodology` — the soil-carbon section and what "additionality"
  means for tree planting.

**Classroom hook:**

> "Pick one acre of KUA forest. Using the Birdsey table on
> /methodology, compute how much CO₂ it sequestered in 2025. Then
> compute how long it would take that one acre to offset a single
> trans-Atlantic student flight (1.6 tCO₂e round trip)."

Students leave understanding *why* the campus forest isn't a free
carbon escape hatch.

### 2.3 Science — Chemistry / Chemistry Honors / AP Chemistry

**Best-fit dashboard pages:**

- `/scope-1` — heating-oil combustion (#2 fuel oil, 10.21 kg CO₂/gallon)
  and propane (5.72 kg CO₂/gallon) — stoichiometry from first principles.
- `/methodology` — IPCC AR6 GWP values for refrigerants
  (R-410A = 2,088, R-134a = 1,430, R-32 = 675).

**Classroom hook:**

> "Balance the combustion equation for cetane (C₁₆H₃₄, a #2 fuel oil
> proxy). Use it to derive a theoretical kg CO₂/gallon. Compare to the
> EPA Stationary Combustion factor printed on /scope-1. Why is the EPA
> number higher than the theoretical floor?"

This is the standard AP Chem "fuel combustion" problem with KUA's actual
boiler as the worked example.

### 2.4 Science — AP Environmental Science

This course has the most overlap with the dashboard of any single
course in the catalog.

**Best-fit dashboard pages:**

- `/` — the gross / sinks / net headline.
- `/scope-1`, `/scope-2`, `/scope-3` — every sub-page of every scope.
- `/methodology` — every factor + citation. The AP exam's FRQ-style
  questions on greenhouse gas accounting map almost 1:1 to what's on
  this page.
- `/peer-comparison` — KUA vs. other independent schools.
- `/scenarios` — the reduction simulator.

**Classroom hook:**

> "The dashboard claims KUA's net annual footprint is ~1,720 mtCO₂e.
> Audit one *scope* in groups of three: read every assumption on the
> scope page, identify the single largest uncertainty, and propose how
> KUA could narrow the band on it before next year's report."

That's a one-trimester running project. Submit the audits back to the
dashboard team and they get folded into the next data-quality release.

### 2.5 Science — Marine Biology / Wildlife Biology / Sustainable Food and Agriculture / Environment and Anthropology ("Decarbonize Your Life")

These four electives all hit the dashboard at slightly different
angles.

- **Marine Biology / Wildlife Biology:** `/sinks-os` (ecosystem
  services) plus `/methodology` (why the campus forest's
  biodiversity value isn't on the dashboard — and whether it
  should be).
- **Sustainable Food and Agriculture:** `/scope-3` → food. Compare
  KUA Farm Team output (hogs, sheep, hydroponics) against dining
  hall demand. Open question: how much Scope 3 does the farm
  actually offset?
- **Decarbonize Your Life:** This is a near-perfect match. The
  course's stated mission ("help students analyze and reduce
  personal carbon footprints") is exactly what `/your-footprint`
  does. Assignment for week 1: every student computes their
  personal footprint on the dashboard, screenshots it, and writes
  a 250-word reflection on which row is their biggest reducible
  source.

### 2.6 Math — Algebra II / Precalculus / Calculus AB / Calculus BC

**Best-fit dashboard pages:**

- `/scope-2` — monthly consumption time series; great for
  curve-fitting, seasonality, derivatives of cumulative usage.
- `/scenarios` — sliders are a live multivariable function.

**Classroom hook (Calculus AB):**

> "Open the monthly consumption chart on /scope-2. Fit a sinusoidal
> model to the seasonal pattern. Use the derivative to predict the
> month when KUA's daily energy use is changing the fastest. Cross-
> check against the actual data point."

For Algebra II, the same exercise works as linear regression with a
residual seasonality term — kids can see why a straight-line model
fails.

### 2.7 Math — AP Statistics / Probability, Statistics & Data Science (H)

**Best-fit dashboard pages:**

- `/admin/data-quality` (login required — ask the dashboard team for a
  read-only demo token) — shows real provenance, real uncertainty
  bands, real missing-data flags.
- `/carbon-math` Q8 — variance propagation for independent error
  sources.
- `/methodology` — every emission factor's uncertainty range.

**Classroom hook:**

> "The dashboard reports KUA's net annual footprint as 1,720 mtCO₂e
> with no uncertainty band. Pick three of the biggest inputs (electricity
> kWh × grid emission factor, heating oil gallons × combustion factor,
> tree growth × Birdsey factor), assume each has a stated ±10–20%
> uncertainty, and propagate the combined band on the net number using
> the variance-addition rule. Recommend whether the dashboard should
> publish a single point or a range."

This is a one-period AP Stats problem with a real-world answer. The
dashboard team has open work on this (Capstone Priority 5).

### 2.8 Computer Science — Intro CS / AP CS A

**Best-fit dashboard pages:**

The dashboard *itself* is the material. The entire codebase is open
source on GitHub.

**Classroom hooks:**

- **Intro CS:** pick a small, well-defined page (e.g.
  `/dorm-leaderboard`) and recreate the chart using their preferred
  charting library. Compare the design decisions.
- **AP CS A (Java):** the dashboard is JavaScript, not Java, but the
  data structures translate directly. Take `src/data/scopeTotals.js`,
  port the data model to Java classes, and write a comparator that
  ranks scopes by reducibility.
- **For both:** find one bug or one missing test on the live
  dashboard, fix it, and open a pull request. Real open-source
  contribution; their name lands in the commit history.

### 2.9 Tenth-Grade Sustainability (Gosselin Learning Center) — every sophomore

This course is the single biggest classroom audience for the dashboard.
Every KUA sophomore takes it for one trimester, and the stated focus is
"sustainable resource use and renewable energy across the 280-acre
campus."

**Recommended trimester arc using the dashboard:**

- **Week 1:** intro — every student reads the user guide
  ([docs/user-guide.md](./user-guide.md)) and visits the homepage.
  Discuss: what does the "net 1,720 mtCO₂e" number actually mean?
- **Week 2:** scope deep-dive (one class per scope across three
  classes). Read `/scope-1`, `/scope-2`, `/scope-3`. Compare with peers.
- **Week 3–4:** personal footprint. Each student uses `/your-footprint`
  to compute their own, then writes a one-page reduction plan.
- **Week 5:** dorm leaderboard. Discuss why per-resident is the only
  fair metric. Run an in-class challenge against the live data.
- **Week 6:** policy lever. Use `/scenarios` to model what it would
  take to hit net-zero by 2040. Argue which lever they'd push first.
- **Week 7:** culminating mini-project — pair work — pick one piece of
  the dashboard, propose a real improvement, and present to class.

The dashboard team is open to having sophomore proposals folded into
real product work; talk to the maintainer.

### 2.10 History / Social Sciences — AP Macroeconomics, AP Microeconomics, Global Economics

**Best-fit dashboard pages:**

- `/scenarios` — every reduction lever has a cost. Students can build a
  marginal-abatement cost curve from the simulator output.
- `/executive` — top-line policy view.

**Classroom hook (Macro / Global Economics):**

> "Pick a carbon price ($/tCO₂e). Which reduction levers on /scenarios
> become economical at that price? Build a marginal abatement cost
> curve for KUA at $50, $100, and $200/tCO₂e. Recommend the price that
> would get KUA to net-zero by 2040 using only economic levers."

This pairs with the EU ETS / California cap-and-trade unit perfectly.

### 2.11 History / Social Sciences — AP US Government, AP US History, Geopolitics

**Best-fit dashboard pages:**

- `/methodology` — the GHG Protocol is a private-sector standard, but
  the IPCC factors are intergovernmental. Useful unit on transnational
  governance.
- `/news` — current climate policy headlines, refreshed daily.

**Classroom hook:**

> "The dashboard uses EPA factors for combustion and IPCC factors for
> refrigerants. Why are *both* agencies involved in carbon accounting?
> What happens to KUA's reported number if EPA changes a factor in
> 2027?"

### 2.12 English — Writer's Workshop (H), AP Language & Composition

**Best-fit dashboard pages:**

- `/methodology` — read it as a primary source. Critique the writing,
  not just the science.
- `/digest` — the monthly summary page — read as an example of
  data-driven argumentative writing.

**Classroom hook (AP Lang):**

> "The dashboard claims KUA's net footprint is 'about 5 metric tons
> per student per year.' Read /executive and /methodology. Write a
> 750-word rhetorical analysis: is this claim well-supported? What
> would a hostile reader push back on? What rhetorical moves does the
> dashboard use to establish trust?"

### 2.13 Visual Arts — Digital Photography I, Film & Video Production, Digital Fabrication

**Best-fit material:**

- `/campus-map` — the dashboard needs **better photos** of every
  building. Today some buildings have a placeholder. A photo
  assignment that lands in the production dashboard gives kids a real
  audience.
- `/share` — QR-code page; great prompt for a poster-design assignment.

**Submission path:** photos go to the dashboard maintainer as 1600×900
JPGs; they get folded into the next deploy with a credit line in the
commit. Real publication credit for student work.

### 2.14 STEM Scholar Capstone (Giles Family STEM Scholar Program)

This dashboard *is* a STEM Scholar capstone — built by one capstone
student over 2025–26. Future STEM Scholars can either:

- **Take over maintenance** (the `docs/successor-guide.md` is written
  for exactly this). Adds one data feed, one chart, one analytical
  finding. Light-touch, one-trimester project.
- **Extend it analytically.** Examples that would qualify:
  - Tag 10 real source documents and run the AI ingestion benchmark
    end-to-end (Capstone Priority 1 Q3 — open).
  - Add an uncertainty range to every headline number (Capstone
    Priority 5 — open).
  - Per-student peer benchmark across other independent schools
    (Capstone Priority 3 — half done).
- **Use the dashboard as the dataset for a different capstone.** The
  dataset is already cited, provenance-tagged, and open source —
  cheaper than collecting your own.

Scholar Program leads (per public site): **Elysia Burroughs** (Science
chair) and **Ryan McKeon, Ph.D.** (STEM Director). Reach out via
`firstinitial + lastname @ kua.org`.

---

## 3. How teachers get the material into a lesson plan

The dashboard isn't a textbook — it's a live web app. Here are the
practical ways to pull material out of it.

### 3.1 Direct linking (the easiest path)

Every page has a stable URL. Drop any of these straight into a Google
Classroom assignment, a Schoology post, or an email:

- `https://kua-carbon-dashboard.vercel.app/scope-2`
- `https://kua-carbon-dashboard.vercel.app/your-footprint`
- `https://kua-carbon-dashboard.vercel.app/scenarios`
- `https://kua-carbon-dashboard.vercel.app/carbon-math`
- `https://kua-carbon-dashboard.vercel.app/methodology`
- (etc — every nav item)

Some pages deep-link further. Example: the FAQ supports
`/faq#how-is-this-measured` to jump straight to a specific question.

### 3.2 Print-as-handout

These pages have a working **🖨 Print** button in their top toolbar:

- `/faq` — prints all 13 questions as a single handout
- `/methodology` — prints the full factors-and-citations bibliography
- `/dorm-leaderboard` — prints the leaderboard as a wall poster
- `/carbon-math` — prints all 8 problems as a worksheet
- `/methodology/glossary` — vocabulary handout

The browser's own Print-to-PDF works on every other page. Set Chrome
to "Background graphics: ON" for the dashboard's dark theme to render.

### 3.3 Smart-board / projector use

Every page is built for high-contrast projector use (white-on-dark by
default). The text scales correctly at 1080p and 4K. Avoid the campus
map in satellite mode at low projector resolution — switch to the
"category" view instead.

### 3.4 Embed in a slide deck

- Right-click any chart → "Save image as…" (most browsers support this
  for SVG charts).
- For interactive demos, screen-record the page using QuickTime
  (Mac) or the Windows Game Bar.
- The dashboard is happy to add per-chart "Download PNG" buttons on
  request — open an issue on GitHub.

### 3.5 Assign through the Teacher portal (`/teacher`)

The existing `/teacher` page already has four pre-built lesson modules
with learning goals, durations, and "fits with" annotations:

1. Climate change in 5 minutes (15–20 min)
2. Scope 1 / 2 / 3 — what KUA actually emits (25–30 min)
3. Food and carbon — the dining-hall lever (20–25 min)
4. Reading a grid mix (30–40 min)

You can assign these to a roster and see (mocked, today; real once
the school SSO is wired up) student results.

### 3.6 Send students to the Learn portal (`/learn`)

Eight curated learning paths with quizzes, ranging from "Intro for any
grade" through "AP-level deep dives in chem / bio / physics / stats."
Each path takes 10–20 minutes of student time and produces a quiz
score the dashboard can track.

### 3.7 The Ask portal (`/ask`)

For student research questions, the Ask portal is an AI tutor trained
on the dashboard's methodology, factors, and data. Cite-as-you-go.
It's not a substitute for the teacher, but it answers "what does ISO-
NE mean?" without 30 follow-up emails.

### 3.8 If you want real data for a custom assignment

The dashboard ships its source data as static JavaScript modules in
`/src/data/` on GitHub. Anything in there is yours to import into a
Google Sheet, a Jupyter notebook, or a custom student tool.

For richer feeds (BMS export, per-month per-building kWh), the admin
portal has download buttons at `/admin/bms-export`. Ask the dashboard
maintainer for a read-only token.

---

## 4. Logistics

### 4.1 Who maintains this

A single STEM Scholar capstone student (Class of 2026) wrote the
dashboard. The `docs/successor-guide.md` is set up so the *next*
student or faculty member can take over. If you want a feature, an
assignment template, or a bug fix, the fastest path is to open an
issue on GitHub or email the maintainer.

### 4.2 Citing the dashboard in a curriculum

Suggested citation:

> *KUA Carbon Dashboard.* Kimball Union Academy STEM Scholar Capstone,
> 2026. https://kua-carbon-dashboard.vercel.app

### 4.3 Honest disclosure to students

Tell students three things up front:

1. **Scope 2 (electricity) numbers are measured.** Real BMS data.
2. **Scope 1, Scope 3, and the campus forest are estimated.** Best
   available factors + cited methodology, but not yet measured at
   KUA. The "estimated" provenance pill is honest about this.
3. **No "Kool 2025" plan is publicly indexed at kua.org.** If the
   dashboard mentions Kool 2025 (it does, in a few places), that
   reference comes from the original capstone author's conversation
   with school leadership, not from a published document. A capstone
   reviewer who can't find it isn't missing anything online.

That honesty *is* the lesson. Good carbon accounting names its
uncertainties; bad carbon accounting hides them.

### 4.4 What teachers can do to make the dashboard more useful

Three small contributions that the dashboard team would happily
incorporate:

1. **Submit a building photo.** Most buildings have placeholders.
2. **Submit a tagged source document** (a heating oil bill, a fuel
   delivery slip, a flight manifest with PII removed). Each tagged
   document moves the AI ingestion benchmark toward the 95% routine
   / 100% safety-critical accuracy target (Capstone Priority 1 Q3).
3. **Submit a correction.** If a number on the dashboard contradicts
   what your department knows, say so — open an issue, send an email,
   write it on the back of a napkin. The dashboard improves only if
   real KUA people push back on it.

---

## Appendix — what we couldn't verify

The original research (May 2026) could not confirm the following from
the public web. If any of these matter to your use of the dashboard,
check internally before relying on them:

- A published "Kool 2025" climate action plan.
- An explicit "Sustainability Coordinator" job title at KUA (the
  program appears to be led by the chair of environmental studies).
- A published rubric for STEM Scholar capstone defenses beyond
  "paper + poster + presentation."
- The exact names of the required English I / II / III sequence (the
  advanced English courses *are* listed in the School Profile;
  the introductory ones are not).
- A published long-block "lab day" — labs appear to happen inside the
  regular 60-minute period.

When the dashboard is wrong about any of the above, the fix is to
update both the relevant page and this appendix.
