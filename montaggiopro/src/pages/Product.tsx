import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
import { Bell, Check, ChevronDown, Heart, MessageCircle, Minus, Plus, Scale, ShieldCheck, ShoppingBag, ThumbsUp, Truck, Undo2, Zap } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProduct } from '../api/client'
import { PriceHistory, RatingBars, ReviewEvolution } from '../components/Charts'
import { Track } from '../components/Signal'
import { Photo } from '../components/Photo'
import { ProductCard } from '../components/ProductCard'
import { ShippingEstimator } from '../components/Shipping'
import { Btn, Chip, IconBtn, Reveal, Rule, SectionHead, Stars, Tag, TrustBadge } from '../components/ui'
import { CATEGORIES, adjustedRating, claimedDiscount, dealScore, priceStats, realDiscount, trustGrade } from '../data/catalog'
import type { Product as P, Question, Review } from '../data/types'
import { dateShort, money } from '../lib/format'
import { useStore } from '../store/store'

type Data = Awaited<ReturnType<typeof getProduct>>

export function Product() {
  const { id = '' } = useParams()
  const [data, setData] = useState<Data | null>(null)
  const [error, setError] = useState('')
  const viewed = useStore((s) => s.viewed)

  useEffect(() => {
    setData(null)
    getProduct(id)
      .then((d) => {
        setData(d)
        viewed(id)
      })
      .catch((e) => setError(e.message))
  }, [id, viewed])

  if (error)
    return (
      <div className="container empty">
        <p className="dot-title">404</p>
        <p className="muted">{error}</p>
        <Btn to="/shop">Torna allo shop</Btn>
      </div>
    )
  if (!data) return <ProductSkeleton />
  return <ProductView key={id} {...data} />
}

