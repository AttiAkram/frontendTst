import Lenis from 'lenis'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, ChevronRight, Heart, Home, MapPin, Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { suggest } from '../api/client'
import { CATEGORIES, PRODUCT_BY_ID } from '../data/catalog'
import { findPlace } from '../data/shipping'
import { money } from '../lib/format'
import { FREE_SHIP, cartCount, cartTotals, useStore } from '../store/store'
import { Photo } from './Photo'
import { LoadingLine } from './Signal'
import { PageNav } from '../nav/PageNav'
import { resolve } from '../nav/map'
import { ShippingEstimator } from './Shipping'
import { Btn, IconBtn, Sheet } from './ui'

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="ecommerce — home">
      ecommerce
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
  const [menu, setMenu] = useState(false)
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
      <Header onSearch={() => setSearch(true)} onLocation={() => setLoc(true)} onMenu={() => setMenu(true)} />
      {/* Enter-only transition: an exit phase + lazy routes could leave the old wrapper stuck invisible. */}
      <PageNav />
      <motion.main
        // Steps of a flow share one key so the flow keeps its state while you go back and forth.
        key={resolve(location.pathname)?.node.id.startsWith('checkout.') ? 'checkout' : location.pathname}
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
      <MobileMenu open={menu} onClose={() => setMenu(false)} />
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

const NAV: [string, string][] = [
  ['Novità', '/shop?sort=newest'],
  ['Audio', '/shop?category=audio'],
  ['Smartphone', '/shop?category=phone'],
  ['Wearable', '/shop?category=wearable'],
  ['Computer', '/shop?category=computing'],
  ['Casa', '/shop?category=home'],
  ['Offerte', '/shop?deals=1&sort=deal'],
]

