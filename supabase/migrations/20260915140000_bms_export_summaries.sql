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

create policy if not exists "allow anon select on bms_export_summaries"
  on bms_export_summaries for select to anon using (true);

create policy if not exists "allow anon insert on bms_export_summaries"
  on bms_export_summaries for insert to anon with check (true);

create policy if not exists "allow anon delete on bms_export_summaries"
  on bms_export_summaries for delete to anon using (true);
