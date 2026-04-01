import { NextRequest, NextResponse } from "next/server"
import { getCloudflareContext } from "@opennextjs/cloudflare"

export async function POST(request: NextRequest) {
  try {
    const { action, key, uploadId, partNumber, parts } = await request.json() as {
      action: string
      key?: string
      uploadId?: string
      partNumber?: number
      parts?: { partNumber: number; etag: string }[]
    }

    const { env } = await getCloudflareContext({ async: true })
    const bucket = env.yurari_music

    if (action === "init") {
      if (!key) return NextResponse.json({ error: "key is required" }, { status: 400 })
      const upload = await bucket.createMultipartUpload(key)
      return NextResponse.json({ uploadId: upload.uploadId, key: upload.key })
    }

    if (action === "complete") {
      if (!key || !uploadId || !parts) {
        return NextResponse.json({ error: "missing params" }, { status: 400 })
      }
      const upload = bucket.resumeMultipartUpload(key, uploadId)
      await upload.complete(parts)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "invalid action" }, { status: 400 })
  } catch (e) {
    const message = e instanceof Error ? e.message : "不明なエラー"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const key = url.searchParams.get("key")
    const uploadId = url.searchParams.get("uploadId")
    const partNumber = url.searchParams.get("partNumber")

    if (!key || !uploadId || !partNumber) {
      return NextResponse.json({ error: "missing params" }, { status: 400 })
    }

    const { env } = await getCloudflareContext({ async: true })
    const bucket = env.yurari_music

    const upload = bucket.resumeMultipartUpload(key, uploadId)
    const body = await request.arrayBuffer()
    const part = await upload.uploadPart(Number(partNumber), body)

    return NextResponse.json({ partNumber: part.partNumber, etag: part.etag })
  } catch (e) {
    const message = e instanceof Error ? e.message : "不明なエラー"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
