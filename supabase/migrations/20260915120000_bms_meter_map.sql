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

create table if not exists bms_meter_map (
  meter_id    text primary key,
  building_id text not null,
  updated_at  timestamptz not null default now()
);

alter table bms_meter_map enable row level security;

create policy if not exists "allow anon select on bms_meter_map"
  on bms_meter_map for select to anon using (true);

create policy if not exists "allow anon insert on bms_meter_map"
  on bms_meter_map for insert to anon with check (true);

create policy if not exists "allow anon update on bms_meter_map"
  on bms_meter_map for update to anon using (true) with check (true);

create policy if not exists "allow anon delete on bms_meter_map"
  on bms_meter_map for delete to anon using (true);
