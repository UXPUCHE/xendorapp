'use client'

'use client'

import type { FC } from 'react'
import CardGrupal from './CardGrupal'

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
  data: Grupal[]
}

const Card: FC<{ data: Grupal }> = CardGrupal

export default function GrupalesGrid({ data }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {data.map((item) => (
        <Card key={item.slug} data={item} />
      ))}
    </div>
  )
}