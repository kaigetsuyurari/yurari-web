"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

type Props = {
  open: boolean
  onClose: () => void
}

const menuItems = [
  { label: "Οἶκος", href: "/" },
  { label: "Ἀρχεῖον", href: "/news" },
]

export default function Drawer({ open, onClose }: Props) {
  const pathname = usePathname()

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <nav
        className={`fixed left-0 top-0 z-50 h-full w-64 border-r border-neon/20 bg-card shadow-[4px_0_24px_rgba(0,200,255,0.1)] transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 py-8">
          <ul className="flex flex-col gap-1">
            {menuItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href)

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`block border-l-2 px-4 py-3 text-sm tracking-wide transition-all duration-200 ${
                      isActive
                        ? "border-neon bg-neon/10 font-medium text-neon"
                        : "border-transparent text-foreground/60 hover:border-neon/40 hover:bg-neon/5 hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>
    </>
  )
}
