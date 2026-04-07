import { createContext, useContext } from "react"
import type { Profile } from "../types"

interface ProfileCtxValue {
  profile: Profile
  updateProfile: (p: Profile) => void
}

export const ProfileCtx = createContext<ProfileCtxValue>(null!)
export const useProfile = () => useContext(ProfileCtx)
