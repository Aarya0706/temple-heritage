-- Passport feature: check-ins, share tokens, auto-stamp-on-review trigger,
-- and the public share view.
--
-- Notes on what this reconciles vs. the original lib/passport.ts:
--   * profiles has full_name (not username/avatar_url) — we add
--     passport_share_token here and the app code now reads full_name.
--   * temple_reviews keys on temple_slug, not temple_id — check_ins follows
--     the same convention so the review trigger can join cleanly.
--   * Temple display details (name/city/image) are NOT looked up from a
--     Supabase "temples" table — they come from data/temples.ts in the app
--     by slug. This migration only stores the slug.

-- 1. Share token on profiles ------------------------------------------------
alter table public.profiles
  add column if not exists passport_share_token uuid not null default gen_random_uuid();

create unique index if not exists profiles_passport_share_token_idx
  on public.profiles (passport_share_token);

-- 2. check_ins table (the "stamps") -----------------------------------------
create table if not exists public.check_ins (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  temple_slug      text not null,
  visited_at       timestamptz not null default now(),
  check_in_method  text not null default 'manual'
                     check (check_in_method in ('manual', 'review', 'qr', 'geo')),
  created_at       timestamptz not null default now(),
  unique (user_id, temple_slug)
);

create index if not exists check_ins_user_id_idx on public.check_ins (user_id);

alter table public.check_ins enable row level security;

create policy "Users can view their own check-ins"
  on public.check_ins for select
  using (auth.uid() = user_id);

create policy "Users can insert their own check-ins"
  on public.check_ins for insert
  with check (auth.uid() = user_id);

-- 3. Auto-stamp when a review is left ---------------------------------------
-- security definer so it can write regardless of who's inserting the review,
-- and so it isn't blocked by the check_ins RLS insert policy above.
create or replace function public.handle_review_check_in()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.check_ins (user_id, temple_slug, check_in_method)
  values (new.user_id, new.temple_slug, 'review')
  on conflict (user_id, temple_slug) do nothing; -- don't downgrade an earlier manual/qr/geo stamp's date
  return new;
end;
$$;

drop trigger if exists trg_review_check_in on public.temple_reviews;

create trigger trg_review_check_in
  after insert on public.temple_reviews
  for each row
  execute function public.handle_review_check_in();

-- 4. Public share view --------------------------------------------------------
-- Anon-readable by design (that's the point of a share link). Views run with
-- the privileges of their owner for RLS purposes, so as long as this
-- migration is applied by a role that can already read check_ins/profiles
-- (e.g. the Supabase migration/service role), anonymous visitors will be
-- able to read through this view even though check_ins itself is locked
-- down to auth.uid() = user_id above. If you ever change the view's owner,
-- re-check that this still holds.
create or replace view public.passport_share_view as
select
  c.user_id,
  c.temple_slug,
  c.visited_at,
  c.check_in_method,
  p.full_name              as username,
  p.passport_share_token
from public.check_ins c
join public.profiles p on p.id = c.user_id;

grant select on public.passport_share_view to anon, authenticated;
