'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Tramo {
  tipo: 'ida' | 'vuelta'
  origen: string
  destino: string
  salida: string
  llegada: string
}

interface Vuelos {
  tramos: Tramo[]
  clase?: string
  equipaje?: string
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
}

interface Fecha {
  fecha_inicio: string
  fecha_fin: string
}

export default function Home({
  destino,
  overrideOfertas,
}: {
  destino?: string
  overrideOfertas?: Oferta[]
}) {
  const [ofertas, setOfertas] = useState<Oferta[]>([])
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Fecha | null>(null)
  const [hotelSeleccionado, setHotelSeleccionado] = useState<Oferta | null>(null)
  const [tipoPlanSeleccionado, setTipoPlanSeleccionado] = useState('Base doble')
  

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
        .select('external_id, destino, hotel, fecha_in, fecha_out, precio, pax, regimen, status, badge, imagen, vuelos, servicios')
        .eq('status', 'publicado')

         console.log('DATA SUPABASE:', data) // 👈 ACÁ


      const normalizar = (str: string) =>
        str?.toLowerCase().replace(/\s+/g, '-')

      const ofertasFiltradas = ((data as Oferta[]) || []).filter(
        (o) => normalizar(o.destino) === normalizar(destino || '')
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

  const ofertasFiltradas = ofertas.filter(
    (o) =>
      fechaSeleccionada &&
      o.fecha_in?.slice(0, 10) === fechaSeleccionada.fecha_inicio?.slice(0, 10) &&
      o.fecha_out?.slice(0, 10) === fechaSeleccionada.fecha_fin?.slice(0, 10) &&
      o.pax?.toLowerCase() === tipoPlanSeleccionado.toLowerCase()
  )

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
    if (index === 0) return '🔥 Quedan 2 lugares'
    if (index === 1) return '⚠️ Pocas habitaciones disponibles'
    return null
  }

  const getNoches = (inicio: string, fin: string): number => {
    const start = new Date(inicio)
    const end = new Date(fin)
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  }

  const calcularDuracion = (salida: string, llegada: string): string => {
    try {
      const [hS, mS] = salida.split(':').map(Number)
      const [hL, mL] = llegada.split(':').map(Number)
      let minutos = hL * 60 + mL - (hS * 60 + mS)
      if (minutos < 0) minutos += 24 * 60
      const h = Math.floor(minutos / 60)
      const m = minutos % 60
      return m > 0 ? `${h}h ${m}m` : `${h}h`
    } catch {
      return ''
    }
  }

  const parsearVuelos = (vuelos: Vuelos | string | null | undefined): Vuelos | null => {
    if (!vuelos) return null
    try {
      return typeof vuelos === 'string' ? (JSON.parse(vuelos) as Vuelos) : vuelos
    } catch {
      return null
    }
  }

const getDetalles = (oferta: Oferta | null) => {
  if (!oferta) return null

  const vuelosParsed = parsearVuelos(oferta.vuelos)
  const tramos = vuelosParsed?.tramos || []
  const servicios = oferta.servicios || {}

  const idaTramos = tramos.filter(t => t.tipo === 'ida')
  const vueltaTramos = tramos.filter(t => t.tipo === 'vuelta')

  const getEscalaText = (segmentos: any[]) => {
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
          idaInfo: getEscalaText(idaTramos),
          vueltaInfo: getEscalaText(vueltaTramos),
        }
      : null,

    clase: vuelosParsed?.clase || null,
    equipaje: vuelosParsed?.equipaje || null,
    transporte: servicios?.transporte || 'Traslado ida y vuelta',
    asistencia: servicios?.asistencia || 'Asistencia incluida',
    otros: servicios?.otros || 'Post-venta',
  }
}
  return (
    <>
      <div className="min-h-screen bg-[#EBEDFF] max-w-5xl mx-auto px-4 py-8 pb-32">

        {/* FECHAS */}
        <h2 className="text-lg font-semibold mb-4 text-[#0F3B4C]">Elegí tu fecha</h2>
        <div className="flex gap-3 mb-10 flex-wrap">
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
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${
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
            <h2 className="text-lg font-semibold mb-4 text-[#0F3B4C]">Tipo de plan</h2>
            <div className="flex gap-3 mb-10 flex-wrap">
              {getPlanesGlobales().map((plan) => {
                const planesDisponibles = getPlanesPorFecha()
                const disabled = !planesDisponibles.includes(plan)
                return (
                  <button
                    key={plan}
                    disabled={disabled}
                    onClick={() => setTipoPlanSeleccionado(plan)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition ${
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
        <h2 className="text-lg font-semibold mb-6 text-[#0F3B4C]">Elegí tu hotel</h2>

        {ofertasFiltradas.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            No hay opciones disponibles para este plan en esta fecha.
          </div>
        ) : (
          <div className="grid gap-5">
            {[...ofertasFiltradas]
              .sort((a, b) => {
                const prioridad = (o: Oferta) => {
                  const badge = o.badge?.toLowerCase() || ''

                  if (badge.includes('recomendado')) return 1
                  if (badge.includes('mejor oferta')) return 2
                  if (badge.includes('últimos')) return 3
                  if (badge.includes('descuento')) return 4

                  if (o.precio === minPrecio) return 5 // automático

                  return 6
                }

                const diff = prioridad(a) - prioridad(b)

                if (diff !== 0) return diff

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
                  className={`group cursor-pointer bg-white rounded-2xl pl-0 pr-4 py-0 flex gap-4 items-stretch min-h-[180px] transition-all duration-300 ease-out ${
                    isSelected
                      ? 'ring-2 ring-[#00A99D]/0 shadow-xl scale-[1.02]'
                      : 'shadow-md hover:shadow-xl hover:scale-[1.015]'
                  }`}
                  >
                    <div className="-ml-4 w-[260px] flex-shrink-0 self-stretch overflow-hidden rounded-l-2xl">
                      <img
                        src={oferta.imagen?.trim() || 'https://placehold.co/100x100'}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/100x100'
                        }}
                        className="block w-full h-full object-cover rounded-l-2xl min-h-full"
                        alt={oferta.hotel}
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-6">
                      {badges.length > 0 && (
                        <div className="flex gap-2 flex-wrap mb-2">
                          {badges.map((badge, i) => (
                            <span
                              key={i}
                              className={`inline-block text-xs px-3 py-1 rounded-full font-semibold shadow-xs ${badge.style}`}
                            >
                              {badge.text}
                            </span>
                          ))}
                        </div>
                      )}
                      <h3 className="text-xl font-semibold text-[#0F3B4C]">{oferta.hotel}</h3>
                      <p className="text-base text-gray-500 mt-0">
                        {getNoches(oferta.fecha_in, oferta.fecha_out)} noches · {oferta.regimen || 'All inclusive'}
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="text-yellow-400">★★★★★</div>
                        <span className="text-gray-500">5 estrellas</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {['Vuelo', 'Hotel', 'Traslados', 'Asistencia'].map((item) => (
                          <span key={item} className="text-xs px-3 py-1 rounded-full bg-[#E8F7F6] text-[#0F3B4C]">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end justify-center h-full">
                      <p className="text-base text-gray-500 mb-0 leading-none">Desde</p>
                      <p className="text-4xl font-bold text-[#0F3B4C] tracking-[-0.02em]">
                        USD {oferta.precio}
                      </p>
                      <p className="text-sm text-gray-500">
                        Por persona en {tipoPlanSeleccionado.toLowerCase()}
                      </p>
                      {urgency && (
                        <p className="text-xs mt-2 text-red-500 font-semibold">{urgency}</p>
                      )}
                      {isSelected && (
                        <span className="mt-2 text-xs font-semibold text-[#00A99D]">✓ Seleccionado</span>
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
    <p className="text-3xl font-semibold text-[#0F3B4C] mb-8">Itinerario de vuelo</p>

    <div className="space-y-4">

      {/* IDA */}
        <div className="border rounded-2xl px-5 py-4 bg-gray-50">

          {/* LABEL */}
          <p className="text-xs font-semibold text-[#0F6E56] mb-3">IDA</p>

          {/* ROW */}
          <div className="flex items-center w-full h-[40px]">

            {/* ORIGEN */}
          <div className="flex items-center gap-3 w-[80px]">
            <p className="text-3xl font-bold text-[#0F3B4C] leading-none translate-y-[1px]">
              {detalles.vuelo.ida.split(' → ')[0]}
            </p>
            <div className="w-2 h-2 bg-[#0F6E56] rounded-full" />
          </div>

            {/* LINEA */}
              <div className="flex-1 px-4">

                {/* LINEA PERFECTAMENTE CENTRADA */}
                <div className="flex items-center w-full gap-2 relative top-[12px]">
                  <div className="flex-1 h-px bg-gray-300" />
                  <span className="text-gray-400 text-sm">✈</span>
                  <div className="flex-1 h-px bg-gray-300" />
                </div>

                {/* TEXTO FUERA DEL FLOW */}
                <p className="text-base text-gray-400 mt-2 text-center">
                  {detalles.vuelo.idaInfo}
                </p>

              </div>

            {/* DESTINO */}
            <div className="flex items-center gap-3 justify-end w-[80px]">
              <div className="w-2 h-2 bg-[#0F6E56] rounded-full" />
              <p className="text-3xl font-bold text-[#0F3B4C] leading-none translate-y-[1px]">
                {detalles.vuelo.ida.split(' → ')[1]}
              </p>
            </div>

          </div>

          {/* TAGS */}
            <div className="flex gap-2 mt-4">
              <span className="text-xs px-3 py-1 rounded-full bg-[#E6F1FB] text-[#185FA5]">
                {detalles.vuelo.vueltaInfo}
              </span>

              {detalles?.clase && (
                <span className="text-xs px-3 py-1 rounded-full border text-gray-500">
                  {detalles.clase}
                </span>
              )}

              {detalles?.equipaje && (
                <span className="text-xs px-3 py-1 rounded-full border text-gray-500">
                  {detalles.equipaje}
                </span>
              )}
            </div>
        </div>

      {/* VUELTA */}
        <div className="border rounded-2xl px-5 py-4 bg-gray-50">

          {/* LABEL */}
          <p className="text-xs font-semibold text-[#185FA5] mb-3">VUELTA</p>

          {/* ROW */}
              <div className="flex items-center w-full h-[40px]">

                {/* ORIGEN */}
                <div className="flex items-center gap-3 w-[80px]">
                  <p className="text-3xl font-bold text-[#0F3B4C] leading-none translate-y-[1px]">
                    {detalles.vuelo.vuelta.split(' → ')[0]}
                  </p>
                  <div className="w-2 h-2 bg-[#185FA5] rounded-full" />
                </div>

                {/* LINEA */}
                  <div className="flex-1 px-4">

                    {/* LINEA PERFECTAMENTE CENTRADA */}
                    <div className="flex items-center w-full gap-2 relative top-[12px]">
                      <div className="flex-1 h-px bg-gray-300" />
                      <span className="text-gray-400 text-sm">✈</span>
                      <div className="flex-1 h-px bg-gray-300" />
                    </div>

                    {/* TEXTO FUERA DEL FLOW */}
                    <p className="text-base text-gray-400 mt-2 text-center">
                      {detalles.vuelo.idaInfo /* o vueltaInfo */}
                    </p>

                  </div>

                {/* DESTINO */}
                <div className="flex items-center gap-3 justify-end w-[80px]">
                  <div className="w-2 h-2 bg-[#185FA5] rounded-full" />
                  <p className="text-3xl font-bold text-[#0F3B4C] leading-none translate-y-[1px]">
                    {detalles.vuelo.vuelta.split(' → ')[1]}
                  </p>
                </div>

              </div>
          {/* TAGS */}
          <div className="flex gap-2 mt-4">
            <span className="text-xs px-3 py-1 rounded-full bg-[#E6F1FB] text-[#185FA5]">
              {detalles.vuelo.vueltaInfo}
            </span>

            {detalles?.clase && (
              <span className="text-xs px-3 py-1 rounded-full border text-gray-500">
                {detalles.clase}
              </span>
            )}

            {detalles?.equipaje && (
              <span className="text-xs px-3 py-1 rounded-full border text-gray-500">
                {detalles.equipaje}
              </span>
            )}
          </div>

        </div>

    </div>
  </div>
)}
    {/* SERVICIOS */}
    <div className="mt-10 border-t border-gray-200 pt-8">
      <p className="text-3xl font-semibold text-[#0F3B4C] mb-3">Transporte</p>
      <p className="text-lg text-gray-500">{detalles?.transporte}</p>
    </div>

    <div className="mt-10 border-t border-gray-200 pt-8">
      <p className="text-3xl font-semibold text-[#0F3B4C] mb-3">Asistencia</p>
      <p className="text-lg text-gray-500">{detalles?.asistencia}</p>
    </div>

    <div className="mt-10 border-t border-gray-200 pt-8">
      <p className="text-3xl font-semibold text-[#0F3B4C] mb-3">Otros</p>
      <p className="text-lg text-gray-500">{detalles?.otros}</p>
    </div>
            </div>
          )
        })()}

        {/* RESUMEN + BOTÓN RESERVAR */}
        {hotelSeleccionado && (
          <div className="mt-12 bg-white p-10 rounded-3xl border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.08)] flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-[4px] h-24 bg-[#0F3B4C] rounded-full" />
              <div className="flex flex-col leading-none">
                <p className="text-base text-gray-400">Desde</p>
                <p className="text-5xl md:text-6xl font-extrabold tracking-[-0.06em] text-[#0F3B4C] -mt-1">
                  USD {hotelSeleccionado.precio}
                </p>
                <p className="text-base text-gray-500">
                  Por persona en {tipoPlanSeleccionado.toLowerCase()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <a
                href={`https://wa.me/549XXXXXXXXXX?text=Hola! Me interesa este viaje a ${hotelSeleccionado.destino} en ${hotelSeleccionado.hotel}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center bg-[#0F3B4C] hover:bg-[#0c2f3d] text-white px-12 py-2 rounded-full text-lg font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] shadow-md hover:shadow-lg"
              >
                Reservar
              </a>
              <p className="text-xs text-gray-400 mt-3 max-w-xs ml-auto">
                *Los precios y servicios están sujetos a disponibilidad y modificaciones por parte de los prestadores.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* STICKY FOOTER */}
      {hotelSeleccionado && (
        <div className="fixed bottom-0 left-0 w-full z-50 animate-slide-up">
          <div className="absolute -top-6 left-0 w-full h-6 bg-gradient-to-t from-white/60 to-transparent pointer-events-none" />
          <div className="backdrop-blur-md bg-white/85 border border-white/75 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.15)]">
            <div className="max-w-5xl mx-auto px-4 py-5 md:py-6 flex items-center justify-between gap-6">
              <div>
                <p className="text-sm text-gray-500">
                  {destino} · {fechaSeleccionada?.fecha_inicio}
                </p>
                <p className="text-lg font-semibold text-[#0F3B4C]">{hotelSeleccionado.hotel}</p>
                <span className="text-base text-[#00A99D] font-semibold">✓ Seleccionado</span>
              </div>
              <div className="flex items-center gap-6 md:gap-10">
                <div className="text-right flex flex-col items-end leading-tight">
                  <p className="text-sm text-gray-400 self-start">Desde</p>
                  <p className="text-2xl md:text-3xl font-extrabold text-[#0F3B4C] leading-none">
                    USD {hotelSeleccionado.precio || '—'}
                  </p>
                </div>
                <a
                  href={`https://wa.me/549XXXXXXXXXX?text=Hola! Quiero este paquete: ${hotelSeleccionado.hotel}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#0f3b4c] hover:bg-[#0f3b4c] text-white px-6 py-3 rounded-full text-base font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] shadow-md hover:shadow-lg"
                >
                  Quiero este viaje
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
