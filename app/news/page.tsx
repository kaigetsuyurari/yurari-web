import type { Metadata } from "next"
export const dynamic = "force-dynamic"
import { getBroadcasts } from "@/lib/db"
import BroadcastList from "@/components/BroadcastList"

export const metadata: Metadata = {
  title: "Ἀρχεῖον τῶν Ἐκπομπῶν",
  description: "Μέδουσα Ἰελλάρι — τὸ ἀρχεῖον τῶν ἐκπομπῶν",
}

export default async function NewsPage() {
  const broadcasts = await getBroadcasts()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-medium tracking-widest text-neon glow-text">Ἀρχεῖον τῶν Ἐκπομπῶν</h1>
      <BroadcastList broadcasts={broadcasts} />
    </div>
  )
}
