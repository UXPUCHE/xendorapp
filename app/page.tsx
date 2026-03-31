'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Home from './components/home'

export default function RootPage() {
  const searchParams = useSearchParams()
  const destino = searchParams.get('destino') || ''

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()

      const path = window.location.pathname

      // 🔥 SI ES PÚBLICO → NO HACER NADA
      if (path.includes('/paquetes') || destino) return

      // 🔒 SOLO PROTEGER DASHBOARD
      if (!data.user) {
        window.location.href = '/login'
      }
    }

    checkUser()
  }, [destino])

  // 🔥 ACÁ ESTÁ LA CLAVE
  return <Home destino={destino} />
}