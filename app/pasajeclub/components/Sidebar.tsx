'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  PlusCircle,
  Pencil,
  Wrench,
  Settings,
  LogOut
} from 'lucide-react'

const menu = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/admin',
  },
  {
    label: 'Crear paquete',
    icon: PlusCircle,
    path: '/admin/crear',
  },
  {
    label: 'Editar paquetes',
    icon: Pencil,
    path: '/admin/editar',
  },
  {
    label: 'Herramientas',
    icon: Wrench,
    path: '/admin/herramientas',
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="w-64 bg-[#F8FAFC] border-r border-gray-200 px-5 py-6 flex flex-col justify-between">

      {/* TOP */}
      <div>

        {/* LOGO */}
        <h2 className="font-semibold text-[#0f3b4c] text-lg mb-10">
          Xendor
        </h2>

        {/* SECTION */}
        <p className="text-[10px] text-gray-400 mb-3 uppercase tracking-wider">
          Vista rápida
        </p>

        <nav className="space-y-2">
          {menu.map((item) => {
            const active = pathname === item.path
            const Icon = item.icon

            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition
                  ${active
                    ? 'bg-gradient-to-r from-[#11bcb3] to-[#072e40] text-white'
                    : 'text-gray-600 hover:bg-gray-100'}
                `}
              >
                <Icon size={18} />
                {item.label}
              </button>
            )
          })}
        </nav>

      </div>

      {/* BOTTOM */}
      <div className="space-y-4">

        <p className="text-[10px] text-gray-400 uppercase tracking-wider">
          Ajustes
        </p>

        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-white rounded-xl transition">
          <Settings size={18} />
          Configuración
        </button>

        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition">
          <LogOut size={18} />
          Logout
        </button>

      </div>

    </div>
  )
}