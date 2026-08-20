'use client'
import { useState, useEffect } from 'react'

export default function SaveTempleButton({ templeSlug }: { templeSlug: string }) {
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loggedIn, setLoggedIn] = useState(true)

  useEffect(() => {
    fetch('/api/saved-temples')
      .then(res => {
        if (res.status === 401) {
          setLoggedIn(false)
          return null
        }
        return res.json()
      })
      .then(data => {
        if (data) setSaved(data.saved.includes(templeSlug))
      })
  }, [templeSlug])

  const toggleSave = async () => {
    if (!loggedIn) {
      window.location.href = '/login'
      return
    }
    setLoading(true)
    const method = saved ? 'DELETE' : 'POST'
    const res = await fetch('/api/saved-temples', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ temple_slug: templeSlug }),
    })
    if (res.ok) setSaved(!saved)
    setLoading(false)
  }

  return (
    <button
      onClick={toggleSave}
      disabled={loading}
      className={`px-4 py-2 rounded border ${saved ? 'bg-maroon text-white' : 'bg-white text-maroon'}`}
    >
      {loading ? '...' : saved ? '★ Saved' : '☆ Save Temple'}
    </button>
  )
}