'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import Home from '@/app/pasajeclub/components/Home'
import Breadcrumb from '@/app/pasajeclub/components/Breadcrumb'
import { supabase } from '@/lib/supabase'
import Toast from '@/app/pasajeclub/components/Toast'

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

  aerolinea?: string // 👈 NUEVO
  escalas?: string // 👈 texto libre tipo “1 escala en LIM”
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
  badge?: string // ✅ FIX
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

type InputProps = {
  label: string
} & React.InputHTMLAttributes<HTMLInputElement>

const Input = ({ label, ...props }: InputProps) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-xs text-[#0f3b4c]">{label}</label>
    <input
      className="border border-gray-300 bg-white p-2 rounded-lg 
      text-gray-800
      focus:outline-none focus:ring-2 focus:ring-[#00A99D]
      placeholder:text-gray-500"
      {...props}
    />
  </div>
)

type SelectProps = {
  label: string
  children: React.ReactNode
} & React.SelectHTMLAttributes<HTMLSelectElement>

const Select = ({ label, children, ...props }: SelectProps) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-xs text-[#0f3b4c]">{label}</label>
    <select
      className="border border-gray-300 bg-white p-2 rounded-lg 
      text-gray-800
      focus:outline-none focus:ring-2 focus:ring-[#00A99D]"
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

export default function CrearPage() {
  const [ofertaDraft, setOfertaDraft] = useState<Oferta>(initialState)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  // 🔐 USER
  const [user, setUser] = useState<any>(null)

  // 🔐 PROTECCIÓN
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = '/login'
      } else {
        setUser(data.user)
      }
    })
  }, [])

  useEffect(() => {
  if (!toast) return

  const timer = setTimeout(() => {
    setToast(null)
  }, 2500)

  return () => clearTimeout(timer)
}, [toast])

  // 🚪 LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const update = <K extends keyof Oferta>(field: K, value: Oferta[K]) => {
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

      const guardarOferta = async () => {
        if (saving) return
        setSaving(true)

      const { data: { user } } = await supabase.auth.getUser()

      const { data, error } = await supabase.from('ofertas').insert([{
        ...ofertaDraft,
        created_by: user?.id, // ✅ ESTE ES EL FIX
        badge: ofertaDraft.badge || null,
        destino: ofertaDraft.destino.toLowerCase().replace(/\s+/g, '-'),
        external_id: crypto.randomUUID(),
        status: 'publicado'
      }])

      console.log('ERROR:', error)

      if (error) {
        setToast('Error al guardar ❌')
        setSaving(false)
        return
      }

      setToast('🚀 Publicado con éxito')
      setSaving(false)
    }

  const handleUpload = async (file: File) => {
    setUploading(true)

    const ext = file.name.split('.').pop()
    const fileName = `ofertas/${crypto.randomUUID()}.${ext}`

    await supabase.storage.from('PCIMG').upload(fileName, file)

    const { data } = supabase.storage.from('PCIMG').getPublicUrl(fileName)
    update('imagen', data.publicUrl)

    setUploading(false)
  }

  return (
    <div className="min-h-screen">

      {/* LEFT */}
      <div className="px-2 space-y-8">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div className="flex flex-col">

          <h1 className="text-3xl font-semibold text-[#0F3B4C] mb-0">
            Crear paquete ✈️
          </h1>
        </div>
     </div>

        {/* BASICO */}
        <Card title="Básico">
          <Input label="Destino" placeholder="Ej: Punta Cana" onChange={(e)=>update('destino',e.target.value)} />
          <Input label="Hotel" placeholder="Ej: Hard Rock" onChange={(e)=>update('hotel',e.target.value)} />

          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#0f3b4c]">Subir imagen</label>

            <label className="flex items-center justify-center gap-2 
              border-2 border-dashed border-[#0f3b4c] 
              text-[#0f3b4c] 
              rounded-lg p-4 cursor-pointer 
              hover:bg-[#0f3b4c]/5 transition">

              <span className="text-sm font-medium">
                Seleccionar archivo
              </span>

              <input
                type="file"
                className="hidden"
                onChange={(e:any)=>{
                  const f = e.target.files?.[0]
                  if(f) handleUpload(f)
                }}
              />
            </label>
          </div>

          <Input label="URL imagen" placeholder="https://..." onChange={(e)=>update('imagen',e.target.value)} />

          {uploading && <p>Subiendo...</p>}
          {ofertaDraft.imagen && <img src={ofertaDraft.imagen} className="h-40 rounded-xl" />}

          <div className="grid grid-cols-4 gap-4">
            <Input label="Precio" placeholder="USD 1200" onChange={(e)=>update('precio',Number(e.target.value))} />

            <Select label="Base" onChange={(e)=>update('pax',e.target.value)}>
              <option>Base single</option>
              <option>Base doble</option>
              <option>Family Plan</option>
            </Select>

            <Select label="Régimen" onChange={(e)=>update('regimen',e.target.value)}>
              <option>All inclusive</option>
              <option>Media pensión</option>
              <option>Desayuno</option>
              <option>Solo alojamiento</option>
            </Select>

            <Select
                label="Badge"
                value={ofertaDraft.badge || ''}
                onChange={(e) => update('badge', e.target.value)}
              >
                <option value="">Sin badge</option>
                <option value="recomendado">⭐ Recomendado</option>
                <option value="mejor oferta">💸 Mejor oferta</option>
                <option value="últimos">🔥 Últimos cupos</option>
                <option value="descuento">🏷️ Descuento</option>
              </Select>
          </div>
        </Card>
        
              <Card title="Vuelos">

                {/* FECHAS */}
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Fecha inicio" type="date" onChange={(e) => update('fecha_in', e.target.value)} />
                  <Input label="Fecha fin" type="date" onChange={(e) => update('fecha_out', e.target.value)} />
                </div>

                {/* INFO GENERAL VUELO 👇 NUEVO */}
                <div className="grid grid-cols-3 gap-4 mt-4">

                  <Input
                    label="Aerolínea"
                    placeholder="Ej: LATAM"
                    onChange={(e) =>
                      setOfertaDraft(prev => ({
                        ...prev,
                        vuelos: {
                          ...prev.vuelos,
                          aerolinea: e.target.value,
                        },
                      }))
                    }
                  />

                  <Input
                    label="Escalas"
                    placeholder="Ej: 1 escala en Lima"
                    onChange={(e) =>
                      setOfertaDraft(prev => ({
                        ...prev,
                        vuelos: {
                          ...prev.vuelos,
                          escalas: e.target.value,
                        },
                      }))
                    }
                  />

                  <Select
                    label="Equipaje"
                    onChange={(e) =>
                      setOfertaDraft(prev => ({
                        ...prev,
                        vuelos: {
                          ...prev.vuelos,
                          equipaje: e.target.value,
                        },
                      }))
                    }
                  >
                    <option value="">Seleccionar</option>
                    <option value="mochila">🎒 Solo mochila</option>
                    <option value="carry">👜 Carry + mochila</option>
                    <option value="bodega">🧳 Equipaje en bodega</option>
                  </Select>

                </div>

              </Card>

        {/* VUELOS */}
        <Card title="Vuelos">
          <p className="text-xs text-gray-400">IDA</p>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Origen" placeholder="EZE" onChange={(e)=>updateVuelo('ida','origen',e.target.value)} />
            <Input label="Destino" placeholder="PUJ" onChange={(e)=>updateVuelo('ida','destino',e.target.value)} />
          </div>

          <p className="text-xs text-gray-400 mt-4">VUELTA</p>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Origen" placeholder="PUJ" onChange={(e)=>updateVuelo('vuelta','origen',e.target.value)} />
            <Input label="Destino" placeholder="EZE" onChange={(e)=>updateVuelo('vuelta','destino',e.target.value)} />
          </div>
        </Card>

        {/* SERVICIOS */}
        <Card title="Servicios">

          <Select label="Transporte" onChange={(e)=>updateServicio('transporte',e.target.value)}>
            <option value="">Seleccionar</option>
            <option value="Traslado ida y vuelta">Traslado ida y vuelta</option>
            <option value="Traslados IN/OUT">Traslados IN/OUT</option>
            <option value="Sin traslado">Sin traslado</option>
            <option value="custom">Personalizado</option>
          </Select>

          {ofertaDraft.servicios.transporte === 'custom' && (
            <Input placeholder="Ej: traslado privado VIP" label="Personalizado" onChange={(e)=>updateServicio('transporte',e.target.value)} />
          )}

          <Select label="Asistencia" onChange={(e)=>updateServicio('asistencia',e.target.value)}>
            <option value="">Seleccionar</option>
            <option value="Asistencia incluida">Asistencia incluida</option>
            <option value="Asistencia al viajero">Asistencia al viajero</option>
            <option value="Sin asistencia">Sin asistencia</option>
            <option value="custom">Personalizado</option>
          </Select>

          {ofertaDraft.servicios.asistencia === 'custom' && (
            <Input placeholder="Ej: Assist Card 150k" label="Personalizado" onChange={(e)=>updateServicio('asistencia',e.target.value)} />
          )}

          <Select label="Otros" onChange={(e)=>updateServicio('otros',e.target.value)}>
            <option value="">Seleccionar</option>
            <option value="Post-venta">Post-venta</option>
            <option value="Atención personalizada">Atención personalizada</option>
            <option value="custom">Personalizado</option>
          </Select>

          {ofertaDraft.servicios.otros === 'custom' && (
            <Input placeholder="Ej: upgrades, beneficios..." label="Personalizado" onChange={(e)=>updateServicio('otros',e.target.value)} />
          )}

        </Card>

        <button
          onClick={guardarOferta}
          disabled={saving}
          className="w-full bg-[#0f3b4c] text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar oferta'}
        </button>

      </div>

    {/* PREVIEW */}
    <div className="mt-10">
      <h3 className="text-lg font-semibold text-[#0f3b4c] mb-4">
        Preview
      </h3>

      <div className="rounded-2xl p-6">
        <Home
          destino={ofertaDraft.destino || 'punta-cana'}
          overrideOfertas={[ofertaDraft]}
        />
      </div>
    </div>

      {toast && <Toast message={toast} />}
    </div>
  )
}