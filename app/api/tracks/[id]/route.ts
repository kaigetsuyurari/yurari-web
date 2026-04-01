import { NextRequest, NextResponse } from "next/server"
import { getTrack, updateTrack, deleteTrack } from "@/lib/db"
import { deleteAudio } from "@/lib/storage"

type Params = { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await request.json() as { title?: string; artist?: string; newKey?: string }

    if (!body.title) {
      return NextResponse.json({ error: "タイトルは必須です" }, { status: 400 })
    }

    const existing = await getTrack(Number(id))
    if (!existing) {
      return NextResponse.json({ error: "トラックが見つかりません" }, { status: 404 })
    }

    let url = existing.url
    if (body.newKey) {
      const oldKey = existing.url.replace("/api/audio/", "")
      await deleteAudio(oldKey)
      url = `/api/audio/${body.newKey}`
    }

    await updateTrack(Number(id), { title: body.title, artist: body.artist ?? "", url })
    return NextResponse.json({ success: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : "不明なエラー"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const track = await getTrack(Number(id))
    if (track) {
      const key = track.url.replace("/api/audio/", "")
      await deleteAudio(key)
    }
    await deleteTrack(Number(id))
    return NextResponse.json({ success: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : "不明なエラー"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
