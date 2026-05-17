-- Alert-cron dedup state — what was the signature of the last alert
-- set we emailed, and when. Lets /api/cron/check-alerts survive a
-- Vercel cold start without re-emailing subscribers about an alert
-- they were already told about.
--
-- Single-row table (`key` is always 'last'); the upsert helper in
-- src/storage/alertCronState.js handles read/write. Without this
-- table the cron still functions but reverts to memory-only dedup
-- (worst case: a school gets a "current state" email once a week
-- on a stable issue, not noisy but not strict either).

create table if not exists alert_cron_state (
  key         text primary key,
  signature   text not null default '',
  emailed_at  timestamptz
);

alter table alert_cron_state enable row level security;

-- Only the server-side cron handler should touch this. Lock down
-- anon access by default — RLS will block reads/writes from a
-- browser client, but the server-side Supabase client (using the
-- service-role key) bypasses RLS, which is what the cron handler
-- uses via getSupabaseServer().
create policy alert_cron_state_no_anon on alert_cron_state for all using (false);
