/**
 * NAVIGATION MAP — the single source of truth for "which page leads where".
 *
 * Model (information architecture + user flows):
 *  - Every page is a node in a TREE (`parent`): that gives breadcrumbs and "up".
 *  - Linear journeys are FLOWS (ordered steps): inside a flow Back = previous step, Forward = next step.
 *  - Each node declares its FORWARD exit (primary next action) and SIDEWAYS links (same level).
 *  - GUARDS say what a page needs (items in cart, being logged in) and where to send you otherwise.
 *
 * App.tsx generates the routes from this file and <PageNav> renders back / trail / forward from it,
 * so the site cannot drift from the map. docs/MAPPA_NAVIGAZIONE.md and /#/mappa show it to humans.
 */
import { matchPath } from 'react-router-dom'
import { CATEGORIES, PRODUCT_BY_ID } from '../data/catalog'

export type NodeId =
  | 'home'
  | 'shop'
  | 'product'
  | 'compare'
  | 'wishlist'
  | 'cart'
  | 'checkout.address'
  | 'checkout.shipping'
  | 'checkout.payment'
  | 'checkout.review'
  | 'order'
  | 'login'
  | 'account'
  | 'map'

export type Guard = 'cart' | 'auth' | 'guest'

export interface NavNode {
  id: NodeId
  path: string
  title: string
  /** Up in the tree (breadcrumb parent). */
  parent?: NodeId
  /** Primary way forward from this page. */
  forward?: NodeId
  /** Same-level destinations offered from this page. */
  sideways?: NodeId[]
  guard?: Guard
  /** Terminal pages: Back must not re-enter the flow that led here. */
  terminal?: boolean
  /** Hidden from the visual sitemap's main tree (utility pages). */
  utility?: boolean
  purpose: string
}

export const NODES: Record<NodeId, NavNode> = {
  home: { id: 'home', path: '/', title: 'Home', forward: 'shop', sideways: ['wishlist', 'cart', 'account'], purpose: 'Vetrina: ispirazione, categorie, offerte, feed.' },
  shop: { id: 'shop', path: '/shop', title: 'Shop', parent: 'home', forward: 'product', sideways: ['compare'], purpose: 'Catalogo, ricerca e filtri (categoria, prezzo, voto…).' },
  product: { id: 'product', path: '/p/:id', title: 'Prodotto', parent: 'shop', forward: 'cart', sideways: ['compare', 'wishlist'], purpose: 'Scheda prodotto, dati, recensioni. Da qui al carrello o al checkout.' },
  compare: { id: 'compare', path: '/compare', title: 'Confronto', parent: 'shop', forward: 'cart', purpose: 'Confronto fino a 4 prodotti.' },
  wishlist: { id: 'wishlist', path: '/wishlist', title: 'Preferiti', parent: 'home', forward: 'cart', sideways: ['cart'], purpose: 'Salvati, variazioni di prezzo, avvisi.' },
  cart: { id: 'cart', path: '/cart', title: 'Carrello', parent: 'home', forward: 'checkout.address', sideways: ['wishlist'], purpose: 'Rivedi quantità, coupon, spedizione gratuita.' },
  'checkout.address': { id: 'checkout.address', path: '/checkout/indirizzo', title: 'Indirizzo', parent: 'cart', forward: 'checkout.shipping', guard: 'cart', purpose: 'Checkout 1/4 — dove spediamo.' },
  'checkout.shipping': { id: 'checkout.shipping', path: '/checkout/spedizione', title: 'Spedizione', parent: 'cart', forward: 'checkout.payment', guard: 'cart', purpose: 'Checkout 2/4 — velocità e prezzo.' },
  'checkout.payment': { id: 'checkout.payment', path: '/checkout/pagamento', title: 'Pagamento', parent: 'cart', forward: 'checkout.review', guard: 'cart', purpose: 'Checkout 3/4 — carta, wallet, PayPal, bonifico, rate.' },
  'checkout.review': { id: 'checkout.review', path: '/checkout/riepilogo', title: 'Riepilogo', parent: 'cart', forward: 'order', guard: 'cart', purpose: 'Checkout 4/4 — conferma e paga.' },
  order: { id: 'order', path: '/ordine/:id', title: 'Ordine confermato', parent: 'home', forward: 'account', sideways: ['shop'], terminal: true, purpose: 'Conferma e tracking. Indietro non rientra nel pagamento.' },
  login: { id: 'login', path: '/login', title: 'Accedi', parent: 'home', forward: 'account', guard: 'guest', purpose: 'Google, Apple, passkey, email. Poi torna dove eri (?next=).' },
  account: { id: 'account', path: '/account', title: 'Account', parent: 'home', sideways: ['wishlist', 'cart'], guard: 'auth', purpose: 'Ordini, estensioni, Plus, indirizzi, pagamenti, sicurezza.' },
  map: { id: 'map', path: '/mappa', title: 'Mappa del sito', parent: 'home', utility: true, purpose: 'Questa mappa, generata dal codice.' },
}

/** Linear journeys. Back/Forward inside them follow the step order, not the tree. */
export const FLOWS = {
  checkout: {
    title: 'Checkout',
    entry: 'cart' as NodeId,
    steps: ['checkout.address', 'checkout.shipping', 'checkout.payment', 'checkout.review'] as const satisfies readonly NodeId[],
    exit: 'order' as NodeId,
  },
}

export const CHECKOUT_STEPS: readonly NodeId[] = FLOWS.checkout.steps

