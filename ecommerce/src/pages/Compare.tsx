import { X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DealMeter } from '../components/Charts'
import { Photo } from '../components/Photo'
import { Btn, IconBtn, Rule, SectionHead, Stars, TrustBadge } from '../components/ui'
import { PRODUCT_BY_ID, adjustedRating, dealScore, priceStats } from '../data/catalog'
import type { Product } from '../data/types'
import { money } from '../lib/format'
import { useStore } from '../store/store'

type Row = [label: string, render: (p: Product) => React.ReactNode, metric?: (p: Product) => number, dir?: 'min' | 'max']

const ROWS: Row[] = [
  ['Prezzo', (p) => <strong className="mono">{money(p.price)}</strong>, (p) => p.price, 'min'],
  ['Minimo 12 mesi', (p) => <span className="mono">{money(priceStats(p, 365).min)}</span>],
  ['Affare', (p) => <DealMeter score={dealScore(p)} />, dealScore, 'max'],
  ['Valutazione', (p) => <Stars value={p.rating} size={11} showValue />, (p) => p.rating, 'max'],
  ['Voto corretto', (p) => <span className="mono">{adjustedRating(p).toFixed(1)}</span>, adjustedRating, 'max'],
  ['Affidabilità', (p) => <TrustBadge score={p.trustScore} compact />, (p) => p.trustScore, 'max'],
  ['Recensioni', (p) => <span className="mono">{p.reviewCount.toLocaleString('it-IT')}</span>, (p) => p.reviewCount, 'max'],
  ['Peso', (p) => <span className="mono">{Math.round(p.weightKg * 1000)} g</span>, (p) => p.weightKg, 'min'],
  ['Garanzia', (p) => <span className="mono">{p.warrantyMonths} mesi</span>, (p) => p.warrantyMonths, 'max'],
  ['Reso', (p) => <span className="mono">{p.returnDays} gg</span>, (p) => p.returnDays, 'max'],
  ['Eco-score', (p) => <span className="mono">{p.eco}/5</span>, (p) => p.eco, 'max'],
  ['Consegna', (p) => <span className={`mono small ${p.fastShipping ? 'ok' : 'muted'}`}>{p.fastShipping ? 'domani' : '2–4 gg'}</span>],
  ['Venditore', (p) => <span className="small">{p.seller}</span>],
]

export function Compare() {
  const ids = useStore((s) => s.compare)
  const toggle = useStore((s) => s.toggleCompare)
  const addToCart = useStore((s) => s.addToCart)
  const items = ids.map((id) => PRODUCT_BY_ID.get(id)!).filter(Boolean)

  if (items.length < 2)
    return (
      <div className="container empty">
        <p className="dot-title">Confronta</p>
        <p className="muted">Aggiungi almeno 2 prodotti con l’icona ⚖ sulle schede. ({items.length}/4)</p>
        <Btn to="/shop">Vai allo shop</Btn>
      </div>
    )

  const best = (f: (p: Product) => number, dir: 'min' | 'max') => {
    const vals = items.map(f)
    return dir === 'min' ? Math.min(...vals) : Math.max(...vals)
  }

  return (
    <div className="container section">
      <SectionHead index="" kicker={`${items.length} prodotti`} title="Confronto" />
      <div className="compare" data-lenis-prevent-wheel style={{ '--cols': items.length } as React.CSSProperties}>
        <div className="compare__row compare__row--head">
          <span />
          {items.map((p) => (
            <div key={p.id} className="compare__prod">
              <IconBtn label="Rimuovi" onClick={() => toggle(p.id)}>
                <X size={14} />
              </IconBtn>
              <Link to={`/p/${p.id}`} className="compare__art">
                <Photo id={p.images[0]} alt={p.name} w={300} />
              </Link>
              <Link to={`/p/${p.id}`} className="small strong">
                {p.name}
              </Link>
              <Btn size="sm" tone="cart" onClick={() => addToCart(p.id, p.variants[0].id)}>
                Carrello
              </Btn>
            </div>
          ))}
        </div>
        {ROWS.map(([label, render, metric, dir]) => {
          const b = metric && dir ? best(metric, dir) : null
          return (
            <div key={label} className="compare__row">
              <span className="mono small muted">{label}</span>
              {items.map((p) => (
                <div key={p.id} className={`compare__cell${b != null && metric!(p) === b ? ' is-best' : ''}`}>
                  {render(p)}
                </div>
              ))}
            </div>
          )
        })}
      </div>
      <p className="mono small muted">● = migliore nella riga</p>
      <Rule variant="end" label="fine confronto" />
    </div>
  )
}
