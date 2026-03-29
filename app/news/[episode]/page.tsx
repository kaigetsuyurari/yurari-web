import type { Metadata } from "next"
export const dynamic = "force-dynamic"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getBroadcasts, getNewsItems } from "@/lib/db"
import NewsHeadlineItem from "@/components/NewsHeadlineItem"
import { ChevronLeft } from "lucide-react"

type Props = {
  params: Promise<{ episode: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { episode: encoded } = await params
  const episodeIndex = decodeURIComponent(encoded)
  return {
    title: `#${episodeIndex}`,
    description: `Μέδουσα Ἰελλάρι — #${episodeIndex} κεφάλαια`,
  }
}

export default async function NewsHeadlinePage({ params }: Props) {
  const { episode: encoded } = await params
  const episodeIndex = decodeURIComponent(encoded)

  const [broadcasts, items] = await Promise.all([
    getBroadcasts(),
    getNewsItems(episodeIndex),
  ])

  const broadcast = broadcasts.find(b => b.episode_index === episodeIndex)
  if (!broadcast) notFound()

  return (
    <div>
      <Link
        href="/news"
        className="mb-6 inline-flex items-center gap-1 font-mono text-xs tracking-wide text-muted-foreground transition-colors hover:text-neon"
      >
        <ChevronLeft className="size-4" />
        Ἐπάνοδος εἰς τὰς Ἐκπομπάς
      </Link>

      <div className="mb-6">
        <h1 className="font-mono text-2xl font-medium tracking-widest text-neon glow-text">#{broadcast.episode_index}</h1>
        <p className="mt-1 font-mono text-sm text-muted-foreground">{broadcast.date}</p>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground">Οὐδεμία ἀγγελία εὑρέθη.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map(item => (
            <li key={item.headline_index}>
              <NewsHeadlineItem item={item} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
