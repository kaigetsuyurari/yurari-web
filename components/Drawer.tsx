"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

type Props = {
  open: boolean
  onClose: () => void
}

const menuItems = [
  { label: "ホーム", href: "/" },
  { label: "ニュースの記録", href: "/news" },
]

export default function Drawer({ open, onClose }: Props) {
  const pathname = usePathname()

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <nav
        className={`fixed left-0 top-0 z-50 h-full w-64 bg-card shadow-lg transition-transform duration-300 ${
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
                    className={`block rounded-md px-4 py-3 text-sm transition-colors ${
                      isActive
                        ? "bg-primary/20 font-medium text-foreground"
                        : "text-foreground/70 hover:bg-primary/10 hover:text-foreground"
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
