import Link from "next/link"
import { notFound } from "next/navigation"
import { getBroadcastDetail } from "@/lib/db"
import DeleteBroadcastDialog from "@/components/admin/DeleteBroadcastDialog"

export const dynamic = "force-dynamic"

export default async function BroadcastDetailPage({ params }: { params: Promise<{ episode: string }> }) {
  const { episode } = await params
  const detail = await getBroadcastDetail(episode)

  if (!detail) notFound()

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Link
        href="/admin"
        className="mb-6 inline-block font-mono text-xs tracking-widest text-muted-foreground hover:text-neon"
      >
        &larr; BACK
      </Link>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-mono text-2xl font-medium tracking-widest text-neon glow-text">
            #{detail.episode_index}
          </h1>
          <p className="mt-1 font-mono text-sm text-muted-foreground">{detail.date}</p>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/admin/broadcasts/${episode}/edit`}
            className="border border-neon/40 bg-card px-4 py-2 font-mono text-xs tracking-widest text-neon transition-all duration-300 hover:border-neon hover:glow-sm"
          >
            EDIT
          </Link>
          <DeleteBroadcastDialog episodeIndex={episode} />
        </div>
      </div>

      {detail.news_items.length === 0 ? (
        <p className="text-sm text-muted-foreground">ニュースアイテムがありません</p>
      ) : (
        <div className="flex flex-col gap-4">
          {detail.news_items.map(item => (
            <div key={item.headline_index} className="border border-border/50 bg-card/50 p-4">
              <div className="mb-2 flex items-baseline gap-3">
                <span className="font-mono text-xs text-muted-foreground">
                  #{item.headline_index}
                </span>
                <span className="font-mono text-sm text-foreground">{item.headline_text}</span>
              </div>
              {item.script && (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                  {item.script}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
