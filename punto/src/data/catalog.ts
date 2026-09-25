import { clamp, hash, mulberry32, pick, range } from '../lib/rng'
import type { Category, CategoryId, PricePoint, Product, Question, RatingPoint, Review, Variant } from './types'

export const CATEGORIES: Category[] = [
  { id: 'audio', label: 'Audio', code: 'AUD' },
  { id: 'phone', label: 'Smartphone', code: 'PHN' },
  { id: 'camera', label: 'Camera', code: 'CAM' },
  { id: 'wearable', label: 'Wearable', code: 'WRB' },
  { id: 'computing', label: 'Computer', code: 'CMP' },
  { id: 'gaming', label: 'Gaming', code: 'GMG' },
  { id: 'home', label: 'Casa smart', code: 'HOM' },
  { id: 'power', label: 'Energia', code: 'PWR' },
]

const BRANDS = ['Lumen', 'Kōdo', 'Vektor', 'Nordic Lab', 'Ondo', 'Axis', 'Monolith', 'Halo', 'Pixelwerk', 'Stroma']

const TEMPLATES: Record<CategoryId, { names: string[]; taglines: string[]; base: [number, number]; weight: [number, number]; unit?: string }> = {
  audio: {
    names: ['Ear (a)', 'Headphone One', 'Buds Pro', 'Studio Over', 'Pods Lite', 'Arc ANC', 'Monitor 2'],
    taglines: ['Cancellazione attiva, 45h di autonomia.', 'Suono trasparente. Design trasparente.', 'Bassi profondi, peso piuma.'],
    base: [49, 399],
    weight: [0.1, 0.45],
  },
  phone: {
    names: ['Phone (3)', 'Edge 12', 'Mini S', 'Ultra 5G', 'Fold Air', 'Neo X'],
    taglines: ['Interfaccia glyph, zero distrazioni.', 'La fotocamera che vede di notte.', 'Batteria di due giorni, davvero.'],
    base: [249, 1399],
    weight: [0.18, 0.3],
  },
  camera: {
    names: ['Tiny 2 Webcam', 'Tail Air', 'Action 4K', 'Mirrorless M1', 'Gimbal Cam', 'Meet 4K'],
    taglines: ['Tracking AI, gimbal a 2 assi.', '4K a 60fps, stabilizzazione ottica.', 'Il set da streaming in 90 grammi.'],
    base: [89, 1899],
    weight: [0.09, 0.9],
  },
  wearable: {
    names: ['Watch Pro', 'Band 8', 'Ring Gen 3', 'Watch Lite', 'Sport GPS'],
    taglines: ['Sensori medicali, 14 giorni di batteria.', 'Il fitness tracker che non vedi.', 'AMOLED sempre acceso.'],
    base: [39, 699],
    weight: [0.03, 0.12],
  },
  computing: {
    names: ['Book 14', 'Keyboard 75', 'Mouse Air', 'Monitor 27 4K', 'Dock 12-in-1', 'Tablet 11'],
    taglines: ['Alluminio unibody, 18h di lavoro.', 'Hot-swap, gasket mount, silenziosa.', 'Precisione 26K DPI, 58 grammi.'],
    base: [29, 2299],
    weight: [0.06, 6.5],
  },
  gaming: {
    names: ['Pad Pro', 'Handheld X', 'Headset 7.1', 'Arcade Stick', 'Wheel GT'],
    taglines: ['Hall effect: zero drift, per sempre.', 'La tua libreria PC, in tasca.', 'Latenza 1ms, 2.4GHz.'],
    base: [39, 799],
    weight: [0.2, 5],
  },
  home: {
    names: ['Speaker Mono', 'Lamp Halo', 'Hub Zero', 'Air Purifier S', 'Thermo Smart', 'Cam Indoor'],
    taglines: ['Suono a 360°, Matter-ready.', 'Luce circadiana automatica.', 'Filtro HEPA H13, silenzioso.'],
    base: [29, 549],
    weight: [0.3, 7],
  },
  power: {
    names: ['Charger 65W GaN', 'Power Bank 20K', 'Cavo USB-C 2m', 'Stand MagSafe 3in1', 'Charger 140W'],
    taglines: ['Tre porte, un solo mattoncino.', 'Ricarica un laptop due volte.', 'Intrecciato, 240W, indistruttibile.'],
    base: [12, 179],
    weight: [0.05, 0.5],
    unit: 'W',
  },
}

