-- Admin dashboard stats: profiles_select_own (0001) and yatra_plans_select_own
-- (0004) only let a user see their own row, which is correct for normal
-- use but blocks an admin from running platform-wide counts (total users,
-- total yatra plans) through the regular RLS-scoped client. saved_temples
-- already has a public select policy (0002), so no change needed there.
--
-- The temple_reviews policies (0005) check admin status with an inline
-- "exists (select 1 from public.profiles where id = auth.uid() and
-- is_admin = true)" subquery, which is safe there because those policies
-- live on a *different* table. A policy directly on profiles can't reuse
-- that same inline subquery -- a policy that queries its own table inside
-- its own USING clause recurses under Postgres RLS. Route the check
-- through a SECURITY DEFINER function instead, which evaluates with RLS
-- bypassed and breaks the recursion.

create or replace function public.is_admin()
returns boolean as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$ language sql security definer stable;

create policy "profiles_select_admin"
  on public.profiles for select
  using (public.is_admin());

create policy "yatra_plans_select_admin"
  on public.yatra_plans for select
  using (public.is_admin());
