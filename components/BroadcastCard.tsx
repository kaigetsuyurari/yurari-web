import Link from "next/link"
import type { Broadcast } from "@/types"

type Props = {
  broadcast: Broadcast
}

export default function BroadcastCard({ broadcast }: Props) {
  const { date, episode_index } = broadcast
  const href = `/news/${encodeURIComponent(episode_index)}`

  return (
    <Link
      href={href}
      className="block rounded-lg border border-border bg-card px-5 py-4 transition-colors hover:bg-muted"
    >
      <div className="flex items-baseline gap-3">
        <span className="text-base font-semibold text-foreground">第{episode_index}回</span>
        <span className="text-sm text-muted-foreground">{date}</span>
      </div>
    </Link>
  )
}
