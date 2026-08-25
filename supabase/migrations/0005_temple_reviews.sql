-- Reviews & Visitor Photos — reconstructed from live usage across
-- app/api/reviews/route.ts, app/api/admin/reviews/route.ts,
-- components/ReviewsSection.tsx, components/ReviewForm.tsx, app/admin/page.tsx.
--
-- Note: `id` on temple_reviews is CLIENT-generated (crypto.randomUUID() in
-- ReviewForm.tsx, sent to the API before the photo upload happens) so the
-- photo rows can reference the review before the review row itself is
-- inserted — hence no `default gen_random_uuid()` here.
--
-- Note: temple_slug is a plain text reference into data/temples.ts, not a
-- foreign key (temples aren't a DB table) — same pattern as saved_temples.

create table if not exists public.temple_reviews (
  id uuid primary key,
  temple_slug text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  review_text text check (char_length(review_text) <= 1000),
  reviewer_name text not null,
  status text not null default 'published' check (status in ('published', 'flagged', 'hidden')),
  created_at timestamptz not null default now(),
  unique (temple_slug, user_id)
);

create index if not exists idx_temple_reviews_slug_status_created
  on public.temple_reviews (temple_slug, status, created_at desc);

create table if not exists public.temple_review_photos (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.temple_reviews(id) on delete cascade,
  storage_path text not null,
  created_at timestamptz not null default now()
);

-- Enforces the 3-photo-per-review cap at the DB level. The client (max 3
-- selected) and the API route (`.slice(0, 3)` in app/api/reviews/route.ts)
-- also cap it, but this closes the gap where someone bypasses both by
-- calling Supabase directly from the browser with their own session.
create or replace function public.enforce_max_review_photos()
returns trigger as $$
begin
  if (select count(*) from public.temple_review_photos where review_id = new.review_id) >= 3 then
    raise exception 'A review can have at most 3 photos';
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_max_review_photos on public.temple_review_photos;
create trigger trg_max_review_photos
before insert on public.temple_review_photos
for each row execute function public.enforce_max_review_photos();

-- Aggregate rating used by both the temple detail page header and the
-- Browse Temples grid cards. Only counts published reviews, so a
-- flagged/hidden review doesn't skew the average visitors see.
create or replace view public.temple_rating_summary as
select
  temple_slug,
  round(avg(rating)::numeric, 1) as average_rating,
  count(*) as review_count
from public.temple_reviews
where status = 'published'
group by temple_slug;

alter table public.temple_reviews enable row level security;
alter table public.temple_review_photos enable row level security;

-- --- temple_reviews policies ---

-- Anyone can read published reviews; the author can also always read their
-- own row regardless of status (so a flagged/hidden review still shows the
-- "already reviewed" state and moderation notice to its own author — see
-- ReviewsSection.tsx); admins can read every row for the moderation panel.
create policy "temple_reviews_select"
  on public.temple_reviews for select
  using (
    status = 'published'
    or auth.uid() = user_id
    or exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "temple_reviews_insert_own"
  on public.temple_reviews for insert
  with check (auth.uid() = user_id);

-- Reviews can't be edited by their author (non-goal — "delete + repost"
-- instead), only status transitions by an admin (publish/flag/hide).
create policy "temple_reviews_update_admin"
  on public.temple_reviews for update
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- Author can delete their own review; admin can delete any review.
create policy "temple_reviews_delete"
  on public.temple_reviews for delete
  using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- --- temple_review_photos policies ---

-- Photos ride on the visibility of their parent review.
create policy "temple_review_photos_select"
  on public.temple_review_photos for select
  using (
    exists (
      select 1 from public.temple_reviews r
      where r.id = review_id
        and (
          r.status = 'published'
          or auth.uid() = r.user_id
          or exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
        )
    )
  );

-- Only the review's own author can attach photos to it (upload happens in
-- the same request flow as the review insert, before the row exists in
-- some client orderings — check ownership via the review row once it's
-- there; ReviewForm always creates the review row in the same request).
create policy "temple_review_photos_insert_own"
  on public.temple_review_photos for insert
  with check (
    exists (select 1 from public.temple_reviews r where r.id = review_id and r.user_id = auth.uid())
  );

-- Author deletes their own review's photos; admin can delete any (used by
-- both delete routes to clean up storage after a row delete).
create policy "temple_review_photos_delete"
  on public.temple_review_photos for delete
  using (
    exists (
      select 1 from public.temple_reviews r
      where r.id = review_id
        and (r.user_id = auth.uid() or exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
    )
  );
