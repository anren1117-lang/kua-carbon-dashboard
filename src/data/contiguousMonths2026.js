// Reconciled monthly campus electricity for the months without a
// master-meter capture yet (May 1 – Sep 14, 2026), from the contiguous daily
// Meter Trends export MeterTrends_20260915 (midnight readings Jan 1 – Sep 15).
//
// Regenerate every number below with:
//   node scripts/sumMonthlyFeeds.mjs <daily-export.csv>
//
// Day boundaries: each counter reading is stamped at local midnight, so the
// Sep 15 00:00 reading closes Sep 14 — the export is complete through Sep 14.
//
// Why reconciliation: the export sums the 35 campus service-entrance and
// panel feeds (isCampusFeed in src/data/campusFeeds.js), which run
// ~14% ABOVE the BMS "All Meters" master-meter total. Measured over Feb–Apr,
// where both exist with near-complete feed coverage: master 450,949 kWh ÷
// feed-sum 515,940 kWh = 0.8740 (per-month 0.856–0.884, within about ±2%).
//
// January is left out of the ratio and is UNRESOLVED: eight feeds, including
// PM_21_MainFeed, have no readings Jan 1–19 (two tiny panel feeds start in
// February). Filling those gaps from each feed's late-January daily mean adds
// ~25,400 kWh (12%) and puts January's ratio at ~0.77 — well below Feb–Apr.
// If that were the true relationship, the scaled months would be ~12% lower
// and the annual Scope 2 roughly 370 mtCO₂e instead of 390. We can't tell
// whether those feeds were dark or unlogged, so the spring ratio stands, with
// that disclosed.
//
// Solar: the field array produced ~9,200 kWh in Feb, ~7,600 in Mar and ~0 in
// Apr (offline Apr–Jun) while the ratio went 0.884 → 0.856 → 0.880, so no
// separate solar adjustment is applied.
//
// Provenance: MEASURED daily counters, RECONCILED (scaled) to the master
// meter. The flat scale is the load-bearing assumption — it carries the
// late-winter/spring feed-to-master relationship into summer. Treat these as
// ±3% if that relationship holds, and possibly ~12% high given January.
// Replace any month with a true master-meter monthly capture when one lands;
// that's ground truth and needs no scale factor.

export const FEED_TO_MASTER_SCALE = +(450949 / 515940).toFixed(4); // 0.8740

// Signed campus feed-sum by month (scripts/sumMonthlyFeeds.mjs).
const FEED_SUM_KWH = {
  '2026-05': 141633,
  '2026-06': 99338,
  '2026-07': 116706,
  '2026-08': 108621,
  '2026-09': 75896, // PARTIAL: Sep 1–14
};

export const CONTIGUOUS_LAST_DAY = '2026-09-14';
const PARTIAL_MONTHS = { '2026-09': 14 };

function daysInMonth(monthKey) {
  const [y, m] = monthKey.split('-').map((s) => parseInt(s, 10));
  return new Date(y, m, 0).getDate();
}

/** @type {{month:string, kwh:number, days:number, partial:boolean, provenance:string, source:string}[]} */
export const reconciledMonths = Object.entries(FEED_SUM_KWH).map(([month, feedKwh]) => ({
  month,
  kwh: Math.round(feedKwh * FEED_TO_MASTER_SCALE),
  days: PARTIAL_MONTHS[month] ?? daysInMonth(month),
  partial: month in PARTIAL_MONTHS,
  provenance: 'reconciled',
  source: 'src/data/contiguousMonths2026.js (MeterTrends_20260915 daily export, feed-sum × master-meter scale)',
}));
