// Deterministic alert evaluator. Walks the admin data-table sources,
// asks Supabase for each table's row count + most-recent timestamp,
// and emits an alert per table that's stale or empty past its cadence.
//
// This is the server-side counterpart to AdminDataQuality's freshness
// pills — same data shape, same buckets — but headless and run from
// the daily cron at /api/cron/check-alerts.
//
// Pure function over Supabase: the cron passes in a Supabase client
// (or null) and the evaluator does the rest. Returning null for the
// client is treated as "no data layer wired up; nothing to evaluate"
// rather than an error, so a fresh deploy without Supabase env vars
// doesn't spam alerts about missing tables.

import { ADMIN_TABLE_SOURCES } from '../data/adminTableSources.js';
import { freshnessBucket, daysSince } from './freshness.js';

/**
 * @param {object} args
 * @param {object|null} args.supabase  A Supabase server client, or null. When null the evaluator returns no alerts.
 * @param {Date=} args.now             Override "now" for tests.
 * @returns {Promise<{ alerts: Alert[], checkedAt: string, tablesChecked: number, supabaseConfigured: boolean }>}
 *
 * @typedef {Object} Alert
 * @property {string} id           Stable id, e.g. "stale:scope1_heating_oil"
 * @property {'stale_table'|'empty_table'} kind
 * @property {'high'|'medium'} severity
 * @property {string} title
 * @property {string} description
 * @property {string} table
 * @property {string} tableLabel
 * @property {string} scope
 * @property {number|null} daysSince
 * @property {string=} cta
 */
export async function evaluateAlerts({ supabase, now } = {}) {
  const checkedAt = (now instanceof Date ? now : new Date()).toISOString();
  if (!supabase) {
    return { alerts: [], checkedAt, tablesChecked: 0, supabaseConfigured: false };
  }

  // Query every admin-known table in parallel for count + last timestamp.
  const stats = await Promise.all(
    ADMIN_TABLE_SOURCES.map(async (src) => {
      try {
        const [{ count }, { data }] = await Promise.all([
          supabase.from(src.table).select('*', { count: 'exact', head: true }),
          supabase.from(src.table).select(src.tsCol).order(src.tsCol, { ascending: false }).limit(1),
        ]);
        const lastUpdated = Array.isArray(data) && data.length > 0 ? data[0][src.tsCol] : null;
        return { src, count: count ?? 0, lastUpdated, error: null };
      } catch (err) {
        return { src, count: 0, lastUpdated: null, error: err?.message || 'fetch failed' };
      }
    })
  );

  const alerts = [];
  for (const { src, count, lastUpdated, error } of stats) {
    if (error) continue;  // Don't alert on transient query failures.

    const bucket = freshnessBucket({ count, lastUpdated }, src.cadence, now);
    const days = lastUpdated ? daysSince(lastUpdated, now) : null;

    if (bucket === 'stale') {
      // The table has rows but the newest is past the cadence window.
      alerts.push({
        id: `stale:${src.table}`,
        kind: 'stale_table',
        severity: 'high',
        title: `${src.tableLabel || src.label || src.table} hasn't been updated in ${days ?? 'a while'} days`,
        description: `The "${src.label || src.table}" table is past its expected ${src.cadence} update cadence. Last entry was ${days ?? '?'} days ago — your ${src.scope} numbers on the dashboard may be drifting.`,
        table: src.table,
        tableLabel: src.label || src.table,
        scope: src.scope,
        daysSince: days,
        cta: src.cta,
      });
    } else if (bucket === 'empty') {
      // The table has no rows at all — only flag this as an alert for
      // tables we'd expect to have data by now (skip 'irregular'
      // cadence which is intentionally event-driven).
      if (src.cadence === 'irregular') continue;
      alerts.push({
        id: `empty:${src.table}`,
        kind: 'empty_table',
        severity: 'medium',
        title: `${src.label || src.table} table has no data yet`,
        description: `The "${src.label || src.table}" table is empty. Without it, ${src.scope} is computed from the estimated placeholder rather than measured data — your dashboard is missing this scope's real numbers.`,
        table: src.table,
        tableLabel: src.label || src.table,
        scope: src.scope,
        daysSince: null,
        cta: src.cta,
      });
    }
  }

  // Stable order: high severity first, then alphabetical by id so the
  // signature comparison in the cron is deterministic across runs.
  alerts.sort((a, b) => {
    if (a.severity !== b.severity) return a.severity === 'high' ? -1 : 1;
    return a.id.localeCompare(b.id);
  });

  return {
    alerts,
    checkedAt,
    tablesChecked: ADMIN_TABLE_SOURCES.length,
    supabaseConfigured: true,
  };
}

