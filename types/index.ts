export type Broadcast = {
  date: string           // e.g. "2026/03/21"
  episode_index: string  // e.g. "1"
}

export type NewsItem = {
  episode_index: string
  headline_index: string
  headline_text: string
}

export type NewsDetail = {
  episode_index: string
  headline_index: string
  script: string
}

export type BroadcastWithCount = {
  episode_index: string
  date: string
  news_item_count: number
}

export type BroadcastDetail = {
  episode_index: string
  date: string
  news_items: { headline_index: string; headline_text: string; script: string }[]
}
