import { motion } from 'motion/react'
import { PackageCheck } from 'lucide-react'
import { useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { Btn } from '../components/ui'
import { money } from '../lib/format'
import { useStore } from '../store/store'

/** Terminal node of the checkout flow. Reached with `replace`, so Back never re-opens the payment. */
export function Order() {
  const { id } = useParams()
  const state = (useLocation().state ?? {}) as { eta?: string; total?: number; placed?: boolean }
  const loggedIn = useStore((s) => !!s.user)
  const clearCart = useStore((s) => s.clearCart)
  useEffect(() => {
    if (state.placed) clearCart()
  }, [state.placed, clearCart])
  const eta = state.eta ? new Date(state.eta) : null
  const stages = ['Ordine ricevuto', 'Pagamento confermato', 'In preparazione', 'Spedito', 'Consegnato']
  return (
    <div className="container success">
      <motion.div className="success__badge" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
        <PackageCheck size={42} />
      </motion.div>
      <h1 className="dot-title">Fatto.</h1>
      <p className="muted">
        Ordine <b className="mono">{id}</b>
        {state.total != null && ` · ${money(state.total)}`}
        {eta && ` · arrivo previsto ${eta.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}`}
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
        <Btn to={loggedIn ? '/account' : '/login?next=/account'} tone="account">
          I miei ordini
        </Btn>
        <Btn to="/shop">Continua lo shopping</Btn>
      </div>
    </div>
  )
}
