// GET /api/cron/check-alerts
//
// Daily cron — walks the admin data tables, evaluates which ones are
// stale or empty past their expected cadence, and emails every
// subscribed address IF the current alert set differs from the last
// successful run.
//
// Dedup: a "signature" of the sorted alert ids is held in process
// memory. Same signature as last run → no email (so the school doesn't
// get a daily reminder that the heating-oil table is still stale).
// Different signature → email + update the stored signature.
// Cold starts reset the signature, so the first run after a cold start
// will resend the current state. That's an acceptable v1 dedup —
// strict dedup needs persistent storage (Supabase table) and is a
// follow-up.
//
// Auth: same CRON_SECRET Bearer pattern as /api/cron/sync-bms.
//
// Wiring on Vercel:
//   vercel.json — add { "path": "/api/cron/check-alerts", "schedule": "0 13 * * *" }
//   And set CRON_SECRET in Vercel project env.

import crypto from 'node:crypto';
import { getSupabaseServer } from '../../src/storage/supabaseServer.js';
import { evaluateAlerts, alertSetSignature, composeAlertEmail } from '../../src/utils/alertEvaluator.js';
import { listSubscribers } from '../../src/storage/alertSubscribers.js';
import { sendEmail } from '../../src/utils/sendEmail.js';
import { getMeterAdapter } from '../../src/adapters/meter/index.js';
import { getCronState, setCronState, _resetAlertCronStateStoreForTests } from '../../src/storage/alertCronState.js';

// Test-only escape hatch — clears the persistent (or memory-only)
// dedup state between tests.
export function _resetAlertCronStateForTests() {
  _resetAlertCronStateStoreForTests();
}

function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function isAuthorized(req) {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  const auth = req.headers?.authorization || req.headers?.Authorization;
  if (auth && safeEqual(auth, `Bearer ${expected}`)) return true;
  return false;
}

function baseUrlFromReq(req) {
  // Vercel sets x-forwarded-host + x-forwarded-proto. Fallback to env.
  const host  = req.headers?.['x-forwarded-host']  || req.headers?.host;
  const proto = req.headers?.['x-forwarded-proto'] || 'https';
  if (host) return `${proto}://${host}`;
  return process.env.PUBLIC_BASE_URL || '';
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader && res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized — set CRON_SECRET and pass it as Authorization: Bearer' });
  }

  try {
    const supabase = await getSupabaseServer();
    // Meter adapter is best-effort — a missing BMS env shouldn't kill
    // the cron, so wrap the factory call. The evaluator itself also
    // catches getQuality failures, but the factory can throw on
    // unconfigured BMS.
    let meterAdapter = null;
    try { meterAdapter = getMeterAdapter(); }
    catch (err) { console.warn('[cron/check-alerts] meter adapter unavailable:', err?.message || err); }

    const { alerts, checkedAt, tablesChecked, supabaseConfigured, meterAdapterUsed, metersChecked } =
      await evaluateAlerts({ supabase, meterAdapter });

    const signature = alertSetSignature(alerts);
    const prior = await getCronState();

    // Nothing to alert about — nothing to do.
    if (alerts.length === 0) {
      const sameAsLast = signature === prior.signature;
      const state = await setCronState(signature, prior.emailedAt);
      return res.status(200).json({
        ok: true,
        checkedAt,
        tablesChecked,
        supabaseConfigured,
        meterAdapterUsed,
        metersChecked,
        alertCount: 0,
        action: sameAsLast ? 'no_change' : 'cleared',
        notified: 0,
        statePersisted: state.persisted,
      });
    }

    // Same alert set as last successful run → no email (dedup).
    if (signature === prior.signature) {
      return res.status(200).json({
        ok: true,
        checkedAt,
        tablesChecked,
        supabaseConfigured,
        meterAdapterUsed,
        metersChecked,
        alertCount: alerts.length,
        action: 'no_change',
        notified: 0,
        lastEmailedAt: prior.emailedAt,
        stateSource: prior.source,
      });
    }

    // New or changed alert set — send email.
    const subscribers = await listSubscribers();
    if (subscribers.length === 0) {
      // Update signature even when nobody's subscribed so the very
      // first subscriber doesn't get spammed about pre-existing alerts.
      const state = await setCronState(signature, prior.emailedAt);
      return res.status(200).json({
        ok: true,
        checkedAt,
        tablesChecked,
        supabaseConfigured,
        meterAdapterUsed,
        metersChecked,
        alertCount: alerts.length,
        action: 'no_subscribers',
        notified: 0,
        statePersisted: state.persisted,
      });
    }

    const baseUrl = baseUrlFromReq(req);
    const { subject, html, text } = composeAlertEmail(alerts, { baseUrl });
    const results = await Promise.all(subscribers.map((s) =>
      sendEmail({ to: s.email, subject, html, text }).then((r) => ({ email: s.email, ...r }))
    ));
    const notified = results.filter((r) => r.sent).length;

    const state = await setCronState(signature, checkedAt);

    return res.status(200).json({
      ok: true,
      checkedAt,
      tablesChecked,
      supabaseConfigured,
      alertCount: alerts.length,
      action: 'emailed',
      notified,
      attempted: subscribers.length,
      statePersisted: state.persisted,
      noProvider: results.some((r) => r.reason === 'no_provider'),
    });
  } catch (err) {
    return res.status(500).json({ error: 'server_error', details: String(err?.message || err) });
  }
}
