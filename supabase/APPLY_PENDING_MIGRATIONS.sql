-- PENDING MIGRATIONS — paste this whole file into the Supabase SQL editor
-- (Dashboard → SQL Editor → New query → paste → Run).
--
-- Why this exists: 12 of the 28 tables these migrations define did not exist in
-- the live project. Everything from 2026-05-03 onward had never been applied,
-- so the features that write to those tables failed silently and the dashboard
-- fell back to its committed seed data.
--
-- WHY THE FIRST ATTEMPT FAILED: these migrations contained 21 statements of the
-- form `create policy if not exists ...`. PostgreSQL has never supported
-- IF NOT EXISTS on CREATE POLICY. The SQL editor runs the script as one batch,
-- so the syntax error aborted everything — including the create-table
-- statements above it, which is why nothing appeared. They are now written as
-- `drop policy if exists ...; create policy ...`, which is valid and idempotent.
--
-- Every statement is IF NOT EXISTS or DROP ... IF EXISTS. There is no DROP
-- TABLE, TRUNCATE or DELETE: it cannot touch the 16 existing tables or any row.
--
-- Generated from supabase/migrations/ — regenerate rather than edit.


-- ============================================================
-- 20260503000000_quiz_and_csv_storage.sql
-- ============================================================
-- Quiz attempts + CSV-imported meter readings.
--
-- Both tables are write-through targets for the in-memory ledgers in
-- src/storage/. When SUPABASE_URL + SUPABASE_SERVICE_KEY are set
-- server-side, the API handlers persist here in addition to memory.
--
-- Privacy: user_id_hash is the only identifier. Raw names / SIS IDs
-- never reach this database. The hashUserId() format is enforced by
-- the /api/quiz/attempts handler before any insert.

create extension if not exists "uuid-ossp";

create table if not exists quiz_attempts (
  id              uuid primary key default uuid_generate_v4(),
  submitted_at    timestamptz not null default now(),
  user_id_hash    text not null,
  class_id        text,
  quiz_id         text not null,
  topic           text not null,
  correct         boolean not null,
  picked_index    integer not null,
  -- Defensive constraint: hashUserId() always produces "<role>_<hex>"
  constraint quiz_attempts_user_id_hash_format check (user_id_hash ~ '^[a-z]+_[0-9a-f]+$')
);

create index if not exists quiz_attempts_class_id_idx on quiz_attempts (class_id);
create index if not exists quiz_attempts_topic_idx    on quiz_attempts (topic);
create index if not exists quiz_attempts_submitted_idx on quiz_attempts (submitted_at desc);

-- CSV-imported readings. Mirrors the MeterReading shape with snake_case columns.
create table if not exists meter_readings_csv (
  id                text primary key,
  meter_id          text not null,
  building_id       text not null,
  meter_type        text not null,
  ts                timestamptz not null,
  interval_minutes  integer not null check (interval_minutes in (15, 30, 60, 1440)),
  value             double precision not null,
  unit              text not null,
  demand_kw         double precision,
  data_quality      text not null default 'actual'
                    check (data_quality in ('actual','estimated','missing','anomaly')),
  source            text not null default 'csv',
  imported_at       timestamptz not null default now()
);

create index if not exists meter_readings_csv_building_idx on meter_readings_csv (building_id, ts);
create index if not exists meter_readings_csv_meter_idx    on meter_readings_csv (meter_id, ts);

-- RLS: tighten in production. For Phase-1 the API handlers run with the
-- service role key, so RLS doesn't need to be permissive on these.
alter table quiz_attempts        enable row level security;
alter table meter_readings_csv   enable row level security;

-- Allow the anon role to read (read-only dashboards). Writes go through
-- the API handlers using the service key.
drop policy if exists "allow anon select on quiz_attempts" on quiz_attempts;
create policy "allow anon select on quiz_attempts"
  on quiz_attempts for select to anon using (true);
drop policy if exists "allow anon select on meter_readings_csv" on meter_readings_csv;
create policy "allow anon select on meter_readings_csv"
  on meter_readings_csv for select to anon using (true);

