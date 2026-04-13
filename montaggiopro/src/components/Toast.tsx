import { Check } from "lucide-react"
import { C } from "../tokens"

interface Props { message: string; visible: boolean }

export function Toast({ message, visible }: Props) {
  return (
    <div style={{
      position: "fixed", bottom: 80, left: "50%",
      transform: `translateX(-50%) translateY(${visible ? 0 : 16}px)`,
      opacity: visible ? 1 : 0, transition: "all 250ms",
      background: C.text, color: C.white, borderRadius: 8,
      padding: "8px 16px", display: "flex", alignItems: "center", gap: 8,
      fontSize: 13, fontFamily: C.font, zIndex: 9999, pointerEvents: "none",
    }}>
      <Check size={14} />
      {message}
    </div>
  )
}
