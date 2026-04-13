'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { AIRLINES, getAirlineLogo } from '@/lib/airlines'


type HomeProps = {
  destino: string
  overrideOfertas?: Oferta[]
}

interface Tramo {
  tipo: 'ida' | 'vuelta'
  origen: string
  destino: string
}

interface Vuelos {
  tramos: Tramo[]
  clase?: string
  equipaje?: string
  aerolinea?: string
  escalas?: string
}

interface Servicios {
  transporte?: string
  asistencia?: string
  otros?: string
}

interface Oferta {
  external_id: string
  destino: string
  hotel: string
  fecha_in: string
  fecha_out: string
  precio: number
  pax: string
  regimen?: string
  status: string
  badge?: string
  imagen?: string
  vuelos: Vuelos | string
  servicios?: Servicios
  estrellas?: number
}

interface Fecha {
  fecha_inicio: string
  fecha_fin: string
}

// ... todo tu código igual arriba

export default function Home({
  destino,
  overrideOfertas,
}: HomeProps) {


  const [ofertas, setOfertas] = useState<Oferta[]>([])
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Fecha | null>(null)
  const [hotelSeleccionado, setHotelSeleccionado] = useState<Oferta | null>(null)
  const [tipoPlanSeleccionado, setTipoPlanSeleccionado] = useState('Base doble')

  // ✅ ÚNICO useEffect de resize (EL BUENO)
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
    



  // ⛔ ELIMINÁ COMPLETAMENTE el otro useEffect duplicado

  useEffect(() => {
    if (overrideOfertas) {
      setOfertas(overrideOfertas)

      if (overrideOfertas.length) {
        const primera = overrideOfertas[0]
        setFechaSeleccionada({
          fecha_inicio: primera.fecha_in,
          fecha_fin: primera.fecha_out,
        })
        setTipoPlanSeleccionado(primera.pax)
      }

      return
    }

    const fetchData = async () => {
      const { data } = await supabase
        .from('ofertas')
        .select('external_id, destino, hotel, fecha_in, fecha_out, precio, pax, regimen, status, badge, imagen, vuelos, servicios, estrellas')
        .eq('status', 'publicado')

      const normalizar = (str: string) =>
        str
          ?.toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/\s+/g, '-')
          .trim()

      const ofertasFiltradas = ((data as Oferta[]) || []).filter(
        (o) =>
          normalizar(o.destino) === normalizar(destino || '')
      )

      setOfertas(ofertasFiltradas)

      if (ofertasFiltradas.length) {
        const primeraFecha = ofertasFiltradas[0]
        setFechaSeleccionada({
          fecha_inicio: primeraFecha.fecha_in,
          fecha_fin: primeraFecha.fecha_out,
        })
        setTipoPlanSeleccionado(primeraFecha.pax)
      }
    }

    fetchData()
  }, [destino, overrideOfertas])

    const ofertasFiltradas = ofertas.filter(
    (o) =>
      fechaSeleccionada &&
      o.fecha_in?.slice(0, 10) === fechaSeleccionada.fecha_inicio?.slice(0, 10) &&
      o.fecha_out?.slice(0, 10) === fechaSeleccionada.fecha_fin?.slice(0, 10) &&
      o.pax?.toLowerCase() === tipoPlanSeleccionado.toLowerCase()
  )

