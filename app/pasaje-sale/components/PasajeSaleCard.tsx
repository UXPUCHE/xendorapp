import Link from "next/link";

interface Props {
  destino: string;
  headline: string;
  descripcion: string;

  badge: string;
  promoBadge?: string;

  imagen: string;
  whatsapp: string;

  pills: string[];
}

export default function PasajeSaleCard({
  destino,
  headline,
  descripcion,
  badge,
  promoBadge,
  imagen,
  whatsapp,
  pills,
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
      <div className="px-7 pt-6 pb-6 flex flex-col flex-1">

        {/* Headline + Promo */}
        <div className="flex items-start justify-between gap-4 mb-4">

          <p className="text-[#0A3149] text-[17px] leading-[1.35] tracking-[-0.02em] max-w-[75%]">
            {headline}
          </p>

          {promoBadge && (
            <div className="bg-[#F5A623] text-[#052F49] text-[12px] font-bold px-4 py-[10px] rounded-full whitespace-nowrap leading-none shadow-sm uppercase tracking-[0.03em]">
              {promoBadge}
            </div>
          )}

        </div>

        {/* Destino */}
        <div className="mb-5">
          <p className="text-[#6B7A84] uppercase text-[12px] tracking-[0.22em] mb-2 font-semibold">
            Destino
          </p>

          <h2 className="text-[#0A3149] text-[42px] font-bold leading-[0.95] tracking-[-0.055em] uppercase">
            {destino}
          </h2>
        </div>

        {/* Descripcion */}
        <p className="text-[#0A3149] text-[16px] leading-[1.5] tracking-[-0.02em] mb-5">
          {descripcion}
        </p>

        {/* Pills */}
        <div className="flex flex-wrap gap-3 mb-7">
          {pills?.map((pill, index) => (
            <div
              key={index}
              className="bg-[#F3F3F3] border border-[#DEDEDE] px-5 py-[13px] rounded-full text-[#0A3149] text-[14px] font-semibold leading-none"
            >
              {pill}
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={whatsapp}
          target="_blank"
          className="mt-auto bg-[#052F49] hover:bg-[#063854] transition-all duration-300 text-white text-center py-4 rounded-full text-[18px] font-semibold leading-none"
        >
          Quiero este paquete
        </Link>

      </div>
    </div>
  );
}