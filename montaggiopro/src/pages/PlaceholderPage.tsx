import type { LucideIcon } from "lucide-react"
import { C } from "../tokens"

interface Props { label: string; icon: LucideIcon }

export function PlaceholderPage({ label, icon: Icon }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 48 }}>
      <Icon size={36} color={C.sub} style={{ opacity: 0.3, marginBottom: 12 }} />
      <div style={{ fontSize: 15, fontWeight: 600, color: C.text, fontFamily: C.font, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13, color: C.sub, fontFamily: C.font }}>In arrivo</div>
    </div>
  )
}
