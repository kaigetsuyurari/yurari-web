import { getBroadcasts } from "@/lib/sheets"
import BroadcastList from "@/components/BroadcastList"

export default async function NewsPage() {
  const broadcasts = await getBroadcasts()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-medium">ニュースの記録</h1>
      <BroadcastList broadcasts={broadcasts} />
    </div>
  )
}
