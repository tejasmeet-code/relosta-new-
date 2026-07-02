-- Supabase schema for applications

-- Applications table
create table if not exists public.applications (
  app_id text primary key,
  role_id text not null,
  role_title text,
  submitted_at timestamptz,
  status text,
  decided_at timestamptz,
  name text,
  discord_username text,
  discord_user_id text,
  answers jsonb
);
create index if not exists idx_applications_submitted_at on public.applications (submitted_at desc);

-- Closed roles table
create table if not exists public.closed_roles (
  role_id text primary key
);

-- Quick permissive RLS policies for development ONLY
alter table public.applications enable row level security;
create policy if not exists anon_full_access_applications on public.applications
  for all using (true) with check (true);

alter table public.closed_roles enable row level security;
create policy if not exists anon_full_access_closed_roles on public.closed_roles
  for all using (true) with check (true);