/**
 * Stable signature of the current alert set, used by the cron to
 * detect "this run's alerts are the same as last run's — don't
 * re-email." Just joins the sorted alert ids.
 */
export function alertSetSignature(alerts) {
  return (alerts || []).map((a) => a.id).sort().join('|');
}

/**
 * Compose the email subject + HTML + plain-text body for a current
 * alert set. Pure function so it's easy to test.
 */
export function composeAlertEmail(alerts, { baseUrl = '' } = {}) {
  const high = alerts.filter((a) => a.severity === 'high').length;
  const medium = alerts.filter((a) => a.severity === 'medium').length;
  const subject = alerts.length === 1
    ? `[KUA Dashboard] Alert: ${alerts[0].title}`
    : `[KUA Dashboard] ${alerts.length} alerts (${high} stale data, ${medium} empty table${medium === 1 ? '' : 's'})`;

  const fmtCta = (cta) => cta ? `${baseUrl}${cta}` : null;

  const html = `
    <div style="font-family: -apple-system, system-ui, sans-serif; line-height: 1.55; color: #1f2937; max-width: 620px; margin: 0 auto;">
      <h2 style="color: #7f1d1d; margin-bottom: 4px;">⚠ Dashboard alerts</h2>
      <p style="color: #6b7280; margin-top: 0; font-size: 14px;">${alerts.length} item${alerts.length === 1 ? '' : 's'} flagged · KUA Carbon Dashboard</p>

      ${alerts.map((a) => {
        const ctaUrl = fmtCta(a.cta);
        const sevColor = a.severity === 'high' ? '#dc2626' : '#d97706';
        return `
          <div style="margin-top: 18px; padding: 14px 16px; background: #fffbeb; border: 1px solid #fde68a; border-left: 4px solid ${sevColor}; border-radius: 6px;">
            <div style="font-size: 11px; font-weight: 700; color: ${sevColor}; text-transform: uppercase; letter-spacing: 0.5px;">
              ${a.severity}
            </div>
            <div style="font-size: 16px; font-weight: 700; margin-top: 4px; color: #1f2937;">${a.title}</div>
            <p style="margin: 6px 0 0; color: #4b5563; font-size: 14px;">${a.description}</p>
            ${ctaUrl ? `<p style="margin: 10px 0 0;"><a href="${ctaUrl}" style="color: #0e7490; font-weight: 600; text-decoration: none;">Open ${a.tableLabel} →</a></p>` : ''}
          </div>
        `;
      }).join('')}

      <p style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
        This email was sent because something the dashboard tracks went past
        an expected update window. You're getting it because an admin added
        your address at <code>/admin/alerts</code>. To stop, an admin can
        remove you on the same page.
      </p>
    </div>
  `;

  const text = [
    `KUA Dashboard Alerts — ${alerts.length} item${alerts.length === 1 ? '' : 's'} flagged`,
    '',
    ...alerts.map((a) => [
      `[${a.severity.toUpperCase()}] ${a.title}`,
      `  ${a.description}`,
      a.cta ? `  ${fmtCta(a.cta)}` : '',
    ].filter(Boolean).join('\n')),
    '',
    '—',
    'You\'re receiving this because you subscribed at /admin/alerts. An admin can remove your address there.',
  ].join('\n\n');

  return { subject, html, text };
}
