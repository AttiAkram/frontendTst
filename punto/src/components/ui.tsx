import { AnimatePresence, motion } from 'motion/react'
import { type ReactNode, useEffect, useId } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { trustGrade } from '../data/catalog'
import { useIsMobile } from '../hooks/useMedia'

/* ------------------------------------------------------------------ */
/* Signal buttons: yellow = cart, blue = buy, red = favourite, green = account */

export type Tone = 'cart' | 'buy' | 'fav' | 'account' | 'ink' | 'ghost'

interface BtnProps {
  tone?: Tone
  children: ReactNode
  onClick?: (e: React.MouseEvent) => void
  to?: string
  icon?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
  disabled?: boolean
  type?: 'button' | 'submit'
  active?: boolean
  label?: string
  className?: string
}

export function Btn({ tone = 'ghost', children, onClick, to, icon, size = 'md', block, disabled, type = 'button', active, label, className = '' }: BtnProps) {
  const cls = `btn btn--${tone} btn--${size}${block ? ' btn--block' : ''}${active ? ' is-active' : ''} ${className}`
  const inner = (
    <>
      <span className="btn__dot" aria-hidden />
      <span className="btn__label">{children}</span>
      {icon && <span className="btn__icon">{icon}</span>}
    </>
  )
  if (to)
    return (
      <motion.span whileTap={{ scale: 0.97 }} style={{ display: block ? 'block' : 'inline-block' }}>
        <Link to={to} className={cls} aria-label={label}>
          {inner}
        </Link>
      </motion.span>
    )
  return (
    <motion.button whileTap={{ scale: 0.96 }} type={type} className={cls} onClick={onClick} disabled={disabled} aria-label={label} aria-pressed={active}>
      {inner}
    </motion.button>
  )
}

export function IconBtn({ children, onClick, label, tone = 'ghost', active, badge }: { children: ReactNode; onClick?: () => void; label: string; tone?: Tone; active?: boolean; badge?: number }) {
  return (
    <motion.button whileTap={{ scale: 0.9 }} className={`iconbtn iconbtn--${tone}${active ? ' is-active' : ''}`} onClick={onClick} aria-label={label} aria-pressed={active} title={label}>
      {children}
      {!!badge && <span className="iconbtn__badge">{badge}</span>}
    </motion.button>
  )
}

/* ------------------------------------------------------------------ */
/* Dot-and-line rules — they mark where one "thing" ends and the next begins. */

export function Rule({ label, index, variant = 'dot' }: { label?: string; index?: string; variant?: 'dot' | 'dashdot' | 'end' }) {
  return (
    <div className={`rule rule--${variant}`} role="separator">
      <span className="rule__cap" />
      <span className="rule__line" />
      {(label || index) && (
        <span className="rule__label">
          {index && <b>{index}</b>}
          {label}
        </span>
      )}
      {(label || index) && <span className="rule__line rule__line--short" />}
      <span className="rule__cap rule__cap--end" />
    </div>
  )
}

export function SectionHead({ index, title, kicker, action }: { index: string; title: string; kicker?: string; action?: ReactNode }) {
  return (
    <header className="sechead">
      <div className="sechead__meta">
        <span className="mono muted">{index}</span>
        {kicker && <span className="mono muted">{kicker}</span>}
      </div>
      <div className="sechead__row">
        <h2 className="dot-title">{title}</h2>
        {action}
      </div>
    </header>
  )
}

/* ------------------------------------------------------------------ */

export function Stars({ value, size = 14, showValue }: { value: number; size?: number; showValue?: boolean }) {
  // Unique per instance: a gradient defined inside a display:none subtree can't be referenced elsewhere.
  const uid = useId()
  return (
    <span className="stars" aria-label={`${value} su 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, value - i))
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 20 20" aria-hidden>
            <defs>
              <linearGradient id={`${uid}s${i}`}>
                <stop offset={fill} stopColor="#0a0a0a" />
                <stop offset={fill} stopColor="#d6d6d2" />
              </linearGradient>
            </defs>
            <circle cx="10" cy="10" r="7.2" fill={`url(#${uid}s${i})`} />
          </svg>
        )
      })}
      {showValue && <span className="stars__v mono">{value.toFixed(1)}</span>}
    </span>
  )
}

export function Chip({ children, active, onClick, tone }: { children: ReactNode; active?: boolean; onClick?: () => void; tone?: Tone }) {
  return (
    <motion.button whileTap={{ scale: 0.95 }} className={`chip${active ? ' is-active' : ''}${tone ? ` chip--${tone}` : ''}`} onClick={onClick} aria-pressed={active}>
      {active && <span className="chip__dot" />}
      {children}
    </motion.button>
  )
}

export function Switch({ checked, onChange, label, tone = 'account' }: { checked: boolean; onChange: (v: boolean) => void; label: string; tone?: Tone }) {
  return (
    <button role="switch" aria-checked={checked} aria-label={label} className={`switch switch--${tone}${checked ? ' is-on' : ''}`} onClick={() => onChange(!checked)}>
      <motion.span layout transition={{ type: 'spring', stiffness: 600, damping: 32 }} className="switch__knob" />
    </button>
  )
}

export function TrustBadge({ score, compact }: { score: number; compact?: boolean }) {
  const g = trustGrade(score)
  return (
    <span className={`trust trust--${g}`} title={`Affidabilità recensioni: ${score}/100`}>
      <b>{g}</b>
      {!compact && <span>recensioni {g <= 'B' ? 'affidabili' : g === 'C' ? 'da verificare' : 'sospette'}</span>}
    </span>
  )
}

export function Tag({ children, tone = 'ghost' }: { children: ReactNode; tone?: Tone | 'deal' }) {
  return <span className={`tag tag--${tone}`}>{children}</span>
}

/* ------------------------------------------------------------------ */
/* Sheet: bottom sheet on phones, side panel on desktop. */

export function Sheet({ open, onClose, title, children, side = 'right' }: { open: boolean; onClose: () => void; title: string; children: ReactNode; side?: 'right' | 'left' }) {
  const mobile = useIsMobile()
  const hidden = mobile ? { y: '100%', x: 0 } : { x: side === 'right' ? '100%' : '-100%', y: 0 }
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.documentElement.classList.add('lock')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.classList.remove('lock')
    }
  }, [open, onClose])
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            className={`sheet sheet--${side}`}
            role="dialog"
            aria-label={title}
            initial={hidden}
            animate={{ x: 0, y: 0 }}
            exit={hidden}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
          >
            <header className="sheet__head">
              <span className="sheet__grab" />
              <h3 className="mono up">{title}</h3>
              <IconBtn label="Chiudi" onClick={onClose}>
                <X size={18} />
              </IconBtn>
            </header>
            <div className="sheet__body" data-lenis-prevent>
              {children}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.7, 0.1, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function DealMeter({ score }: { score: number }) {
  const cells = 20
  return (
    <div className="dealmeter" aria-label={`Deal score ${score}/100`}>
      {Array.from({ length: cells }).map((_, i) => (
        <span key={i} className={i < Math.round((score / 100) * cells) ? 'on' : ''} />
      ))}
    </div>
  )
}

