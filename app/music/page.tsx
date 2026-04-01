import type { Metadata } from "next"
import { getTracks } from "@/lib/db"
import MusicList from "@/components/MusicList"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Μουσική",
  description: "海月ゆらり — 音楽",
}

export default async function MusicPage() {
  const tracks = await getTracks()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-medium tracking-widest text-neon glow-text">
        Μουσική
      </h1>
      <MusicList tracks={tracks} />
    </div>
  )
}
