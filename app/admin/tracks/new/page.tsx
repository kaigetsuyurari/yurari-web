import Link from "next/link"
import TrackForm from "@/components/admin/TrackForm"

export default function NewTrackPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Link
        href="/admin/tracks"
        className="mb-6 inline-block font-mono text-xs tracking-widest text-muted-foreground hover:text-neon"
      >
        &larr; BACK
      </Link>
      <h1 className="mb-8 font-mono text-2xl font-medium tracking-widest text-neon glow-text">
        NEW TRACK
      </h1>
      <TrackForm mode="create" />
    </div>
  )
}
