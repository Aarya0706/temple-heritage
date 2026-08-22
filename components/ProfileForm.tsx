'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { FormEvent } from 'react'

type Props = {
  initialFullName: string
  initialHomeCity: string
}

export function ProfileForm({ initialFullName, initialHomeCity }: Props) {
  const [fullName, setFullName] = useState(initialFullName)
  const [homeCity, setHomeCity] = useState(initialHomeCity)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSaved(false)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      setError('Your session expired — please log in again.')
      return
    }
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, full_name: fullName, home_city: homeCity })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    setSaved(true)
    router.refresh()
  }

  return (
    <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#6b4a3d" }}>Full name</span>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #e6cfb3",
            fontSize: 15
          }}
        />
      </label>

      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#6b4a3d" }}>Home city</span>
        <input
          type="text"
          value={homeCity}
          onChange={(e) => setHomeCity(e.target.value)}
          placeholder="e.g. Hyderabad"
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #e6cfb3",
            fontSize: 15
          }}
        />
        <span style={{ fontSize: 12, color: "#a5744f" }}>Used to pre-fill "From" when you plan a yatra.</span>
      </label>

      {error && <p style={{ color: "#b3261e", fontSize: 14, margin: 0 }}>{error}</p>}
      {saved && <p style={{ color: "#2e7d32", fontSize: 14, margin: 0 }}>Saved.</p>}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary"
        style={{ background: "#a52d15", color: "white", justifyContent: "center" }}
      >
        {loading ? "Saving..." : "Save changes"}
      </button>
    </form>
  )
}
