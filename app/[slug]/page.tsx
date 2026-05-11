import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default async function Page({
  params,
}: {
  params: { slug: string }
}) {

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