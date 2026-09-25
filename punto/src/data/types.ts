export type CategoryId =
  | 'audio'
  | 'phone'
  | 'camera'
  | 'wearable'
  | 'computing'
  | 'gaming'
  | 'home'
  | 'power'

export interface Category {
  id: CategoryId
  label: string
  code: string
}

export interface PricePoint {
  t: number // epoch ms
  price: number
}

export interface RatingPoint {
  t: number
  avg: number
  count: number
}

export interface Variant {
  id: string
  label: string
  swatch: string
}

export interface Product {
  id: string
  name: string
  brand: string
  category: CategoryId
  tagline: string
  description: string
  bullets: string[]
  specs: [string, string][]
  price: number
  listPrice: number
  rating: number
  reviewCount: number
  distribution: [number, number, number, number, number] // 5★ → 1★ share (0..1)
  priceHistory: PricePoint[]
  ratingHistory: RatingPoint[]
  variants: Variant[]
  stock: number
  weightKg: number
  seller: string
  sponsored: boolean
  fastShipping: boolean
  returnDays: number
  warrantyMonths: number
  /** 0..100 — how trustworthy the review set looks (Fakespot-style). */
  trustScore: number
  coupon: { code: string; off: number } | null
  unit: { amount: number; label: string } | null
  eco: number // 0..5
  createdAt: number
}

export interface Review {
  id: string
  productId: string
  author: string
  avatarHue: number
  rating: number
  title: string
  body: string
  date: number
  verified: boolean
  helpful: number
  variant: string
  suspicious: boolean
  comments: ReviewComment[]
}

export interface ReviewComment {
  id: string
  author: string
  body: string
  date: number
  isSeller?: boolean
}

export interface Question {
  id: string
  q: string
  a: string
  votes: number
}

export type SortKey = 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'reviews' | 'deal' | 'newest' | 'unit'

export interface CatalogQuery {
  q?: string
  category?: CategoryId | 'all'
  brands?: string[]
  min?: number
  max?: number
  rating?: number
  fast?: boolean
  deals?: boolean
  trusted?: boolean
  hideSponsored?: boolean
  sort?: SortKey
  offset?: number
  limit?: number
}
