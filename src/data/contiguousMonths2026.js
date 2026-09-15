// SEED campus feed-sums by month from the contiguous daily Meter Trends export
// MeterTrends_20260915 (midnight readings Jan 1 – Sep 15, 2026). These feed
// the electricity ledger (src/data/electricityLedger.js) as the fallback when
// no admin upload covers a month; an upload on /admin/scope-2/meter-trends
// replaces the matching month.
//
// Regenerate every number below with:
//   node scripts/sumMonthlyFeeds.mjs <daily-export.csv>
//
// Day boundaries: each counter reading is stamped at local midnight, so the
// Sep 15 00:00 reading closes Sep 14 — the export is complete through Sep 14.
//
// Why these get scaled: the export sums the 35 campus service-entrance and
// panel feeds (isCampusFeed in src/data/campusFeeds.js), which run ~14% ABOVE
// the BMS "All Meters" master-meter total. The ledger calibrates master ÷
// feed-sum over months that have both with near-complete feed coverage —
// here Feb–Apr: 450,949 ÷ 515,940 = 0.8740 (per-month 0.856–0.884).
//
// January is not calibration-eligible and is UNRESOLVED: eight feeds,
// including PM_21_MainFeed, have no readings Jan 1–19 (two tiny panel feeds
// start in February). Filling those gaps from each feed's late-January daily
// mean adds ~25,400 kWh (12%) and puts January's ratio at ~0.77 — well below
// Feb–Apr. If that were the true relationship, the scaled months would be ~12%
// lower and the annual Scope 2 roughly 370 mtCO₂e instead of 390. We can't
// tell whether those feeds were dark or unlogged, so the spring ratio stands,
// with that disclosed.
//
// Solar: the field array produced ~9,200 kWh in Feb, ~7,600 in Mar and ~0 in
// Apr (offline Apr–Jun) while the ratio went 0.884 → 0.856 → 0.880, so no
// separate solar adjustment is applied.
//
// Provenance: MEASURED daily counters, RECONCILED (scaled) to the master
// meter. The flat scale is the load-bearing assumption — it carries the
// late-winter/spring feed-to-master relationship into summer. Treat scaled
// months as ±3% if that relationship holds, and possibly ~12% high given
// January. A master-meter total for any month replaces its scaled value.

export const SEED_FEED_SOURCE =
  'src/data/contiguousMonths2026.js (MeterTrends_20260915 daily export, feed-sum × master-meter scale)';

export const JANUARY_2026_SCALE_NOTE =
  'Eight feeds have no readings Jan 1–19. Filling those gaps from late-January averages puts January’s ratio near 0.77, which would make the scaled months about 12% lower and the annual closer to 370 mtCO₂e.';

/** Signed campus feed-sum per month (scripts/sumMonthlyFeeds.mjs). */
export const seedFeedMonths = [
  { month: '2026-01', kwh: 209323, days: 31, calibrationEligible: false, note: JANUARY_2026_SCALE_NOTE },
  { month: '2026-02', kwh: 209867, days: 28, calibrationEligible: true },
  { month: '2026-03', kwh: 159535, days: 31, calibrationEligible: true },
  { month: '2026-04', kwh: 146538, days: 30, calibrationEligible: true },
  { month: '2026-05', kwh: 141633, days: 31, calibrationEligible: true },
  { month: '2026-06', kwh: 99338, days: 30, calibrationEligible: true },
  { month: '2026-07', kwh: 116706, days: 31, calibrationEligible: true },
  { month: '2026-08', kwh: 108621, days: 31, calibrationEligible: true },
  { month: '2026-09', kwh: 75896, days: 14, calibrationEligible: false }, // PARTIAL: Sep 1–14
].map((m) => ({ note: null, ...m, source: SEED_FEED_SOURCE }));
