'use client'

import { useSearchParams } from 'next/navigation'
import Home from '@/app/pasajeclub/components/Home'

export default function EmbedContent() {
  const params = useSearchParams()
  const destino = params.get('destino') || ''

  return <Home destino={destino} />
}