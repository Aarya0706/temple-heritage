-- saved_temples: a user's "My Yatras" saved-temple list.
-- Reconstructed from app/api/saved-temples/route.ts and app/my-yatras/page.tsx.
-- temple_slug is a plain text reference into data/temples.ts (temples are
-- static app data, not a DB table), not a foreign key.

create table if not exists public.saved_temples (
  user_id uuid not null references auth.users(id) on delete cascade,
  temple_slug text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, temple_slug)
);

alter table public.saved_temples enable row level security;

create policy "saved_temples_insert_own"
  on public.saved_temples for insert
  with check (auth.uid() = user_id);

create policy "saved_temples_delete_own"
  on public.saved_temples for delete
  using (auth.uid() = user_id);

-- ReviewsSection reads saved_temples for every visitor on a temple detail
-- page (public) to compute the "Verified visitor" badge — it needs to know
-- *which users* saved a given temple slug, not just the current user's own
-- rows. The table only has (user_id, temple_slug, created_at), nothing
-- sensitive, so a public select policy is fine here rather than routing
-- this through a service-role call.
create policy "saved_temples_select_public"
  on public.saved_temples for select
  using (true);
