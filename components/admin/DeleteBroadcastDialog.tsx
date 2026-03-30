"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function DeleteBroadcastDialog({ episodeIndex }: { episodeIndex: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    try {
      const res = await fetch(`/api/broadcasts/${episodeIndex}`, { method: "DELETE" })
      if (res.ok) {
        router.push("/admin")
        router.refresh()
      }
    } catch {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="border border-red-500/40 bg-card px-4 py-2 font-mono text-xs tracking-widest text-red-400 transition-all duration-300 hover:border-red-500 hover:bg-red-500/10"
      >
        DELETE
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-xs text-red-400">削除しますか？</span>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="border border-red-500 bg-red-500/10 px-3 py-1 font-mono text-xs tracking-widest text-red-400 transition-all hover:bg-red-500/20 disabled:opacity-50"
      >
        {loading ? "..." : "YES"}
      </button>
      <button
        onClick={() => setOpen(false)}
        className="border border-border px-3 py-1 font-mono text-xs tracking-widest text-muted-foreground hover:text-foreground"
      >
        NO
      </button>
    </div>
  )
}