export function flowOf(id: NodeId) {
  for (const [name, f] of Object.entries(FLOWS)) {
    const steps: readonly NodeId[] = f.steps
    const i = steps.indexOf(id)
    if (i >= 0) return { name, flow: f, index: i }
  }
  return null
}

/** Build a concrete URL for a node (fills :params). */
export function pathOf(id: NodeId, params: Record<string, string> = {}) {
  return NODES[id].path.replace(/:(\w+)/g, (_, k) => params[k] ?? '')
}

export interface Resolved {
  node: NavNode
  params: Record<string, string>
}

/** Which node is this URL? Most specific path wins. */
export function resolve(pathname: string): Resolved | null {
  for (const node of Object.values(NODES)) {
    const m = matchPath({ path: node.path, end: true }, pathname)
    if (m) return { node, params: m.params as Record<string, string> }
  }
  return null
}

export interface Crumb {
  id: NodeId
  label: string
  to: string
}

export interface NavContext {
  search: URLSearchParams
  /** Last listing URL the user browsed (keeps filters when going back from a product). */
  lastListing?: string
}

function shopLabel(search: URLSearchParams) {
  const q = search.get('q')
  if (q) return `“${q}”`
  if (search.get('deals')) return 'Offerte'
  const c = CATEGORIES.find((x) => x.id === search.get('category'))
  return c?.label
}

/** Breadcrumb trail = path from the root to the current node, with live labels. */
export function trail(r: Resolved, ctx: NavContext): Crumb[] {
  const out: Crumb[] = []
  // Walk up the tree.
  const chain: NavNode[] = []
  let n: NavNode | undefined = r.node
  while (n) {
    chain.unshift(n)
    n = n.parent ? NODES[n.parent] : undefined
  }
  for (const node of chain) {
    if (node.id === 'shop') {
      out.push({ id: 'shop', label: 'Shop', to: '/shop' })
      const here = r.node.id === 'shop' ? ctx.search : null
      const product = r.node.id === 'product' ? PRODUCT_BY_ID.get(r.params.id) : undefined
      // Category level: from the product itself, or from the current filters.
      const cat = product ? CATEGORIES.find((c) => c.id === product.category) : undefined
      if (cat) out.push({ id: 'shop', label: cat.label, to: `/shop?category=${cat.id}` })
      else if (here && shopLabel(here)) out.push({ id: 'shop', label: shopLabel(here)!, to: `/shop?${here.toString()}` })
      continue
    }
    if (node.id === 'product') {
      out.push({ id: 'product', label: PRODUCT_BY_ID.get(r.params.id)?.name ?? 'Prodotto', to: pathOf('product', r.params) })
      continue
    }
    if (node.id === 'order') {
      out.push({ id: 'order', label: `Ordine ${r.params.id}`, to: pathOf('order', r.params) })
      continue
    }
    const f = flowOf(node.id)
    out.push({ id: node.id, label: f ? `${f.flow.title} · ${node.title}` : node.title, to: pathOf(node.id) })
  }
  return out
}

export interface Move {
  label: string
  to: string
  id: NodeId
}

/** Rules for Back: flow → previous step; terminal → never back into the flow; product → last listing; else → parent. */
export function backOf(r: Resolved, ctx: NavContext): Move | null {
  const f = flowOf(r.node.id)
  if (f) {
    const steps: readonly NodeId[] = f.flow.steps
    const prev = f.index === 0 ? f.flow.entry : steps[f.index - 1]
    return { id: prev, to: pathOf(prev), label: f.index === 0 ? 'Carrello' : NODES[prev].title }
  }
  if (r.node.terminal) return { id: 'shop', to: '/shop', label: 'Continua lo shopping' }
  if (r.node.id === 'product' && ctx.lastListing) return { id: 'shop', to: ctx.lastListing, label: 'Risultati' }
  if (r.node.id === 'shop' && [...ctx.search.keys()].length) return { id: 'shop', to: '/shop', label: 'Tutto lo shop' }
  const p = r.node.parent
  return p ? { id: p, to: pathOf(p), label: NODES[p].title } : null
}

/** Rules for Forward: the node's declared primary exit, when it makes sense right now. */
export function forwardOf(r: Resolved, state: { cartCount: number; loggedIn: boolean; next?: string | null }): Move | null {
  const id = r.node.forward
  if (!id) return null
  switch (r.node.id) {
    case 'home':
      return { id, to: '/shop', label: 'Shop' }
    case 'shop':
      return null // forward = pick a product: the grid is the forward action
    case 'product':
    case 'compare':
    case 'wishlist':
      return state.cartCount ? { id, to: pathOf(id), label: `Carrello (${state.cartCount})` } : null
    case 'cart':
      return state.cartCount ? { id, to: pathOf(id), label: 'Checkout' } : null
    case 'order':
      return { id, to: state.loggedIn ? '/account' : '/login?next=/account', label: 'I miei ordini' }
    case 'login':
      return null
    default:
      if (flowOf(r.node.id)) return null // steps advance with their own validated button
      return { id, to: pathOf(id), label: NODES[id].title }
  }
}

/** Where a guard sends you when its condition isn't met. */
export function guardRedirect(guard: Guard | undefined, state: { cartCount: number; loggedIn: boolean }, here: string): string | null {
  if (guard === 'cart' && state.cartCount === 0) return '/cart'
  if (guard === 'auth' && !state.loggedIn) return `/login?next=${encodeURIComponent(here)}`
  if (guard === 'guest' && state.loggedIn) return '/account'
  return null
}
