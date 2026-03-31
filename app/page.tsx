'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function RootPage() {
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()

    const path = window.location.pathname
    const params = new URLSearchParams(window.location.search)
    const destino = params.get('destino')

    // 🔥 SI ES PÚBLICO → NO HACER NADA
    if (path.includes('/paquetes') || destino) return

      // 🔒 SOLO PROTEGER DASHBOARD
      if (!data.user) {
        window.location.href = '/login'
      }
    }

    checkUser()
  }, [])

  return <div />
}