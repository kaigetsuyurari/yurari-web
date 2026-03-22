import Image from "next/image"

const YOUTUBE_URL = process.env.NEXT_PUBLIC_YOUTUBE_URL ?? "https://www.youtube.com/@KaigetsuYurari"
const X_URL = "https://x.com/kaigetsuyurari"

export default function HomeView() {
  return (
    <div className="flex flex-col items-center">
      <Image
        src="/kaigetsuyurari.jpg"
        alt="海月ゆらり"
        width={400}
        height={600}
        className="max-w-full object-contain"
        unoptimized
        priority
      />
      <div className="mt-6 flex flex-col gap-3">
        <a
          href={YOUTUBE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-card px-8 py-3 text-sm font-medium text-foreground shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-colors hover:bg-muted"
        >
          YouTube
        </a>
        <a
          href={X_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-card px-8 py-3 text-sm font-medium text-foreground shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-colors hover:bg-muted"
        >
          X
        </a>
      </div>
    </div>
  )
}
