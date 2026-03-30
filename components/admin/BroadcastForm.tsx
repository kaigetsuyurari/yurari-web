"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { BroadcastDetail } from "@/types"

type NewsItemInput = { headline_index: string; headline_text: string; script: string }

type Props =
  | { mode: "create"; initialData?: undefined }
  | { mode: "edit"; initialData: BroadcastDetail }

export default function BroadcastForm({ mode, initialData }: Props) {
  const router = useRouter()
  const [episodeIndex, setEpisodeIndex] = useState(initialData?.episode_index ?? "")
  const [date, setDate] = useState(initialData?.date ?? "")
  const [newsItems, setNewsItems] = useState<NewsItemInput[]>(
    initialData?.news_items ?? [{ headline_index: "1", headline_text: "", script: "" }]
  )
  const [status, setStatus] = useState<{ type: "idle" | "loading" | "error"; message: string }>({
    type: "idle",
    message: "",
  })

  function addItem() {
    const nextIndex = String(Math.max(0, ...newsItems.map(n => Number(n.headline_index))) + 1)
    setNewsItems([...newsItems, { headline_index: nextIndex, headline_text: "", script: "" }])
  }

  function removeItem(index: number) {
    setNewsItems(newsItems.filter((_, i) => i !== index))
  }

  function updateItem(index: number, field: keyof NewsItemInput, value: string) {
    setNewsItems(newsItems.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus({ type: "loading", message: "" })

    const originalEpisode = initialData?.episode_index ?? episodeIndex
    const url = mode === "create" ? "/api/broadcasts" : `/api/broadcasts/${originalEpisode}`
    const method = mode === "create" ? "POST" : "PUT"
    const body = mode === "create"
      ? { episode_index: episodeIndex, date, news_items: newsItems }
      : { episode_index: episodeIndex, date, news_items: newsItems }

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json() as { error?: string }

      if (res.ok) {
        router.push("/admin")
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
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className={labelClass}>EPISODE #</span>
          <input
            type="text"
            value={episodeIndex}
            onChange={e => setEpisodeIndex(e.target.value)}
            required
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className={labelClass}>DATE</span>
          <input
            type="text"
            value={date}
            onChange={e => setDate(e.target.value)}
            placeholder="2026.3.30"
            required
            className={inputClass}
          />
        </label>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className={labelClass}>NEWS ITEMS</span>
          <button
            type="button"
            onClick={addItem}
            className="border border-neon/30 px-3 py-1 font-mono text-xs tracking-widest text-neon transition-colors hover:border-neon hover:glow-sm"
          >
            + ADD
          </button>
        </div>

        {newsItems.map((item, i) => (
          <div key={i} className="border border-border/50 bg-card/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">
                HEADLINE #{item.headline_index}
              </span>
              {newsItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="font-mono text-xs text-red-400 hover:text-red-300"
                >
                  REMOVE
                </button>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-[80px_1fr] gap-3">
                <label className="flex flex-col gap-1">
                  <span className={labelClass}>INDEX</span>
                  <input
                    type="text"
                    value={item.headline_index}
                    onChange={e => updateItem(i, "headline_index", e.target.value)}
                    required
                    className={inputClass}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className={labelClass}>HEADLINE</span>
                  <input
                    type="text"
                    value={item.headline_text}
                    onChange={e => updateItem(i, "headline_text", e.target.value)}
                    required
                    className={inputClass}
                  />
                </label>
              </div>
              <label className="flex flex-col gap-1">
                <span className={labelClass}>SCRIPT</span>
                <textarea
                  value={item.script}
                  onChange={e => updateItem(i, "script", e.target.value)}
                  rows={4}
                  className={`${inputClass} resize-y`}
                />
              </label>
            </div>
          </div>
        ))}
      </div>

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
