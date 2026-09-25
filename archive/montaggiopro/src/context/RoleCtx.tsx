import { createContext, useContext } from "react"
import type { Role } from "../types"

interface RoleCtxValue {
  role: Role
  setRole: (r: Role) => void
}

export const RoleCtx = createContext<RoleCtxValue>({ role: "squadra", setRole: () => {} })
export const useRole = () => useContext(RoleCtx)
