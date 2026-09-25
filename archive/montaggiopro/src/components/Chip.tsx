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
      padding: "6px 12px", borderRadius: 18, fontSize: 12, fontWeight: 500,
      fontFamily: C.font, cursor: "pointer", whiteSpace: "nowrap",
      background: active ? C.text : C.white,
      color: active ? C.white : C.text,
      border: `1px solid ${active ? C.text : C.border}`,
      transition: "all 150ms",
    }}>
      {Icon && <Icon size={12} />}
      {label}
    </button>
  )
}
