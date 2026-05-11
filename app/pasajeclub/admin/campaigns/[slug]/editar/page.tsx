'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'
import {
  DndContext,
  closestCenter,
  DragEndEvent,
} from '@dnd-kit/core'

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'

import { supabase } from '@/lib/supabase'
import SortableCard from '@/app/pasaje-sale/components/SortableCard'

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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = cards.findIndex(
      (item) => item.id === active.id
    )

    const newIndex = cards.findIndex(
      (item) => item.id === over.id
    )

    const previousCards = cards

    const reorderedCards = arrayMove(cards, oldIndex, newIndex)

    setCards(reorderedCards)

    try {
      const updates = reorderedCards.map((card, index) => {
        return supabase
          .from('sale_cards')
          .update({ orden: index + 1 })
          .eq('id', card.id)
      })

      await Promise.all(updates)

      toast.success('Orden actualizado')
    } catch (error) {
      console.error('Error updating order:', error)

      setCards(previousCards)

      toast.error('No se pudo actualizar el orden')
    }
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      '¿Eliminar esta oferta?'
    )

    if (!confirmed) return

    toast.loading('Eliminando oferta...', {
      id: 'delete-offer',
    })

    const previousCards = cards

    setCards((items) =>
      items.filter((item) => item.id !== id)
    )

    const { error } = await supabase
      .from('sale_cards')
      .delete()
      .eq('id', id)

    toast.success('Oferta eliminada', {
      id: 'delete-offer',
    })

    if (error) {
      console.error(error)

      setCards(previousCards)

      toast.error('No se pudo eliminar la oferta', {
        id: 'delete-offer',
      })
    }
  }

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true)
      const { slug } = await params

      const { data, error } = await supabase
        .from('sale_cards')
        .select('*')
        .eq('campaign', slug)
        .order('orden', {
          ascending: true,
          nullsFirst: false,
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

      <div className="flex items-center justify-between gap-6 flex-wrap">

        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#00A99D] mb-2">
            Campaigns
          </p>

          <h1 className="text-4xl font-semibold text-[#0F3B4C]">
            Editar ofertas
          </h1>
        </div>

        <Link
          href="/pasajeclub/admin/campaigns/pasaje-sale"
          className="flex items-center gap-3 bg-white border border-[#E8E8E5] hover:border-[#D7DEE3] hover:shadow-md text-[#0F3B4C] px-5 py-4 rounded-full font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="text-xl leading-none">←</span>
          Volver a campañas
        </Link>

      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white border border-[#E8E8E5] rounded-3xl px-5 py-4 h-[112px] animate-pulse"
            />
          ))}
        </div>
      ) : cards.length === 0 ? (
        <div className="bg-white border border-[#E8E8E5] rounded-3xl p-10 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-[#F3F5F7] flex items-center justify-center text-3xl mb-5">
            ✈️
          </div>
          <h2 className="text-[#0F3B4C] text-2xl font-semibold mb-2">
            Todavía no hay ofertas
          </h2>
          <p className="text-[#66737D] mb-6 max-w-md">
            Creá tu primera oferta para comenzar a mostrar paquetes en Pasaje Sale.
          </p>
          <Link
            href="/pasajeclub/admin/campaigns/pasaje-sale/crear"
            className="bg-[#052F49] hover:bg-[#063854] text-white px-6 py-4 rounded-full font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Crear primera oferta
          </Link>
        </div>
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >

          <SortableContext
            items={cards.map((card) => card.id)}
            strategy={verticalListSortingStrategy}
          >

            <div className="space-y-4">

              {cards.map((card) => (
              <SortableCard
                key={card.id}
                card={card}
                onDelete={handleDelete}
              />
              ))}

            </div>

          </SortableContext>

        </DndContext>
      )}

    </div>
  )
}
