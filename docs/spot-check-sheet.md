# KUA Carbon Dashboard — Faculty Spot-Check Sheet

**Purpose:** Let a faculty member (sustainability committee, science department chair, or trustee) verify the dashboard's headline numbers against KUA's own records in under one hour.

**How to use:** Open the dashboard at `https://kua-carbon-dashboard.vercel.app`. For each row below: read the "Dashboard claims" column, then ask Facilities / Business Office / Dining Services for the listed records, then compare against the "Independent check" column. Note anything that doesn't reconcile in the notes column on the right.

**Provenance taxonomy used throughout:**
- **measured** = from a real meter or invoice in KUA's hands
- **cited** = published methodology (EPA, IPCC, NREL, etc.) applied to KUA inputs
- **estimated** = bottom-up cross-check placeholder, awaiting data integration

Numbers below are pulled from `docs/headline-numbers-20260519.json`. To refresh: run `node scripts/captureHeadlineNumbers.mjs`.

---

## Section 1 — Scope 2 (purchased electricity)

This is the only scope KUA has measured data for. Verify it carefully because it anchors everything else.

| # | Dashboard claims | Source file | Independent check (ask Facilities for) | Notes |
|---|---|---|---|---|
| 1.1 | YTD electricity consumed: **650,695 kWh** through 2026-05-04 (124 days, ~4 months) | `src/data/composedYtd.js` `COMPOSED_YTD_KWH` | Distech Eclypse BMS "All Meters" page — sum of `displayedTotal` across captured months Jan–Apr 2026. Should match within ±2%. | |
| 1.2 | Annualized projection: **~5.4 million kWh/year** | `src/data/composedYtd.js` `COMPOSED_ANNUAL_KWH` | (YTD × seasonal annualize factor 2.52). Cross-check: Liberty Utilities annual statement for KUA — should land within ±15% of 5.4M kWh once a calendar year of BMS data lands. | |
| 1.3 | Effective grid emissions factor: **0.235 kg CO₂/kWh** (ISO-NE 2024 per-fuel output-basis) | `src/data/gridMix.js` | ISO New England published Electric Generator Air Emissions Report 2024 + EPA eGRID NEWE per-fuel rates. Public sources, anyone can reproduce. | |
| 1.4 | Annual Scope 2 mtCO₂e: **385 mt** | `src/data/gridMix.js` `GRID_MIX_ANNUAL_MTCO2E` | (5.4M kWh × 0.235 kg/kWh ÷ 1,000). Cross-check: Liberty Utilities bill ÷ same factor. | |
| 1.5 | Largest single building: Whittemore Athletic Center at ~478,000 kWh/yr | `/buildings` page, sorted by kWh | BMS submeter #11. Verify against last 12 monthly displayedTotal rows for that meter. | |

---

## Section 2 — Scope 1 (heating fuel + fleet + refrigerants) — ALL ESTIMATED

⚠️ **No KUA invoices have been integrated yet.** The dashboard publishes a bottom-up placeholder derived from public methodologies. Verifying this section means **collecting the real records to replace the placeholder**.

| # | Dashboard claims | Source file | Independent check (collect from Facilities) | Notes |
|---|---|---|---|---|
| 2.1 | Heating oil + propane: **1,290 mtCO₂e/yr** (placeholder) | `src/data/scopeTotals.js:24` | KUA Facilities annual heating-fuel delivery invoices (heating oil + propane gallons by month). Multiply gallons × EPA factor (10.16 kg CO₂/gal heating oil; 5.72 kg CO₂/gal propane) ÷ 1,000. Compare to 1,290. | |
| 2.2 | Underlying assumption: 290k sqft × NH Climate Zone 6 intensity (Dorm 75 / Academic 55 / Athletic 45 / Other 55 kBtu/sqft/yr) × 90% oil + 10% propane | `src/data/scopeTotals.js:24` (method field) | Verify the **sqft** numbers per building category against KUA's facilities-management plan. Then either accept the intensity assumption or replace with measured. | |
| 2.3 | Fleet vehicles: **54 mtCO₂e/yr** (placeholder) | `src/data/scopeTotals.js:25` | KUA fuel-card statements for 2 diesel buses + 2 gasoline vans + 1 truck. Sum gallons × EPA Mobile Combustion factors (10.21 kg/gal gasoline, 10.21 kg/gal diesel). | |
| 2.4 | Underlying assumption: 2 buses 6.5 mpg × 26K mi/yr | `src/data/transportation.js` `fleetVehicles` | Verify vehicle count + actual mpg + actual annual mileage with Facilities Director. | |
| 2.5 | Refrigerant leakage: **7 mtCO₂e/yr** (placeholder) | `src/data/scopeTotals.js:26` | HVAC technician service reports for all rooftop units + building chillers. Sum (lb recharged − lb reclaimed) × IPCC GWP100 for refrigerant type ÷ 1,000. | |
| **2.6** | **Scope 1 total: 1,350 mt** | `SCOPE1_TOTAL_MT` | Sum of rows 2.1 + 2.3 + 2.5. **If any of those independent checks land more than ±30% from the placeholder, the headline net-balance number should be re-published before any external citation.** | |

