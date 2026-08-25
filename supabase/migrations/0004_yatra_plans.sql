-- yatra_plans: saved AI-generated itineraries ("My Yatras" saved trips).
-- Reconstructed from app/api/yatra-plans/route.ts, app/my-yatras/page.tsx,
-- app/my-yatras/[id]/page.tsx. `itinerary` stores the full generated plan
-- (days, summary, from, region, displayRegion) as JSON — see
-- app/planner/page.tsx for the exact shape saved on the client.

create table if not exists public.yatra_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  itinerary jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_yatra_plans_user_id on public.yatra_plans (user_id, created_at desc);

alter table public.yatra_plans enable row level security;

create policy "yatra_plans_select_own"
  on public.yatra_plans for select
  using (auth.uid() = user_id);

create policy "yatra_plans_insert_own"
  on public.yatra_plans for insert
  with check (auth.uid() = user_id);

create policy "yatra_plans_delete_own"
  on public.yatra_plans for delete
  using (auth.uid() = user_id);
