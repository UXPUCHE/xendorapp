'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function RootPage() {
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()

      const path = window.location.pathname

      // 🔥 SI ES UNA PÁGINA PÚBLICA → NO HACER NADA
      if (path.includes('/paquetes')) return

      // 🔒 SOLO PROTEGER DASHBOARD
      if (!data.user) {
        window.location.href = '/login'
      }
    }

    checkUser()
  }, [])

  return <div />
}