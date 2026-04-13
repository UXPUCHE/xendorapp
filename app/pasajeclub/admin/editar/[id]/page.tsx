'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Home from '@/app/pasajeclub/components/Home'
import Breadcrumb from '@/app/pasajeclub/components/Breadcrumb'
import { supabase } from '@/lib/supabase'
import Toast from '@/app/pasajeclub/components/Toast'
import { AIRLINES } from '@/lib/airlines'
import html2pdf from 'html2pdf.js'

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

export default function EditorPage() {
const handleGeneratePDF = () => {
  const element = document.getElementById('pdf-content')

  if (!element) return

  html2pdf()
    .set({
      margin: 0.5,
      filename: `oferta-${ofertaDraft.destino || 'viaje'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
      },
      jsPDF: {
        unit: 'in',
        format: 'a4',
        orientation: 'portrait',
      },
    })
    .from(element)
    .save()
}
  const { id } = useParams()
  const router = useRouter()

  const [ofertaDraft, setOfertaDraft] = useState<Oferta>(initialState)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) window.location.href = '/login'
    })
  }, [])

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

  const guardarOferta = async () => {
    if (saving) return
    setSaving(true)

    const { error } = await supabase
      .from('ofertas')
      .update({
        ...ofertaDraft,
        badge: ofertaDraft.badge || null,
      })
      .eq('external_id', id)

    if (error) {
      setToast('❌ Error al actualizar')
      setSaving(false)
      return
    }

    setToast('✅ Actualizado correctamente')
    setSaving(false)

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

      <div className="px-2 space-y-8">

        <h1 className="text-3xl font-semibold text-[#0F3B4C] mb-6">
          Editar paquete ✏️
        </h1>

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
                onChange={(e:any)=>{
                  const file = e.target.files?.[0]
                  if (file) handleUpload(file)
                }}
              />
            </label>
          </div>

          <Input label="URL imagen" value={ofertaDraft.imagen || ''} onChange={(e:any)=>update('imagen',e.target.value)} />

          {ofertaDraft.imagen && (
            <img src={ofertaDraft.imagen} className="h-40 rounded-xl object-cover" />
          )}

          <div className="grid grid-cols-4 gap-4">
              <Input
                label="Precio"
                placeholder="USD 1200"
                value={ofertaDraft.precio ? ofertaDraft.precio.toLocaleString('es-AR') : ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const raw = e.target.value

                  const clean = raw.replace(/\D/g, '')

                  setOfertaDraft(prev => ({
                    ...prev,
                    precio: Number(clean),
                  }))
                }}
              />
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

        {/* VUELOS */}
        <Card title="Vuelos">
          <div className="grid grid-cols-2 gap-4">
            <Input type="date" label="Fecha inicio" value={ofertaDraft.fecha_in} onChange={(e:any)=>update('fecha_in',e.target.value)} />
            <Input type="date" label="Fecha fin" value={ofertaDraft.fecha_out} onChange={(e:any)=>update('fecha_out',e.target.value)} />
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <Select
              label="Aerolínea"
              value={ofertaDraft.vuelos.aerolinea || ''}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setOfertaDraft(prev => ({
                  ...prev,
                  vuelos: {
                    ...prev.vuelos,
                    aerolinea: e.target.value,
                  },
                }))
              }
            >
              <option value="">Seleccionar aerolínea</option>

              {AIRLINES.map((airline) => (
                <option key={airline.code} value={airline.code}>
                  {airline.name}
                </option>
              ))}
            </Select>              
            <Input label="Escalas" value={ofertaDraft.vuelos.escalas || ''} onChange={(e:any)=>setOfertaDraft(prev => ({...prev, vuelos:{...prev.vuelos, escalas:e.target.value}}))} />

            <Select label="Equipaje" value={ofertaDraft.vuelos.equipaje || ''} onChange={(e:any)=>setOfertaDraft(prev => ({...prev, vuelos:{...prev.vuelos, equipaje:e.target.value}}))}>
              <option value="">Seleccionar</option>
              <option value="mochila">🎒 Solo mochila</option>
              <option value="carry">👜 Carry + mochila</option>
              <option value="bodega">🧳 Equipaje en bodega</option>
            </Select>
          </div>
        </Card>

        {/* TRAMOS */}
        <Card title="Tramos">
          <p className="text-xs text-gray-400">IDA</p>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Origen" value={ofertaDraft.vuelos.tramos[0]?.origen} onChange={(e:any)=>updateVuelo('ida','origen',e.target.value)} />
            <Input label="Destino" value={ofertaDraft.vuelos.tramos[0]?.destino} onChange={(e:any)=>updateVuelo('ida','destino',e.target.value)} />
          </div>

          <p className="text-xs text-gray-400 mt-4">VUELTA</p>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Origen" value={ofertaDraft.vuelos.tramos[1]?.origen} onChange={(e:any)=>updateVuelo('vuelta','origen',e.target.value)} />
            <Input label="Destino" value={ofertaDraft.vuelos.tramos[1]?.destino} onChange={(e:any)=>updateVuelo('vuelta','destino',e.target.value)} />
          </div>
        </Card>

        {/* SERVICIOS */}
        <Card title="Servicios">
          <Select label="Transporte" value={ofertaDraft.servicios.transporte || ''} onChange={(e:any)=>updateServicio('transporte',e.target.value)}>
            <option value="">Seleccionar</option>
            <option value="Traslado ida y vuelta">Traslado ida y vuelta</option>
            <option value="Traslados IN/OUT">Traslados IN/OUT</option>
            <option value="Sin traslado">Sin traslado</option>
            <option value="custom">Personalizado</option>
          </Select>

          <Select label="Asistencia" value={ofertaDraft.servicios.asistencia || ''} onChange={(e:any)=>updateServicio('asistencia',e.target.value)}>
            <option value="">Seleccionar</option>
            <option value="Asistencia incluida">Asistencia incluida</option>
            <option value="Asistencia al viajero">Asistencia al viajero</option>
            <option value="Sin asistencia">Sin asistencia</option>
          </Select>

          <Select label="Otros" value={ofertaDraft.servicios.otros || ''} onChange={(e:any)=>updateServicio('otros',e.target.value)}>
            <option value="">Seleccionar</option>
            <option value="Post-venta">Post-venta</option>
            <option value="Atención personalizada">Atención personalizada</option>
          </Select>
        </Card>

        {/* BOTÓN FINAL */}
        <button
          onClick={guardarOferta}
          disabled={saving}
          className="w-full bg-[#0f3b4c] text-white px-4 py-3 rounded-lg disabled:opacity-50"
        >
          {saving ? 'Actualizando...' : 'Actualizar oferta'}
        </button>

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