useEffect(() => {
  let precio = null

  if (hotelSeleccionado) {
    precio = hotelSeleccionado.precio
  } else if (ofertasFiltradas.length > 0) {
    precio = ofertasFiltradas[0].precio
  }

  if (!precio) return

  const ofertaActiva = hotelSeleccionado || ofertasFiltradas[0] || null
  const urgency = ofertaActiva ? getUrgency(ofertaActiva) : null

window.parent.postMessage(
  {
    type: "price_update",
    payload: {
      precio,
      hotel: hotelSeleccionado?.hotel || ofertasFiltradas[0]?.hotel,
      plan: tipoPlanSeleccionado,
      destino: formatDestino(hotelSeleccionado?.destino || ofertasFiltradas[0]?.destino),
      fecha: `${formatFecha(fechaSeleccionada?.fecha_inicio || '')} al ${formatFecha(fechaSeleccionada?.fecha_fin || '')}`,
      urgency
    }
  },
  "*"
)

}, [hotelSeleccionado, ofertasFiltradas, tipoPlanSeleccionado])


  const fechas: Fecha[] = Array.from(
    new Map(
      ofertas.map((o) => [
        `${o.fecha_in}-${o.fecha_out}`,
        { fecha_inicio: o.fecha_in, fecha_fin: o.fecha_out },
      ])
    ).values()
  )

  const getPlanesPorFecha = (): string[] => {
    return ofertas
      .filter(
        (o) =>
          fechaSeleccionada &&
          o.fecha_in?.slice(0, 10) === fechaSeleccionada.fecha_inicio?.slice(0, 10) &&
          o.fecha_out?.slice(0, 10) === fechaSeleccionada.fecha_fin?.slice(0, 10)
      )
      .map((o) => o.pax)
  }

  const getPlanesGlobales = (): string[] => {
    const planes = ofertas.map((o) => o.pax)
    return [...new Set(planes)]
  }


  const preciosValidos = ofertasFiltradas
    .map((o) => o.precio)
    .filter((p) => typeof p === 'number')
    

  const minPrecio = preciosValidos.length ? Math.min(...preciosValidos) : 0

  const getPriority = (o: Oferta) => {
    const badge = o.badge?.toLowerCase() || ''

    if (badge.includes('recomendado')) return 1
    if (badge.includes('mejor oferta')) return 2
    if (badge.includes('últimos')) return 3
    if (badge.includes('descuento')) return 4
    if (o.precio === minPrecio) return 5

    return 6
  }

    const getBadges = (oferta: Oferta | null): { text: string; style: string }[] => {
      if (!oferta) return []

      const badges: { text: string; style: string }[] = []
      const badge = oferta.badge?.trim().toLowerCase()

      /* =========================
        🧠 BADGES MANUALES
      ========================= */

      if (badge) {
        if (badge.includes('recomendado')) {
          badges.push({ text: '⭐ Recomendado', style: 'bg-[#0F3B4C]/90 text-white' })
        }

        if (badge.includes('mejor oferta')) {
          badges.push({ text: '💸 Mejor oferta', style: 'bg-[#00A99D]/90 text-white' })
        }

        if (badge.includes('últimos')) {
          badges.push({ text: '🔥 Últimos cupos', style: 'bg-red-500/90 text-white' })
        }

        if (badge.includes('descuento')) {
          badges.push({ text: '🏷️ Descuento', style: 'bg-yellow-400/90 text-[#0F3B4C]' })
        }
      }

      /* =========================
        💰 BADGE AUTOMÁTICO
      ========================= */

      if (oferta.precio != null && preciosValidos.length) {
        if (oferta.precio === minPrecio) {
          badges.push({
            text: '💰 Más barato',
            style: 'bg-blue-100 text-blue-700'
          })
        }
      }

      return badges
    }

  const getCardStyle = (badge: { text: string } | null) => {
    if (!badge) return ''

    if (badge.text.includes('Recomendado')) {
      return 'ring-2 ring-[#0F3B4C]/30 bg-[#0F3B4C]/5'
    }

    if (badge.text.includes('Mejor oferta')) {
      return 'ring-2 ring-[#00A99D]/40 bg-[#00A99D]/5'
    }

    if (badge.text.includes('Últimos')) {
      return 'ring-2 ring-red-400 bg-red-50'
    }

    if (badge.text.includes('Descuento')) {
      return 'ring-2 ring-yellow-300 bg-yellow-50'
    }

    if (badge?.text === '💰 Más barato'){
      return 'ring-2 ring-blue-200'
    }

    return ''
  }

  const getUrgency = (oferta: Oferta | null): string | null => {
    if (!oferta || !preciosValidos.length) return null
    const preciosOrdenados = [...new Set(preciosValidos)].sort((a, b) => a - b)
    const index = preciosOrdenados.indexOf(oferta.precio)
    if (index === 0) return '💸 Mejor precio disponible'
    if (index === 1) return '⚡ Se está reservando rápido'
    if (index === 2) return '🔥 Alta demanda en esta fecha'
    return null
  }

  const getNoches = (inicio: string, fin: string): number => {
    const start = new Date(inicio)
    const end = new Date(fin)
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  }


  const parsearVuelos = (vuelos: Vuelos | string | null | undefined): Vuelos | null => {
    if (!vuelos) return null
    try {
      return typeof vuelos === 'string' ? (JSON.parse(vuelos) as Vuelos) : vuelos
    } catch {
      return null
    }
  }
  
    const formatFecha = (fecha: string) => {
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long'
    })
  }

    const formatDestino = (destino: string) => {
      return destino
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase())
    }

