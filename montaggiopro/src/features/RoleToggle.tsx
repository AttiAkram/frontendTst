import { C } from "../tokens"
import type { Role } from "../types"

interface Props { role: Role; onToggle: (r: Role) => void }

export function RoleToggle({ role, onToggle }: Props) {
  return (
    <div style={{ display: "flex", background: C.bg, borderRadius: 8, padding: 2 }}>
      {(["squadra", "negozio"] as const).map(r => (
        <button key={r} onClick={() => onToggle(r)} style={{
          padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 500,
          fontFamily: C.font, border: "none", cursor: "pointer",
          background: role === r ? C.white : "transparent",
          color: role === r ? C.text : C.sub,
          transition: "all 150ms",
        }}>
          {r === "squadra" ? "Squadra" : "Negozio"}
        </button>
      ))}
    </div>
  )
}
