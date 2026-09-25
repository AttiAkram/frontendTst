import { SlidersHorizontal, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filters } from '../components/Filters'
import { InfiniteGrid } from '../components/InfiniteGrid'
import { Btn, Rule, Sheet } from '../components/ui'
import { CATEGORIES } from '../data/catalog'
import type { CatalogQuery, CategoryId, SortKey } from '../data/types'
import { useStore } from '../store/store'

const SORTS: [SortKey, string][] = [
  ['relevance', 'Rilevanza'],
  ['deal', 'Miglior affare'],
  ['price-asc', 'Prezzo ↑'],
  ['price-desc', 'Prezzo ↓'],
  ['rating', 'Valutazione'],
  ['reviews', 'Più recensiti'],
  ['newest', 'Novità'],
  ['unit', 'Prezzo unitario'],
]

function parse(sp: URLSearchParams): CatalogQuery {
  const num = (k: string) => (sp.get(k) ? Number(sp.get(k)) : undefined)
  const bool = (k: string) => (sp.get(k) === '1' ? true : undefined)
  return {
    q: sp.get('q') ?? undefined,
    category: (sp.get('category') as CategoryId) ?? 'all',
    brands: sp.get('brands')?.split(',').filter(Boolean),
    min: num('min'),
    max: num('max'),
    rating: num('rating'),
    fast: bool('fast'),
    deals: bool('deals'),
    trusted: bool('trusted'),
    hideSponsored: bool('hideSponsored'),
    sort: (sp.get('sort') as SortKey) ?? 'relevance',
  }
}

function serialize(q: CatalogQuery) {
  const sp = new URLSearchParams()
  Object.entries(q).forEach(([k, v]) => {
    if (v == null || v === '' || v === 'all' || v === false || (k === 'sort' && v === 'relevance')) return
    if (Array.isArray(v)) v.length && sp.set(k, v.join(','))
    else sp.set(k, v === true ? '1' : String(v))
  })
  return sp
}

export function Shop() {
  const [sp, setSp] = useSearchParams()
  const q = useMemo(() => parse(sp), [sp])
  const ext = useStore((s) => s.extensions)
  const [open, setOpen] = useState(false)
  const [total, setTotal] = useState<number | null>(null)
  const set = (patch: Partial<CatalogQuery>) => setSp(serialize({ ...q, ...patch }), { replace: true })
  const effective = { ...q, hideSponsored: q.hideSponsored || ext.hideSponsored }
  const cat = CATEGORIES.find((c) => c.id === q.category)
  const title = q.q ? `“${q.q}”` : q.deals ? 'Offerte vere' : cat?.label ?? 'Tutto'

  const active: [string, () => void][] = []
  if (q.q) active.push([`“${q.q}”`, () => set({ q: undefined })])
  if (cat) active.push([cat.label, () => set({ category: 'all' })])
  q.brands?.forEach((b) => active.push([b, () => set({ brands: q.brands!.filter((x) => x !== b) })]))
  if (q.min != null || q.max != null) active.push([`${q.min ?? 0}–${q.max ?? '∞'} €`, () => set({ min: undefined, max: undefined })])
  if (q.rating) active.push([`${q.rating}★+`, () => set({ rating: undefined })])
  if (q.fast) active.push(['Domani', () => set({ fast: undefined })])
  if (q.deals) active.push(['Vere offerte', () => set({ deals: undefined })])
  if (q.trusted) active.push(['Affidabili', () => set({ trusted: undefined })])
  if (q.hideSponsored) active.push(['No sponsor', () => set({ hideSponsored: undefined })])

  return (
    <div className="container shop">
      <aside className="shop__side" data-lenis-prevent>
        <p className="mono up small muted">Filtri</p>
        <Filters q={q} set={set} />
      </aside>
      <section className="shop__main">
        <header className="shop__head">
          <div>
            <p className="mono small muted">
              Shop / {cat?.label ?? 'Tutto'} {total != null && `· ${total} risultati`}
            </p>
            <h1 className="dot-title shop__title">{title}</h1>
          </div>
          <div className="shop__tools">
            <Btn size="sm" className="shop__filterbtn" icon={<SlidersHorizontal size={14} />} onClick={() => setOpen(true)}>
              Filtri{active.length ? ` · ${active.length}` : ''}
            </Btn>
            <label className="select">
              <span className="mono small muted">Ordina</span>
              <select value={q.sort} onChange={(e) => set({ sort: e.target.value as SortKey })}>
                {SORTS.filter(([k]) => k !== 'unit' || ext.unitPrice).map(([k, l]) => (
                  <option key={k} value={k}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </header>
        {active.length > 0 && (
          <div className="chips shop__active">
            {active.map(([l, rm]) => (
              <button key={l} className="chip is-active" onClick={rm}>
                {l} <X size={12} />
              </button>
            ))}
            <button className="chip chip--link" onClick={() => setSp(new URLSearchParams(), { replace: true })}>
              Azzera
            </button>
          </div>
        )}
        <Rule variant="dashdot" />
        <InfiniteGrid query={effective} onTotal={setTotal} />
      </section>
      <Sheet open={open} onClose={() => setOpen(false)} title="Filtri" side="left">
        <Filters q={q} set={set} />
        <div className="sheet__cta">
          <Btn tone="ink" block onClick={() => setOpen(false)}>
            Mostra {total ?? ''} risultati
          </Btn>
        </div>
      </Sheet>
    </div>
  )
}
