'use client'

export default function OfertaPreview({ data }: { data: any }) {
  if (!data) return null

  const precioMatch = data.hoteles?.[0]?.precio?.match(/\d[\d\.]+/)
  const precio = precioMatch ? precioMatch[0] : '---'

  return (
    <div className="max-w-xl mx-auto mt-10 bg-[#f3f4f6] rounded-3xl overflow-hidden shadow-xl">

      {/* HERO */}
      <div className="relative h-56">

        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute bottom-6 left-6 text-white">
          <h2 className="text-2xl font-bold">
            {data.titulo}
          </h2>

          <p className="text-sm mt-1">
            {data.fechas}
          </p>
        </div>

      </div>

      {/* BLOQUES */}
      <div className="p-5 grid grid-cols-2 gap-4">

        {data.incluye?.slice(0, 4).map((item: string, i: number) => (
          <div
            key={i}
            className="bg-[#0F3B4C] text-white rounded-xl px-4 py-4 text-sm font-semibold"
          >
            {item}
          </div>
        ))}

      </div>

      {/* PRECIO */}
      <div className="px-5">

        <div className="bg-[#0F3B4C] text-white rounded-2xl p-6">

          <p className="text-sm opacity-70">
            Desde
          </p>

          <p className="text-5xl font-bold mt-1">
            USD {precio}
          </p>

          <p className="text-sm mt-1">
            por persona en base doble
          </p>

        </div>

      </div>

      {/* HOTELES */}
      <div className="p-6 space-y-6">

        {data.hoteles?.map((hotel: any, i: number) => (
          <div key={i}>

            <h4 className="font-semibold text-[#0F3B4C]">
              {hotel.nombre}
            </h4>

            <p className="text-sm text-gray-600">
              {hotel.precio}
            </p>

          </div>
        ))}

      </div>

    </div>
  )
}