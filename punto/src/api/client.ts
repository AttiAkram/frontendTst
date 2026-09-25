/**
 * Mock API. Every function mirrors an endpoint the backend should expose —
 * swap the body for a `fetch()` and the UI keeps working. See docs/API.md.
 */
import { PRODUCTS, PRODUCT_BY_ID, dealScore, getQuestions, getReviews, realDiscount, similar } from '../data/catalog'
import type { CatalogQuery, Product } from '../data/types'

const latency = (ms = 350) => new Promise((r) => setTimeout(r, ms + Math.random() * 250))

export interface Page<T> {
  items: T[]
  total: number
  nextOffset: number | null
}

function matches(p: Product, q: string) {
  const s = `${p.name} ${p.brand} ${p.category} ${p.tagline}`.toLowerCase()
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => s.includes(w))
}

export function queryCatalog(query: CatalogQuery): Product[] {
  let list = PRODUCTS.filter((p) => {
    if (query.q && !matches(p, query.q)) return false
    if (query.category && query.category !== 'all' && p.category !== query.category) return false
    if (query.brands?.length && !query.brands.includes(p.brand)) return false
    if (query.min != null && p.price < query.min) return false
    if (query.max != null && p.price > query.max) return false
    if (query.rating && p.rating < query.rating) return false
    if (query.fast && !p.fastShipping) return false
    if (query.deals && realDiscount(p) < 5) return false
    if (query.trusted && p.trustScore < 70) return false
    if (query.hideSponsored && p.sponsored) return false
    return true
  })
  const by = (f: (p: Product) => number) => (list = [...list].sort((a, b) => f(a) - f(b)))
  switch (query.sort) {
    case 'price-asc': by((p) => p.price); break
    case 'price-desc': by((p) => -p.price); break
    case 'rating': by((p) => -(p.rating * Math.log10(p.reviewCount + 10))); break
    case 'reviews': by((p) => -p.reviewCount); break
    case 'deal': by((p) => -dealScore(p)); break
    case 'newest': by((p) => -p.createdAt); break
    case 'unit': by((p) => (p.unit ? p.price / p.unit.amount : Infinity)); break
    default:
      // Sponsored get a boost unless hidden — like the real thing, but you can turn it off.
      by((p) => -(p.rating * Math.log10(p.reviewCount + 10)) - (p.sponsored ? 4 : 0))
  }
  return list
}

export async function listProducts(query: CatalogQuery): Promise<Page<Product>> {
  await latency()
  const all = queryCatalog(query)
  const offset = query.offset ?? 0
  const limit = query.limit ?? 12
  const items = all.slice(offset, offset + limit)
  return { items, total: all.length, nextOffset: offset + limit < all.length ? offset + limit : null }
}

export async function getProduct(id: string) {
  await latency(200)
  const p = PRODUCT_BY_ID.get(id)
  if (!p) throw new Error('Prodotto non trovato')
  return { product: p, reviews: getReviews(p), questions: getQuestions(p), similar: similar(p) }
}

export function suggest(q: string, n = 6) {
  if (!q.trim()) return []
  return PRODUCTS.filter((p) => matches(p, q)).slice(0, n)
}

export type AuthProvider = 'google' | 'apple' | 'email' | 'passkey'

export async function signIn(provider: AuthProvider, email?: string) {
  await latency(700)
  const names: Record<AuthProvider, string> = { google: 'Utente Google', apple: 'Utente Apple', email: email?.split('@')[0] ?? 'Utente', passkey: 'Utente passkey' }
  return { id: 'u_1', name: names[provider], email: email ?? `demo@${provider}.com`, provider }
}

export type PayMethod = 'applepay' | 'googlepay' | 'paypal' | 'card' | 'bank' | 'klarna'

export async function placeOrder(_payload: { method: PayMethod; total: number }) {
  await latency(1400)
  return { orderId: `PT-${Date.now().toString(36).toUpperCase()}` }
}
