import { getCloudflareContext } from "@opennextjs/cloudflare"

async function getBucket() {
  const { env } = await getCloudflareContext({ async: true })
  return env.yurari_music
}

export async function uploadAudio(key: string, data: ArrayBuffer, contentType: string) {
  const bucket = await getBucket()
  await bucket.put(key, data, { httpMetadata: { contentType } })
}

export async function deleteAudio(key: string) {
  const bucket = await getBucket()
  await bucket.delete(key)
}

export async function getAudio(key: string) {
  const bucket = await getBucket()
  return bucket.get(key)
}
