import type { Broadcast, NewsItem, NewsDetail, BroadcastWithCount, BroadcastDetail, Track } from "@/types"
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

export async function getBroadcastsWithCount(): Promise<BroadcastWithCount[]> {
  const db = await getDB()
  const { results } = await db
    .prepare(
      `SELECT b.episode_index, b.date, COUNT(ni.id) AS news_item_count
       FROM broadcasts b
       LEFT JOIN news_items ni ON ni.broadcast_id = b.id
       GROUP BY b.id
       ORDER BY b.episode_index DESC`
    )
    .all<{ episode_index: number; date: string; news_item_count: number }>()

  return results.map(r => ({
    episode_index: String(r.episode_index),
    date: r.date,
    news_item_count: r.news_item_count,
  }))
}

export async function getBroadcastDetail(episodeIndex: string): Promise<BroadcastDetail | undefined> {
  const db = await getDB()
  const broadcast = await db
    .prepare("SELECT id, episode_index, date FROM broadcasts WHERE episode_index = ?")
    .bind(Number(episodeIndex))
    .first<{ id: number; episode_index: number; date: string }>()

  if (!broadcast) return undefined

  const { results } = await db
    .prepare(
      `SELECT headline_index, headline_text, script
       FROM news_items
       WHERE broadcast_id = ?
       ORDER BY headline_index`
    )
    .bind(broadcast.id)
    .all<{ headline_index: number; headline_text: string; script: string }>()

  return {
    episode_index: String(broadcast.episode_index),
    date: broadcast.date,
    news_items: results.map(r => ({
      headline_index: String(r.headline_index),
      headline_text: r.headline_text,
      script: r.script,
    })),
  }
}

export async function createBroadcast(data: BroadcastDetail): Promise<void> {
  const db = await getDB()
  const stmts = [
    db.prepare("INSERT INTO broadcasts (episode_index, date) VALUES (?, ?)")
      .bind(Number(data.episode_index), data.date),
    ...data.news_items.map(item =>
      db.prepare(
        `INSERT INTO news_items (broadcast_id, headline_index, headline_text, script)
         VALUES ((SELECT id FROM broadcasts WHERE episode_index = ?), ?, ?, ?)`
      ).bind(Number(data.episode_index), Number(item.headline_index), item.headline_text, item.script)
    ),
  ]
  await db.batch(stmts)
}

export async function updateBroadcast(episodeIndex: string, data: { date: string; news_items: BroadcastDetail["news_items"]; newEpisodeIndex?: string }): Promise<void> {
  const db = await getDB()
  const targetEpisode = data.newEpisodeIndex ?? episodeIndex
  const stmts = [
    ...(data.newEpisodeIndex
      ? [db.prepare("UPDATE broadcasts SET episode_index = ?, date = ? WHERE episode_index = ?")
          .bind(Number(data.newEpisodeIndex), data.date, Number(episodeIndex))]
      : [db.prepare("UPDATE broadcasts SET date = ? WHERE episode_index = ?")
          .bind(data.date, Number(episodeIndex))]),
    db.prepare("DELETE FROM news_items WHERE broadcast_id = (SELECT id FROM broadcasts WHERE episode_index = ?)")
      .bind(Number(targetEpisode)),
    ...data.news_items.map(item =>
      db.prepare(
        `INSERT INTO news_items (broadcast_id, headline_index, headline_text, script)
         VALUES ((SELECT id FROM broadcasts WHERE episode_index = ?), ?, ?, ?)`
      ).bind(Number(targetEpisode), Number(item.headline_index), item.headline_text, item.script)
    ),
  ]
  await db.batch(stmts)
}

export async function deleteBroadcast(episodeIndex: string): Promise<void> {
  const db = await getDB()
  await db.batch([
    db.prepare("DELETE FROM news_items WHERE broadcast_id = (SELECT id FROM broadcasts WHERE episode_index = ?)")
      .bind(Number(episodeIndex)),
    db.prepare("DELETE FROM broadcasts WHERE episode_index = ?")
      .bind(Number(episodeIndex)),
  ])
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

// --- Tracks ---

export async function getTracks(): Promise<Track[]> {
  const db = await getDB()
  const { results } = await db
    .prepare("SELECT id, title, artist, url, created_at FROM tracks ORDER BY created_at DESC")
    .all<Track>()
  return results
}

export async function getTrack(id: number): Promise<Track | undefined> {
  const db = await getDB()
  const result = await db
    .prepare("SELECT id, title, artist, url, created_at FROM tracks WHERE id = ?")
    .bind(id)
    .first<Track>()
  return result ?? undefined
}

export async function createTrack(data: { title: string; artist: string; url: string }): Promise<void> {
  const db = await getDB()
  await db
    .prepare("INSERT INTO tracks (title, artist, url) VALUES (?, ?, ?)")
    .bind(data.title, data.artist, data.url)
    .run()
}

export async function updateTrack(id: number, data: { title: string; artist: string; url: string }): Promise<void> {
  const db = await getDB()
  await db
    .prepare("UPDATE tracks SET title = ?, artist = ?, url = ? WHERE id = ?")
    .bind(data.title, data.artist, data.url, id)
    .run()
}

export async function deleteTrack(id: number): Promise<void> {
  const db = await getDB()
  await db.prepare("DELETE FROM tracks WHERE id = ?").bind(id).run()
}
