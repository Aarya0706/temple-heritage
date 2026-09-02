'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [ready, setReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    // Implicit flow: the Supabase client auto-detects the access_token in
    // the URL hash on load (detectSessionInUrl defaults to true) and fires
    // this event once the recovery session is set. No manual token
    // exchange needed here -- that's the whole point of implicit flow
    // over PKCE for a cross-device email link. See lib/supabase/client.ts.
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
    })

    // If a session already exists by the time this mounts (hash was
    // processed before the listener attached), don't leave the user
    // stuck on "Verifying...".
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    setSuccess(true)
    setTimeout(() => router.push('/login'), 2000)
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Password updated</h1>
        <p>Redirecting you to login...</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6">
      <h1 className="text-2xl font-bold mb-6">Set a new password</h1>
      {!ready ? (
        <p className="text-sm">Verifying your reset link...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full border rounded p-2"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className="w-full border rounded p-2"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-maroon text-white rounded p-2"
          >
            {loading ? 'Updating...' : 'Update password'}
          </button>
        </form>
      )}
    </div>
  )
}