import Lenis from 'lenis'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Heart, Home, MapPin, Search, ShoppingBag, User, X } from 'lucide-react'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { suggest } from '../api/client'
import { CATEGORIES, PRODUCT_BY_ID, PRODUCTS } from '../data/catalog'
import { findPlace } from '../data/shipping'
import { money } from '../lib/format'
import { cartCount, useStore } from '../store/store'
import { ProductArt } from './ProductArt'
import { ShippingEstimator } from './Shipping'
import { Btn, IconBtn, Rule, Sheet } from './ui'

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="PUNTO. home">
      PUNTO<span className="logo__dot" />
    </Link>
  )
}

function useSmoothScroll() {
  const { pathname } = useLocation()
  const lenis = useRef<Lenis | null>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const l = new Lenis({ lerp: 0.11, smoothWheel: true })
    lenis.current = l
    let raf = 0
    const loop = (t: number) => {
      l.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      l.destroy()
    }
  }, [])
  useEffect(() => {
    lenis.current?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
  }, [pathname])
}

export function Layout({ children }: { children: ReactNode }) {
  useSmoothScroll()
  const [search, setSearch] = useState(false)
  const [loc, setLoc] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearch(true)
      }
      if (e.key === '/' && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault()
        setSearch(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="app">
      <Header onSearch={() => setSearch(true)} onLocation={() => setLoc(true)} />
      {/* Enter-only transition: an exit phase + lazy routes could leave the old wrapper stuck invisible. */}
      <motion.main
        key={location.pathname}
        className="main"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.2, 0.7, 0.1, 1] }}
      >
        {children}
      </motion.main>
      <Footer />
      <BottomNav onSearch={() => setSearch(true)} />
      <CompareTray />
      <Toasts />
      <SearchPalette open={search} onClose={() => setSearch(false)} />
      <Sheet open={loc} onClose={() => setLoc(false)} title="Indirizzo di consegna">
        <p className="small muted" style={{ marginBottom: 16 }}>
          Inserisci il CAP: calcoliamo magazzino più vicino, costo e data di consegna per ogni prodotto.
        </p>
        <ShippingEstimator weightKg={1} subtotal={0} />
      </Sheet>
    </div>
  )
}

