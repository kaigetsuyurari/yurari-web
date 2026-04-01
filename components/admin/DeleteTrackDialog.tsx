"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Props = {
  trackId: number
  trackTitle: string
}

export default function DeleteTrackDialog({ trackId, trackTitle }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading">("idle")

  async function handleDelete() {
    setStatus("loading")
    try {
      const res = await fetch(`/api/tracks/${trackId}`, { method: "DELETE" })
      if (res.ok) {
        router.push("/admin/tracks")
        router.refresh()
      }
    } catch {
      setStatus("idle")
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="font-mono text-xs tracking-widest text-red-400 hover:text-red-300"
      >
        DELETE
      </button>
    )
  }

  return (
    <div className="border border-red-500/30 bg-red-500/5 px-4 py-3">
      <p className="mb-3 text-sm text-red-400">
        「{trackTitle}」を削除しますか？
      </p>
      <div className="flex gap-3">
        <button
          onClick={handleDelete}
          disabled={status === "loading"}
          className="border border-red-500/40 px-4 py-1 font-mono text-xs text-red-400 hover:bg-red-500/10 disabled:opacity-50"
        >
          {status === "loading" ? "DELETING..." : "DELETE"}
        </button>
        <button
          onClick={() => setOpen(false)}
          className="font-mono text-xs text-muted-foreground hover:text-foreground"
        >
          CANCEL
        </button>
      </div>
    </div>
  )
}
