import { useState, useCallback } from "react"
import { API_BASE } from "../config/api"
import { buildHeaders } from "./useQuery"

type Method = "POST" | "PUT" | "PATCH" | "DELETE"

export function useMutation<T = unknown>(
  endpoint: string,
  method: Method = "POST",
) {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  const mutate = useCallback(async (body?: unknown): Promise<T> => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers:     buildHeaders(method),
        credentials: "include",
        body:        body !== undefined ? JSON.stringify(body) : undefined,
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail ?? err.message ?? `HTTP ${res.status}`)
      }
      if (res.status === 204) return undefined as T
      return await res.json() as T
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Errore sconosciuto"
      setError(msg)
      throw e
    } finally {
      setLoading(false)
    }
  }, [endpoint, method])

  return { mutate, loading, error }
}