function Header({ onSearch, onLocation }: { onSearch: () => void; onLocation: () => void }) {
  const count = useStore(cartCount)
  const wish = useStore((s) => s.wishlist.length)
  const user = useStore((s) => s.user)
  const cap = useStore((s) => s.cap)
  const place = findPlace(cap)
  const nav = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <header className={`hdr${scrolled ? ' is-scrolled' : ''}`}>
      <div className="hdr__row container">
        <Logo />
        <nav className="hdr__nav">
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/shop?deals=1&sort=deal">Offerte</NavLink>
          <NavLink to="/compare">Confronta</NavLink>
        </nav>
        <button className="hdr__search" onClick={onSearch}>
          <Search size={16} />
          <span>Cerca tra {PRODUCTS.length} prodotti</span>
          <kbd className="mono">⌘K</kbd>
        </button>
        <div className="hdr__actions">
          <IconBtn label="Cerca" onClick={onSearch}>
            <Search size={18} />
          </IconBtn>
          <IconBtn label="Preferiti" tone="fav" badge={wish} onClick={() => nav('/wishlist')}>
            <Heart size={18} />
          </IconBtn>
          <IconBtn label="Account" tone="account" active={!!user} onClick={() => nav(user ? '/account' : '/login')}>
            <User size={18} />
          </IconBtn>
          <IconBtn label="Carrello" tone="cart" badge={count} onClick={() => nav('/cart')}>
            <ShoppingBag size={18} />
          </IconBtn>
        </div>
      </div>
      <div className="hdr__sub container">
        <button className="hdr__loc mono small" onClick={onLocation}>
          <MapPin size={12} /> {place ? `Consegna a ${place.city} ${place.cap}` : 'Imposta CAP di consegna'}
        </button>
        <div className="hdr__cats">
          {CATEGORIES.map((c) => (
            <NavLink key={c.id} to={`/shop?category=${c.id}`} className="mono small">
              {c.label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  )
}

function BottomNav({ onSearch }: { onSearch: () => void }) {
  const count = useStore(cartCount)
  const wish = useStore((s) => s.wishlist.length)
  const user = useStore((s) => s.user)
  return (
    <nav className="bnav" aria-label="Navigazione">
      <NavLink to="/" end className="bnav__i">
        <Home size={20} />
        <span>Home</span>
      </NavLink>
      <button className="bnav__i" onClick={onSearch}>
        <Search size={20} />
        <span>Cerca</span>
      </button>
      <NavLink to="/wishlist" className="bnav__i bnav__i--fav">
        <Heart size={20} />
        {!!wish && <b>{wish}</b>}
        <span>Preferiti</span>
      </NavLink>
      <NavLink to={user ? '/account' : '/login'} className="bnav__i bnav__i--account">
        <User size={20} />
        <span>Account</span>
      </NavLink>
      <NavLink to="/cart" className="bnav__i bnav__i--cart">
        <ShoppingBag size={20} />
        {!!count && <b>{count}</b>}
        <span>Carrello</span>
      </NavLink>
    </nav>
  )
}

function Footer() {
  return (
    <footer className="ftr">
      <div className="container">
        <Rule variant="end" label="PUNTO. — fine pagina" />
        <div className="ftr__grid">
          <div>
            <p className="dot-title ftr__big">PUNTO.</p>
            <p className="small muted">Un’alternativa ad Amazon con gli strumenti che di solito installi come estensioni, già dentro.</p>
          </div>
          {[
            ['Negozio', ['Tutti i prodotti', 'Offerte vere', 'Novità', 'Ricondizionati']],
            ['Aiuto', ['Spedizioni', 'Resi e rimborsi', 'Garanzia', 'Contatti']],
            ['Account', ['Ordini', 'Indirizzi', 'Pagamenti', 'Estensioni']],
          ].map(([h, items]) => (
            <div key={h as string}>
              <h4 className="mono up muted small">{h}</h4>
              <ul>
                {(items as string[]).map((i) => (
                  <li key={i}>
                    <Link to="/shop" className="small">
                      {i}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="ftr__pay mono small muted">
          <span>VISA</span>
          <span>MASTERCARD</span>
          <span>PAYPAL</span>
          <span>APPLE PAY</span>
          <span>GOOGLE PAY</span>
          <span>KLARNA</span>
          <span>© 2026 PUNTO. demo</span>
        </div>
      </div>
    </footer>
  )
}

function Toasts() {
  const toasts = useStore((s) => s.toasts)
  const dismiss = useStore((s) => s.dismiss)
  return (
    <div className="toasts" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            className={`toast toast--${t.tone}`}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60 }}
            onClick={() => dismiss(t.id)}
          >
            <span className="toast__dot" />
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

function CompareTray() {
  const ids = useStore((s) => s.compare)
  const enabled = useStore((s) => s.extensions.compare)
  const toggle = useStore((s) => s.toggleCompare)
  const { pathname } = useLocation()
  const show = enabled && ids.length > 0 && pathname !== '/compare'
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="ctray" initial={{ y: 120 }} animate={{ y: 0 }} exit={{ y: 120 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
          <span className="mono small up">Confronto {ids.length}/4</span>
          <div className="ctray__items">
            {ids.map((id) => {
              const p = PRODUCT_BY_ID.get(id)!
              return (
                <button key={id} className="ctray__item" onClick={() => toggle(id)} title={`Rimuovi ${p.name}`}>
                  <ProductArt category={p.category} color={p.variants[0].swatch} size={34} />
                  <X size={12} className="ctray__x" />
                </button>
              )
            })}
          </div>
          <Btn to="/compare" tone="ink" size="sm" icon={<ArrowUpRight size={14} />}>
            Confronta
          </Btn>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('')
  const [idx, setIdx] = useState(0)
  const nav = useNavigate()
  const results = suggest(q, 7)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQ('')
      setIdx(0)
      setTimeout(() => inputRef.current?.focus(), 30)
    }
  }, [open])

  const go = (to: string) => {
    onClose()
    nav(to)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="scrim scrim--blur" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            className="palette"
            role="dialog"
            aria-label="Cerca"
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
          >
            <form
              className="palette__input"
              onSubmit={(e) => {
                e.preventDefault()
                if (results[idx] && q) go(`/p/${results[idx].id}`)
                else go(`/shop?q=${encodeURIComponent(q)}`)
              }}
            >
              <Search size={18} />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value)
                  setIdx(0)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') onClose()
                  if (e.key === 'ArrowDown') setIdx((i) => Math.min(i + 1, results.length - 1))
                  if (e.key === 'ArrowUp') setIdx((i) => Math.max(i - 1, 0))
                }}
                placeholder="Cerca prodotti, marche, categorie…"
              />
              <kbd className="mono small">ESC</kbd>
            </form>
            <div className="palette__body" data-lenis-prevent>
              {!q && (
                <>
                  <p className="mono up small muted">Categorie</p>
                  <div className="chips">
                    {CATEGORIES.map((c) => (
                      <button key={c.id} className="chip" onClick={() => go(`/shop?category=${c.id}`)}>
                        {c.label}
                      </button>
                    ))}
                  </div>
                  <p className="mono up small muted" style={{ marginTop: 20 }}>
                    Prova
                  </p>
                  <div className="chips">
                    {['buds', 'webcam', 'watch', 'gan', 'keyboard'].map((s) => (
                      <button key={s} className="chip" onClick={() => setQ(s)}>
                        “{s}”
                      </button>
                    ))}
                  </div>
                </>
              )}
              {q && results.length === 0 && <p className="small muted">Nessun prodotto per “{q}”. Premi invio per cercare ovunque.</p>}
              {results.map((p, i) => (
                <button key={p.id} className={`palette__row${i === idx ? ' is-active' : ''}`} onMouseEnter={() => setIdx(i)} onClick={() => go(`/p/${p.id}`)}>
                  <span className="palette__art">
                    <ProductArt category={p.category} color={p.variants[0].swatch} size={40} />
                  </span>
                  <span className="palette__name">
                    <span className="small strong">{p.name}</span>
                    <span className="mono small muted">{p.tagline}</span>
                  </span>
                  <span className="mono small">{money(p.price)}</span>
                </button>
              ))}
              {q && (
                <button className="palette__row palette__all" onClick={() => go(`/shop?q=${encodeURIComponent(q)}`)}>
                  <span className="mono small up">Vedi tutti i risultati per “{q}” →</span>
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
