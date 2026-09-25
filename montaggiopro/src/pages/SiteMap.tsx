import { ArrowRight, ArrowLeftRight, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/ui'
import { PRODUCTS } from '../data/catalog'
import { FLOWS, NODES, type NavNode, type NodeId, pathOf } from '../nav/map'

const GUARD_LABEL = { cart: 'serve il carrello pieno → Carrello', auth: 'serve l’accesso → Accedi e torna qui', guest: 'solo ospiti → Account' }

/** The navigation map rendered from nav/map.ts — what's here is exactly what the app does. */
export function SiteMap() {
  const flowSteps = new Set<NodeId>(Object.values(FLOWS).flatMap((f) => [...f.steps]))
  const children = (id: NodeId) => Object.values(NODES).filter((n) => n.parent === id && !flowSteps.has(n.id))
  const example = (n: NavNode) => (n.path.includes(':id') ? (n.id === 'product' ? pathOf('product', { id: PRODUCTS[8].id }) : null) : pathOf(n.id))

  const Node = ({ n, depth }: { n: NavNode; depth: number }) => {
    const kids = children(n.id)
    const flows = Object.values(FLOWS).filter((f) => f.entry === n.id)
    const href = example(n)
    return (
      <li className={`smap__node smap__node--d${depth}`}>
        <div className="smap__card">
          <span className="smap__dot" />
          <div className="smap__head">
            {href ? (
              <Link to={href} className="smap__title">
                {n.title}
              </Link>
            ) : (
              <span className="smap__title">{n.title}</span>
            )}
            <code>{n.path}</code>
          </div>
          <p className="smap__purpose">{n.purpose}</p>
          <div className="smap__links">
            {n.forward && (
              <span className="smap__chip smap__chip--fwd">
                <ArrowRight size={12} /> {NODES[n.forward].title}
              </span>
            )}
            {n.sideways?.map((s) => (
              <span key={s} className="smap__chip">
                <ArrowLeftRight size={12} /> {NODES[s].title}
              </span>
            ))}
            {n.guard && (
              <span className="smap__chip smap__chip--guard">
                <Lock size={12} /> {GUARD_LABEL[n.guard]}
              </span>
            )}
          </div>
        </div>
        {flows.map((f) => (
          <div key={f.title} className="smap__flow">
            <p className="smap__flowtitle">Flusso · {f.title}</p>
            <ol>
              {[...f.steps, f.exit].map((s, i, all) => (
                <li key={s} className={s === f.exit ? 'is-exit' : ''}>
                  <span className="smap__stepdot">{s === f.exit ? '✓' : i + 1}</span>
                  <span className="smap__steptitle">{NODES[s].title}</span>
                  <code>{NODES[s].path}</code>
                  {i < all.length - 1 && <span className="smap__steparrow" aria-hidden />}
                </li>
              ))}
            </ol>
          </div>
        ))}
        {kids.length > 0 && (
          <ul className="smap__children">
            {kids.map((k) => (
              <Node key={k.id} n={k} depth={depth + 1} />
            ))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <div className="container section smap">
      <header className="stitle">
        <div>
          <p className="eyebrow">Architettura dell’informazione</p>
          <h1 className="display display--sm">Mappa del sito</h1>
        </div>
      </header>

      <div className="smap__rules">
        {[
          ['Indietro', 'Dentro un flusso torna al passo precedente. Da un prodotto torna ai risultati con gli stessi filtri. Altrimenti sale di un livello nell’albero.'],
          ['Avanti', 'Ogni pagina ha al massimo un’uscita principale (freccia →), mostrata solo quando ha senso: es. “Carrello (2)” se hai articoli.'],
          ['Di lato', 'Collegamenti allo stesso livello (⇄): preferiti, confronto, carrello.'],
          ['Guardie', 'Checkout senza carrello → Carrello. Account senza accesso → Accedi, poi ritorno qui. Dopo il pagamento Indietro non riapre il pagamento.'],
        ].map(([t, d], i) => (
          <Reveal key={t} delay={i * 0.05} className="smap__rule">
            <strong>{t}</strong>
            <p>{d}</p>
          </Reveal>
        ))}
      </div>

      <ul className="smap__tree">
        <Node n={NODES.home} depth={0} />
      </ul>
      <p className="small muted smap__foot">Generata da <code>src/nav/map.ts</code>: le rotte, il percorso in alto e i pulsanti Indietro/Avanti usano la stessa mappa.</p>
    </div>
  )
}