const SWATCHES: Variant[] = [
  { id: 'white', label: 'Bianco', swatch: '#f5f5f3' },
  { id: 'black', label: 'Nero', swatch: '#141414' },
  { id: 'grey', label: 'Grigio', swatch: '#9a9a96' },
  { id: 'clear', label: 'Trasparente', swatch: '#dcdcd8' },
  { id: 'red', label: 'Rosso segnale', swatch: '#ff2b2b' },
  { id: 'yellow', label: 'Giallo', swatch: '#ffd400' },
]

const SELLERS = ['PUNTO.', 'PUNTO.', 'PUNTO.', 'TechStore IT', 'ElettroHub', 'Bottega Digitale']
const DAY = 86_400_000
export const NOW = Date.UTC(2026, 8, 25)

function makePriceHistory(r: () => number, price: number, listPrice: number): PricePoint[] {
  const points: PricePoint[] = []
  let p = listPrice
  for (let d = 365; d >= 0; d -= 1) {
    // Prices move in steps like real marketplace repricing (Keepa-style).
    if (r() < 0.05) p = Math.min(listPrice * 1.02, price * range(r, 0.93, 1.3))
    // Black Friday & Prime-day style dips.
    const date = new Date(NOW - d * DAY)
    const isBF = date.getUTCMonth() === 10 && date.getUTCDate() >= 24
    const isSummer = date.getUTCMonth() === 6 && date.getUTCDate() >= 8 && date.getUTCDate() <= 12
    const shown = isBF ? p * 0.8 : isSummer ? p * 0.87 : p
    points.push({ t: date.getTime(), price: Math.round(shown * 100) / 100 })
  }
  // The current offer started a few days ago.
  const since = 1 + Math.floor(r() * 12)
  for (let i = points.length - since; i < points.length; i++) points[i].price = price
  return points
}

function makeRatingHistory(r: () => number, finalAvg: number, total: number): RatingPoint[] {
  const out: RatingPoint[] = []
  let avg = clamp(finalAvg + range(r, -0.6, 0.4), 2.5, 5)
  let remaining = total
  for (let m = 11; m >= 0; m--) {
    const d = new Date(NOW)
    d.setUTCMonth(d.getUTCMonth() - m, 1)
    avg = avg + (finalAvg - avg) * 0.25 + range(r, -0.12, 0.12)
    const count = m === 0 ? remaining : Math.max(1, Math.round((total / 12) * range(r, 0.4, 1.6)))
    remaining = Math.max(0, remaining - count)
    out.push({ t: d.getTime(), avg: Math.round(clamp(avg, 1, 5) * 100) / 100, count })
  }
  out[out.length - 1].avg = finalAvg
  return out
}

