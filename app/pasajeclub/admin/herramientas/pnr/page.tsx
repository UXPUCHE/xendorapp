'use client'

import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'

export default function HerramientasPage() {

  /* =========================
     CROPPER
  ========================= */

  const [image, setImage] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const onSelectFile = (e: any) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const createImage = (url: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image()
      image.addEventListener('load', () => resolve(image))
      image.addEventListener('error', error => reject(error))
      image.setAttribute('crossOrigin', 'anonymous')
      image.src = url
    })

  const getCroppedImg = async () => {
    if (!image || !croppedAreaPixels) return

    const img = await createImage(image)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = croppedAreaPixels.width
    canvas.height = croppedAreaPixels.height

    ctx?.drawImage(
      img,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    )

    return canvas.toDataURL('image/jpeg')
  }

  const handleDownload = async () => {
    const croppedImage = await getCroppedImg()
    if (!croppedImage) return

    const link = document.createElement('a')
    link.href = croppedImage
    link.download = 'cropped.jpg'
    link.click()
  }

  const handleCopyImage = async () => {
    const croppedImage = await getCroppedImg()
    if (!croppedImage) return

    const res = await fetch(croppedImage)
    const blob = await res.blob()

    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ])
  }

/* =========================
   PNR PARSER + UI PRO
========================= */

const [pnrText, setPnrText] = useState('')
const [parsedFlights, setParsedFlights] = useState<any[]>([])

const parsePNR = () => {
  const lines = pnrText.split('\n')

  const flights = lines
    .map(line => {

      const clean = line.trim()

      if (!clean) return null

      // regex inteligente
      const match = clean.match(
        /([A-Z]{2})\s?(\d{2,4})\s.*?(\d{2}[A-Z]{3})\s([A-Z]{3})\s([A-Z]{3})\s(\d{3,4})\s(\d{3,4}\+?\d?)/
      )

      if (!match) return null

      return {
        vuelo: `${match[1]} ${match[2]}`,
        fecha: match[3],
        origen: match[4],
        destino: match[5],
        salida: match[6],
        llegada: match[7],
      }
    })
    .filter(Boolean)

  setParsedFlights(flights)
}
  /* =========================
     UI
  ========================= */

  return (
    <div className="space-y-10">

{/* =========================
   LECTOR DE VUELOS
========================= */}

<div className="bg-white p-6 rounded-2xl border shadow-sm space-y-6">

  <h3 className="text-lg font-semibold text-[#0f3b4c]">
    Lector de vuelos ✈️
  </h3>

<textarea
  placeholder="Pegá el itinerario (PNR / Amadeus / Sabre)"
  className="w-full h-40 border border-gray-200 rounded-xl p-4 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f3b4c]/20"
  onChange={(e) => setPnrText(e.target.value)}
/>

  <button
    onClick={parsePNR}
    className="w-full bg-[#0f3b4c] text-white py-3 rounded-xl font-medium hover:opacity-90 transition"
  >
    Procesar vuelos
  </button>

  {/* RESULTADO */}
  {parsedFlights.length > 0 && (() => {

    const mitad = Math.ceil(parsedFlights.length / 2)
    const ida = parsedFlights.slice(0, mitad)
    const vuelta = parsedFlights.slice(mitad)

    return (
      <div className="space-y-6">

        {/* IDA */}
        <div>
          <h4 className="text-sm font-semibold text-[#0F3B4C] mb-3">
            Ida
          </h4>

          <div className="space-y-3">
            {ida.map((f, i) => (
              <div
                key={i}
                className="border rounded-xl p-4 bg-gray-50"
              >

                <p className="text-lg font-semibold text-[#0F3B4C]">
                  {f.origen} → {f.destino}
                </p>

                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <span>{f.salida}</span>
                  <span className="text-gray-300">→</span>
                  <span>{f.llegada}</span>
                </div>

                <p className="text-sm text-gray-500 mt-1">
                  {f.fecha}
                </p>

                <p className="text-xs text-gray-400 mt-2">
                  {f.vuelo}
                </p>

              </div>
            ))}
          </div>
        </div>

        {/* VUELTA */}
        {vuelta.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-[#0F3B4C] mb-3">
              Vuelta
            </h4>

            <div className="space-y-3">
              {vuelta.map((f, i) => (
                <div
                  key={i}
                  className="border rounded-xl p-4 bg-gray-50"
                >

                  <p className="text-lg font-semibold text-[#0F3B4C]">
                    {f.origen} → {f.destino}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <span>{f.salida}</span>
                    <span className="text-gray-300">→</span>
                    <span>{f.llegada}</span>
                  </div>

                  <p className="text-sm text-gray-500 mt-1">
                    {f.fecha}
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    {f.vuelo}
                  </p>

                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    )
  })()}

</div>

    </div>
  )
}