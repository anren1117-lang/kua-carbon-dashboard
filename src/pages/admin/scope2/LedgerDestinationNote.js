import React from 'react';
import { rowsToLedgerInputs, SOURCE_MASTER, SOURCE_FEED_SUM } from '../../../data/electricityLedger.js';
import { rowsToBuildingMonths, SOURCE_BUILDING_MONTHLY } from '../../../data/buildingMonths.js';

const styles = {
  ok: {
    marginTop: 8, padding: '10px 14px', borderRadius: 8,
    border: '1px solid #14532d', background: '#0b1f12',
    color: '#86efac', fontSize: 13, lineHeight: 1.55,
  },
  bad: {
    marginTop: 8, padding: '10px 14px', borderRadius: 8,
    border: '1px solid #7f1d1d', background: '#2a0d10',
    color: '#fca5a5', fontSize: 13, lineHeight: 1.55,
  },
  strong: { fontWeight: 700 },
  hint: { color: '#94a3b8', marginTop: 6 },
  code: { color: '#fcd34d' },
};

// A row in scope2_meter_readings has three possible destinations, and the
// form's own default reached none of them.
//
//   campus ledger      source bms_master_monthly | meter_trends_feed_sum,
//                      no building, whole calendar month for a master total
//   per-building       source building_monthly, with a building, whole month
//   nowhere            anything else
//
// `source` is a free-text field whose placeholder suggests "campus_meter", and
// the form seeds exactly that. rowsToLedgerInputs rejects it as 'not a ledger
// source', so the row saves, appears in the admin table, counts in
// /admin/data-quality's row count — and never reaches Scope 2. An admin
// entering a real campus reading would see a green "saved" beside an unchanged
// figure, which is indistinguishable from the dashboard being broken.
//
// This runs BOTH real filters on the in-progress row — the same functions the
// dashboard composes with, not a re-derivation — and says which destination
// the row will actually reach, naming the exact reason when the answer is none.
export function LedgerDestinationNote({ row }) {
  if (!row || row.kwh === '' || row.kwh === null || row.kwh === undefined) return null;

  // Match the payload the form submits: kWh is a string in form state.
  const probe = { ...row, id: '__probe__', kwh: Number(row.kwh) };

  const ledger = rowsToLedgerInputs([probe]);
  if (ledger.masterMonths.length > 0) {
    return (
      <div style={styles.ok} role="status">
        Counts toward Scope 2 as a <span style={styles.strong}>campus master-meter total</span>.
      </div>
    );
  }
  if (ledger.feedMonths.length > 0) {
    const eligible = ledger.feedMonths[0].calibrationEligible;
    return (
      <div style={styles.ok} role="status">
        Counts toward Scope 2 as a <span style={styles.strong}>campus feed-sum</span>
        {eligible
          ? ' and is eligible to calibrate the feed→master scale.'
          : ', but not for calibrating the scale (it is marked estimated or covers a partial month).'}
      </div>
    );
  }

  const building = rowsToBuildingMonths([probe]);
  if (Object.keys(building.history || {}).length > 0) {
    return (
      <div style={styles.ok} role="status">
        Counts as a <span style={styles.strong}>per-building monthly reading</span> for{' '}
        <code style={styles.code}>{row.building}</code>. The campus ledger ignores
        building rows by design — this feeds the building views instead.
      </div>
    );
  }

  const reason = ledger.ignored[0]?.reason || 'it does not match any ledger rule';
  return (
    <div style={styles.bad} role="status">
      <span style={styles.strong}>This row will not reach any total</span> — {reason}.
      It will still save, and it will still be counted as a row on /admin/data-quality.
      <div style={styles.hint}>
        For a campus figure, set the source pointer to{' '}
        <code style={styles.code}>{SOURCE_MASTER}</code> (a whole-month master-meter
        total) or <code style={styles.code}>{SOURCE_FEED_SUM}</code> (a feed-sum), and
        leave Building blank. For one building, use{' '}
        <code style={styles.code}>{SOURCE_BUILDING_MONTHLY}</code> with a whole calendar month.
      </div>
    </div>
  );
}
