'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import Home from '@/app/pasajeclub/components/Home'
import Breadcrumb from '@/app/pasajeclub/components/Breadcrumb'
import { supabase } from '@/lib/supabase'
import Toast from '@/app/pasajeclub/components/Toast'
import { AIRLINES } from '@/lib/airlines'

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
  escalas_ida?: string
  escalas_vuelta?: string
}

interface Servicios {
  transporte?: string
  transporteCustom?: string
  asistencia?: string
  asistenciaCustom?: string
  otros?: string
  otrosCustom?: string 
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
  estrellas?: number
}

const initialState: Oferta = {
  external_id: '',
  destino: '',
  hotel: '',
  fecha_in: '',
  fecha_out: '',
  precio: 0,
  estrellas: 3,
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

    // 👇 NUEVO
    escalas_ida: '',
    escalas_vuelta: '',
  },
  servicios: {
    transporte: '',
    transporteCustom: '',
    asistencia: '',
    asistenciaCustom: '',
    otros: '',
    otrosCustom: '',
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

const handleGeneratePDF = async () => {
  const html2pdf = (await import('html2pdf.js')).default

  const element = document.createElement('div')

  // 🔥 FIX IMAGEN (anti cache + CORS)
  const imageUrl = ofertaDraft.imagen
    ? ofertaDraft.imagen + '?t=' + Date.now()
    : 'https://placehold.co/800x400'

  const origenIda = ofertaDraft.vuelos.tramos[0]?.origen || '-'
  const destinoIda = ofertaDraft.vuelos.tramos[0]?.destino || '-'
  const origenVuelta = ofertaDraft.vuelos.tramos[1]?.origen || '-'
  const destinoVuelta = ofertaDraft.vuelos.tramos[1]?.destino || '-'

  element.innerHTML = `
    <div style="width:800px;font-family:Arial;background:#f4f6f8;color:#0F3B4C;">

      <!-- HERO -->
      <div style="position:relative;height:340px;overflow:hidden;border-bottom-left-radius:20px;border-bottom-right-radius:20px;">

        <img 
          src="${imageUrl}" 
          crossorigin="anonymous"
          style="width:100%;height:100%;object-fit:cover;"
        />

        <div style="
          position:absolute;
          inset:0;
          background:linear-gradient(
            to top, 
            rgba(0,0,0,0.85), 
            rgba(0,0,0,0.4)
          );
        "></div>

        <div style="
          position:absolute;
          bottom:25px;
          left:25px;
          color:white;
        ">
          <h1 style="margin:0;font-size:34px;font-weight:bold;letter-spacing:-0.5px;">
            ${ofertaDraft.destino || 'Destino'}
          </h1>

          <p style="margin:5px 0 0 0;font-size:18px;opacity:0.9;">
            ${ofertaDraft.hotel || ''}
          </p>
        </div>

      </div>

      <!-- CONTENT -->
      <div style="padding:30px;">

        <!-- PRECIO -->
        <div style="
          background:#0F3B4C;
          color:white;
          padding:25px;
          border-radius:16px;
          text-align:center;
          margin-bottom:30px;
        ">
          <p style="margin:0;font-size:14px;opacity:0.7;">Desde</p>

          <p style="
            margin:0;
            font-size:44px;
            font-weight:bold;
            letter-spacing:-1px;
          ">
            USD ${ofertaDraft.precio || 0}
          </p>

          <p style="margin:0;font-size:14px;">
            por persona en ${ofertaDraft.pax}
          </p>
        </div>

        <!-- GRID -->
        <div style="display:flex;gap:20px;">

          <!-- VUELOS -->
          <div style="
            flex:1;
            background:white;
            padding:20px;
            border-radius:16px;
            border:1px solid #e5e7eb;
          ">
            <h3 style="margin-top:0;font-size:18px;">✈️ Vuelos</h3>

            <p style="font-size:20px;font-weight:bold;margin:6px 0;">
              ${origenIda} → ${destinoIda}
            </p>

            <p style="font-size:20px;font-weight:bold;margin:6px 0;">
              ${origenVuelta} → ${destinoVuelta}
            </p>

            <div style="margin-top:10px;font-size:13px;color:#555;">
              <p style="margin:2px 0;">Aerolínea: ${ofertaDraft.vuelos.aerolinea || '-'}</p>
              <p style="margin:2px 0;">Equipaje: ${ofertaDraft.vuelos.equipaje || '-'}</p>
              <p style="margin:2px 0;">Escalas: ${ofertaDraft.vuelos.escalas || '-'}</p>
            </div>
          </div>

          <!-- SERVICIOS -->
          <div style="
            flex:1;
            background:white;
            padding:20px;
            border-radius:16px;
            border:1px solid #e5e7eb;
          ">
            <h3 style="margin-top:0;font-size:18px;">🏨 Incluye</h3>

            <p style="margin:8px 0;">✔ ${ofertaDraft.servicios.transporte || '-'}</p>
            <p style="margin:8px 0;">✔ ${ofertaDraft.servicios.asistencia || '-'}</p>
            <p style="margin:8px 0;">✔ ${ofertaDraft.servicios.otros || '-'}</p>
          </div>

        </div>

        <!-- CTA -->
        <div style="
          margin-top:30px;
          background:#00A99D;
          color:white;
          text-align:center;
          padding:18px;
          border-radius:12px;
          font-weight:bold;
          font-size:16px;
        ">
          Consultar disponibilidad por WhatsApp ✈️
        </div>

        <!-- FOOTER -->
        <div style="margin-top:20px;text-align:center;">
          <p style="font-size:12px;color:#666;">
            Propuesta sujeta a disponibilidad al momento de la reserva.
          </p>

          <p style="font-size:12px;color:#999;margin-top:10px;">
            Pasaje Club ✈️
          </p>
        </div>

      </div>
    </div>
  `

  document.body.appendChild(element)

  await html2pdf()
    .set({
      margin: 0,
      filename: `oferta-${ofertaDraft.destino || 'viaje'}.pdf`,
      html2canvas: {
        scale: 2,
        useCORS: true,
      },
      jsPDF: {
        unit: 'px',
        format: [800, 1200],
      },
    })
    .from(element)
    .save()

  document.body.removeChild(element)
}
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

      const serviciosFinal = {
        ...ofertaDraft.servicios,
          transporte:
          ofertaDraft.servicios.transporte === 'custom'
            ? ofertaDraft.servicios.transporteCustom
            : ofertaDraft.servicios.transporte,

          asistencia:
            ofertaDraft.servicios.asistencia === 'custom'
              ? ofertaDraft.servicios.asistenciaCustom
              : ofertaDraft.servicios.asistencia,
          otros:
            ofertaDraft.servicios.otros === 'custom'
              ? ofertaDraft.servicios.otrosCustom
              : ofertaDraft.servicios.otros,
      }

      const { data, error } = await supabase.from('ofertas').insert([{
        ...ofertaDraft,
        servicios: serviciosFinal, // 👈 importante
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
            <Input
              label="Precio"
              placeholder="USD 1200"
              value={ofertaDraft.precio ? ofertaDraft.precio.toLocaleString('es-AR') : ''}
              onChange={(e) => {
                const raw = e.target.value

                // eliminar todo lo que no sea número
                const clean = raw.replace(/\D/g, '')

                update('precio', Number(clean))
              }}
            />
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

              <Select
              label="Estrellas"
              value={ofertaDraft.estrellas || 3}
              onChange={(e) => update('estrellas', Number(e.target.value))}
            >
              <option value={1}>⭐ 1 estrella</option>
              <option value={2}>⭐⭐ 2 estrellas</option>
              <option value={3}>⭐⭐⭐ 3 estrellas</option>
              <option value={4}>⭐⭐⭐⭐ 4 estrellas</option>
              <option value={5}>⭐⭐⭐⭐⭐ 5 estrellas</option>
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

                <Select
                  label="Aerolínea"
                  value={ofertaDraft.vuelos.aerolinea || ''}
                  onChange={(e) =>
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
                  <option value="custom">Otra aerolínea</option>
                </Select>

                {ofertaDraft.vuelos.aerolinea === 'custom' && (
                  <Input
                    label="Aerolínea personalizada"
                    placeholder="Ej: Arajet"
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
                )}

                  <Input
                    label="Escala ida"
                    placeholder="Ej: 1 escala en Lima"
                    onChange={(e) =>
                      setOfertaDraft(prev => ({
                        ...prev,
                        vuelos: {
                          ...prev.vuelos,
                          escalas_ida: e.target.value,
                        },
                      }))
                    }
                  />

                  <Input
                    label="Escala vuelta"
                    placeholder="Ej: Directo"
                    onChange={(e) =>
                      setOfertaDraft(prev => ({
                        ...prev,
                        vuelos: {
                          ...prev.vuelos,
                          escalas_vuelta: e.target.value,
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
                    <option value="carry">👜 Carry on + mochila</option>
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
            <Input
              label="Personalizado"
              placeholder="Ej: traslado privado VIP"
              value={ofertaDraft.servicios.transporteCustom || ''}
              onChange={(e:any) =>
                setOfertaDraft(prev => ({
                  ...prev,
                  servicios: {
                    ...prev.servicios,
                    transporteCustom: e.target.value,
                  }
                }))
              }
            />
          )}
          <Select label="Asistencia" onChange={(e)=>updateServicio('asistencia',e.target.value)}>
            <option value="">Seleccionar</option>
            <option value="Asistencia incluida">Asistencia incluida</option>
            <option value="Asistencia al viajero">Asistencia al viajero</option>
            <option value="Sin asistencia">Sin asistencia</option>
            <option value="custom">Personalizado</option>
          </Select>

          {ofertaDraft.servicios.asistencia === 'custom' && (
            <Input
              label="Personalizado"
              placeholder="Ej: Assist Card 150k"
              value={ofertaDraft.servicios.asistenciaCustom || ''}
              onChange={(e:any) =>
                setOfertaDraft(prev => ({
                  ...prev,
                  servicios: {
                    ...prev.servicios,
                    asistenciaCustom: e.target.value,
                  }
                }))
              }
            />
          )}

          <Select label="Otros" onChange={(e)=>updateServicio('otros',e.target.value)}>
            <option value="">Seleccionar</option>
            <option value="Post-venta">Post-venta</option>
            <option value="Atención personalizada">Atención personalizada</option>
            <option value="custom">Personalizado</option>
          </Select>

          {ofertaDraft.servicios.otros === 'custom' && (
            <Input
              label="Personalizado"
              placeholder="Ej: upgrades, beneficios..."
              value={ofertaDraft.servicios.otrosCustom || ''}
              onChange={(e:any) =>
                setOfertaDraft(prev => ({
                  ...prev,
                  servicios: {
                    ...prev.servicios,
                    otrosCustom: e.target.value, // 👈 YA NO TOCA "otros"
                  }
                }))
              }
            />
          )}

        </Card>

        <button
          onClick={guardarOferta}
          disabled={saving}
          className="w-full bg-[#0f3b4c] text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar oferta'}
        </button>
 {/*
      <button
        onClick={() => {
          console.log('CLICK OK')
          handleGeneratePDF()
        }}
        className="relative z-50 w-full bg-[#00A99D] text-white px-4 py-3 rounded-lg mt-3"
      >
        Generar PDF
      </button>
*/}
      </div>

    {/* PREVIEW */}
    <div className="mt-10">
      <h3 className="text-lg font-semibold text-[#0f3b4c] mb-4">
        Preview
      </h3>

      <div className="rounded-2xl p-6">
        <div id="pdf-content">
          <Home
            destino={ofertaDraft.destino || 'punta-cana'}
            overrideOfertas={[ofertaDraft]}
          />
        </div>
      </div>
    </div>

      {toast && <Toast message={toast} />}
    </div>
  )
}