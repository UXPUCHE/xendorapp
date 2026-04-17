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

type Props = {
  data: Grupal
}

export default function CardGrupal({ data }: Props) {
  const router = useRouter()

  const handleClick = () => {
    if (data.estado !== 'sold_out') {
      router.push(`/grupales/${data.slug}`)
    }
  }

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer rounded-2xl overflow-hidden shadow-md"
    >
      <img
        src={data.imagen}
        alt={data.titulo}
        className="w-full h-[200px] object-cover"
      />

      <div className="p-4">
        <p className="text-xs text-gray-400">
          {data.fecha_inicio} - {data.fecha_fin}
        </p>

        <h3 className="text-lg font-semibold text-[#0F3B4C]">
          {data.titulo}
        </h3>
      </div>
    </div>
  )
}