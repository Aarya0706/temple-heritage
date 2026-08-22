'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'

export default function DeleteYatraButton({ yatraId, title }: { yatraId: string; title: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    // The row itself is a Link to the itinerary page — stop that navigation
    // so clicking delete doesn't also route away.
    e.preventDefault()
    e.stopPropagation()
    if (loading) return
    if (!window.confirm(`Delete "${title}"? This can't be undone.`)) return
    setLoading(true)
    const res = await fetch('/api/yatra-plans', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: yatraId }),
    })
    if (res.ok) {
      router.refresh()
    } else {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      aria-label={`Delete ${title}`}
      title="Delete itinerary"
      style={{
        width: 34,
        height: 34,
        borderRadius: 8,
        border: '1px solid #f0ddc8',
        background: 'white',
        color: '#a52d15',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: loading ? 'default' : 'pointer',
        flexShrink: 0,
      }}
    >
      {loading ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
    </button>
  )
}
