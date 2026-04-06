'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const words = [
  'Solutions.',
  'Development.',
  'Infrastructure.',
  'Systems.',
]

export default function RootPage() {
  const [index, setIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => {
        setPrevIndex(prev)
        return (prev + 1) % words.length
      })
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  return (
    <main className="relative h-screen w-full bg-black text-white overflow-hidden flex items-center justify-center"
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, Inter, sans-serif",
      }}
    >
      {/* GRID */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #1f1f1f 1px, transparent 1px),
            linear-gradient(to bottom, #1f1f1f 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* VIGNETTE */}
      <div className="absolute inset-0 bg-black/50" />

      {/* GLOW */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(34,197,94,0.25) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* CONTENT */}
      <div className="relative text-center space-y-6">

        {/* LOGO */}
        <div className="text-xs tracking-[0.3em] opacity-60">
          XENDOR
        </div>

        {/* STACKED WORDS */}
        <div className="flex flex-col items-center leading-tight relative">

          {words.map((word, i) => {
            const position = (i - index + words.length) % words.length
            const isActive = position === 0
            const isLeaving = i === prevIndex

            return (
              <motion.div
                key={word}
                initial={{ y: 40, opacity: 0 }}
                animate={{
                  opacity: isActive ? 1 : position === 1 ? 0.01 : 0.01,
                  y: isActive
                    ? 0
                    : isLeaving
                    ? -120 // 🔥 la palabra que sale sube
                    : position * 90,
                  scale: isActive ? 1 : 0.9,
                  filter: isActive ? 'blur(0px)' : 'blur(6px)',
                }}
                transition={{
                  duration: 0.7,
                  ease: 'easeOut'
                }}
                className={`absolute font-semibold tracking-tight
                  ${isActive ? 'text-5xl md:text-7xl' : 'text-4xl md:text-6xl'}
                `}
              >
                {word}
              </motion.div>
            )
          })}

          <div className="h-[70px]" />

        </div>

        {/* SUBTEXT */}
        <p className="text-gray-300 text-sm md:text-base mt-2">
          Engineering digital solutions for modern businesses
        </p>

        {/* CTA */}
        <a
          href="mailto:tuemail@xendor.com.ar"
          className="inline-block border border-white/20 px-6 py-2 rounded-md hover:bg-white hover:text-black transition"
        >
          Contact
        </a>

        {/* FOOTER */}
        <p className="text-xs text-gray-500">
          Currently building new solutions
        </p>

      </div>
    </main>
  )
}