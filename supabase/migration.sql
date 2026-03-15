-- ─────────────────────────────────────────────────────────
-- Venus — Supabase Migration
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor)
-- ─────────────────────────────────────────────────────────

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ─── Enums ──────────────────────────────────────────────
create type public.project_auth as enum ('public', 'password', 'otp');

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
  auth_type         public.project_auth not null default 'public',
  password_hash     text,
  project_password  text,
  published         boolean not null default false,
  view_count        bigint not null default 0,
  lead_count        bigint not null default 0,
  theme             text not null default 'minimal',
  remember_visitor  boolean not null default true,
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
  ip_hash    text,
  created_at timestamptz default now()
);

create index if not exists idx_leads_project_id on public.leads(project_id);

-- ─── Visitors ───────────────────────────────────────────
create table if not exists public.visitors (
  id         uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  lead_id    uuid references public.leads(id) on delete set null,
  ip_hash    text,
  device     text,
  visited_at timestamptz default now()
);

create index if not exists idx_visitors_project_id on public.visitors(project_id);

-- ═════════════════════════════════════════════════════════
-- Row Level Security Policies
-- ═════════════════════════════════════════════════════════

-- ─── Users ──────────────────────────────────────────────
alter table public.users enable row level security;

-- Remove legacy manual insert policy since DB trigger handles it
drop policy if exists "users_insert_own" on public.users;

-- Users can read and update their own profile
create policy "users_select_own" on public.users
  for select using (auth.uid() = id);

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

-- Public can read published public projects (for the public project page)
create policy "projects_select_public" on public.projects
  for select using (published = true and auth_type = 'public');

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

-- ─── Functions ──────────────────────────────────────────
-- Trigger for leads
create or replace function public.handle_lead_increment()
returns trigger as $$
begin
  update public.projects
  set lead_count = lead_count + 1
  where id = NEW.project_id;
  return NEW;
end;
$$ language plpgsql security definer;

create trigger lead_counter_trigger
after insert on public.leads
for each row execute function public.handle_lead_increment();

-- Trigger for visitors
create or replace function public.handle_visitor_increment()
returns trigger as $$
begin
  update public.projects
  set view_count = view_count + 1
  where id = NEW.project_id;
  return NEW;
end;
$$ language plpgsql security definer;

create trigger visitor_counter_trigger
after insert on public.visitors
for each row execute function public.handle_visitor_increment();

-- ─── Subscriptions ──────────────────────────────────────
create table if not exists public.subscriptions (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null references public.users(id) on delete cascade unique,
  plan                text not null default 'free', -- 'free', 'starter', 'studio', 'agency'
  credits             integer not null default 1,     -- max projects for plan
  projects_used       integer not null default 0,
  status              text not null default 'active',
  current_period_end  timestamptz,
  created_at          timestamptz default now(),
  plan_updated_at     timestamptz default now()
);

create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);

-- Enable RLS for Subscriptions
alter table public.subscriptions enable row level security;

create policy "subscriptions_select_own" on public.subscriptions
  for select using (auth.uid() = user_id);

-- ─── Slug Redirects ────────────────────────────────────
create table if not exists public.slug_redirects (
  id         uuid primary key default uuid_generate_v4(),
  old_slug   text unique not null,
  new_slug   text not null,
  project_id uuid not null references public.projects(id) on delete cascade,
  created_at timestamptz default now()
);

create index if not exists idx_slug_redirects_old_slug on public.slug_redirects(old_slug);

-- Enable RLS for Slug Redirects
alter table public.slug_redirects enable row level security;

-- Public can read redirects
create policy "slug_redirects_select_public" on public.slug_redirects
  for select using (true);

-- ─── Indices for Funnel ────────────────────────────────
create index if not exists idx_visitors_lead_id on public.visitors(lead_id);
create index if not exists idx_leads_project_id_created_at on public.leads(project_id, created_at desc);
create index if not exists idx_visitors_project_id on public.visitors(project_id);
create index if not exists idx_projects_user_id on public.projects(user_id);
