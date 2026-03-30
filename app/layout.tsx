import type { Metadata } from "next"
import { Zen_Kaku_Gothic_New, Geist_Mono } from "next/font/google"
import AppShell from "@/components/AppShell"
import "./globals.css"

const zenKaku = Zen_Kaku_Gothic_New({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-zen",
  display: "swap",
  preload: true,
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yurari.pages.dev"

export const metadata: Metadata = {
  title: {
    default: "海月ゆらり公式サイト",
    template: "%s | 海月ゆらり公式サイト",
  },
  description: "海月ゆらり 公式サイト",
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "256x256", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
  },
  openGraph: {
    title: "海月ゆらり公式サイト",
    description: "海月ゆらり 公式サイト",
    url: SITE_URL,
    siteName: "海月ゆらり公式サイト",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "海月ゆらり公式サイト",
    description: "海月ゆらり 公式サイト",
    creator: "@kaigetsuyurari",
    images: ["/og-image.jpg"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className="dark">
      <body className={`${zenKaku.variable} ${geistMono.variable} antialiased`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
