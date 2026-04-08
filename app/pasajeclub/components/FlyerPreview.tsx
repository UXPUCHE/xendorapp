'use client'

type Props = {
  data?: any
}

export default function FlyerPreview({ data }: Props) {

  const destino = data?.destino || 'Punta Cana'
  const fechas = data?.fechas || 'Desde Córdoba - 7 noches - 20 al 27 de abril'
  const precio = data?.destacado?.precio_base || '1.650'

  return (
    <div className="w-full max-w-[860px] mx-auto bg-[#f2f2f2] rounded-3xl overflow-hidden shadow-xl p-6 space-y-6">

      {/* LOGO */}
      <div className="text-center text-[#0F3B4C] font-bold text-2xl">
        pasajeclub
      </div>

      {/* HERO */}
      <div className="relative rounded-2xl overflow-hidden">

        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          className="h-64 w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute bottom-6 left-6 text-white">
          <p className="text-3xl font-bold">{destino}</p>
          <p className="text-base opacity-90">
            {fechas}
          </p>
        </div>

        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#0F3B4C] text-yellow-400 px-6 py-2 rounded-xl text-base font-semibold shadow">
          Córdoba ⇄ {destino}
        </div>

      </div>

      {/* FEATURES */}
      <div className="grid grid-cols-2 gap-4">

        <div className="bg-[#0F3B4C] text-white p-4 rounded-xl text-sm">
          ✈ Aéreo desde Córdoba operado por Latam
        </div>

        <div className="bg-[#0F3B4C] text-white p-4 rounded-xl text-sm">
          🚌 Traslados incluidos
        </div>

        <div className="bg-[#0F3B4C] text-white p-4 rounded-xl text-sm">
          🏨 7 noches all inclusive
        </div>

        <div className="bg-[#0F3B4C] text-white p-4 rounded-xl text-sm">
          🛡 Asistencia incluida
        </div>

      </div>

      {/* TAGS */}
      <div className="flex gap-4">

        <div className="bg-yellow-400 text-black p-4 rounded-xl text-sm font-semibold flex-1 text-center">
          Incluye equipaje
        </div>

        <div className="bg-green-500 text-white p-4 rounded-xl text-sm font-semibold flex-1 text-center">
          All inclusive
        </div>

      </div>

      {/* PRECIO */}
      <div className="bg-[#0F3B4C] text-white rounded-2xl p-6 space-y-3">

        <span className="bg-yellow-400 text-black text-sm px-4 py-1 rounded-full inline-block">
          frente al mar
        </span>

        <p className="text-lg opacity-80">
          {destino}
        </p>

        <div className="flex items-end gap-2">
        <span className="text-sm text-gray-300">Desde</span>
        <span className="text-6xl font-extrabold text-yellow-400 leading-none">
            USD {precio}
        </span>
        </div>

        <p className="text-sm opacity-80">
          por persona en base doble
        </p>

      </div>

      {/* VUELOS */}
      <div className="bg-white rounded-xl p-5 space-y-4 text-sm text-[#0F3B4C]">

        <div className="flex justify-between items-center border-b pb-3">
          <span>✈ COR → PUJ 05:10 → 15:20</span>
          <span className="bg-yellow-200 px-3 py-1 rounded">
            20 ABR 2026
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span>✈ PUJ → COR 17:30 → 04:10 (+1)</span>
          <span className="bg-yellow-200 px-3 py-1 rounded">
            27 ABR 2026
          </span>
        </div>

        <div className="text-center text-xs text-gray-500 pt-2">
          Duración total: 11:10 hs / 09:40 hs
        </div>

      </div>

      {/* FOOTER */}
      <div className="text-center text-xs text-gray-500 pt-2">
        Tarifas incluyen impuestos y están sujetas a disponibilidad
      </div>

    </div>
  )
}