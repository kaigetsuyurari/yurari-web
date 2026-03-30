import { NextRequest, NextResponse } from "next/server"
import { updateBroadcast, deleteBroadcast } from "@/lib/db"
import type { BroadcastDetail } from "@/types"

type Params = { params: Promise<{ episode: string }> }

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { episode } = await params
    const body = await request.json() as { date: string; news_items: BroadcastDetail["news_items"] }

    if (!body.date || !Array.isArray(body.news_items)) {
      return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 })
    }

    await updateBroadcast(episode, body)
    return NextResponse.json({ success: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : "不明なエラー"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { episode } = await params
    await deleteBroadcast(episode)
    return NextResponse.json({ success: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : "不明なエラー"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
