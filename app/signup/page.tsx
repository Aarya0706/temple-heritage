'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

console.log('signup page loaded')

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('signup clicked', email, password, fullName)
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    if (data.user) {
      // The auth.users trigger (see 20260904_auto_create_profile.sql) already
      // creates this row server-side regardless of session/confirmation
      // timing, so this is just a best-effort client-side sync of full_name
      // for the case where a session exists immediately (email confirmation
      // off). Upsert, not insert, so it doesn't error out on the row the
      // trigger already made -- and any failure here (e.g. no session yet
      // pending confirmation) is harmless and logged rather than swallowed.
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ id: data.user.id, full_name: fullName }, { onConflict: 'id' })
      if (profileError) {
        console.error('Failed to sync profile full_name after signup', profileError)
      }
    }
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Check your email</h1>
        <p>We sent a confirmation link. Confirm, then log in.</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6">
      <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
      <form onSubmit={handleSignup} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full border rounded p-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded p-2"
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full border rounded p-2"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="w-full bg-maroon text-white rounded p-2">
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      <p className="mt-4 text-sm">
        Have an account? <a href="/login" className="text-saffron underline">Login</a>
      </p>
    </div>
  )
}