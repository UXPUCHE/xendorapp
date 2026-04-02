'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Home from '@/app/components/Home'
import { supabase } from '@/lib/supabase'
import Toast from '@/app/components/Toast'

type TipoTramo = 'ida' | 'vuelta'

interface Tramo {
  tipo: TipoTramo
  origen: string
  destino: string
}

interface Vuelos {
  tramos: Tramo[]
  clase?: string
  equipaje?: string
  aerolinea?: string
  escalas?: string
}

interface Servicios {
  transporte?: string
  asistencia?: string
  otros?: string
}

interface Oferta {
  external_id: string
  destino: string
  hotel: string
  fecha_in: string
  fecha_out: string
  precio: number
  pax: string
  status: string
  imagen?: string
  badge?: string
  vuelos: Vuelos
  servicios: Servicios
  regimen?: string
}

const initialState: Oferta = {
  external_id: '',
  destino: '',
  hotel: '',
  fecha_in: '',
  fecha_out: '',
  precio: 0,
  pax: 'Base doble',
  status: 'preview',
  imagen: '',
  badge: '',
  regimen: 'All inclusive',
  vuelos: {
    tramos: [
      { tipo: 'ida', origen: '', destino: '' },
      { tipo: 'vuelta', origen: '', destino: '' },
    ],
    clase: '',
    equipaje: '',
  },
  servicios: {
    transporte: '',
    asistencia: '',
    otros: '',
  },
}

/* UI */

const Input = ({ label, ...props }: any) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-xs text-[#0f3b4c]">{label}</label>
    <input
      className="border border-gray-300 bg-white p-2 rounded-lg text-gray-800 focus:ring-2 focus:ring-[#00A99D]"
      {...props}
    />
  </div>
)

const Select = ({ label, children, ...props }: any) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-xs text-[#0f3b4c]">{label}</label>
    <select
      className="border border-gray-300 bg-white p-2 rounded-lg text-gray-800 focus:ring-2 focus:ring-[#00A99D]"
      {...props}
    >
      {children}
    </select>
  </div>
)

const Card = ({ title, children }: any) => (
  <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
    <h3 className="font-semibold text-lg text-[#0f3b4c]">{title}</h3>
    {children}
  </div>
)

/* COMPONENT */

