-- Phase 533: lock the admin data-entry tables to read-only for the public.
--
-- ORDER MATTERS. Apply this only AFTER the deploy that routes admin writes
-- through /api/admin/records is live AND the server has
-- SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SERVICE_KEY) set. Before that the
-- admin forms still write with the anon key and this migration would stop
-- them. (As of 2026-10-25 production admin login is disabled anyway —
-- ADMIN_TOKEN_SECRET is unset — so set both variables together.)
--
-- WHAT IT DOES, per table:
--   1. enable row level security (on 15 of these it was never enabled, so
--      the anon role's grants applied with no row filtering at all);
--   2. drop EVERY existing policy on the table — including any created by
--      hand in the dashboard, which this repo cannot see by name;
--   3. create one policy: public select. Every chart reads these tables
--      directly and none of them is secret.
-- No insert/update/delete policy is created. The service-role client used
-- by api/admin/records.js bypasses RLS; nothing else can write.
--
-- Every block is guarded by to_regclass, because several of these tables
-- are absent on the configured project (schemaHealth.js tracks them). A
-- missing table is skipped rather than aborting the whole migration.
--
-- Verify afterwards:
--   select tablename, policyname, cmd, roles from pg_policies
--    where schemaname = 'public' order by 1, 2;
--   select relname, relrowsecurity from pg_class
--    where relnamespace = 'public'::regnamespace and relkind = 'r' order by 1;

-- fuel_bills
alter table if exists fuel_bills enable row level security;
do $$
declare p record;
begin
  if to_regclass('public.fuel_bills') is not null then
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'fuel_bills' loop
      execute format('drop policy %I on public.fuel_bills', p.policyname);
    end loop;
    drop policy if exists "public read fuel_bills" on fuel_bills;
    create policy "public read fuel_bills"
      on fuel_bills for select using (true);
  end if;
end $$;

-- scope1_heating_oil
alter table if exists scope1_heating_oil enable row level security;
do $$
declare p record;
begin
  if to_regclass('public.scope1_heating_oil') is not null then
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'scope1_heating_oil' loop
      execute format('drop policy %I on public.scope1_heating_oil', p.policyname);
    end loop;
    drop policy if exists "public read scope1_heating_oil" on scope1_heating_oil;
    create policy "public read scope1_heating_oil"
      on scope1_heating_oil for select using (true);
  end if;
end $$;

-- scope1_propane
alter table if exists scope1_propane enable row level security;
do $$
declare p record;
begin
  if to_regclass('public.scope1_propane') is not null then
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'scope1_propane' loop
      execute format('drop policy %I on public.scope1_propane', p.policyname);
    end loop;
    drop policy if exists "public read scope1_propane" on scope1_propane;
    create policy "public read scope1_propane"
      on scope1_propane for select using (true);
  end if;
end $$;

-- scope1_fleet
alter table if exists scope1_fleet enable row level security;
do $$
declare p record;
begin
  if to_regclass('public.scope1_fleet') is not null then
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'scope1_fleet' loop
      execute format('drop policy %I on public.scope1_fleet', p.policyname);
    end loop;
    drop policy if exists "public read scope1_fleet" on scope1_fleet;
    create policy "public read scope1_fleet"
      on scope1_fleet for select using (true);
  end if;
end $$;

-- scope1_refrigerants
alter table if exists scope1_refrigerants enable row level security;
do $$
declare p record;
begin
  if to_regclass('public.scope1_refrigerants') is not null then
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'scope1_refrigerants' loop
      execute format('drop policy %I on public.scope1_refrigerants', p.policyname);
    end loop;
    drop policy if exists "public read scope1_refrigerants" on scope1_refrigerants;
    create policy "public read scope1_refrigerants"
      on scope1_refrigerants for select using (true);
  end if;
end $$;

-- scope2_meter_readings
alter table if exists scope2_meter_readings enable row level security;
do $$
declare p record;
begin
  if to_regclass('public.scope2_meter_readings') is not null then
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'scope2_meter_readings' loop
      execute format('drop policy %I on public.scope2_meter_readings', p.policyname);
    end loop;
    drop policy if exists "public read scope2_meter_readings" on scope2_meter_readings;
    create policy "public read scope2_meter_readings"
      on scope2_meter_readings for select using (true);
  end if;
end $$;

-- scope2_utility_bills
alter table if exists scope2_utility_bills enable row level security;
do $$
declare p record;
begin
  if to_regclass('public.scope2_utility_bills') is not null then
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'scope2_utility_bills' loop
      execute format('drop policy %I on public.scope2_utility_bills', p.policyname);
    end loop;
    drop policy if exists "public read scope2_utility_bills" on scope2_utility_bills;
    create policy "public read scope2_utility_bills"
      on scope2_utility_bills for select using (true);
  end if;
end $$;

-- day_students
alter table if exists day_students enable row level security;
do $$
declare p record;
begin
  if to_regclass('public.day_students') is not null then
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'day_students' loop
      execute format('drop policy %I on public.day_students', p.policyname);
    end loop;
    drop policy if exists "public read day_students" on day_students;
    create policy "public read day_students"
      on day_students for select using (true);
  end if;
end $$;

-- us_boarding_students
alter table if exists us_boarding_students enable row level security;
do $$
declare p record;
begin
  if to_regclass('public.us_boarding_students') is not null then
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'us_boarding_students' loop
      execute format('drop policy %I on public.us_boarding_students', p.policyname);
    end loop;
    drop policy if exists "public read us_boarding_students" on us_boarding_students;
    create policy "public read us_boarding_students"
      on us_boarding_students for select using (true);
  end if;
end $$;

-- international_students
alter table if exists international_students enable row level security;
do $$
declare p record;
begin
  if to_regclass('public.international_students') is not null then
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'international_students' loop
      execute format('drop policy %I on public.international_students', p.policyname);
    end loop;
    drop policy if exists "public read international_students" on international_students;
    create policy "public read international_students"
      on international_students for select using (true);
  end if;
end $$;

-- study_abroad
alter table if exists study_abroad enable row level security;
do $$
declare p record;
begin
  if to_regclass('public.study_abroad') is not null then
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'study_abroad' loop
      execute format('drop policy %I on public.study_abroad', p.policyname);
    end loop;
    drop policy if exists "public read study_abroad" on study_abroad;
    create policy "public read study_abroad"
      on study_abroad for select using (true);
  end if;
end $$;

-- faculty_travel
alter table if exists faculty_travel enable row level security;
do $$
declare p record;
begin
  if to_regclass('public.faculty_travel') is not null then
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'faculty_travel' loop
      execute format('drop policy %I on public.faculty_travel', p.policyname);
    end loop;
    drop policy if exists "public read faculty_travel" on faculty_travel;
    create policy "public read faculty_travel"
      on faculty_travel for select using (true);
  end if;
end $$;

-- waste
alter table if exists waste enable row level security;
do $$
declare p record;
begin
  if to_regclass('public.waste') is not null then
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'waste' loop
      execute format('drop policy %I on public.waste', p.policyname);
    end loop;
    drop policy if exists "public read waste" on waste;
    create policy "public read waste"
      on waste for select using (true);
  end if;
end $$;

-- purchased_goods
alter table if exists purchased_goods enable row level security;
do $$
declare p record;
begin
  if to_regclass('public.purchased_goods') is not null then
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'purchased_goods' loop
      execute format('drop policy %I on public.purchased_goods', p.policyname);
    end loop;
    drop policy if exists "public read purchased_goods" on purchased_goods;
    create policy "public read purchased_goods"
      on purchased_goods for select using (true);
  end if;
end $$;

-- commuting
alter table if exists commuting enable row level security;
do $$
declare p record;
begin
  if to_regclass('public.commuting') is not null then
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'commuting' loop
      execute format('drop policy %I on public.commuting', p.policyname);
    end loop;
    drop policy if exists "public read commuting" on commuting;
    create policy "public read commuting"
      on commuting for select using (true);
  end if;
end $$;

-- forest_stand_actuals
alter table if exists forest_stand_actuals enable row level security;
do $$
declare p record;
begin
  if to_regclass('public.forest_stand_actuals') is not null then
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'forest_stand_actuals' loop
      execute format('drop policy %I on public.forest_stand_actuals', p.policyname);
    end loop;
    drop policy if exists "public read forest_stand_actuals" on forest_stand_actuals;
    create policy "public read forest_stand_actuals"
      on forest_stand_actuals for select using (true);
  end if;
end $$;

-- sinks_trees
alter table if exists sinks_trees enable row level security;
do $$
declare p record;
begin
  if to_regclass('public.sinks_trees') is not null then
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'sinks_trees' loop
      execute format('drop policy %I on public.sinks_trees', p.policyname);
    end loop;
    drop policy if exists "public read sinks_trees" on sinks_trees;
    create policy "public read sinks_trees"
      on sinks_trees for select using (true);
  end if;
end $$;

-- sinks_soil_samples
alter table if exists sinks_soil_samples enable row level security;
do $$
declare p record;
begin
  if to_regclass('public.sinks_soil_samples') is not null then
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'sinks_soil_samples' loop
      execute format('drop policy %I on public.sinks_soil_samples', p.policyname);
    end loop;
    drop policy if exists "public read sinks_soil_samples" on sinks_soil_samples;
    create policy "public read sinks_soil_samples"
      on sinks_soil_samples for select using (true);
  end if;
end $$;

-- renewables_solar
alter table if exists renewables_solar enable row level security;
do $$
declare p record;
begin
  if to_regclass('public.renewables_solar') is not null then
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'renewables_solar' loop
      execute format('drop policy %I on public.renewables_solar', p.policyname);
    end loop;
    drop policy if exists "public read renewables_solar" on renewables_solar;
    create policy "public read renewables_solar"
      on renewables_solar for select using (true);
  end if;
end $$;

-- renewables_geothermal
alter table if exists renewables_geothermal enable row level security;
do $$
declare p record;
begin
  if to_regclass('public.renewables_geothermal') is not null then
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'renewables_geothermal' loop
      execute format('drop policy %I on public.renewables_geothermal', p.policyname);
    end loop;
    drop policy if exists "public read renewables_geothermal" on renewables_geothermal;
    create policy "public read renewables_geothermal"
      on renewables_geothermal for select using (true);
  end if;
end $$;

-- renewables_wind
alter table if exists renewables_wind enable row level security;
do $$
declare p record;
begin
  if to_regclass('public.renewables_wind') is not null then
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'renewables_wind' loop
      execute format('drop policy %I on public.renewables_wind', p.policyname);
    end loop;
    drop policy if exists "public read renewables_wind" on renewables_wind;
    create policy "public read renewables_wind"
      on renewables_wind for select using (true);
  end if;
end $$;

-- framework_drafts
alter table if exists framework_drafts enable row level security;
do $$
declare p record;
begin
  if to_regclass('public.framework_drafts') is not null then
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'framework_drafts' loop
      execute format('drop policy %I on public.framework_drafts', p.policyname);
    end loop;
    drop policy if exists "public read framework_drafts" on framework_drafts;
    create policy "public read framework_drafts"
      on framework_drafts for select using (true);
  end if;
end $$;

-- audit_log
alter table if exists audit_log enable row level security;
do $$
declare p record;
begin
  if to_regclass('public.audit_log') is not null then
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'audit_log' loop
      execute format('drop policy %I on public.audit_log', p.policyname);
    end loop;
    drop policy if exists "public read audit_log" on audit_log;
    create policy "public read audit_log"
      on audit_log for select using (true);
  end if;
end $$;
