import { NextRequest, NextResponse } from "next/server"
import { createBroadcast } from "@/lib/db"
import type { BroadcastDetail } from "@/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as BroadcastDetail

    if (!body.episode_index || !body.date || !Array.isArray(body.news_items)) {
      return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 })
    }

    await createBroadcast(body)
    return NextResponse.json({ success: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : "不明なエラー"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
