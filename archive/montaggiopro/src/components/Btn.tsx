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

export function Btn({ children, variant = "primary", onClick, icon: Icon, small, full, loading }: Props) {
  const [hovered, setHovered] = useState(false)
  const isPrimary = variant === "primary"
  const isDanger = variant === "danger"
  return (
    <button
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
        padding: small ? "5px 12px" : "8px 16px",
        borderRadius: 18, fontSize: small ? 12 : 13, fontWeight: 500,
        fontFamily: C.font, cursor: loading ? "default" : "pointer",
        background: isPrimary
          ? (hovered ? "#272727" : C.text)
          : isDanger
            ? (hovered ? "#FFEBEE" : C.white)
            : (hovered ? C.bg : C.white),
        color: isPrimary ? C.white : isDanger ? "#C62828" : C.text,
        border: isPrimary ? "none" : `1px solid ${isDanger ? "#C62828" : C.border}`,
        width: full ? "100%" : undefined,
        opacity: loading ? 0.6 : 1,
        transition: "background 150ms, opacity 150ms",
      }}
    >
      {loading
        ? <RefreshCw size={small ? 12 : 13} style={{ animation: "spin 1s linear infinite" }} />
        : Icon && <Icon size={small ? 12 : 13} />}
      {children}
    </button>
  )
}