-- ============================================================
-- 20260503010000_teacher_lessons.sql
-- ============================================================
-- Teacher-authored lessons. Each row is one piece of source material
-- (lecture notes, an article, an excerpt) plus the AI-generated
-- student-facing reading and 4-option questions.

create table if not exists teacher_lessons (
  id                text primary key,
  created_at        timestamptz not null default now(),
  created_by_hash   text not null
    constraint teacher_lessons_creator_format check (created_by_hash ~ '^[a-z]+_[0-9a-f]+$'),
  title             text not null,
  topic             text not null,
  reading_level     text not null
    check (reading_level in ('novice', 'intermediate', 'advanced')),
  class_id          text,
  source_material   text not null,
  generated_reading text not null,
  questions         jsonb not null default '[]'::jsonb,
  status            text not null default 'draft'
    check (status in ('draft', 'published'))
);

create index if not exists teacher_lessons_creator_idx on teacher_lessons (created_by_hash);
create index if not exists teacher_lessons_status_idx  on teacher_lessons (status);
create index if not exists teacher_lessons_created_idx on teacher_lessons (created_at desc);

alter table teacher_lessons enable row level security;

-- Anyone can read PUBLISHED lessons (so students can take them via URL).
drop policy if exists "anon read published teacher lessons" on teacher_lessons;
create policy "anon read published teacher lessons"
  on teacher_lessons for select to anon
  using (status = 'published');

-- ============================================================
-- 20260506200000_scope1_fleet_and_refrigerants.sql
-- ============================================================
-- Scope 1 fleet + refrigerant tables.
--
-- Until now the dashboard's Scope 1 measured path covered only
-- heating fuel (fuel_bills). Fleet vehicles + refrigerant leakage
-- were placeholder rows that fell back to bottom-up estimates. These
-- two tables let admins log fleet fuel-card records and HVAC
-- refrigerant service reports so those rows flip estimated → measured
-- on the Scope 1 page automatically (see useMeasuredScope1 +
-- composeScope1FromBills).
--
-- Schemas mirror the shape composeScope1FromBills already accepts via
-- opts.fleetMt / opts.refrigerantsMt — the helper now takes arrays of
-- rows from these tables and sums them with EPA / IPCC factors.

-- ─── Fleet vehicles ────────────────────────────────────────────────
-- One row per fuel-card transaction (or aggregated monthly fill-up).
-- The vehicle_class field maps to EPA Mobile Combustion factors
-- (gasoline passenger car / light-duty truck / diesel medium-duty
-- bus / etc.). The composer uses fuel_type for the kg/gal factor and
-- vehicle_class only for reporting.

create table if not exists scope1_fleet_records (
  id              bigserial primary key,
  created_at      timestamptz not null default now(),
  date            date not null,
  vehicle_id      text not null,
  vehicle_class   text not null
    constraint scope1_fleet_records_class_check check (vehicle_class in (
      'school_bus_diesel',
      'van_gasoline',
      'van_diesel',
      'pickup_gasoline',
      'pickup_diesel',
      'sedan_gasoline',
      'other'
    )),
  fuel_type       text not null
    constraint scope1_fleet_records_fuel_check check (fuel_type in (
      'Gasoline', 'Diesel', 'Propane', 'CNG'
    )),
  gallons         numeric(10, 3) not null check (gallons >= 0),
  miles           numeric(10, 1) check (miles is null or miles >= 0),
  cost_usd        numeric(12, 2) check (cost_usd is null or cost_usd >= 0),
  notes           text,
  school_year     text
);

create index if not exists scope1_fleet_records_date_idx
  on scope1_fleet_records (date desc);
create index if not exists scope1_fleet_records_vehicle_idx
  on scope1_fleet_records (vehicle_id, date desc);

alter table scope1_fleet_records enable row level security;

-- Same RLS posture as fuel_bills: anon read+write so the admin portal
-- (which uses the publishable key) can use it directly. Server-side
-- writes through the service role key still work as well.
drop policy if exists "anon read scope1_fleet_records" on scope1_fleet_records;
create policy "anon read scope1_fleet_records"
  on scope1_fleet_records for select to anon using (true);
