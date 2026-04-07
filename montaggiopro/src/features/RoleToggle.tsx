import { C } from "../tokens"
import type { Role } from "../types"

interface Props { role: Role; onToggle: (r: Role) => void }

export function RoleToggle({ role, onToggle }: Props) {
  return (
    <div style={{
      display: "flex", background: C.bg, borderRadius: 20, padding: 3,
      border: `1px solid ${C.border}`,
    }}>
      {(["squadra", "negozio"] as const).map(r => (
        <button key={r} onClick={() => onToggle(r)} style={{
          padding: "6px 14px", borderRadius: 18, fontSize: 12, fontWeight: 600,
          fontFamily: C.font, border: "none", cursor: "pointer",
          background: role === r ? C.white : "transparent",
          color: role === r ? C.text : C.sub,
          transition: "background 200ms, color 200ms",
        }}>
          {r === "squadra" ? "Squadra" : "Negozio"}
        </button>
      ))}
    </div>
  )
}
