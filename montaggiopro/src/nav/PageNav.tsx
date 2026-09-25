import { motion } from 'motion/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Fragment, type ReactNode } from 'react'
import { Link, Navigate, useLocation, useSearchParams } from 'react-router-dom'
import { cartCount, useStore } from '../store/store'
import { type NodeId, NODES, backOf, flowOf, forwardOf, guardRedirect, resolve, trail } from './map'

/**
 * Back · trail · Forward, drawn from the navigation map.
 * The trail is a dot-line: one dot per level, the current page is the ring at the end.
 */
export function PageNav() {
  const { pathname } = useLocation()
  const [search] = useSearchParams()
  const lastListing = useStore((s) => s.lastListing)
  const count = useStore(cartCount)
  const loggedIn = useStore((s) => !!s.user)
  const r = resolve(pathname)
  if (!r || r.node.id === 'home') return null

  const ctx = { search, lastListing }
  const crumbs = trail(r, ctx)
  const back = backOf(r, ctx)
  const fwd = forwardOf(r, { cartCount: count, loggedIn, next: search.get('next') })
  const f = flowOf(r.node.id)

  return (
    <nav className="pagenav container" aria-label="Percorso">
      <div className="pagenav__side">
        {back && (
          <Link to={back.to} className="pagenav__move pagenav__move--back" title={`Indietro: ${back.label}`}>
            <ArrowLeft size={16} />
            <span>{back.label}</span>
          </Link>
        )}
      </div>

      <ol className="crumbs-line">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1
          return (
            <Fragment key={`${c.to}-${i}`}>
              <li className={last ? 'is-current' : ''}>
                <span className="crumbs-line__dot" />
                {last ? <span aria-current="page">{c.label}</span> : <Link to={c.to}>{c.label}</Link>}
              </li>
              {!last && <li className="crumbs-line__seg" aria-hidden />}
            </Fragment>
          )
        })}
        {f && (
          <li className="crumbs-line__flow" aria-label={`Passo ${f.index + 1} di ${f.flow.steps.length}`}>
            {f.flow.steps.map((s, i) => (
              <span key={s} className={i < f.index ? 'is-done' : i === f.index ? 'is-now' : ''} title={NODES[s].title} />
            ))}
          </li>
        )}
      </ol>

      <div className="pagenav__side pagenav__side--end">
        {fwd && (
          <motion.span initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
            <Link to={fwd.to} className="pagenav__move pagenav__move--fwd" title={`Avanti: ${fwd.label}`}>
              <span>{fwd.label}</span>
              <ArrowRight size={16} />
            </Link>
          </motion.span>
        )}
      </div>
    </nav>
  )
}

/** Enforces the node's guard from the map (cart needed, login needed, guests only). */
export function Guarded({ id, children }: { id: NodeId; children: ReactNode }) {
  const { pathname, search } = useLocation()
  const count = useStore(cartCount)
  const loggedIn = useStore((s) => !!s.user)
  const to = guardRedirect(NODES[id].guard, { cartCount: count, loggedIn }, pathname + search)
  return to ? <Navigate to={to} replace /> : <>{children}</>
}
