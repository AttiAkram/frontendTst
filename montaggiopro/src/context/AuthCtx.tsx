import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import { API_BASE, TOKEN_KEY, REFRESH_KEY, EP } from "../config/api"
import { DjangoUser } from "../types"

interface LoginPayload    { email: string; password: string }
interface RegisterPayload { email: string; password: string; first_name: string; last_name: string; birthday: string; sex: "Male" | "Female" }

interface AuthCtxType {
  user:     DjangoUser | null
  loading:  boolean
  login:    (p: LoginPayload)    => Promise<DjangoUser>
  logout:   ()                   => Promise<void>
  register: (p: RegisterPayload) => Promise<void>
  refresh:  ()                   => Promise<boolean>
}

const AuthCtx = createContext<AuthCtxType | null>(null)
export const useAuth = () => useContext(AuthCtx)!

function getCookie(name: string): string | null {
  const m = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return m ? decodeURIComponent(m[2]) : null
}

async function apiFetch(path: string, method = "GET", body?: unknown) {
  const token = localStorage.getItem(TOKEN_KEY)
  const csrf  = getCookie("csrftoken")
  const h: Record<string, string> = { "Content-Type": "application/json", "Accept": "application/json" }
  if (token)              h["Authorization"] = `Bearer ${token}`
  if (csrf && method !== "GET") h["X-CSRFToken"] = csrf

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers:     h,
    credentials: "include",
    body:        body !== undefined ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail ?? err.email?.[0] ?? err.password?.[0] ?? `HTTP ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<DjangoUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) { setLoading(false); return }
    apiFetch(EP.me)
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async ({ email, password }: LoginPayload) => {
    const data = await apiFetch(EP.login, "POST", { email, password })
    localStorage.setItem(TOKEN_KEY,   data.access_token)
    localStorage.setItem(REFRESH_KEY, data.refresh_token)
    const me = await apiFetch(EP.me)
    setUser(me)
    return me as DjangoUser
  }, [])

  const logout = useCallback(async () => {
    await apiFetch(EP.logout, "DELETE").catch(() => {})
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_KEY)
    setUser(null)
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    await apiFetch(EP.register, "POST", payload)
    // Il backend manda email di conferma — l'utente deve confermare prima del login
  }, [])

  const refresh = useCallback(async (): Promise<boolean> => {
    const rt = localStorage.getItem(REFRESH_KEY)
    if (!rt) return false
    try {
      const data = await apiFetch(EP.refreshToken, "POST", { refresh: rt })
      localStorage.setItem(TOKEN_KEY, data.access)
      return true
    } catch {
      logout()
      return false
    }
  }, [logout])

  return (
    <AuthCtx.Provider value={{ user, loading, login, logout, register, refresh }}>
      {children}
    </AuthCtx.Provider>
  )
}
