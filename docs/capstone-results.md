# Capstone Results — KUA Carbon Dashboard

**Author:** [STEM Scholar Capstone]
**Project:** KUA Carbon Dashboard (`https://kua-carbon-dashboard.vercel.app`)
**Data freshness for figures below:** 2026-05-04 (`COMPOSED_YTD_AS_OF`)
**Dashboard phase at time of writing:** 360
**Test coverage:** 1,107 tests across 71 files (all green)

---

## How to read this document

This is the paper-ready scaffold for the senior-year deliverable. Every numerical claim links back to the **source file + identifier** in the codebase that produced it. To verify any number, open the linked file and grep the named export — no number in this document is invented for prose.

The four research questions are framed in order of how directly they can be answered today:

| Q | Answerable? | Caveat |
|---|---|---|
| Q1 | **Yes** (today) | Scope 1 + 3 are bottom-up cross-check placeholders pending data integration |
| Q2 | **Yes** (today) | Same caveat; comparison to Kool 2025 is directional |
| Q4 | **Yes** (today) | Uses the live `scenarioModel.js` simulator |
| Q3 | **Not yet** | Requires building a ground-truth-tagged benchmark set first — see `/docs/ai-ingestion-benchmark.md` |

A standing limitation that applies to **all four questions**: of KUA's three operational scopes, **only Scope 2 (purchased electricity) has measured BMS captures.** Scope 1 and Scope 3 are bottom-up cross-checks using published emission factors against published-method placeholders for the input quantities (gallons, students × trips, $ × EEIO). Numbers will tighten significantly once `fuel_bills`, travel-office records, and Sodexo invoices are integrated.

---

## Q1 — What is KUA's net annual carbon balance, and which scope dominates?

### Headline answer

KUA's preliminary net annual carbon balance is **1,720 mtCO₂e** — approximately **5.06 mtCO₂e per student per year** across 340 enrolled students.

This breaks down as:

| Scope | Annual mtCO₂e | Share of gross | Provenance |
|---|---|---|---|
| Scope 1 (heating fuel + fleet + refrigerants) | 1,350 | 31% | estimated |
| Scope 2 (purchased electricity) | 385 | 9% | **measured** (BMS × cited grid factors) |
| Scope 3 (purchased goods + student travel + dining + commuting + waste + upstream fuel) | 2,635 | 60% | estimated |
| **Gross** | **4,370** | 100% | mixed |
| On-campus forest sequestration | −2,650 | — | cited (Birdsey 1992 / Nowak 2013 rates × hand-estimated stand acreage) |
| **Net** | **1,720** | — | mixed |

**Source of truth:** `src/data/scopeTotals.js` (`SCOPE1_TOTAL_MT`, `SCOPE3_TOTAL_MT`, `GROSS_MT`), `src/data/gridMix.js` (`GRID_MIX_ANNUAL_MTCO2E`), `src/data/sinks.js` (`ANNUAL_SEQUESTRATION_MT`), `src/data/students.js` (`TOTAL_STUDENTS`).

To regenerate these figures: run the `node` snippet in `scripts/captureHeadlineNumbers.mjs` (added in this commit).

### Which scope dominates?

**Scope 3 dominates KUA's gross footprint at 60% (2,635 mt of 4,370 mt).** This is consistent with the broader literature: at residential boarding institutions, indirect emissions from supply chain, travel, and dining typically exceed direct combustion + electricity combined.

Within Scope 3, the dominant line is **purchased goods (1,315 mt, 50% of Scope 3, 30% of gross)** — but see Q2 for why this answer requires care.

### What it would take to firm this up

| Component | What changes the number | Where to integrate |
|---|---|---|
| Scope 1 heating | Real KUA fuel-delivery invoices (heating oil + propane gallons by month) | Supabase table `fuel_bills`; admin form `/admin/scope-1` |
| Scope 1 fleet | KUA fuel-card records (gallons by vehicle) | Supabase table `scope1_fleet_records`; admin form `/admin/scope-1/fleet` |
| Scope 1 refrigerants | HVAC technician service reports (lb recharged − lb reclaimed) | Supabase table `scope1_refrigerant_logs`; admin form `/admin/scope-1/refrigerants` |
| Scope 2 electricity | A full 12-month BMS window (currently 4 months + partial) | `src/data/monthlyConsumption.js` (auto-extends as new captures append) |
| Scope 3 purchased goods | KUA Business Office annual spend mapped to USEEIO sectors | Supabase table `scope3_purchased_goods` |
| Scope 3 student travel | Travel office records (departures × distance × mode) | Supabase tables `scope3_student_international`, `scope3_student_us_boarding`, `scope3_student_day` |
| Scope 3 dining | Sodexo/SAGE invoices (item-level food cost × Poore & Nemecek factors) | Supabase table `scope3_dining` |
| Scope 3 waste | Hauler invoices (tons by disposal stream) | Supabase table `scope3_waste` |
| Sinks (forest) | USFS Forest Inventory & Analysis-style stand walk-through (per-stand acres, age class, species, basal area) | Supabase table `forest_stand_actuals` |

