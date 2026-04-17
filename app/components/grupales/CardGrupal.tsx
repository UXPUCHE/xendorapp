'use client'

import { useRouter } from 'next/navigation'

type Grupal = {
  slug: string
  titulo: string
  fecha_inicio: string
  fecha_fin: string
  imagen: string
  estado: 'activo' | 'sold_out'
  tipo: 'mujeres' | 'mixto'
  subtitulo?: string
  precio_desde?: number
}

export default function CardGrupal({ data }: { data: Grupal }) {
  const router = useRouter()

  const isSoldOut = data.estado === 'sold_out'

  const color =
    data.tipo === 'mujeres'
      ? 'bg-[#8B1E3F]'
      : 'bg-[#0F3B4C]'

  const handleClick = () => {
    if (!isSoldOut) {
      router.push(`/grupales/${data.slug}`)
    }
  }

  const formatFecha = (fecha: string) => {
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
    })
  }

  return (
    <div
      onClick={handleClick}
      className={`w-[280px] min-w-[280px] rounded-2xl overflow-hidden shadow-md cursor-pointer transition hover:shadow-xl ${
        isSoldOut ? 'opacity-70 cursor-not-allowed' : ''
      }`}
    >
      {/* IMAGEN */}
      <div className="relative h-[180px] w-full">
        <img
          src={data.imagen}
          alt={data.titulo}
          className="w-full h-full object-cover"
        />

        {/* BADGE */}
        <div
          className={`absolute bottom-3 right-3 text-white text-xs px-3 py-1 rounded-full ${color}`}
        >
          {data.tipo === 'mujeres' ? 'Solo mujeres' : 'Grupal'}
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="bg-white p-4 space-y-2">
        {/* FECHA */}
        <p className="text-xs text-gray-400 uppercase">
          {formatFecha(data.fecha_inicio)} - {formatFecha(data.fecha_fin)}
        </p>

        {/* TITULO */}
        <h3 className="text-lg font-semibold text-[#0F3B4C] leading-tight">
          {data.titulo}
        </h3>

        {/* SUBTITULO */}
        {data.subtitulo && (
          <p className="text-xs text-gray-500">
            {data.subtitulo}
          </p>
        )}

        {/* PRECIO */}
        {data.precio_desde && (
          <p className="text-sm font-semibold text-[#0F3B4C]">
            Desde USD {data.precio_desde}
          </p>
        )}

        {/* CTA */}
        <button
          className={`w-full mt-3 py-2 rounded-full text-sm font-semibold ${
            isSoldOut
              ? 'bg-gray-300 text-white'
              : `${color} text-white`
          }`}
        >
          {isSoldOut ? 'SOLD OUT' : 'Ver viaje'}
        </button>
      </div>
    </div>
  )
}