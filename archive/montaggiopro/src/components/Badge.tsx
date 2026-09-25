import type { LucideIcon } from "lucide-react"
import { C } from "../tokens"

interface Props {
  label: string
  icon?: LucideIcon
  color?: string
  bg?: string
}

export function Badge({ label, icon: Icon, color = C.sub, bg = C.bg }: Props) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 500,
      color, background: bg, fontFamily: C.font,
    }}>
      {Icon && <Icon size={11} />}
      {label}
    </span>
  )
}
