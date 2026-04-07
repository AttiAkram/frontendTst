import type { LucideIcon } from "lucide-react"
import { C } from "../../tokens"

interface Props { label: string; icon: LucideIcon }

export function EmptyState({ label, icon: Icon }: Props) {
  return (
    <div style={{ textAlign: "center", padding: 40 }}>
      <Icon size={40} color={C.sub} style={{ opacity: 0.4, marginBottom: 12 }} />
      <div style={{ fontSize: 14, color: C.sub, fontFamily: C.font }}>{label}</div>
    </div>
  )
}
