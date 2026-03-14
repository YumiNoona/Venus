## Venus · Architectural Experience Studio

Venus is a focused SaaS tool for architecture studios and ArchViz creators to present interactive, streamed experiences through calm, minimal project pages.

### Tech stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI**: Lightweight shadcn-style primitives
- **Backend & DB**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth

### Project structure

- `app/` – App Router pages (dashboard, projects, leads, public project)
- `components/` – Reusable UI and layout components
- `lib/` – Supabase clients, auth helpers, utilities
- `types/` – Database typings
- `styles/` – Global Tailwind-powered styles

### Environment variables

Create a `.env.local` file with:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
```

These are used in `lib/supabase-browser.ts` and `lib/supabase-server.ts` to create browser and server Supabase clients.

### Database schema (Supabase)

Create the following tables in Supabase (SQL editor):

```sql
create table public.users (
  id uuid primary key,
  email text,
  name text,
  created_at timestamp with time zone default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null unique,
  thumbnail_light text,
  thumbnail_dark text,
  short_description text,
  long_description text,
  stream_url text,
  auth_type text not null default 'public',
  password text,
  published boolean not null default false,
  created_at timestamp with time zone default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  verified boolean not null default false,
  created_at timestamp with time zone default now()
);

create table public.visitors (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  lead_id uuid references public.leads(id),
  ip text,
  device text,
  visited_at timestamp with time zone default now()
);
```

### Row-level security (RLS)

Enable RLS on the main tables:

```sql
alter table public.users enable row level security;
alter table public.projects enable row level security;
alter table public.leads enable row level security;
alter table public.visitors enable row level security;
```

#### Users

```sql
create policy "Users can see their profile"
  on public.users
  for select
  using (auth.uid() = id);

create policy "Users can insert their profile"
  on public.users
  for insert
  with check (auth.uid() = id);
```

#### Projects

```sql
create policy "Users can manage their projects"
  on public.projects
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Anyone can view published projects by slug"
  on public.projects
  for select
  using (published = true);
```

#### Leads

```sql
create policy "Public can create leads"
  on public.leads
  for insert
  with check (
    exists (
      select 1
      from public.projects p
      where p.id = project_id
        and p.published = true
    )
  );

create policy "Studio can read leads through their projects"
  on public.leads
  for select
  using (
    exists (
      select 1
      from public.projects p
      where p.id = project_id
        and p.user_id = auth.uid()
    )
  );
```

#### Visitors

```sql
create policy "Public can insert visitors"
  on public.visitors
  for insert
  with check (true);

create policy "Studio can see visitors for their projects"
  on public.visitors
  for select
  using (
    exists (
      select 1
      from public.projects p
      where p.id = project_id
        and p.user_id = auth.uid()
    )
  );
```

### Running locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` for the marketing entry page, `/signup` to create a studio account, and `/dashboard` for the authenticated dashboard.

