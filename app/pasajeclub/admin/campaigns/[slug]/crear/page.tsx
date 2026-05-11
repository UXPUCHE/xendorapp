import CampaignForm from '@/app/pasajeclub/components/CampaignForm'
import { supabase } from '@/lib/supabase'

export default async function CampaignPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ duplicate?: string }>
}) {
  const { slug } = await params
  const { duplicate } = await searchParams

  let initialData = null

  if (duplicate) {
    const { data } = await supabase
      .from('sale_cards')
      .select('*')
      .eq('id', duplicate)
      .single()

    initialData = data
  }

  return (
    <CampaignForm
      slug={slug}
      initialData={initialData}
    />
  )
}