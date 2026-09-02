'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/reset-password`,
    })
    setLoading(false)
    if (error) {
      const message = error.message?.toLowerCase() || ''
      if (message.includes('rate limit')) {
        setError('Too many reset requests right now. Please wait a few minutes and try again.')
      } else if (message.includes('invalid') && message.includes('email')) {
        setError('Please enter a valid email address.')
      } else {
        setError('Something went wrong sending the reset link. Please try again shortly.')
      }
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Check your email</h1>
        <p>
          If an account exists for <strong>{email}</strong>, we sent a link to
          reset your password.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6">
      <h1 className="text-2xl font-bold mb-6">Reset your password</h1>
      <p className="mb-4 text-sm">
        Enter the email on your account and we&apos;ll send you a link to set
        a new password.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded p-2"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-maroon text-white rounded p-2"
        >
          {loading ? 'Sending...' : 'Send reset link'}
        </button>
      </form>
      <p className="mt-4 text-sm">
        Remembered it? <a href="/login" className="text-saffron underline">Login</a>
      </p>
    </div>
  )
}