---

## Section 3 — Scope 3 (indirect emissions) — ALL ESTIMATED

⚠️ Same warning as Section 2 — every line is a placeholder until the listed records are integrated.

| # | Dashboard claims | Source file | Independent check (collect from listed office) | Notes |
|---|---|---|---|---|
| 3.1 | Purchased goods (non-dining): **1,315 mtCO₂e/yr** | `src/data/scopeTotals.js:354` | Business Office annual spend report. Filter out energy + food categories. Map remaining spend to USEEIO sectors. Multiply each sector's $ × EPA EEIO v2.0 factor. | |
| 3.2 | Underlying assumption: ~$3M non-energy procurement × ~0.40 kg CO₂e/$ | `src/data/scopeTotals.js:354` (method) | If Business Office spend is < $1.5M, this whole line drops below student travel and the "is travel #1" question changes. | |
| 3.3 | Student travel (international + boarder): **760 mtCO₂e/yr** | `src/data/scopeTotals.js:355` | Travel office: count of international student departures + US boarder break trips by destination. Apply ICAO calculator or DEFRA per-passenger-mile factors with radiative forcing. | |
| 3.4 | Underlying assumption: 50 international × 1–2 RTs/yr East Asia-heavy + 190 US boarders × 3–4 RTs/yr Northeast-skewed + 100 day commuters | `src/data/scopeTotals.js:355` (method) | Verify cohort counts against KUA admissions data. Verify trip-count assumptions against actual departure records if possible. | |
| 3.5 | Dining: **235 mtCO₂e/yr** | `src/data/scopeTotals.js:356` | Sodexo (or current food-service provider) monthly invoices, item-level. Multiply each line item's kg or count × Poore & Nemecek 2018 factor for that food category. | |
| 3.6 | Underlying assumption: ~217k student meals (boarders 3×7×36 + day 10×36) + 50k faculty/staff × meal-class kg CO₂e | `src/data/scopeTotals.js:356` (method) | Verify against Sodexo serving counts. | |
| 3.7 | Upstream fuel: **230 mtCO₂e/yr** | `src/data/scopeTotals.js:357` | Computed as ~17% uplift on Scope 1 (refinery + transport emissions for heating oil + propane + fleet fuel). Recompute once Scope 1 is measured. | |
| 3.8 | Commuting: **90 mtCO₂e/yr** | `src/data/scopeTotals.js:358` | HR commute survey: home zip code + days/week on campus per faculty/staff. Multiply each person's annual commute miles × ICCT effective fleet fuel-economy × EPA gasoline factor. | |
| 3.9 | Waste: **5 mtCO₂e/yr** | `src/data/scopeTotals.js:359` | Casella + KUA Composting + eWorks NH monthly hauler invoices. Sum tons by disposal stream × EPA WARM v15.1 net factor. | |
| **3.10** | **Scope 3 total: 2,635 mt** | `SCOPE3_TOTAL_MT` | Sum of 3.1 + 3.3 + 3.5 + 3.7 + 3.8 + 3.9. | |

---

## Section 4 — Sinks (on-campus carbon drawdown)

| # | Dashboard claims | Source file | Independent check | Notes |
|---|---|---|---|---|
| 4.1 | Total forest acreage: **1,000 acres** across 7 named stands | `src/data/sinks.js` `forestStands` | KUA campus property records / GIS. Sum acreage of all forested polygons. Should match 1,000 ±50 acres. | |
| 4.2 | Annual forest sequestration: **2,650 mtCO₂e/yr** | `src/data/sinks.js` `ANNUAL_SEQUESTRATION_MT` | Per-acre rates are Birdsey (1992) US-forest 2.1 mt/acre/yr to Nowak (2013) open-grown 4.2 mt/acre/yr — both published, anyone can verify. The **per-stand acreage** and **dominant species** are hand-estimated; a real walk-through forest inventory would confirm. | |
| 4.3 | Largest stand: North Hill mixed hardwood, 320 acres × 2.8 mt/acre/yr = 896 mt | `src/data/sinks.js:24` | If a forester walk-through gives different acreage or different sequestration rates per stand, recompute. | |
| 4.4 | Soil organic carbon sampling: 7 samples committed | `src/data/sinks.js:50` `soilSamples` | UNH Cooperative Extension lab reports for samples ss_001 through ss_007 from Sept–Oct 2025. Verify lab name + sample IDs + %OC values. | |

