import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

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
    .select('id, is_public, completed_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
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