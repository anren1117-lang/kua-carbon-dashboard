// Email-send wrapper around Resend. Server-side only.
//
// When RESEND_API_KEY is unset (the default on a fresh deploy), this
// is a no-op that logs the would-have-sent email to console and
// returns { sent: false, reason: 'no_provider' }. That lets the rest
// of the alert flow run + be tested end-to-end without forcing
// admins to wire up an email service before they can try the
// feature. To enable real delivery: set RESEND_API_KEY in Vercel.
//
// Why Resend over SendGrid/SES: simplest Vercel-friendly API (single
// env var, no DKIM dance, no sandbox-mode approval), 3K free emails
// per month covers a school deploy comfortably, and a single fetch
// call avoids adding an SDK dependency.

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
// Use Resend's sandbox sender unless the admin sets a verified
// custom sender domain via FROM_EMAIL. onboarding@resend.dev works
// out of the box for any new Resend account.
const DEFAULT_FROM = 'KUA Carbon Dashboard <onboarding@resend.dev>';

/**
 * @param {object} args
 * @param {string|string[]} args.to    Recipient(s). Required.
 * @param {string} args.subject        Email subject line. Required.
 * @param {string} args.html           HTML body. Required.
 * @param {string=} args.text          Plain-text fallback body (recommended for spam filters).
 * @param {string=} args.from          Override sender; defaults to FROM_EMAIL env or onboarding@resend.dev.
 * @returns {Promise<{ sent: boolean, reason?: string, id?: string, error?: string }>}
 */
export async function sendEmail({ to, subject, html, text, from }) {
  if (!to || (Array.isArray(to) && to.length === 0)) {
    return { sent: false, reason: 'no_recipients' };
  }
  if (!subject || !html) {
    return { sent: false, reason: 'missing_subject_or_html' };
  }
  const apiKey = process.env.RESEND_API_KEY;
  const sender = from || process.env.FROM_EMAIL || DEFAULT_FROM;

  if (!apiKey) {
    // No provider configured — log + return success-like shape so the
    // calling alert flow doesn't error out. Production should set
    // RESEND_API_KEY to enable real delivery.
    // eslint-disable-next-line no-console
    console.log('[sendEmail] no RESEND_API_KEY — would have sent:', {
      to, subject, fromPreview: sender,
      htmlPreview: String(html).slice(0, 200),
    });
    return { sent: false, reason: 'no_provider' };
  }

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: sender,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text: text || undefined,
      }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { sent: false, reason: 'provider_error', error: body.message || `HTTP ${res.status}` };
    }
    return { sent: true, id: body.id };
  } catch (err) {
    return { sent: false, reason: 'network_error', error: err?.message || String(err) };
  }
}

// Basic RFC-5322-lite email validation. Not perfect — emails are
// genuinely hard to validate — but catches obvious junk before we
// store it or hand it to Resend.
export function isLikelyEmail(s) {
  if (typeof s !== 'string') return false;
  const trimmed = s.trim();
  if (trimmed.length === 0 || trimmed.length > 254) return false;
  // Local @ domain.tld, no whitespace, exactly one @, domain has a dot.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}