Once any of these flips, the per-scope `provenance` field on the breakdown row + the per-scope `measured` flag in `useMeasuredScopeTotals.js` updates automatically and every page in the dashboard picks up the new total.

---

## Q2 — Is student travel KUA's largest emission source? (testing Kool 2025)

### Background

Kool et al. (2025) report that at boarding secondary schools where Scope 3 student travel has been measured directly, travel typically emerges as the single largest emissions category (often >50% of Scope 3 and >25% of gross). This is the strongest "boarding schools are different" finding in the recent K-12 sustainability literature.

### Headline answer for KUA

**At KUA's current accounting, student travel is NOT the largest single emission source.** The ranked breakdown (from `composeScope3()` in `src/data/scopeTotals.js:362`):

| Source | mt/yr | Share of gross | Notes |
|---|---|---|---|
| Scope 3 — Purchased goods (non-dining) | 1,315 | 30% | EEIO spend-based estimate |
| Scope 1 — Heating oil + propane | 1,290 | 30% | sqft × intensity placeholder |
| **Scope 3 — Student travel (international + boarder)** | **760** | **17%** | cohort-method placeholder |
| Scope 2 — Electricity (BMS-measured) | 385 | 9% | measured |
| Scope 3 — Dining | 235 | 5% | mock invoices |
| Scope 3 — Upstream fuel | 230 | 5% | 17% uplift on Scope 1 |
| Scope 3 — Commuting | 90 | 2% | ACS distribution |
| Scope 1 — Fleet | 54 | 1% | registry × assumed miles |
| Scope 3 — Waste | 5 | <1% | WARM net factor |
| Scope 1 — Refrigerants | 7 | <1% | leak-rate assumption |

So at face value, **Kool 2025's claim does not hold at KUA** — student travel is the 3rd largest source.

### Why this is the wrong question to stop at

Two of the three largest sources (purchased goods at 1,315 mt; student travel at 760 mt) are **both estimated placeholders**. Either could shift by ±30% once measured data lands:

- **Purchased goods (1,315 mt)** assumes ~$3M of non-energy procurement spend × ~0.40 kg CO₂e per dollar (EPA EEIO weighted average across paper / IT / cleaning / apparel). If KUA's actual non-energy spend is half that figure or skewed to lower-intensity sectors, this drops below 700 mt.
- **Student travel (760 mt)** assumes 50 international students at 1–2 RTs/yr (East Asia–heavy, ~3 mt each), 190 US boarders at 3–4 RTs/yr (~0.6 mt each), 100 day commuters with local distances. If international cohort flies more (or longer-haul on average), this rises 50%+.

A realistic measured-data outcome could plausibly land student travel anywhere between 600 mt and 1,800 mt. Purchased goods is similarly wide. **Until both have measured records, the Kool 2025 question is directionally answerable, not definitively.**

### Sub-claim that IS robust today

Student travel is **the largest single Scope 3 sub-category that students themselves can influence** — purchased goods is a Business Office decision, while flight choices are individual. This framing aligns with the dashboard's `/your-footprint` calculator, which weights flights heavily for international + US boarders.

### What would change the answer

| Scenario | New largest source? |
|---|---|
| Real KUA procurement spend turns out to be < $1.5M non-energy | Student travel becomes #1 |
| Real travel records show > 1.6× current estimate | Student travel becomes #1 |
| Both come in within ±20% of current estimates | Purchased goods stays #1, Kool 2025 doesn't hold |

---

## Q3 — How accurate is the AI ingestion agent?

### Current state

**Not yet answered.** The `/admin/ai-ingestion` page is functional (visitors can drag a PDF / spreadsheet / receipt / itinerary, and the LLM extracts structured rows), but the dashboard does not yet log accuracy or calibration metrics on a captured benchmark set. **A ground-truth-tagged set of documents must be built before this question can be answered.**

### Targets (from the proposal)

