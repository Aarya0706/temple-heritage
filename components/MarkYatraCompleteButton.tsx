'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Circle, Loader2 } from 'lucide-react'

export default function MarkYatraCompleteButton({
  yatraId,
  initialCompleted,
  onEvent,
}: {
  yatraId: string
  initialCompleted: boolean
  // Row on a list page is a Link, so clicks here need to stop propagation.
  onEvent?: boolean
}) {
  const router = useRouter()
  const [completed, setCompleted] = useState(initialCompleted)
  const [loading, setLoading] = useState(false)

  const toggle = async (e: React.MouseEvent) => {
    if (onEvent) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (loading) return
    setLoading(true)
    const next = !completed
    const res = await fetch('/api/yatra-plans', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: yatraId, completed: next }),
    })
    if (res.ok) {
      setCompleted(next)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={completed ? 'Mark as not completed' : 'Mark this Yatra as completed'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        border: completed ? '1px solid #2f8a4a' : '1px solid #d9b48f',
        background: completed ? '#e9f7ee' : 'white',
        color: completed ? '#2f8a4a' : '#8c6a54',
        borderRadius: 8,
        padding: '6px 12px',
        fontSize: 13,
        fontWeight: 600,
        cursor: loading ? 'default' : 'pointer',
        flexShrink: 0,
      }}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : completed ? (
        <CheckCircle2 size={14} />
      ) : (
        <Circle size={14} />
      )}
      {completed ? 'Completed' : 'Mark completed'}
    </button>
  )
}
