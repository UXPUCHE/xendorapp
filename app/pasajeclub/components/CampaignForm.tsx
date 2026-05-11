'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import PasajeSaleCard from '@/app/pasaje-sale/components/PasajeSaleCard'

type InitialData = {
  id?: string
  destino?: string
  salida?: string
  descripcion?: string
  badge?: string
  promo_badge?: string
  imagen?: string
  pills?: string[]
  precio?: string
  moneda?: string
  precio_detalle?: string
}

type Props = {
  slug: string
  initialData?: InitialData
  isEdit?: boolean
}

type InputProps = {
  label: string
} & React.InputHTMLAttributes<HTMLInputElement>

const Input = ({ label, ...props }: InputProps) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-xs text-[#0f3b4c]">{label}</label>

    <input
      className="
        border border-gray-300
        bg-white
        p-2
        rounded-lg
        text-gray-800
        focus:outline-none
        focus:ring-2
        focus:ring-[#00A99D]
        placeholder:text-gray-500
      "
      {...props}
    />
  </div>
)

const Card = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
    <h3 className="font-semibold text-lg text-[#0f3b4c]">
      {title}
    </h3>

    {children}
  </div>
)

export default function CampaignForm({
  slug,
  initialData,
  isEdit,
}: Props) {

  const [destino, setDestino] = useState(initialData?.destino || '')

  const [salida, setSalida] = useState(
    initialData?.salida || ''
  )

  const [descripcion, setDescripcion] = useState(
    initialData?.descripcion || ''
  )

  const [badge, setBadge] = useState(initialData?.badge || '')

  const [promoBadge, setPromoBadge] = useState(
    initialData?.promo_badge || ''
  )

  const [imagen, setImagen] = useState(initialData?.imagen || '')

  const [pills, setPills] = useState<string[]>(
    initialData?.pills || [
      'All Inclusive',
      'Pasajes',
      'Traslados',
      'Alojamiento',
    ]
  )

  const [pillInput, setPillInput] = useState('')

  const [precio, setPrecio] = useState(
    initialData?.precio || ''
  )

  const [moneda, setMoneda] = useState(
    initialData?.moneda || 'USD'
  )

  const [precioDetalle, setPrecioDetalle] = useState(
    initialData?.precio_detalle || 'Por persona en base doble'
  )

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const whatsappMessage = encodeURIComponent(
    `Hola! 👋 Vi una oferta en PASAJE SALE y quiero consultar por ${destino || 'Aruba'} ✈️`
  )

  const whatsappLink = `https://wa.me/5493518613773?text=${whatsappMessage}`

  const handleUpload = async (file: File) => {
    try {
      setUploading(true)

      const ext = file.name.split('.').pop()
      const fileName = `sale-cards/${crypto.randomUUID()}.${ext}`

      const { error } = await supabase
        .storage
        .from('PCIMG')
        .upload(fileName, file)

      if (error) {
        console.error(error)
        alert('Error subiendo imagen')
        return
      }

      const { data } = supabase
        .storage
        .from('PCIMG')
        .getPublicUrl(fileName)

      setImagen(data.publicUrl)

    } catch (err) {
      console.error(err)
      alert('Error inesperado subiendo imagen')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)

      const payload = {
        titulo: destino,
        subtitulo: descripcion,

        destino,
        salida,
        descripcion,
        badge,
        promo_badge: promoBadge,
        pills,
        precio,
        moneda,
        precio_detalle: precioDetalle,
        imagen,
        whatsapp: whatsappLink,
        campaign: slug,
      }

      const query = isEdit
        ? supabase
            .from('sale_cards')
            .update(payload)
            .eq('id', initialData?.id)
        : supabase
            .from('sale_cards')
            .insert(payload)

      const { error } = await query

      if (error) {
        console.error(error)

        alert(
          JSON.stringify(error, null, 2)
        )

        return
      }

      alert(isEdit ? 'Oferta actualizada 🚀' : 'Oferta creada 🚀')

      setDestino('')
      setSalida('')
      setDescripcion('')
      setBadge('')
      setPromoBadge('')
      setImagen('')

      setPills([
        'All Inclusive',
        'Pasajes',
        'Traslados',
        'Alojamiento',
      ])

      setPrecio('')
      setMoneda('USD')
      setPrecioDetalle('Por persona en base doble')

    } catch (err) {
      console.error(err)
      alert('Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">

      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-[#00A99D] mb-2">
          {isEdit ? 'Editar oferta' : 'Nueva oferta'}
        </p>

        <h1 className="text-4xl font-semibold text-[#0F3B4C]">
          {slug}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        <Card title="Información básica">

          <Input
            label="Destino"
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            placeholder="Ej: Aruba"
          />

          <Input
            label="Salida"
            value={salida}
            onChange={(e) => setSalida(e.target.value)}
            placeholder="Ej: Córdoba"
          />

          <Input
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Todo incluido + pasajes + traslados + alojamiento"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Input
              label="Badge"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="HOT SALE"
            />

            <Input
              label="Promo badge"
              value={promoBadge}
              onChange={(e) => setPromoBadge(e.target.value)}
              placeholder="Hasta 55% OFF"
            />

          </div>

          <div className="space-y-3">

            <label className="text-xs text-[#0f3b4c]">
              Pills
            </label>

            <div className="flex gap-2">
              <input
                value={pillInput}
                onChange={(e) => setPillInput(e.target.value)}
                placeholder="Ej: Pasajes"
                className="flex-1 border border-gray-300 bg-white p-2 rounded-lg text-gray-800"
              />

              <button
                type="button"
                onClick={() => {
                  if (!pillInput.trim()) return

                  setPills([...pills, pillInput.trim()])
                  setPillInput('')
                }}
                className="bg-[#0f3b4c] text-white px-4 rounded-lg"
              >
                Agregar
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {pills.map((pill, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setPills(pills.filter((_, i) => i !== index))
                  }}
                  className="bg-[#F3F3F3] border border-[#DEDEDE] px-4 py-2 rounded-full text-sm text-[#0A3149]"
                >
                  {pill} ×
                </button>
              ))}
            </div>

          </div>

          <div className="space-y-4">

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!precio}
                onChange={(e) => {
                  if (!e.target.checked) {
                    setPrecio('')
                  } else {
                    setPrecio('3000')
                  }
                }}
              />

              <label className="text-sm text-[#0A3149] font-medium">
                Mostrar precio en la card
              </label>
            </div>

            {precio && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <Input
                  label="Precio"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="3000"
                />

                <Input
                  label="Moneda"
                  value={moneda}
                  onChange={(e) => setMoneda(e.target.value)}
                  placeholder="USD"
                />

                <Input
                  label="Texto inferior"
                  value={precioDetalle}
                  onChange={(e) => setPrecioDetalle(e.target.value)}
                  placeholder="Por persona en base doble"
                />

              </div>
            )}

          </div>

          <div className="space-y-3">

            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#0f3b4c]">
                Subir imagen
              </label>

              <label
                className="
                  flex items-center justify-center gap-2
                  border-2 border-dashed border-[#0f3b4c]
                  text-[#0f3b4c]
                  rounded-lg p-4 cursor-pointer
                  hover:bg-[#0f3b4c]/5 transition
                "
              >
                <span className="text-sm font-medium">
                  {uploading ? 'Subiendo...' : 'Seleccionar archivo'}
                </span>

                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e: any) => {
                    const file = e.target.files?.[0]
                    if (file) handleUpload(file)
                  }}
                />
              </label>
            </div>

            <Input
              label="URL imagen"
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
              placeholder="https://..."
            />

            {imagen && (
              <img
                src={imagen}
                alt="Preview"
                className="h-40 rounded-xl object-cover"
              />
            )}

          </div>

        </Card>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0f3b4c] text-white px-4 py-3 rounded-lg disabled:opacity-50"
        >
          {loading
            ? isEdit
              ? 'Guardando...'
              : 'Creando...'
            : isEdit
              ? 'Guardar cambios'
              : 'Crear oferta'}
        </button>

      </form>

      <div className="pt-10 space-y-4">

        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#00A99D] mb-2">
            Preview
          </p>

          <h2 className="text-3xl font-semibold text-[#0F3B4C]">
            Vista previa
          </h2>
        </div>

        <div className="max-w-md">

        <PasajeSaleCard
          destino={destino || 'ARUBA'}
          salida={salida || ''}
          descripcion={
            descripcion ||
            'Todo incluido + pasajes + traslados + alojamiento'
          }
          badge={badge || 'HOT SALE'}
          promoBadge={promoBadge || 'Hasta 55% OFF'}
          pills={pills}
          imagen={
            imagen ||
            'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=1200&auto=format&fit=crop'
          }
          whatsapp={whatsappLink}
          precio={precio}
          moneda={moneda}
          precioDetalle={precioDetalle}
        />

        </div>

      </div>

    </div>
  )
}