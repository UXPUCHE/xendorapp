'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        window.location.href = '/dashboard'
      }
    })
  }, [])

  const handleLogin = async () => {
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      alert(error.message)
    } else {
      window.location.href = '/dashboard'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EBEDFF]">
      <div className="bg-white p-8 rounded-2xl shadow-md w-[320px]">
        <h1 className="text-xl font-semibold mb-4 text-[#0F3B4C]">
          Login agentes
        </h1>

        <input
          className="w-full mb-3 px-3 py-2 border rounded text-[#0F3B4C]"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />

        <input
          type="password"
          className="w-full mb-4 px-3 py-2 border rounded text-[#0F3B4C]"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[#0F3B4C] text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </div>
    </div>
  )
}