"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Track } from "@/types"

type Props =
  | { mode: "create"; initialData?: undefined }
  | { mode: "edit"; initialData: Track }

export default function TrackForm({ mode, initialData }: Props) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.title ?? "")
  const [artist, setArtist] = useState(initialData?.artist ?? "")
  const [url, setUrl] = useState(initialData?.url ?? "")
  const [status, setStatus] = useState<{ type: "idle" | "loading" | "error"; message: string }>({
    type: "idle",
    message: "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus({ type: "loading", message: "" })

    const apiUrl = mode === "create" ? "/api/tracks" : `/api/tracks/${initialData!.id}`
    const method = mode === "create" ? "POST" : "PUT"

    try {
      const res = await fetch(apiUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, artist, url }),
      })
      const data = await res.json() as { error?: string }

      if (res.ok) {
        router.push("/admin/tracks")
        router.refresh()
      } else {
        setStatus({ type: "error", message: data.error ?? "エラーが発生しました" })
      }
    } catch {
      setStatus({ type: "error", message: "通信エラーが発生しました" })
    }
  }

  const inputClass = "w-full border border-border bg-card px-3 py-2 text-sm text-foreground font-mono focus:border-neon/60 focus:outline-none"
  const labelClass = "font-mono text-xs tracking-wide text-muted-foreground"

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <label className="flex flex-col gap-1">
        <span className={labelClass}>TITLE</span>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>ARTIST</span>
        <input
          type="text"
          value={artist}
          onChange={e => setArtist(e.target.value)}
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>AUDIO URL</span>
        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://..."
          required
          className={inputClass}
        />
      </label>

      <button
        type="submit"
        disabled={status.type === "loading"}
        className="border border-neon/40 bg-card px-8 py-3 font-mono text-sm tracking-widest text-neon transition-all duration-300 hover:border-neon hover:glow-sm disabled:opacity-50"
      >
        {status.type === "loading"
          ? "SAVING..."
          : mode === "create" ? "CREATE" : "UPDATE"}
      </button>

      {status.type === "error" && (
        <div className="border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {status.message}
        </div>
      )}
    </form>
  )
}
