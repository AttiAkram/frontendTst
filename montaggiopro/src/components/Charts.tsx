import { useMemo, useState } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { priceStats } from '../data/catalog'
import type { Product } from '../data/types'
import { dateShort, money, monthShort } from '../lib/format'
import { Chip } from './ui'

const INK = '#0a0a0a'
const GRID = '#dcdcd8'
const AXIS = { fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fill: '#8a8a86' }

function Tip({ active, payload, fmt, label: lbl }: { active?: boolean; payload?: { value: number; payload: { t: number } }[]; fmt: (v: number) => string; label?: string }) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="ctip">
      <span className="mono small muted">{lbl ?? dateShort(d.payload.t)}</span>
      <strong>{fmt(d.value)}</strong>
    </div>
  )
}

const RANGES = [
  ['1M', 30],
  ['3M', 90],
  ['6M', 180],
  ['1A', 365],
] as const

/** Keepa-style stepped price history with min / avg markers. */
export function PriceHistory({ p }: { p: Product }) {
  const [days, setDays] = useState<number>(90)
  const data = useMemo(() => p.priceHistory.slice(-days - 1), [p, days])
  const s = priceStats(p, days)
  const pos = s.max === s.min ? 0.5 : (p.price - s.min) / (s.max - s.min)
  const verdict = pos < 0.15 ? ['Ottimo momento', 'ok'] : pos < 0.5 ? ['Buon prezzo', 'ok'] : pos < 0.8 ? ['Nella media', 'muted'] : ['Meglio aspettare', 'bad']

  return (
    <div className="chartcard">
      <div className="chartcard__head">
        <div>
          <h4 className="mono up">Storico prezzo</h4>
          <p className={`small strong ${verdict[1]}`}>● {verdict[0]}</p>
        </div>
        <div className="chips chips--tight" role="group" aria-label="Periodo">
          {RANGES.map(([l, d]) => (
            <Chip key={l} active={days === d} onClick={() => setDays(d)}>
              {l}
            </Chip>
          ))}
        </div>
      </div>
      <div className="chartcard__plot" style={{ height: 220 }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 8, bottom: 0, left: -6 }}>
            <defs>
              <linearGradient id="pfill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={INK} stopOpacity={0.14} />
                <stop offset="1" stopColor={INK} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={GRID} strokeDasharray="1 5" vertical={false} />
            <XAxis dataKey="t" tickFormatter={(t) => dateShort(t)} tick={AXIS} axisLine={false} tickLine={false} minTickGap={40} />
            <YAxis tick={AXIS} axisLine={false} tickLine={false} width={52} domain={['dataMin - 5', 'dataMax + 5']} tickFormatter={(v) => `${Math.round(v)}€`} />
            <Tooltip content={<Tip fmt={money} />} cursor={{ stroke: INK, strokeDasharray: '2 3' }} />
            <ReferenceLine y={s.avg} stroke="#8a8a86" strokeDasharray="4 4" label={{ value: `media ${money(s.avg)}`, position: 'insideTopLeft', ...AXIS }} />
            <ReferenceLine y={s.min} stroke={INK} strokeDasharray="1 3" label={{ value: `min ${money(s.min)}`, position: 'insideBottomLeft', ...AXIS }} />
            <Area type="stepAfter" dataKey="price" stroke={INK} strokeWidth={2} fill="url(#pfill)" activeDot={{ r: 5, fill: '#ffd400', stroke: INK, strokeWidth: 1.5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <dl className="statrow">
        <div>
          <dt>Adesso</dt>
          <dd>{money(p.price)}</dd>
        </div>
        <div>
          <dt>Minimo</dt>
          <dd>{money(s.min)}</dd>
        </div>
        <div>
          <dt>Media</dt>
          <dd>{money(s.avg)}</dd>
        </div>
        <div>
          <dt>Massimo</dt>
          <dd>{money(s.max)}</dd>
        </div>
      </dl>
    </div>
  )
}

/** Two separate charts — never a dual axis: average rating over time, and review volume per month. */
export function ReviewEvolution({ p }: { p: Product }) {
  const data = p.ratingHistory
  return (
    <div className="chartcard">
      <div className="chartcard__head">
        <div>
          <h4 className="mono up">Evoluzione recensioni</h4>
          <p className="small muted">Ultimi 12 mesi</p>
        </div>
      </div>
      <p className="mono small muted chartcard__sub">Voto medio mensile</p>
      <div className="chartcard__plot" style={{ height: 140 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="1 5" vertical={false} />
            <XAxis dataKey="t" tickFormatter={(t) => monthShort(t)} tick={AXIS} axisLine={false} tickLine={false} minTickGap={24} />
            <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={AXIS} axisLine={false} tickLine={false} width={40} />
            <Tooltip content={<Tip fmt={(v) => `${v.toFixed(2)} / 5`} />} cursor={{ stroke: INK, strokeDasharray: '2 3' }} />
            <Line type="monotone" dataKey="avg" stroke={INK} strokeWidth={2} dot={{ r: 2.5, fill: INK }} activeDot={{ r: 5, fill: '#16c35a', stroke: INK }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mono small muted chartcard__sub">Nuove recensioni al mese</p>
      <div className="chartcard__plot" style={{ height: 110 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
            <XAxis dataKey="t" tickFormatter={(t) => monthShort(t)} tick={AXIS} axisLine={false} tickLine={false} minTickGap={24} />
            <YAxis tick={AXIS} axisLine={false} tickLine={false} width={40} />
            <Tooltip content={<Tip fmt={(v) => `${v} recensioni`} />} cursor={{ fill: '#0000000a' }} />
            <Bar dataKey="count" fill={INK} radius={[4, 4, 0, 0]} maxBarSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function RatingBars({ p, active, onPick }: { p: Product; active: number | null; onPick: (n: number | null) => void }) {
  return (
    <div className="ratingbars">
      {p.distribution.map((share, i) => {
        const star = 5 - i
        const on = active === star
        return (
          <button key={star} className={`ratingbars__row${on ? ' is-active' : ''}`} onClick={() => onPick(on ? null : star)} aria-pressed={on}>
            <span className="mono small">{star}★</span>
            <span className="ratingbars__track">
              <span style={{ width: `${share * 100}%` }} />
            </span>
            <span className="mono small muted">{Math.round(share * 100)}%</span>
          </button>
        )
      })}
    </div>
  )
}

/** Tiny sparkline for list rows (wishlist / compare). */
export function Spark({ p, days = 60 }: { p: Product; days?: number }) {
  const data = p.priceHistory.slice(-days)
  const down = data[0].price > p.price
  return (
    <div style={{ width: 96, height: 32 }} aria-label="andamento prezzo">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
          <YAxis hide domain={['dataMin', 'dataMax']} />
          <Area type="stepAfter" dataKey="price" stroke={down ? '#0f9a44' : INK} strokeWidth={1.5} fill="none" isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export { DealMeter } from './ui'
