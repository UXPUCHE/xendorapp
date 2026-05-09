import CampaignForm from '@/app/pasajeclub/components/CampaignForm'

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return <CampaignForm slug={slug} />
}