function Header({ onSearch, onLocation, onMenu }: { onSearch: () => void; onLocation: () => void; onMenu: () => void }) {
  const count = useStore(cartCount)
  const wish = useStore((s) => s.wishlist.length)
  const user = useStore((s) => s.user)
  const cap = useStore((s) => s.cap)
  const place = findPlace(cap)
  const nav = useNavigate()
  const { pathname, search } = useLocation()
  const [hidden, setHidden] = useState(false)
  const [hover, setHover] = useState<string | null>(null)
  const pending = useStore((s) => s.pending)
  const subtotal = useStore((s) => cartTotals(s.cart).subtotal)
  const last = useRef(0)
  useEffect(() => {
    // Nike-style: the header hides while scrolling down and returns on scroll up.
    const on = () => {
      const y = window.scrollY
      setHidden(y > 160 && y > last.current)
      last.current = y
    }
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <>
      <div className="promo">
        <div className="container promo__row">
          <button className="promo__loc" onClick={onLocation}>
            <MapPin size={12} /> {place ? `Consegna a ${place.city} ${place.cap}` : 'Imposta il CAP di consegna'}
          </button>
          <span className="promo__msg">Spedizione gratuita sopra 39 € · Resi gratuiti entro 30 giorni</span>
          <span className="promo__links">
            <Link to="/account">Aiuto</Link>
            <Link to={user ? '/account' : '/login'}>{user ? user.name : 'Accedi'}</Link>
          </span>
        </div>
      </div>
      <header className={`hdr${hidden ? ' is-hidden' : ''}`}>
        <div className="hdr__row container">
          <button className="hdr__menu" onClick={onMenu} aria-label="Menu">
            <Menu size={22} />
          </button>
          <Logo />
          <nav className="hdr__nav" onMouseLeave={() => setHover(null)}>
            {NAV.map(([l, to]) => {
              const active = pathname + search === to
              // The dot follows the pointer, then returns to the current section.
              const showDot = hover ? hover === l : active
              return (
                <Link key={l} to={to} className={active ? 'is-active' : ''} onMouseEnter={() => setHover(l)}>
                  {l}
                  {showDot && <motion.span layoutId="navdot" className="navdot" transition={{ type: 'spring', stiffness: 500, damping: 36 }} />}
                </Link>
              )
            })}
          </nav>
          <div className="hdr__actions">
            <button className="hdr__search" onClick={onSearch}>
              <Search size={17} />
              <span>Cerca</span>
            </button>
            <IconBtn label="Preferiti" tone="fav" badge={wish} onClick={() => nav('/wishlist')}>
              <Heart size={19} />
            </IconBtn>
            <span className="ringbtn">
              <IconBtn label={user ? `Account — connesso come ${user.name}` : 'Accedi'} tone="account" onClick={() => nav(user ? '/account' : '/login')}>
                <User size={19} />
              </IconBtn>
              {user && <span className="hdr__status" title="Connesso" />}
            </span>
            <FreeShipRing subtotal={subtotal}>
              <IconBtn label="Carrello" tone="cart" badge={count} onClick={() => nav('/cart')}>
                <ShoppingBag size={19} />
              </IconBtn>
            </FreeShipRing>
          </div>
        </div>
        <LoadingLine active={pending > 0} />
      </header>
    </>
  )
}

/** Ring around the cart icon = progress toward free shipping; turns green once unlocked. */
function FreeShipRing({ subtotal, children }: { subtotal: number; children: ReactNode }) {
  const p = Math.min(1, subtotal / FREE_SHIP)
  const C = 2 * Math.PI * 19
  const title = subtotal === 0 ? '' : p >= 1 ? 'Spedizione gratuita sbloccata' : `Mancano ${money(FREE_SHIP - subtotal)} alla spedizione gratuita`
  return (
    <span className="ringbtn" title={title}>
      {children}
      {subtotal > 0 && (
        <svg className={`ringbtn__ring${p >= 1 ? ' is-done' : ''}`} viewBox="0 0 40 40" width="40" height="40" aria-hidden>
          <circle className="bg" cx="20" cy="20" r="19" />
          <circle className="fg" cx="20" cy="20" r="19" strokeDasharray={C} strokeDashoffset={C * (1 - p)} />
        </svg>
      )}
    </span>
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
        <div className="ftr__grid">
          <div className="ftr__brand">
            <p className="ftr__logo">ecommerce</p>
            <p>Tecnologia scelta con cura, prezzi trasparenti e recensioni verificate. Gli strumenti che installavi come estensioni sono già qui.</p>
          </div>
          {[
            ['Negozio', ['Novità', 'Offerte vere', 'Più venduti', 'Ricondizionati']],
            ['Aiuto', ['Spedizioni', 'Resi e rimborsi', 'Garanzia', 'Contattaci']],
            ['Account', ['Ordini', 'Indirizzi', 'Pagamenti', 'Estensioni']],
          ].map(([h, items]) => (
            <div key={h as string}>
              <h4>{h}</h4>
              <ul>
                {(items as string[]).map((i) => (
                  <li key={i}>
                    <Link to="/shop">{i}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="ftr__bottom">
          <span>
            © 2026 ecommerce — demo · <Link to="/mappa">Mappa del sito</Link>
          </span>
          <span className="ftr__pay">Visa · Mastercard · PayPal · Apple Pay · Google Pay · Klarna</span>
          <span>Italia · EUR €</span>
        </div>
      </div>
    </footer>
  )
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const user = useStore((s) => s.user)
  return (
    <Sheet open={open} onClose={onClose} title="Menu" side="left">
      <nav className="mmenu">
        {NAV.map(([l, to]) => (
          <Link key={l} to={to} onClick={onClose}>
            {l}
            <ChevronRight size={20} />
          </Link>
        ))}
      </nav>
      <div className="mmenu__foot">
        <Btn to={user ? '/account' : '/login'} tone="account" block>
          {user ? 'Il mio account' : 'Accedi'}
        </Btn>
        <Link to="/compare" onClick={onClose} className="linkbtn">
          Confronta prodotti
        </Link>
      </div>
    </Sheet>
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
            <span className="toast__timer" />
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
                  <Photo id={p.images[0]} alt={p.name} w={120} />
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
                    <Photo id={p.images[0]} alt={p.name} w={120} />
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
