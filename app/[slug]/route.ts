import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {

  const { slug } = await params

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data } = await supabase
    .from('short_links')
    .select('url')
    .eq('slug', slug)
    .single()

  if (!data?.url) {
    return new NextResponse('Link no encontrado', {
      status: 404,
    })
  }

  return NextResponse.redirect(data.url)
}