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
      className="group block border border-border bg-card px-5 py-4 transition-all duration-300 border-glow-hover"
    >
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-sm text-neon-dim transition-colors group-hover:text-neon group-hover:glow-text">
          #{episode_index}
        </span>
        <span className="ml-auto font-mono text-xs text-muted-foreground">{date}</span>
      </div>
    </Link>
  )
}
