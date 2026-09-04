-- Fixes: pilgrimage passport (and /profile generally) redirecting an already
-- logged-in user to /login.
--
-- Root cause: app/signup/page.tsx inserted the profiles row client-side right
-- after auth.signUp(). With email confirmation enabled there's no session yet
-- at that moment, so the "profiles_insert_own" RLS policy (auth.uid() = id)
-- silently rejected the insert -- the code never checked the error. The user
-- would confirm their email and log in fine, but have no public.profiles row.
-- getOwnPassport() -> getPassportByUserId() would then find no profile,
-- return null, and app/profile/passport/page.tsx treated that the same as
-- "not authenticated," redirecting to /login even though the user was signed in.
--
-- This creates the profile row server-side, unconditionally, the moment the
-- auth user exists -- independent of email confirmation timing or client
-- code -- and backfills anyone already affected.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Backfill: create profiles rows for any existing auth user who is missing
-- one (this repairs accounts already broken by the bug above).
insert into public.profiles (id, full_name)
select u.id, u.raw_user_meta_data->>'full_name'
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
on conflict (id) do nothing;
