import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

export default async function Page({
  params,
}: {
  params: { slug: string }
}) {

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data } = await supabase
    .from('short_links')
    .select('url')
    .eq('slug', params.slug)
    .single()

  if (!data?.url) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#072E40]">
        Link no encontrado
      </div>
    )
  }

  redirect(data.url)
}