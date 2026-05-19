# AI Ingestion Benchmark — Q3 Protocol

This document describes how to populate the benchmark dataset that
answers the capstone's third research question:

> **Q3: How accurate is the AI ingestion agent?**
> - Target: ≥ 95% on routine fields (date, kWh, gallons)
> - Target: 100% on safety-critical fields (account numbers, units)

The dashboard ships the runner + scoring logic + empty data shape
in this commit; the gating step before Q3 can be answered is **adding
real ground-truth-tagged source documents** to the benchmark file.

---

## File layout

```
docs/
  ai-ingestion-benchmark.md             ← this file
  ai-ingestion-benchmark-results.json   ← (generated; gitignored if you wish)
  benchmark-samples/                    ← optional: sanitized copies of source docs
    heating-oil-2025-12.txt
    dining-2026-03.txt
    travel-itinerary-2026-04.txt
    ...
scripts/
  runAiBenchmark.mjs                    ← the runner
src/data/
  aiIngestionBenchmark.js               ← typed data shape + scoring helpers
```

---

## Step 1: Collect source documents

Aim for **5–10 documents** covering the categories the agent should handle
in production. Diversity matters more than count for the first pass.

Suggested coverage:

- **2 heating-oil invoices** (different months, same vendor; or same month, different vendors)
- **1 propane invoice**
- **1 monthly electricity bill** (utility — even though Scope 2 is BMS-driven, the agent should still handle a bill if dropped)
- **1 Sodexo / SAGE monthly food invoice**
- **1 student travel itinerary** (international flight booking PDF)
- **1 waste hauler monthly report**
- **1 fleet fuel-card statement**
- **1 refrigerant service report**
- **1 procurement purchase order** (paper, IT, cleaning — whatever's representative)

**PII handling:** before committing any document to the benchmark, strip:
- Student names + grades + dorm assignments
- Staff personal addresses + phone numbers
- Credit card numbers
- Anything that would violate FERPA or general privacy norms

Vendor account numbers + KUA-side account references can stay (and are
specifically what the "safety-critical" tag tests).

You can either:
- **(A)** Paste the document's full text directly into the `sourceText`
  field of the benchmark entry, or
- **(B)** Save a sanitized copy at `docs/benchmark-samples/<name>.txt`
  and reference it in `sourceFile` (loader script can resolve this).

Option A is simpler for the runner; B is cleaner if you want to keep
multi-paragraph documents out of the JS file.

---

## Step 2: Tag the ground truth

For each document, add a new entry to the `benchmarkCases` array in
`src/data/aiIngestionBenchmark.js`. Use the inline example at the top
of that file as a template.

Each row should list every field the agent **should** extract, in the
following format:

```js
{
  key: 'gallons',         // field name the agent returns
  expected: 2480,         // ground-truth value
  matchType: 'numeric',   // 'exact' | 'numeric' | 'date' | 'fuzzy'
  tolerance: 0.01,        // numeric: ±1%; date: ±N days
  safetyCritical: false,  // true for account numbers, units, etc.
}
```

### Match types — when to use which

| matchType | Use for | Notes |
|---|---|---|
| `exact` | enum values (`'heating_oil'`, `'gallons'`, `'tons'`), short strings where any variation = wrong | Case-insensitive, trimmed |
| `numeric` | gallons, kWh, mt, $ amounts | Default tolerance ±1%; bump for noisy fields |
| `date` | delivery dates, period-end dates | Default tolerance 0 days; bump to ±1–2 for fuzzy month-end |
| `fuzzy` | vendor names, addresses, free-text labels | Substring match either direction |

### Safety-critical fields

Tag a field as `safetyCritical: true` when getting it wrong creates
real downstream harm:

- **Account numbers** — wrong account → wrong building gets billed
- **Units** — gallons vs liters vs MMBtu mistakes propagate everywhere
- **Fuel type** — heating oil vs propane have different emission factors
- **Building / meter assignments** — affects per-building rollups
- **Period dates** — wrong month assigns emissions to wrong year

These fields are scored against the 100% target. Routine fields
(quantities, free-text descriptions) are scored against ≥95%.

---

## Step 3: Run the benchmark

Local (against your dev server):

```bash
# Terminal 1
cd src && npm run dev

# Terminal 2
node scripts/runAiBenchmark.mjs
```

Production (against the deployed dashboard):

```bash
API_BASE=https://kua-carbon-dashboard.vercel.app \
  ADMIN_TOKEN=$YOUR_ADMIN_TOKEN \
  node scripts/runAiBenchmark.mjs
```

Output:
- Per-case stdout report: `case_id    8/10 fields (80%) · safety 2/2`
- Overall stdout summary with pass/fail vs. the targets
- `docs/ai-ingestion-benchmark-results.json` — full machine-readable
  results, including the extracted vs. expected diff for every field

Exit code: 0 if all targets met, 1 if any target missed, 2 on fatal
error (network etc.).

---

## Step 4: Iterate

The runner output is the feedback signal for prompt / extraction
improvements. Typical iteration:

1. Run, see which fields fail
2. Look at the agent prompt in `api/admin/ai-ingestion.js` or wherever
   the extraction logic lives
3. Tighten the prompt (e.g. "always return gallons in US gallons, never
   liters" if unit confusion is the failure mode)
4. Re-run; confirm the fix and that nothing else regressed

When everything passes, **commit `docs/ai-ingestion-benchmark-results.json`** —
that file becomes the citation for the accuracy claim in the
capstone paper.

---

## Step 5: Publish (Priority 4)

Once results exist, build `/admin/ai-accuracy` that reads
`ai-ingestion-benchmark-results.json` and renders:

- Headline numbers (routine % + safety-critical %)
- Per-field accuracy table
- A "worked examples" gallery: pick 3–5 cases, show the source text +
  the agent's extraction + the human-verified ground truth side-by-side

This is the artifact the paper cites and that external reviewers can
verify without running the runner themselves.

---

## Why this format

- **Tagged once, run forever.** The benchmark file is committed to the
  repo. Every prompt change, every model upgrade, every dependency bump
  can re-run the benchmark and confirm no regression.
- **The agent is judged by data, not vibes.** A "the agent works pretty
  well" claim is unverifiable. A "92.4% routine accuracy on 47 fields
  across 8 documents" claim is reproducible.
- **External validation possible.** A faculty reviewer with the repo
  cloned can run `node scripts/runAiBenchmark.mjs` and replicate the
  numbers in the paper.
- **Scoring is in code.** `fieldMatches()` + `scoreCase()` live in
  `src/data/aiIngestionBenchmark.js`. The scoring rules are part of the
  audit trail, not buried in prose.

---

## Open question for the capstone

Once results land, the paper should report not just **accuracy** but
**calibration** — when the agent says "high confidence," how often is
it actually right? The current `aiIngestionBenchmark.js` shape doesn't
yet capture agent confidence scores; that's a small extension when the
benchmark is populated (add `extractedConfidence` to the scored output,
group accuracy by reported-confidence bucket, plot).
