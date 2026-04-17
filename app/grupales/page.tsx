import GrupalesList from '@/app/components/grupales/GrupalesList'

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

const mockData: Grupal[] = [
  {
    slug: 'tanzania-zanzibar',
    titulo: 'Tanzania y Zanzíbar',
    fecha_inicio: '2026-06-08',
    fecha_fin: '2026-06-19',
    imagen: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e',
    estado: 'sold_out',
    tipo: 'mujeres',
    subtitulo: 'Con 6 safaris',
  },
  {
    slug: 'marruecos',
    titulo: 'Marruecos',
    fecha_inicio: '2026-09-10',
    fecha_fin: '2026-09-20',
    imagen: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
    estado: 'activo',
    tipo: 'mujeres',
    subtitulo: '+ stopover en Madrid',
  },
  {
    slug: 'peru-gastronomico',
    titulo: 'Perú Gastronómico',
    fecha_inicio: '2026-08-06',
    fecha_fin: '2026-08-10',
    imagen: 'https://images.unsplash.com/photo-1526406915894-7bcd65f60845',
    estado: 'activo',
    tipo: 'mixto',
    subtitulo: 'Acompañado por Ale',
    precio_desde: 1890,
  },
]

export default function Page() {
  return (
    <div className="px-4 py-10 space-y-6">
      <h1 className="text-3xl font-semibold text-[#0F3B4C]">
        Grupales pasajeclub
      </h1>

      <GrupalesList data={mockData} />
    </div>
  )
}