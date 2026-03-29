import type { Metadata } from "next"
export const dynamic = "force-dynamic"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getNewsDetail, getNewsItems } from "@/lib/db"
import ScriptView from "@/components/ScriptView"
import { ChevronLeft } from "lucide-react"

type Props = {
  params: Promise<{ episode: string; headline: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { episode: encoded, headline } = await params
  const episodeIndex = decodeURIComponent(encoded)
  const items = await getNewsItems(episodeIndex)
  const headlineText = items.find(i => i.headline_index === headline)?.headline_text ?? ""
  return {
    title: headlineText || `#${episodeIndex}`,
    description: `Μέδουσα Ἰελλάρι — #${episodeIndex} «${headlineText}»`,
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const { episode: encodedEpisode, headline } = await params
  const episodeIndex = decodeURIComponent(encodedEpisode)

  const detail = await getNewsDetail(episodeIndex, headline)
  if (!detail) notFound()

  // 前後ナビゲーション用に同回のアイテムを取得
  const items = await getNewsItems(episodeIndex)
  const currentIndex = items.findIndex(i => i.headline_index === headline)
  const prev = currentIndex > 0 ? items[currentIndex - 1] : null
  const next = currentIndex < items.length - 1 ? items[currentIndex + 1] : null

  // 見出しテキストを取得
  const headlineText = items.find(i => i.headline_index === headline)?.headline_text ?? ""

  return (
    <div>
      <Link
        href={`/news/${encodeURIComponent(episodeIndex)}`}
        className="mb-6 inline-flex items-center gap-1 font-mono text-xs tracking-wide text-muted-foreground transition-colors hover:text-neon"
      >
        <ChevronLeft className="size-4" />
        Ἐπάνοδος εἰς τὰ κεφάλαια
      </Link>

      <article>
        <header className="mb-6">
          <h1 className="text-xl font-medium leading-snug tracking-wide">{headlineText}</h1>
        </header>

        <ScriptView script={detail.script} />
      </article>

      {(prev || next) && (
        <nav className="mt-10 flex justify-between gap-4 border-t border-neon/10 pt-6 text-sm">
          <div className="flex-1">
            {prev && (
              <Link
                href={`/news/${encodeURIComponent(episodeIndex)}/${prev.headline_index}`}
                className="text-muted-foreground transition-colors hover:text-neon"
              >
                ← {prev.headline_text}
              </Link>
            )}
          </div>
          <div className="flex-1 text-right">
            {next && (
              <Link
                href={`/news/${encodeURIComponent(episodeIndex)}/${next.headline_index}`}
                className="text-muted-foreground transition-colors hover:text-neon"
              >
                {next.headline_text} →
              </Link>
            )}
          </div>
        </nav>
      )}
    </div>
  )
}
