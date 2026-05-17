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
 * @param {object|null} args.supabase     A Supabase server client, or null. When null, table alerts are skipped.
 * @param {object|null} args.meterAdapter Optional meter adapter (MeterDataAdapter shape). When provided, evaluator also flags dead meters via the adapter's getQuality() output.
 * @param {Date=} args.now                Override "now" for tests.
 * @returns {Promise<{ alerts: Alert[], checkedAt: string, tablesChecked: number, supabaseConfigured: boolean, meterAdapterUsed: boolean, metersChecked: number }>}
 *
 * @typedef {Object} Alert
 * @property {string} id           Stable id, e.g. "stale:scope1_heating_oil" / "deadmeter:m_oil_campus"
 * @property {'stale_table'|'empty_table'|'dead_meter'|'flat_meter'} kind
 * @property {'high'|'medium'} severity
 * @property {string} title
 * @property {string} description
 * @property {string=} table       Set for table-based alerts.
 * @property {string=} tableLabel
 * @property {string=} scope
 * @property {string=} meterId     Set for meter-based alerts.
 * @property {number|null} daysSince
 * @property {string=} cta
 */
export async function evaluateAlerts({ supabase, meterAdapter, now } = {}) {
  const checkedAt = (now instanceof Date ? now : new Date()).toISOString();
  const out = { alerts: [], checkedAt, tablesChecked: 0, supabaseConfigured: false, meterAdapterUsed: false, metersChecked: 0 };
  if (!supabase && !meterAdapter) return out;

  const alerts = [];

  // ─── Stale/empty data tables (Supabase-backed) ────────────────────
  if (supabase) {
    out.supabaseConfigured = true;
    out.tablesChecked = ADMIN_TABLE_SOURCES.length;

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
  }

  // ─── Meter quality (BMS/CSV adapter, optional) ────────────────────
  // Walks the meter adapter's getQuality output and flags any meter
  // reporting a 'stale' (dead — no data for 24h+) or 'flat' (stuck
  // sensor) issue from the last week.
  if (meterAdapter && typeof meterAdapter.getQuality === 'function') {
    out.meterAdapterUsed = true;
    const nowMs = (now instanceof Date ? now : new Date()).getTime();
    const start = new Date(nowMs - 7 * 24 * 60 * 60 * 1000).toISOString();
    const end   = new Date(nowMs).toISOString();
    try {
      const reports = await meterAdapter.getQuality({ start, end });
      if (Array.isArray(reports)) {
        out.metersChecked = reports.length;
        for (const report of reports) {
          if (!report || !Array.isArray(report.issues)) continue;
          for (const issue of report.issues) {
            if (issue.kind === 'stale') {
              alerts.push({
                id: `deadmeter:${report.meterId}`,
                kind: 'dead_meter',
                severity: 'high',
                title: `Meter ${report.meterId} has gone silent`,
                description: `${issue.description || 'No readings for over 24 hours.'} If this is an electricity meter, the building's measured kWh figure is stuck at the last good reading.`,
                meterId: report.meterId,
                daysSince: null,
                cta: '/admin/data-quality',
              });
              break; // One dead-meter alert per meter, not per issue.
            } else if (issue.kind === 'flat') {
              alerts.push({
                id: `flat:${report.meterId}`,
                kind: 'flat_meter',
                severity: 'medium',
                title: `Meter ${report.meterId} appears stuck`,
                description: `${issue.description || 'Many consecutive identical readings.'} The sensor may be frozen; the kWh you see for that meter may not be moving.`,
                meterId: report.meterId,
                daysSince: null,
                cta: '/admin/data-quality',
              });
              break;
            }
          }
        }
      }
    } catch (err) {
      // Adapter failure (BMS unreachable, env not configured) — don't
      // turn that into an alert and don't crash the cron.
      // eslint-disable-next-line no-console
      console.warn('[evaluateAlerts] meterAdapter.getQuality failed:', err?.message || err);
    }
  }

  // Stable order: high severity first, then alphabetical by id so the
  // signature comparison in the cron is deterministic across runs.
  alerts.sort((a, b) => {
    if (a.severity !== b.severity) return a.severity === 'high' ? -1 : 1;
    return a.id.localeCompare(b.id);
  });

  return { ...out, alerts };
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
 *
 * @param {Alert[]} alerts
 * @param {object} [opts]
 * @param {string} [opts.baseUrl]         Absolute origin for CTA + unsubscribe URLs.
 * @param {string} [opts.unsubscribeUrl]  Per-recipient one-click unsubscribe link (already includes ?token=…). If provided, footer adds it.
 */
export function composeAlertEmail(alerts, { baseUrl = '', unsubscribeUrl = '' } = {}) {
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
        an expected update window. You're getting it because your address is
        subscribed at <code>/admin/alerts</code>.
        ${unsubscribeUrl ? `<br><a href="${unsubscribeUrl}" style="color: #0e7490;">Unsubscribe from these alerts</a> · One click, no login needed.` : 'To stop, an admin can remove you on that same page.'}
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
    unsubscribeUrl
      ? `Unsubscribe (one click): ${unsubscribeUrl}`
      : 'You\'re receiving this because your address is subscribed at /admin/alerts.',
  ].join('\n\n');

  return { subject, html, text };
}
