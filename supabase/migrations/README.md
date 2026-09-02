# Migrations

This folder was reconstructed from live usage — every table, column, and
policy here was inferred by reading every `.from("...")`, `.select(...)`,
`.insert(...)`, `.update(...)`, and `.storage.from(...)` call across the
codebase (API routes, server components, and client components). It was
**not** pulled directly from the Supabase dashboard, because that requires
CLI access to the live project which wasn't available while writing this.

This closes the gap called out in the PRD ("schema lives only in the
Supabase dashboard") with a best-effort reconstruction. **Before trusting
this as the source of truth, verify it against the live project:**

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db diff --schema public --use-migra
```

If `db diff` comes back clean (or only shows minor drift like column
order), these migrations are safe to treat as canonical going forward. If
it shows real differences, trust the dashboard and adjust these files to
match — don't run `db push` blind against production before diffing.

## Applying to a fresh project

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

Or paste each file into the Supabase Dashboard → SQL Editor, in order
(0001 → 0006) — the numeric prefixes encode dependency order (e.g.
`profiles.is_admin` in 0003 has to exist before 0005's admin RLS policies
can reference it).

## Files

| File | Covers |
|---|---|
| `0001_profiles.sql` | `profiles` table + self-access RLS |
| `0002_saved_temples.sql` | `saved_temples` table + RLS (incl. public read for the Verified-visitor badge) |
| `0003_admin.sql` | `profiles.is_admin` + trigger blocking self-escalation |
| `0004_yatra_plans.sql` | `yatra_plans` table + RLS |
| `0005_temple_reviews.sql` | `temple_reviews`, `temple_review_photos`, `temple_rating_summary` view, 3-photo trigger, RLS |
| `0006_storage_review_photos.sql` | `review-photos` storage bucket + object policies |
| `0007_yatra_sharing.sql` | `yatra_plans.is_public` + public-read/owner-update RLS for shareable links |
| `0008_yatra_completion.sql` | `yatra_plans.completed_at`, powering the completed-count/streak/region-badge stats on My Yatras (reuses 0007's owner-update RLS) |

## Going forward

New schema changes should get their own numbered file here (`0007_...sql`)
committed alongside the code that needs them, applied via
`supabase db push` before or during deploy — instead of being made ad hoc
in the dashboard, which is how this gap opened up in the first place.
