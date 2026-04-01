import { NextRequest, NextResponse } from "next/server"
import { createTrack } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { title?: string; artist?: string; key?: string }

    if (!body.title || !body.key) {
      return NextResponse.json({ error: "タイトルとファイルは必須です" }, { status: 400 })
    }

    const url = `/api/audio/${body.key}`
    await createTrack({ title: body.title, artist: body.artist ?? "", url })

    return NextResponse.json({ success: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : "不明なエラー"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
