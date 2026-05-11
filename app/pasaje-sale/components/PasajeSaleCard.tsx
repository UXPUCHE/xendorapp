import Link from "next/link";

interface Props {
  destino: string;
  salida: string;
  descripcion: string;

  badge: string;
  promoBadge?: string;

  imagen: string;
  whatsapp: string;

  pills: string[];
}

export default function PasajeSaleCard({
  destino,
  salida,
  descripcion,
  badge,
  promoBadge,
  imagen,
  whatsapp,
  pills,
}: Props) {
  return (
    <div className="bg-[#F7F7F5] rounded-[30px] overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.06)] flex flex-col h-full border border-[#E8E8E5]">

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

        {/* Ciudad + Promo */}
        <div className="flex items-center justify-between gap-4 mb-5">

          <p className="text-[#0A3149] text-[17px] font-semibold tracking-[-0.03em]">
            {salida}
          </p>

          {promoBadge && (
            <div className="bg-[#F2C230] text-[#052F49] text-[12px] font-bold px-5 py-[11px] rounded-full whitespace-nowrap leading-none uppercase tracking-[0.03em] shadow-sm">
              {promoBadge}
            </div>
          )}

        </div>

        {/* Destino */}
        <div className="mb-5">
          <h2 className="text-[#0A3149] text-[38px] font-bold leading-[0.95] tracking-[-0.055em]">
            {destino}
          </h2>
        </div>

        {/* Descripcion */}
        <p className="text-[#0A3149] text-[16px] leading-[1.5] tracking-[-0.02em] mb-5">
          {descripcion}
        </p>

        {/* Pills */}
        <div className="grid grid-cols-4 gap-3 mb-7">
          {pills?.map((pill, index) => {

            const styles = [
              'bg-[#052F49] text-white border-[#052F49]',
              'bg-[#D9CC3A] text-[#052F49] border-[#D9CC3A]',
              'bg-[#22B8B5] text-[#052F49] border-[#22B8B5]',
              'bg-[#ECEEF3] text-[#052F49] border-[#ECEEF3]',
            ]

            return (
              <div
                key={index}
                className={`px-4 py-[13px] rounded-full text-[13px] font-semibold leading-none border text-center whitespace-nowrap ${styles[index % 4]}`}
              >
                {pill}
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <Link
          href={whatsapp}
          target="_blank"
          className="mt-auto bg-[#052F49] hover:bg-[#063854] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 text-white text-center py-4 rounded-full text-[18px] font-semibold leading-none"
        >
          Quiero este pasaje
        </Link>

      </div>
    </div>
  );
}