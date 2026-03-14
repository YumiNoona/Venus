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

---

## Application structure

### App routes (`app/`)

- `/` (`app/page.tsx`): marketing entry page with CTA to `/signup` and `/login`.
- `/signup` (`app/signup/page.tsx`): studio signup, creates Supabase Auth user and inserts a `users` row.
- `/login` (`app/login/page.tsx`): email/password login, redirects to `/dashboard`.
- `/dashboard` (`app/dashboard/page.tsx`): protected overview with project/lead/visitor counts.
- `/projects` (`app/projects/page.tsx`): protected project grid, one card per project.
- `/projects/new` (`app/projects/new/page.tsx`): new project editor, uses `ProjectForm`.
- `/projects/edit/[id]` (`app/projects/edit/[id]/page.tsx`): edit existing project for the current user.
- `/leads` (`app/leads/page.tsx`): protected lead table across all projects.
- `/project/[slug]` (`app/project/[slug]/page.tsx`): public project page, only serves rows where `published = true`.
- `/api/visit` (`app/api/visit/route.ts`): records `visitors` row when a public project page loads.

### Components (`components/`)

- `navbar.tsx`: top bar shared across public pages, shows brand + auth state.
- `sidebar.tsx`: left navigation for dashboard (Dashboard / Projects / Leads / Settings).
- `dashboard-stats.tsx`: Vercel-style stat cards for projects, leads, visitors.
- `project-card.tsx`: grid card with thumbnail, name, status, and Edit button.
- `project-form.tsx`: client-side form for creating/updating projects, with live preview and slug generation/uniqueness logic.
- `lead-modal.tsx`: lead capture dialog (name/phone/email) that inserts into `leads` then redirects to `stream_url`.
- `visitor-tracker.tsx`: client-only tracker that POSTs to `/api/visit` once on page load.
- `ui.tsx`: shared primitives (`Button`, `Card`, `Input`, `Textarea`, `Label`, `Badge`, `Dialog*`) encoding dark theme and micro-interactions.

### Libraries & utilities (`lib/`)

- `supabase-browser.ts`: browser Supabase client for client components.
- `supabase-server.ts`: server Supabase client for server components and route handlers, with cookie integration.
- `auth.ts`: `requireUser()` (guards dashboard routes) and `getOptionalUser()` (used in `Navbar`).
- `slugify.ts`: stable slug generator from project name.
- `utils.ts`: Tailwind `cn` helper.

### Types & styling

- `types/database.ts`: typed Supabase schema for `users`, `projects`, `leads`, `visitors`.
- `styles/globals.css`: Tailwind setup, dark palette tokens, and shared utility classes like `.glass-panel` and `.btn-primary`.

---

## Implemented flows

- **Studio workflow**
  - Sign up at `/signup` → profile row inserted into `users`.
  - Log in at `/login` → redirected to `/dashboard`.
  - Create/edit projects via `/projects/new` and `/projects/edit/[id]` using `ProjectForm`.
  - Publish projects and share `/project/[slug]` URL with clients.
- **Client workflow**
  - Open `/project/[slug]` (only if `published = true`).
  - Read story content, thumbnails, and details.
  - Click “Dive experience” → `LeadModal` captures lead, inserts into `leads`, then redirects to validated `https://` streaming URL.
- **Analytics**
  - `/dashboard` shows counts for projects, leads, visitors.
  - `/leads` lists latest leads with project context and contact info.
  - `VisitorTracker` + `/api/visit` record basic visitor events on public project views.

---

## Security & server/client boundaries

- **Supabase clients**
  - Server components and API routes use `lib/supabase-server.ts`.
  - Client components use `lib/supabase-browser.ts`.
- **RLS-backed access control**
  - Projects: only owner (`user_id = auth.uid()`) can manage; anyone can read `published = true` rows.
  - Leads: public can insert for existing published projects; only owners can read leads on their projects.
  - Visitors: public can insert; only owners can read visitors on their projects.
  - Users: each user can see/insert only their own profile row.
- **Public route safety**
  - `/project/[slug]` always filters by `slug` **and** `published = true`.
  - Streaming URLs are validated to start with `https://` before redirecting clients.

---

## Pending / intentionally out of scope

The following items from the original product brief are **not implemented yet** and are good candidates for future work:

- Settings page content and studio-level configuration.
- Explicit logout button / sign-out flow.
- Enforcing password-protected or OTP-based client access (`auth_type = 'password' | 'otp'` exists but is not wired).
- Advanced analytics charts or time-series visualizations (only counts and tables are present).
- Multi-tenant organizations or team accounts.
- Billing, subscription plans, and payments.
- Custom domains per studio.

