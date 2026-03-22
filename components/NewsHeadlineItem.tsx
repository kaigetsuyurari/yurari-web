import Link from "next/link"
import type { NewsItem } from "@/types"

type Props = {
  item: NewsItem
}

export default function NewsHeadlineItem({ item }: Props) {
  const href = `/news/${encodeURIComponent(item.episode_index)}/${item.headline_index}`

  return (
    <Link
      href={href}
      className="block rounded-lg border border-border bg-card px-5 py-3 transition-colors hover:bg-muted"
    >
      <div className="flex items-center gap-3">
        <span className="min-w-[2rem] text-sm font-mono text-muted-foreground">
          {item.headline_index}.
        </span>
        <span className="text-sm text-foreground">{item.headline_text}</span>
      </div>
    </Link>
  )
}
