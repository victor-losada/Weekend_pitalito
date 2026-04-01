import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/server-admin'

/**
 * POST: subir imagen de producto al bucket usando service role (bypasea RLS de Storage)
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file || !file.size) {
      return NextResponse.json(
        { error: 'Falta el archivo de imagen' },
        { status: 400 },
      )
    }

    const ext = file.name.split('.').pop() || 'jpg'
    const filePath = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const supabase = getAdminClient()
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, { cacheControl: '3600', upsert: false })

    if (uploadError) {
      console.error('API upload-product-image:', uploadError)
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 },
      )
    }

    const { data: publicData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath)

    return NextResponse.json({ url: publicData.publicUrl })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Error al subir la imagen' },
      { status: 500 },
    )
  }
}
