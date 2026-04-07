import { useState, type ReactNode } from "react"
import { RefreshCw, type LucideIcon } from "lucide-react"
import { C } from "../tokens"

interface Props {
  children: ReactNode
  variant?: "primary" | "secondary" | "danger"
  onClick?: () => void
  icon?: LucideIcon
  small?: boolean
  full?: boolean
  loading?: boolean
}

const styles = {
  primary:   { bg: C.accent,  hover: "#0078CC", color: C.white,  border: "none" },
  secondary: { bg: C.white,   hover: C.bg,      color: C.text,   border: `1px solid ${C.border}` },
  danger:    { bg: C.white,   hover: "#FEF2F2", color: C.red,    border: `1px solid ${C.red}` },
}

export function Btn({ children, variant = "primary", onClick, icon: Icon, small, full, loading }: Props) {
  const [hovered, setHovered] = useState(false)
  const s = styles[variant]
  return (
    <button
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
        padding: small ? "6px 12px" : "10px 20px",
        borderRadius: 8, fontSize: small ? 12 : 14, fontWeight: 600,
        fontFamily: C.font, cursor: loading ? "default" : "pointer",
        background: hovered && !loading ? s.hover : s.bg,
        color: s.color, border: s.border,
        width: full ? "100%" : undefined,
        opacity: loading ? 0.7 : 1,
        transition: "background 200ms, opacity 200ms",
      }}
    >
      {loading ? <RefreshCw size={small ? 12 : 14} style={{ animation: "spin 1s linear infinite" }} /> : Icon && <Icon size={small ? 12 : 14} />}
      {children}
    </button>
  )
}
