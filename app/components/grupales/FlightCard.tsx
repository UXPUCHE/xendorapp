'use client'

import { getAirlineLogo } from '@/lib/airlines'

type Segment = {
  from: string
  to: string
  departure: string
  arrival: string
  duration: string
  airportFrom?: string
  airportTo?: string
}

type Flight = {
  tipo: 'IDA' | 'VUELTA'
  origen: string
  origenLabel: string
  destino: string
  destinoLabel: string
  escala?: string
  airline?: string
  duration?: string
  segments?: Segment[]
}

export default function FlightCard({ vuelo }: { vuelo: Flight }) {
  const logo = getAirlineLogo(vuelo.airline)

  return (
    <div className="group bg-white border border-[#0F3B4C] rounded-2xl p-6 shadow-[0_6px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-all duration-300">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {logo && (
            <img src={logo.src} className="h-8 shadow-sm" />
          )}
          <span className="text-gray-400 font-medium tracking-wide">
            {vuelo.tipo}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {vuelo.duration && (
            <span className="text-xs text-gray-400">
              {vuelo.duration}
            </span>
          )}

          {vuelo.escala && (
            <span className="text-sm bg-gray-100 px-4 py-1.5 rounded-full text-[#0F3B4C] font-medium">
              {vuelo.segments?.length ? `${(vuelo.segments?.length ?? 1) - 1} escala` : '1 escala'}
            </span>
          )}
        </div>
      </div>

      {/* ROUTE */}
      <div className="flex items-center justify-between">

        {/* ORIGEN */}
        <div>
          <p className="text-3xl font-bold tracking-tight">
            {vuelo.origen}
          </p>
          <p className="text-gray-400 text-sm">
            {vuelo.origenLabel}
          </p>
        </div>

      {/* LINEA TIMELINE PRO */}
      <div className="flex-1 mx-6">

        <div className="relative h-[1px] bg-gray-300 rounded-full overflow-visible">

          {/* progress line */}
          <div className="absolute left-0 top-0 h-full bg-[#0F3B4C] progress-line">
            <span className="absolute left-full top-1/2 -translate-y-1/2 text-3xl -translate-x-1/3">
              ✈
            </span>
          </div>

          {/* nodos (escalas reales) */}
          {(vuelo.segments?.length ?? 0) > 1 && (
            vuelo.segments!.map((_, i) => {
              // skip origen y destino
              if (i === 0 || i === (vuelo.segments?.length ?? 0) - 1) return null

              const total = (vuelo.segments?.length ?? 1) - 1
              const percent = total > 0 ? (i / total) * 100 : 0

              return (
                <span
                  key={i}
                  className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white border-2 border-[#0F3B4C] rounded-full"
                  style={{
                    left: `${percent}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              )
            })
          )}

        </div>

        {vuelo.escala && (
          <p className="text-sm text-gray-400 mt-2 text-center">
            {vuelo.escala}
          </p>
        )}

      </div>

        {/* DESTINO */}
        <div className="text-right">
          <p className="text-3xl font-bold tracking-tight">
            {vuelo.destino}
          </p>
          <p className="text-gray-400 text-sm">
            {vuelo.destinoLabel}
          </p>
        </div>

      </div>

      {/* SEGMENTS (multi vuelo) */}
      {(vuelo.segments?.length ?? 0) > 0 && (
          <div className="mt-10 border-t border-gray-200 pt-8 space-y-6">
          {vuelo.segments!.map((seg, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              {/* ORIGEN */}
              <div>
                <p className="font-semibold text-[#0F3B4C]">{seg.departure}</p>
                <p className="text-xs text-gray-400">{seg.from}</p>
              </div>

              {/* LINE */}
              <div className="text-center px-3">
                <p className="text-xs text-gray-400">{seg.duration}</p>
                <div className="w-12 h-[1px] bg-gray-300 mx-auto my-1 relative">
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px]">✈</span>
                </div>
              </div>

              {/* DESTINO */}
              <div className="text-right">
                <p className="font-semibold text-[#0F3B4C]">{seg.arrival}</p>
                <p className="text-xs text-gray-400">{seg.to}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FOOTER */}
      <p className="text-sm text-gray-500 mt-6">
        Equipaje incluido · Horarios a confirmar
      </p>

    </div>
  )
}