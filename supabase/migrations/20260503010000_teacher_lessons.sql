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
create policy if not exists "anon read published teacher lessons"
  on teacher_lessons for select to anon
  using (status = 'published');
