'use client'

import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'

export default function HerramientasPage() {

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

    return new Promise<string>((resolve) => {
      resolve(canvas.toDataURL('image/jpeg'))
    })
  }

  const handleDownload = async () => {
    const croppedImage = await getCroppedImg()
    if (!croppedImage) return

    const link = document.createElement('a')
    link.href = croppedImage
    link.download = 'cropped.jpg'
    link.click()
  }

  return (

  <div className="space-y-8">

    {/* TITLE */}
    <h1 className="text-3xl font-semibold text-[#0F3B4C]">
      Editor de imágenes ✂️
    </h1>

    {/* CARD */}
    <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-6">

      {/* UPLOAD */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-[#0f3b4c]">Subir imagen</label>

        <label className="flex items-center justify-center 
          border-2 border-dashed border-[#0f3b4c] 
          text-[#0f3b4c] 
          rounded-xl p-6 cursor-pointer 
          hover:bg-[#0f3b4c]/5 transition">

          <span className="text-sm font-medium">
            Seleccionar archivo
          </span>

          <input
            type="file"
            className="hidden"
            onChange={onSelectFile}
          />
        </label>
      </div>

      {/* CROPPER */}
      {image && (
        <div className="space-y-6">

          <div className="relative w-full h-[400px] bg-black rounded-xl overflow-hidden">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          {/* CONTROLES */}
          <div className="space-y-4">

            <div>
              <p className="text-xs text-[#0f3b4c] mb-1">Zoom</p>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <button
              onClick={handleDownload}
              className="w-full bg-[#0f3b4c] text-white px-4 py-3 rounded-lg font-medium hover:opacity-90 transition"
            >
              Descargar imagen
            </button>

          </div>

        </div>
      )}

    </div>

  </div>
)
}