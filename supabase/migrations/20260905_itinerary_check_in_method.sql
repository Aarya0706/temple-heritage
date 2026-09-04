-- Lets completing a saved Yatra itinerary (yatra_plans.completed_at, set via
-- PATCH /api/yatra-plans) stamp the passport for every temple in that
-- itinerary -- previously only manual "mark visited" clicks, reviews, QR,
-- and geo check-ins could create a check_ins row.

alter table public.check_ins
  drop constraint if exists check_ins_check_in_method_check;

alter table public.check_ins
  add constraint check_ins_check_in_method_check
  check (check_in_method in ('manual', 'review', 'qr', 'geo', 'itinerary'));
