'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminHome() {
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      const user = data?.user

      if (!user) {
        setUserName('Admin') // fallback
        return
      }

    const formatName = (name: string) =>
    name.charAt(0).toUpperCase() + name.slice(1)

    const name =
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'Admin'

    setUserName(formatName(name))
    }

    getUser()
  }, [])

  return (
    <div className="min-h-screen bg-[#F7FAFB] flex items-center justify-center px-6">
      
      <div className="max-w-4xl w-full">
        
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-[#0F3B4C]">
            Hola {userName} 👋
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            ¿Qué te gustaría hacer hoy?
          </p>
        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* AGREGAR */}
          <a
            href="/admin/crear"
            className="group bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-100"
          >
            <div className="text-4xl mb-4">➕</div>
            <h2 className="text-2xl font-semibold text-[#0F3B4C]">
              Agregar paquete
            </h2>
            <p className="text-gray-500 mt-2">
              Crear una nueva oferta desde cero
            </p>
          </a>

          {/* MODIFICAR */}
          <a
            href="/admin/editar"
            className="group bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-100"
          >
            <div className="text-4xl mb-4">✏️</div>
            <h2 className="text-2xl font-semibold text-[#0F3B4C]">
              Modificar paquete
            </h2>
            <p className="text-gray-500 mt-2">
              Editar precios, fechas o detalles existentes
            </p>
          </a>

        </div>

      </div>

    </div>
  )
}