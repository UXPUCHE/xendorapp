'use client'

import Link from 'next/link'

import { CSS } from '@dnd-kit/utilities'

import {
  useSortable,
} from '@dnd-kit/sortable'

interface Card {
  id: string
  titulo: string
  badge: string
  imagen: string
  moneda?: string
  precio?: string
}

export default function SortableCard({
  card,
  onDelete,
}: {
  card: Card
  onDelete: (id: string) => void
}) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        bg-white border border-[#E8E8E5]
        rounded-3xl px-5 py-4 shadow-sm
        flex items-center justify-between gap-6
        transition-all duration-200 ease-out
        hover:border-[#D7DEE3] hover:shadow-lg
        ${isDragging ? 'opacity-95 shadow-2xl scale-[0.995] rotate-[0.2deg] border-[#22B8B5]' : ''}
      `}
    >

      <div className="flex items-center gap-5 min-w-0 flex-1">

        <button
          {...attributes}
          {...listeners}
          title="Arrastrar para reordenar"
          className="text-[#94A3AF] hover:text-[#0A3149] cursor-grab active:cursor-grabbing text-[26px] leading-none select-none shrink-0 transition-colors touch-action-none"
        >
          ☰
        </button>

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

      <div className="flex items-center gap-2 shrink-0 ml-6 border-l border-[#E8E8E5] pl-6">

        <Link
          href={`/pasajeclub/admin/campaigns/pasaje-sale/editar/${card.id}`}
          className="bg-[#052F49] hover:bg-[#063854] hover:scale-[1.02] active:scale-[0.98] text-white px-5 py-3 rounded-full font-semibold transition-all"
        >
          Editar
        </Link>

        <Link
          href={`/pasajeclub/admin/campaigns/pasaje-sale/crear?duplicate=${card.id}`}
          className="bg-[#F3F5F7] hover:bg-[#E9EDF0] hover:scale-[1.02] active:scale-[0.98] text-[#0A3149] px-5 py-3 rounded-full font-semibold transition-all"
        >
          Duplicar
        </Link>

        <button
          onClick={() => onDelete(card.id)}
          className="bg-red-50 hover:bg-red-100 hover:scale-[1.02] active:scale-[0.98] text-red-600 border border-red-200 px-5 py-3 rounded-full font-semibold transition-all"
        >
          Eliminar
        </button>

      </div>

    </div>
  )
}