'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import PasajeSaleCard from '@/app/pasaje-sale/components/PasajeSaleCard'

type InitialData = {
  id?: string
  titulo?: string
  subtitulo?: string
  precio?: string
  moneda?: string
  badge?: string
  imagen?: string
  salida?: string
  noches?: string
  base?: string
  incluye?: string
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

type SelectProps = {
  label: string
  children: React.ReactNode
} & React.SelectHTMLAttributes<HTMLSelectElement>

const Select = ({ label, children, ...props }: SelectProps) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-xs text-[#0f3b4c]">{label}</label>

    <select
      className="
        border border-gray-300
        bg-white
        p-2
        rounded-lg
        text-gray-800
        focus:outline-none
        focus:ring-2
        focus:ring-[#00A99D]
      "
      {...props}
    >
      {children}
    </select>
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

  const [titulo, setTitulo] = useState(initialData?.titulo || '')
  const [subtitulo, setSubtitulo] = useState(initialData?.subtitulo || '')
  const [precio, setPrecio] = useState(initialData?.precio || '')
  const [moneda, setMoneda] = useState(
    initialData?.moneda || 'USD'
  )
  const [badge, setBadge] = useState(initialData?.badge || '')
  const [imagen, setImagen] = useState(initialData?.imagen || '')

  const [salida, setSalida] = useState(
    initialData?.salida || 'Córdoba'
  )

  const [pillLeft, setPillLeft] = useState(
    initialData?.noches || '7 noches'
  )

  const [pillRight, setPillRight] = useState(
    initialData?.base || 'Base doble'
  )

  const [incluye, setIncluye] = useState(
    initialData?.incluye ||
    'Vuelo • Hotel • Traslados • Asistencia'
  )

  const [precioDetalle, setPrecioDetalle] = useState(
    initialData?.precio_detalle ||
    'Precio por persona | Base doble'
  )

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const whatsappMessage = encodeURIComponent(
    `Hola! 👋 Vi una oferta en PASAJE SALE y quiero consultar por ${titulo || 'Río de Janeiro'} desde USD ${precio || '899'} ✈️`
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
        titulo,
        subtitulo,
        salida,
        noches: pillLeft,
        base: pillRight,
        incluye,
        precio,
        moneda,
        badge,
        imagen,
        whatsapp: whatsappLink,
        campaign: slug,
        precio_detalle: precioDetalle,
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
        alert(isEdit ? 'Error al actualizar oferta' : 'Error al crear oferta')
        return
      }

      alert(isEdit ? 'Oferta actualizada 🚀' : 'Oferta creada 🚀')

      setTitulo('')
      setSubtitulo('')
      setPrecio('')
      setBadge('')
      setImagen('')

      setSalida('Córdoba')
      setPillLeft('7 noches')
      setPillRight('Base doble')
      setIncluye('Vuelo • Hotel • Traslados • Asistencia')
      setPrecioDetalle('Precio por persona | Base doble')

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
            label="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej: Río de Janeiro"
          />

          <Input
            label="Subtítulo"
            value={subtitulo}
            onChange={(e) => setSubtitulo(e.target.value)}
            placeholder="Ej: 7 noches • vuelo directo"
          />

          <Input
            label="Salida desde"
            value={salida}
            onChange={(e) => setSalida(e.target.value)}
            placeholder="Ej: Córdoba"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Input
              label="Pill izquierda"
              value={pillLeft}
              onChange={(e) => setPillLeft(e.target.value)}
              placeholder="Ej: 7 noches"
            />

            <Input
              label="Pill derecha"
              value={pillRight}
              onChange={(e) => setPillRight(e.target.value)}
              placeholder="Ej: All Inclusive"
            />

          </div>

          <Input
            label="Incluye"
            value={incluye}
            onChange={(e) => setIncluye(e.target.value)}
            placeholder="Vuelo • Hotel • Traslados"
          />

          <Input
            label="Texto debajo del precio"
            value={precioDetalle}
            onChange={(e) => setPrecioDetalle(e.target.value)}
            placeholder="Precio por persona | Base doble"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Input
              label="Precio"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="899"
            />

            <Select
              label="Moneda"
              value={moneda}
              onChange={(e) => setMoneda(e.target.value)}
            >
              <option>USD</option>
              <option>ARS</option>
            </Select>

          </div>

          <Input
            label="Badge"
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            placeholder="HOT SALE"
          />

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
          titulo={titulo || 'Río de Janeiro'}
          subtitulo={subtitulo || 'Vuelo directo'}
          precio={precio || '899'}
          moneda={moneda}
          badge={badge || 'HOT SALE'}
          salida={salida || 'Córdoba'}
          noches={pillLeft || '7 noches'}
          base={pillRight || 'Base doble'}
          incluye={
            incluye ||
            'Vuelo • Hotel • Traslados • Asistencia'
          }
          precioDetalle={
            precioDetalle ||
            'Precio por persona | Base doble'
          }
          imagen={
            imagen ||
            'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=1200&auto=format&fit=crop'
          }
          whatsapp={whatsappLink}
        />

        </div>

      </div>

    </div>
  )
}