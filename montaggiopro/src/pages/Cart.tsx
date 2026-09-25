import { AnimatePresence, motion } from 'motion/react'
import { Minus, Plus, Trash2, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Photo } from '../components/Photo'
import { ShippingEstimator } from '../components/Shipping'
import { Btn, Rule, SectionHead } from '../components/ui'
import { PRODUCT_BY_ID } from '../data/catalog'
import { money } from '../lib/format'
import { FREE_SHIP, bestCoupon, cartTotals, useStore } from '../store/store'
import { Track } from '../components/Signal'
import { ExpressPay } from './Checkout'

export function Cart() {
  const cart = useStore((s) => s.cart)
  const saved = useStore((s) => s.saved)
  const ext = useStore((s) => s.extensions)
  const { setQty, removeLine, saveForLater, moveToCart } = useStore.getState()
  const nav = useNavigate()
  const coupon = ext.coupons ? bestCoupon(cart) : null
  const [scan, setScan] = useState<'idle' | 'scanning' | 'done'>('idle')
  const t = cartTotals(cart, scan === 'done' && coupon ? coupon.off : 0)

  useEffect(() => {
    if (!coupon) return setScan('idle')
    setScan('scanning')
    const id = setTimeout(() => setScan('done'), 1400)
    return () => clearTimeout(id)
  }, [coupon?.code])

  if (!cart.length)
    return (
      <div className="container empty">
        <p className="dot-title">Carrello vuoto</p>
        <p className="muted">Niente di più. Letteralmente.</p>
        <Btn to="/shop" tone="cart">
          Vai allo shop
        </Btn>
        {saved.length > 0 && <SavedList ids={saved} onMove={moveToCart} />}
      </div>
    )

  return (
    <div className="container section">
      <SectionHead index="" kicker={`${cart.length} articoli`} title="Carrello" />
      <div className="cart">
        <div className="cart__lines">
          <AnimatePresence initial={false}>
            {cart.map((l) => {
              const p = PRODUCT_BY_ID.get(l.id)
              if (!p) return null
              const v = p.variants.find((x) => x.id === l.variant) ?? p.variants[0]
              return (
                <motion.div key={l.id + l.variant} className="line" layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40, height: 0, padding: 0 }}>
                  <Link to={`/p/${p.id}`} className="line__art">
                    <Photo id={p.images[0]} alt={p.name} w={300} />
                  </Link>
                  <div className="line__info">
                    <Link to={`/p/${p.id}`} className="strong">
                      {p.name}
                    </Link>
                    <span className="mono small muted">
                      {v.label} · {p.seller}
                    </span>
                    <span className={`mono small ${p.fastShipping ? 'ok' : 'muted'}`}>{p.fastShipping ? '● Consegna domani' : '○ 2–4 giorni'}</span>
                    <div className="line__tools">
                      <div className="stepper stepper--sm">
                        <button onClick={() => (l.qty === 1 ? removeLine(l.id, l.variant) : setQty(l.id, l.variant, l.qty - 1))} aria-label="Meno">
                          {l.qty === 1 ? <Trash2 size={13} /> : <Minus size={13} />}
                        </button>
                        <span className="mono">{l.qty}</span>
                        <button onClick={() => setQty(l.id, l.variant, l.qty + 1)} aria-label="Più">
                          <Plus size={13} />
                        </button>
                      </div>
                      <button className="linkbtn small" onClick={() => saveForLater(l.id, l.variant)}>
                        Salva per dopo
                      </button>
                      <button className="linkbtn small" onClick={() => removeLine(l.id, l.variant)}>
                        Rimuovi
                      </button>
                    </div>
                  </div>
                  <strong className="line__price mono">{money(p.price * l.qty)}</strong>
                </motion.div>
              )
            })}
          </AnimatePresence>
          <Rule variant="end" label="fine carrello" />
          {saved.length > 0 && <SavedList ids={saved} onMove={moveToCart} />}
        </div>

        <aside className="summary">
          <p className="mono up small muted">Riepilogo</p>
          {/* Free-shipping line: fills toward the threshold, the ring closes when it's unlocked. */}
          <Track
            className="freeship"
            tone={t.subtotal >= FREE_SHIP ? 'account' : 'cart'}
            value={t.subtotal / FREE_SHIP}
            label={t.subtotal >= FREE_SHIP ? 'Spedizione gratuita sbloccata' : `Aggiungi ${money(FREE_SHIP - t.subtotal)} per la spedizione gratuita`}
            aside={`${money(Math.min(t.subtotal, FREE_SHIP))} / ${FREE_SHIP} €`}
            ariaLabel="Progresso verso la spedizione gratuita"
          />
          {ext.coupons && (
            <Track
              className="couponsig"
              size="sm"
              loading={scan === 'scanning'}
              tone={scan === 'done' ? 'account' : 'ink'}
              value={scan === 'done' ? 1 : 0}
              label={scan === 'scanning' ? 'Cerco coupon tra 38 codici…' : scan === 'done' && coupon ? `${coupon.code} applicato · −${coupon.off}%` : 'Nessun coupon per questi articoli'}
              aside={scan === 'done' && coupon ? `−${money(t.discount)}` : undefined}
            />
          )}
          <dl className="summary__rows">
            <div>
              <dt>Subtotale</dt>
              <dd className="mono">{money(t.subtotal)}</dd>
            </div>
            {t.discount > 0 && (
              <div className="ok">
                <dt>Coupon</dt>
                <dd className="mono">−{money(t.discount)}</dd>
              </div>
            )}
            <div>
              <dt>Spedizione</dt>
              <dd className="mono">{t.subtotal >= FREE_SHIP ? 'GRATIS' : 'al checkout'}</dd>
            </div>
          </dl>
          <Rule variant="dashdot" />
          <div className="summary__total">
            <span>Totale</span>
            <strong className="mono">{money(t.subtotal - t.discount)}</strong>
          </div>
          <Btn tone="buy" size="lg" block icon={<Zap size={16} />} onClick={() => nav('/checkout')}>
            Procedi all’acquisto
          </Btn>
          <ExpressPay onPay={() => nav('/checkout?express=1')} />
          <details className="disclosure">
            <summary>
              <span className="mono up small">Stima consegna</span>
            </summary>
            <ShippingEstimator weightKg={t.weight} subtotal={t.subtotal} />
          </details>
        </aside>
      </div>
    </div>
  )
}

function SavedList({ ids, onMove }: { ids: string[]; onMove: (id: string) => void }) {
  return (
    <div className="saved">
      <p className="mono up small muted">Salvati per dopo · {ids.length}</p>
      <div className="saved__row">
        {ids.map((id) => {
          const p = PRODUCT_BY_ID.get(id)!
          return (
            <div key={id} className="saved__item">
              <Link to={`/p/${id}`} className="saved__art">
                <Photo id={p.images[0]} alt={p.name} w={300} />
              </Link>
              <span className="small">{p.name}</span>
              <span className="mono small">{money(p.price)}</span>
              <Btn size="sm" tone="cart" onClick={() => onMove(id)}>
                Sposta nel carrello
              </Btn>
            </div>
          )
        })}
      </div>
    </div>
  )
}