---

## Section 5 — Renewables (on-campus generation)

| # | Dashboard claims | Source file | Independent check | Notes |
|---|---|---|---|---|
| 5.1 | Solar: **16,777 kWh/yr** projected (small) | `src/data/renewables.js` `SOLAR_ANNUAL_KWH` | Anchored on **measured** 1,692 kWh April 2026 BMS production from PM_15_RoofTopSolarFeed (only 1 of 3 arrays reporting reliably; see file). Projected through NREL PVWatts NH seasonal-shape factor. Verify the 1,692 kWh April figure on the BMS. | |
| 5.2 | Two of the three BMS solar feeds are broken | `src/data/renewables.js:5-9` | PM_15_FieldSolarFeed = stuck at negative cumulative; PM_19_SolarFeed = net consumer (likely backwards CT). **Facilities action item:** investigate + fix. Until then, 16,777 kWh is the honest figure. | |
| 5.3 | Geothermal + small wind: feasibility stage, not metered | `src/data/renewables.js` | KUA Facilities should confirm no operational systems exist. If any do, add them to the BMS export. | |

---

## Section 6 — Headline net balance

| # | Dashboard claims | Source file | Independent check | Notes |
|---|---|---|---|---|
| 6.1 | Gross emissions: **4,370 mtCO₂e/yr** | `GROSS_MT` | = 1,350 (Scope 1) + 385 (Scope 2) + 2,635 (Scope 3). 91% of this number is estimated. | |
| 6.2 | Net emissions (after sinks): **1,720 mtCO₂e/yr** | `useMeasuredScopeTotals.netMt` | = 4,370 − 2,650. | |
| 6.3 | Per-student net: **5.06 mtCO₂e/student/yr** | (computed) | = 1,720 ÷ 340 enrolled students. Within the 2–15 mtCO₂e/student envelope reported across HEI footprint studies (Gutiérrez-Mosquera et al. 2024). | |
| 6.4 | Scope 3 dominates: **60% of gross** | (computed) | 2,635 ÷ 4,370. Consistent with Kool 2025 directional finding that indirect emissions dominate at residential institutions. | |

---

## Section 7 — Methodology spot-check

These don't require KUA-specific records — they're sanity checks anyone can do against published references in an hour.

| # | Dashboard claims | Independent check |
|---|---|---|
| 7.1 | Effective ISO-NE grid factor 0.235 kg/kWh in 2024 | ISO-NE Electric Generator Air Emissions Report 2024 (public PDF). Per-fuel output-basis factors × generation-mix shares. |
| 7.2 | Heating oil 10.16 kg CO₂/gal, propane 5.72 kg CO₂/gal | EPA GHG Emission Factors Hub (April 2024 update), Stationary Combustion table. |
| 7.3 | Per-pax-km air travel factor (long-haul ~0.241 kg with radiative forcing) | DEFRA 2024 conversion factors. |
| 7.4 | Forest sequestration 2.1–4.2 mt/acre/yr | Birdsey (1992) — US Forest Service GTR-NE-220; Nowak et al. (2013) Urban Forestry & Urban Greening. |
| 7.5 | Heat pump COP 3.0 (used in /scenarios simulator) | NREL cold-climate heat pump field studies; conservative seasonal average for NH. |
| 7.6 | All factors versioned + cited on /methodology | Visit `/methodology`. Every row should have a source link. If any row says "TODO" or has no citation, flag it. |

---

## Reviewer's overall conclusion

After working through Sections 1–7, the reviewer should be able to answer these three questions for the capstone defense:

1. **Is the Scope 2 number trustworthy?** (Should be yes — it's the only measured scope, all inputs are auditable, factors are public.)
2. **Are the Scope 1 + Scope 3 placeholders within reasonable bands for what real records will show?** (Should be yes for most lines, with explicit "this needs measured data before publication" caveats on the wider lines like purchased goods.)
3. **Are the published methodologies (factors, formulas, citations) reproducible by someone with public access?** (Should be yes; the entire `src/data/` directory + `/methodology` page is open source.)

If any of the three is "no" or "unclear," that's where the capstone author should focus next.

---

## When to re-run this sheet

- **After each new month of BMS data lands** → re-run `node scripts/captureHeadlineNumbers.mjs` and update Section 1 numbers
- **After KUA Facilities provides any new record** (fuel invoice, fleet log, refrigerant report, Sodexo invoice, etc.) → flip the corresponding Scope 1 or Scope 3 line from estimated to measured, then re-run this sheet
- **Before any external citation** of the dashboard's headline numbers → re-run this sheet end-to-end
