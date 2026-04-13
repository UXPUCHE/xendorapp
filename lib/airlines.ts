// ==============================
// AIRLINES LIST (para selects)
// ==============================

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

// ==============================
// LOGOS (IMPORTADOS)
// ==============================

import AR from '@/app/pasajeclub/assets/airlines/AR.svg'
import AA from '@/app/pasajeclub/assets/airlines/AA.svg'
import AC from '@/app/pasajeclub/assets/airlines/AC.svg'
import AM from '@/app/pasajeclub/assets/airlines/AM.svg'
import AV from '@/app/pasajeclub/assets/airlines/AV.svg'
import AZ from '@/app/pasajeclub/assets/airlines/AZ.svg'
import BA from '@/app/pasajeclub/assets/airlines/BA.svg'
import CM from '@/app/pasajeclub/assets/airlines/CM.svg'
import DL from '@/app/pasajeclub/assets/airlines/DL.svg'
import EK from '@/app/pasajeclub/assets/airlines/EK.svg'
import ET from '@/app/pasajeclub/assets/airlines/ET.svg'
import FO from '@/app/pasajeclub/assets/airlines/FO.svg'
import G3 from '@/app/pasajeclub/assets/airlines/G3.svg'
import H2 from '@/app/pasajeclub/assets/airlines/H2.svg'
import IB from '@/app/pasajeclub/assets/airlines/IB.svg'
import JA from '@/app/pasajeclub/assets/airlines/JA.svg'
import JJ from '@/app/pasajeclub/assets/airlines/JJ.svg'
import KL from '@/app/pasajeclub/assets/airlines/KL.svg'
import LA from '@/app/pasajeclub/assets/airlines/LA.svg'
import LH from '@/app/pasajeclub/assets/airlines/LH.svg'
import LP from '@/app/pasajeclub/assets/airlines/LP.svg'
import LX from '@/app/pasajeclub/assets/airlines/LX.svg'
import O4 from '@/app/pasajeclub/assets/airlines/O4.svg'
import TK from '@/app/pasajeclub/assets/airlines/TK.svg'
import UA from '@/app/pasajeclub/assets/airlines/UA.svg'
import UX from '@/app/pasajeclub/assets/airlines/UX.svg'
import XL from '@/app/pasajeclub/assets/airlines/XL.svg'
import ZP from '@/app/pasajeclub/assets/airlines/ZP.svg'
import OB from '@/app/pasajeclub/assets/airlines/OB.svg'
import DM from '@/app/pasajeclub/assets/airlines/DM.svg'

// ==============================
// MAPA DE LOGOS
// ==============================

export const AIRLINE_LOGOS: Record<string, any> = {
  AR,
  AA,
  AC,
  AM,
  AV,
  AZ,
  BA,
  CM,
  DL,
  EK,
  ET,
  FO,
  G3,
  H2,
  IB,
  JA,
  JJ,
  KL,
  LA,
  LH,
  LP,
  LX,
  O4,
  TK,
  UA,
  UX,
  XL,
  ZP,
  OB,
  DM,
}

// ==============================
// HELPER
// ==============================

export const getAirlineLogo = (code?: string | null) => {
  if (!code) return null
  return AIRLINE_LOGOS[code.toUpperCase().trim()] || null
}