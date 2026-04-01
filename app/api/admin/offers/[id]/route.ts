import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/server-admin'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    if (!id) return NextResponse.json({ error: 'Falta id' }, { status: 400 })

    const body = await request.json()
    const update: Record<string, unknown> = {}

    if (body.name !== undefined) update.name = body.name
    if (body.description !== undefined) update.description = body.description
    if (body.discountPercent !== undefined) update.discount_percent = Math.round(Number(body.discountPercent))
    if (body.active !== undefined) update.active = body.active

    const supabase = getAdminClient()
    const { error } = await supabase.from('offers').update(update).eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Error interno' },
      { status: 500 },
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    if (!id) return NextResponse.json({ error: 'Falta id' }, { status: 400 })

    const supabase = getAdminClient()
    const { error } = await supabase.from('offers').delete().eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Error interno' },
      { status: 500 },
    )
  }
}
