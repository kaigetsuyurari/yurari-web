"use client"

import Image from "next/image"

type Props = {
  onClick: () => void
}

export default function Fab({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full border border-neon/30 bg-card transition-all duration-300 hover:border-neon/60 hover:glow-md active:scale-95"
      aria-label="Κατάλογος"
    >
      <Image
        src="/icon.svg"
        alt=""
        width={32}
        height={32}
        unoptimized
      />
    </button>
  )
}
