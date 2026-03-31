'use client'

import { createRoot } from 'react-dom/client'
import Home from '../components/Home'

export function mountXendor(containerId: string, destino: string) {
  const el = document.getElementById(containerId)

  if (!el) return

  const root = createRoot(el)

  root.render(<Home destino={destino} />)
}