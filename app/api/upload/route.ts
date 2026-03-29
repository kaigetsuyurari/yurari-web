import { NextRequest, NextResponse } from "next/server"
import { getCloudflareContext } from "@opennextjs/cloudflare"

function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ""
  let inQuotes = false
  let i = 0

  while (i < text.length) {
    const ch = text[i]
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i += 2
        } else {
          inQuotes = false
          i++
        }
      } else {
        field += ch
        i++
      }
    } else {
      if (ch === '"') {
        inQuotes = true
        i++
      } else if (ch === ',') {
        row.push(field)
        field = ""
        i++
      } else if (ch === '\r' && text[i + 1] === '\n') {
        row.push(field)
        rows.push(row)
        row = []
        field = ""
        i += 2
      } else if (ch === '\n') {
        row.push(field)
        rows.push(row)
        row = []
        field = ""
        i++
      } else {
        field += ch
        i++
      }
    }
  }

  if (field || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  return rows
}

function formatDate(raw: string): string {
  const d = new Date(raw)
  if (isNaN(d.getTime())) return raw
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`
}

export async function POST(request: NextRequest) {
  try {
    const { env } = await getCloudflareContext({ async: true })
    const db = env.yurari_db

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "ファイルが選択されていません" }, { status: 400 })
    }

    const text = await file.text()
    const allRows = parseCsv(text)

    // Validate header
    const header = allRows[0]?.map(h => h.trim().toLowerCase())
    if (!header || !header.includes("episode_index") || !header.includes("headline_index")) {
      return NextResponse.json(
        { error: "CSVヘッダーが不正です。episode_index, date, headline_index, headline_text, script が必要です" },
        { status: 400 }
      )
    }

    const colIndex = {
      episode_index: header.indexOf("episode_index"),
      date: header.indexOf("date"),
      headline_index: header.indexOf("headline_index"),
      headline_text: header.indexOf("headline_text"),
      script: header.indexOf("script"),
    }

    const rows = allRows.slice(1).filter(r => r.some(f => f.trim() !== ""))

    if (rows.length === 0) {
      return NextResponse.json({ error: "データ行がありません" }, { status: 400 })
    }

    // Group by episode to insert broadcasts first
    const episodes = new Map<string, string>()
    for (const row of rows) {
      const ep = row[colIndex.episode_index]?.trim()
      const date = row[colIndex.date]?.trim()
      if (ep && date && !episodes.has(ep)) {
        episodes.set(ep, formatDate(date))
      }
    }

    // Insert broadcasts (ignore if already exists)
    let broadcastCount = 0
    for (const [episodeIndex, date] of episodes) {
      const existing = await db
        .prepare("SELECT id FROM broadcasts WHERE episode_index = ?")
        .bind(Number(episodeIndex))
        .first()
      if (!existing) {
        await db
          .prepare("INSERT INTO broadcasts (episode_index, date) VALUES (?, ?)")
          .bind(Number(episodeIndex), date)
          .run()
        broadcastCount++
      }
    }

    // Insert news_items
    let itemCount = 0
    for (const row of rows) {
      const episodeIndex = row[colIndex.episode_index]?.trim()
      const headlineIndex = row[colIndex.headline_index]?.trim()
      const headlineText = row[colIndex.headline_text]?.trim() ?? ""
      const script = row[colIndex.script]?.trim() ?? ""

      if (!episodeIndex || !headlineIndex) continue

      await db
        .prepare(
          `INSERT OR REPLACE INTO news_items (broadcast_id, headline_index, headline_text, script)
           VALUES ((SELECT id FROM broadcasts WHERE episode_index = ?), ?, ?, ?)`
        )
        .bind(Number(episodeIndex), Number(headlineIndex), headlineText, script)
        .run()
      itemCount++
    }

    return NextResponse.json({
      success: true,
      message: `${broadcastCount}件の放送、${itemCount}件のニュースを登録しました`,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : "不明なエラー"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
