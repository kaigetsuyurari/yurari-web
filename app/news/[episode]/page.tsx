import { notFound } from "next/navigation"
import Link from "next/link"
import { getBroadcasts, getNewsItems } from "@/lib/sheets"
import NewsHeadlineItem from "@/components/NewsHeadlineItem"
import { ChevronLeft } from "lucide-react"

type Props = {
  params: Promise<{ episode: string }>
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
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        ニュースの記録へ戻る
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">第{broadcast.episode_index}回</h1>
        <p className="mt-1 text-sm text-muted-foreground">{broadcast.date}</p>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground">ニュース記事がありません。</p>
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
