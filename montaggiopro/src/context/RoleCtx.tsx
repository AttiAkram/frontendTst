import { createContext, useContext } from "react"
import { Role } from "../types"

export const RoleCtx = createContext<Role>("squadra")
export const useRole = () => useContext(RoleCtx)
