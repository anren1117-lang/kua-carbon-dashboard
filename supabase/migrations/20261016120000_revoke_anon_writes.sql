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