function makeProduct(i: number): Product {
  const r = mulberry32(hash(`punto-${i}`))
  const category = CATEGORIES[i % CATEGORIES.length].id
  const tpl = TEMPLATES[category]
  const brand = pick(r, BRANDS)
  const model = pick(r, tpl.names)
  const gen = Math.floor(range(r, 1, 6))
  const name = `${brand} ${model}${r() < 0.4 ? ` Gen ${gen}` : ''}`
  const listPrice = Math.round(range(r, tpl.base[0], tpl.base[1])) - 0.01
  const discount = r() < 0.55 ? range(r, 0.05, 0.38) : 0
  const price = Math.round(listPrice * (1 - discount)) - 0.01
  // Some sellers inflate list price to fake a discount — exposed by the "Sconto reale" tool.
  const fakeList = r() < 0.2 ? Math.round(listPrice * range(r, 1.2, 1.5)) - 0.01 : listPrice
  const rating = Math.round(range(r, 3.1, 4.9) * 10) / 10
  const reviewCount = Math.floor(Math.pow(r(), 2) * 12000) + 12
  const five = clamp((rating - 3) / 2, 0.15, 0.85)
  const rest = 1 - five
  const distribution: Product['distribution'] = [five, rest * 0.45, rest * 0.25, rest * 0.12, rest * 0.18]
  const variants = [...SWATCHES].sort(() => r() - 0.5).slice(0, 2 + Math.floor(r() * 3))
  const weightKg = Math.round(range(r, tpl.weight[0], tpl.weight[1]) * 100) / 100
  const watts = [20, 30, 45, 65, 100, 140][Math.floor(r() * 6)]

  return {
    id: `P${(1000 + i).toString(36).toUpperCase()}${i}`,
    name,
    brand,
    category,
    tagline: pick(r, tpl.taglines),
    description: `${name} nasce da un'idea semplice: togliere tutto ciò che non serve. ${pick(r, tpl.taglines)} Materiali riciclati, packaging senza plastica e aggiornamenti firmware garantiti per 4 anni.`,
    bullets: [
      pick(r, tpl.taglines),
      `Garanzia ${[12, 24, 36][Math.floor(r() * 3)]} mesi, reso gratuito in 30 giorni`,
      `Compatibile con iOS, Android, Windows e macOS`,
      `Materiali: alluminio riciclato ${Math.floor(range(r, 40, 100))}%`,
    ],
    specs: [
      ['Marca', brand],
      ['Modello', `${model} (${new Date(NOW).getUTCFullYear() - Math.floor(r() * 3)})`],
      ['Peso', `${Math.round(weightKg * 1000)} g`],
      ['Connettività', pick(r, ['USB-C, BT 5.4', 'Wi-Fi 7, BT 5.3', 'USB-C 3.2', 'Matter, Thread, Wi-Fi'])],
      ['Batteria', pick(r, ['—', '4.500 mAh', '45 h', '14 giorni', '20.000 mAh'])],
      ['Colori', variants.map((v) => v.label).join(', ')],
      ['Codice', `PT-${category.toUpperCase().slice(0, 3)}-${i.toString().padStart(4, '0')}`],
    ],
    price,
    listPrice: fakeList,
    rating,
    reviewCount,
    distribution,
    priceHistory: makePriceHistory(r, price, listPrice),
    ratingHistory: makeRatingHistory(r, rating, reviewCount),
    variants,
    stock: r() < 0.12 ? Math.floor(range(r, 1, 6)) : Math.floor(range(r, 10, 400)),
    weightKg,
    seller: pick(r, SELLERS),
    sponsored: r() < 0.14,
    fastShipping: r() < 0.62,
    returnDays: pick(r, [14, 30, 30, 60]),
    warrantyMonths: pick(r, [12, 24, 24, 36]),
    trustScore: Math.round(clamp(range(r, 30, 100) + (reviewCount > 3000 ? 8 : 0), 0, 99)),
    coupon: r() < 0.25 ? { code: `PT${Math.floor(range(r, 5, 20))}`, off: Math.floor(range(r, 5, 20)) } : null,
    unit: tpl.unit ? { amount: watts, label: 'W' } : null,
    eco: Math.round(range(r, 1.5, 5) * 2) / 2,
    createdAt: NOW - Math.floor(range(r, 1, 700)) * DAY,
  }
}

export const PRODUCTS: Product[] = Array.from({ length: 320 }, (_, i) => makeProduct(i))
export const PRODUCT_BY_ID = new Map(PRODUCTS.map((p) => [p.id, p]))
export const ALL_BRANDS = [...new Set(PRODUCTS.map((p) => p.brand))].sort()

/* ---------------- Derived "extension" metrics ---------------- */

export function priceStats(p: Product, days = 90) {
  const slice = p.priceHistory.slice(-days - 1)
  const prices = slice.map((x) => x.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length
  const sorted = [...prices].sort((a, b) => a - b)
  const median = sorted[Math.floor(sorted.length / 2)]
  return { min, max, avg, median }
}

/** Discount measured against the 90-day median rather than the (often inflated) list price. */
export function realDiscount(p: Product) {
  const { median } = priceStats(p, 90)
  return Math.round(((median - p.price) / median) * 100)
}

export function claimedDiscount(p: Product) {
  return Math.round(((p.listPrice - p.price) / p.listPrice) * 100)
}

/** 0..100 — how good the current price is vs. the last year. */
export function dealScore(p: Product) {
  const { min, max } = priceStats(p, 365)
  if (max === min) return 50
  return Math.round(((max - p.price) / (max - min)) * 100)
}

export function trustGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 85) return 'A'
  if (score >= 70) return 'B'
  if (score >= 55) return 'C'
  if (score >= 40) return 'D'
  return 'F'
}

/** Rating recomputed discarding suspicious reviews (ReviewMeta-style). */
export function adjustedRating(p: Product) {
  const penalty = ((100 - p.trustScore) / 100) * 0.9
  return Math.max(1, Math.round((p.rating - penalty) * 10) / 10)
}

/* ---------------- Reviews / Q&A (lazy & deterministic) ---------------- */

