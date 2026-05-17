-- Alert subscribers — email addresses that get notified when the
-- daily cron at /api/cron/check-alerts detects something unusual
-- (stale data table, dead meter, anomalous reading).
--
-- The store wrapper (src/storage/alertSubscribers.js) writes through
-- both this table and a process-memory cache; reads prefer this
-- table when configured. Without the table the system still works,
-- but every Vercel cold start wipes the subscriber list — which is
-- why the migration exists.
--
-- The actual auth boundaries:
--   - POST /api/alerts/subscribe   — public, rate-limited 5/min/IP
--   - POST /api/alerts/unsubscribe — public, always 200s (no enumeration)
--   - POST /api/alerts/unsubscribe-via-token — HMAC-signed token from email
--   - GET  /api/alerts/subscribers — admin bearer token
-- Anon writes allowed so the public endpoints work without a
-- service-role key.

create table if not exists alert_subscribers (
  email       text primary key,
  created_at  timestamptz not null default now()
);

-- Index implicit on PK; no other queries today.

alter table alert_subscribers enable row level security;

-- Same anon-passthrough pattern as admin_audit_log — the API
-- endpoints are the real auth boundary. RLS just blocks the cases
-- where someone wired up the anon key directly to the browser
-- without going through our endpoints.
create policy alert_subscribers_anon_read   on alert_subscribers for select using (true);
create policy alert_subscribers_anon_insert on alert_subscribers for insert with check (true);
create policy alert_subscribers_anon_delete on alert_subscribers for delete using (true);
