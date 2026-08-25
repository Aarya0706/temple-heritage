'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Share2, Copy, Check, Loader2, Globe, Lock } from 'lucide-react'

export default function ShareYatraButton({
  yatraId,
  initialIsPublic,
}: {
  yatraId: string
  initialIsPublic: boolean
}) {
  const router = useRouter()
  const [isPublic, setIsPublic] = useState(initialIsPublic)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/yatra/${yatraId}`
    : `/yatra/${yatraId}`

  const togglePublic = async (next: boolean) => {
    if (loading) return
    setLoading(true)
    const res = await fetch('/api/yatra-plans', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: yatraId, isPublic: next }),
    })
    if (res.ok) {
      setIsPublic(next)
      router.refresh()
    }
    setLoading(false)
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API can fail (permissions, non-secure context) — the
      // link is still selectable/visible in the input below.
    }
  }

  if (!isPublic) {
    return (
      <button
        onClick={() => togglePublic(true)}
        disabled={loading}
        className="btn-secondary"
        style={{
          color: '#8c2416',
          borderColor: '#b95a40',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          cursor: loading ? 'default' : 'pointer',
        }}
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} />}
        Share Yatra
      </button>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
        background: '#fff8f0',
        border: '1px solid #f0ddc8',
        borderRadius: 10,
        padding: '8px 10px',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6b4a3d' }}>
        <Globe size={14} color="#2f8a4a" /> Public link
      </span>
      <input
        readOnly
        value={shareUrl}
        onFocus={(e) => e.target.select()}
        style={{
          flex: '1 1 220px',
          minWidth: 0,
          border: '1px solid #f0ddc8',
          borderRadius: 6,
          padding: '6px 8px',
          fontSize: 13,
          color: '#3a1a10',
          background: 'white',
        }}
      />
      <button
        onClick={copyLink}
        title="Copy link"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          border: '1px solid #b95a40',
          background: copied ? '#e9f7ee' : 'white',
          color: copied ? '#2f8a4a' : '#8c2416',
          borderRadius: 6,
          padding: '6px 10px',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? 'Copied' : 'Copy'}
      </button>
      <button
        onClick={() => togglePublic(false)}
        disabled={loading}
        title="Make private again"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          border: '1px solid #e0c9b0',
          background: 'white',
          color: '#8c6a54',
          borderRadius: 6,
          padding: '6px 10px',
          fontSize: 13,
          cursor: loading ? 'default' : 'pointer',
        }}
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
        Unshare
      </button>
    </div>
  )
}
