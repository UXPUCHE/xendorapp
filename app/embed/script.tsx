'use client'

import { createRoot } from 'react-dom/client'
import Home from '@/app/components/Home'

function mount() {
  const el = document.getElementById('xendor-root')
  if (!el) return

  const path = window.location.pathname
  const slug = path.split('/').filter(Boolean).pop() || ''

  const root = createRoot(el)
  root.render(<Home destino={slug} />)
}

mount()