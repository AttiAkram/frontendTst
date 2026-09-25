import { useState, useCallback } from "react"
import { API_BASE, AUTH_STORAGE_KEY } from "../config/api"

interface MutationResult<T> {
  mutate: (body?: unknown) => Promise<T>
  loading: boolean
  error: string | null
}

export function useMutation<T>(endpoint: string, method: "POST" | "PUT" | "DELETE" = "POST"): MutationResult<T> {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutate = useCallback(async (body?: unknown): Promise<T> => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem(AUTH_STORAGE_KEY)
      const headers: Record<string, string> = { "Content-Type": "application/json" }
      if (token) headers["Authorization"] = `Bearer ${token}`
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      return json as T
    } catch (e) {
      const msg = (e as Error).message
      setError(msg)
      throw e
    } finally {
      setLoading(false)
    }
  }, [endpoint, method])

  return { mutate, loading, error }
}
