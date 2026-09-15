// Electricity ledger — the single place Scope 2 kWh is composed, whether the
// month-level inputs come from the seed data files or from admin entries in
// Supabase (scope2_meter_readings). Pure functions only: the Scope 2 hook and
// the admin preview both call these, so what an admin previews is exactly
// what the public page will show.
//
// Two month-level input series:
//   • master months — the BMS All Meters "Totals" row for a calendar month
//     (ground truth; always a whole month)
//   • feed months   — the signed campus feed-sum for a month from a daily
//     Meter Trends export (src/data/feedMonthSums.js); may be partial
//
// Composition rules:
//   1. Per month, a master total wins. Otherwise the feed-sum is scaled to
//      master-meter equivalent.
//   2. Scale = Σ master ÷ Σ feed over months that have both AND whose feed
//      month is calibration-eligible (every day present, coverage complete).
//      With no such month there is no scale, and feed-only months can't count.
//   3. The YTD runs contiguously from Jan 1: it stops at the first missing
//      month and after the first partial month. Later months come back as
//      `uncounted`, with the reason, so an admin can see why they aren't live.
//   4. Range labels ("Jan–Apr") are derived here, so page copy never
//      hardcodes which months came from which source.

export const SOURCE_MASTER = 'bms_master_monthly';
export const SOURCE_FEED_SUM = 'meter_trends_feed_sum';

export const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// A master ÷ feed ratio outside this band is a data-entry error, not a
// calibration — the two sources measure the same campus.
export const RATIO_SANITY_MIN = 0.5;
export const RATIO_SANITY_MAX = 1.5;

