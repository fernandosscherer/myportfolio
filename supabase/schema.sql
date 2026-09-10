-- Fernando Scherer Portfolio — Supabase Schema
-- Run in the Supabase SQL Editor.

-- Projects table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null,
  description text not null,
  category text[] not null default '{}',
  status text not null default 'Completed',
  year integer not null,
  client text,
  featured boolean not null default false,
  links jsonb not null default '[]',
  tags text[] not null default '{}',
  results jsonb,
  images jsonb,
  architecture text,
  features text[],
  challenges text,
  solution text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_slug_idx on public.projects (slug);
create index if not exists projects_year_idx on public.projects (year);
create index if not exists projects_featured_idx on public.projects (featured) where featured = true;

-- Tags table
create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  color text not null default '#A1A1AA',
  category text not null default 'Other'
);

-- project_tags (N:N)
create table if not exists public.project_tags (
  project_id uuid references public.projects (id) on delete cascade,
  tag_id uuid references public.tags (id) on delete cascade,
  primary key (project_id, tag_id)
);

-- project_images
create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects (id) on delete cascade,
  url text not null,
  caption text,
  position integer not null default 0
);

-- links
create table if not exists public.links (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects (id) on delete cascade,
  type text not null,
  url text not null
);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

-- RLS: enable but allow public read; admin writes via authenticated role.
alter table public.projects enable row level security;
alter table public.tags enable row level security;
alter table public.project_tags enable row level security;
alter table public.project_images enable row level security;
alter table public.links enable row level security;

create policy "Public read projects" on public.projects for select using (true);
create policy "Public read tags" on public.tags for select using (true);
create policy "Public read project_tags" on public.project_tags for select using (true);
create policy "Public read project_images" on public.project_images for select using (true);
create policy "Public read links" on public.links for select using (true);

create policy "Authenticated write projects" on public.projects
  for all to authenticated using (true) with check (true);
create policy "Authenticated write tags" on public.tags
  for all to authenticated using (true) with check (true);
create policy "Authenticated write project_tags" on public.project_tags
  for all to authenticated using (true) with check (true);
create policy "Authenticated write project_images" on public.project_images
  for all to authenticated using (true) with check (true);
create policy "Authenticated write links" on public.links
  for all to authenticated using (true) with check (true);