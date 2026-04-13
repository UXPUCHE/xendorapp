export const AIRLINES = [
  { code: 'AM', name: 'Aeroméxico' },
  { code: 'AR', name: 'Aerolíneas Argentinas' },
  { code: 'AV', name: 'Avianca' },
  { code: 'BA', name: 'British Airways' },
  { code: 'AC', name: 'Air Canada' },
  { code: 'UX', name: 'Air Europa' },
  { code: 'AA', name: 'American Airlines' },
  { code: 'DM', name: 'Arajet' },
  { code: 'O4', name: 'Andes Líneas Aéreas' },
  { code: 'OB', name: 'BoA (Boliviana de Aviación)' },
  { code: 'CM', name: 'Copa Airlines' },
  { code: 'DL', name: 'Delta Air Lines' },
  { code: 'EK', name: 'Emirates' },
  { code: 'ET', name: 'Ethiopian Airlines' },
  { code: 'FO', name: 'Flybondi' },
  { code: 'G3', name: 'GOL' },
  { code: 'IB', name: 'Iberia' },
  { code: 'AZ', name: 'ITA Airways' },
  { code: 'JA', name: 'JetSMART' },
  { code: 'KL', name: 'KLM' },
  { code: 'LA', name: 'LATAM Airlines' },
  { code: 'JJ', name: 'LATAM Brasil' },
  { code: 'LP', name: 'LATAM Perú' },
  { code: 'XL', name: 'LATAM Chile' },
  { code: 'LH', name: 'Lufthansa' },
  { code: 'ZP', name: 'Paranair' },
  { code: 'H2', name: 'Sky Airline' },
  { code: 'LX', name: 'SWISS' },
  { code: 'TK', name: 'Turkish Airlines' },
  { code: 'UA', name: 'United Airlines' },
]

export const getAirlineLogo = (code?: string | null) => {
  if (!code) return null

  const normalized = code.toUpperCase().trim()

  return `/airlines/${normalized}.svg`
}