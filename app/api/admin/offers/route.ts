import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/server-admin'

export async function GET() {
  try {
    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('offers')
      .select('id, name, description, discount_percent, active')
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const offers = (data || []).map((o) => ({
      id: o.id,
      name: o.name,
      description: o.description || '',
      discountPercent: o.discount_percent,
      isGlobal: true,
      productIds: undefined,
      active: o.active,
      validUntil: undefined,
    }))

    return NextResponse.json({ offers })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Error interno' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, discountPercent, active } = body

    if (!name || discountPercent === undefined) {
      return NextResponse.json(
        { error: 'Faltan name o discountPercent' },
        { status: 400 },
      )
    }

    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('offers')
      .insert({
        name: String(name),
        description: description ?? '',
        discount_percent: Math.round(Number(discountPercent)),
        active: active !== false,
      })
      .select('id, name, description, discount_percent, active')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({
      id: data.id,
      name: data.name,
      description: data.description || '',
      discountPercent: data.discount_percent,
      isGlobal: true,
      productIds: undefined,
      active: data.active,
      validUntil: undefined,
    })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Error interno' },
      { status: 500 },
    )
  }
}
