import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/server-admin'

/**
 * POST: crear pedido (bypasea RLS con service role)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      items,
      customerName,
      customerPhone,
      customerAddress,
      orderType,
      subtotal,
      total,
      discount,
      status,
    } = body

    if (!items || !Array.isArray(items) || !customerName || !customerPhone || !orderType || total === undefined) {
      return NextResponse.json(
        { error: 'Faltan datos del pedido (items, customerName, customerPhone, orderType, total)' },
        { status: 400 },
      )
    }

    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('orders')
      .insert({
        items,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: customerAddress ?? null,
        order_type: orderType,
        subtotal: Math.round(Number(subtotal) || 0),
        total: Math.round(Number(total)),
        discount_applied: Math.round(Number(discount) || 0),
        status: status ?? 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('API orders POST:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      id: data.id,
      items: data.items,
      customerName: data.customer_name,
      customerPhone: data.customer_phone,
      customerAddress: data.customer_address ?? undefined,
      orderType: data.order_type,
      total: data.total,
      discount: data.discount_applied ?? 0,
      status: data.status,
      createdAt: data.created_at,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Error al registrar el pedido' },
      { status: 500 },
    )
  }
}
