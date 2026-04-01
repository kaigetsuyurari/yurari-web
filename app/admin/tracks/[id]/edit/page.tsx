import Link from "next/link"
import { notFound } from "next/navigation"
import { getTrack } from "@/lib/db"
import TrackForm from "@/components/admin/TrackForm"
import DeleteTrackDialog from "@/components/admin/DeleteTrackDialog"

export const dynamic = "force-dynamic"

export default async function EditTrackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const track = await getTrack(Number(id))

  if (!track) notFound()

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Link
        href="/admin/tracks"
        className="mb-6 inline-block font-mono text-xs tracking-widest text-muted-foreground hover:text-neon"
      >
        &larr; BACK
      </Link>
      <h1 className="mb-8 font-mono text-2xl font-medium tracking-widest text-neon glow-text">
        EDIT TRACK
      </h1>
      <TrackForm mode="edit" initialData={track} />
      <div className="mt-8 border-t border-border pt-6">
        <DeleteTrackDialog trackId={track.id} trackTitle={track.title} />
      </div>
    </div>
  )
}
