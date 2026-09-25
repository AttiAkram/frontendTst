import { motion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Plus, Scale } from 'lucide-react'
import { claimedDiscount, dealScore, realDiscount } from '../data/catalog'
import type { Product } from '../data/types'
import { money } from '../lib/format'
import { useStore } from '../store/store'
import { ProductArt } from './ProductArt'
import { IconBtn, Stars, Tag, TrustBadge } from './ui'

export function ProductCard({ p, index = 0 }: { p: Product; index?: number }) {
  const [variant, setVariant] = useState(p.variants[0])
  const wished = useStore((s) => s.wishlist.some((w) => w.id === p.id))
  const inCompare = useStore((s) => s.compare.includes(p.id))
  const ext = useStore((s) => s.extensions)
  const { toggleWish, addToCart, toggleCompare } = useStore.getState()
  const claimed = claimedDiscount(p)
  const real = realDiscount(p)
  const lowest = dealScore(p) >= 92
  const shown = ext.realDiscount ? real : claimed

  return (
    <motion.article
      className="pcard"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: (index % 12) * 0.04, ease: [0.2, 0.7, 0.1, 1] }}
      layout="position"
    >
      <Link to={`/p/${p.id}`} className="pcard__media" aria-label={p.name}>
        <div className="pcard__tags">
          {p.sponsored && <Tag>Sponsorizzato</Tag>}
          {lowest && <Tag tone="deal">Minimo 12 mesi</Tag>}
          {!lowest && claimed > 0 && (ext.realDiscount && real < claimed - 8 ? <Tag>Sconto gonfiato</Tag> : shown > 0 && <Tag tone="deal">−{shown}%</Tag>)}
        </div>
        <motion.div className="pcard__art" whileHover={{ scale: 1.06, rotate: -2 }} transition={{ type: 'spring', stiffness: 200, damping: 18 }}>
          <ProductArt category={p.category} color={variant.swatch} seed={index} />
        </motion.div>
        <span className="pcard__code mono">{p.id}</span>
      </Link>

      <div className="pcard__actions">
        <IconBtn label={wished ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'} tone="fav" active={wished} onClick={() => toggleWish(p.id)}>
          <Heart size={16} fill={wished ? 'currentColor' : 'none'} />
        </IconBtn>
        {ext.compare && (
          <IconBtn label="Confronta" active={inCompare} onClick={() => toggleCompare(p.id)}>
            <Scale size={16} />
          </IconBtn>
        )}
      </div>

      <div className="pcard__body">
        <div className="pcard__swatches">
          {p.variants.map((v) => (
            <button
              key={v.id}
              className={`swatch${v.id === variant.id ? ' is-active' : ''}`}
              style={{ background: v.swatch }}
              onClick={() => setVariant(v)}
              aria-label={v.label}
            />
          ))}
          <span className="mono muted small">{p.brand}</span>
        </div>
        <Link to={`/p/${p.id}`} className="pcard__name">
          {p.name}
        </Link>
        <div className="pcard__rating">
          <Stars value={p.rating} size={11} />
          <span className="mono small muted">{p.reviewCount.toLocaleString('it-IT')}</span>
          {ext.reviewCheck && <TrustBadge score={p.trustScore} compact />}
        </div>
        <div className="pcard__foot">
          <div className="pcard__price">
            <strong>{money(p.price)}</strong>
            {p.listPrice > p.price && <s className="muted">{money(p.listPrice)}</s>}
            {ext.unitPrice && p.unit && (
              <span className="mono small muted">
                {money(p.price / p.unit.amount)}/{p.unit.label}
              </span>
            )}
            <span className={`mono small ${p.fastShipping ? 'ok' : 'muted'}`}>{p.fastShipping ? '● Consegna domani' : '○ 2–4 giorni'}</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ rotate: 90 }}
            className="addfab"
            aria-label="Aggiungi al carrello"
            onClick={() => addToCart(p.id, variant.id)}
          >
            <Plus size={20} strokeWidth={2.4} />
          </motion.button>
        </div>
      </div>
    </motion.article>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="pcard pcard--sk" aria-hidden>
      <div className="pcard__media sk" />
      <div className="pcard__body">
        <div className="sk sk--line" style={{ width: '40%' }} />
        <div className="sk sk--line" style={{ width: '85%' }} />
        <div className="sk sk--line" style={{ width: '60%' }} />
      </div>
    </div>
  )
}
