import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/server-admin'

export async function GET() {
  try {
    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const products = (data || []).map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description || '',
      price: p.price,
      category: p.category,
      imageUrl: p.image_url || '',
      available: p.available,
      discount: p.discount || 0,
    }))

    return NextResponse.json({ products })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Error interno' },
      { status: 500 },
    )
  }
}

/**
 * POST: crear producto (bypasea RLS con service role)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      price,
      category,
      imageUrl,
      available,
      discount,
    } = body

    if (!name || price === undefined) {
      return NextResponse.json(
        { error: 'Faltan name o price' },
        { status: 400 },
      )
    }

    const supabase = getAdminClient()
    // La tabla usa int4 para price y discount; enviamos enteros
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: String(name),
        description: description ?? '',
        price: Math.round(Number(price)),
        category: category ?? 'bebidas-frias',
        image_url: imageUrl ?? null,
        available: available !== false,
        discount: Math.round(Number(discount) || 0),
      })
      .select()
      .single()

    if (error) {
      console.error('API admin/products POST:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      id: data.id,
      name: data.name,
      description: data.description ?? '',
      price: data.price,
      category: data.category,
      imageUrl: data.image_url ?? '',
      available: data.available,
      discount: data.discount ?? 0,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Error interno' },
      { status: 500 },
    )
  }
}
