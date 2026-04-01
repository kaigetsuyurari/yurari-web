"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import type { Track } from "@/types"

const CHUNK_SIZE = 50 * 1024 * 1024 // 50MB

type Props =
  | { mode: "create"; initialData?: undefined }
  | { mode: "edit"; initialData: Track }

async function uploadFile(file: File, onProgress: (pct: number) => void): Promise<string> {
  const key = `${Date.now()}-${file.name}`

  // 1. init
  const initRes = await fetch("/api/tracks/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "init", key }),
  })
  const { uploadId } = await initRes.json() as { uploadId: string }

  // 2. upload parts
  const parts: { partNumber: number; etag: string }[] = []
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE)

  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE
    const end = Math.min(start + CHUNK_SIZE, file.size)
    const chunk = file.slice(start, end)
    const buffer = await chunk.arrayBuffer()

    const partRes = await fetch(
      `/api/tracks/upload?key=${encodeURIComponent(key)}&uploadId=${encodeURIComponent(uploadId)}&partNumber=${i + 1}`,
      { method: "PUT", body: buffer }
    )
    const part = await partRes.json() as { partNumber: number; etag: string }
    parts.push(part)
    onProgress(Math.round(((i + 1) / totalChunks) * 100))
  }

  // 3. complete
  await fetch("/api/tracks/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "complete", key, uploadId, parts }),
  })

  return key
}

export default function TrackForm({ mode, initialData }: Props) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState(initialData?.title ?? "")
  const [artist, setArtist] = useState(initialData?.artist ?? "")
  const [progress, setProgress] = useState<number | null>(null)
  const [status, setStatus] = useState<{ type: "idle" | "loading" | "error"; message: string }>({
    type: "idle",
    message: "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const file = fileRef.current?.files?.[0]

    if (mode === "create" && !file) {
      setStatus({ type: "error", message: "ファイルを選択してください" })
      return
    }

    setStatus({ type: "loading", message: "" })

    try {
      let newKey: string | undefined
      if (file) {
        setProgress(0)
        newKey = await uploadFile(file, setProgress)
        setProgress(null)
      }

      if (mode === "create") {
        const res = await fetch("/api/tracks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, artist, key: newKey }),
        })
        const data = await res.json() as { error?: string }
        if (!res.ok) {
          setStatus({ type: "error", message: data.error ?? "エラーが発生しました" })
          return
        }
      } else {
        const res = await fetch(`/api/tracks/${initialData!.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, artist, newKey }),
        })
        const data = await res.json() as { error?: string }
        if (!res.ok) {
          setStatus({ type: "error", message: data.error ?? "エラーが発生しました" })
          return
        }
      }

      router.push("/admin/tracks")
      router.refresh()
    } catch {
      setStatus({ type: "error", message: "通信エラーが発生しました" })
      setProgress(null)
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
        <span className={labelClass}>
          {mode === "create" ? "AUDIO FILE" : "AUDIO FILE（変更する場合のみ）"}
        </span>
        <input
          ref={fileRef}
          type="file"
          accept="audio/*"
          className="text-sm text-foreground/60 file:mr-3 file:border file:border-border file:bg-card file:px-3 file:py-1.5 file:font-mono file:text-xs file:text-neon file:transition-colors hover:file:border-neon/60"
        />
      </label>

      {progress !== null && (
        <div className="flex flex-col gap-1">
          <div className="h-1.5 w-full overflow-hidden bg-border">
            <div
              className="h-full bg-neon transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            UPLOADING... {progress}%
          </span>
        </div>
      )}

      <button
        type="submit"
        disabled={status.type === "loading"}
        className="border border-neon/40 bg-card px-8 py-3 font-mono text-sm tracking-widest text-neon transition-all duration-300 hover:border-neon hover:glow-sm disabled:opacity-50"
      >
        {status.type === "loading"
          ? "UPLOADING..."
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
