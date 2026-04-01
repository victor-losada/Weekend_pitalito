import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/server-admin'

const ALLOWED: ReadonlyArray<string> = ['ready', 'cancelled']

/**
 * PATCH /api/admin/orders/:id  { status: 'ready' | 'cancelled' }
 * Actualiza estado (service role). Se limita a estados permitidos.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await request.json().catch(() => ({}))
    const status = body?.status

    if (!id) return NextResponse.json({ error: 'Falta id' }, { status: 400 })
    if (!ALLOWED.includes(status)) {
      return NextResponse.json(
        { error: 'Estado no permitido' },
        { status: 400 },
      )
    }

    const supabase = getAdminClient()
    const { error } = await supabase.from('orders').update({ status }).eq('id', id)

    if (error) {
      console.error('API admin/orders PATCH:', error)
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

