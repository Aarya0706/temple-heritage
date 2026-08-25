-- profiles: one row per auth user, extending auth.users with app-level fields.
-- Reconstructed from live usage (lib/require-admin.ts, app/profile/page.tsx,
-- app/api/reviews/route.ts). Run this before any migration that references
-- public.profiles.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can see and edit only their own profile row.
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Row is created once, at signup — insert is restricted to the user
-- creating their own row (matches the auth.uid()=id pattern used elsewhere).
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);
