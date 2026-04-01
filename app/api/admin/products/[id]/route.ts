import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/server-admin'

/**
 * PATCH: actualizar producto por id (bypasea RLS)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: 'Falta id' }, { status: 400 })
    }

    const body = await request.json()
    const update: Record<string, unknown> = {}
    if (body.name !== undefined) update.name = body.name
    if (body.description !== undefined) update.description = body.description
    if (body.price !== undefined) update.price = Math.round(Number(body.price))
    if (body.category !== undefined) update.category = body.category
    if (body.imageUrl !== undefined) update.image_url = body.imageUrl
    if (body.available !== undefined) update.available = body.available
    if (body.discount !== undefined) update.discount = Math.round(Number(body.discount))

    const supabase = getAdminClient()
    const { error } = await supabase.from('products').update(update).eq('id', id)

    if (error) {
      console.error('API admin/products PATCH:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Error interno' },
      { status: 500 },
    )
  }
}

/**
 * DELETE: eliminar producto por id (bypasea RLS)
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: 'Falta id' }, { status: 400 })
    }

    const supabase = getAdminClient()
    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) {
      console.error('API admin/products DELETE:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Error interno' },
      { status: 500 },
    )
  }
}
