import { NextRequest, NextResponse } from "next/server"
import { getAudio } from "@/lib/storage"

type Params = { params: Promise<{ key: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
  const { key } = await params
  const object = await getAudio(key)

  if (!object) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const headers = new Headers()
  headers.set("Content-Type", object.httpMetadata?.contentType ?? "audio/mpeg")
  headers.set("Cache-Control", "public, max-age=31536000, immutable")

  return new NextResponse(object.body, { headers })
}
