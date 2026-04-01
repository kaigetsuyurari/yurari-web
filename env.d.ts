import type {} from "@opennextjs/cloudflare"

declare global {
  interface CloudflareEnv {
    yurari_db: D1Database
    yurari_music: R2Bucket
  }
}
