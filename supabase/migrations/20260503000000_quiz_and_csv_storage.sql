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
create policy if not exists "allow anon select on quiz_attempts"
  on quiz_attempts for select to anon using (true);
create policy if not exists "allow anon select on meter_readings_csv"
  on meter_readings_csv for select to anon using (true);
