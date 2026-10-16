-- Shared BMS meter → building mapping.
--
-- The mapping decides which building each PM_* power meter belongs to, and so
-- which buildings show measured electricity on /buildings, /hotspots and the
-- dorm leaderboard. It has lived in each admin's own localStorage, so one
-- admin's work was invisible to everyone else (and lost when they cleared
-- site data). This table makes it shared; src/data/bmsExportMapping.js falls
-- back to localStorage when the table is missing or unreachable.
--
-- Same posture as the other admin tables: the bearer-token gate in the admin
-- portal is the auth boundary, not RLS.
--
-- ============================================================================
-- READ THIS BEFORE APPLYING. The policies below grant the `anon` role insert,
-- update AND delete with using(true) / with check(true).
--
-- `anon` is the PUBLIC role. The publishable key is in the shipped JS bundle
-- and in this public repository, so once this table exists anyone on the
-- internet can rewrite or delete the meter->building mapping with curl — the
-- mapping that decides which buildings show measured electricity on
-- /buildings, /hotspots and the dorm leaderboard.
--
-- The "bearer-token gate is the auth boundary" note above does not hold at the
-- database layer. That gate is client-side UI, the browser talks to Supabase
-- directly with the anon key, and there is no service-role key anywhere in
-- this codebase (grep SERVICE_ROLE: no hits) — api/admin/audit-log.js reads
-- SUPABASE_ANON_KEY too. So Postgres cannot tell an admin write from an
-- anonymous one, and RLS is the only control that exists.
--
-- This table is NOT YET APPLIED to the configured project. Verified against
-- the live project on 2026-10-16:
--
--   GET /rest/v1/bms_meter_map?select=meter_id,building_id  ->  404
--   {"code":"PGRST205","message":"Could not find the table
--    'public.bms_meter_map' in the schema cache"}
--
-- That makes now the cheapest moment to fix it: nothing in production depends
-- on these policies yet, and src/data/bmsExportMapping.js already falls back
-- to localStorage while the table is absent.
--
-- RESOLVED: the three anon write policies were removed from this file and the
-- write path now lives behind /api/admin/bms-meter-map (verifyAdminRequest +
-- service-role key). This file is safe to apply as written — see the
-- migration order in CLAUDE.md > Supabase.
-- ============================================================================

create table if not exists bms_meter_map (
  meter_id    text primary key,
  building_id text not null,
  updated_at  timestamptz not null default now()
);

alter table bms_meter_map enable row level security;

drop policy if exists "allow anon select on bms_meter_map" on bms_meter_map;
create policy "allow anon select on bms_meter_map"
  on bms_meter_map for select to anon using (true);

-- NO ANON WRITE POLICIES. Public SELECT only.
--
-- This file previously granted anon insert, update and delete. Those are
-- removed rather than fixed in a later migration because the table is not yet
-- applied anywhere: correcting it here means it is never created in the
-- permissive state, and there is no window in which the table exists and is
-- publicly writable.
--
-- Writes now go through POST/PUT/DELETE /api/admin/bms-meter-map, which
-- verifies the admin bearer token (verifyAdminRequest) and connects with the
-- service-role key. service_role bypasses RLS, so it needs no policy here.
--
-- src/data/bmsExportMapping.js still SELECTs this table directly with the
-- anon key — the mapping is not secret and every visitor's charts depend on
-- it, so the public read below is intentional.

drop policy if exists "allow anon insert on bms_meter_map" on bms_meter_map;
drop policy if exists "allow anon update on bms_meter_map" on bms_meter_map;
drop policy if exists "allow anon delete on bms_meter_map" on bms_meter_map;
