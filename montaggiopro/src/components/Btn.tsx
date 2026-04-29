import { useState } from "react"
import { LucideIcon, RefreshCw } from "lucide-react"
import { C } from "../tokens"

type Variant = "primary" | "secondary" | "danger"

const V: Record<Variant, { bg:string; color:string; border:string; hover:string }> = {
  primary:   { bg:C.accent,      color:"#fff",  border:"none",                  hover:"#0078cc"  },
  secondary: { bg:"transparent", color:C.text,  border:`1px solid ${C.border}`, hover:C.bg       },
  danger:    { bg:"transparent", color:C.red,   border:`1px solid ${C.red}`,    hover:"#FEF2F2"  },
}

interface Props {
  children:  React.ReactNode
  variant?:  Variant
  onClick?:  () => void
  icon?:     LucideIcon
  small?:    boolean
  full?:     boolean
  loading?:  boolean
}

export function Btn({ children, variant = "primary", onClick, icon: Icon, small = false, full = false, loading = false }: Props) {
  const [hov, setHov] = useState(false)
  const v = V[variant]
  return (
    <button
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:6, padding:small?"6px 12px":"9px 18px", borderRadius:8, border:v.border, background:hov&&!loading?v.hover:v.bg, color:v.color, fontSize:small?12:14, fontWeight:600, cursor:loading?"wait":"pointer", fontFamily:C.font, transition:"background .15s", width:full?"100%":"auto", opacity:loading?.7:1 }}
    >
      {Icon && !loading && <Icon size={small ? 13 : 15} />}
      {loading && <RefreshCw size={small ? 13 : 15} style={{ animation:"spin 1s linear infinite" }} />}
      {children}
    </button>
  )
}
