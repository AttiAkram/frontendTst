import type { LucideIcon } from "lucide-react"
import { C } from "../tokens"

interface Props {
  label: string
  icon?: LucideIcon
  color?: string
  bg?: string
}

export function Badge({ label, icon: Icon, color = C.sub, bg = C.white }: Props) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 8px", borderRadius: 12, fontSize: 11, fontWeight: 500,
      color, background: bg, border: `1px solid ${C.border}`,
      fontFamily: C.font, whiteSpace: "nowrap",
    }}>
      {Icon && <Icon size={11} />}
      {label}
    </span>
  )
}
