import { AnimatePresence, motion } from 'motion/react'
import { Bell, ShoppingBag, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Track } from '../components/Signal'
import { priceStats } from '../data/catalog'
import type { Product } from '../data/types'
import { Photo } from '../components/Photo'
import { Btn, IconBtn, Rule, SectionHead, Stars } from '../components/ui'
import { PRODUCT_BY_ID } from '../data/catalog'
import { money, pct } from '../lib/format'
import { useStore } from '../store/store'

export function Wishlist() {
  const list = useStore((s) => s.wishlist)
  const alerts = useStore((s) => s.alerts)
  const { toggleWish, addToCart, setAlert } = useStore.getState()
  const drops = list.filter((w) => (PRODUCT_BY_ID.get(w.id)?.price ?? 0) < w.addedPrice).length

  if (!list.length)
    return (
      <div className="container empty">
        <p className="dot-title">Nessun preferito</p>
        <p className="muted">Tocca il cuore rosso su un prodotto: ti diciamo noi quando cala di prezzo.</p>
        <Btn to="/shop" tone="fav">
          Esplora
        </Btn>
      </div>
    )

  return (
    <div className="container section">
      <SectionHead index="" kicker={`${list.length} salvati · ${drops} in calo`} title="Preferiti" />
      <div className="wlist">
        <AnimatePresence initial={false}>
          {list.map((w) => {
            const p = PRODUCT_BY_ID.get(w.id)
            if (!p) return null
            const delta = ((p.price - w.addedPrice) / w.addedPrice) * 100
            const alert = alerts.find((a) => a.id === p.id)
            return (
              <motion.div key={w.id} layout className="witem" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 60 }}>
                <Link to={`/p/${p.id}`} className="witem__art">
                  <Photo id={p.images[0]} alt={p.name} w={300} />
                </Link>
                <div className="witem__info">
                  <Link to={`/p/${p.id}`} className="strong">
                    {p.name}
                  </Link>
                  <Stars value={p.rating} size={10} />
                  <span className="mono small muted">salvato a {money(w.addedPrice)}</span>
                </div>
                <SavedVsNow p={p} saved={w.addedPrice} target={alert?.target} />
                <div className="witem__price">
                  <strong className="mono">{money(p.price)}</strong>
                  {Math.abs(delta) >= 1 && <span className={`mono small ${delta < 0 ? 'ok' : 'bad'}`}>{pct(delta)}</span>}
                </div>
                <div className="witem__actions">
                  <IconBtn label={alert ? 'Avviso attivo' : 'Avvisami sotto −10%'} active={!!alert} onClick={() => setAlert(p.id, alert ? null : Math.floor(p.price * 0.9))}>
                    <Bell size={16} />
                  </IconBtn>
                  <IconBtn label="Aggiungi al carrello" tone="cart" onClick={() => addToCart(p.id, p.variants[0].id)}>
                    <ShoppingBag size={16} />
                  </IconBtn>
                  <IconBtn label="Rimuovi" tone="fav" onClick={() => toggleWish(p.id)}>
                    <X size={16} />
                  </IconBtn>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
      <Rule variant="end" label="fine preferiti" />
    </div>
  )
}

/** Line from the 12-month low to high: ring = price when saved, dot = today, mark = your alert target. */
function SavedVsNow({ p, saved, target }: { p: Product; saved: number; target?: number }) {
  const { min, max } = priceStats(p, 365)
  const span = max - min || 1
  const at = (x: number) => Math.max(0, Math.min(1, (x - min) / span))
  const marks = [{ at: at(saved), label: `salvato a ${money(saved)}`, done: true }]
  if (target) marks.push({ at: at(target), label: `avviso a ${money(target)}`, done: p.price <= target })
  return (
    <Track
      className="witem__sig"
      size="sm"
      goal={false}
      tone={p.price < saved ? 'account' : p.price > saved ? 'bad' : 'ink'}
      value={at(p.price)}
      marks={marks}
      label={target ? `Avviso a ${money(target)}` : 'Da quando l’hai salvato'}
      aside={`${money(min)} — ${money(max)}`}
    />
  )
}
