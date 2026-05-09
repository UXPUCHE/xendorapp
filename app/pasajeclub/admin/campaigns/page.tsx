import Link from "next/link"

const campaigns = [
  {
    slug: "pasaje-sale",
    title: "Pasaje Sale",
    description: "Campaña de ofertas destacadas"
  }
]

export default function CampaignsPage() {
  return (
    <div className="p-8">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F3B4C]">
          Campañas
        </h1>

        <p className="text-gray-500 mt-2">
          Gestioná campañas reutilizables y sus ofertas.
        </p>
      </div>

      <div className="grid gap-4">
        {campaigns.map((campaign) => (
          <Link
            key={campaign.slug}
            href={`/pasajeclub/admin/campaigns/${campaign.slug}`}
            className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition block"
          >
            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-xl font-semibold text-[#0F3B4C]">
                  {campaign.title}
                </h2>

                <p className="text-gray-500 mt-1">
                  {campaign.description}
                </p>
              </div>

              <div className="text-3xl">
                📣
              </div>

            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}