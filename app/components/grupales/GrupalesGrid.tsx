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

type Props = {
  data: Grupal[]
}

export default function GrupalesGrid({ data }: Props) {
  const sortedData = [...data].sort((a, b) => {
    // Primero: activos arriba, sold_out abajo
    if (a.estado === 'sold_out' && b.estado !== 'sold_out') return 1
    if (a.estado !== 'sold_out' && b.estado === 'sold_out') return -1

    // Segundo: ordenar por fecha (más cercano primero)
    const da = new Date(a.fecha_inicio).getTime()
    const db = new Date(b.fecha_inicio).getTime()
    return da - db
  })

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedData.map((item) => (
          <div
            key={item.slug}
            className="transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:scale-[1.02]"
          >
            <CardGrupal data={item} />
          </div>
        ))}
      </div>
    </div>
  )
}