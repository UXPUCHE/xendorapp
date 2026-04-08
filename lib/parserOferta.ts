export const parseOfertaTexto = (text: string) => {
  const lines = text
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)

  const data: any = {
    titulo: '',
    subtitulo: '',
    fechas: '',
    incluye: [],
    hoteles: [],
  }

  let currentHotel: any = null

  lines.forEach((line) => {

    const lower = line.toLowerCase()

    // 🟢 TITULO
    if (!data.titulo && line.includes('|')) {
      data.titulo = line
      return
    }

    // 🟢 SUBTITULO
    if (lower.includes('adultos') || lower.includes('menores')) {
      data.subtitulo = line
      return
    }

    // 🟢 FECHAS
    if (lower.includes('salida') && lower.includes('regreso')) {
      data.fechas = line
      return
    }

    // 🟢 INCLUYE
    if (line.startsWith('*')) {
      data.incluye.push(line.replace('*', '').trim())
      return
    }

    // 🟢 HOTEL (1) 2) 3))
    if (/^\d+\)/.test(line)) {
      if (currentHotel) data.hoteles.push(currentHotel)

      currentHotel = {
        nombre: line.replace(/^\d+\)\s*/, ''),
        precio: '',
        cuotas: '',
      }

      return
    }

    // 🟢 PRECIO / CUOTAS
    if (line.includes('USD')) {
      if (!currentHotel) return

      if (lower.includes('cuota')) {
        currentHotel.cuotas = line
      } else {
        currentHotel.precio = line
      }
    }

  })

  if (currentHotel) data.hoteles.push(currentHotel)

  return data
}