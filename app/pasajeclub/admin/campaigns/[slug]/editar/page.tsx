'use client'

import { useEffect, useState } from 'react'
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
    } catch (error) {
      console.error('Error updating order:', error)

      setCards(previousCards)

      alert('No se pudo actualizar el orden')
    }
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      '¿Eliminar esta oferta?'
    )

    if (!confirmed) return

    const previousCards = cards

    setCards((items) =>
      items.filter((item) => item.id !== id)
    )

    const { error } = await supabase
      .from('sale_cards')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(error)

      setCards(previousCards)

      alert('No se pudo eliminar la oferta')
    }
  }

  useEffect(() => {
    const fetchCards = async () => {
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
