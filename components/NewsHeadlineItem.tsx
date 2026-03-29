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
      className="group block border border-border bg-card px-5 py-3 transition-all duration-300 border-glow-hover"
    >
      <div className="flex items-center gap-3">
        <span className="min-w-[2rem] font-mono text-sm text-neon-dim transition-colors group-hover:text-neon group-hover:glow-text">
          {item.headline_index}.
        </span>
        <span className="text-sm text-foreground">{item.headline_text}</span>
      </div>
    </Link>
  )
}
