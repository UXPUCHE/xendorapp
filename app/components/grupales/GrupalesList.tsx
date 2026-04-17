'use client'

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

export default function GrupalesList({ data }: { data: Grupal[] }) {
  return (
    <div className="w-full">
      
      {/* CONTENEDOR SCROLL */}
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
        
        {data.map((item) => (
          <div key={item.slug} className="snap-start">
            <CardGrupal data={item} />
          </div>
        ))}

      </div>
    </div>
  )
}