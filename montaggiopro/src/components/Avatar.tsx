import { Check } from "lucide-react"
import { C } from "../tokens"

interface Props {
  char: string
  colors: [string, string]
  size?: number
  ring?: boolean
  verified?: boolean
}

export function Avatar({ char, colors, size = 36, ring = false, verified = false }: Props) {
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {ring && (
        <div style={{
          position: "absolute", inset: -3, borderRadius: "50%",
          background: "linear-gradient(45deg, #F58529, #DD2A7B, #8134AF)",
          padding: 2,
        }}>
          <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: C.white }} />
        </div>
      )}
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: C.white, fontWeight: 700, fontSize: size * 0.4,
        fontFamily: C.font, position: "relative", zIndex: 1,
      }}>
        {char}
      </div>
      {verified && (
        <div style={{
          position: "absolute", bottom: -1, right: -1, zIndex: 2,
          width: size * 0.35, height: size * 0.35, borderRadius: "50%",
          background: C.accent, display: "flex", alignItems: "center", justifyContent: "center",
          border: `2px solid ${C.white}`,
        }}>
          <Check size={size * 0.2} color={C.white} strokeWidth={3} />
        </div>
      )}
    </div>
  )
}