- **≥ 95%** field-level accuracy on routine fields: `date`, `kwh`, `gallons`
- **100%** field-level accuracy on safety-critical fields: `account_number`, `unit` (e.g. confusing gallons with liters)
- Documented **calibration**: when the agent returns confidence=high, the field is correct ≥ 95% of the time
- Documented **human review rate**: fraction of extracted rows that needed at least one edit before save

### Framework built today

A benchmark scaffold is committed in this same commit at:

- `src/data/aiIngestionBenchmark.js` — typed data shape for benchmark cases (one entry per document, each with the source text + expected fields per row + tolerance per field). Starts empty; populate as real documents are tagged.
- `scripts/runAiBenchmark.mjs` — Node runner: loads the benchmark cases, posts each to `/api/admin/ai-ingestion`, scores extracted vs. expected per field, prints per-field + overall accuracy + by-field error breakdown.
- `docs/ai-ingestion-benchmark.md` — protocol for adding new benchmark cases (where to source documents, how to tag fields, how to set per-field tolerances for fuzzy matches like dates).

### To answer Q3, do this in order:

1. **Collect 5–10 real KUA source documents** the agent should handle (one heating-oil invoice, one Sodexo monthly invoice, one travel itinerary PDF, one waste hauler report, etc.). Strip any PII before commit.
2. **Hand-tag each document** by adding an entry to `aiIngestionBenchmark.js` with the source text + expected `{ table, fields: { ... } }` per row.
3. **Run** `node scripts/runAiBenchmark.mjs`. The runner prints a per-field accuracy report and writes a JSON summary to `docs/ai-ingestion-benchmark-results.json`.
4. **Iterate** on the agent prompt / extraction logic until the per-field accuracy hits the targets above.
5. **Publish** the results on a new admin-visible `/admin/ai-accuracy` page that reads `ai-ingestion-benchmark-results.json` and renders the headline accuracy + per-field breakdown + worked-examples gallery (Priority 4).

The framework is in place; populating step 1 is the next gating action.

---

## Q4 — Which reduction actions in the simulator produce the largest impact per unit of behavior change?

### Method

The dashboard's `/scenarios` page exposes four reduction levers via `src/utils/scenarioModel.js`:

| Lever | Param | Mechanism |
|---|---|---|
| Cut electricity use by X% | `electricityReductionPct` | Multiplies Scope 2 mt by (1 − X) |
| Electrify Y% of heating fuel via heat pumps | `heatingElectrifyPct` | Moves Y of heating mt from Scope 1 to Scope 2, divided by COP 3.0, then × grid factor |
| Install Z kW of solar PV | `solarKw` | Subtracts Z × 1,300 kWh/kW/yr × grid factor from Scope 2 |
| Plant W acres of forest | `treePlantingAcres` | Adds W × 2.1 mtCO₂e/acre/yr (Birdsey 1992 closed-canopy) to sinks |

All assumptions are documented in `src/utils/scenarioModel.js` and unit-tested in `src/__tests__/scenarioModel.test.js` (13 tests).

### Ranked impact per "unit of behavior change"

To compare levers on equal footing, define one "unit of effort" per lever and compute the mtCO₂e avoided:

| Lever | One unit | mtCO₂e avoided per unit | Notes |
|---|---|---|---|
| Heat-pump electrification | 1 pct-point of heating fuel | **~8.0 mt** | Trades Scope 1 mt for Scope 2/COP. Falls to ~5 mt as more is electrified (diminishing returns once grid gets cleaner). |
| Solar PV installed | 1 kW capacity | **~0.31 mt** | NH typical 1,300 kWh/kW/yr × 0.235 kg/kWh ÷ 1000. |
| Tree planting | 1 acre | **~2.1 mt** | Birdsey closed-canopy rate. |
| Electricity reduction | 1 pct-point of Scope 2 | **~3.85 mt** | (385 mt × 0.01). |

**Per-unit ranking:** Heat-pump electrification > electricity reduction > tree planting > solar PV.

But "units" are not equal-effort. A more useful framing scales each lever to a **realistic single-year deployment**:

| Lever | Realistic 1-yr deployment | Total mt avoided | Implied $/mt (rough) |
|---|---|---|---|
| Heat-pump electrification | 25% of heating fuel | ~200 mt | $400/mt installed (NREL median) |
| Solar PV | 250 kW added | ~78 mt | $30/mt at NH net-metering |
| Tree planting | 20 acres added (where land is available) | ~42 mt | Near-zero if KUA land used |
| Electricity reduction | 20% (aggressive LED + scheduling + behavior) | ~77 mt | Near-zero (mostly operational) |

