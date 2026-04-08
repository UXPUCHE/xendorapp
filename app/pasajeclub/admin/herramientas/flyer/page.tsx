'use client'

import { useState } from 'react'
import FlyerPreview from '@/app/pasajeclub/components/FlyerPreview'

export default function FlyerBuilder() {

  const [data, setData] = useState<any>({
    destino: '',
    subtitulo: '',
    fechas: '',
    origen: 'Córdoba',

    features: {
      aereo: 'Aéreo desde Córdoba',
      traslados: 'Traslados incluidos',
      noches: '7 noches',
      asistencia: 'Asistencia al viajero'
    },

    tags: {
      equipaje: 'Incluye equipaje',
      regimen: 'All inclusive'
    },

    destacado: {
      etiqueta: '',
      hotel: '',
      precio_base: ''
    },

    vuelos: {
      ida: '',
      fecha_ida: '',
      vuelta: '',
      fecha_vuelta: ''
    },

    extras: []
  })

  const [extraInput, setExtraInput] = useState('')

  const update = (field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      [field]: value
    }))
  }

  const updateNested = (group: string, field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [field]: value
      }
    }))
  }

  const addExtra = () => {
    if (!extraInput.trim()) return

    setData((prev: any) => ({
      ...prev,
      extras: [...prev.extras, extraInput]
    }))

    setExtraInput('')
  }

  const removeExtra = (index: number) => {
    setData((prev: any) => ({
      ...prev,
      extras: prev.extras.filter((_: any, i: number) => i !== index)
    }))
  }

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-[#0F3B4C]">
          Generador de flyer 🎯
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Completá los datos y generá el flyer automáticamente
        </p>
      </div>

      {/* FORM */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-8">

        {/* INFO */}
        <div className="space-y-4">
          <h2 className="font-semibold text-[#0F3B4C]">Información</h2>

          <input placeholder="Destino" className="input"
            onChange={(e) => update('destino', e.target.value)} />

          <input placeholder="Subtítulo" className="input"
            onChange={(e) => update('subtitulo', e.target.value)} />

          <input placeholder="Fechas" className="input"
            onChange={(e) => update('fechas', e.target.value)} />
        </div>

        {/* FEATURES */}
        <div className="space-y-4">
          <h2 className="font-semibold text-[#0F3B4C]">Incluye</h2>

          <input className="input" placeholder="Aéreo"
            onChange={(e) => updateNested('features', 'aereo', e.target.value)} />

          <input className="input" placeholder="Traslados"
            onChange={(e) => updateNested('features', 'traslados', e.target.value)} />

          <input className="input" placeholder="Noches"
            onChange={(e) => updateNested('features', 'noches', e.target.value)} />

          <input className="input" placeholder="Asistencia"
            onChange={(e) => updateNested('features', 'asistencia', e.target.value)} />
        </div>

        {/* TAGS */}
        <div className="space-y-4">
          <h2 className="font-semibold text-[#0F3B4C]">Destacados</h2>

          <input className="input" placeholder="Equipaje"
            onChange={(e) => updateNested('tags', 'equipaje', e.target.value)} />

          <input className="input" placeholder="Régimen"
            onChange={(e) => updateNested('tags', 'regimen', e.target.value)} />
        </div>

        {/* PRECIO */}
        <div className="space-y-4">
          <h2 className="font-semibold text-[#0F3B4C]">Precio</h2>

          <input className="input" placeholder="Etiqueta"
            onChange={(e) => updateNested('destacado', 'etiqueta', e.target.value)} />

          <input className="input" placeholder="Hotel"
            onChange={(e) => updateNested('destacado', 'hotel', e.target.value)} />

          <input className="input" placeholder="Precio"
            onChange={(e) => updateNested('destacado', 'precio_base', e.target.value)} />
        </div>

        {/* VUELOS */}
        <div className="space-y-4">
          <h2 className="font-semibold text-[#0F3B4C]">Vuelos</h2>

          <input className="input" placeholder="Ida"
            onChange={(e) => updateNested('vuelos', 'ida', e.target.value)} />

          <input className="input" placeholder="Fecha ida"
            onChange={(e) => updateNested('vuelos', 'fecha_ida', e.target.value)} />

          <input className="input" placeholder="Vuelta"
            onChange={(e) => updateNested('vuelos', 'vuelta', e.target.value)} />

          <input className="input" placeholder="Fecha vuelta"
            onChange={(e) => updateNested('vuelos', 'fecha_vuelta', e.target.value)} />
        </div>

        {/* EXTRAS */}
        <div className="space-y-4">
          <h2 className="font-semibold text-[#0F3B4C]">Extras</h2>

          <div className="flex gap-2">
            <input
              value={extraInput}
              onChange={(e) => setExtraInput(e.target.value)}
              placeholder="Agregar extra"
              className="input flex-1"
            />

            <button
              onClick={addExtra}
              className="bg-[#0F3B4C] text-white px-4 rounded-xl"
            >
              +
            </button>
          </div>

          {data.extras.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.extras.map((e: string, i: number) => (
                <div key={i} className="bg-gray-100 px-3 py-1 rounded-full flex gap-2">
                  {e}
                  <button onClick={() => removeExtra(i)}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* PREVIEW + EXPORT WRAPPER */}
      <div className="pt-10 bg-[#e9eef2] py-10">

        <div className="w-full flex justify-center">

          <div id="flyer-export">
            <FlyerPreview data={data} />
          </div>

        </div>

      </div>

    </div>
  )
}