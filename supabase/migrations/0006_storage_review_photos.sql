-- Storage bucket for review photos. Path convention is
-- `{user_id}/{review_id}/{index}.jpg` (see components/ReviewForm.tsx),
-- so ownership can be checked from the first path segment without a table
-- lookup.
--
-- NOTE: creating buckets via SQL migration works on self-hosted/CLI-managed
-- Supabase projects. On some hosted setups you may need to create the
-- bucket once via Dashboard → Storage → New bucket (name: review-photos,
-- public: on) and only run the policy statements below.

insert into storage.buckets (id, name, public)
values ('review-photos', 'review-photos', true)
on conflict (id) do nothing;

-- Public read (bucket is public, but an explicit policy is defense-in-depth
-- and required if the bucket's public flag is ever toggled off).
create policy "review_photos_public_read"
  on storage.objects for select
  using (bucket_id = 'review-photos');

-- Upload only into your own folder: storage.foldername(name) splits the
-- object path on "/", so [1] is the {user_id} segment.
create policy "review_photos_insert_own_folder"
  on storage.objects for insert
  with check (
    bucket_id = 'review-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Delete: your own folder, or an admin cleaning up any review's photos
-- (both delete routes in app/api/reviews and app/api/admin/reviews remove
-- storage objects after confirming the review row delete succeeded).
create policy "review_photos_delete_own_or_admin"
  on storage.objects for delete
  using (
    bucket_id = 'review-photos'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
    )
  );
