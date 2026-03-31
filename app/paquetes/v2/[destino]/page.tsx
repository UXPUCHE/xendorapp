import Home from '@/app/components/Home'

export default async function Page({ params }: { params: Promise<{ destino: string }> }) {
  const { destino } = await params

  const destinoFormateado = destino
    .replace('-', ' ')
    .replace(/\b\w/g, l => l.toUpperCase())

  return <Home destino={destinoFormateado} />
}