const FIRST = ['Giulia', 'Marco', 'Sara', 'Luca', 'Elena', 'Davide', 'Chiara', 'Paolo', 'Anna', 'Matteo', 'Irene', 'Fede', 'Nico', 'Alessia']
const LAST = ['R.', 'B.', 'C.', 'M.', 'F.', 'G.', 'L.', 'T.', 'V.', 'P.']
const GOOD = [
  ['Semplicemente perfetto', 'Costruzione solidissima, si sente la qualità appena lo prendi in mano. Il software è pulito, niente bloatware.'],
  ['Design da museo', 'Lo tengo sulla scrivania anche solo da guardare. Funziona benissimo e la batteria dura più del dichiarato.'],
  ['Miglior acquisto dell’anno', 'Consegna in 24h, imballaggio minimale e riciclabile. Configurazione in due minuti.'],
  ['Vale ogni centesimo', 'Ho confrontato con due concorrenti più costosi: questo vince su materiali e su assistenza.'],
]
const MID = [
  ['Buono ma non eccezionale', 'Fa quello che promette, però l’app ogni tanto perde la connessione. Spero in un aggiornamento.'],
  ['Qualche compromesso', 'Esteticamente bellissimo, ma si riga facilmente. Consiglio una custodia.'],
]
const BAD = [
  ['Deluso', 'Dopo tre settimane ha iniziato a scaldare. Reso gestito bene, almeno quello.'],
  ['Non come in foto', 'Il colore è più scuro rispetto alle immagini e il manuale è solo in inglese.'],
]
const SUSPICIOUS = [['Ottimo prodotto!!!', 'Ottimo prodotto consiglio a tutti 5 stelle super veloce ottimo ottimo.']]
const COMMENTS = [
  'Confermo, anche per me stessa esperienza.',
  'Hai provato ad aggiornare il firmware? A me ha risolto.',
  'Quanto dura davvero la batteria con uso intenso?',
  'Grazie, recensione utilissima!',
  'Il mio è arrivato con un graffio, sostituito in 2 giorni.',
]

export function getReviews(p: Product): Review[] {
  const r = mulberry32(hash(`rev-${p.id}`))
  const n = 24
  return Array.from({ length: n }, (_, i) => {
    const roll = r()
    const suspicious = r() * 100 > p.trustScore + 10
    const rating = suspicious ? 5 : roll < p.distribution[0] ? 5 : roll < 0.8 ? 4 : roll < 0.88 ? 3 : roll < 0.94 ? 2 : 1
    const pool = suspicious ? SUSPICIOUS : rating >= 4 ? GOOD : rating === 3 ? MID : BAD
    const [title, body] = pick(r, pool)
    const nComments = Math.floor(Math.pow(r(), 2.2) * 4)
    return {
      id: `${p.id}-r${i}`,
      productId: p.id,
      author: `${pick(r, FIRST)} ${pick(r, LAST)}`,
      avatarHue: Math.floor(r() * 360),
      rating,
      title,
      body,
      date: NOW - Math.floor(range(r, 1, 360)) * DAY,
      verified: !suspicious && r() < 0.85,
      helpful: Math.floor(Math.pow(r(), 3) * 400),
      variant: pick(r, p.variants).label,
      suspicious,
      comments: Array.from({ length: nComments }, (_, j) => {
        const isSeller = j === 0 && r() < 0.3
        return {
          id: `${p.id}-r${i}-c${j}`,
          author: isSeller ? p.seller : `${pick(r, FIRST)} ${pick(r, LAST)}`,
          isSeller,
          body: isSeller ? 'Grazie per il feedback! Scrivici in chat per qualsiasi dubbio.' : pick(r, COMMENTS),
          date: NOW - Math.floor(range(r, 0, 30)) * DAY,
        }
      }),
    }
  }).sort((a, b) => b.helpful - a.helpful)
}

export function getQuestions(p: Product): Question[] {
  const r = mulberry32(hash(`qa-${p.id}`))
  const qs: [string, string][] = [
    ['È compatibile con iPhone?', 'Sì, funziona con iOS 16 e successivi tramite app dedicata.'],
    ['Include il caricatore?', 'Nella confezione c’è solo il cavo USB-C, per ridurre i rifiuti.'],
    ['La garanzia è italiana?', `Sì, ${p.warrantyMonths} mesi con assistenza in Italia.`],
    ['Si può usare mentre è in carica?', 'Sì, senza problemi di surriscaldamento.'],
  ]
  return qs.map(([q, a], i) => ({ id: `${p.id}-q${i}`, q, a, votes: Math.floor(r() * 90) }))
}

export function similar(p: Product, n = 8) {
  return PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id)
    .sort((a, b) => Math.abs(a.price - p.price) - Math.abs(b.price - p.price))
    .slice(0, n)
}
