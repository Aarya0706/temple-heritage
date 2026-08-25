-- Adds view-only public sharing to saved Yatra itineraries.
-- A plan's own `id` (already an unguessable UUID) doubles as its share
-- token, so no separate slug column is needed — toggling `is_public` is
-- all that's required to mint/revoke a working /yatra/[id] link.

alter table public.yatra_plans
  add column if not exists is_public boolean not null default false;

-- Anyone (including anon/unauthenticated requests) can read a plan once
-- its owner has marked it public. This is intentionally separate from
-- "yatra_plans_select_own" — a plan is visible if EITHER policy matches.
create policy "yatra_plans_select_public"
  on public.yatra_plans for select
  using (is_public = true);

-- Owners can flip the flag on their own plans. No general "update own"
-- policy exists yet, so this is scoped narrowly to what the share
-- feature needs rather than opening up arbitrary field edits.
create policy "yatra_plans_update_own"
  on public.yatra_plans for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists idx_yatra_plans_public on public.yatra_plans (id) where is_public = true;
