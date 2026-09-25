import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { AuthProvider } from '../api/client'
import { PRODUCT_BY_ID } from '../data/catalog'

export interface CartLine {
  id: string
  variant: string
  qty: number
}

export interface Toast {
  id: number
  text: string
  tone: 'cart' | 'buy' | 'fav' | 'account' | 'neutral'
}

export interface Extensions {
  priceHistory: boolean
  reviewCheck: boolean
  coupons: boolean
  hideSponsored: boolean
  realDiscount: boolean
  unitPrice: boolean
  compare: boolean
}

export const EXTENSION_INFO: Record<keyof Extensions, { title: string; desc: string; replaces: string }> = {
  priceHistory: { title: 'Storico prezzi', desc: 'Grafico prezzi a 1 anno, minimi e massimi, su ogni prodotto.', replaces: 'Keepa · CamelCamelCamel' },
  reviewCheck: { title: 'Analisi recensioni', desc: 'Voto di affidabilità A–F e rating ricalcolato senza recensioni sospette.', replaces: 'Fakespot · ReviewMeta' },
  coupons: { title: 'Coupon automatici', desc: 'Trova e applica il miglior codice sconto al checkout.', replaces: 'Honey · Capital One Shopping' },
  hideSponsored: { title: 'Nascondi sponsorizzati', desc: 'Rimuove i risultati a pagamento dalle liste.', replaces: 'uBlock filtri Amazon' },
  realDiscount: { title: 'Sconto reale', desc: 'Calcola lo sconto sulla mediana a 90 giorni, non sul prezzo di listino gonfiato.', replaces: 'Keepa · Pricepulse' },
  unitPrice: { title: 'Prezzo unitario', desc: 'Mostra €/W, €/pezzo e ordina per convenienza.', replaces: 'Amazon Unit Price Sorter' },
  compare: { title: 'Confronto rapido', desc: 'Metti fino a 4 prodotti a confronto fianco a fianco.', replaces: 'Comparatori esterni' },
}

interface State {
  cart: CartLine[]
  saved: string[]
  wishlist: { id: string; addedPrice: number; addedAt: number }[]
  alerts: { id: string; target: number }[]
  compare: string[]
  recent: string[]
  user: { id: string; name: string; email: string; provider: AuthProvider } | null
  member: boolean
  cap: string
  /** Last shop URL browsed — Back from a product returns to these exact results. */
  lastListing: string
  setLastListing: (url: string) => void
  extensions: Extensions
  toasts: Toast[]
  /** In-flight API calls — drives the glowing loading line. */
  pending: number
  addToCart: (id: string, variant: string, qty?: number) => void
  setQty: (id: string, variant: string, qty: number) => void
  removeLine: (id: string, variant: string) => void
  saveForLater: (id: string, variant: string) => void
  moveToCart: (id: string) => void
  clearCart: () => void
  toggleWish: (id: string) => void
  setAlert: (id: string, target: number | null) => void
  toggleCompare: (id: string) => void
  viewed: (id: string) => void
  login: (u: State['user']) => void
  logout: () => void
  setMember: (v: boolean) => void
  setCap: (cap: string) => void
  setExt: (k: keyof Extensions, v: boolean) => void
  toast: (text: string, tone?: Toast['tone']) => void
  dismiss: (id: number) => void
}

