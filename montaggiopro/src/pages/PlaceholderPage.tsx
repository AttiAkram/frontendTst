import type { LucideIcon } from "lucide-react"
import { C } from "../tokens"

interface Props { label: string; icon: LucideIcon }

export function PlaceholderPage({ label, icon: Icon }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60 }}>
      <Icon size={48} color={C.sub} style={{ opacity: 0.4, marginBottom: 16 }} />
      <div style={{ fontSize: 18, fontWeight: 600, color: C.text, fontFamily: C.font, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14, color: C.sub, fontFamily: C.font }}>In arrivo</div>
    </div>
  )
}
