-- Alert-history audit trail. One row per email batch the
-- /api/cron/check-alerts handler successfully dispatches — gives
-- admins a "did the system actually fire?" view on /admin/alerts so
-- they're not flying blind between alert events.
--
-- Cron runs that DON'T send (signature unchanged, no subscribers,
-- 0 alerts) intentionally write no row, so every row in this table
-- corresponds to a real inbox event.

create table if not exists alert_history (
  id                bigserial primary key,
  sent_at           timestamptz not null default now(),
  signature         text not null,
  alert_count       int not null,
  alerts            jsonb not null default '[]',  -- snapshot of the alerts at send time
  subscriber_count  int not null,
  delivered_count   int not null,
  no_provider       boolean not null default false
);

create index if not exists alert_history_sent_at_idx on alert_history (sent_at desc);

alter table alert_history enable row level security;

-- Same pattern as alert_cron_state — only the server-side cron +
-- the admin-gated read endpoint should touch this. RLS blocks anon;
-- the service-role key the cron uses bypasses RLS.
create policy alert_history_no_anon on alert_history for all using (false);
