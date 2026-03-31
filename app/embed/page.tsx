'use client'

import Home from '../components/Home'
import { useSearchParams } from 'next/navigation'

export default function EmbedPage() {
  const params = useSearchParams()
  const destino = params.get('destino') || ''

  return (
    <div style={{ width: '100%' }}>
      <Home destino={destino} />
    </div>
  )
}