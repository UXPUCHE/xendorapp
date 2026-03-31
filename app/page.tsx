'use client'

import { Suspense } from 'react'
import RootPage from './RootPage'

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <RootPage />
    </Suspense>
  )
}