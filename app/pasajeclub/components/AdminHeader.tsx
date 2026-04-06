'use client'

import { Search, Bell, Mail } from 'lucide-react'

export default function AdminHeader() {
  return (
<div className="h-16 flex items-center justify-between px-0">

  {/* SEARCH */}
  <div className="w-full max-w-3xl">
    <div className="flex items-center bg-white/60 rounded-full px-5 h-12 w-full shadow-sm">
      <Search size={18} className="text-gray-400 mr-3" />
      <input
        placeholder="¿Qué necesitas buscar?..."
        className="bg-transparent outline-none text-sm w-full text-gray-600 placeholder-gray-400"
      />
    </div>
  </div>

  {/* RIGHT */}
  <div className="flex items-center gap-5">

        {/* MAIL */}
        <button className="w-11 h-11 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100/60 transition">
          <Mail size={18} className="text-gray-600" />
        </button>

        {/* BELL */}
        <button className="w-11 h-11 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100/60 transition">
          <Bell size={18} className="text-gray-600" />
        </button>

        {/* SEPARATOR */}
        <div className="w-px h-6 bg-gray-200" />

        {/* USER */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0f3b4c] text-white flex items-center justify-center text-sm font-medium">
            N
          </div>
          <span className="text-sm font-medium text-gray-700">
            Nico
          </span>
        </div>

      </div>

    </div>
  )
}