import { Settings } from "lucide-react"
import { C } from "../tokens"
import { RoleToggle } from "../features/RoleToggle"
import type { Role } from "../types"

interface Props { role: Role; onToggle: (r: Role) => void; page: string; onPage: (p: string) => void }

export function MobileHeader({ role, onToggle, onPage }: Props) {
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 100,
      background: C.white, borderBottom: `1px solid ${C.border}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "8px 12px", height: 48,
    }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: C.text, fontFamily: C.font, letterSpacing: -0.3 }}>
        MontaggioPro
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <RoleToggle role={role} onToggle={onToggle} />
        <button onClick={() => onPage("settings")} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
          <Settings size={20} color={C.text} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  )
}
