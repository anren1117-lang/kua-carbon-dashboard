// Single source of truth for the list of admin data tables. Used by:
//   • AdminDataQuality — full per-table inventory with freshness pills
//   • AdminHome       — top-of-page freshness alert
//
// `tsCol` is the column the freshness check sorts by (different
// tables use different timestamp columns).
//
// `cadence` selects the bucket thresholds in src/utils/freshness.js:
//   monthly:    fresh < 60d,   aging 60–120d,   stale > 120d
//   quarterly:  fresh < 120d,  aging 120–365d,  stale > 365d
//   annual:     fresh < 540d,  aging 540–720d,  stale > 720d
//   irregular:  no staleness check (event-driven tables)
//
// `cta` is the admin route an empty/stale table links to.

export const ADMIN_TABLE_SOURCES = [
  // ─── Scope 1 ──────────────────────────────────────────────────
  { table: 'fuel_bills',                label: 'Fuel bills',                       scope: 'Scope 1',     tsCol: 'date',          cadence: 'monthly',   cta: '/admin/scope-1/heating-oil' },
  { table: 'scope1_heating_oil',        label: 'Heating oil deliveries',           scope: 'Scope 1',     tsCol: 'delivery_date', cadence: 'monthly',   cta: '/admin/scope-1/heating-oil' },
  { table: 'scope1_propane',            label: 'Propane deliveries',               scope: 'Scope 1',     tsCol: 'delivery_date', cadence: 'monthly',   cta: '/admin/scope-1/propane' },
  { table: 'scope1_fleet',              label: 'Fleet fuel records',               scope: 'Scope 1',     tsCol: 'period_end',    cadence: 'monthly',   cta: '/admin/scope-1/fleet' },
  { table: 'scope1_refrigerants',       label: 'Refrigerant service logs',         scope: 'Scope 1',     tsCol: 'service_date',  cadence: 'irregular', cta: '/admin/scope-1/refrigerants' },
  // ─── Scope 3 — cohorts ────────────────────────────────────────
  { table: 'day_students',              label: 'Day students',                     scope: 'Scope 3',     tsCol: 'created_at',    cadence: 'annual',    cta: '/admin/scope-3' },
  { table: 'us_boarding_students',      label: 'US boarding students',             scope: 'Scope 3',     tsCol: 'created_at',    cadence: 'annual',    cta: '/admin/scope-3' },
  { table: 'international_students',    label: 'International students',           scope: 'Scope 3',     tsCol: 'created_at',    cadence: 'annual',    cta: '/admin/scope-3' },
  // ─── Scope 3 — trips + waste + spend + commute ────────────────
  { table: 'study_abroad',              label: 'Study abroad trips',               scope: 'Scope 3',     tsCol: 'departure_date',cadence: 'irregular', cta: '/admin/scope-3' },
  { table: 'faculty_travel',            label: 'Faculty travel',                   scope: 'Scope 3',     tsCol: 'departure_date',cadence: 'irregular', cta: '/admin/scope-3' },
  { table: 'waste',                     label: 'Waste records',                    scope: 'Scope 3',     tsCol: 'date',          cadence: 'monthly',   cta: '/admin/scope-3' },
  { table: 'purchased_goods',           label: 'Purchased goods (Cat 1 EEIO)',     scope: 'Scope 3',     tsCol: 'created_at',    cadence: 'quarterly', cta: '/admin/scope-3/cat1-purchased-goods' },
  { table: 'commuting',                 label: 'Faculty/staff commute (Cat 7)',    scope: 'Scope 3',     tsCol: 'created_at',    cadence: 'annual',    cta: '/admin/scope-3/cat7-commuting' },
  // ─── Sinks ────────────────────────────────────────────────────
  { table: 'forest_stand_actuals',      label: 'Forest stand inventory',           scope: 'Sinks',       tsCol: 'created_at',    cadence: 'irregular', cta: '/admin/sinks/stands' },
  // ─── Renewables ───────────────────────────────────────────────
  { table: 'renewables_solar',          label: 'Solar PV records',                 scope: 'Renewables',  tsCol: 'period_end',    cadence: 'monthly',   cta: '/admin/renewables/solar' },
  { table: 'renewables_geothermal',     label: 'Geothermal records',               scope: 'Renewables',  tsCol: 'period_end',    cadence: 'monthly',   cta: '/admin/renewables/geothermal' },
  { table: 'renewables_wind',           label: 'Wind asset documentation',         scope: 'Renewables',  tsCol: 'as_of_date',    cadence: 'irregular', cta: '/admin/renewables/wind' },
];
