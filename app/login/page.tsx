'use client'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    try {
      sessionStorage.setItem('th_show_welcome_modal', '1')
    } catch {
      // ignore if sessionStorage is unavailable
    }
    const next = searchParams.get('next')
    // Force a full page load (not a client-side router.push) so the root
    // layout actually remounts and the welcome popup's mount-time check
    // reliably picks up the flag — this mirrors how /logout already does
    // a full page load and is why the popup was only ever showing there.
    window.location.assign(next && next.startsWith('/') ? next : '/')
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
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
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border rounded p-2"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="w-full bg-maroon text-white rounded p-2">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="mt-4 text-sm">
        <a href="/forgot-password" className="text-saffron underline">Forgot password?</a>
      </p>
      <p className="mt-2 text-sm">
        No account? <a href="/signup" className="text-saffron underline">Sign up</a>
      </p>
    </div>
  )
}