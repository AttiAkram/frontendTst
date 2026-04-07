import type { ReactNode } from "react"
import { useBreakpoint } from "../hooks/useBreakpoint"

interface Props { children: ReactNode }

export function FormGrid({ children }: Props) {
  const bp = useBreakpoint()
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: bp === "mobile" ? "1fr" : "1fr 1fr",
      gap: 24,
    }}>
      {children}
    </div>
  )
}

export function FullRow({ children }: Props) {
  return <div style={{ gridColumn: "1 / -1" }}>{children}</div>
}
