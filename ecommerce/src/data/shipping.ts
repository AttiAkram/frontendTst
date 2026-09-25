/** Minimal geo table: CAP prefix → city + coordinates. The backend will replace this with a real geocoder. */
export interface Place {
  cap: string
  city: string
  prov: string
  lat: number
  lon: number
  islands?: boolean
}

export const PLACES: Place[] = [
  { cap: '20121', city: 'Milano', prov: 'MI', lat: 45.464, lon: 9.19 },
  { cap: '00184', city: 'Roma', prov: 'RM', lat: 41.902, lon: 12.496 },
  { cap: '10121', city: 'Torino', prov: 'TO', lat: 45.07, lon: 7.686 },
  { cap: '80133', city: 'Napoli', prov: 'NA', lat: 40.851, lon: 14.268 },
  { cap: '40121', city: 'Bologna', prov: 'BO', lat: 44.494, lon: 11.342 },
  { cap: '50122', city: 'Firenze', prov: 'FI', lat: 43.769, lon: 11.255 },
  { cap: '30121', city: 'Venezia', prov: 'VE', lat: 45.44, lon: 12.315 },
  { cap: '16121', city: 'Genova', prov: 'GE', lat: 44.405, lon: 8.946 },
  { cap: '70121', city: 'Bari', prov: 'BA', lat: 41.117, lon: 16.871 },
  { cap: '90133', city: 'Palermo', prov: 'PA', lat: 38.115, lon: 13.361, islands: true },
  { cap: '95121', city: 'Catania', prov: 'CT', lat: 37.502, lon: 15.087, islands: true },
  { cap: '09124', city: 'Cagliari', prov: 'CA', lat: 39.223, lon: 9.121, islands: true },
  { cap: '37121', city: 'Verona', prov: 'VR', lat: 45.438, lon: 10.992 },
  { cap: '34121', city: 'Trieste', prov: 'TS', lat: 45.649, lon: 13.776 },
  { cap: '89121', city: 'Reggio Calabria', prov: 'RC', lat: 38.111, lon: 15.647 },
  { cap: '39100', city: 'Bolzano', prov: 'BZ', lat: 46.498, lon: 11.354 },
]

export const WAREHOUSES = [
  { id: 'MXP', city: 'Castel San Giovanni (PC)', lat: 45.06, lon: 9.43 },
  { id: 'FCO', city: 'Passo Corese (RI)', lat: 42.16, lon: 12.64 },
]

export type ShipSpeed = 'standard' | 'express' | 'sameday' | 'locker'

export interface ShippingQuote {
  speed: ShipSpeed
  label: string
  price: number
  days: [number, number]
  eta: [Date, Date]
  km: number
  warehouse: string
  available: boolean
  note?: string
}

function haversine(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLon = ((b.lon - a.lon) * Math.PI) / 180
  const s = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(s))
}

/** Skips Sundays when projecting delivery dates. */
function addBusinessDays(from: Date, n: number) {
  const d = new Date(from)
  let added = 0
  while (added < n) {
    d.setDate(d.getDate() + 1)
    if (d.getDay() !== 0) added++
  }
  return d
}

export function findPlace(query: string): Place | undefined {
  const q = query.trim().toLowerCase()
  if (!q) return undefined
  return (
    PLACES.find((p) => p.cap === q) ??
    PLACES.find((p) => p.cap.slice(0, 2) === q.slice(0, 2) && /^\d{5}$/.test(q)) ??
    PLACES.find((p) => p.city.toLowerCase().startsWith(q))
  )
}

export function quoteShipping(place: Place, weightKg: number, subtotal: number, member = false): ShippingQuote[] {
  const nearest = WAREHOUSES.map((w) => ({ w, km: haversine(w, place) })).sort((a, b) => a.km - b.km)[0]
  const km = Math.round(nearest.km)
  const base = 3.9 + Math.max(0, weightKg - 1) * 0.9 + (place.islands ? 4 : 0) + km * 0.004
  const free = member || subtotal >= 39
  const now = new Date()
  const standardDays: [number, number] = [km < 250 ? 1 : 2, km < 250 ? 2 : place.islands ? 5 : 3]
  const mk = (speed: ShipSpeed, label: string, price: number, days: [number, number], available = true, note?: string): ShippingQuote => ({
    speed,
    label,
    price: Math.round(price * 100) / 100,
    days,
    eta: [addBusinessDays(now, days[0]), addBusinessDays(now, days[1])],
    km,
    warehouse: nearest.w.city,
    available,
    note,
  })
  return [
    mk('standard', 'Standard', free ? 0 : base, standardDays, true, free ? 'Gratis sopra 39 €' : undefined),
    mk('express', 'Express', base + 4.9, [1, place.islands ? 2 : 1]),
    mk('sameday', 'In giornata', base + 7.9, [0, 0], km < 60 && weightKg < 10, km < 60 ? 'Ordina entro le 13:00' : 'Non disponibile nella tua zona'),
    mk('locker', 'Punto di ritiro', free ? 0 : Math.max(1.9, base - 2), [standardDays[0], standardDays[1]], true, 'Locker a meno di 1 km'),
  ]
}
