'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Loader2 } from 'lucide-react'

export default function UnsaveTempleButton({ templeSlug }: { templeSlug: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleUnsave = async (e: React.MouseEvent) => {
    // The card itself is a Link to the temple page — stop that navigation
    // so clicking the remove button doesn't also route away.
    e.preventDefault()
    e.stopPropagation()
    if (loading) return
    setLoading(true)
    const res = await fetch('/api/saved-temples', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ temple_slug: templeSlug }),
    })
    if (res.ok) {
      router.refresh()
    } else {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleUnsave}
      disabled={loading}
      aria-label="Remove from saved temples"
      title="Remove from saved temples"
      style={{
        position: 'absolute',
        top: 8,
        right: 8,
        width: 28,
        height: 28,
        borderRadius: '50%',
        border: 'none',
        background: 'rgba(58, 26, 16, 0.55)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: loading ? 'default' : 'pointer',
        zIndex: 2,
      }}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <X size={16} />}
    </button>
  )
}
