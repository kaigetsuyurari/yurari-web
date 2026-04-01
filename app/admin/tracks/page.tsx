import Link from "next/link"
import { getTracks } from "@/lib/db"

export const dynamic = "force-dynamic"

export default async function AdminTracksPage() {
  const tracks = await getTracks()

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Link
        href="/admin"
        className="mb-6 inline-block font-mono text-xs tracking-widest text-muted-foreground hover:text-neon"
      >
        &larr; BACK
      </Link>

      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-mono text-2xl font-medium tracking-widest text-neon glow-text">
          TRACKS
        </h1>
        <Link
          href="/admin/tracks/new"
          className="border border-neon/40 bg-card px-6 py-2 font-mono text-sm tracking-widest text-neon transition-all duration-300 border-glow-hover hover:glow-sm"
        >
          + NEW
        </Link>
      </div>

      {tracks.length === 0 ? (
        <p className="text-sm text-muted-foreground">トラックがありません</p>
      ) : (
        <div className="flex flex-col gap-2">
          {tracks.map(t => (
            <Link
              key={t.id}
              href={`/admin/tracks/${t.id}/edit`}
              className="group block border border-border bg-card px-5 py-4 transition-all duration-300 border-glow-hover"
            >
              <div className="flex items-baseline gap-3">
                <span className="text-sm text-foreground transition-colors group-hover:text-neon">
                  {t.title}
                </span>
                {t.artist && (
                  <span className="text-xs text-muted-foreground">{t.artist}</span>
                )}
                <span className="ml-auto font-mono text-xs text-muted-foreground">
                  {t.created_at.slice(0, 10)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
