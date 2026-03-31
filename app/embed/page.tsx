'use client'

import { Suspense } from 'react'
import Home from '@/app/components/Home'
import { useSearchParams } from 'next/navigation'

function EmbedContent() {
  const params = useSearchParams()
  const destino = params.get('destino') || ''

  return <Home destino={destino} />
}

export default function EmbedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmbedContent />
    </Suspense>
  )
}