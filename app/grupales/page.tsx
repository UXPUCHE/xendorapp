'use client'

import { useState, useEffect } from 'react'
import GrupalesGrid from '@/app/components/grupales/GrupalesGrid'
import FiltrosGrupales from '@/app/components/grupales/FiltrosGrupales'

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
  {
    slug: 'tailandia',
    titulo: 'Tailandia',
    fecha_inicio: '2027-01-05',
    fecha_fin: '2027-01-15',
    imagen: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    estado: 'activo',
    tipo: 'mixto',
    subtitulo: 'Bangkok + Phuket',
    precio_desde: 2100,
  },
  {
    slug: 'colombia',
    titulo: 'Colombia',
    fecha_inicio: '2026-11-10',
    fecha_fin: '2026-11-18',
    imagen: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad',
    estado: 'activo',
    tipo: 'mixto',
    subtitulo: 'Cartagena + Medellín',
    precio_desde: 1450,
  },
  {
    slug: 'grecia',
    titulo: 'Grecia',
    fecha_inicio: '2026-07-01',
    fecha_fin: '2026-07-12',
    imagen: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e',
    estado: 'activo',
    tipo: 'mujeres',
    subtitulo: 'Islas + Atenas',
    precio_desde: 2800,
  },
  {
    slug: 'japon',
    titulo: 'Japón',
    fecha_inicio: '2026-10-03',
    fecha_fin: '2026-10-14',
    imagen: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
    estado: 'activo',
    tipo: 'mixto',
    subtitulo: 'Tokio + Kyoto',
    precio_desde: 3200,
  },
  {
    slug: 'egipto',
    titulo: 'Egipto',
    fecha_inicio: '2026-09-15',
    fecha_fin: '2026-09-25',
    imagen: 'https://images.unsplash.com/photo-1539650116574-75c0c6d8e5a5',
    estado: 'activo',
    tipo: 'mixto',
    subtitulo: 'El Cairo + Crucero por el Nilo',
    precio_desde: 2500,
  },
]

export default function Page() {
  const filtros = [
    { label: 'Todos', value: 'all' },
    { label: 'Mujeres', value: 'mujeres' },
    { label: 'Mixtos', value: 'mixto' },
    { label: 'Proveedores', value: 'proveedor' },
  ]

  const [filtroActivo, setFiltroActivo] = useState('all')

  const dataFiltrada = mockData.filter((item) => {
    if (filtroActivo === 'all') return true
    if (filtroActivo === 'mujeres') return item.tipo === 'mujeres'
    if (filtroActivo === 'mixto') return item.tipo === 'mixto'
    if (filtroActivo === 'proveedor') return false
    return true
  })

useEffect(() => {
  const sendHeight = () => {
    // 🔥 hack: fuerza recalculo
    document.body.style.height = 'auto'

    const height = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    )

    window.parent.postMessage(
      {
        type: "resize",
        height
      },
      "*"
    )
  }

  const observer = new ResizeObserver(sendHeight)
  observer.observe(document.documentElement)

  // 🔥 clave: delay para capturar cambios de React
  const timeout = setTimeout(sendHeight, 100)

  return () => {
    observer.disconnect()
    clearTimeout(timeout)
  }
}, [])


  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <FiltrosGrupales
        filtros={filtros}
        activo={filtroActivo}
        onChange={setFiltroActivo}
      />

      <GrupalesGrid data={dataFiltrada} />
    </div>
  )
}