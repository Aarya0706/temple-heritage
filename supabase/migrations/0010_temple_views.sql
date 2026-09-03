-- temple_views: lightweight per-temple view counter, feeding the "most
-- viewed temples" chart on the admin analytics dashboard. One row per
-- temple slug rather than one row per visit -- we only need the running
-- count, and a row-per-visit table would grow unbounded for no benefit
-- here.
--
-- Writes go through increment_temple_view() below (SECURITY DEFINER), not
-- direct table access -- most page views come from anonymous visitors who
-- have no row of their own to satisfy a normal "auth.uid() = ..." RLS
-- policy, and a shared counter row can't be scoped to a single user
-- anyway. The function bypasses RLS by design; the table itself grants no
-- direct insert/update/delete to any client role.

create table if not exists public.temple_views (
  temple_slug text primary key,
  view_count bigint not null default 0,
  last_viewed_at timestamptz not null default now()
);

alter table public.temple_views enable row level security;

-- Counts aren't sensitive on their own, but this table is only ever read
-- from the admin dashboard, so it's gated the same way as the other
-- platform-wide stats in 0009_admin_stats.sql for consistency.
create policy "temple_views_select_admin"
  on public.temple_views for select
  using (public.is_admin());

create or replace function public.increment_temple_view(p_slug text)
returns void as $$
  insert into public.temple_views (temple_slug, view_count, last_viewed_at)
  values (p_slug, 1, now())
  on conflict (temple_slug)
  do update set
    view_count = public.temple_views.view_count + 1,
    last_viewed_at = now();
$$ language sql security definer;

-- Both anon and authenticated visitors load temple detail pages.
grant execute on function public.increment_temple_view(text) to anon, authenticated;
