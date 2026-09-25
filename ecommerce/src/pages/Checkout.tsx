import { AnimatePresence, motion } from 'motion/react'
import { Check, CreditCard, Landmark, Lock, PackageCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { type PayMethod, placeOrder } from '../api/client'
import { AppleMark, GoogleG, KlarnaMark, MastercardMark, PayPalMark, VisaMark } from '../components/Marks'
import { Photo } from '../components/Photo'
import { ShippingEstimator } from '../components/Shipping'
import { Btn, Rule } from '../components/ui'
import { PRODUCT_BY_ID } from '../data/catalog'
import { type ShipSpeed, findPlace } from '../data/shipping'
import { money } from '../lib/format'
import { bestCoupon, cartTotals, useStore } from '../store/store'

export function ExpressPay({ onPay }: { onPay: (m: PayMethod) => void }) {
  return (
    <div className="express">
      <span className="express__label mono small muted">o paga subito con</span>
      <div className="express__row">
        <button className="paybtn paybtn--apple" onClick={() => onPay('applepay')} aria-label="Apple Pay">
          <AppleMark size={16} /> Pay
        </button>
        <button className="paybtn paybtn--google" onClick={() => onPay('googlepay')} aria-label="Google Pay">
          <GoogleG size={16} /> Pay
        </button>
        <button className="paybtn paybtn--paypal" onClick={() => onPay('paypal')} aria-label="PayPal">
          <PayPalMark />
        </button>
      </div>
    </div>
  )
}

const STEPS = ['Indirizzo', 'Spedizione', 'Pagamento', 'Conferma']

const BANKS = ['Intesa Sanpaolo', 'UniCredit', 'BPER', 'Banco BPM', 'Fineco', 'Mediolanum', 'Revolut', 'N26']

function luhn(num: string) {
  const d = num.replace(/\D/g, '')
  let sum = 0
  for (let i = 0; i < d.length; i++) {
    let n = +d[d.length - 1 - i]
    if (i % 2) n = n * 2 > 9 ? n * 2 - 9 : n * 2
    sum += n
  }
  return d.length >= 13 && sum % 10 === 0
}

function cardBrand(num: string) {
  const d = num.replace(/\D/g, '')
  if (/^4/.test(d)) return 'visa'
  if (/^(5[1-5]|2[2-7])/.test(d)) return 'mastercard'
  if (/^3[47]/.test(d)) return 'amex'
  return null
}

export function Checkout() {
  const [sp] = useSearchParams()
  const cart = useStore((s) => s.cart)
  const user = useStore((s) => s.user)
  const cap = useStore((s) => s.cap)
  const setCap = useStore((s) => s.setCap)
  const ext = useStore((s) => s.extensions)
  const clearCart = useStore((s) => s.clearCart)
  const [step, setStep] = useState(sp.get('express') ? 2 : 0)
  const [addr, setAddr] = useState({ name: user?.name ?? '', street: '', cap, city: findPlace(cap)?.city ?? '', phone: '' })
  const [speed, setSpeed] = useState<ShipSpeed>('standard')
  const [shipPrice, setShipPrice] = useState(0)
  const [method, setMethod] = useState<PayMethod>('card')
  const [card, setCard] = useState({ num: '', exp: '', cvc: '', name: '' })
  const [flip, setFlip] = useState(false)
  const [bank, setBank] = useState(BANKS[0])
  const [status, setStatus] = useState<'idle' | 'paying' | 'done'>('idle')
  const [orderId, setOrderId] = useState('')
  const [snapshot, setSnapshot] = useState(cart)

  const coupon = ext.coupons ? bestCoupon(cart) : null
  const t = cartTotals(status === 'done' ? snapshot : cart, coupon?.off ?? 0)
  const total = t.subtotal - t.discount + shipPrice
  const place = findPlace(addr.cap)
  const addrOk = addr.name && addr.street && place
  const cardOk = method !== 'card' || (luhn(card.num) && /^\d\d\/\d\d$/.test(card.exp) && card.cvc.length >= 3)

  const pay = async () => {
    setStatus('paying')
    setSnapshot(cart)
    const r = await placeOrder({ method, total })
    setOrderId(r.orderId)
    setStatus('done')
    clearCart()
  }

  const eta = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + (speed === 'express' ? 1 : speed === 'sameday' ? 0 : 3))
    return d
  }, [speed])

  if (status === 'done') return <Success orderId={orderId} eta={eta} total={total} />
  if (!cart.length)
    return (
      <div className="container empty">
        <p className="dot-title">Niente da pagare</p>
        <Btn to="/shop" tone="cart">
          Vai allo shop
        </Btn>
      </div>
    )

  return (
    <div className="container section checkout">
      <div className="checkout__main">
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s} className={i === step ? 'is-active' : i < step ? 'is-done' : ''}>
              <button onClick={() => i < step && setStep(i)} disabled={i > step}>
                <span className="steps__dot">{i < step ? <Check size={12} /> : i + 1}</span>
                <span className="mono small up">{s}</span>
              </button>
              {i < STEPS.length - 1 && <span className="steps__line" />}
            </li>
          ))}
        </ol>

        {step === 0 && <ExpressPay onPay={(m) => { setMethod(m); setStep(2) }} />}

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }} className="checkout__panel">
            {step === 0 && (
              <form
                className="form"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!addrOk) return
                  setCap(addr.cap)
                  setStep(1)
                }}
              >
                <h2 className="dot-title">Dove spediamo?</h2>
                <label className="fl">
                  <span>Nome e cognome</span>
                  <input className="field" required value={addr.name} onChange={(e) => setAddr({ ...addr, name: e.target.value })} autoComplete="name" />
                </label>
                <label className="fl">
                  <span>Via e numero civico</span>
                  <input className="field" required value={addr.street} onChange={(e) => setAddr({ ...addr, street: e.target.value })} autoComplete="street-address" placeholder="Via Roma 1" />
                </label>
                <div className="form__row">
                  <label className="fl">
                    <span>CAP</span>
                    <input
                      className="field"
                      required
                      inputMode="numeric"
                      maxLength={5}
                      value={addr.cap}
                      onChange={(e) => {
                        const c = e.target.value.replace(/\D/g, '')
                        setAddr({ ...addr, cap: c, city: findPlace(c)?.city ?? addr.city })
                      }}
                      autoComplete="postal-code"
                      placeholder="20121"
                    />
                  </label>
                  <label className="fl">
                    <span>Città</span>
                    <input className="field" value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} autoComplete="address-level2" />
                  </label>
                </div>
                {addr.cap.length === 5 && !place && <p className="small bad">CAP non presente nella demo: usa 20121, 00184, 80133, 90133…</p>}
                <label className="fl">
                  <span>Telefono (per il corriere)</span>
                  <input className="field" value={addr.phone} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} autoComplete="tel" inputMode="tel" />
                </label>
                <Btn type="submit" tone="ink" size="lg" disabled={!addrOk}>
                  Continua
                </Btn>
              </form>
            )}

            {step === 1 && (
              <div className="form">
                <h2 className="dot-title">Come arriva?</h2>
                <ShippingEstimator
                  weightKg={t.weight}
                  subtotal={t.subtotal}
                  selectable
                  value={speed}
                  onChange={(s, price) => {
                    setSpeed(s)
                    setShipPrice(price)
                  }}
                />
                <Btn tone="ink" size="lg" onClick={() => setStep(2)}>
                  Continua
                </Btn>
              </div>
            )}

            {step === 2 && (
              <div className="form">
                <h2 className="dot-title">Pagamento</h2>
                <div className="paygrid">
                  {(
                    [
                      ['card', 'Carta', <span className="row-4" key="c"><MastercardMark /><VisaMark /></span>],
                      ['applepay', 'Apple Pay', <AppleMark key="a" />],
                      ['googlepay', 'Google Pay', <GoogleG key="g" />],
                      ['paypal', 'PayPal', <PayPalMark key="p" />],
                      ['bank', 'Bonifico istantaneo', <Landmark size={18} key="b" />],
                      ['klarna', '3 rate senza interessi', <KlarnaMark key="k" />],
                    ] as [PayMethod, string, React.ReactNode][]
                  ).map(([m, l, icon]) => (
                    <button key={m} className={`paytile${method === m ? ' is-active' : ''}`} onClick={() => setMethod(m)}>
                      <span className="radio" />
                      <span className="small strong">{l}</span>
                      <span className="paytile__icon">{icon}</span>
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div key={method} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    {method === 'card' && (
                      <div className="cardpay">
                        <div className={`ccard${flip ? ' is-flipped' : ''}`}>
                          <div className="ccard__front">
                            <span className="ccard__chip" />
                            <span className="ccard__brand">{cardBrand(card.num) === 'mastercard' ? <MastercardMark size={40} /> : cardBrand(card.num) === 'visa' ? <VisaMark /> : <CreditCard size={22} />}</span>
                            <span className="ccard__num mono">{(card.num || '•••• •••• •••• ••••').padEnd(19, '•')}</span>
                            <span className="ccard__meta mono small">
                              <span>{card.name || 'NOME COGNOME'}</span>
                              <span>{card.exp || 'MM/AA'}</span>
                            </span>
                          </div>
                          <div className="ccard__back">
                            <span className="ccard__stripe" />
                            <span className="ccard__cvc mono">{card.cvc || '•••'}</span>
                          </div>
                        </div>
                        <div className="cardpay__fields">
                          <label className="fl">
                            <span>Numero carta {card.num.length > 14 && (luhn(card.num) ? <b className="ok">✓</b> : <b className="bad">non valida</b>)}</span>
                            <input
                              className="field mono"
                              inputMode="numeric"
                              autoComplete="cc-number"
                              placeholder="5555 5555 5555 4444"
                              value={card.num}
                              onChange={(e) =>
                                setCard({ ...card, num: e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim() })
                              }
                            />
                          </label>
                          <label className="fl">
                            <span>Intestatario</span>
                            <input className="field" autoComplete="cc-name" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value.toUpperCase() })} />
                          </label>
                          <div className="form__row">
                            <label className="fl">
                              <span>Scadenza</span>
                              <input
                                className="field mono"
                                placeholder="MM/AA"
                                autoComplete="cc-exp"
                                inputMode="numeric"
                                value={card.exp}
                                onChange={(e) => {
                                  const d = e.target.value.replace(/\D/g, '').slice(0, 4)
                                  setCard({ ...card, exp: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d })
                                }}
                              />
                            </label>
                            <label className="fl">
                              <span>CVC</span>
                              <input
                                className="field mono"
                                inputMode="numeric"
                                autoComplete="cc-csc"
                                maxLength={4}
                                value={card.cvc}
                                onFocus={() => setFlip(true)}
                                onBlur={() => setFlip(false)}
                                onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, '') })}
                              />
                            </label>
                          </div>
                          <p className="mono small muted">
                            <Lock size={11} /> 3-D Secure · i dati vanno direttamente al PSP (tokenizzati), mai sui nostri server.
                          </p>
                        </div>
                      </div>
                    )}
                    {(method === 'applepay' || method === 'googlepay') && (
                      <div className="walletpay">
                        <p className="small muted">Confermerai con {method === 'applepay' ? 'Face ID / Touch ID' : 'il blocco schermo del telefono'}. Indirizzo e carta arrivano dal wallet.</p>
                      </div>
                    )}
                    {method === 'paypal' && <p className="small muted">Verrai reindirizzato a PayPal per autorizzare {money(total)}. Protezione acquisti inclusa.</p>}
                    {method === 'bank' && (
                      <div className="banks">
                        <p className="small muted">Open banking PSD2: autorizzi il pagamento dall’app della tua banca, accredito istantaneo.</p>
                        <div className="chips">
                          {BANKS.map((b) => (
                            <button key={b} className={`chip${bank === b ? ' is-active' : ''}`} onClick={() => setBank(b)}>
                              {b}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {method === 'klarna' && (
                      <div className="klarna">
                        {[0, 30, 60].map((d, i) => (
                          <div key={d}>
                            <span className="mono small muted">{i === 0 ? 'Oggi' : `+${d} gg`}</span>
                            <strong className="mono">{money(total / 3)}</strong>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <Btn tone="ink" size="lg" disabled={!cardOk} onClick={() => setStep(3)}>
                  Rivedi ordine
                </Btn>
              </div>
            )}

            {step === 3 && (
              <div className="form">
                <h2 className="dot-title">Tutto giusto?</h2>
                <dl className="review-sum">
                  <div>
                    <dt className="mono small muted">Spedisci a</dt>
                    <dd>
                      {addr.name || user?.name || '—'}
                      <br />
                      {addr.street || 'dal wallet'} · {place ? `${place.cap} ${place.city}` : ''}
                    </dd>
                    <button className="linkbtn small" onClick={() => setStep(0)}>
                      Modifica
                    </button>
                  </div>
                  <div>
                    <dt className="mono small muted">Consegna</dt>
                    <dd>
                      {speed} · {shipPrice ? money(shipPrice) : 'gratis'}
                    </dd>
                    <button className="linkbtn small" onClick={() => setStep(1)}>
                      Modifica
                    </button>
                  </div>
                  <div>
                    <dt className="mono small muted">Pagamento</dt>
                    <dd>
                      {method === 'card' ? `${cardBrand(card.num) ?? 'carta'} •••• ${card.num.slice(-4)}` : method === 'bank' ? bank : method}
                    </dd>
                    <button className="linkbtn small" onClick={() => setStep(2)}>
                      Modifica
                    </button>
                  </div>
                </dl>
                <Btn tone="buy" size="lg" block onClick={pay} disabled={status === 'paying'} icon={status === 'paying' ? <span className="spinner spinner--light" /> : <Lock size={16} />}>
                  {status === 'paying' ? 'Autorizzazione…' : `Paga ${money(total)}`}
                </Btn>
                <p className="mono small muted">Cliccando accetti le condizioni di vendita. Recesso 30 giorni.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <aside className="summary">
        <p className="mono up small muted">Ordine · {cart.length} articoli</p>
        <div className="summary__items">
          {cart.map((l) => {
            const p = PRODUCT_BY_ID.get(l.id)!
            return (
              <div key={l.id + l.variant} className="sitem">
                <span className="sitem__art">
                  <Photo id={p.images[0]} alt={p.name} w={300} />
                  <b>{l.qty}</b>
                </span>
                <span className="small">{p.name}</span>
                <span className="mono small">{money(p.price * l.qty)}</span>
              </div>
            )
          })}
        </div>
        <Rule variant="dashdot" />
        <dl className="summary__rows">
          <div>
            <dt>Subtotale</dt>
            <dd className="mono">{money(t.subtotal)}</dd>
          </div>
          {t.discount > 0 && (
            <div className="ok">
              <dt>Coupon {coupon?.code}</dt>
              <dd className="mono">−{money(t.discount)}</dd>
            </div>
          )}
          <div>
            <dt>Spedizione</dt>
            <dd className="mono">{step < 1 ? '—' : shipPrice ? money(shipPrice) : 'GRATIS'}</dd>
          </div>
        </dl>
        <div className="summary__total">
          <span>Totale</span>
          <motion.strong key={total} className="mono" initial={{ opacity: 0.3, y: -4 }} animate={{ opacity: 1, y: 0 }}>
            {money(total)}
          </motion.strong>
        </div>
      </aside>
    </div>
  )
}

function Success({ orderId, eta, total }: { orderId: string; eta: Date; total: number }) {
  const stages = ['Ordine ricevuto', 'Pagamento confermato', 'In preparazione', 'Spedito', 'Consegnato']
  return (
    <div className="container success">
      <motion.div className="success__badge" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
        <PackageCheck size={42} />
      </motion.div>
      <h1 className="dot-title">Fatto.</h1>
      <p className="muted">
        Ordine <b className="mono">{orderId}</b> · {money(total)} · arrivo previsto {eta.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
      </p>
      <ol className="track">
        {stages.map((s, i) => (
          <motion.li key={s} className={i < 2 ? 'is-done' : ''} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.12 }}>
            <span className="track__dot" />
            <span className="mono small">{s}</span>
          </motion.li>
        ))}
      </ol>
      <div className="row-8">
        <Btn to="/account" tone="account">
          I miei ordini
        </Btn>
        <Btn to="/shop">Continua lo shopping</Btn>
      </div>
      <Link to="/" className="mono small muted">
        ← home
      </Link>
    </div>
  )
}
