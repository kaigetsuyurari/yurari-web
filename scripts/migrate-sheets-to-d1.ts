/**
 * Google Sheets CSV → D1 migration script (one-time use)
 *
 * Usage:
 *   1. Export 3 sheets as CSV and place them at:
 *      - scripts/data/broadcasts.csv
 *      - scripts/data/news_items.csv
 *      - scripts/data/news_detail.csv
 *   2. Run: npx tsx scripts/migrate-sheets-to-d1.ts > scripts/data/seed.sql
 *   3. Apply: npx wrangler d1 execute yurari-db --file=scripts/data/seed.sql        (remote)
 *          or npx wrangler d1 execute yurari-db --file=scripts/data/seed.sql --local (local)
 */

import { readFileSync } from "fs"
import { join } from "path"

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

function readCsv(filename: string): string[][] {
  const path = join(__dirname, "data", filename)
  const text = readFileSync(path, "utf-8")
  const rows = parseCsv(text)
  // skip header row, filter empty rows
  return rows.slice(1).filter(r => r.some(f => f.trim() !== ""))
}

function formatDate(raw: string): string {
  const d = new Date(raw)
  if (isNaN(d.getTime())) return raw
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`
}

function escapeSql(str: string): string {
  return str.replace(/'/g, "''")
}

function main() {
  const broadcasts = readCsv("broadcasts.csv")
  const newsItems = readCsv("news_items.csv")
  const newsDetails = readCsv("news_detail.csv")

  // Build a lookup: (episode_index, headline_index) -> script
  const scriptMap = new Map<string, string>()
  for (const row of newsDetails) {
    const episodeIndex = row[0]?.trim() ?? ""
    const headlineIndex = row[1]?.trim() ?? ""
    const script = row[2]?.trim() ?? ""
    scriptMap.set(`${episodeIndex}:${headlineIndex}`, script)
  }

  const lines: string[] = []

  // Insert broadcasts
  for (const row of broadcasts) {
    const date = formatDate(row[0]?.trim() ?? "")
    const episodeIndex = row[1]?.trim() ?? ""
    lines.push(
      `INSERT INTO broadcasts (episode_index, date) VALUES (${episodeIndex}, '${escapeSql(date)}');`
    )
  }

  // Insert news_items (joined with news_detail scripts)
  // We need the broadcast internal id; since we insert in order, we can use a subquery
  for (const row of newsItems) {
    const episodeIndex = row[0]?.trim() ?? ""
    const headlineIndex = row[1]?.trim() ?? ""
    const headlineText = row[2]?.trim() ?? ""
    const script = scriptMap.get(`${episodeIndex}:${headlineIndex}`) ?? ""

    lines.push(
      `INSERT INTO news_items (broadcast_id, headline_index, headline_text, script) VALUES ((SELECT id FROM broadcasts WHERE episode_index = ${episodeIndex}), ${headlineIndex}, '${escapeSql(headlineText)}', '${escapeSql(script)}');`
    )
  }

  console.log(lines.join("\n"))
}

main()
