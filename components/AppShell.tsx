"use client"

import { useState } from "react"
import Drawer from "@/components/Drawer"
import Fab from "@/components/Fab"

type Props = {
  children: React.ReactNode
}

export default function AppShell({ children }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const toggle = () => setDrawerOpen((prev) => !prev)
  const close = () => setDrawerOpen(false)

  return (
    <>
      <Drawer open={drawerOpen} onClose={close} />
      <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
      <Fab onClick={toggle} />
    </>
  )
}
