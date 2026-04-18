'use client'

import { useState, useEffect, useRef } from 'react'
import FlightCard from '../../components/grupales/FlightCard'


let L: any = null // eslint-disable-line @typescript-eslint/no-explicit-any
import 'leaflet/dist/leaflet.css'
// @ts-ignore
import type {} from 'leaflet'

type TabType = 'resumen' | 'itinerario' | 'hoteles' | 'mapa' | 'vuelos' | 'documentos'


type ItinerarioItem = {
  dia: string
  titulo: string
  descripcion: string
}

type Hotel = {
  nombre: string
  imagen: string
  estrellas: number
  ciudad?: string
}

export default function Page() {
  const [openIndex, setOpenIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<TabType>('resumen')
  const [isDown, setIsDown] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const mapRef = useRef<HTMLDivElement>(null!)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  const vuelos = [
    {
      tipo: 'IDA' as const,
      origen: 'COR',
      origenLabel: 'Córdoba',
      destino: 'RAK',
      destinoLabel: 'Marrakech',
      escala: 'Escala en Madrid',
      airline: 'IB',
      segments: [
        {
          from: 'COR',
          to: 'MAD',
          departure: '08:45',
          arrival: '14:20',
          duration: '11h 35m',
        },
        {
          from: 'MAD',
          to: 'RAK',
          departure: '16:30',
          arrival: '18:10',
          duration: '1h 40m',
        },
      ],
    },
    {
      tipo: 'VUELTA' as const,
      origen: 'RAK',
      origenLabel: 'Marrakech',
      destino: 'COR',
      destinoLabel: 'Córdoba',
      escala: 'Escala en Madrid',
      airline: 'IB',
      segments: [
        {
          from: 'RAK',
          to: 'MAD',
          departure: '09:10',
          arrival: '11:00',
          duration: '1h 50m',
        },
        {
          from: 'MAD',
          to: 'COR',
          departure: '13:30',
          arrival: '23:15',
          duration: '10h 45m',
        },
      ],
    },
    {
      tipo: 'IDA' as const,
      origen: 'EZE',
      origenLabel: 'Buenos Aires',
      destino: 'CMN',
      destinoLabel: 'Casablanca',
      escala: 'Escala en París',
      airline: 'AR',
      segments: [
        {
          from: 'EZE',
          to: 'CDG',
          departure: '22:00',
          arrival: '15:30',
          duration: '13h 30m',
        },
        {
          from: 'CDG',
          to: 'CMN',
          departure: '18:00',
          arrival: '20:30',
          duration: '2h 30m',
        },
      ],
    },
    {
      tipo: 'VUELTA' as const,
      origen: 'CMN',
      origenLabel: 'Casablanca',
      destino: 'EZE',
      destinoLabel: 'Buenos Aires',
      escala: 'Escala en París',
      airline: 'AR',
      segments: [
        {
          from: 'CMN',
          to: 'CDG',
          departure: '07:30',
          arrival: '10:00',
          duration: '2h 30m',
        },
        {
          from: 'CDG',
          to: 'EZE',
          departure: '13:00',
          arrival: '22:10',
          duration: '13h 10m',
        },
      ],
    },
  ]

useEffect(() => {
  if (activeTab !== 'resumen' && activeTab !== 'mapa') return
  if (!mapRef.current) return
  if (typeof window === 'undefined') return

  // evitar duplicar mapas
  if (mapInstanceRef.current) {
    mapInstanceRef.current.remove()
    mapInstanceRef.current = null
  }

  import('leaflet').then((leaflet: any) => {
    L = leaflet

    delete (L.Icon.Default.prototype as any)._getIconUrl

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    })

    const map = L.map(mapRef.current!).setView([31.63, -7.99], 5)
    mapInstanceRef.current = map
    markersRef.current = []

    const tileUrl =
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

    L.tileLayer(tileUrl, {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    const locations = [
      { name: 'Marrakech', coords: [31.63, -7.99] },
      { name: 'Casablanca', coords: [33.57, -7.59] },
      { name: 'Rabat', coords: [34.02, -6.84] },
      { name: 'Sahara', coords: [31.0, -4.0] },
    ]

    locations.forEach((loc, i) => {
      const marker = L.circleMarker(loc.coords, {
        radius: 6,
        color: '#0F3B4C',
        fillColor: '#DBCB3A',
        fillOpacity: 1,
        weight: 2,
      })

      marker
        .addTo(map)
        .bindPopup(`<strong>Día ${i + 1}</strong><br/>${loc.name}`)

      markersRef.current.push({
        marker,
        coords: loc.coords,
      })
    })

    const routeCoords = locations.map((l) => l.coords)

    L.polyline(routeCoords, {
      color: '#0F3B4C',
      weight: 3,
      dashArray: '6 6',
    }).addTo(map)

    map.fitBounds(routeCoords as any, { padding: [40, 40] })

    map.zoomControl.setPosition('topright')
  })
}, [activeTab])


  // 👉 mock luego lo reemplazamos por supabase
  const itinerario: ItinerarioItem[] = [
    {
      dia: 'Día 1 - 10 sep',
      titulo: 'Llegada a Marrakech',
      descripcion:
        'Recepción en el aeropuerto y traslado al hotel. Tiempo libre para descansar.',
    },
    {
      dia: 'Día 2 - 11 sep',
      titulo: 'Marrakech',
      descripcion:
        'City tour por los zocos, plaza Jemaa el-Fna y principales atractivos.',
    },
    {
      dia: 'Día 3 - 12 sep',
      titulo: 'Casablanca - Rabat',
      descripcion:
        'Visita guiada por la mezquita y la Kasbah.',
    },
  ]

  const hoteles: Hotel[] = [
    {
      nombre: 'Dorset Rose Garden',
      imagen: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      estrellas: 4,
      ciudad: 'Marrakech',
    },
    {
      nombre: 'Sofitel Casablanca',
      imagen: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
      estrellas: 5,
      ciudad: 'Casablanca',
    },
    {
      nombre: 'Riad Yasmine',
      imagen: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
      estrellas: 4,
      ciudad: 'Marrakech',
    },
    {
      nombre: 'Desert Camp Sahara',
      imagen: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
      estrellas: 4,
      ciudad: 'Sahara',
    },
    {
      nombre: 'Atlas Mountain Lodge',
      imagen: 'https://images.unsplash.com/photo-1501117716987-c8e9c3c6c6c4',
      estrellas: 5,
      ciudad: 'Atlas',
    },
    {
      nombre: 'Rabat Palace',
      imagen: 'https://images.unsplash.com/photo-1521783593447-5702b9bfd267',
      estrellas: 5,
      ciudad: 'Rabat',
    },
    {
      nombre: 'Medina Boutique Hotel',
      imagen: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
      estrellas: 4,
      ciudad: 'Fez',
    },
    {
      nombre: 'Kasbah Experience',
      imagen: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
      estrellas: 4,
      ciudad: 'Ouarzazate',
    },
    {
      nombre: 'Luxury Oasis Resort',
      imagen: 'https://images.unsplash.com/photo-1559599101-f09722fb4948',
      estrellas: 5,
      ciudad: 'Merzouga',
    },
    {
      nombre: 'Marrakech Urban Stay',
      imagen: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
      estrellas: 4,
      ciudad: 'Marrakech',
    },
  ]

return (
  <div className="bg-white text-[#0F3B4C]">

    {/* HERO */}
    <section className="relative">
      <img
        src="https://images.unsplash.com/photo-1548013146-72479768bada"
        className="w-full h-[420px] object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute inset-0 flex flex-col justify-center max-w-6xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-white">Marruecos</h1>
        <p className="text-white text-lg mt-2">
          10 al 20 de septiembre 2026
        </p>
        <button className="mt-6 w-fit bg-[#DBCB3A] text-[#0F3B4C] px-6 py-3 rounded-full font-semibold hover:scale-105 transition">
          Ver disponibilidad
        </button>
      </div>
    </section>

    {/* WRAPPER */}
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* TABS */}
      <div className="flex gap-6 border-b pb-2 text-sm mb-8">
        {(['resumen','itinerario','hoteles','mapa','vuelos','documentos'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize pb-1 ${
              activeTab === tab
                ? 'font-semibold border-b-2 border-[#0F3B4C]'
                : 'text-gray-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-8">

        {/* IZQUIERDA */}
        <div className="md:col-span-2 space-y-10">

            {/* RESUMEN */}
            {activeTab === 'resumen' && (
            <div className="space-y-12">

  {/* HEADLINE PREMIUM */}
  <div>
    <h2 className="text-5xl font-bold leading-tight tracking-tight">
      Marruecos como nunca lo viviste
    </h2>

    <p className="text-lg text-gray-500 mt-3 max-w-2xl">
      Un viaje diseñado para explorar cultura, desierto y ciudades imperiales con el equilibrio perfecto entre aventura y confort.
    </p>

    <div className="flex items-center gap-3 mt-4 text-sm">
      <span className="bg-[#0F3B4C] text-white px-4 py-1.5 rounded-full">
        Grupo acompañado
      </span>

      <span className="bg-[#DBCB3A] text-[#0F3B4C] px-4 py-1.5 rounded-full font-semibold">
        Cupos limitados
      </span>

      <span className="text-red-500 font-medium">
        🔥 Alta demanda
      </span>
    </div>
  </div>

  {/* DATOS CLAVE PREMIUM */}
        <div className="flex flex-col md:flex-row bg-[#0F3B4C] rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden">

        {[
            { label: 'Duración', value: '10 días / 9 noches' },
            { label: 'Tipo', value: 'Grupal acompañado' },
            { label: 'Hoteles', value: 'Hoteles seleccionados' },
            { label: 'Vuelo', value: 'Aereos incluidos' },
        ].map((item, i) => (
            <div
            key={i}
            className="flex-1 p-6 relative"
            >
            {i !== 0 && (
              <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-16 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
            )}
            <p className="text-xs text-[#DBCB3A] uppercase tracking-wide mb-1">
                {item.label}
            </p>
            <p className="text-xl font-semibold text-white leading-tight">
                {item.value}
            </p>
            </div>
        ))}

        </div>
            {/* EXPERIENCIAS PRO */}
            <div className="mt-14">
              <h3 className="text-3xl font-semibold mb-8 tracking-tight">
                Lo que hace único este viaje
              </h3>

              <div className="grid md:grid-cols-[1.6fr_1fr] gap-3 items-stretch">

                {/* HERO EXPERIENCE */}
                <div className="relative rounded-2xl overflow-hidden h-full group shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
                  <img
                    src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-out"
                  />

                  {/* overlay premium */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <p className="text-2xl font-semibold leading-tight">
                      Noche en el Sahara
                    </p>
                    <p className="text-sm opacity-80 mt-1 max-w-md">
                      Dormí bajo un cielo lleno de estrellas en campamento premium
                    </p>
                  </div>
                </div>

                {/* STACK EXPERIENCES */}
                <div className="flex flex-col gap-3 h-full">

                  {[
                    {
                      title: 'Ciudades imperiales',
                      desc: 'Marrakech, Rabat y Casablanca con guías expertos',
                    },
                    {
                      title: 'Gastronomía local',
                      desc: 'Sabores auténticos incluidos durante el recorrido',
                    },
                    {
                      title: 'Tiempo libre',
                      desc: 'Explorá mercados y cultura a tu ritmo',
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="relative px-5 py-4 rounded-2xl border border-[#0F3B4C]/10 hover:border-[#0F3B4C]/30 transition-all duration-300 hover:shadow-lg group bg-white flex-1 flex flex-col justify-center"
                    >

                      <p className="font-semibold text-base leading-tight flex items-center gap-2">
                        <span>
                          {i === 0 && '🏰'}
                          {i === 1 && '🍽️'}
                          {i === 2 && '🛍️'}
                        </span>
                        {item.title}
                      </p>

                      <p className="text-sm text-gray-500 mt-1 leading-snug">
                        {item.desc}
                      </p>
                    </div>
                  ))}

                </div>

              </div>
            </div>

            {/* CTA PREMIUM */}
            <button
                onClick={() => setActiveTab('itinerario')}
                className="inline-flex items-center gap-2 bg-[#DBCB3A] text-[#0F3B4C] px-6 py-3 rounded-full font-semibold hover:scale-105 hover:gap-3 transition-all"
            >
                Ver itinerario completo →
            </button>

            </div>
            )}


          {/* PREVIEW HOTELES */}
          {activeTab === 'resumen' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Hoteles</h2>

            <div className="relative overflow-visible">
              <div
                ref={(el) => {
                  if (typeof window !== 'undefined') {
                    (window as any).__hotelScroll = el
                  }
                }}
                onScroll={(e) => {
                  const el = e.currentTarget
                  if (el.scrollLeft >= el.scrollWidth / 2) {
                    el.scrollLeft = 0
                  }
                }}
                onMouseDown={(e) => {
                  setIsDown(true)
                  setStartX(e.pageX - e.currentTarget.offsetLeft)
                  setScrollLeft(e.currentTarget.scrollLeft)
                }}
                onMouseLeave={() => setIsDown(false)}
                onMouseUp={() => setIsDown(false)}
                onMouseMove={(e) => {
                  if (!isDown) return
                  e.preventDefault()
                  const x = e.pageX - e.currentTarget.offsetLeft
                  const walk = (x - startX) * 1.5
                  e.currentTarget.scrollLeft = scrollLeft - walk
                }}
                className="cursor-grab active:cursor-grabbing flex gap-4 overflow-x-auto pl-6 pr-24 pb-10 overflow-y-visible snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {[...hoteles, ...hoteles].map((hotel, i) => (
                  <div
                    key={i}
                    className="min-w-[200px] snap-start bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-visible hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all"
                  >
                    <div className="relative overflow-hidden rounded-t-2xl">
                      <img
                        src={hotel.imagen}
                        className="h-32 w-full object-cover"
                      />

                      {hotel.ciudad && (
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium shadow">
                          📍 {hotel.ciudad}
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <p className="font-medium text-sm">{hotel.nombre}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {'★'.repeat(hotel.estrellas)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Deslizá para ver más →</p>
          </div>
          )}

          {/* PREVIEW MAPA */}
          {activeTab === 'resumen' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Recorrido</h2>
            <div className="h-[400px] rounded-xl overflow-hidden">
              <div ref={mapRef} className="w-full h-full" />
            </div>
          </div>
          )}

          {activeTab === 'itinerario' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Itinerario completo</h2>

              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  onClick={() => {
                    const map = mapInstanceRef.current
                    const target = markersRef.current[i]

                    if (map && target) {
                      markersRef.current.forEach((m) => {
                        m.marker.setStyle({ fillColor: '#DBCB3A', radius: 6 })
                      })

                      target.marker.setStyle({ fillColor: '#FF5A5F', radius: 8 })

                      map.flyTo(target.coords, 8, { duration: 1.5 })
                      target.marker.openPopup()
                    }
                  }}
                  className="border rounded-xl p-4 mb-3 cursor-pointer hover:shadow-md transition"
                >
                  <p className="text-sm text-gray-400">Día {i + 1}</p>
                  <p className="font-medium">Actividad del día</p>
                  <p className="text-sm text-gray-600">
                    Descripción del día con actividades, traslados y experiencias.
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'hoteles' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Hoteles</h2>

              <div className="flex gap-4 overflow-x-auto pb-4">
                {hoteles.map((hotel, i) => (
                  <div key={i} className="min-w-[250px] bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="relative">
                      <img src={hotel.imagen} className="h-40 w-full object-cover" />
                      {hotel.ciudad && (
                        <div className="absolute top-2 left-2 bg-white text-xs px-3 py-1 rounded-full shadow">
                          📍 {hotel.ciudad}
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <p className="font-medium">{hotel.nombre}</p>
                      <p className="text-sm text-gray-400">
                        {'★'.repeat(hotel.estrellas)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Desayuno incluido
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'mapa' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Recorrido</h2>
              <div className="h-[500px] rounded-xl overflow-hidden">
                <div ref={mapRef} className="w-full h-full" />
              </div>
            </div>
          )}

            {activeTab === 'vuelos' && (
            <div>
                <h2 className="text-3xl font-semibold mb-8">Vuelos incluidos</h2>
                <div className="space-y-6">
                {vuelos.map((vuelo, i) => (
                    <FlightCard key={i} vuelo={vuelo} />
                ))}
                </div>
            </div>
            )}

          {activeTab === 'documentos' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Documentación</h2>

              <div className="space-y-3">
                <button className="w-full bg-[#DBCB3A] py-3 rounded-lg font-medium">
                  Descargar itinerario
                </button>

                <button className="w-full border py-3 rounded-lg">
                  Descargar flyer
                </button>
              </div>
            </div>
          )}

        </div>

        {/* DERECHA STICKY */}
        <div className="space-y-4 sticky top-6 h-fit">

          {/* CARD PRECIO */}
          <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <p className="text-sm text-gray-400">Desde</p>
              <p className="text-5xl font-bold tracking-tight">USD 2200</p>
              <p className="text-md text-gray-400">por persona</p>
            </div>

            <div className="bg-[#DBCB3A]/20 text-[#0F3B4C] text-xs px-3 py-2 rounded-lg">
              🔥 Últimos cupos disponibles
            </div>

            <select className="w-full border rounded-lg px-3 py-2 text-sm">
              <option>1 adulto</option>
              <option>2 adultos</option>
            </select>

            <button className="w-full bg-[#DBCB3A] py-3 rounded-full font-semibold hover:scale-[1.02] transition">
              Reservar ahora
            </button>

            <p className="text-xs text-gray-400 text-center">
              Sin interés hasta 3 cuotas
            </p>
          </div>

          {/* INCLUYE */}
          <div className="bg-gray-50 p-5 rounded-xl space-y-2 text-sm">
            <p>✔ Vuelo internacional</p>
            <p>✔ Alojamiento 4 y 5★</p>
            <p>✔ Traslados</p>
            <p>✔ Excursiones</p>
            <p>✔ Coordinador</p>
          </div>

        </div>

      </div>
    </div>
  </div>
)
} 