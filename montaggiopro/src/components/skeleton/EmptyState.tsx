import type { LucideIcon } from "lucide-react"
import { C } from "../../tokens"

interface Props { label: string; icon: LucideIcon }

export function EmptyState({ label, icon: Icon }: Props) {
  return (
    <div style={{ textAlign: "center", padding: 32 }}>
      <Icon size={32} color={C.sub} style={{ opacity: 0.3, marginBottom: 10 }} />
      <div style={{ fontSize: 13, color: C.sub, fontFamily: C.font }}>{label}</div>
    </div>
  )
}
