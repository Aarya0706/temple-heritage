-- Pilgrimage Passport: check_ins table + RLS + share token on profiles
-- Adjust column/table names in the ASSUMPTIONS block below if your schema differs.

-- ASSUMPTIONS (match against your actual schema before running):
--   temples(id uuid, name text, city text, state text, image_url text)
--   reviews(id uuid, user_id uuid, temple_id uuid, created_at timestamptz)
--   profiles(id uuid, is_admin boolean, ...)  -- from your admin dashboard work

-- 1. check_ins table
create table if not exists public.check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  temple_id uuid not null references public.temples(id) on delete cascade,
  visited_at timestamptz not null default now(),
  check_in_method text not null default 'manual' check (check_in_method in ('manual', 'review', 'qr', 'geo')),
  source_review_id uuid references public.reviews(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (user_id, temple_id) -- one stamp per temple per user; visited_at holds the first visit
);

create index if not exists check_ins_user_id_idx on public.check_ins(user_id);
create index if not exists check_ins_temple_id_idx on public.check_ins(temple_id);

-- 2. RLS
alter table public.check_ins enable row level security;

-- users can see their own check-ins
create policy "check_ins_select_own"
  on public.check_ins for select
  using (auth.uid() = user_id);

-- users can insert their own check-ins (manual "Mark as visited" button)
create policy "check_ins_insert_own"
  on public.check_ins for insert
  with check (auth.uid() = user_id);

-- users can delete their own check-ins (undo)
create policy "check_ins_delete_own"
  on public.check_ins for delete
  using (auth.uid() = user_id);

-- admins can view all check-ins (mirrors your admin dashboard RLS pattern)
create policy "check_ins_select_admin"
  on public.check_ins for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

-- 3. Auto check-in on review submission
create or replace function public.handle_review_checkin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.check_ins (user_id, temple_id, check_in_method, source_review_id)
  values (new.user_id, new.temple_id, 'review', new.id)
  on conflict (user_id, temple_id) do nothing; -- already stamped, don't overwrite visited_at
  return new;
end;
$$;

drop trigger if exists trg_review_checkin on public.reviews;
create trigger trg_review_checkin
  after insert on public.reviews
  for each row execute function public.handle_review_checkin();

-- 4. Share token on profiles (random, public-safe, not the raw user id)
alter table public.profiles
  add column if not exists passport_share_token uuid default gen_random_uuid();

-- backfill any existing rows
update public.profiles set passport_share_token = gen_random_uuid()
  where passport_share_token is null;

-- public (anon) read access to the passport share view only — see view below
create or replace view public.passport_share_view as
  select
    p.id as user_id,
    p.passport_share_token,
    p.username,
    p.avatar_url,
    ci.temple_id,
    ci.visited_at,
    t.name as temple_name,
    t.city,
    t.state,
    t.image_url
  from public.profiles p
  join public.check_ins ci on ci.user_id = p.id
  join public.temples t on t.id = ci.temple_id;

grant select on public.passport_share_view to anon, authenticated;
