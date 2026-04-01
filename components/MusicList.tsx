import type { Track } from "@/types"

type Props = {
  tracks: Track[]
}

export default function MusicList({ tracks }: Props) {
  if (tracks.length === 0) {
    return (
      <p className="text-foreground/50 text-sm">Οὐδέπω μέλος ἐστίν.</p>
    )
  }

  return (
    <ul className="flex flex-col gap-6">
      {tracks.map((track) => (
        <li
          key={track.id}
          className="rounded-lg border border-neon/20 bg-card/60 px-5 py-4"
        >
          <div className="mb-1 text-sm font-medium tracking-wide text-foreground">
            {track.title}
          </div>
          {track.artist && (
            <div className="mb-3 text-xs text-foreground/50">{track.artist}</div>
          )}

          <audio controls preload="metadata" className="mb-3 w-full">
            <source src={track.url} />
          </audio>

          <a
            href={track.url}
            download
            className="inline-block text-xs text-neon/70 transition-colors hover:text-neon"
          >
            ↓ Κατέβασμα
          </a>
        </li>
      ))}
    </ul>
  )
}
