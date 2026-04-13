import { useState } from "react"
import { Home, Briefcase, Calendar, MessageCircle, User, Settings, Search, PlusSquare, List, Building2 } from "lucide-react"
import { C } from "../tokens"
import { RoleToggle } from "../features/RoleToggle"
import type { Role } from "../types"
import type { LucideIcon } from "lucide-react"

interface Props { page: string; onPage: (p: string) => void; role: Role; onToggle: (r: Role) => void }

const NAV_SQUADRA: [LucideIcon, string, string][] = [
  [Home, "Home", "feed"], [Briefcase, "Bacheca lavori", "bacheca"], [Calendar, "Calendario", "calendar"],
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
      display: "flex", alignItems: "center", gap: 20, width: "100%", padding: "8px 12px",
      borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13,
      fontWeight: active ? 600 : 400, fontFamily: C.font,
      color: C.text,
      background: hovered ? C.bg : "transparent",
      transition: "background 150ms",
    }}>
      <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
      {label}
    </button>
  )
}

export function Sidebar({ page, onPage, role, onToggle }: Props) {
  const items = role === "squadra" ? NAV_SQUADRA : NAV_NEGOZIO
  return (
    <nav style={{
      position: "fixed", left: 0, top: 0, bottom: 0, width: 220,
      background: C.white, borderRight: `1px solid ${C.border}`,
      display: "flex", flexDirection: "column", padding: "16px 12px", zIndex: 100,
    }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: C.text, fontFamily: C.font, padding: "4px 12px 12px", letterSpacing: -0.3 }}>
        MontaggioPro
      </div>
      <div style={{ padding: "0 12px 12px" }}><RoleToggle role={role} onToggle={onToggle} /></div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
        {items.map(([icon, label, key]) => (
          <NavItem key={key} icon={icon} label={label} active={page === key} onClick={() => onPage(key)} />
        ))}
      </div>
      <div style={{ height: 1, background: C.border, margin: "8px 0" }} />
      <NavItem icon={Settings} label="Impostazioni" active={page === "settings"} onClick={() => onPage("settings")} />
    </nav>
  )
}
