import Image from "next/image"

const YOUTUBE_URL = process.env.NEXT_PUBLIC_YOUTUBE_URL ?? "https://www.youtube.com/@KaigetsuYurari"
const GITHUB_URL = "https://github.com/kaigetsuyurari"
const X_URL = "https://x.com/kaigetsuyurari"

export default function HomeView() {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="absolute -inset-1 rounded-lg bg-neon/10 blur-xl" />
        <Image
          src="/kaigetsuyurari.jpg"
          alt="Μέδουσα Ἰελλάρι"
          width={400}
          height={600}
          className="relative max-w-full rounded-sm object-contain"
          unoptimized
          priority
        />
      </div>
      <div className="mt-8 flex flex-col gap-3">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center border border-glow bg-card px-10 py-3 text-sm font-medium tracking-widest text-foreground transition-all duration-300 hover:border-neon hover:text-neon hover:glow-sm"
        >
          GitHub
        </a>
        <a
          href={YOUTUBE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center border border-glow bg-card px-10 py-3 text-sm font-medium tracking-widest text-foreground transition-all duration-300 hover:border-neon hover:text-neon hover:glow-sm"
        >
          YouTube
        </a>
        <a
          href={X_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center border border-glow bg-card px-10 py-3 text-sm font-medium tracking-widest text-foreground transition-all duration-300 hover:border-neon hover:text-neon hover:glow-sm"
        >
          X
        </a>
      </div>
      <p className="mt-8 text-xs text-muted-foreground">
        Ἀρχέτυπον: 胃袋
      </p>
    </div>
  )
}