function ProductView({ product: p, reviews, questions, similar }: Data) {
  const nav = useNavigate()
  const ext = useStore((s) => s.extensions)
  const wish = useStore((s) => s.wishlist.find((w) => w.id === p.id))
  const wished = !!wish
  const compareCount = useStore((s) => s.compare.length)
  const inCompare = useStore((s) => s.compare.includes(p.id))
  const alert = useStore((s) => s.alerts.find((a) => a.id === p.id))
  const { addToCart, toggleWish, toggleCompare, setAlert } = useStore.getState()
  const [variant, setVariant] = useState(p.variants[0])
  const [view, setView] = useState(0)
  const [qty, setQty] = useState(1)
  const cat = CATEGORIES.find((c) => c.id === p.category)!
  const claimed = claimedDiscount(p)
  const real = realDiscount(p)
  const score = dealScore(p)
  const fake = ext.realDiscount && claimed - real > 8

  const buyNow = () => {
    addToCart(p.id, variant.id, qty)
    nav('/checkout')
  }

  return (
    <div className="pdp">
      <div className="container">
        <p className="crumbs mono small muted">
          <Link to="/shop">Shop</Link> / <Link to={`/shop?category=${p.category}`}>{cat.label}</Link> / <span>{p.id}</span>
        </p>
      </div>

      <section className="container pdp__top">
        {/* ---------- Gallery: 2-col grid on desktop, swipe on phone ---------- */}
        <div className="gallery">
          <div className="gallery__grid" onScroll={(e) => setView(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}>
            {p.images.slice(0, 4).map((id, i) => (
              <motion.div key={id} className="gallery__cell" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
                <Photo id={id} alt={`${p.name} — foto ${i + 1}`} w={900} priority={i < 2} label={cat.label} />
              </motion.div>
            ))}
          </div>
          <div className="gallery__dots" aria-hidden>
            {p.images.slice(0, 4).map((id, i) => (
              <span key={id} className={view === i ? 'is-active' : ''} />
            ))}
          </div>
          <div className="gallery__tags">
            {p.sponsored && <Tag>Sponsorizzato</Tag>}
            {score >= 92 && <Tag tone="deal">Minimo storico</Tag>}
          </div>
        </div>

        {/* ---------- Buy box ---------- */}
        <div className="buybox">
          <p className="mono small muted">
            {p.brand} · {cat.code}-{p.id}
          </p>
          <h1 className="buybox__title">{p.name}</h1>
          <p className="buybox__tag">{p.tagline}</p>
          <a href="#recensioni" className="buybox__rating">
            <Stars value={p.rating} showValue />
            <span className="small muted">{p.reviewCount.toLocaleString('it-IT')} recensioni</span>
            {ext.reviewCheck && <TrustBadge score={p.trustScore} />}
          </a>

          <Rule variant="dashdot" />

          <div className="buybox__price">
            <strong>{money(p.price)}</strong>
            {p.listPrice > p.price && <s className="muted">{money(p.listPrice)}</s>}
            {claimed > 0 && <Tag tone={fake ? 'ghost' : 'deal'}>−{claimed}%</Tag>}
          </div>
          {ext.realDiscount && claimed > 0 && (
            <p className={`small ${fake ? 'bad' : 'ok'}`}>
              {fake
                ? `⚠ Sconto gonfiato: rispetto alla mediana a 90 giorni è ${real > 0 ? `solo −${real}%` : 'un rincaro'}.`
                : `✓ Sconto reale −${Math.max(real, 0)}% sulla mediana a 90 giorni.`}
            </p>
          )}
          {ext.unitPrice && p.unit && (
            <p className="mono small muted">
              {money(p.price / p.unit.amount)} / {p.unit.label}
            </p>
          )}
          {ext.priceHistory && <PriceRange p={p} />}
          {ext.coupons && p.coupon && (
            <div className="coupon">
              <span className="coupon__code mono">{p.coupon.code}</span>
              <span className="small">
                −{p.coupon.off}% trovato automaticamente. <b>Verrà applicato al checkout.</b>
              </span>
            </div>
          )}

          <div className="buybox__variants">
            <p className="mono small muted">Colore — {variant.label}</p>
            <div className="row-8">
              {p.variants.map((v) => (
                <button
                  key={v.id}
                  className={`swatch swatch--lg${v.id === variant.id ? ' is-active' : ''}`}
                  style={{ background: v.swatch }}
                  onClick={() => setVariant(v)}
                  aria-label={v.label}
                />
              ))}
            </div>
          </div>

          <div className="buybox__qty">
            <div className="stepper">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Meno">
                <Minus size={14} />
              </button>
              <span className="mono">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(10, q + 1))} aria-label="Più">
                <Plus size={14} />
              </button>
            </div>
            <Track
              className="buybox__stock"
              size="sm"
              goal={false}
              tone={p.stock < 6 ? 'bad' : 'account'}
              value={Math.min(1, p.stock / 60)}
              label={<span className={p.stock < 6 ? 'bad' : 'ok'}>{p.stock < 6 ? `Solo ${p.stock} rimasti` : 'Disponibile'}</span>}
              aside={p.stock < 6 ? 'scorte in esaurimento' : `${p.stock > 60 ? '60+' : p.stock} pezzi`}
              ariaLabel="Disponibilità"
            />
          </div>

          <Cutoff fast={p.fastShipping} />

          <div className="buybox__cta">
            <CartButton id={p.id} variant={variant.id} qty={qty} />
            <Btn tone="buy" size="lg" block icon={<Zap size={16} />} onClick={buyNow} sub={`Arriva ${deliveryLabel(p.fastShipping)}`}>
              Compra ora
            </Btn>
            <div className="buybox__minor">
              <Btn
                tone="fav"
                active={wished}
                icon={<Heart size={15} fill={wished ? 'currentColor' : 'none'} />}
                onClick={() => toggleWish(p.id)}
                sub={wished && wish ? priceDelta(wish.addedPrice, p.price) : 'Ti avvisiamo se cala'}
              >
                {wished ? 'Salvato' : 'Preferiti'}
              </Btn>
              {ext.compare && (
                <Btn
                  active={inCompare}
                  icon={<Scale size={15} />}
                  onClick={() => toggleCompare(p.id)}
                  sub={`${compareCount}/4 nel confronto`}
                  progress={compareCount / 4}
                >
                  {inCompare ? 'In confronto' : 'Confronta'}
                </Btn>
              )}
            </div>
          </div>

          <ul className="buybox__facts small">
            <li>
              <Truck size={15} /> {p.fastShipping ? 'Consegna domani con Express' : 'Consegna in 2–4 giorni'} · venduto da <b>{p.seller}</b>
            </li>
            <li>
              <Undo2 size={15} /> Reso gratuito entro {p.returnDays} giorni
            </li>
            <li>
              <ShieldCheck size={15} /> Garanzia {p.warrantyMonths} mesi · eco-score {p.eco}/5
            </li>
          </ul>

          <details className="disclosure">
            <summary>
              <span className="mono up small">Calcola spedizione</span>
              <ChevronDown size={16} />
            </summary>
            <ShippingEstimator weightKg={p.weightKg * qty} subtotal={p.price * qty} />
          </details>

          {ext.priceHistory && <PriceAlert p={p} current={alert?.target} onSet={(t) => setAlert(p.id, t)} />}
        </div>
      </section>

      <TabBar />

      <div className="container">
        <Rule index="01" label="panoramica" />
      </div>
      <section id="panoramica" className="container pdp__section pdp__overview">
        <Reveal>
          <p className="pdp__lede">{p.description}</p>
        </Reveal>
        <ul className="bullets">
          {p.bullets.map((b, i) => (
            <Reveal key={b} delay={i * 0.05}>
              <li>
                <span className="mono small muted">{String(i + 1).padStart(2, '0')}</span>
                {b}
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      <div className="container">
        <Rule index="02" label="specifiche" variant="dashdot" />
      </div>
      <section id="specifiche" className="container pdp__section">
        <dl className="specs">
          {p.specs.map(([k, v]) => (
            <div key={k}>
              <dt className="mono small muted">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {(ext.priceHistory || ext.reviewCheck) && (
        <>
          <div className="container">
            <Rule index="03" label="dati & grafici" />
          </div>
          <section id="dati" className="container pdp__section">
            <SectionHead index="03" kicker="aggiornati ogni ora" title="Dati" />
            <div className="insights">
              {ext.priceHistory && <PriceHistory p={p} />}
              <ReviewEvolution p={p} />
              {ext.reviewCheck && <ReviewAnalysis p={p} reviews={reviews} />}
            </div>
          </section>
        </>
      )}

      <div className="container">
        <Rule index="04" label="recensioni" variant="dashdot" />
      </div>
      <Reviews p={p} reviews={reviews} />

      <div className="container">
        <Rule index="05" label="domande" />
      </div>
      <QA questions={questions} />

      <div className="container">
        <Rule index="06" label="simili" variant="dashdot" />
      </div>
      <section className="container pdp__section">
        <Bundle p={p} other={similar.slice(0, 2)} />
        <SectionHead index="06" kicker={cat.label} title="Simili" />
        <div className="grid">
          {similar.slice(0, 4).map((s, i) => (
            <ProductCard key={s.id} p={s} index={i} />
          ))}
        </div>
        <Rule variant="end" label="fine prodotto" />
      </section>

      <div className="stickybuy">
        <div className="stickybuy__price">
          <strong>{money(p.price)}</strong>
          <span className="mono small muted">{variant.label}</span>
        </div>
        <IconBtn tone="fav" label="Preferiti" active={wished} onClick={() => toggleWish(p.id)}>
          <Heart size={18} fill={wished ? 'currentColor' : 'none'} />
        </IconBtn>
        <Btn tone="cart" size="md" onClick={() => addToCart(p.id, variant.id, qty)}>
          Carrello
        </Btn>
        <Btn tone="buy" size="md" onClick={buyNow}>
          Compra
        </Btn>
      </div>
    </div>
  )
}

function TabBar() {
  const tabs = [
    ['panoramica', 'Panoramica'],
    ['specifiche', 'Specifiche'],
    ['dati', 'Dati'],
    ['recensioni', 'Recensioni'],
    ['domande', 'Domande'],
  ]
  const [active, setActive] = useState('panoramica')
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40 })
  useEffect(() => {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-40% 0px -55% 0px' })
    tabs.forEach(([id]) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <nav className="tabbar">
      <div className="container tabbar__inner">
        {tabs.map(([id, l]) => (
          <a key={id} href={`#${id}`} className={active === id ? 'is-active' : ''}>
            {active === id && <motion.span layoutId="tabdot" className="tabbar__dot" />}
            {l}
          </a>
        ))}
      </div>
      {/* Whole-page reading progress: where you are on this product. */}
      <motion.span className="tabbar__progress" style={{ scaleX: progress }} />
    </nav>
  )
}

function PriceAlert({ p, current, onSet }: { p: P; current?: number; onSet: (t: number | null) => void }) {
  const { min } = priceStats(p, 365)
  const [target, setTarget] = useState(current ?? Math.floor(Math.min(p.price * 0.9, min + (p.price - min) / 2)))
  return (
    <div className="alertbox">
      <div className="alertbox__head">
        <Bell size={16} />
        <span className="small strong">Avvisami quando scende</span>
        {current && (
          <span className="mono small ok">
            <Check size={12} /> attivo
          </span>
        )}
      </div>
      <input
        type="range"
        min={Math.floor(min * 0.9)}
        max={Math.ceil(p.price)}
        value={target}
        onChange={(e) => setTarget(+e.target.value)}
        aria-label="Prezzo obiettivo"
        style={{ '--fill': `${((target - min * 0.9) / (p.price - min * 0.9)) * 100}%` } as React.CSSProperties}
      />
      <div className="alertbox__foot">
        <span className="mono">{money(target)}</span>
        <span className="mono small muted">min storico {money(min)}</span>
        {current ? (
          <button className="linkbtn small" onClick={() => onSet(null)}>
            Disattiva
          </button>
        ) : (
          <button className="linkbtn small" onClick={() => onSet(target)}>
            Attiva →
          </button>
        )}
      </div>
    </div>
  )
}

function ReviewAnalysis({ p, reviews }: { p: P; reviews: Review[] }) {
  const sus = reviews.filter((r) => r.suspicious).length
  const verified = reviews.filter((r) => r.verified).length
  const grade = trustGrade(p.trustScore)
  const adj = adjustedRating(p)
  const checks: [string, boolean][] = [
    ['Distribuzione dei voti naturale', p.trustScore > 55],
    ['Nessun picco anomalo di recensioni', p.trustScore > 45],
    ['Linguaggio vario e specifico', sus / reviews.length < 0.2],
    ['Maggioranza acquisti verificati', verified / reviews.length > 0.7],
  ]
  return (
    <div className="chartcard analysis">
      <div className="chartcard__head">
        <div>
          <h4 className="mono up">Analisi recensioni</h4>
          <p className="small muted">Stile Fakespot / ReviewMeta, integrato</p>
        </div>
      </div>
      <div className="analysis__grade">
        <span className={`grade grade--${grade}`}>{grade}</span>
        <div>
          <p className="small muted">Voto dichiarato → voto corretto</p>
          <p className="analysis__nums">
            <span className="mono">{p.rating.toFixed(1)}</span>
            <span className="muted">→</span>
            <strong className="mono">{adj.toFixed(1)}</strong>
          </p>
          <p className="mono small muted">
            {sus} sospette su {reviews.length} campionate · {Math.round((verified / reviews.length) * 100)}% verificate
          </p>
        </div>
      </div>
      <ul className="checks">
        {checks.map(([l, ok]) => (
          <li key={l} className={ok ? 'ok' : 'bad'}>
            <span className="checks__dot" />
            <span className="small">{l}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

type RSort = 'helpful' | 'recent' | 'critical'

function Reviews({ p, reviews }: { p: P; reviews: Review[] }) {
  const ext = useStore((s) => s.extensions)
  const user = useStore((s) => s.user)
  const toast = useStore((s) => s.toast)
  const [star, setStar] = useState<number | null>(null)
  const [verified, setVerified] = useState(false)
  const [hideSus, setHideSus] = useState(ext.reviewCheck)
  const [withComments, setWithComments] = useState(false)
  const [sort, setSort] = useState<RSort>('helpful')
  const [shown, setShown] = useState(6)
  const [local, setLocal] = useState<Review[]>([])
  const [writing, setWriting] = useState(false)

  const list = useMemo(() => {
    let l = [...local, ...reviews]
    if (star) l = l.filter((r) => r.rating === star)
    if (verified) l = l.filter((r) => r.verified)
    if (hideSus) l = l.filter((r) => !r.suspicious)
    if (withComments) l = l.filter((r) => r.comments.length)
    if (sort === 'recent') l.sort((a, b) => b.date - a.date)
    if (sort === 'critical') l.sort((a, b) => a.rating - b.rating)
    return l
  }, [reviews, local, star, verified, hideSus, withComments, sort])

  return (
    <section id="recensioni" className="container pdp__section">
      <SectionHead
        index="04"
        kicker={`${p.reviewCount.toLocaleString('it-IT')} totali`}
        title="Recensioni"
        action={
          <Btn size="sm" tone="ink" onClick={() => (user ? setWriting((w) => !w) : toast('Accedi per scrivere una recensione', 'account'))}>
            Scrivi
          </Btn>
        }
      />
      <div className="reviews">
        <aside className="reviews__side">
          <div className="reviews__avg">
            <span className="reviews__big">{p.rating.toFixed(1)}</span>
            <Stars value={p.rating} size={16} />
          </div>
          <RatingBars p={p} active={star} onPick={setStar} />
          <p className="mono small muted">Tocca una barra per filtrare</p>
        </aside>
        <div className="reviews__main">
          <div className="chips">
            <Chip active={verified} onClick={() => setVerified(!verified)}>
              Acquisto verificato
            </Chip>
            <Chip active={withComments} onClick={() => setWithComments(!withComments)}>
              Con commenti
            </Chip>
            {ext.reviewCheck && (
              <Chip active={hideSus} onClick={() => setHideSus(!hideSus)}>
                Nascondi sospette
              </Chip>
            )}
            <span className="chips__sep" />
            {(
              [
                ['helpful', 'Utili'],
                ['recent', 'Recenti'],
                ['critical', 'Critiche'],
              ] as [RSort, string][]
            ).map(([k, l]) => (
              <Chip key={k} active={sort === k} onClick={() => setSort(k)}>
                {l}
              </Chip>
            ))}
          </div>

          <AnimatePresence>
            {writing && (
              <WriteReview
                onCancel={() => setWriting(false)}
                onSubmit={(r) => {
                  setLocal((l) => [{ ...r, productId: p.id, variant: p.variants[0].label, author: user?.name ?? 'Tu' }, ...l])
                  setWriting(false)
                  toast('Recensione pubblicata', 'account')
                }}
              />
            )}
          </AnimatePresence>

          <div className="reviews__list">
            <AnimatePresence initial={false}>
              {list.slice(0, shown).map((r) => (
                <ReviewItem key={r.id} r={r} showFlag={ext.reviewCheck} />
              ))}
            </AnimatePresence>
            {list.length === 0 && <p className="small muted">Nessuna recensione con questi filtri.</p>}
          </div>
          {shown < list.length && (
            <Btn onClick={() => setShown((s) => s + 6)} block sub={`${shown} di ${list.length} lette`} progress={shown / list.length}>
              Mostra altre {Math.min(6, list.length - shown)}
            </Btn>
          )}
        </div>
      </div>
    </section>
  )
}

function WriteReview({ onCancel, onSubmit }: { onCancel: () => void; onSubmit: (r: Omit<Review, 'productId' | 'variant' | 'author'>) => void }) {
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  return (
    <motion.form
      className="writerev"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      onSubmit={(e) => {
        e.preventDefault()
        if (!title || !body) return
        onSubmit({ id: `local-${Date.now()}`, avatarHue: 140, rating, title, body, date: Date.now(), verified: true, helpful: 0, suspicious: false, comments: [] })
      }}
    >
      <div className="row-8">
        {[1, 2, 3, 4, 5].map((n) => (
          <button type="button" key={n} className={`starpick${n <= rating ? ' is-on' : ''}`} onClick={() => setRating(n)} aria-label={`${n} stelle`} />
        ))}
        <span className="mono small muted">{rating}/5</span>
      </div>
      <input className="field" placeholder="Titolo" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className="field" rows={3} placeholder="Com’è andata?" value={body} onChange={(e) => setBody(e.target.value)} />
      <div className="row-8">
        <Btn type="submit" tone="account" size="sm">
          Pubblica
        </Btn>
        <Btn size="sm" onClick={onCancel}>
          Annulla
        </Btn>
      </div>
    </motion.form>
  )
}

function ReviewItem({ r, showFlag }: { r: Review; showFlag: boolean }) {
  const [open, setOpen] = useState(false)
  const [helpful, setHelpful] = useState(false)
  const [comments, setComments] = useState(r.comments)
  const [draft, setDraft] = useState('')
  const user = useStore((s) => s.user)
  return (
    <motion.article className="review" layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }}>
      <header className="review__head">
        <span className="avatar" style={{ background: `hsl(${r.avatarHue} 10% 88%)` }}>
          {r.author[0]}
        </span>
        <div>
          <p className="small strong">{r.author}</p>
          <p className="mono small muted">
            {dateShort(r.date)} · {r.variant}
            {r.verified && <span className="ok"> · ✓ verificato</span>}
          </p>
        </div>
        {showFlag && r.suspicious && <Tag>⚠ sospetta</Tag>}
      </header>
      <div className="review__title">
        <Stars value={r.rating} size={11} />
        <strong>{r.title}</strong>
      </div>
      <p className="review__body">{r.body}</p>
      <footer className="review__foot">
        <button className={`linkbtn small${helpful ? ' is-on' : ''}`} onClick={() => setHelpful(!helpful)}>
          <ThumbsUp size={13} /> Utile · {r.helpful + (helpful ? 1 : 0)}
        </button>
        <button className="linkbtn small" onClick={() => setOpen(!open)}>
          <MessageCircle size={13} /> {comments.length ? `${comments.length} commenti` : 'Commenta'}
        </button>
      </footer>
      <AnimatePresence>
        {open && (
          <motion.div className="thread" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            {comments.map((c) => (
              <div key={c.id} className={`thread__c${c.isSeller ? ' is-seller' : ''}`}>
                <p className="mono small">
                  {c.author}
                  {c.isSeller && ' · venditore'} <span className="muted">· {dateShort(c.date)}</span>
                </p>
                <p className="small">{c.body}</p>
              </div>
            ))}
            <form
              className="thread__form"
              onSubmit={(e) => {
                e.preventDefault()
                if (!draft.trim()) return
                setComments((cs) => [...cs, { id: `${r.id}-${Date.now()}`, author: user?.name ?? 'Ospite', body: draft, date: Date.now() }])
                setDraft('')
              }}
            >
              <input className="field" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Rispondi…" />
              <Btn type="submit" size="sm" tone="ink">
                Invia
              </Btn>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}

function QA({ questions }: { questions: Question[] }) {
  const [q, setQ] = useState('')
  const hits = questions.filter((x) => (x.q + x.a).toLowerCase().includes(q.toLowerCase()))
  return (
    <section id="domande" className="container pdp__section">
      <SectionHead index="05" kicker="risposte della community" title="Domande" />
      <input className="field" placeholder="Cerca tra domande e risposte…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="qa">
        {hits.map((x) => (
          <details key={x.id} className="qa__item">
            <summary>
              <span className="mono small muted">▲ {x.votes}</span>
              <span className="strong">{x.q}</span>
              <ChevronDown size={16} />
            </summary>
            <p className="small">{x.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

function Bundle({ p, other }: { p: P; other: P[] }) {
  const addToCart = useStore((s) => s.addToCart)
  const items = [p, ...other]
  const total = items.reduce((a, x) => a + x.price, 0)
  return (
    <div className="bundle">
      <p className="mono up small muted">Spesso comprati insieme</p>
      <div className="bundle__row">
        {items.map((x, i) => (
          <div key={x.id} className="bundle__item">
            {i > 0 && <span className="bundle__plus">+</span>}
            <Link to={`/p/${x.id}`} className="bundle__art">
              <Photo id={x.images[0]} alt={x.name} w={300} />
            </Link>
            <span className="small">{x.name}</span>
            <span className="mono small">{money(x.price)}</span>
          </div>
        ))}
        <div className="bundle__total">
          <span className="mono small muted">Totale</span>
          <strong>{money(total)}</strong>
          <Btn tone="cart" size="sm" onClick={() => items.forEach((x) => addToCart(x.id, x.variants[0].id))}>
            Aggiungi tutti
          </Btn>
        </div>
      </div>
    </div>
  )
}

function ProductSkeleton() {
  return (
    <div className="container pdp__top" aria-busy>
      <div className="gallery__stage sk" />
      <div className="buybox">
        {[30, 80, 60, 40, 90, 90].map((w, i) => (
          <div key={i} className="sk sk--line" style={{ width: `${w}%`, height: i === 1 ? 32 : 14 }} />
        ))}
      </div>
    </div>
  )
}

/** Where today's price sits between the 12-month low and high (avg marked). */
function PriceRange({ p }: { p: P }) {
  const { min, max, avg } = priceStats(p, 365)
  const span = max - min || 1
  const at = (p.price - min) / span
  const tone = at < 0.34 ? 'account' : at > 0.66 ? 'bad' : 'ink'
  const verdict = at < 0.15 ? 'Vicino al minimo storico' : at < 0.34 ? 'Buon prezzo' : at > 0.66 ? 'Prezzo alto: conviene aspettare' : 'Nella media'
  return (
    <Track
      className="pricerange"
      value={at}
      tone={tone}
      goal={false}
      marks={[{ at: (avg - min) / span, label: `media ${money(avg)}`, done: false }]}
      label={verdict}
      aside={`${money(min)} — ${money(max)}`}
      ariaLabel="Prezzo attuale rispetto agli ultimi 12 mesi"
    />
  )
}

/** Countdown to the order cutoff: the line empties as the time left for next-day delivery runs out. */
function Cutoff({ fast }: { fast: boolean }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(t)
  }, [])
  const start = new Date(now)
  start.setHours(8, 0, 0, 0)
  const end = new Date(now)
  end.setHours(18, 0, 0, 0)
  const left = end.getTime() - now.getTime()
  const open = left > 0 && now >= start
  const h = Math.floor(left / 3_600_000)
  const m = Math.floor((left % 3_600_000) / 60_000)
  return (
    <Track
      size="sm"
      goal={false}
      tone={open ? 'buy' : 'ink'}
      value={open ? left / (end.getTime() - start.getTime()) : 0}
      label={open ? `Ordina entro ${h ? `${h} h ` : ''}${m} min` : 'Ordini chiusi per oggi'}
      aside={open ? `arriva ${deliveryLabel(fast)}` : `arriva ${deliveryLabel(fast, 1)}`}
      ariaLabel="Tempo rimasto per la consegna più rapida"
    />
  )
}

function deliveryLabel(fast: boolean, extra = 0) {
  const d = new Date()
  let add = (fast ? 1 : 3) + extra
  while (add > 0) {
    d.setDate(d.getDate() + 1)
    if (d.getDay() !== 0) add--
  }
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const date = d.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'short' })
  return d.toDateString() === tomorrow.toDateString() ? `domani, ${date}` : date
}

function priceDelta(then: number, now: number) {
  const d = Math.round(((now - then) / then) * 100)
  return d === 0 ? 'Prezzo invariato' : d < 0 ? `${d}% da quando l’hai salvato` : `+${d}% da quando l’hai salvato`
}

/** Add-to-cart that tells you what it did: glow while adding, check when done, and how many you already have. */
function CartButton({ id, variant, qty }: { id: string; variant: string; qty: number }) {
  const inCart = useStore((s) => s.cart.filter((l) => l.id === id).reduce((a, l) => a + l.qty, 0))
  const addToCart = useStore((s) => s.addToCart)
  const [state, setState] = useState<'idle' | 'adding' | 'added'>('idle')
  const click = () => {
    if (state === 'adding') return
    setState('adding')
    setTimeout(() => {
      addToCart(id, variant, qty)
      setState('added')
      setTimeout(() => setState('idle'), 1400)
    }, 450)
  }
  return (
    <Btn
      tone="cart"
      size="lg"
      block
      icon={state === 'added' ? <Check size={16} /> : <ShoppingBag size={16} />}
      onClick={click}
      count={inCart}
      progress={state === 'adding' ? 'loading' : undefined}
      sub={state === 'added' ? `Ora ne hai ${inCart} nel carrello` : inCart ? `${inCart} già nel carrello` : undefined}
    >
      {state === 'adding' ? 'Aggiungo…' : state === 'added' ? 'Aggiunto' : 'Aggiungi al carrello'}
    </Btn>
  )
}