export function daysInMonthKey(key) {
  const [y, m] = key.split('-').map((s) => parseInt(s, 10));
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

function daysBetweenInclusive(startIso, endIso) {
  const a = Date.parse(`${startIso}T00:00:00Z`);
  const b = Date.parse(`${endIso}T00:00:00Z`);
  return Math.round((b - a) / 86400000) + 1;
}

/** ['2026-01', '2026-02', '2026-04'] → 'Jan–Feb, Apr'. Empty → ''. Single year. */
export function monthRangeLabel(monthKeys) {
  const idx = [...new Set(monthKeys)].sort().map((k) => parseInt(k.slice(5, 7), 10) - 1);
  const runs = [];
  for (const i of idx) {
    const last = runs[runs.length - 1];
    if (last && i === last[1] + 1) last[1] = i;
    else runs.push([i, i]);
  }
  return runs.map(([a, b]) => (a === b ? MONTH_ABBR[a] : `${MONTH_ABBR[a]}–${MONTH_ABBR[b]}`)).join(', ');
}

/**
 * scope2_meter_readings rows → ledger inputs. Only campus-wide rows (no
 * building) with a ledger `source`, covering one calendar month from the 1st,
 * are used; everything else comes back in `ignored` with a reason. Later rows
 * win over earlier ones for the same month and source, so pass rows ordered
 * oldest → newest.
 */
export function rowsToLedgerInputs(rows) {
  const master = new Map();
  const feed = new Map();
  const ignored = [];
  for (const r of Array.isArray(rows) ? rows : []) {
    const start = String(r?.period_start ?? '').slice(0, 10);
    const end = String(r?.period_end ?? '').slice(0, 10);
    const month = start.slice(0, 7);
    const kwh = Number(r?.kwh);
    const reject = (reason) => ignored.push({ id: r?.id ?? null, month: month || null, reason });

    if (r?.source !== SOURCE_MASTER && r?.source !== SOURCE_FEED_SUM) { reject('not a ledger source'); continue; }
    if (r.building) { reject('building-level row — the ledger is campus-wide'); continue; }
    if (!/^\d{4}-\d{2}-01$/.test(start) || end.slice(0, 7) !== month || end < start) {
      reject('period must start on the 1st and end in the same month');
      continue;
    }
    if (r.kwh === null || r.kwh === '' || !Number.isFinite(kwh)) { reject('kWh is not a number'); continue; }
    if (!(kwh > 0)) { reject('kWh must be greater than zero'); continue; }

    const days = daysBetweenInclusive(start, end);
    const calendarDays = daysInMonthKey(month);
    // r.notes is admin-facing (filenames, capture details) and must never
    // reach the public page, so the ledger note is derived from the data.
    const coverageNote = days === calendarDays ? null : `${days} of ${calendarDays} days had readings`;
    if (r.source === SOURCE_MASTER) {
      if (days !== calendarDays) { reject('a master-meter total must cover the whole month'); continue; }
      master.set(month, { month, kwh, source: 'Admin entry · BMS All Meters total', note: null, adminNote: r.notes || null });
    } else {
      feed.set(month, {
        month,
        kwh,
        days,
        calibrationEligible: r.data_quality === 'measured' && days === calendarDays,
        estimated: r.data_quality !== 'measured',
        source: 'Admin upload · daily Meter Trends feed-sum',
        note: coverageNote,
        adminNote: r.notes || null,
      });
    }
  }
  return { masterMonths: [...master.values()], feedMonths: [...feed.values()], ignored };
}

/** Month-by-month overlay: an override month replaces the seed month in the same series. */
export function mergeLedgerInputs(seed, override) {
  const merge = (a = [], b = []) => {
    const byMonth = new Map(a.map((x) => [x.month, x]));
    for (const x of b) {
      const seeded = byMonth.get(x.month);
      // Carry a structural caveat (e.g. "these feeds were dark in January")
      // onto a replacement that still isn't calibration-ready, so re-uploading
      // a month can't quietly delete its disclosure.
      const note = x.note ?? (seeded && x.calibrationEligible === false ? seeded.note ?? null : null);
      byMonth.set(x.month, { ...x, note });
    }
    return [...byMonth.values()].sort((x, y) => x.month.localeCompare(y.month));
  };
  return {
    masterMonths: merge(seed?.masterMonths, override?.masterMonths),
    feedMonths: merge(seed?.feedMonths, override?.feedMonths),
  };
}

/**
 * @param {{ masterMonths?: {month:string, kwh:number, source:string, note?:string|null}[],
 *           feedMonths?: {month:string, kwh:number, days:number, calibrationEligible:boolean, source:string, note?:string|null}[],
 *           year?: number }} inputs
 */
export function composeElectricityLedger({ masterMonths = [], feedMonths = [], year } = {}) {
  const master = new Map(masterMonths.map((m) => [m.month, m]));
  const feed = new Map(feedMonths.map((m) => [m.month, m]));

  // Calibrate across every year on record — the feed-to-master relationship
  // isn't tied to a calendar year. A month whose two sources disagree wildly
  // is a data-entry error, not a calibration: it can't set the scale.
  const bothMonths = [...master.keys()].filter((k) => feed.has(k)).sort();
  const ratioFor = (k) => master.get(k).kwh / feed.get(k).kwh;
  const inRange = (r) => r >= RATIO_SANITY_MIN && r <= RATIO_SANITY_MAX;
  const calMonths = bothMonths.filter((k) => (
    feed.get(k).calibrationEligible && feed.get(k).kwh > 0 && master.get(k).kwh > 0 && inRange(ratioFor(k))
  ));
  const calMasterKwh = calMonths.reduce((s, k) => s + master.get(k).kwh, 0);
  const calFeedKwh = calMonths.reduce((s, k) => s + feed.get(k).kwh, 0);
  const scale = calMonths.length > 0 && calFeedKwh > 0
    ? {
      value: +(calMasterKwh / calFeedKwh).toFixed(4),
      months: calMonths,
      masterKwh: calMasterKwh,
      feedKwh: calFeedKwh,
      perMonth: calMonths.map((k) => ({ month: k, ratio: +(master.get(k).kwh / feed.get(k).kwh).toFixed(3) })),
      // Months with both sources that couldn't calibrate, with why.
      excluded: bothMonths
        .filter((k) => !calMonths.includes(k))
        .map((k) => {
          const ratio = ratioFor(k);
          return {
            month: k,
            note: Number.isFinite(ratio) && !inRange(ratio)
              ? `The master total and the building-feed total for this month differ by more than half (ratio ${ratio.toFixed(2)}), so it can’t set the scale — worth re-checking both figures.`
              : feed.get(k).note || null,
          };
        }),
    }
    : null;

  const allKeys = [...master.keys(), ...feed.keys()].sort();
  const years = [...new Set(allKeys.map((k) => k.slice(0, 4)))].sort();
  // The page reports one calendar year at a time, and a year-to-date only
  // means something from January — so use the latest year that HAS a January.
  // A stray future-dated row (a typo, or one month of next year) can't wipe
  // the year on the page on its own.
  const y = year ?? parseInt(
    [...years].reverse().find((yr) => master.has(`${yr}-01`) || feed.has(`${yr}-01`))
      ?? years[years.length - 1]
      ?? String(new Date().getUTCFullYear()),
    10,
  );

  const counted = [];
  const uncounted = [];
  // Months of other years aren't lost silently — say so, with the count.
  for (const yr of years) {
    if (parseInt(yr, 10) === y) continue;
    const n = allKeys.filter((k) => k.slice(0, 4) === yr).length;
    uncounted.push({
      month: `${yr}-01`,
      reason: `${n} month${n === 1 ? '' : 's'} of ${yr} — the page reports one calendar year at a time, currently ${y}`,
    });
  }
  let closedBy = null; // why the contiguous run ended, once it has
  for (let i = 0; i < 12; i++) {
    const key = `${y}-${String(i + 1).padStart(2, '0')}`;
    const calendarDays = daysInMonthKey(key);
    let entry = null;
    if (master.has(key)) {
      const m = master.get(key);
      entry = { month: key, kwh: m.kwh, days: calendarDays, calendarDays, provenance: 'master', source: m.source, note: m.note ?? null };
    } else if (feed.has(key)) {
      const f = feed.get(key);
      if (!scale) {
        uncounted.push({ month: key, reason: 'no master-meter month to calibrate the feed scale against' });
        closedBy = closedBy ?? `${MONTH_ABBR[i]} can't be scaled yet`;
        continue;
      }
      entry = {
        month: key,
        kwh: Math.round(f.kwh * scale.value),
        feedKwh: f.kwh,
        days: f.days,
        calendarDays,
        provenance: 'scaled',
        estimated: f.estimated === true,
        source: f.source,
        note: f.note ?? null,
      };
    }
    if (!entry) {
      closedBy = closedBy ?? `${MONTH_ABBR[i]} ${y} has no data`;
      continue;
    }
    if (closedBy) {
      uncounted.push({ ...entry, reason: `after a break in the record (${closedBy})` });
      continue;
    }
    counted.push(entry);
    if (entry.days < calendarDays) closedBy = `${MONTH_ABBR[i]} is a partial month`;
  }

  const last = counted[counted.length - 1];
  return {
    year: y,
    months: counted,
    uncounted,
    scale,
    asOf: last ? `${last.month}-${String(last.days).padStart(2, '0')}` : null,
    ytdKwh: counted.reduce((s, m) => s + m.kwh, 0),
    ytdDays: counted.reduce((s, m) => s + m.days, 0),
    ranges: {
      master: monthRangeLabel(counted.filter((m) => m.provenance === 'master').map((m) => m.month)),
      scaled: monthRangeLabel(counted.filter((m) => m.provenance === 'scaled').map((m) => m.month)),
    },
  };
}

/** Plain-language summary of where the counted months came from, e.g.
 *  "master-meter totals for Jan–Apr, then building-feed totals from the daily
 *  Meter Trends export for May–Sep, scaled to master-meter equivalent". */
export function ledgerSourceText(ledger) {
  const { master, scaled } = ledger.ranges;
  if (!master && !scaled) return 'no measured months yet';
  // "then" only reads right when the two sources don't interleave.
  const joiner = master ? (master.includes(',') || scaled.includes(',') ? 'with ' : 'then ') : '';
  return [
    master && `master-meter totals for ${master}`,
    scaled && `${joiner}building-feed totals from the daily Meter Trends export for ${scaled}, scaled to master-meter equivalent`,
  ].filter(Boolean).join(', ');
}

/** Ledger months → the YTD composition rows the Scope 2 table renders. */
export function ledgerToYtdComponents(ledger) {
  return ledger.months.map((m) => {
    const [yyyy, mm] = m.month.split('-');
    const abbr = MONTH_ABBR[parseInt(mm, 10) - 1];
    const label = m.days < m.calendarDays ? `${abbr} 1–${m.days} ${yyyy}` : `${abbr} ${yyyy}`;
    return {
      label,
      period: m.month,
      kwh: m.kwh,
      days: m.days,
      source: m.source,
      estimated: m.estimated === true,
      ...(m.provenance === 'scaled' ? { reconciled: true } : {}),
    };
  });
}

/**
 * Seasonally anchored Year 1 projection. Each measured month implies an
 * annual total via kWh ÷ (its seasonal share × fraction of the month
 * covered); the fraction-weighted mean of those is the calibrated annual.
 * Unmeasured months (and the rest of a partial month) are projected as
 * calibrated annual × seasonal share.
 * @param {{period:string, days:number, kwh:number}[]} components
 * @param {{month:string, multiplier:number}[]} pattern  12 entries, Jan → Dec
 */
export function projectYear1(components, pattern) {
  const multSum = pattern.reduce((s, m) => s + m.multiplier, 0);
  const share = pattern.map((m) => m.multiplier / multSum);

  const coverage = components
    .map((c) => {
      const monthIdx = parseInt(c.period.slice(5), 10) - 1;
      if (!(monthIdx >= 0 && monthIdx < 12)) return null;
      return { monthIdx, frac: Math.min(1, c.days / daysInMonthKey(c.period)), kwh: c.kwh };
    })
    .filter(Boolean);

  const implied = coverage
    .filter((x) => x.frac > 0 && share[x.monthIdx] > 0)
    .map((x) => ({ implied: x.kwh / (share[x.monthIdx] * x.frac), weight: x.frac }));
  const weightSum = implied.reduce((s, v) => s + v.weight, 0);
  const ytdKwh = components.reduce((s, c) => s + c.kwh, 0);
  const ytdDays = components.reduce((s, c) => s + c.days, 0);
  const calibratedAnnual = weightSum > 0
    ? implied.reduce((s, v) => s + v.implied * v.weight, 0) / weightSum
    : (ytdDays > 0 ? ytdKwh * (365 / ytdDays) : 0);

  const covered = new Map(); // monthIdx → { kwh, frac }
  for (const x of coverage) {
    const cur = covered.get(x.monthIdx) || { kwh: 0, frac: 0 };
    covered.set(x.monthIdx, { kwh: cur.kwh + x.kwh, frac: cur.frac + x.frac });
  }

  const months = [];
  for (let i = 0; i < 12; i++) {
    const c = covered.get(i);
    const monthFullKwh = calibratedAnnual * share[i];
    if (!c || c.frac >= 1) {
      months.push({
        monthIdx: i,
        label: pattern[i].month,
        kwh: c ? c.kwh : monthFullKwh,
        provenance: c ? 'measured' : 'projected',
        fracMeasured: c ? c.frac : 0,
      });
    } else {
      months.push({
        monthIdx: i,
        label: pattern[i].month,
        kwh: c.kwh + monthFullKwh * (1 - c.frac),
        provenance: 'mixed',
        fracMeasured: c.frac,
      });
    }
  }
  return { months, year1Kwh: Math.round(months.reduce((s, m) => s + m.kwh, 0)), calibratedAnnual };
}
