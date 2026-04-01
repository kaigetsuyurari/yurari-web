import { NextRequest, NextResponse } from "next/server"
import { updateTrack, deleteTrack } from "@/lib/db"

type Params = { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await request.json() as { title?: string; artist?: string; url?: string }

    if (!body.title || !body.url) {
      return NextResponse.json({ error: "タイトルとURLは必須です" }, { status: 400 })
    }

    await updateTrack(Number(id), { title: body.title, artist: body.artist ?? "", url: body.url })
    return NextResponse.json({ success: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : "不明なエラー"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    await deleteTrack(Number(id))
    return NextResponse.json({ success: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : "不明なエラー"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
