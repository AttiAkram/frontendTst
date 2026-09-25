import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Heart, Plus, Scale } from 'lucide-react'
import { CATEGORIES, claimedDiscount, dealScore, realDiscount } from '../data/catalog'
import type { Product } from '../data/types'
import { money } from '../lib/format'
import { useStore } from '../store/store'
import { Photo } from './Photo'
import { IconBtn, Stars, TrustBadge } from './ui'

export function ProductCard({ p, index = 0 }: { p: Product; index?: number }) {
  const wished = useStore((s) => s.wishlist.some((w) => w.id === p.id))
  const inCompare = useStore((s) => s.compare.includes(p.id))
  const ext = useStore((s) => s.extensions)
  const inCart = useStore((s) => s.cart.filter((l) => l.id === p.id).reduce((a, l) => a + l.qty, 0))
  const { toggleWish, addToCart, toggleCompare } = useStore.getState()
  const claimed = claimedDiscount(p)
  const real = realDiscount(p)
  const shown = ext.realDiscount ? real : claimed
  const inflated = ext.realDiscount && claimed > 0 && real < claimed - 8
  const lowest = dealScore(p) >= 92
  const cat = CATEGORIES.find((c) => c.id === p.category)!
  const badge = lowest ? 'Minimo storico' : p.stock < 6 ? 'Quasi esaurito' : Date.now() - p.createdAt < 60 * 864e5 ? 'Novità' : null

  return (
    <motion.article
      className="pcard"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: (index % 12) * 0.035, ease: [0.2, 0.7, 0.1, 1] }}
    >
      <div className="pcard__top">
        <Link to={`/p/${p.id}`} className="pcard__media" aria-label={p.name}>
          <Photo id={p.images[0]} alt={p.name} w={600} className="pcard__img" label={cat.label} />
          {p.images[1] && <Photo id={p.images[1]} alt="" w={600} className="pcard__img pcard__img--alt" label={cat.label} />}
          {badge && <span className="pcard__badge">{badge}</span>}
        </Link>

        <div className="pcard__actions">
          <IconBtn label={wished ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'} tone="fav" active={wished} onClick={() => toggleWish(p.id)}>
            <Heart size={16} fill={wished ? 'currentColor' : 'none'} />
          </IconBtn>
          {ext.compare && (
            <IconBtn label="Confronta" active={inCompare} onClick={() => toggleCompare(p.id)}>
              <Scale size={15} />
            </IconBtn>
          )}
        </div>

        <button className="pcard__quick" onClick={() => addToCart(p.id, p.variants[0].id)}>
          <Plus size={16} strokeWidth={2.4} /> {inCart ? `Aggiungine un altro · ${inCart} nel carrello` : 'Aggiungi al carrello'}
        </button>
      </div>

      <div className="pcard__body">
        {p.sponsored && <span className="pcard__sponsor">Sponsorizzato</span>}
        <Link to={`/p/${p.id}`} className="pcard__name">
          {p.name}
        </Link>
        <span className="pcard__sub">
          {cat.label} · {p.variants.length} colori
        </span>
        <span className="pcard__rating">
          <Stars value={p.rating} size={12} />
          <span>{p.reviewCount.toLocaleString('it-IT')}</span>
          {ext.reviewCheck && <TrustBadge score={p.trustScore} compact />}
        </span>
        <div className="pcard__price">
          <strong>{money(p.price)}</strong>
          {p.listPrice > p.price && <s>{money(p.listPrice)}</s>}
          {claimed > 0 && (inflated ? <span className="pcard__warn">Sconto gonfiato</span> : shown > 0 && <span className="pcard__off">−{shown}%</span>)}
        </div>
        {ext.unitPrice && p.unit && (
          <span className="pcard__sub">
            {money(p.price / p.unit.amount)}/{p.unit.label}
          </span>
        )}
        <span className={`pcard__ship${p.fastShipping ? ' is-fast' : ''}`}>{p.fastShipping ? 'Consegna domani' : 'Consegna in 2–4 giorni'}</span>
      </div>
    </motion.article>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="pcard pcard--sk" aria-hidden>
      <div className="pcard__media sk" />
      <div className="pcard__body">
        <div className="sk sk--line" style={{ width: '80%' }} />
        <div className="sk sk--line" style={{ width: '50%' }} />
        <div className="sk sk--line" style={{ width: '30%' }} />
      </div>
    </div>
  )
}
