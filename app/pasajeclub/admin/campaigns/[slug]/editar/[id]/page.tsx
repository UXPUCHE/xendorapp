

import { supabase } from '@/lib/supabase'
import CampaignForm from '@/app/pasajeclub/components/CampaignForm'

export default async function CampaignEditItemPage({
  params,
}: {
  params: Promise<{
    slug: string
    id: string
  }>
}) {
  const { slug, id } = await params

  const { data } = await supabase
    .from('sale_cards')
    .select('*')
    .eq('id', id)
    .single()

  return (
    <CampaignForm
      slug={slug}
      initialData={data}
      isEdit
    />
  )
}