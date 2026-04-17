'use client'

export type Filtro = {
  label: string
  value: string
}

export default function FiltrosGrupales({
  filtros,
  activo,
  onChange,
}: {
  filtros: Filtro[]
  activo: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {filtros.map((f) => {
        const isActive = activo === f.value

        return (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              isActive
                ? 'bg-[#0F3B4C] text-white'
                : 'border border-[#0F3B4C] text-[#0F3B4C] hover:bg-[#0F3B4C]/10'
            }`}
          >
            {f.label}
          </button>
        )
      })}
    </div>
  )
}