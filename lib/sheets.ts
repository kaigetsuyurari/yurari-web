import type { Broadcast, NewsItem, NewsDetail } from "@/types"

const SHEET_ID = process.env.SHEET_ID

function csvUrl(sheet: string) {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheet}`
}

/**
 * Parse CSV that may contain quoted fields with embedded newlines and commas.
 * Returns array of rows, each row is array of field strings.
 */
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
          // escaped quote
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

  // last field / row
  if (field || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  return rows
}

async function fetchSheet(sheet: string): Promise<string[][]> {
  if (!SHEET_ID || SHEET_ID === "your_spreadsheet_id_here") return []
  const res = await fetch(csvUrl(sheet), { next: { revalidate: 60 } })
  if (!res.ok) {
    console.error(`Failed to fetch sheet ${sheet}: ${res.status}`)
    return []
  }
  const text = await res.text()
  const rows = parseCsv(text)
  // skip header row
  return rows.slice(1).filter(r => r.some(f => f.trim() !== ""))
}

function formatDate(raw: string): string {
  const d = new Date(raw)
  if (isNaN(d.getTime())) return raw
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`
}

export async function getBroadcasts(): Promise<Broadcast[]> {
  const rows = await fetchSheet("broadcasts")
  return rows.map(r => ({
    date: formatDate(r[0]?.trim() ?? ""),
    episode_index: r[1]?.trim() ?? "",
  }))
}

export async function getNewsItems(episodeIndex?: string): Promise<NewsItem[]> {
  const rows = await fetchSheet("news_items")
  const items: NewsItem[] = rows.map(r => ({
    episode_index: r[0]?.trim() ?? "",
    headline_index: r[1]?.trim() ?? "",
    headline_text: r[2]?.trim() ?? "",
  }))
  if (episodeIndex) {
    return items.filter(item => item.episode_index === episodeIndex)
  }
  return items
}

export async function getNewsDetails(episodeIndex?: string): Promise<NewsDetail[]> {
  const rows = await fetchSheet("news_detail")
  const details: NewsDetail[] = rows.map(r => ({
    episode_index: r[0]?.trim() ?? "",
    headline_index: r[1]?.trim() ?? "",
    script: r[2]?.trim() ?? "",
  }))
  if (episodeIndex) {
    return details.filter(d => d.episode_index === episodeIndex)
  }
  return details
}

export async function getNewsDetail(episodeIndex: string, headlineIndex: string): Promise<NewsDetail | undefined> {
  const details = await getNewsDetails(episodeIndex)
  return details.find(d => d.headline_index === headlineIndex)
}
