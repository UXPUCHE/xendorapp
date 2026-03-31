'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../lib/supabase'
import Home from '@/app/components/Home'

export default function RootPage() {
  const searchParams = useSearchParams()
  const destino = searchParams.get('destino') || ''

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()

      const path = window.location.pathname

      if (path.includes('/paquetes') || destino) return

      if (!data.user) {
        window.location.href = '/login'
      }
    }

    checkUser()
  }, [destino])

  return <Home destino={destino} />
}