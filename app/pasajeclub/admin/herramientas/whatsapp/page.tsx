'use client'

import { useState } from 'react'

export default function WhatsAppTool() {
  const [numero, setNumero] = useState('')
  const [destino, setDestino] = useState('')
  const [fechas, setFechas] = useState('')
  const [precio, setPrecio] = useState('')
  const [pax, setPax] = useState('')
  const [custom, setCustom] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [link, setLink] = useState('')

    const generar = () => {
    let texto = ''

    if (custom.trim()) {
        texto = `${custom}

    ✈️ Destino: ${destino}
    📅 Fechas: ${fechas}
    💰 Precio: ${precio}
    👥 ${pax}`
    } else {
        texto = `Hola! 👋 Me interesa esta propuesta:

    ✈️ Destino: ${destino}
    📅 Fechas: ${fechas}
    💰 Precio: ${precio}
    👥 ${pax}

    ¡Me gustaría más información!`
    }

    setMensaje(texto)

    const encoded = encodeURIComponent(texto)
    const cleanNumber = numero.replace(/\D/g, '')

    const url = cleanNumber
        ? `https://wa.me/${cleanNumber}?text=${encoded}`
        : `https://wa.me/?text=${encoded}`

    setLink(url)
    }
    
  return (
    <div className="grid grid-cols-2 gap-10 max-w-5xl">

      {/* LEFT */}
      <div className="space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-semibold text-[#0F3B4C]">
            Generador WhatsApp
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Generá mensajes listos para enviar
          </p>
        </div>

        {/* NUMERO */}
        <div className="space-y-2">
          <label className="text-xs text-gray-500">Número</label>
          <input
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            placeholder="Ej: 5493511234567"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 h-12 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f3b4c]/20"
          />
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 gap-4">

          <input
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            placeholder="Destino"
            className="bg-white border border-gray-200 rounded-xl px-4 h-12 text-sm text-gray-800 placeholder-gray-400"
          />

          <input
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            placeholder="Precio"
            className="bg-white border border-gray-200 rounded-xl px-4 h-12 text-sm text-gray-800 placeholder-gray-400"
          />

          <input
            value={fechas}
            onChange={(e) => setFechas(e.target.value)}
            placeholder="Fechas"
            className="bg-white border border-gray-200 rounded-xl px-4 h-12 text-sm text-gray-800 placeholder-gray-400"
          />

          <input
            value={pax}
            onChange={(e) => setPax(e.target.value)}
            placeholder="Pax"
            className="bg-white border border-gray-200 rounded-xl px-4 h-12 text-sm text-gray-800 placeholder-gray-400"
          />

        </div>

        {/* CUSTOM */}
        <div className="space-y-2">
          <label className="text-xs text-gray-500">
            Mensaje personalizado
          </label>
          <textarea
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="Ej: Me interesa esta propuesta"
            className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-800 placeholder-gray-400 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[#0f3b4c]/20"
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={generar}
          className="w-full bg-[#0f3b4c] text-white px-6 h-12 rounded-xl text-sm font-medium hover:opacity-90 transition"
        >
          Generar link
        </button>

        {/* LINK COPY */}
        {link && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Link generado</p>

            <div className="flex items-center gap-2">
              <input
                value={link}
                readOnly
                className="flex-1 bg-gray-100 border border-gray-200 rounded-lg px-3 h-10 text-xs text-gray-700"
              />

              <button
                onClick={() => navigator.clipboard.writeText(link)}
                className="px-3 h-10 bg-[#0f3b4c] text-white rounded-lg text-xs"
              >
                Copiar
              </button>
            </div>
          </div>
        )}

      </div>

      {/* RIGHT - PREVIEW */}
      <div className="bg-[#ECE5DD] rounded-2xl p-6 flex flex-col justify-end min-h-[420px]">

        {mensaje ? (
          <div className="bg-[#DCF8C6] text-sm text-gray-800 p-3 rounded-xl max-w-xs shadow self-end whitespace-pre-line">
            {mensaje}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center">
            Acá vas a ver el mensaje 👀
          </p>
        )}

      </div>

    </div>
  )
}