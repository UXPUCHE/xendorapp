'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface SaleCard {
  id: string
  titulo: string
  precio: string
  moneda: string
  badge: string
  imagen: string
  created_at?: string
}

export default function CampaignEditPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const [cards, setCards] = useState<SaleCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCards = async () => {
      const { slug } = await params

      const { data, error } = await supabase
        .from('sale_cards')
        .select('*')
        .eq('campaign', slug)
        .order('created_at', {
          ascending: false,
        })

      if (error) {
        console.error(error)
      } else {
        setCards(data || [])
      }

      setLoading(false)
    }

    fetchCards()
  }, [params])

  return (
    <div className="space-y-8">

      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-[#00A99D] mb-2">
          Campaigns
        </p>

        <h1 className="text-4xl font-semibold text-[#0F3B4C]">
          Editar ofertas
        </h1>
      </div>

      {loading ? (
        <p className="text-[#0F3B4C]">Cargando ofertas...</p>
      ) : cards.length === 0 ? (
        <div className="bg-white border rounded-2xl p-8 text-center">
          <p className="text-[#0F3B4C] text-lg font-medium">
            No hay ofertas creadas todavía.
          </p>
        </div>
      ) : (
        <div className="space-y-4">

          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-white border border-[#E8E8E5] rounded-3xl px-5 py-4 shadow-sm flex items-center justify-between gap-6"
            >

              <div className="flex items-center gap-5 min-w-0 flex-1">

                <div className="relative w-[110px] h-[80px] rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                  <img
                    src={card.imagen}
                    alt={card.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0">

                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h2 className="text-[#0A3149] text-[22px] font-bold leading-none truncate">
                      {card.titulo}
                    </h2>

                    <span className="bg-[#052F49] text-white text-[11px] px-3 py-1 rounded-full font-semibold uppercase tracking-wide">
                      {card.badge}
                    </span>
                  </div>

                  <p className="text-[#66737D] text-sm">
                    {card.moneda} {card.precio}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-3 shrink-0">

                <Link
                  href={`/pasajeclub/admin/campaigns/pasaje-sale/editar/${card.id}`}
                  className="bg-[#052F49] hover:bg-[#063854] text-white px-5 py-3 rounded-full font-semibold transition-all"
                >
                  Editar
                </Link>

                <button
                  className="bg-[#F3F5F7] hover:bg-[#E9EDF0] text-[#0A3149] px-5 py-3 rounded-full font-semibold transition-all"
                >
                  Duplicar
                </button>

                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-full font-semibold transition-all"
                >
                  Eliminar
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  )
}