let toastId = 0

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],
      saved: [],
      wishlist: [],
      alerts: [],
      compare: [],
      recent: [],
      user: null,
      member: false,
      cap: '',
      lastListing: '',
      setLastListing: (lastListing) => set({ lastListing }),
      extensions: {
        priceHistory: true,
        reviewCheck: true,
        coupons: true,
        hideSponsored: false,
        realDiscount: true,
        unitPrice: true,
        compare: true,
      },
      toasts: [],
      pending: 0,
      addToCart: (id, variant, qty = 1) => {
        const cart = [...get().cart]
        const line = cart.find((l) => l.id === id && l.variant === variant)
        if (line) line.qty += qty
        else cart.push({ id, variant, qty })
        set({ cart: cart.map((l) => ({ ...l })) })
        get().toast(`Aggiunto al carrello — ${PRODUCT_BY_ID.get(id)?.name ?? ''}`, 'cart')
      },
      setQty: (id, variant, qty) =>
        set({ cart: get().cart.map((l) => (l.id === id && l.variant === variant ? { ...l, qty: Math.max(1, Math.min(10, qty)) } : l)) }),
      removeLine: (id, variant) => set({ cart: get().cart.filter((l) => !(l.id === id && l.variant === variant)) }),
      saveForLater: (id, variant) => {
        get().removeLine(id, variant)
        set({ saved: [...new Set([id, ...get().saved])] })
      },
      moveToCart: (id) => {
        const p = PRODUCT_BY_ID.get(id)
        set({ saved: get().saved.filter((x) => x !== id) })
        if (p) get().addToCart(id, p.variants[0].id)
      },
      clearCart: () => set({ cart: [] }),
      toggleWish: (id) => {
        const has = get().wishlist.some((w) => w.id === id)
        const p = PRODUCT_BY_ID.get(id)
        set({
          wishlist: has ? get().wishlist.filter((w) => w.id !== id) : [{ id, addedPrice: p?.priceHistory.at(-30)?.price ?? p?.price ?? 0, addedAt: Date.now() }, ...get().wishlist],
        })
        get().toast(has ? 'Rimosso dai preferiti' : 'Salvato nei preferiti', 'fav')
      },
      setAlert: (id, target) => {
        const rest = get().alerts.filter((a) => a.id !== id)
        set({ alerts: target == null ? rest : [{ id, target }, ...rest] })
        if (target != null) get().toast('Avviso prezzo attivato', 'neutral')
      },
      toggleCompare: (id) => {
        const c = get().compare
        if (c.includes(id)) return set({ compare: c.filter((x) => x !== id) })
        if (c.length >= 4) return get().toast('Massimo 4 prodotti nel confronto', 'neutral')
        set({ compare: [...c, id] })
      },
      viewed: (id) => set({ recent: [id, ...get().recent.filter((x) => x !== id)].slice(0, 12) }),
      login: (user) => {
        set({ user })
        get().toast(`Bentornato, ${user?.name}`, 'account')
      },
      logout: () => set({ user: null }),
      setMember: (member) => set({ member }),
      setCap: (cap) => set({ cap }),
      setExt: (k, v) => set({ extensions: { ...get().extensions, [k]: v } }),
      toast: (text, tone = 'neutral') => {
        const id = ++toastId
        set({ toasts: [...get().toasts.slice(-2), { id, text, tone }] })
        setTimeout(() => get().dismiss(id), 2800)
      },
      dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
    }),
    {
      name: 'ecommerce-store',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ toasts: _t, pending: _p, ...rest }) => rest,
    },
  ),
)

/** Free standard shipping threshold (€). */
export const FREE_SHIP = 39

export const cartCount = (s: State) => s.cart.reduce((a, l) => a + l.qty, 0)

export function cartTotals(cart: CartLine[], couponOff = 0) {
  const subtotal = cart.reduce((a, l) => a + (PRODUCT_BY_ID.get(l.id)?.price ?? 0) * l.qty, 0)
  const weight = cart.reduce((a, l) => a + (PRODUCT_BY_ID.get(l.id)?.weightKg ?? 0) * l.qty, 0)
  const discount = Math.round(subtotal * (couponOff / 100) * 100) / 100
  return { subtotal, weight, discount }
}

/** Honey-style: find the best coupon among the products in the cart. */
export function bestCoupon(cart: CartLine[]) {
  let best: { code: string; off: number } | null = null
  for (const l of cart) {
    const c = PRODUCT_BY_ID.get(l.id)?.coupon
    if (c && (!best || c.off > best.off)) best = c
  }
  return best
}
