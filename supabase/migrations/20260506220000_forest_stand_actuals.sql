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

create policy if not exists "anon read forest_stand_actuals"
  on forest_stand_actuals for select to anon using (true);
create policy if not exists "anon insert forest_stand_actuals"
  on forest_stand_actuals for insert to anon with check (true);
create policy if not exists "anon delete forest_stand_actuals"
  on forest_stand_actuals for delete to anon using (true);
