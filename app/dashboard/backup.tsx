'use client'

import { useState, ChangeEvent } from 'react'
import Home from '../page'
import { supabase } from '@/lib/supabase'

type TipoTramo = 'ida' | 'vuelta'

interface Tramo {
  tipo: TipoTramo
  origen: string
  destino: string
  salida: string
  llegada: string
}

interface Vuelos {
  tramos: Tramo[]
  clase?: string
  equipaje?: string
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
      { tipo: 'ida', origen: '', destino: '', salida: '', llegada: '' },
      { tipo: 'vuelta', origen: '', destino: '', salida: '', llegada: '' },
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

export default function Dashboard() {
  const [ofertaDraft, setOfertaDraft] = useState<Oferta>(initialState)
  const [uploading, setUploading] = useState(false)

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

    const { error } = await supabase.from('ofertas').insert([{
      ...ofertaDraft,
      badge: ofertaDraft.badge || null, // 👈 vuelve a incluirlo
      destino: ofertaDraft.destino.toLowerCase().replace(/\s+/g, '-'),
      external_id: crypto.randomUUID(),
      status: 'publicado'
    }])

    if (error) {
      console.error(error)
      return alert('Error al guardar')
    }

    alert('Guardado 🚀')
  }

  const handleUpload = async (file: File) => {
    setUploading(true)

    const ext = file.name.split('.').pop() // ✅ FIX
    const fileName = `ofertas/${crypto.randomUUID()}.${ext}`

    await supabase.storage.from('PCIMG').upload(fileName, file)

    const { data } = supabase.storage.from('PCIMG').getPublicUrl(fileName)
    update('imagen', data.publicUrl)

    setUploading(false)
  }

  return (
    <div className="grid grid-cols-2 min-h-screen bg-[#F6F8FB]">

      {/* LEFT */}
      <div className="p-10 space-y-8 overflow-auto max-w-2xl mx-auto">

        <h2 className="text-2xl font-bold text-[#0f3b4c]">Configurador</h2>

        <button onClick={guardarOferta} className="bg-[#0f3b4c] text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
          Guardar oferta
        </button>

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

          <div className="grid grid-cols-4 gap-4"> {/* ✅ FIX */}
            <Input label="Precio" placeholder="USD 1200" onChange={(e)=>update('precio',Number(e.target.value))} />

            <Select label="Base" onChange={(e)=>update('pax',e.target.value)}>
              <option>Base doble</option>
              <option>Base triple</option>
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
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Fecha inicio"
              type="date"
              onChange={(e) => update('fecha_in', e.target.value)}
            />

            <Input
              label="Fecha fin"
              type="date"
              onChange={(e) => update('fecha_out', e.target.value)}
            />
          </div>
        </Card>

        {/* VUELOS */}
        <Card title="Vuelos">
          <p className="text-xs text-gray-400">IDA</p>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Origen" placeholder="EZE" onChange={(e)=>updateVuelo('ida','origen',e.target.value)} />
            <Input label="Destino" placeholder="PUJ" onChange={(e)=>updateVuelo('ida','destino',e.target.value)} />
            <Input label="Salida" placeholder="10:00" onChange={(e)=>updateVuelo('ida','salida',e.target.value)} />
            <Input label="Llegada" placeholder="16:00" onChange={(e)=>updateVuelo('ida','llegada',e.target.value)} />
          </div>

          <p className="text-xs text-gray-400 mt-4">VUELTA</p>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Origen" placeholder="PUJ" onChange={(e)=>updateVuelo('vuelta','origen',e.target.value)} />
            <Input label="Destino" placeholder="EZE" onChange={(e)=>updateVuelo('vuelta','destino',e.target.value)} />
            <Input label="Salida" placeholder="18:00" onChange={(e)=>updateVuelo('vuelta','salida',e.target.value)} />
            <Input label="Llegada" placeholder="02:00" onChange={(e)=>updateVuelo('vuelta','llegada',e.target.value)} />
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

      </div>

      {/* PREVIEW */}
      <div className="bg-[#F5F5F5] overflow-auto">
        <Home destino={ofertaDraft.destino || 'punta-cana'} overrideOfertas={[ofertaDraft]} />
      </div>

    </div>
  )
}