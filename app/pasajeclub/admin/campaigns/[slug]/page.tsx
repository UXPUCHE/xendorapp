import Link from "next/link"

type Props = {
  params: Promise<{
    slug: string
  }>
}

export default async function CampaignPage({ params }: Props) {
  const { slug } = await params

  return (
    <div className="p-8">

      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-[#00A99D]">
          Campaign
        </p>

        <h1 className="text-4xl font-bold text-[#0F3B4C] mt-2">
          {slug}
        </h1>
      </div>

      <div className="grid md:grid-cols-2 gap-4">

        <Link
          href={`/pasajeclub/admin/campaigns/${slug}/crear`}
          className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition"
        >
          <div className="text-4xl mb-4">➕</div>

          <h2 className="text-xl font-semibold text-[#0F3B4C]">
            Crear oferta
          </h2>

          <p className="text-gray-500 mt-2">
            Agregá nuevas ofertas a esta campaña.
          </p>
        </Link>

        <Link
          href={`/pasajeclub/admin/campaigns/${slug}/editar`}
          className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition"
        >
          <div className="text-4xl mb-4">✏️</div>

          <h2 className="text-xl font-semibold text-[#0F3B4C]">
            Editar ofertas
          </h2>

          <p className="text-gray-500 mt-2">
            Modificá las ofertas existentes.
          </p>
        </Link>

      </div>
    </div>
  )
}