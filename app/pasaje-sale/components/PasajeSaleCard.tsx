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

  precio?: string;
  moneda?: string;
  precioDetalle?: string;
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
  precio,
  moneda,
  precioDetalle,
}: Props) {
  return (
    <div className="bg-[#F7F7F5] rounded-[24px] overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.06)] flex flex-col h-full border border-[#E8E8E5]">

      {/* Imagen */}
      <div className="relative h-[260px] overflow-hidden rounded-t-[24px]">

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

          <p className="text-[#0A3149] text-[17px] font-semibold leading-[1.1] tracking-[-0.03em]">
            {salida}
          </p>

          {promoBadge && (
            <div className="bg-[#dbcb3a] text-[#052F49] text-[12px] font-bold px-5 py-[11px] rounded-full whitespace-nowrap leading-none uppercase tracking-[0.03em] shadow-sm">
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
        <div className="flex flex-wrap gap-3 mb-7">
          {pills?.map((pill, index) => {

            const styles = [
              'bg-[#052F49] text-white border-[#052F49]',
              'bg-[#dbcb3a] text-[#052F49] border-[#D9CC3A]',
              'bg-[#11bcb3] text-[#FFFFFF] border-[#22B8B5]',
              'bg-[#ECEEF3] text-[#052F49] border-[#ECEEF3]',
            ]

            return (
              <div
                key={index}
                className={`px-5 py-[12px] rounded-full text-[13px] font-semibold leading-none border text-center whitespace-nowrap flex items-center justify-center min-w-fit ${styles[index % 4]}`}
              >
                {pill}
              </div>
            )
          })}
        </div>

        {/* Precio */}
        {precio && (
          <div className="mb-7">

            <p className="text-[#5B6972] text-[15px] leading-none mb-2">
              Desde
            </p>

            <h3 className="text-[#0A3149] text-[42px] font-bold leading-[0.9] tracking-[-0.05em] mb-2">
              {moneda || 'USD'} {precio}
            </h3>

            <p className="text-[#5B6972] text-[14px] leading-none">
              {precioDetalle || 'Por persona en base doble'}
            </p>

          </div>
        )}

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