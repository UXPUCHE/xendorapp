import { supabase } from "@/lib/supabase";
import PasajeSaleCard from './components/PasajeSaleCard'

export default async function PasajeSalePage() {

  const { data: paquetes } = await supabase
    .from("sale_cards")
    .select("*")
    .eq("activo", true)
    .order("orden", { ascending: true });

  return (
    <main className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-16">
          <p className="text-yellow-400 uppercase tracking-[0.3em] text-sm mb-4">
            Pasaje Sale
          </p>

          <h1 className="text-white text-5xl font-bold max-w-4xl leading-tight tracking-[-0.04em]">
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
            />
          ))}
        </div>

      </div>
    </main>
  );
}