import { useState, useEffect, useCallback } from "react"
import { API_BASE, AUTH_STORAGE_KEY } from "../config/api"

interface QueryResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useQuery<T>(endpoint: string | null, deps: unknown[] = []): QueryResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetch_ = useCallback(async () => {
    if (!endpoint) return
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem(AUTH_STORAGE_KEY)
      const headers: Record<string, string> = {}
      if (token) headers["Authorization"] = `Bearer ${token}`
      const res = await fetch(`${API_BASE}${endpoint}`, { headers })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setData(json)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, ...deps])

  useEffect(() => { fetch_() }, [fetch_])

  return { data, loading, error, refetch: fetch_ }
}
