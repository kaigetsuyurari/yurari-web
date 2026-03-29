"use client"

import { useState, useRef } from "react"

export default function AdminPage() {
  const [status, setStatus] = useState<{ type: "idle" | "loading" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  })
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const file = fileRef.current?.files?.[0]
    if (!file) {
      setStatus({ type: "error", message: "ファイルを選択してください" })
      return
    }

    setStatus({ type: "loading", message: "アップロード中..." })

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json() as { message?: string; error?: string }

      if (res.ok) {
        setStatus({ type: "success", message: data.message ?? "完了しました" })
        if (fileRef.current) fileRef.current.value = ""
      } else {
        setStatus({ type: "error", message: data.error ?? "エラーが発生しました" })
      }
    } catch {
      setStatus({ type: "error", message: "通信エラーが発生しました" })
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="mb-2 font-mono text-2xl font-medium tracking-widest text-neon glow-text">
        UPLOAD
      </h1>
      <p className="mb-8 text-sm text-muted-foreground">
        CSV: episode_index, date, headline_index, headline_text, script
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <label className="flex flex-col gap-2">
          <span className="font-mono text-xs tracking-wide text-muted-foreground">CSV FILE</span>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            className="border border-border bg-card px-4 py-3 text-sm text-foreground file:mr-4 file:border-0 file:bg-transparent file:font-mono file:text-sm file:text-neon"
          />
        </label>

        <button
          type="submit"
          disabled={status.type === "loading"}
          className="border border-neon/40 bg-card px-8 py-3 font-mono text-sm tracking-widest text-neon transition-all duration-300 hover:border-neon hover:glow-sm disabled:opacity-50"
        >
          {status.type === "loading" ? "UPLOADING..." : "EXECUTE"}
        </button>
      </form>

      {status.type !== "idle" && status.type !== "loading" && (
        <div
          className={`mt-6 border px-4 py-3 text-sm ${
            status.type === "success"
              ? "border-neon/30 bg-neon/5 text-neon"
              : "border-red-500/30 bg-red-500/5 text-red-400"
          }`}
        >
          {status.message}
        </div>
      )}
    </div>
  )
}