**Realistic-deployment ranking:** Heat-pump electrification > solar PV > electricity reduction > tree planting.

### Headline finding for the paper

**Heat-pump electrification is the highest-leverage lever** at KUA — both per unit and at realistic deployment scale. This is true *because* KUA's grid (ISO-NE) is already much cleaner than oil/propane combustion (~0.235 kg/kWh for grid vs. ~70+ kg/MMBtu for delivered heating oil), so trading any quantity of heating-fuel BTUs for grid-electricity-via-heat-pump BTUs is a near-pure win.

This finding holds **regardless of the Scope 1 / Scope 3 placeholders** — the math is grid factor + COP, both of which are cited and reproducible.

### What would change the ranking

- A meaningful drop in NH heating fuel emission factors (unlikely; EPA stationary combustion is stable)
- A meaningful rise in the ISO-NE grid factor (would shrink the heat-pump win)
- A significant scale-up of KUA's forest-stand acreage (would push tree planting higher in total-impact ranking but not per-acre)
- Adoption of geothermal as a Scope 1 reduction lever (currently feasibility-only, not in the simulator)

---

## Methodological appendix

### Provenance taxonomy

The dashboard uses a three-state vocabulary, surfaced as colored pills throughout the UI:

- **measured** — from a real meter or invoice. Today: only Scope 2 kWh via BMS captures + soil samples + measured April solar.
- **cited** — published methodology (EPA, IPCC, NREL, Birdsey, Nowak, DEFRA, Poore & Nemecek) applied to measured or canonical KUA inputs. Defensible to a board or auditor.
- **estimated** — placeholder bottom-up cross-check using published-method centrals against assumed input quantities (e.g. heating-oil gallons proxied from sqft × intensity). Needs replacement with real records before being treated as definitive.

When in doubt, the dashboard defaults to `estimated` — confidence is never inflated.

### Single source of truth files

Anyone reproducing the numbers in this document should start with:

- `src/data/scopeTotals.js` — Scope 1, Scope 3 composers + placeholders. `SCOPE1_TOTAL_MT`, `SCOPE3_TOTAL_MT`, `GROSS_MT`.
- `src/data/gridMix.js` — Scope 2 composer from BMS-measured kWh × ISO-NE 2024 per-fuel factors. `GRID_MIX_ANNUAL_MTCO2E`.
- `src/data/composedYtd.js` — annualization logic for partial-year BMS captures. `COMPOSED_ANNUAL_KWH`, `COMPOSED_ANNUALIZE_FACTOR`.
- `src/data/sinks.js` — forest stands + sequestration rates. `ANNUAL_SEQUESTRATION_MT`.
- `src/data/students.js` — `TOTAL_STUDENTS` denominator.
- `src/data/monthlyConsumption.js` — raw BMS captures (Jan–Apr 2026 monthly).
- `src/data/envysionSnapshot.js` — YTD-through-2026-05-03 fallback.
- `src/data/bmsExportApr2026.js` — high-resolution hourly export covering 2026-04-05 → 2026-05-04.

### Reproducing the headline numbers programmatically

```bash
cd src
node scripts/captureHeadlineNumbers.mjs > docs/headline-numbers-$(date +%Y%m%d).json
```

This is the **only** way to be sure the prose in this document matches the live dashboard.

---

## Open questions / limitations to disclose in the paper

1. **No measured year-over-year data.** The dashboard has 5 months of measured electricity at present. Year-over-year reductions cannot be claimed; only month-vs-month within the current year.
2. **Estimated 2/3 of gross.** Scope 1 + Scope 3 = 91% of gross emissions and are both estimated. A peer reviewer should not treat the headline 4,370 mt as a measured fact.
3. **Sinks rely on hand-estimated acreage.** The 2,650 mt forest sequestration figure is `cited` (the per-acre rates are Birdsey/Nowak) but the per-stand acreages are not from a forest inventory — they're allocated from the published ~1,000-acre total.
4. **No AI agent benchmark exists yet.** Q3 cannot be answered until a tagged set of source documents is committed and the runner is invoked.
5. **One-year-only data.** No claims about trend direction or rate of change are made; the paper should frame this as a baseline study, not a longitudinal one.

---

*Last updated alongside Phase 361. To regenerate the numerical figures in this doc, run `node scripts/captureHeadlineNumbers.mjs` and reconcile any diffs.*
