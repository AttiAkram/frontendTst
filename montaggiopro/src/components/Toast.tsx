import { Check } from "lucide-react"
import { C } from "../tokens"

interface Props { message: string; visible: boolean }

export function Toast({ message, visible }: Props) {
  return (
    <div style={{
      position: "fixed", bottom: 90, left: "50%", transform: `translateX(-50%) translateY(${visible ? 0 : 20}px)`,
      opacity: visible ? 1 : 0, transition: "all 350ms",
      background: C.text, color: C.white, borderRadius: 20,
      padding: "10px 20px", display: "flex", alignItems: "center", gap: 8,
      fontSize: 14, fontFamily: C.font, zIndex: 9999, pointerEvents: "none",
    }}>
      <Check size={16} />
      {message}
    </div>
  )
}
