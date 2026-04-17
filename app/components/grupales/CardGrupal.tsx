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
    <div className="relative">
      <div
        onClick={handleClick}
        className={`w-full rounded-2xl overflow-hidden shadow-md cursor-pointer transition hover:shadow-xl ${
          isSoldOut ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {/* IMAGEN */}
        <div className="relative">
          <div className="h-[240px] w-full rounded-t-2xl overflow-hidden">
            <img
              src={data.imagen}
              alt={data.titulo}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/600x400?text=Pasaje+Club'
              }}
            />
          </div>

          {/* BADGE */}
          {data.tipo === 'mixto' && (
            <div className="absolute top-3 right-3 bg-[#0F3B4C] text-[#DBCB3A] text-xs px-3 py-1 rounded-full shadow-md">
              Grupal Mixto
            </div>
          )}
        </div>

        {/* CONTENIDO */}
        <div className="bg-white p-5 space-y-1">
          {/* FECHA */}
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            {formatFecha(data.fecha_inicio)} al {formatFecha(data.fecha_fin)}
          </p>

          {/* TITULO */}
          <h3 className="text-2xl font-semibold text-[#0F3B4C] leading-tight">
            {data.titulo}
          </h3>

          {/* SUBTITULO */}
          {data.subtitulo && (
            <p className="text-sm text-gray-500 uppercase tracking-normal">
              {data.subtitulo}
            </p>
          )}

          {/* PRECIO */}
          {data.precio_desde && (
            <div className="mt-2">
              <p className="text-sm text-gray-400">Desde</p>
              <p className="text-4xl font-bold tracking-tight text-[#0F3B4C]">
                USD {data.precio_desde}
              </p>
            </div>
          )}

          {/* CTA */}
          <button
            className={`w-full mt-4 py-2.5 rounded-full text-sm font-medium tracking-wide ${
              isSoldOut
                ? 'bg-gray-300 text-white'
                : `${color} text-white hover:opacity-90 transition`
            }`}
          >
            {isSoldOut ? 'SOLD OUT' : 'ME INTERESA'}
          </button>
        </div>
      </div>

      {data.tipo === 'mujeres' && (
        <div className="absolute top-[-10px] right-[-20px] w-[80px] h-[80px] rounded-full overflow-hidden shadow-lg border-4 border-white bg-white">
          <img
            src="/badge-mujeres.png"
            alt="Salida de mujeres"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  )
}