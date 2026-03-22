"use client"

import Image from "next/image"

type Props = {
  onClick: () => void
}

export default function Fab({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-card shadow-[0_2px_8px_rgba(0,0,0,0.15),0_1px_3px_rgba(0,0,0,0.1)] transition-transform hover:scale-105 active:scale-95"
      aria-label="メニューを開く"
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
