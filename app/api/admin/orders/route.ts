import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/server-admin'

export const dynamic = 'force-dynamic'

type OrderRow = {
  id: string
  items: unknown[]
  customer_name: string
  customer_phone: string
  customer_address: string | null
  order_type: 'delivery' | 'pickup'
  subtotal: number | null
  discount_applied: number | null
  total: number
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'cancelled'
  created_at: string
}

function parseIntParam(v: string | null, fallback: number) {
  const n = Number(v)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback
}

/**
 * GET /api/admin/orders?page=1&pageSize=20&q=...&status=pending|ready|cancelled|preparing
 * Lista pedidos con paginación y filtros (service role).
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseIntParam(searchParams.get('page'), 1)
    const pageSize = Math.min(parseIntParam(searchParams.get('pageSize'), 20), 100)
    const q = (searchParams.get('q') || '').trim()
    const status = (searchParams.get('status') || '').trim()

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const supabase = getAdminClient()

    let query = supabase
      .from('orders')
      .select(
        'id, customer_name, customer_phone, customer_address, order_type, items, subtotal, discount_applied, total, status, created_at',
        { count: 'exact' },
      )
      .order('created_at', { ascending: false })

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (q) {
      // Buscar por nombre o teléfono (case-insensitive)
      const esc = q.replace(/,/g, ' ')
      query = query.or(`customer_name.ilike.%${esc}%,customer_phone.ilike.%${esc}%`)
    }

    const { data, error, count } = await query.range(from, to)

    if (error) {
      console.error('API admin/orders GET:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const orders = ((data || []) as OrderRow[]).map((o) => ({
      id: o.id,
      items: o.items,
      customerName: o.customer_name,
      customerPhone: o.customer_phone,
      customerAddress: o.customer_address || undefined,
      orderType: o.order_type,
      subtotal: o.subtotal ?? 0,
      discount: o.discount_applied ?? 0,
      total: o.total,
      status: o.status,
      createdAt: o.created_at,
    }))

    return NextResponse.json({
      page,
      pageSize,
      total: count ?? 0,
      orders,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Error interno' },
      { status: 500 },
    )
  }
}

