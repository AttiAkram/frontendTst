import type { LucideIcon } from "lucide-react"
import { C } from "../tokens"

interface Props { icon: LucideIcon; label: string; value: string | number }

export function Detail({ icon: Icon, label, value }: Props) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <Icon size={12} color={C.sub} />
      <span style={{ fontSize: 11, color: C.sub, fontFamily: C.font }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 500, color: C.text, fontFamily: C.font }}>{value}</span>
    </div>
  )
}
