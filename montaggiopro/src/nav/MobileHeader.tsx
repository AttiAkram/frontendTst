import { Settings } from "lucide-react"
import { C } from "../tokens"
import { RoleToggle } from "../features/RoleToggle"
import type { Role } from "../types"

interface Props { role: Role; onToggle: (r: Role) => void; page: string; onPage: (p: string) => void }

export function MobileHeader({ role, onToggle, onPage }: Props) {
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 100,
      background: C.white, borderBottom: `1px solid ${C.border}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 16px",
    }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: C.text, fontFamily: C.font }}>MontaggioPro</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <RoleToggle role={role} onToggle={onToggle} />
        <Settings size={22} color={C.text} style={{ cursor: "pointer" }} onClick={() => onPage("settings")} />
      </div>
    </div>
  )
}