const getDetalles = (oferta: Oferta | null) => {
  if (!oferta) return null

  const vuelosParsed = parsearVuelos(oferta.vuelos)
  const tramos = vuelosParsed?.tramos || []
  const servicios = oferta.servicios || {}

  const idaTramos = tramos.filter(t => t.tipo === 'ida')
  const vueltaTramos = tramos.filter(t => t.tipo === 'vuelta')

  const getEscalaSimple = (text: string | null | undefined, segmentos: any[]) => {
    if (text) {
      const t = text.toLowerCase()

      if (t.includes('1')) return '1 escala'
      if (t.includes('2')) return '2 escalas'

      return '1 escala' // fallback si dice "Lima" por ejemplo
    }

    const escalas = segmentos.length - 1

    if (escalas <= 0) return 'Directo'
    if (escalas === 1) return '1 escala'
    return `${escalas} escalas`
  }

  return {
    vuelo: tramos.length
      ? {
          ida: `${idaTramos[0]?.origen} → ${idaTramos[idaTramos.length - 1]?.destino}`,
          vuelta: `${vueltaTramos[0]?.origen} → ${vueltaTramos[vueltaTramos.length - 1]?.destino}`,
          idaInfo: getEscalaSimple(vuelosParsed?.escalas, idaTramos),
          vueltaInfo: getEscalaSimple(vuelosParsed?.escalas, vueltaTramos),
        }
      : null,

    clase: vuelosParsed?.clase || null,
    equipaje: vuelosParsed?.equipaje || null,
    aerolinea: vuelosParsed?.aerolinea || null,
    escalas: vuelosParsed?.escalas || null,
    transporte: servicios?.transporte || 'Traslado ida y vuelta',
    asistencia: servicios?.asistencia || 'Asistencia incluida',
    otros: servicios?.otros || 'Post-venta',
  }

}

