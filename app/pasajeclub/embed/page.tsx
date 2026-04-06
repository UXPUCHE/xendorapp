import { Suspense } from 'react'
import EmbedContent from './embed-content'

export default function EmbedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmbedContent />
    </Suspense>
  )
}