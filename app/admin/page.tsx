import Link from "next/link"
import { getBroadcastsWithCount } from "@/lib/db"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const broadcasts = await getBroadcastsWithCount()

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="font-mono text-2xl font-medium tracking-widest text-neon glow-text">
            BROADCASTS
          </h1>
          <Link
            href="/admin/upload"
            className="border border-border bg-card px-3 py-1 font-mono text-xs tracking-widest text-muted-foreground transition-all duration-300 border-glow-hover hover:text-neon"
          >
            CSV UPLOAD
          </Link>
        </div>
        <Link
          href="/admin/broadcasts/new"
          className="border border-neon/40 bg-card px-6 py-2 font-mono text-sm tracking-widest text-neon transition-all duration-300 border-glow-hover hover:glow-sm"
        >
          + NEW
        </Link>
      </div>

      {broadcasts.length === 0 ? (
        <p className="text-sm text-muted-foreground">データがありません</p>
      ) : (
        <div className="flex flex-col gap-2">
          {broadcasts.map(b => (
            <Link
              key={b.episode_index}
              href={`/admin/broadcasts/${b.episode_index}`}
              className="group block border border-border bg-card px-5 py-4 transition-all duration-300 border-glow-hover"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm text-neon-dim transition-colors group-hover:text-neon group-hover:glow-text">
                  #{b.episode_index}
                </span>
                <span className="text-sm text-muted-foreground">{b.date}</span>
                <span className="ml-auto font-mono text-xs text-muted-foreground">
                  {b.news_item_count} news
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
