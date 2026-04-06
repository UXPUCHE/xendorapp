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
        setUserName('Admin')
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
    <div className="grid grid-cols-3 gap-6">

      {/* LEFT */}
      <div className="col-span-2 space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-semibold text-[#0F3B4C]">
            Hola {userName} 👋
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            ¿Qué te gustaría hacer hoy?
          </p>
        </div>

        {/* HERO */}
        <div className="relative max-w-3xl overflow-hidden bg-gradient-to-r from-[#11bcb3] to-[#072e40] text-white p-6 rounded-2xl">

          {/* CONTENIDO */}
          <div className="relative z-10">
            <h2 className="text-2xl font-semibold">
              Gestioná tus ofertas más rápido 🚀
            </h2>
            <p className="text-sm opacity-80 mt-2">
              Creá, editá y compartí paquetes en segundos
            </p>
          </div>

          {/* 👇 ESTE ES EL GLOW */}
          <div className="absolute inset-0 bg-white/10 blur-3xl" />

        </div>
        {/* ACCIONES */}
        <div className="grid grid-cols-3 gap-4">

          <a
            href="/admin/crear"
            className="bg-white p-4 rounded-xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition hover:shadow-md hover:-translate-y-[2px]"
          >
            <div className="text-lg mb-2">➕</div>
            <h3 className="font-medium text-[#0F3B4C] text-sm">
              Crear paquete
            </h3>
          </a>

          <a
            href="/admin/editar"
            className="bg-white p-4 rounded-xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition hover:shadow-md hover:-translate-y-[2px]"
          >
            <div className="text-lg mb-2">✏️</div>
            <h3 className="font-medium text-[#0F3B4C] text-sm">
              Editar paquetes
            </h3>
          </a>

          <a
            href="/admin/herramientas"
            className="bg-white p-4 rounded-xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition hover:shadow-md hover:-translate-y-[2px]"
          >
            <div className="text-lg mb-2">🧰</div>
            <h3 className="font-medium text-[#0F3B4C] text-sm">
              Herramientas
            </h3>
          </a>

        </div>

        {/* HERRAMIENTAS */}
        <div className="grid grid-cols-2 gap-5">

          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition hover:shadow-md hover:-translate-y-[2px]">
            <h3 className="font-medium text-[#0F3B4C] text-sm">
              Generador WhatsApp
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Links listos para enviar
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition hover:shadow-md hover:-translate-y-[2px]">
            <h3 className="font-medium text-[#0F3B4C] text-sm">
              Editor de imágenes
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Recorte rápido
            </p>
          </div>

        </div>

      </div>

      {/* RIGHT */}
      <div className="space-y-6">

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <h3 className="font-medium text-[#0F3B4C] mb-2 text-sm">
            Actividad
          </h3>
          <p className="text-xs text-gray-500">
            Próximamente verás tus últimas acciones
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <h3 className="font-medium text-[#0F3B4C] mb-2 text-sm">
            Tips
          </h3>
          <p className="text-xs text-gray-500">
            Usá el generador de WhatsApp para cerrar más ventas 📲
          </p>
        </div>

      </div>

    </div>
  )
}