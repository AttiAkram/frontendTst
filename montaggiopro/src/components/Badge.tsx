import { LucideIcon } from "lucide-react"
import { C } from "../tokens"

interface Props {
  label:  string
  icon?:  LucideIcon
  color?: string
  bg?:    string
}

export function Badge({ label, icon: Icon, color = C.sub, bg = C.white }: Props) {
  return (
    <div style={{ display:"inline-flex", alignItems:"center", gap:3, padding:"3px 8px", borderRadius:6, background:bg, border:`1px solid ${C.border}`, fontSize:11, color, fontWeight:500, whiteSpace:"nowrap" }}>
      {Icon && <Icon size={11} />}
      {label}
    </div>
  )
}
