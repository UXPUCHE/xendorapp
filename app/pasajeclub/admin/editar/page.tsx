'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Breadcrumb from '@/app/pasajeclub/components/Breadcrumb'
import Toast from '@/app/pasajeclub/components/Toast'

type Oferta = {
  external_id: string
  destino: string
  hotel: string
  precio: number
  fecha_in?: string
  fecha_out?: string
}

export default function EditarPage() {
  const [ofertas, setOfertas] = useState<Oferta[]>([])
  const [filtro, setFiltro] = useState('')
  const [selectedOferta, setSelectedOferta] = useState<Oferta | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)

  const [toast, setToast] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Oferta | null>(null)
  const [undoTimeout, setUndoTimeout] = useState<NodeJS.Timeout | null>(null)

  const router = useRouter()

  const formatDate = (date?: string) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short'
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('ofertas')
        .select('external_id, destino, hotel, precio, fecha_in, fecha_out')
        .order('precio', { ascending: true })

      if (!error && data) setOfertas(data)
      else console.error(error)
    }

    fetchData()
  }, [])

  // 🗑️ abrir modal
  const openDeleteModal = (oferta: Oferta) => {
    setSelectedOferta(oferta)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedOferta(null)
    setLoadingDelete(false)
  }

  // 🧨 DELETE CON UNDO
  const eliminarOferta = async () => {
    if (!selectedOferta) return

    setLoadingDelete(true)

    // 1. cerrar modal
    closeModal()

    // 2. eliminar visualmente
    setOfertas(prev =>
      prev.filter(o => o.external_id !== selectedOferta.external_id)
    )

    // 3. guardar backup
    setPendingDelete(selectedOferta)

    // 4. toast con undo
    setToast('🗑️ Eliminado')

    // 5. delete real con delay
    const timeout = setTimeout(async () => {
    const { data, error } = await supabase
      .from('ofertas')
      .update({ status: 'eliminado' })
      .eq('external_id', selectedOferta.external_id)
      .select()

    console.log('DATA:', data)
    console.log('ERROR:', error)

      if (error) {
        console.error(error)
        setToast('❌ Error al mover a papelera')
        return
      }
      console.log('SOFT DELETE RUNNING')
      setPendingDelete(null)
      console.log('UPDATE EJECUTADO')
    }, 4000)

    setUndoTimeout(timeout)
  }

const duplicarOferta = async (oferta: Oferta) => {
  try {
    const { data: original, error } = await supabase
      .from('ofertas')
      .select('*')
      .eq('external_id', oferta.external_id)
      .single()

    if (error || !original) {
      console.error(error)
      setToast('Error al duplicar')
      return
    }

    const nuevoExternalId = crypto.randomUUID()

    // 🔥 LIMPIO SOLO LOS CAMPOS VÁLIDOS
      const nuevaOferta = {
        external_id: nuevoExternalId,
        destino: original.destino,
        hotel: original.hotel + ' (copia)',
        precio: original.precio,
        fecha_in: original.fecha_in,
        fecha_out: original.fecha_out,
        pax: original.pax,
        vuelos: original.vuelos // 👈 ESTE FALTABA
      }

    const { error: insertError } = await supabase
      .from('ofertas')
      .insert(nuevaOferta)

    if (insertError) {
      console.error(insertError)
      setToast('Error al duplicar')
      return
    }

    setOfertas(prev => [
      {
        ...nuevaOferta
      },
      ...prev
    ])

    setToast('Duplicado ✨')

  } catch (err) {
    console.error(err)
    setToast('Error inesperado')
  }
}

  // 🔄 UNDO
  const handleUndo = () => {
    if (!pendingDelete) return

    if (undoTimeout) clearTimeout(undoTimeout)

    setOfertas(prev => [pendingDelete, ...prev])
    setPendingDelete(null)
    setToast('Restaurado 👍')
  }

  // ⏱ auto hide toast
  useEffect(() => {
    if (!toast) return

    const timer = setTimeout(() => {
      setToast(null)
    }, 3000)

    return () => clearTimeout(timer)
  }, [toast])

  const ofertasFiltradas = ofertas.filter((o) =>
    o.destino?.toLowerCase().includes(filtro.toLowerCase())
  )

  return (
    <div className="px-2 space-y-8">

      <h1 className="text-3xl font-semibold text-[#0F3B4C] mb-6">
        Modificar paquetes ✏️
      </h1>

      <input
        type="text"
        placeholder="Filtrar por destino..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="w-full mb-6 px-4 py-3 border border-gray-200 text-black rounded-xl"
      />

      {/* LISTA */}
      <div className="space-y-5">
        {ofertasFiltradas.map((o) => (
          <div
            key={o.external_id}
            className="bg-white border border-gray-100 rounded-2xl p-5 flex justify-between items-center shadow-sm hover:shadow-md transition"
          >
            <div>
              <p className="text-lg font-semibold text-[#0F3B4C]">
                {o.destino?.charAt(0).toUpperCase() + o.destino?.slice(1)}
              </p>

              <p className="text-sm text-gray-500">
                {o.hotel}
                {o.fecha_in && o.fecha_out && (
                  <> · {formatDate(o.fecha_in)} → {formatDate(o.fecha_out)}</>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-[#0F3B4C]">
                    USD {o.precio}
                  </span>

                  <button
                    onClick={() => router.push(`/admin/editar/${o.external_id}`)}
                    className="bg-[#0F3B4C] text-white px-4 py-2 rounded-full text-sm font-semibold"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => duplicarOferta(o)}
                    className="bg-gray-200 text-[#0F3B4C] px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-300 transition"
                  >
                    Duplicar
                  </button>

                  <button
                    onClick={() => openDeleteModal(o)}
                    className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold"
                  >
                    Eliminar
                  </button>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4">

            <h2 className="text-xl font-semibold text-[#0F3B4C]">
              ¿Eliminar paquete?
            </h2>

            <p className="text-sm text-gray-500">
              Podés deshacer la acción por unos segundos.
            </p>

            <div className="flex justify-end gap-3 pt-4">

              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-full border"
              >
                Cancelar
              </button>

              <button
                onClick={eliminarOferta}
                disabled={loadingDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-full"
              >
                {loadingDelete ? 'Eliminando...' : 'Eliminar'}
              </button>

            </div>

          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <Toast
          message={toast}
          actionLabel={pendingDelete ? 'Deshacer' : undefined}
          onAction={handleUndo}
        />
      )}

    </div>
  )
}