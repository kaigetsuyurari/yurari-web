import type { Broadcast, NewsItem, NewsDetail } from "@/types"
import { getCloudflareContext } from "@opennextjs/cloudflare"

async function getDB() {
  const { env } = await getCloudflareContext({ async: true })
  return env.yurari_db
}

export async function getBroadcasts(): Promise<Broadcast[]> {
  const db = await getDB()
  const { results } = await db
    .prepare("SELECT episode_index, date FROM broadcasts ORDER BY episode_index DESC")
    .all<{ episode_index: number; date: string }>()

  return results.map(r => ({
    episode_index: String(r.episode_index),
    date: r.date,
  }))
}

export async function getNewsItems(episodeIndex?: string): Promise<NewsItem[]> {
  const db = await getDB()

  if (episodeIndex) {
    const { results } = await db
      .prepare(
        `SELECT b.episode_index, ni.headline_index, ni.headline_text
         FROM news_items ni
         JOIN broadcasts b ON b.id = ni.broadcast_id
         WHERE b.episode_index = ?
         ORDER BY ni.headline_index`
      )
      .bind(Number(episodeIndex))
      .all<{ episode_index: number; headline_index: number; headline_text: string }>()

    return results.map(r => ({
      episode_index: String(r.episode_index),
      headline_index: String(r.headline_index),
      headline_text: r.headline_text,
    }))
  }

  const { results } = await db
    .prepare(
      `SELECT b.episode_index, ni.headline_index, ni.headline_text
       FROM news_items ni
       JOIN broadcasts b ON b.id = ni.broadcast_id
       ORDER BY b.episode_index DESC, ni.headline_index`
    )
    .all<{ episode_index: number; headline_index: number; headline_text: string }>()

  return results.map(r => ({
    episode_index: String(r.episode_index),
    headline_index: String(r.headline_index),
    headline_text: r.headline_text,
  }))
}

export async function getNewsDetails(episodeIndex?: string): Promise<NewsDetail[]> {
  const db = await getDB()

  if (episodeIndex) {
    const { results } = await db
      .prepare(
        `SELECT b.episode_index, ni.headline_index, ni.script
         FROM news_items ni
         JOIN broadcasts b ON b.id = ni.broadcast_id
         WHERE b.episode_index = ?
         ORDER BY ni.headline_index`
      )
      .bind(Number(episodeIndex))
      .all<{ episode_index: number; headline_index: number; script: string }>()

    return results.map(r => ({
      episode_index: String(r.episode_index),
      headline_index: String(r.headline_index),
      script: r.script,
    }))
  }

  const { results } = await db
    .prepare(
      `SELECT b.episode_index, ni.headline_index, ni.script
       FROM news_items ni
       JOIN broadcasts b ON b.id = ni.broadcast_id
       ORDER BY b.episode_index DESC, ni.headline_index`
    )
    .all<{ episode_index: number; headline_index: number; script: string }>()

  return results.map(r => ({
    episode_index: String(r.episode_index),
    headline_index: String(r.headline_index),
    script: r.script,
  }))
}

export async function getNewsDetail(episodeIndex: string, headlineIndex: string): Promise<NewsDetail | undefined> {
  const db = await getDB()
  const result = await db
    .prepare(
      `SELECT b.episode_index, ni.headline_index, ni.script
       FROM news_items ni
       JOIN broadcasts b ON b.id = ni.broadcast_id
       WHERE b.episode_index = ? AND ni.headline_index = ?`
    )
    .bind(Number(episodeIndex), Number(headlineIndex))
    .first<{ episode_index: number; headline_index: number; script: string }>()

  if (!result) return undefined

  return {
    episode_index: String(result.episode_index),
    headline_index: String(result.headline_index),
    script: result.script,
  }
}
