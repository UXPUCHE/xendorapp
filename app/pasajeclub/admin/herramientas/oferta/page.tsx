'use client'

import { useState } from 'react'
import { parseOfertaTexto } from '@/lib/parserOferta'
import FlyerPreview from '@/app/pasajeclub/components/FlyerPreview'

export default function GeneradorOfertaPage() {

  const [input, setInput] = useState('')
  const [parsed, setParsed] = useState<any>(null)

  const handleParse = () => {
    const result = parseOfertaTexto(input)
    setParsed(result)
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-[#0F3B4C]">
          Generador de ofertas ✈️
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Pegá el texto y generá el diseño automáticamente
        </p>
      </div>

      {/* INPUT */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">

        <textarea
          placeholder="Pegá acá el texto de la agencia..."
          className="w-full h-60 border border-gray-200 rounded-xl p-4 text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={handleParse}
          className="w-full bg-[#0f3b4c] text-white py-3 rounded-xl"
        >
          Procesar oferta
        </button>

      </div>

      {/* FLYER */}
      {parsed && (
        <div className="pt-10 flex justify-center bg-[#e9eef2] py-10">

          <div className="bg-white p-10 rounded-3xl shadow-2xl">
            <FlyerPreview />
          </div>

        </div>
      )}

    </div>
  )
}