-- ─────────────────────────────────────────────────────────
-- Venus — Supabase Migration
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor)
-- ─────────────────────────────────────────────────────────

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ─── Users ──────────────────────────────────────────────
create table if not exists public.users (
  id         uuid primary key default uuid_generate_v4(),
  email      text,
  name       text,
  created_at timestamptz default now()
);

-- ─── Projects ───────────────────────────────────────────
create table if not exists public.projects (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid not null references public.users(id) on delete cascade,
  name              text not null,
  slug              text unique not null,
  thumbnail_light   text,
  thumbnail_dark    text,
  short_description text,
  long_description  text,
  stream_url        text,
  auth_type         text not null default 'public' check (auth_type in ('public', 'password', 'otp')),
  password          text,
  published         boolean not null default false,
  created_at        timestamptz default now()
);

create index if not exists idx_projects_user_id on public.projects(user_id);
create index if not exists idx_projects_slug    on public.projects(slug);

-- ─── Leads ──────────────────────────────────────────────
create table if not exists public.leads (
  id         uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name       text not null,
  phone      text,
  email      text,
  verified   boolean not null default false,
  created_at timestamptz default now()
);

create index if not exists idx_leads_project_id on public.leads(project_id);

-- ─── Visitors ───────────────────────────────────────────
create table if not exists public.visitors (
  id         uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  lead_id    uuid references public.leads(id) on delete set null,
  ip         text,
  device     text,
  visited_at timestamptz default now()
);

create index if not exists idx_visitors_project_id on public.visitors(project_id);

-- ═════════════════════════════════════════════════════════
-- Row Level Security Policies
-- ═════════════════════════════════════════════════════════

-- ─── Users ──────────────────────────────────────────────
alter table public.users enable row level security;

-- Users can read and update their own profile
create policy "users_select_own" on public.users
  for select using (auth.uid() = id);

create policy "users_insert_own" on public.users
  for insert with check (auth.uid() = id);

create policy "users_update_own" on public.users
  for update using (auth.uid() = id);

-- ─── Projects ───────────────────────────────────────────
alter table public.projects enable row level security;

-- Owners can CRUD their own projects
create policy "projects_select_own" on public.projects
  for select using (auth.uid() = user_id);

create policy "projects_insert_own" on public.projects
  for insert with check (auth.uid() = user_id);

create policy "projects_update_own" on public.projects
  for update using (auth.uid() = user_id);

create policy "projects_delete_own" on public.projects
  for delete using (auth.uid() = user_id);

-- Public can read published projects (for the public project page)
create policy "projects_select_published" on public.projects
  for select using (published = true);

-- ─── Leads ──────────────────────────────────────────────
alter table public.leads enable row level security;

-- Anyone can insert a lead (anonymous lead capture)
create policy "leads_insert_anon" on public.leads
  for insert with check (true);

-- Only project owners can read leads for their projects
create policy "leads_select_owner" on public.leads
  for select using (
    project_id in (
      select id from public.projects where user_id = auth.uid()
    )
  );

-- ─── Visitors ───────────────────────────────────────────
alter table public.visitors enable row level security;

-- Anyone can insert a visitor record
create policy "visitors_insert_anon" on public.visitors
  for insert with check (true);

-- Project owners can read visitors for their projects
create policy "visitors_select_owner" on public.visitors
  for select using (
    project_id in (
      select id from public.projects where user_id = auth.uid()
    )
  );
