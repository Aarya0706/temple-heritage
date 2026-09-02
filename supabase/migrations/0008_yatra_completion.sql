-- Adds "mark as done" support to saved Yatra itineraries, which powers the
-- stats block on My Yatras: completed count, streak, and region badges.
--
-- No `region` column is added here. Temple data (including each temple's
-- `region`) lives in data/temples.ts, not a Supabase table, so there's
-- nothing in Postgres to derive/join a region column from. Region is
-- computed in the app layer instead, by resolving each plan's
-- itinerary->days->templeSlugs against data/temples.ts (see
-- lib/yatra-stats.ts). This also naturally supports a plan whose temples
-- span more than one region, crediting a badge for each.
--
-- Likewise, no user_badges table: with only 5 fixed regions, "which
-- regions has this user completed a Yatra in" is cheap to compute on read
-- from yatra_plans directly (see computeYatraStats in lib/yatra-stats.ts).
-- That keeps a single source of truth instead of a second table that can
-- drift if a plan is later deleted or un-completed.

alter table public.yatra_plans
  add column if not exists completed_at timestamptz;

-- Supports "how many has this user completed" / streak queries, which
-- filter on user_id and want completed rows ordered by completed_at.
create index if not exists idx_yatra_plans_completed
  on public.yatra_plans (user_id, completed_at desc)
  where completed_at is not null;

-- Reuses the existing "yatra_plans_update_own" policy from 0007 (owners
-- can update their own rows) — no new RLS policy needed for this column.
