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
create policy if not exists "anon read admin_audit_log"
  on admin_audit_log for select to anon using (true);
create policy if not exists "anon insert admin_audit_log"
  on admin_audit_log for insert to anon with check (true);
