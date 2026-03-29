import type { Broadcast } from "@/types"
import BroadcastCard from "@/components/BroadcastCard"

type Props = {
  broadcasts: Broadcast[]
}

export default function BroadcastList({ broadcasts }: Props) {
  if (broadcasts.length === 0) {
    return <p className="text-muted-foreground">Οὐδεμία ἐκπομπὴ εὑρέθη.</p>
  }

  return (
    <div className="flex flex-col gap-3">
      {broadcasts.map((b) => (
        <BroadcastCard key={b.episode_index} broadcast={b} />
      ))}
    </div>
  )
}
