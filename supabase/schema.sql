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
  features text[],
  challenges text,
  solution text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_slug_idx on public.projects (slug);
create index if not exists projects_year_idx on public.projects (year);
create index if not exists projects_featured_idx on public.projects (featured) where featured = true;

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

-- RLS: public reads only. Add owner-scoped write policies together with the
-- authenticated server-side CMS; "authenticated" alone is not an admin role.
alter table public.projects enable row level security;

drop policy if exists "Public read projects" on public.projects;
create policy "Public read projects" on public.projects for select using (true);

drop policy if exists "Authenticated write projects" on public.projects;

-- Clean up permissive policies from earlier versions if those optional
-- relation tables already exist in this database.
do $$
begin
  if to_regclass('public.tags') is not null then
    execute 'drop policy if exists "Authenticated write tags" on public.tags';
  end if;
  if to_regclass('public.project_tags') is not null then
    execute 'drop policy if exists "Authenticated write project_tags" on public.project_tags';
  end if;
  if to_regclass('public.project_images') is not null then
    execute 'drop policy if exists "Authenticated write project_images" on public.project_images';
  end if;
  if to_regclass('public.links') is not null then
    execute 'drop policy if exists "Authenticated write links" on public.links';
  end if;
end;
$$;
