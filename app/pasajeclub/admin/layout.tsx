'use client'

import { ReactNode } from 'react'
import Sidebar from '@/app/pasajeclub/components/Sidebar'
import AdminHeader from '@/app/pasajeclub/components/AdminHeader'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#EEF2F6]">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <div className="px-8 pt-6">
        <AdminHeader />
        </div>

        {/* CONTENT */}
        <div className="flex-1 px-8 py-6">
            {children}
        </div>

      </div>

    </div>
  )
}