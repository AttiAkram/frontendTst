import { ALL_BRANDS, CATEGORIES, PRODUCTS } from '../data/catalog'
import { Track } from './Signal'
import type { CatalogQuery } from '../data/types'
import { Chip, Rule, Stars, Switch } from './ui'

const PRICE_STEPS: [string, number | undefined, number | undefined][] = [
  ['Tutti', undefined, undefined],
  ['< 50 €', undefined, 50],
  ['50–150 €', 50, 150],
  ['150–500 €', 150, 500],
  ['> 500 €', 500, undefined],
]

/** Which filter groups are in use — shared by the meter and the mobile "Filtri" button. */
export function filterGroups(q: CatalogQuery): [string, boolean][] {
  return [
    ['Categoria', !!q.category && q.category !== 'all'],
    ['Prezzo', q.min != null || q.max != null],
    ['Voto', !!q.rating],
    ['Marca', !!q.brands?.length],
    ['Opzioni', !!(q.fast || q.deals || q.trusted || q.hideSponsored)],
  ]
}

/** Dot per filter group + a line showing how much of the catalog the filters have excluded. */
export function FilterMeter({ q, results }: { q: CatalogQuery; results: number | null }) {
  const groups = filterGroups(q)
  const on = groups.filter(([, v]) => v).length
  const narrowed = results == null ? 0 : 1 - results / PRODUCTS.length
  return (
    <div className="fmeter">
      <Track
        value={narrowed}
        goal={false}
        marks={groups.map(([, v], i) => ({ at: (i + 1) / (groups.length + 1), done: v }))}
        label={on ? `${on} di ${groups.length} filtri attivi` : 'Nessun filtro'}
        aside={results == null ? '…' : `${results} risultati · −${Math.round(narrowed * 100)}%`}
        ariaLabel="Quanto hai ristretto il catalogo"
      />
      <div className="fmeter__groups">
        {groups.map(([l, v]) => (
          <span key={l} className={v ? 'is-on' : ''}>
            {l}
          </span>
        ))}
      </div>
    </div>
  )
}

export function Filters({ q, set, results = null }: { q: CatalogQuery; set: (patch: Partial<CatalogQuery>) => void; results?: number | null }) {
  const brands = q.brands ?? []
  return (
    <div className="filters">
      <FilterMeter q={q} results={results} />
      <section>
        <h4 className="mono up muted">Categoria</h4>
        <div className="chips">
          <Chip active={!q.category || q.category === 'all'} onClick={() => set({ category: 'all' })}>
            Tutto
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c.id} active={q.category === c.id} onClick={() => set({ category: c.id })}>
              {c.label}
            </Chip>
          ))}
        </div>
      </section>
      <Rule variant="dashdot" />
      <section>
        <h4 className="mono up muted">Prezzo</h4>
        <div className="chips">
          {PRICE_STEPS.map(([l, min, max]) => (
            <Chip key={l} active={q.min === min && q.max === max} onClick={() => set({ min, max })}>
              {l}
            </Chip>
          ))}
        </div>
        <div className="range2">
          <label>
            <span className="mono small muted">min</span>
            <input type="number" inputMode="numeric" value={q.min ?? ''} placeholder="0" onChange={(e) => set({ min: e.target.value ? +e.target.value : undefined })} />
          </label>
          <span className="range2__dash" />
          <label>
            <span className="mono small muted">max</span>
            <input type="number" inputMode="numeric" value={q.max ?? ''} placeholder="∞" onChange={(e) => set({ max: e.target.value ? +e.target.value : undefined })} />
          </label>
        </div>
      </section>
      <Rule variant="dashdot" />
      <section>
        <h4 className="mono up muted">Valutazione</h4>
        <div className="stack-sm">
          {[4.5, 4, 3.5, 0].map((r) => (
            <button key={r} className={`radio-row${(q.rating ?? 0) === r ? ' is-active' : ''}`} onClick={() => set({ rating: r || undefined })}>
              <span className="radio" />
              {r ? (
                <>
                  <Stars value={r} size={12} /> <span className="small">e più</span>
                </>
              ) : (
                <span className="small">Qualsiasi</span>
              )}
            </button>
          ))}
        </div>
      </section>
      <Rule variant="dashdot" />
      <section>
        <h4 className="mono up muted">Marca</h4>
        <div className="chips">
          {ALL_BRANDS.map((b) => (
            <Chip key={b} active={brands.includes(b)} onClick={() => set({ brands: brands.includes(b) ? brands.filter((x) => x !== b) : [...brands, b] })}>
              {b}
            </Chip>
          ))}
        </div>
      </section>
      <Rule variant="dashdot" />
      <section className="stack-sm">
        <h4 className="mono up muted">Opzioni</h4>
        <ToggleRow label="Consegna domani" checked={!!q.fast} onChange={(v) => set({ fast: v || undefined })} />
        <ToggleRow label="Solo vere offerte" hint="Sconto reale su mediana 90gg" checked={!!q.deals} onChange={(v) => set({ deals: v || undefined })} />
        <ToggleRow label="Recensioni affidabili" hint="Voto A o B" checked={!!q.trusted} onChange={(v) => set({ trusted: v || undefined })} />
        <ToggleRow label="Nascondi sponsorizzati" checked={!!q.hideSponsored} onChange={(v) => set({ hideSponsored: v || undefined })} />
      </section>
    </div>
  )
}

function ToggleRow({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="toggle-row">
      <div>
        <div className="small strong">{label}</div>
        {hint && <div className="mono small muted">{hint}</div>}
      </div>
      <Switch checked={checked} onChange={onChange} label={label} tone="ink" />
    </div>
  )
}