drop policy if exists "anon insert scope1_fleet_records" on scope1_fleet_records;
create policy "anon insert scope1_fleet_records"
  on scope1_fleet_records for insert to anon with check (true);
drop policy if exists "anon delete scope1_fleet_records" on scope1_fleet_records;
create policy "anon delete scope1_fleet_records"
  on scope1_fleet_records for delete to anon using (true);

-- ─── Refrigerant service logs ──────────────────────────────────────
-- One row per HVAC refrigerant event. Net leakage = lbs_recharged -
-- lbs_reclaimed (recharge replaces what leaked + bench-test loss;
-- reclaim is intentional removal during decommission, which doesn't
-- count as fugitive). Multiplied by IPCC AR6 GWP100 for the chemical.

create table if not exists scope1_refrigerant_logs (
  id                bigserial primary key,
  created_at        timestamptz not null default now(),
  date              date not null,
  system_id         text not null,
  refrigerant_type  text not null
    constraint scope1_refrigerant_logs_type_check check (refrigerant_type in (
      'R-410A', 'R-134a', 'R-22', 'R-404A', 'R-407C', 'R-32', 'R-1234yf', 'other'
    )),
  lbs_recharged     numeric(8, 2) not null default 0 check (lbs_recharged >= 0),
  lbs_reclaimed     numeric(8, 2) not null default 0 check (lbs_reclaimed >= 0),
  technician        text,
  notes             text,
  school_year       text
);

create index if not exists scope1_refrigerant_logs_date_idx
  on scope1_refrigerant_logs (date desc);
create index if not exists scope1_refrigerant_logs_system_idx
  on scope1_refrigerant_logs (system_id, date desc);

alter table scope1_refrigerant_logs enable row level security;

drop policy if exists "anon read scope1_refrigerant_logs" on scope1_refrigerant_logs;
create policy "anon read scope1_refrigerant_logs"
  on scope1_refrigerant_logs for select to anon using (true);
drop policy if exists "anon insert scope1_refrigerant_logs" on scope1_refrigerant_logs;
create policy "anon insert scope1_refrigerant_logs"
  on scope1_refrigerant_logs for insert to anon with check (true);
drop policy if exists "anon delete scope1_refrigerant_logs" on scope1_refrigerant_logs;
create policy "anon delete scope1_refrigerant_logs"
  on scope1_refrigerant_logs for delete to anon using (true);

-- ============================================================
-- 20260506210000_admin_audit_log.sql
-- ============================================================
-- Admin write audit trail.
--
-- Records who/what/when on every insert + delete the AdminPortal
-- performs against the canonical data tables (fuel_bills, *_students,
-- study_abroad, faculty_travel, waste, scope1_fleet_records, etc.).
-- Surfaces on /admin/audit-log for accreditation reporting (AASHE
-- STARS likes a verifiable data-entry trail) and as a "what just
-- changed" debugging surface.
--
-- The actual auth boundary is the /api/admin/audit-log endpoint —
-- both POST (write) and GET (read) verify the admin bearer token
-- server-side before touching this table. RLS allows anon writes
-- because the API endpoint passes through to the same anon
-- Supabase client the rest of the dashboard uses (no service-role
-- key required to ship this).

create table if not exists admin_audit_log (
  id          bigserial primary key,
  created_at  timestamptz not null default now(),

  -- Optional actor hint. The current admin gate uses one shared
  -- password (no per-user identity), so this is usually null or a
  -- short opaque hash. When SSO admin auth ships, populate from the
  -- verified token's `sub` claim.
  actor_hash  text,

  -- 'insert' | 'update' | 'delete' — what the admin did.
  action      text not null
    constraint admin_audit_log_action_check check (action in ('insert', 'update', 'delete')),

  -- Canonical table the write targeted, e.g. 'fuel_bills'. Free-text
  -- so adding a new admin-managed table doesn't require a migration.
  table_name  text not null,

  -- For inserts: the row that was inserted. For deletes: the {id} of
  -- the deleted row. For updates: { before, after } if the admin form
  -- ever ships an edit flow.
  payload     jsonb,

  -- Optional human-readable note from the admin portal (e.g.
  -- "January 2026 oil delivery — Brockway Smith"). Free-text.
  note        text
);

