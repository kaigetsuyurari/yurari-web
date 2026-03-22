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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yurari-web.vercel.app"

export const metadata: Metadata = {
  title: {
    default: "ゆらりWEB",
    template: "%s | ゆらりWEB",
  },
  description: "海月ゆらり 公式サイト",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "ゆらりWEB",
    description: "海月ゆらり 公式サイト",
    url: SITE_URL,
    siteName: "ゆらりWEB",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ゆらりWEB",
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
    <html lang="ja">
      <body className={`${zenKaku.variable} ${geistMono.variable} antialiased`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
