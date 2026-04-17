'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'

const mockData = [
  {
    slug: 'tanzania-zanzibar',
    titulo: 'Tanzania y Zanzíbar',
    fecha_inicio: '2026-06-08',
    fecha_fin: '2026-06-19',
    imagen: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e',
    estado: 'sold_out',
    tipo: 'mujeres',
    subtitulo: 'Con 6 safaris',
    precio_desde: 3200,
    descripcion: 'Un viaje increíble combinando safari y playas paradisíacas.',
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
    descripcion: 'Descubrí Perú a través de su gastronomía única.',
  },
]

export default function DetalleGrupal() {
  const params = useParams()
  const slug = params.slug as string

  // ✅ 🔥 RESIZE IGUAL QUE CONFIGURADOR
  useEffect(() => {
    const sendHeight = () => {
      const height = document.body.scrollHeight

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

    sendHeight()

    return () => observer.disconnect()
  }, [])

  const data = mockData.find((item) => item.slug === slug)

  if (!data) {
    return (
      <div className="p-10 text-center text-gray-400">
        No encontrado
      </div>
    )
  }

  const formatFecha = (fecha: string) => {
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
    })
  }

  return (
    <div className="bg-white">

      {/* HERO */}
      <div className="relative h-[300px] md:h-[400px]">
        <img
          src={data.imagen}
          alt={data.titulo}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="p-6 text-white">
            <h1 className="text-3xl md:text-5xl font-bold">
              {data.titulo}
            </h1>

            <p className="text-sm mt-2">
              {formatFecha(data.fecha_inicio)} - {formatFecha(data.fecha_fin)}
            </p>
          </div>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">

        {data.subtitulo && (
          <p className="text-lg text-gray-600">
            {data.subtitulo}
          </p>
        )}

        {data.precio_desde && (
          <p className="text-2xl font-semibold text-[#0F3B4C]">
            Desde USD {data.precio_desde}
          </p>
        )}

        <p className="text-gray-600 leading-relaxed">
          {data.descripcion}
        </p>

        <button className="mt-6 bg-[#0F3B4C] text-white px-6 py-3 rounded-full font-semibold">
          Consultar por WhatsApp
        </button>

      </div>
    </div>
  )
}