create index if not exists admin_audit_log_created_idx
  on admin_audit_log (created_at desc);
create index if not exists admin_audit_log_table_idx
  on admin_audit_log (table_name, created_at desc);

alter table admin_audit_log enable row level security;

-- Anon read+write is intentional — the actual gate is the
-- /api/admin/audit-log endpoint that verifies the admin bearer
-- token. Anyone with the anon key (every browser session) can also
-- write/read directly, but the anon key is already public, so this
-- isn't a new attack surface — it's the same posture as fuel_bills.
drop policy if exists "anon read admin_audit_log" on admin_audit_log;
create policy "anon read admin_audit_log"
  on admin_audit_log for select to anon using (true);
drop policy if exists "anon insert admin_audit_log" on admin_audit_log;
create policy "anon insert admin_audit_log"
  on admin_audit_log for insert to anon with check (true);

-- ============================================================
-- 20260506220000_forest_stand_actuals.sql
-- ============================================================
-- Live forest-stand inventory — replaces the hardcoded forestStands
-- array in src/data/sinks.js once a real walk-through inventory is
-- entered. Each row is one stand of campus forest with measured acreage
-- and a per-acre sequestration rate (typically taken from Birdsey 1992
-- US-forest averages or Nowak 2013 stand-specific rates, but admins
-- can override per-stand based on a USFS FIA-style local survey).
--
-- The composeSinksFromActuals() helper sums acres × mtco2eAcreYr per
-- row. The useMeasuredSinks() hook flips Sinks.js from the seven
-- hardcoded stands to whatever rows live here the moment any are
-- present.

create table if not exists forest_stand_actuals (
  id                bigserial primary key,
  created_at        timestamptz not null default now(),

  -- Stable string ID lets the row be referenced from soil samples,
  -- per-stand action plans, etc. The hardcoded array's IDs are
  -- 'stand_north', 'stand_potato', etc. — admins can keep them or
  -- assign new ones.
  stand_id          text unique,

  name              text not null,
  acres             numeric(8, 1) not null check (acres >= 0),
  type              text
    constraint forest_stand_actuals_type_check check (type in (
      'mixed_hardwood', 'softwood', 'transitional', 'open_grown'
    )),
  age_class         text
    constraint forest_stand_actuals_age_check check (age_class in (
      'young', 'intermediate', 'mature', 'old_growth'
    )),
  mtco2e_acre_yr    numeric(5, 2) not null check (mtco2e_acre_yr >= 0),
  dominant_species  text,

  -- Optional per-stand survey data — date the inventory was taken,
  -- the surveyor or firm, and any free-form notes. Lets accreditation
  -- reviewers see HOW the per-acre rate was sourced.
  surveyed_at       date,
  surveyed_by       text,
  notes             text,

  -- school year is consistent across other admin tables.
  school_year       text
);

create index if not exists forest_stand_actuals_stand_idx
  on forest_stand_actuals (stand_id);
create index if not exists forest_stand_actuals_surveyed_idx
  on forest_stand_actuals (surveyed_at desc);

alter table forest_stand_actuals enable row level security;

drop policy if exists "anon read forest_stand_actuals" on forest_stand_actuals;
create policy "anon read forest_stand_actuals"
  on forest_stand_actuals for select to anon using (true);
drop policy if exists "anon insert forest_stand_actuals" on forest_stand_actuals;
create policy "anon insert forest_stand_actuals"
  on forest_stand_actuals for insert to anon with check (true);
drop policy if exists "anon delete forest_stand_actuals" on forest_stand_actuals;
create policy "anon delete forest_stand_actuals"
  on forest_stand_actuals for delete to anon using (true);

