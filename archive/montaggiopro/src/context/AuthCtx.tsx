import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { API_BASE, AUTH_STORAGE_KEY } from "../config/api"
import { EP } from "../config/api"

interface User { email: string; name: string }

interface AuthCtxValue {
  user: User | null
  loading: boolean
  login: (email: string, pass: string) => Promise<void>
  logout: () => Promise<void>
}

const Ctx = createContext<AuthCtxValue>(null!)
export const useAuth = () => useContext(Ctx)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (email: string, pass: string) => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}${EP.login}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      localStorage.setItem(AUTH_STORAGE_KEY, data.token)
      setUser({ email, name: data.name })
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    const token = localStorage.getItem(AUTH_STORAGE_KEY)
    try {
      await fetch(`${API_BASE}${EP.logout}`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
    } finally {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      setUser(null)
    }
  }, [])

  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>
}
