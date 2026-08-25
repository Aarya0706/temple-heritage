-- Admin capability: adds profiles.is_admin, used by lib/require-admin.ts,
-- app/admin/page.tsx, and app/api/admin/reviews/route.ts to gate the
-- moderation panel. The review-table policies that actually check this
-- flag live in 0005_temple_reviews.sql (temple_reviews doesn't exist yet
-- at this point in the migration order) — this file only establishes the
-- flag itself and stops it from being self-granted.

alter table public.profiles
  add column if not exists is_admin boolean not null default false;

-- Prevent a user from flipping their own is_admin flag via the
-- "profiles_update_own" policy in 0001. RLS alone can't restrict a single
-- column, so this is enforced with a trigger: any UPDATE that changes
-- is_admin is rejected unless the acting session is already an admin, or
-- unless it's a service-role call, so the same trigger doesn't run under
-- your own hand-managed queries in the Supabase SQL editor.
create or replace function public.prevent_is_admin_self_escalation()
returns trigger as $$
begin
  if new.is_admin is distinct from old.is_admin then
    if auth.uid() is not null and not exists (
      select 1 from public.profiles where id = auth.uid() and is_admin = true
    ) then
      raise exception 'Only an existing admin can change is_admin.';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_prevent_is_admin_self_escalation on public.profiles;
create trigger trg_prevent_is_admin_self_escalation
before update on public.profiles
for each row execute function public.prevent_is_admin_self_escalation();

-- To promote your own account to admin for local/manual testing, run this
-- once directly in the Supabase SQL editor (service role bypasses the
-- trigger's auth.uid() check because it runs with no session):
--   update public.profiles set is_admin = true where id = '<your-user-uuid>';
