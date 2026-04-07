import type { LucideIcon } from "lucide-react"
import { C } from "../tokens"

interface Props { icon: LucideIcon; label: string; value: string | number }

export function Detail({ icon: Icon, label, value }: Props) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Icon size={13} color={C.sub} />
      <span style={{ fontSize: 12, color: C.sub, fontFamily: C.font }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: C.font }}>{value}</span>
    </div>
  )
}
