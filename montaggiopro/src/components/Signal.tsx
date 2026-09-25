import { motion, useMotionValue, useTransform, type MotionValue } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * The dot-and-line language, made functional.
 * One primitive — a line, a filled part, a dot where "now" is and a ring at the goal —
 * drives every indicator: loading, scroll, selection, filters, free shipping, stock, price range…
 */

export type SignalTone = 'ink' | 'cart' | 'buy' | 'fav' | 'account' | 'bad'

interface TrackProps {
  /** 0..1 (ignored while loading) */
  value?: number
  /** Or drive it with a motion value (scroll-linked). */
  motionValue?: MotionValue<number>
  loading?: boolean
  tone?: SignalTone
  /** Extra positions 0..1 drawn as small dots (thresholds, steps, averages). */
  marks?: { at: number; label?: string; done?: boolean }[]
  /** Show the ring at the end, filled when value reaches 1. */
  goal?: boolean
  size?: 'sm' | 'md'
  label?: ReactNode
  aside?: ReactNode
  className?: string
  onSeek?: (v: number) => void
  ariaLabel?: string
}

export function Track({ value = 0, motionValue, loading, tone = 'ink', marks, goal = true, size = 'md', label, aside, className = '', onSeek, ariaLabel }: TrackProps) {
  const v = Math.max(0, Math.min(1, value))
  const pct = `${v * 100}%`
  const localMV = useMotionValue(0)
  const mvWidth = useTransform(motionValue ?? localMV, (x) => `${Math.max(0, Math.min(1, x)) * 100}%`)
  const done = !loading && (motionValue ? false : v >= 1)
  const width = motionValue ? mvWidth : pct

  return (
    <div className={`sig sig--${tone} sig--${size}${loading ? ' is-loading' : ''}${done ? ' is-done' : ''} ${className}`}>
      {(label || aside) && (
        <div className="sig__meta">
          <span>{label}</span>
          {aside && <span className="sig__aside">{aside}</span>}
        </div>
      )}
      <div
        className={`sig__rail${onSeek ? ' is-seekable' : ''}`}
        role={onSeek ? 'slider' : 'progressbar'}
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={loading ? undefined : Math.round(v * 100)}
        onPointerDown={
          onSeek
            ? (e) => {
                const r = e.currentTarget.getBoundingClientRect()
                onSeek((e.clientX - r.left) / r.width)
              }
            : undefined
        }
      >
        <span className="sig__start" />
        <span className="sig__line" />
        {!loading && <motion.span className="sig__fill" style={{ width }} transition={{ type: 'spring', stiffness: 160, damping: 26 }} animate={motionValue ? undefined : { width: pct }} />}
        {marks?.map((m, i) => (
          <span key={i} className={`sig__mark${m.done ?? v >= m.at ? ' is-on' : ''}`} style={{ left: `${m.at * 100}%` }} title={m.label} />
        ))}
        {loading ? (
          <span className="sig__runner" />
        ) : (
          <motion.span className="sig__dot" style={{ left: width }} animate={motionValue ? undefined : { left: pct }} transition={{ type: 'spring', stiffness: 160, damping: 26 }} />
        )}
        {goal && <span className="sig__goal" />}
      </div>
    </div>
  )
}

/** Thin page-level line under the header: glows while anything is loading. */
export function LoadingLine({ active }: { active: boolean }) {
  return <div className={`loadline${active ? ' is-active' : ''}`} aria-hidden />
}
