import { useState } from "react"
import { Home, Briefcase, Calendar, MessageCircle, User, Settings, Search, PlusSquare, List, Building2 } from "lucide-react"
import { C } from "../tokens"
import { Divider } from "../components/Divider"
import { RoleToggle } from "../features/RoleToggle"
import type { Role } from "../types"
import type { LucideIcon } from "lucide-react"

interface Props { page: string; onPage: (p: string) => void; role: Role; onToggle: (r: Role) => void }

const NAV_SQUADRA: [LucideIcon, string, string][] = [
  [Home, "Feed", "feed"], [Briefcase, "Bacheca", "bacheca"], [Calendar, "Calendario", "calendar"],
  [MessageCircle, "Messaggi", "messages"], [User, "Profilo", "profile"],
]
const NAV_NEGOZIO: [LucideIcon, string, string][] = [
  [Search, "Cerca", "search"], [PlusSquare, "Pubblica", "post"], [List, "Annunci", "listings"],
  [MessageCircle, "Messaggi", "messages"], [Building2, "Profilo", "profile"],
]

function NavItem({ icon: Icon, label, active, onClick }: { icon: LucideIcon; label: string; active: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
      display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 16px",
      borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14,
      fontWeight: active ? 600 : 400, fontFamily: C.font,
      color: active ? C.accent : C.text,
      background: hovered ? "#F0F9FF" : "transparent",
      transition: "background 200ms",
    }}>
      <Icon size={20} strokeWidth={active ? 2.5 : 2} />
      {label}
    </button>
  )
}

export function Sidebar({ page, onPage, role, onToggle }: Props) {
  const items = role === "squadra" ? NAV_SQUADRA : NAV_NEGOZIO
  return (
    <div style={{
      position: "fixed", left: 0, top: 0, bottom: 0, width: 240,
      background: C.white, borderRight: `1px solid ${C.border}`,
      display: "flex", flexDirection: "column", padding: 16, zIndex: 100,
    }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: C.text, fontFamily: C.font, padding: "8px 16px" }}>MontaggioPro</div>
      <div style={{ padding: "8px 16px 16px" }}><RoleToggle role={role} onToggle={onToggle} /></div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {items.map(([icon, label, key]) => (
          <NavItem key={key} icon={icon} label={label} active={page === key} onClick={() => onPage(key)} />
        ))}
      </div>
      <Divider my={8} />
      <NavItem icon={Settings} label="Impostazioni" active={page === "settings"} onClick={() => onPage("settings")} />
    </div>
  )
}
