'use client'

import { useEffect, useState } from 'react'
import { supabase } from "@/lib/supabase";
import PasajeSaleCard from './components/PasajeSaleCard'

export default function PasajeSalePage() {

  const [paquetes, setPaquetes] = useState<any[]>([])

  useEffect(() => {

    const fetchData = async () => {
      const { data } = await supabase
        .from("sale_cards")
        .select("*")
        .eq("activo", true)
        .order("orden", { ascending: true })

      setPaquetes(data || [])
    }

    fetchData()

  }, [])

  useEffect(() => {
    document.body.style.background = 'transparent'
    document.documentElement.style.background = 'transparent'
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

    return () => {
      observer.disconnect()
      document.body.style.background = '#ffffff'
      document.documentElement.style.background = '#ffffff'
    }
  }, [])

  return (
   <main className="w-full py-16 bg-transparent">
      <div className="w-full px-4 md:px-6 xl:px-8 bg-transparent">

        {/* Header */}
        <div className="mb-16 flex flex-col items-center text-center">

          <img
            src="https://pasajeclub.com/wp-content/uploads/2026/05/pasajesale-logo.png"
            alt="Pasaje Sale"
            className="h-20 md:h-24 w-auto mb-6 object-contain"
          />

          <h1 className="text-[#072E40] text-4xl md:text-6xl font-bold max-w-5xl leading-[0.95] tracking-[-0.04em]">
            Ofertas exclusivas para viajar este 2026
          </h1>

        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {paquetes?.map((item) => (
            <PasajeSaleCard
              key={item.id}
              titulo={item.titulo}
              subtitulo={item.subtitulo}
              precio={item.precio}
              moneda={item.moneda}
              badge={item.badge}
              imagen={item.imagen}
              whatsapp={item.whatsapp}
              salida={item.salida}
              noches={item.noches}
              base={item.base}
              incluye={item.incluye}
              precioDetalle={item.precio_detalle}
            />
          ))}
        </div>

      </div>
    </main>
  );
}