import Link from "next/link"
import { notFound } from "next/navigation"
import { getBroadcastDetail } from "@/lib/db"
import BroadcastForm from "@/components/admin/BroadcastForm"

export const dynamic = "force-dynamic"

export default async function EditBroadcastPage({ params }: { params: Promise<{ episode: string }> }) {
  const { episode } = await params
  const detail = await getBroadcastDetail(episode)

  if (!detail) notFound()

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Link
        href={`/admin/broadcasts/${episode}`}
        className="mb-6 inline-block font-mono text-xs tracking-widest text-muted-foreground hover:text-neon"
      >
        &larr; BACK
      </Link>
      <h1 className="mb-8 font-mono text-2xl font-medium tracking-widest text-neon glow-text">
        EDIT #{detail.episode_index}
      </h1>
      <BroadcastForm mode="edit" initialData={detail} />
    </div>
  )
}
