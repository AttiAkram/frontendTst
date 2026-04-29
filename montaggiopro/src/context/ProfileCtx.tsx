import { createContext, useContext } from "react"
import { Profile } from "../types"

interface ProfileCtxType {
  profile:       Profile
  updateProfile: (p: Profile) => void
}

export const ProfileCtx = createContext<ProfileCtxType | null>(null)
export const useProfile = () => useContext(ProfileCtx)!
