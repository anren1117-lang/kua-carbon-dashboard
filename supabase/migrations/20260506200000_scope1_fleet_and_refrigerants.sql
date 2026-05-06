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
create policy if not exists "anon read scope1_fleet_records"
  on scope1_fleet_records for select to anon using (true);
create policy if not exists "anon insert scope1_fleet_records"
  on scope1_fleet_records for insert to anon with check (true);
create policy if not exists "anon delete scope1_fleet_records"
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

create policy if not exists "anon read scope1_refrigerant_logs"
  on scope1_refrigerant_logs for select to anon using (true);
create policy if not exists "anon insert scope1_refrigerant_logs"
  on scope1_refrigerant_logs for insert to anon with check (true);
create policy if not exists "anon delete scope1_refrigerant_logs"
  on scope1_refrigerant_logs for delete to anon using (true);