export default function EditorPage() {
  const { id } = useParams()
  const router = useRouter()

  const [ofertaDraft, setOfertaDraft] = useState<Oferta>(initialState)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  /* AUTO HIDE TOAST */
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(timer)
  }, [toast])

  /* AUTH */
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) window.location.href = '/login'
    })
  }, [])

  /* LOAD DATA */
  useEffect(() => {
    if (!id) return

    const fetchOferta = async () => {
      const { data, error } = await supabase
        .from('ofertas')
        .select('*')
        .eq('external_id', id)
        .single()

      if (data) {
        setOfertaDraft({
          ...initialState,
          ...data,
          vuelos: {
            ...initialState.vuelos,
            ...data.vuelos,
          },
          servicios: {
            ...initialState.servicios,
            ...data.servicios,
          },
        })
      }

      if (error) console.error(error)
    }

    fetchOferta()
  }, [id])

  const update = (field: keyof Oferta, value: any) => {
    setOfertaDraft(prev => ({ ...prev, [field]: value }))
  }

  const updateVuelo = (tipo: TipoTramo, field: keyof Tramo, value: string) => {
    setOfertaDraft(prev => ({
      ...prev,
      vuelos: {
        ...prev.vuelos,
        tramos: prev.vuelos.tramos.map(t =>
          t.tipo === tipo ? { ...t, [field]: value } : t
        ),
      },
    }))
  }

  const updateServicio = (field: keyof Servicios, value: string) => {
    setOfertaDraft(prev => ({
      ...prev,
      servicios: { ...prev.servicios, [field]: value },
    }))
  }

  /* SAVE */
  const guardarOferta = async () => {
    const { error } = await supabase
      .from('ofertas')
      .update({
        ...ofertaDraft,
        badge: ofertaDraft.badge || null,
      })
      .eq('external_id', id)

    if (error) {
      setToast('❌ Error al actualizar')
      return
    }

    setToast('✅ Actualizado correctamente')

    setTimeout(() => {
      router.push('/admin/editar')
    }, 800)
  }

  const handleUpload = async (file: File) => {
    setUploading(true)

    const ext = file.name.split('.').pop()
    const fileName = `ofertas/${crypto.randomUUID()}.${ext}`

    const { error } = await supabase.storage
      .from('PCIMG')
      .upload(fileName, file)

    if (error) {
      setToast('❌ Error subiendo imagen')
      setUploading(false)
      return
    }

    const { data } = supabase.storage
      .from('PCIMG')
      .getPublicUrl(fileName)

    update('imagen', data.publicUrl)
    setUploading(false)
  }

  return (
    <div className="grid grid-cols-2 min-h-screen bg-[#F6F8FB]">

      {/* FORM */}
      <div className="p-10 space-y-8 overflow-auto max-w-2xl mx-auto">

        <h2 className="text-2xl font-bold text-[#0f3b4c]">
          Editar paquete ✏️
        </h2>

        <button
          onClick={guardarOferta}
          className="bg-[#0f3b4c] text-white px-4 py-2 rounded-lg"
        >
          Actualizar oferta
        </button>

        {/* BASICO */}
        <Card title="Básico">
          <Input label="Destino" value={ofertaDraft.destino} onChange={(e:any)=>update('destino',e.target.value)} />
          <Input label="Hotel" value={ofertaDraft.hotel} onChange={(e:any)=>update('hotel',e.target.value)} />

          <div className="flex flex-col gap-2">
            <label className="text-xs text-[#0f3b4c]">Subir imagen</label>

            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-[#0f3b4c] text-[#0f3b4c] rounded-lg p-4 cursor-pointer hover:bg-[#0f3b4c]/5 transition">
              <span className="text-sm font-medium">
                {uploading ? 'Subiendo...' : 'Seleccionar archivo'}
              </span>

              <input
                type="file"
                className="hidden"
                onChange={(e: any) => {
                  const file = e.target.files?.[0]
                  if (file) handleUpload(file)
                }}
              />
            </label>
          </div>

          <Input
            label="URL imagen"
            value={ofertaDraft.imagen || ''}
            onChange={(e:any)=>update('imagen',e.target.value)}
          />

          {ofertaDraft.imagen && (
            <img src={ofertaDraft.imagen} className="h-40 rounded-xl object-cover" />
          )}

          <div className="grid grid-cols-4 gap-4">
            <Input label="Precio" value={ofertaDraft.precio} onChange={(e:any)=>update('precio',Number(e.target.value))} />

            <Select label="Base" value={ofertaDraft.pax} onChange={(e:any)=>update('pax',e.target.value)}>
              <option>Base single</option>
              <option>Base doble</option>
              <option>Family Plan</option>
            </Select>

            <Select label="Régimen" value={ofertaDraft.regimen} onChange={(e:any)=>update('regimen',e.target.value)}>
              <option>All inclusive</option>
              <option>Media pensión</option>
              <option>Desayuno</option>
              <option>Solo alojamiento</option>
            </Select>

            <Select label="Badge" value={ofertaDraft.badge || ''} onChange={(e:any)=>update('badge',e.target.value)}>
              <option value="">Sin badge</option>
              <option value="recomendado">⭐ Recomendado</option>
              <option value="mejor oferta">💸 Mejor oferta</option>
              <option value="últimos">🔥 Últimos cupos</option>
              <option value="descuento">🏷️ Descuento</option>
            </Select>
          </div>
        </Card>

      </div>

      {/* PREVIEW */}
      <div className="bg-[#F5F5F5] overflow-auto">
        <Home destino={ofertaDraft.destino || 'punta-cana'} overrideOfertas={[ofertaDraft]} />
      </div>

      {/* TOAST */}
      {toast && <Toast message={toast} />}
    </div>
  )
}