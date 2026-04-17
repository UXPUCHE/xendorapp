'use client'

import { useState } from 'react'
import FiltrosGrupales from './FiltrosGrupales'
import GrupalesGrid from '@/app/components/grupales/GrupalesGrid'

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

export default function GrupalesPage() {
  const filtros = [
    { label: 'Todos', value: 'all' },
    { label: 'Mujeres', value: 'mujeres' },
    { label: 'Mixtos', value: 'mixto' },
    { label: 'Proveedores', value: 'proveedor' },
  ]

  const [filtroActivo, setFiltroActivo] = useState('all')

  const dataFiltrada = mockData.filter((item: any) => {
    if (filtroActivo === 'all') return true
    if (filtroActivo === 'mujeres') return item.tipo === 'mujeres'
    if (filtroActivo === 'mixto') return item.tipo === 'mixto'
    if (filtroActivo === 'proveedor') return false
    return true
  })

  return (
    <>
      <FiltrosGrupales
        filtros={filtros}
        activo={filtroActivo}
        onChange={setFiltroActivo}
      />

      <GrupalesGrid data={dataFiltrada} />
    </>
  )
}