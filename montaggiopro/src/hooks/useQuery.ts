import { useState, useEffect, useCallback } from "react"
import { API_BASE, TOKEN_KEY } from "../config/api"

// Legge un cookie per nome
function getCookie(name: string): string | null {
  const m = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return m ? decodeURIComponent(m[2]) : null
}

// Header autenticati per Django (JWT + CSRF)
export function buildHeaders(method = "GET"): HeadersInit {
  const token = localStorage.getItem(TOKEN_KEY)
  const csrf  = getCookie("csrftoken")
  const h: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept":       "application/json",
  }
  if (token)              h["Authorization"] = `Bearer ${token}`
  if (csrf && method !== "GET") h["X-CSRFToken"] = csrf
  return h
}

export function useQuery<T = unknown>(
  endpoint: string | null,
  deps: unknown[] = [],
) {
  const [data,    setData]    = useState<T | null>(null)
  const [loading, setLoading] = useState(!!endpoint)
  const [error,   setError]   = useState<string | null>(null)

  const fetch_ = useCallback(async () => {
    if (!endpoint) { setLoading(false); return }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method:      "GET",
        headers:     buildHeaders("GET"),
        credentials: "include", // necessario per i cookie Django
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.detail ?? body.message ?? `HTTP ${res.status}`)
      }
      const json = await res.json()
      // DRF restituisce { count, results } per le liste paginate
      setData((json.results ?? json) as T)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Errore sconosciuto")
    } finally {
      setLoading(false)
    }
  }, [endpoint, ...deps]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetch_() }, [fetch_])

  return { data, loading, error, refetch: fetch_ }
}
