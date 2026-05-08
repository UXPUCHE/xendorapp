import Link from "next/link";

interface Props {
  titulo: string;
  subtitulo?: string;
  precio: string;
  moneda: string;
  badge: string;
  imagen: string;
  whatsapp: string;
  salida: string;
  noches: string;
  base: string;
  incluye: string;
}

export default function PasajeSaleCard({
  titulo,
  precio,
  moneda,
  badge,
  imagen,
  whatsapp,
  salida,
  noches,
  base,
  incluye,
}: Props) {
  return (
    <div className="bg-[#F7F7F5] rounded-[30px] overflow-hidden shadow-md flex flex-col h-full border border-[#E8E8E5]">

      {/* Imagen */}
      <div className="relative h-[260px] overflow-hidden rounded-t-[30px]">

        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage: `url(${imagen})`,
          }}
        />

        {/* Badge izquierda */}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-[#052F49] text-white text-[12px] px-5 py-[10px] rounded-full font-semibold uppercase leading-none tracking-[0.04em] shadow-lg">
            {badge}
          </span>
        </div>

        {/* Pasaje Sale Badge */}
        <div className="absolute top-4 right-4 z-10">
          <img
            src="/pasaje-sale-badge.png"
            alt="Pasaje Sale"
            className="w-[82px] h-[82px] object-contain drop-shadow-xl"
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-7 pt-5 pb-5 flex flex-col flex-1">

        <p className="text-[#0A3149] text-[17px] font-normal mb-2 leading-none tracking-[-0.01em]">
          {salida}
        </p>

        <h2 className="text-[#0A3149] text-[34px] font-bold leading-[1] tracking-[-0.045em] mb-4 min-h-[44px]">
          {titulo}
        </h2>

        <div className="flex flex-wrap gap-3 mb-5">

          <div className="bg-[#F3F3F3] border border-[#DEDEDE] px-5 py-[13px] rounded-full text-[#0A3149] text-[15px] font-semibold leading-none">
            {noches}
          </div>

          <div className="bg-[#052F49] px-5 py-[13px] rounded-full text-white text-[15px] font-semibold leading-none">
            {base}
          </div>

        </div>

        <div className="mb-5 min-h-0">
          <p className="text-[#0A3149] text-[16px] leading-[1.45] tracking-[-0.02em] max-w-[95%]">
            <span className="font-bold">Incluye:</span>{" "}
            {incluye}
          </p>
        </div>

        <div className="border-t border-[#E3E3E3] my-1" />

        <div className="mt-4 mb-5">

          <p className="text-[#0A3149] text-[20px] mb-0 leading-none">
            Desde
          </p>

          <h3 className="text-[#0A3149] text-[46px] font-bold leading-[0.9] tracking-[-0.05em]">
            {moneda} {precio}
          </h3>

          <p className="text-[#4F5C65] text-[15px] mt-2 leading-none tracking-[-0.01em]">
            Precio por persona | {base}
          </p>

        </div>

        <Link
          href={whatsapp}
          target="_blank"
          className="mt-auto bg-[#052F49] hover:bg-[#063854] transition-all duration-300 text-white text-center py-4 rounded-full text-[18px] font-semibold leading-none"
        >
          Ver más
        </Link>

      </div>
    </div>
  );
}