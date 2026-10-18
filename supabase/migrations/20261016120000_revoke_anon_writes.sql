-- Revoke anonymous write access; keep intended public reads.
--
-- WHAT THIS FIXES
--
-- Six tables granted the `anon` role write access: twelve policies in total
-- (6 insert, 1 update, 5 delete). `anon` is the public, unauthenticated role,
-- and its publishable key is compiled into the client bundle and committed to
-- this public repository. Anyone could therefore write these tables directly
-- with curl, bypassing the admin password gate entirely:
--
--   scope1_fleet_records     insert, delete   -> Scope 1 fleet emissions
--   scope1_refrigerant_logs  insert, delete   -> Scope 1 refrigerant emissions
--   forest_stand_actuals     insert, delete   -> the forest sink, i.e. the
--                                               net figure on the homepage
--   bms_export_summaries     insert, delete   -> measured electricity; the
--                                               NEWEST window wins, so one
--                                               forged row rewrites it
--   admin_audit_log          insert           -> the "verifiable data-entry
--                                               trail" kept for AASHE STARS
--   bms_meter_map            insert, update,
--                            delete           -> handled in its own file; it
--                                               is unapplied, so it is fixed
--                                               at the source rather than here
--
-- The original policies were deliberate, and the migrations said why: the
-- admin bearer-token gate was treated as the auth boundary, "no service-role
-- key required to ship this". The flaw is that the gate is client-side UI and
-- the API routes themselves connected as `anon`, so Postgres could not tell
-- an admin write from an anonymous one. There was one role, not three.
--
-- WHAT MAKES THIS SAFE TO APPLY NOW
--
-- Every legitimate write was moved server-side first. Applying this before
-- deploying that code would break the admin UI:
--
--   bms_export_summaries  -> POST/DELETE /api/admin/bms-export-summaries
--   bms_meter_map         -> PUT/DELETE  /api/admin/bms-meter-map
--   admin_audit_log       -> POST        /api/admin/audit-log (already
--                            server-side; switched from the anon key to the
--                            service-role client)
--
-- Each verifies the admin bearer with verifyAdminRequest, validates input,
-- and connects via api/_lib/supabaseAdmin.js using SUPABASE_SERVICE_ROLE_KEY.
-- service_role bypasses RLS, so no replacement write policy is needed.
--
-- ORDER MATTERS: deploy the application first, then apply this migration.
--
-- SELECT POLICIES ARE LEFT ALONE, deliberately. Every one of these tables
-- feeds public charts — the dashboard is meant to be readable by anyone, and
-- the browser reads them directly with the anon key. This migration removes
-- writes only.
--
-- NOT COVERED HERE: scope1_fleet_records, scope1_refrigerant_logs and
-- forest_stand_actuals have no browser write path in the current code
-- (grepped: no .insert/.upsert/.delete against them in src/), so dropping
-- their anon write policies should be inert. If an admin form is found to
-- depend on one, it needs the same treatment as the two BMS tables before
-- this migration is applied — that is the one thing to watch on rollout.

-- ---------------------------------------------------------------------------
-- Scope 1 fleet + refrigerants
drop policy if exists "anon insert scope1_fleet_records"    on scope1_fleet_records;
drop policy if exists "anon delete scope1_fleet_records"    on scope1_fleet_records;
drop policy if exists "anon insert scope1_refrigerant_logs" on scope1_refrigerant_logs;
drop policy if exists "anon delete scope1_refrigerant_logs" on scope1_refrigerant_logs;

-- ---------------------------------------------------------------------------
-- Forest stand actuals (the measured sink)
drop policy if exists "anon insert forest_stand_actuals" on forest_stand_actuals;
drop policy if exists "anon delete forest_stand_actuals" on forest_stand_actuals;

-- ---------------------------------------------------------------------------
-- BMS export summaries (measured electricity)
drop policy if exists "allow anon insert on bms_export_summaries" on bms_export_summaries;
drop policy if exists "allow anon delete on bms_export_summaries" on bms_export_summaries;

-- ---------------------------------------------------------------------------
-- Admin audit log. Public SELECT stays: /admin/audit-log renders it, and an
-- audit trail that can be read but not forged is the point.
drop policy if exists "anon insert admin_audit_log" on admin_audit_log;

-- ---------------------------------------------------------------------------
-- alert_subscribers — PII, and the policies were PUBLIC rather than `to anon`.
--
-- This table was missed by the Phase 531 survey because that survey matched
-- `to anon`, and these three policies have NO role clause at all:
--
--   create policy alert_subscribers_anon_read   on alert_subscribers for select using (true);
--   create policy alert_subscribers_anon_insert on alert_subscribers for insert with check (true);
--   create policy alert_subscribers_anon_delete on alert_subscribers for delete using (true);
--
-- A policy with no `to` clause applies to PUBLIC — every role, which is
-- broader than `to anon`, not narrower. So with the publishable key that
-- ships in the bundle, anyone could ENUMERATE the subscriber list (email
-- addresses), add entries, or delete them.
--
-- The SELECT policy goes too, which is the departure from the rule elsewhere
-- in this file. Everything else here keeps its public read because it feeds
-- public charts; a list of people's email addresses does not. There is no
-- legitimate anonymous read of this table.
--
-- Safe to apply: src/storage/alertSubscribers.js is imported only by api/
-- routes, reaches the database through getSupabaseServer() with the
-- service-role key, and has no browser-side importer. service_role bypasses
-- RLS, so every legitimate path keeps working.
--
-- This leaves the table matching the posture its siblings already use —
-- alert_history and alert_cron_state are `for all using (false)`, i.e.
-- server-only, with the comment "RLS blocks anon; the service-role key the
-- cron uses bypasses RLS". That was the right pattern all along.
drop policy if exists alert_subscribers_anon_read   on alert_subscribers;
drop policy if exists alert_subscribers_anon_insert on alert_subscribers;
drop policy if exists alert_subscribers_anon_delete on alert_subscribers;

drop policy if exists alert_subscribers_no_anon on alert_subscribers;
create policy alert_subscribers_no_anon
  on alert_subscribers for all using (false);

-- ---------------------------------------------------------------------------
-- Verification. After applying, this should return ZERO rows. Anything it
-- returns is a table the public can still write.
--
--   select schemaname, tablename, policyname, cmd, roles
--     from pg_policies
--    where schemaname = 'public'
--      and cmd <> 'SELECT'
--      and 'anon' = any (roles)
--    order by tablename, policyname;
--
-- And this should still list one SELECT policy per public-facing table:
--
--   select tablename, policyname
--     from pg_policies
--    where schemaname = 'public' and cmd = 'SELECT' and 'anon' = any (roles)
--    order by tablename;
