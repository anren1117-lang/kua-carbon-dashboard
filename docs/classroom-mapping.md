# KUA classroom mapping

> **How to use this guide (60 seconds)**
>
> 1. **Don't read it end-to-end.** This is a reference. Jump straight to your course.
> 2. **Each course block has three things:** pages to use · one classroom hook · estimated lesson time.
> 3. **You'll need ~30 seconds per course block** to decide if it fits your week.
> 4. **The dashboard is live and free.** No login for any course-use page; the admin pages need a token.

| | |
|---|---|
| **Live site** | [kua-carbon-dashboard.vercel.app](https://kua-carbon-dashboard.vercel.app) |
| **Source code** | [github.com/anren1117-lang/kua-carbon-dashboard](https://github.com/anren1117-lang/kua-carbon-dashboard) |
| **Audience** | Any KUA faculty member; chairs of Science, Math, History, English, Visual Arts, Gosselin |
| **Researched** | 2026-05-19, against the live kua.org catalog + 2025–26 School Profile |
| **Companion doc** | [user-guide.md](./user-guide.md) (general dashboard tour, not course-specific) |

### Jump to your course

| Department | Section |
|---|---|
| Physics (all levels + AP C) | [§2.1](#21-science--conceptual-physics--physics--physics-honors--ap-physics-c) |
| Biology (all levels + AP) | [§2.2](#22-science--biology--biology-honors--ap-biology) |
| Chemistry (all levels + AP) | [§2.3](#23-science--chemistry--chemistry-honors--ap-chemistry) |
| **AP Environmental Science** *(highest fit)* | [§2.4](#24-science--ap-environmental-science) |
| Marine Bio · Wildlife Bio · Sustainable Food & Ag · Decarbonize Your Life | [§2.5](#25-science--marine-biology--wildlife-biology--sustainable-food-and-agriculture--environment-and-anthropology-decarbonize-your-life) |
| Math: Algebra II → Calc BC | [§2.6](#26-math--algebra-ii--precalculus--calculus-ab--calculus-bc) |
| AP Stats / Prob & Stats & Data Science (H) | [§2.7](#27-math--ap-statistics--probability-statistics--data-science-h) |
| Intro CS / AP CS A | [§2.8](#28-computer-science--intro-cs--ap-cs-a) |
| Advisory / freshman seminar / cross-grade sustainability unit | [§2.9](#29-advisory--freshman-seminar--any-cross-grade-sustainability-slot) |
| AP Macro / Micro / Global Econ | [§2.10](#210-history--social-sciences--ap-macroeconomics-ap-microeconomics-global-economics) |
| AP US Gov · AP US History · Geopolitics | [§2.11](#211-history--social-sciences--ap-us-government-ap-us-history-geopolitics) |
| Writer's Workshop (H) · AP Lang | [§2.12](#212-english--writers-workshop-h-ap-language--composition) |
| Visual Arts (Digital Photo · Film · Fabrication) | [§2.13](#213-visual-arts--digital-photography-i-film--video-production-digital-fabrication) |
| **STEM Scholar Capstone** | [§2.14](#214-stem-scholar-capstone-giles-family-stem-scholar-program) |
| **How to get material into a lesson** | [§3](#3-how-teachers-get-the-material-into-a-lesson-plan) |
| Logistics + honest disclosure | [§4](#4-logistics) |

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

### 2.9 Advisory / freshman seminar / any cross-grade sustainability slot

> **Correction note (2026-05-19):** an earlier draft of this doc claimed
> "10th Grade Sustainability" was a required course for every KUA
> sophomore. A primary-source check against the **2025–26 School
> Profile** and the live **kua.org/student-life/sustainability** page
> did not find such a course. The Gosselin Learning Center exists as a
> department in the catalog dropdown, but its actual course list could
> not be verified from the public web. Until a faculty member confirms
> the course exists, treat this section as guidance for *any* advisory
> block, freshman seminar, or interdisciplinary slot where a teacher
> wants a multi-week dashboard-driven unit.

**Suggested 7-week arc** (works in advisory, a science-elective intro
unit, or a Global Scholar / STEM Scholar seminar):

- **Week 1:** intro — students read [user-guide.md](./user-guide.md)
  and visit the homepage. Discuss: what does the "net 1,720 mtCO₂e"
  number actually mean?
- **Week 2:** scope deep-dive — one class per scope. Read `/scope-1`,
  `/scope-2`, `/scope-3`. Compare with peers.
- **Week 3–4:** personal footprint. Each student uses
  `/your-footprint`, then writes a one-page reduction plan.
- **Week 5:** dorm leaderboard. Discuss why per-resident is the only
  fair metric. Run an in-class challenge against the live data.
- **Week 6:** policy lever. Use `/scenarios` to model what it would
  take to hit net-zero by 2040.
- **Week 7:** culminating mini-project — pairs pick one piece of the
  dashboard, propose a real improvement, and present to class.

The dashboard team is open to having student proposals folded into
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

### 2.14 STEM Scholar Capstone (and Arts Scholar / Global Scholar)

This dashboard *is* a STEM Scholar capstone — built by one capstone
student over 2025–26. Future STEM Scholars can either:

- **Take over maintenance** (the `docs/successor-guide.md` is written
  for exactly this). Add one data feed, one chart, one analytical
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

**Capstone format (verified against the 2025–26 School Profile):**

> *"Available to pursue an in-depth independent study project ·
> 2000/4000 word required research paper · Mentored by a faculty
> member as well as an expert in the field."*

The School Profile does not specify a poster session or oral defense.
If your year requires one, that's a program-level addition, not a
documented requirement.

**Arts Scholar** and **Global Scholar** programs share the same
two-year structure, six evening seminars, community service
requirement, and the same senior capstone format. Global Scholar adds
**28 days of overseas study/travel** as a hard requirement; Arts
Scholar adds significant off-campus work in the arts.

**Scholar Program leads (per kua.org/academics/scholar-programs):**
**Elysia Burroughs** (Science Department Chair) and **Ryan McKeon,
Ph.D.** (STEM Director, Computer Science teacher). Reach out via
`firstinitial + lastname @ kua.org` (confirmed convention; e.g.
`golson@kua.org` is Director of College Advising).

---

## 3. How teachers get the material into a lesson plan

Pick the path that matches what you're doing this week:

| If you want to… | Use | Time to set up |
|---|---|---|
| Drop a link in Google Classroom / Schoology | Stable URL — every page has one | < 1 min |
| Print a paper handout | 🖨 button on `/faq`, `/methodology`, `/dorm-leaderboard`, `/carbon-math`, `/methodology/glossary` | < 1 min |
| Project on the smart-board | Any page (dark theme, scales to 1080p/4K). Avoid satellite-view campus map at low projector res. | < 1 min |
| Embed a chart in a slide deck | Right-click chart → Save image. Or screen-record with QuickTime / Game Bar. | 2 min |
| Pre-built lessons with learning goals | `/teacher` — 4 modules (15–40 min each) | 5 min |
| Student-paced quizzes | `/learn` — 8 paths × 10–20 min, Intro / Standard / AP tiers | 5 min |
| Let students ask questions outside class | `/ask` — AI tutor trained on dashboard methodology | 0 min |
| Pull raw data for a custom assignment | `/src/data/*.js` on GitHub (open source); for BMS export ask the maintainer for a read-only token to `/admin/bms-export` | 10 min |

**Deep-linking trick:** the FAQ supports anchors — `/faq#how-is-this-measured` jumps straight to that question. Useful for "read this specific thing before class" prompts.

**Browser-print tip:** for any page without a 🖨 button, the browser's own Print-to-PDF works. Set Chrome to "Background graphics: ON" so the dark theme renders.

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

## Appendix — sourcing + what we couldn't verify

### What was verified directly from primary sources (2026-05-19)

Directly fetched and quoted/paraphrased from the listed source:

| Claim | Source |
|---|---|
| Trimester structure + 5 cores/term + sixth core with Dean approval | [2025–26 School Profile](https://bbk12e1-cdn.myschoolcdn.com/ftpimages/169/misc/misc_238096.pdf) p.2 |
| 19 credits to graduate (English 4 / History 3 / Math 3 / Sci 3 / Lang 3 / Arts 1) | School Profile p.1 |
| STEM Scholar program structure + 6 evening seminars + community service | School Profile p.2 |
| Capstone format: *"2000/4000 word required research paper, mentored by a faculty member as well as an expert in the field"* | School Profile p.2 (verbatim) |
| Arts Scholar + Global Scholar exist with same structure (Global = 28 days overseas) | School Profile p.2 |
| Cullman Scholarship (~6% juniors, <1% sophomores, environmental awareness) | School Profile p.2 |
| Scholar Program directors: Elysia Burroughs + Ryan McKeon Ph.D. | [kua.org/academics/scholar-programs](https://www.kua.org/academics/scholar-programs) |
| Advanced course list per department (English / Sciences / Math / WL / History / Arts) | School Profile p.2 |
| 220 kW solar, 15 kW wind (Charlotte's Windmill, 2013), Beekeeping, Farm Team, Pork Project, Sugar House | [kua.org/student-life/sustainability-and-the-outdoors](https://www.kua.org/student-life/sustainability-and-the-outdoors) |
| Sustainability-relevant courses: AP Env Sci, Environment and Anthropology (Decarbonize Your Life), Environmental Chemistry, Environmental Studies, Marine Bio, Sustainability, Sustainable Food and Ag, Wildlife Bio | Sustainability page (verbatim list) |
| Faculty email convention: `firstinitial+lastname@kua.org` | School Profile (golson, dgueldenzoph, cprudden, dpsomas all visible) |
| Blaine Kopp — Louis Munro '57 Chair of Environmental Studies | [kua.org/academics](https://www.kua.org/academics) (quoted on page) |

### What this doc could NOT verify

If any of these matter to your use of the dashboard, check internally
before relying on them:

- A published "Kool 2025" climate action plan. (Not indexed on
  kua.org; the dashboard references it from internal conversation.)
- An explicit "Sustainability Coordinator" job title. The
  Environmental Studies chair (Blaine Kopp) appears to lead the
  program; there's no separate coordinator title visible on the
  public site.
- **A required 10th-grade sustainability course.** Earlier drafts of
  this doc claimed every sophomore takes one; the School Profile and
  Sustainability page do not corroborate. The Gosselin Learning
  Center exists as a department, but its course list is JS-rendered
  and could not be fetched. Removed from §2.9 pending confirmation.
- **Capstone deliverable beyond the paper itself.** The School
  Profile lists *only* the 2000/4000 word paper + dual mentorship.
  No published poster session, oral defense, or rubric.
- The exact names of the required English I / II / III sequence.
  Advanced English courses *are* in the School Profile; introductory
  ones are not publicly listed.
- A published long-block "lab day." Labs appear to happen inside the
  regular ~60-minute period.

When the dashboard is wrong about any of the above, the fix is to
update both the relevant page and this appendix.
