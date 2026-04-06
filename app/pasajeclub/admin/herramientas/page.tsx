'use client'

import { useRouter } from 'next/navigation'

const tools = [
  {
    title: 'Generador WhatsApp',
    description: 'Links listos para enviar',
    path: '/admin/herramientas/whatsapp',
  },
  {
    title: 'Convertidor PNR',
    description: 'Extraer de manera automática los PNR',
    path: '/admin/herramientas/pnr',
  },
  {
    title: 'Editor de imágenes',
    description: 'Recorte rápido',
    path: '/admin/herramientas/recortar',
  },
]

export default function HerramientasPage() {
  const router = useRouter()

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-[#0F3B4C]">
          Herramientas
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Acelerá tu flujo de ventas
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-3 gap-6">

        {tools.map((tool) => (
          <div
            key={tool.path}
            onClick={() => router.push(tool.path)}
            className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-[2px] transition cursor-pointer"
          >
            <h3 className="font-medium text-[#0F3B4C]">
              {tool.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {tool.description}
            </p>
          </div>
        ))}

      </div>

    </div>
  )
}