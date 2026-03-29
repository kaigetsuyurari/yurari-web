import type { Metadata } from "next"
export const dynamic = "force-dynamic"
import { getBroadcasts } from "@/lib/db"
import BroadcastList from "@/components/BroadcastList"

export const metadata: Metadata = {
  title: "ニュースの記録",
  description: "海月ゆらりのニュース番組 放送アーカイブ一覧",
}

export default async function NewsPage() {
  const broadcasts = await getBroadcasts()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-medium">ニュースの記録</h1>
      <BroadcastList broadcasts={broadcasts} />
    </div>
  )
}