-- ============================================================
-- 20260517000000_alert_subscribers.sql
-- ============================================================
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
drop policy if exists alert_subscribers_anon_read on alert_subscribers;
create policy alert_subscribers_anon_read
  on alert_subscribers for select using (true);
drop policy if exists alert_subscribers_anon_insert on alert_subscribers;
create policy alert_subscribers_anon_insert
  on alert_subscribers for insert with check (true);
drop policy if exists alert_subscribers_anon_delete on alert_subscribers;
create policy alert_subscribers_anon_delete
  on alert_subscribers for delete using (true);

-- ============================================================
-- 20260517010000_alert_cron_state.sql
-- ============================================================
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
drop policy if exists alert_cron_state_no_anon on alert_cron_state;
create policy alert_cron_state_no_anon
  on alert_cron_state for all using (false);

-- ============================================================
-- 20260517020000_alert_history.sql
-- ============================================================
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
drop policy if exists alert_history_no_anon on alert_history;
create policy alert_history_no_anon
  on alert_history for all using (false);

-- ============================================================
-- 20260915120000_bms_meter_map.sql
-- ============================================================
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

drop policy if exists "allow anon select on bms_meter_map" on bms_meter_map;
create policy "allow anon select on bms_meter_map"
  on bms_meter_map for select to anon using (true);

drop policy if exists "allow anon insert on bms_meter_map" on bms_meter_map;
create policy "allow anon insert on bms_meter_map"
  on bms_meter_map for insert to anon with check (true);

drop policy if exists "allow anon update on bms_meter_map" on bms_meter_map;
create policy "allow anon update on bms_meter_map"
  on bms_meter_map for update to anon using (true) with check (true);

drop policy if exists "allow anon delete on bms_meter_map" on bms_meter_map;
create policy "allow anon delete on bms_meter_map"
  on bms_meter_map for delete to anon using (true);

-- ============================================================
-- 20260915140000_bms_export_summaries.sql
-- ============================================================
-- Uploaded hourly Meter Trends exports, parsed to the compact per-meter
-- summary the dashboard draws from.
--
-- Today refreshing the operational views means running
--   node scripts/parseBmsExport.mjs <export.csv> src/data/bmsExportSep2026.js
-- and committing a ~340 KB generated module — so the data only moves when a
-- developer is available. With this table an admin uploads the CSV on
-- /admin/bms-export, the browser parses it (src/data/parseBmsExport.js, the
-- same code the script runs), and the newest row wins over the committed
-- module.
--
-- `summary` holds the parsed per-meter array: ~104 meters × (24 hourly buckets
-- + one row per day). About 340 KB of JSON — comfortable for jsonb, and read
-- as a single row.
--
-- Rows are kept rather than replaced: each upload is a window of history, and
-- the admin page lists them so one can be rolled back to. Same posture as the
-- other admin tables — the bearer-token gate in the portal is the auth
-- boundary, not RLS.

create table if not exists bms_export_summaries (
  id            uuid primary key default gen_random_uuid(),
  source_file   text not null,
  window_start  timestamptz not null,
  window_end    timestamptz not null,
  hours_covered integer not null check (hours_covered > 0),
  meter_count   integer not null check (meter_count > 0),
  summary       jsonb not null,
  uploaded_by   text,
  created_at    timestamptz not null default now()
);

-- The dashboard always wants the most recent window.
create index if not exists bms_export_summaries_window_idx
  on bms_export_summaries (window_end desc, created_at desc);

alter table bms_export_summaries enable row level security;

drop policy if exists "allow anon select on bms_export_summaries" on bms_export_summaries;
create policy "allow anon select on bms_export_summaries"
  on bms_export_summaries for select to anon using (true);

drop policy if exists "allow anon insert on bms_export_summaries" on bms_export_summaries;
create policy "allow anon insert on bms_export_summaries"
  on bms_export_summaries for insert to anon with check (true);

drop policy if exists "allow anon delete on bms_export_summaries" on bms_export_summaries;
create policy "allow anon delete on bms_export_summaries"
  on bms_export_summaries for delete to anon using (true);
