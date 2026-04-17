'use client'

type Filtro = {
  label: string
  value: string
}

type Props = {
  filtros: Filtro[]
  activo: string
  onChange: (value: string) => void
}

export default function FiltrosGrupales({ filtros, activo, onChange }: Props) {
  return (
    <div className="flex justify-center mb-10">
      <div className="w-full max-w-7xl">
        <div className="flex justify-center gap-6 border-b border-gray-200">
          {filtros.map((filtro) => {
            const isActive = activo === filtro.value

            return (
              <button
                key={filtro.value}
                onClick={() => onChange(filtro.value)}
                className={`
                  relative pb-3 text-md font-medium transition-all duration-200
                  ${
                    isActive
                      ? 'text-[#0F3B4C]'
                      : 'text-gray-400 hover:text-[#0F3B4C]'
                  }
                `}
              >
                {filtro.label}
                {isActive && (
                  <span className="absolute left-0 -bottom-[1px] h-[2px] w-full bg-[#0F3B4C] transition-all duration-300 scale-x-100 origin-left" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}