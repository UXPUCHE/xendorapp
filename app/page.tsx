'use client'

import { Suspense } from 'react'
import RootPage from './root-page'

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <RootPage />
    </Suspense>
  )
}