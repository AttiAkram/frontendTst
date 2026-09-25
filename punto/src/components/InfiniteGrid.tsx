import { useEffect, useRef, useState } from 'react'
import { listProducts } from '../api/client'
import type { CatalogQuery, Product } from '../data/types'
import { ProductCard, ProductCardSkeleton } from './ProductCard'
import { Rule } from './ui'

/** Auto-loading product grid: fetches the next page when the sentinel scrolls into view. */
export function InfiniteGrid({ query, onTotal }: { query: CatalogQuery; onTotal?: (n: number) => void }) {
  const key = JSON.stringify(query)
  const [items, setItems] = useState<Product[]>([])
  const [next, setNext] = useState<number | null>(0)
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState<number | null>(null)
  const sentinel = useRef<HTMLDivElement>(null)
  const reqId = useRef(0)

  useEffect(() => {
    setItems([])
    setNext(0)
    setTotal(null)
  }, [key])

  useEffect(() => {
    const el = sentinel.current
    if (!el || next == null || loading) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        const id = ++reqId.current
        setLoading(true)
        listProducts({ ...query, offset: next, limit: 12 }).then((page) => {
          if (id !== reqId.current) return
          setItems((prev) => (next === 0 ? page.items : [...prev, ...page.items]))
          setNext(page.nextOffset)
          setTotal(page.total)
          onTotal?.(page.total)
          setLoading(false)
        })
      },
      { rootMargin: '600px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, next, loading])

  // A query change mid-request must not leave the spinner stuck.
  useEffect(() => {
    reqId.current++
    setLoading(false)
  }, [key])

  return (
    <>
      <div className="grid">
        {items.map((p, i) => (
          <ProductCard key={p.id} p={p} index={i} />
        ))}
        {(loading || next === 0) && Array.from({ length: items.length ? 4 : 8 }).map((_, i) => <ProductCardSkeleton key={`sk${i}`} />)}
      </div>
      <div ref={sentinel} className="sentinel" />
      {total === 0 && (
        <div className="empty">
          <p className="dot-title">Nessun risultato</p>
          <p className="muted">Prova a togliere qualche filtro.</p>
        </div>
      )}
      {next == null && total != null && total > 0 && <Rule variant="end" label={`Fine · ${total} prodotti`} />}
    </>
  )
}
