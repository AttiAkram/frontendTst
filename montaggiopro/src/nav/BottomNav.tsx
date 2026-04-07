import { Home, Briefcase, MessageCircle, User, Search, PlusSquare, List, Building2 } from "lucide-react"
import { C } from "../tokens"
import type { Role } from "../types"
import type { LucideIcon } from "lucide-react"

interface Props { page: string; onPage: (p: string) => void; role: Role }

const NAV_SQUADRA: [LucideIcon, string, string][] = [
  [Home, "Feed", "feed"], [Briefcase, "Bacheca", "bacheca"],
  [MessageCircle, "Messaggi", "messages"], [User, "Profilo", "profile"],
]
const NAV_NEGOZIO: [LucideIcon, string, string][] = [
  [Search, "Cerca", "search"], [PlusSquare, "Pubblica", "post"],
  [MessageCircle, "Messaggi", "messages"], [Building2, "Profilo", "profile"],
]

export function BottomNav({ page, onPage, role }: Props) {
  const items = role === "squadra" ? NAV_SQUADRA : NAV_NEGOZIO
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: C.white, borderTop: `1px solid ${C.border}`,
      display: "flex", justifyContent: "space-around", zIndex: 100,
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
    }}>
      {items.map(([Icon, label, key]) => (
        <button key={key} onClick={() => onPage(key)} style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
          padding: "8px 0", border: "none", background: "transparent", cursor: "pointer",
          color: page === key ? C.accent : C.sub, fontSize: 10, fontFamily: C.font,
          flex: 1,
        }}>
          <Icon size={22} strokeWidth={page === key ? 2.5 : 2} />
          {label}
        </button>
      ))}
    </div>
  )
}
