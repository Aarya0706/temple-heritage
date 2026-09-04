import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { templeBySlug } from '@/lib/passport'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { title, itinerary } = await request.json()
  if (!title || !itinerary) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const { error } = await supabase
    .from('yatra_plans')
    .insert({ user_id: user.id, title, itinerary })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const body = await request.json()
  const { id, isPublic, completed } = body
  if (!id || (typeof isPublic !== 'boolean' && typeof completed !== 'boolean')) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const update: { is_public?: boolean; completed_at?: string | null } = {}
  if (typeof isPublic === 'boolean') update.is_public = isPublic
  // `completed` is a boolean toggle from the client; the server decides
  // the actual timestamp so a client can't backdate/forge completed_at.
  if (typeof completed === 'boolean') update.completed_at = completed ? new Date().toISOString() : null

  // Scoped to this user's own row (also enforced by the
  // yatra_plans_update_own RLS policy) — id alone can't flip someone
  // else's plan public or completed.
  const { data, error } = await supabase
    .from('yatra_plans')
    .update(update)
    .eq('id', id)
    .eq('user_id', user.id)
    .select('id, is_public, completed_at, itinerary')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Completing a Yatra should stamp the passport for every temple actually
  // in it -- same "on conflict do nothing" behavior as the review trigger,
  // so an earlier manual/QR/geo stamp's date is never overwritten. Best
  // effort: a failure here shouldn't fail the completion toggle itself.
  if (typeof completed === 'boolean' && completed) {
    const days = Array.isArray(data.itinerary?.days) ? data.itinerary.days : []
    const slugs = new Set<string>()
    for (const day of days) {
      for (const slug of day?.templeSlugs || []) {
        if (templeBySlug(slug)) slugs.add(slug)
      }
    }
    if (slugs.size > 0) {
      const { error: stampError } = await supabase.from('check_ins').upsert(
        Array.from(slugs).map((temple_slug) => ({
          user_id: user.id,
          temple_slug,
          check_in_method: 'itinerary' as const,
        })),
        { onConflict: 'user_id,temple_slug', ignoreDuplicates: true }
      )
      if (stampError) console.error('Failed to stamp passport for completed yatra', stampError)
    }
  }

  return NextResponse.json({ success: true, isPublic: data.is_public, completedAt: data.completed_at })
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { id } = await request.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  // Scope the delete to this user's own row — id alone isn't enough,
  // otherwise any authenticated user could delete anyone's saved plan.
  const { error } = await supabase
    .from('yatra_plans')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}