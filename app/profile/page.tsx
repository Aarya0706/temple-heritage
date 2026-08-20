import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { UserCircle2 } from 'lucide-react'
import { ProfileForm } from '@/components/ProfileForm'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, home_city')
    .eq('id', user.id)
    .single()

  return (
    <main>
      <section className="page-hero">
        <div className="eyebrow" style={{ color: "#ffc05a" }}>✦ Your account</div>
        <h1>Profile</h1>
        <p>Update the details we use across your saved temples and yatra plans.</p>
      </section>

      <section className="section section-light">
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 32
          }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#fff2e0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#a52d15",
              flexShrink: 0
            }}>
              <UserCircle2 size={32} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: "#3a1a10", fontSize: 17 }}>
                {profile?.full_name || "Your profile"}
              </div>
              <div style={{ fontSize: 13, color: "#a5744f" }}>{user.email}</div>
            </div>
          </div>

          <ProfileForm
            initialFullName={profile?.full_name || ""}
            initialHomeCity={profile?.home_city || ""}
          />
        </div>
      </section>
    </main>
  )
}
