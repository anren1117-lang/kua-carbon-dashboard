// GET  /api/alerts/subscribers      → admin-only, returns { subscribers: [...] }
// POST /api/alerts/subscribers/test  → admin-only, sends a test email to every subscriber
//
// Admin-gated so casual visitors can't enumerate the school's
// notification list. Auth via the same bearer-token pattern as the
// rest of /api/admin/*.

import { listSubscribers } from '../../src/storage/alertSubscribers.js';
import { verifyAdminRequest } from '../../src/utils/adminToken.js';
import { sendEmail } from '../../src/utils/sendEmail.js';

export default async function handler(req, res) {
  const auth = verifyAdminRequest(req);
  if (!auth.valid) {
    return res.status(401).json({ error: `admin auth required: ${auth.reason}` });
  }

  if (req.method === 'GET') {
    const subscribers = await listSubscribers();
    return res.status(200).json({ subscribers, count: subscribers.length });
  }

  if (req.method === 'POST') {
    // POST is the "send test alert" trigger — fires a sample email to
    // every subscriber so the admin can verify Resend is wired up
    // before the real alerts start firing tomorrow at cron time.
    const subscribers = await listSubscribers();
    if (subscribers.length === 0) {
      return res.status(400).json({ error: 'no_subscribers' });
    }
    const subject = '[KUA Dashboard] Test alert — your notifications are wired up';
    const html = `
      <div style="font-family: -apple-system, system-ui, sans-serif; line-height: 1.6; color: #1f2937; max-width: 560px; margin: 0 auto;">
        <h2 style="color: #0f766e; margin-bottom: 4px;">Test alert</h2>
        <p style="color: #6b7280; margin-top: 0; font-size: 14px;">From the KUA Carbon Dashboard</p>
        <p>This is a test message confirming that the alert notification system is
        configured and able to deliver email to <strong>${subscribers.length}</strong>
        subscriber${subscribers.length === 1 ? '' : 's'} at this address.</p>
        <p>Real alerts will arrive only when the dashboard detects something
        genuinely unusual — a stale data table, a dead meter, or a sudden anomalous
        reading. You won't get spammed.</p>
        <p style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
          To stop receiving these alerts, an admin can remove your email at
          <code>/admin/alerts</code>.
        </p>
      </div>`;
    const text = [
      'KUA Carbon Dashboard — Test alert',
      '',
      `This is a test confirming alert delivery is wired up to ${subscribers.length} subscriber${subscribers.length === 1 ? '' : 's'}.`,
      '',
      'Real alerts fire only when the dashboard detects something genuinely unusual.',
      '',
      'To unsubscribe, an admin can remove your email at /admin/alerts.',
    ].join('\n');

    const results = await Promise.all(subscribers.map((s) =>
      sendEmail({ to: s.email, subject, html, text }).then((r) => ({ email: s.email, ...r }))
    ));
    const sent     = results.filter((r) => r.sent).length;
    const noProvider = results.some((r) => r.reason === 'no_provider');
    return res.status(200).json({
      attempted: results.length,
      sent,
      noProvider,
      results,
    });
  }

  res.setHeader && res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'method_not_allowed' });
}
