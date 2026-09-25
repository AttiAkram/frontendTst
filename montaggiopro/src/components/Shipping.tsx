import { AnimatePresence, motion } from 'motion/react'
import { MapPin } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { PLACES, type ShipSpeed, findPlace, quoteShipping } from '../data/shipping'
import { dateLong, money } from '../lib/format'
import { useStore } from '../store/store'

interface Props {
  weightKg: number
  subtotal: number
  selectable?: boolean
  value?: ShipSpeed
  onChange?: (s: ShipSpeed, price: number) => void
}

/** CAP → nearest warehouse → price & ETA for each speed. Mirrors `POST /shipping/quote`. */
export function ShippingEstimator({ weightKg, subtotal, selectable, value, onChange }: Props) {
  const cap = useStore((s) => s.cap)
  const member = useStore((s) => s.member)
  const setCap = useStore((s) => s.setCap)
  const [input, setInput] = useState(cap)
  const place = findPlace(cap)
  const quotes = useMemo(() => (place ? quoteShipping(place, weightKg, subtotal, member) : []), [place, weightKg, subtotal, member])

  // Keep the parent's price in sync with the pre-selected option (e.g. standard isn't free under 39 €).
  const current = quotes.find((q) => q.speed === value)
  useEffect(() => {
    if (selectable && current) onChange?.(current.speed, current.price)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.price, selectable])

  return (
    <div className="ship">
      <form
        className="ship__form"
        onSubmit={(e) => {
          e.preventDefault()
          setCap(input)
        }}
      >
        <MapPin size={16} />
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="CAP o città (es. 40121)" aria-label="CAP o città" list="places" />
        <datalist id="places">
          {PLACES.map((p) => (
            <option key={p.cap} value={p.cap}>
              {p.city}
            </option>
          ))}
        </datalist>
        <button className="mono up small" type="submit">
          Calcola
        </button>
      </form>
      {cap && !place && <p className="small bad">CAP non riconosciuto nella demo — prova 20121, 00184, 90133…</p>}
      <AnimatePresence mode="popLayout">
        {place && (
          <motion.div key={place.cap} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="ship__list">
            <p className="mono small muted">
              → {place.city} ({place.prov}) · da {quotes[0].warehouse} · {quotes[0].km} km · {weightKg.toFixed(2)} kg
            </p>
            {quotes.map((q) => {
              const on = value === q.speed
              const Row = selectable ? 'button' : 'div'
              return (
                <Row
                  key={q.speed}
                  className={`ship__row${on ? ' is-active' : ''}${!q.available ? ' is-off' : ''}`}
                  {...(selectable ? { type: 'button' as const, disabled: !q.available, onClick: () => onChange?.(q.speed, q.price) } : {})}
                >
                  {selectable && <span className="radio" />}
                  <span className="ship__name">
                    <strong className="small">{q.label}</strong>
                    <span className="mono small muted">{q.note ?? (q.days[0] === 0 ? 'Oggi' : q.days[0] === q.days[1] ? `${q.days[0]} giorno lav.` : `${q.days[0]}–${q.days[1]} giorni lav.`)}</span>
                  </span>
                  <span className="ship__eta small">{q.available ? (q.days[1] === 0 ? 'Oggi entro le 22' : dateLong(q.eta[1])) : '—'}</span>
                  <span className="ship__price mono">{q.price === 0 ? 'GRATIS' : money(q.price)}</span>
                </Row>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