return (
  <div className="react-container bg-[#FFFFFF] py-6 mx-auto px-4 md:px-8 lg:px-10">
       
        {/* FECHAS */}
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-[#0F3B4C]">Elegí tu fecha</h2>
        <div className="flex gap-2 mb-8 flex-wrap md:gap-3 md:mb-10">
          {fechas.map((f, i) => (
            <button
              key={i}
              onClick={() => {
                setFechaSeleccionada(f)
                setHotelSeleccionado(null)
                const planesDisponibles = ofertas
                  .filter(
                    (o) =>
                      o.fecha_in?.slice(0, 10) === f.fecha_inicio?.slice(0, 10) &&
                      o.fecha_out?.slice(0, 10) === f.fecha_fin?.slice(0, 10)
                  )
                  .map((o) => o.pax)
                if (!planesDisponibles.includes(tipoPlanSeleccionado)) {
                  setTipoPlanSeleccionado(planesDisponibles[0])
                }
              }}
              className={`px-4 py-2 md:px-5 md:py-2 text-xs md:text-sm rounded-full font-medium transition ${
                fechaSeleccionada?.fecha_inicio === f.fecha_inicio
                  ? 'bg-[#0f3b4c] text-white shadow-md'
                  : 'bg-white border border-gray-200 text-[#0F3B4C]'
              }`}
            >
              {`Salida del ${new Date(f.fecha_inicio + 'T00:00:00').getDate()} al ${new Date(f.fecha_fin + 'T00:00:00').getDate()} de ${new Date(f.fecha_fin).toLocaleString('es-AR', { month: 'long' })}`}
            </button>
          ))}
        </div>

        {/* TIPO DE PLAN */}
        {getPlanesGlobales().length > 1 && (
          <>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-[#0F3B4C]">Tipo de plan</h2>
            <div className="flex gap-2 mb-8 flex-wrap md:gap-3 md:mb-10">
              {getPlanesGlobales().map((plan) => {
                const planesDisponibles = getPlanesPorFecha()
                const disabled = !planesDisponibles.includes(plan)
                return (
                  <button
                    key={plan}
                    disabled={disabled}
                    onClick={() => setTipoPlanSeleccionado(plan)}
                    className={`px-4 py-2 md:px-5 md:py-2 text-xs md:text-sm rounded-full font-medium transition ${
                      tipoPlanSeleccionado === plan
                        ? 'bg-[#0f3b4c] text-white shadow-md'
                        : 'bg-white border border-gray-200 text-[#0F3B4C]'
                    } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
                  >
                    {plan}
                  </button>
                )
              })}
            </div>
          </>
        )}

        {/* HOTELES */}
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-[#0F3B4C]">Elegí tu hotel</h2>

        {ofertasFiltradas.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            No hay opciones disponibles para este plan en esta fecha.
          </div>
        ) : (
          <div className="grid gap-5">
            {[...ofertasFiltradas]
              .sort((a, b) => {
                // 1. Estrellas primero (desc)
                const estrellasDiff = (b.estrellas || 0) - (a.estrellas || 0)
                if (estrellasDiff !== 0) return estrellasDiff

                // 2. Precio después (asc)
                return a.precio - b.precio
              })
              .map((oferta) => {
                const isSelected = hotelSeleccionado?.hotel === oferta.hotel
                const badges = getBadges(oferta)
                const mainBadge = badges[0] || null
                const urgency = getUrgency(oferta)
                const isBestPrice = oferta.precio === minPrecio

                return (
                  
                <div
                  key={oferta.external_id}
                  onClick={() => setHotelSeleccionado(oferta)}
                  className={`group cursor-pointer bg-white rounded-2xl overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                  flex flex-col md:flex-row ${
                    isSelected
                      ? 'ring-1 ring-[#0F3B4C]/20 shadow-xl'
                      : 'shadow-[0_8px_25px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.12)]'
                  }`}
                >
                    <div className="relative w-full h-44 md:w-[260px] md:h-auto flex-shrink-0 overflow-hidden">
                    {isSelected && (
                      <div className="absolute top-3 right-3 bg-[#dbcb3a] text-[#072e40] text-xs px-3 py-1 rounded-full shadow-lg border border-white/30 md:hidden">
                        ✓ Seleccionado
                    </div>
                  )}
                      <img
                        src={oferta.imagen?.trim() || 'https://placehold.co/100x100'}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/100x100'
                        }}
                        className="w-full h-full object-cover"
                        alt={oferta.hotel}
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between p-4 md:py-6">
                    <div className="flex flex-wrap items-center gap-2 mb-2">

                    {badges.map((badge, i) => (
                      <span
                        key={i}
                        className={`inline-block text-xs px-3 py-1 rounded-full font-semibold ${badge.style}`}
                      >
                        {badge.text}
                      </span>
                    ))}

                    {urgency && (
                      <span className="text-sm text-[#00A99D] font-medium">
                        {urgency}
                      </span>
                    )}

                  </div>
                      <h3 className="text-lg md:text-2xl font-semibold text-[#0F3B4C]">{oferta.hotel}</h3>
                      <p className="text-sm md:text-base text-gray-500 mt-0">
                        {getNoches(oferta.fecha_in, oferta.fecha_out)} noches · {oferta.regimen || 'All inclusive'}
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="text-yellow-400">
                          {'★'.repeat(oferta.estrellas || 3)}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {['Vuelo', 'Hotel', 'Traslados', 'Asistencia'].map((item) => (
                          <span key={item} className="text-xs px-3 py-1 rounded-full bg-[#E8F7F6] text-[#0F3B4C]">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end md:text-right justify-center p-4 md:pr-6">
                      <p className="text-base text-gray-500 mb-0 leading-none">Desde</p>
                      <p className="text-3xl md:text-4xl font-bold text-[#0F3B4C] tracking-[-0.02em]">
                        USD {oferta.precio}
                      </p>
                      <p className="text-base text-gray-500">
                        Por persona en {tipoPlanSeleccionado.toLowerCase()}
                      </p>
                      {isSelected && (
                        <span className="text-xs text-[#00A99D] hidden md:block">
                          ✓ Seleccionado
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
          </div>
        )}


        {/* DETALLE DEL HOTEL SELECCIONADO */}
        {hotelSeleccionado && (() => {
          const detalles = getDetalles(hotelSeleccionado)


          return (
            <div className="mt-10 bg-white rounded-2xl border border-gray-100 p-6 space-y-6">

{/* ITINERARIO DE VUELO */}
{detalles?.vuelo && (
  <div>
    <p className="text-2xl md:text-3xl font-semibold text-[#0F3B4C] mb-8">Itinerario de vuelo</p>

    <div className="space-y-4">

      {/* IDA */}
        <div className="border rounded-2xl px-5 py-4 bg-gray-50">

          {/* LABEL */}
          <div className="flex items-center gap-3 mb-3">
            <p className="text-base font-semibold text-[#0F6E56]">IDA</p>

            {detalles?.aerolinea && (() => {
              const airline = AIRLINES.find(a => a.code === detalles.aerolinea)
              const logo = getAirlineLogo(detalles.aerolinea)

              return (
                <div className="flex items-center gap-2 text-base text-gray-500 leading-none">
                  <span className="text-gray-300">•</span>

                  {logo && (
                    <img
                       src={logo.src}
                      className="h-5 object-contain"
                      alt={airline?.name || 'Aerolínea'}
                    />
                  )}

                  <span>{airline?.name || detalles.aerolinea}</span>
                </div>
              )
            })()}
          </div>
          {/* ROW */}
          <div className="flex items-center w-full h-[40px]">

            {/* ORIGEN */}
          <div className="flex items-center gap-3 w-[80px]">
            <p className="text-2xl md:text-3xl font-bold text-[#0F3B4C] leading-none translate-y-[1px]">
              {detalles.vuelo.ida.split(' → ')[0]}
            </p>
            <div className="w-2 h-2 bg-[#0F6E56] rounded-full" />
          </div>

            {/* LINEA */}
              <div className="flex-1 px-4">

                {/* LINEA PERFECTAMENTE CENTRADA */}
                <div className="flex items-center w-full gap-2 relative top-[12px]">
                  <div className="flex-1 h-px bg-gray-400" />
                  <span className="text-gray-400 text-sm">✈</span>
                  <div className="flex-1 h-px bg-gray-400" />
                </div>

                {/* TEXTO FUERA DEL FLOW */}
                <p className="text-base text-gray-600 mt-2 text-center">
                  {detalles.vuelo.idaInfo}
                </p>

              </div>

            {/* DESTINO */}
            <div className="flex items-center gap-3 justify-end w-[80px]">
              <div className="w-2 h-2 bg-[#0F6E56] rounded-full" />
              <p className="text-2xl md:text-3xl font-bold text-[#0F3B4C] leading-none translate-y-[1px]">
                {detalles.vuelo.ida.split(' → ')[1]}
              </p>
            </div>

          </div>

          {/* TAGS */}
            <div className="flex gap-2 mt-4">
              <span className="text-sm px-3 py-1 rounded-full bg-[#E6F1FB] text-[#185FA5]">
                {detalles.vuelo.vueltaInfo}
              </span>

              {detalles?.clase && (
                <span className="text-xs px-3 py-1 rounded-full border text-gray-500">
                  {detalles.clase}
                </span>
              )}

              {detalles?.equipaje && (
                <span className="text-xs px-3 py-1 rounded-full border text-gray-500">
                  {detalles?.equipaje === 'mochila' && '🎒 Mochila'}
                  {detalles?.equipaje === 'carry' && '👜 Carry + mochila'}
                  {detalles?.equipaje === 'bodega' && '🧳 Equipaje en bodega'}
                </span>
              )}

            </div>
        </div>

      {/* VUELTA */}
        <div className="border rounded-2xl px-5 py-4 bg-gray-50">

          {/* LABEL */}
          <div className="flex items-center gap-3 mb-3">
            <p className="text-base font-semibold text-[#0F6E56]">VUELTA</p>

            {detalles?.aerolinea && (() => {
              const airline = AIRLINES.find(a => a.code === detalles.aerolinea)
              const logo = getAirlineLogo(detalles.aerolinea)
              
              

              return (
                <div className="flex items-center gap-2 text-base text-gray-500 leading-none">
                  <span className="text-gray-300">•</span>

                {logo && (
                  <img
                    src={logo.src}
                    className="h-5 object-contain"
                    alt="Aerolínea"
                  />
                )}

                  <span>{airline?.name || detalles.aerolinea}</span>
                </div>
              )
            })()}
          </div>

          {/* ROW */}
              <div className="flex items-center w-full h-[40px]">

                {/* ORIGEN */}
                <div className="flex items-center gap-3 w-[80px]">
                  <p className="text-2xl md:text-3xl font-bold text-[#0F3B4C] leading-none translate-y-[1px]">
                    {detalles.vuelo.vuelta.split(' → ')[0]}
                  </p>
                  <div className="w-2 h-2 bg-[#185FA5] rounded-full" />
                </div>

                {/* LINEA */}
                  <div className="flex-1 px-4">

                    {/* LINEA PERFECTAMENTE CENTRADA */}
                    <div className="flex items-center w-full gap-2 relative top-[12px]">
                      <div className="flex-1 h-px bg-gray-400" />
                      <span className="text-gray-400 text-sm">✈</span>
                      <div className="flex-1 h-px bg-gray-400" />
                    </div>

                    {/* TEXTO FUERA DEL FLOW */}
                    <p className="text-base text-gray-600 mt-2 text-center">
                      {detalles.vuelo.idaInfo /* o vueltaInfo */}
                    </p>

                  </div>

                {/* DESTINO */}
                <div className="flex items-center gap-3 justify-end w-[80px]">
                  <div className="w-2 h-2 bg-[#185FA5] rounded-full" />
                  <p className="text-2xl md:text-3xl font-bold text-[#0F3B4C] leading-none translate-y-[1px]">
                    {detalles.vuelo.vuelta.split(' → ')[1]}
                  </p>
                </div>

              </div>
          {/* TAGS */}
          <div className="flex gap-2 mt-4">
            <span className="text-sm px-3 py-1 rounded-full bg-[#E6F1FB] text-[#185FA5]">
              {detalles.vuelo.idaInfo}
            </span>

            {detalles?.clase && (
              <span className="text-xs px-3 py-1 rounded-full border text-gray-500">
                {detalles.clase}
              </span>
            )}

            {detalles?.equipaje && (
              <span className="text-xs px-3 py-1 rounded-full border text-gray-500">
                  {detalles?.equipaje === 'mochila' && '🎒 Mochila'}
                  {detalles?.equipaje === 'carry' && '👜 Carry + mochila'}
                  {detalles?.equipaje === 'bodega' && '🧳 Equipaje en bodega'}
              </span>
            )}
          </div>

        </div>

    </div>
  </div>
)}
    {/* SERVICIOS */}
    <div className="mt-10 border-t border-gray-200 pt-8">
      <p className="text-2xl md:text-3xl font-semibold text-[#0F3B4C] mb-3">Transporte</p>
      <p className="text-lg text-gray-500">{detalles?.transporte}</p>
    </div>

    <div className="mt-10 border-t border-gray-200 pt-8">
      <p className="text-2xl md:text-3xl font-semibold text-[#0F3B4C] mb-3">Asistencia</p>
      <p className="text-lg text-gray-500">{detalles?.asistencia}</p>
    </div>

    <div className="mt-10 border-t border-gray-200 pt-8">
      <p className="text-2xl md:text-3xl font-semibold text-[#0F3B4C] mb-3">Otros</p>
      <p className="text-lg text-gray-500">{detalles?.otros}</p>
    </div>

    
            </div>

            
          )
        })()}
        
      </div>

        )
}
