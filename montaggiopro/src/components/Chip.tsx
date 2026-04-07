import type { LucideIcon } from "lucide-react"
import { C } from "../tokens"

interface Props {
  label: string
  icon?: LucideIcon
  active?: boolean
  onClick?: () => void
}

export function Chip({ label, icon: Icon, active = false, onClick }: Props) {
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500,
      fontFamily: C.font, cursor: "pointer", whiteSpace: "nowrap",
      background: active ? C.accent : C.white,
      color: active ? C.white : C.text,
      border: `1px solid ${active ? C.accent : C.border}`,
      transition: "all 200ms",
    }}>
      {Icon && <Icon size={13} />}
      {label}
    </button>
  )
}
