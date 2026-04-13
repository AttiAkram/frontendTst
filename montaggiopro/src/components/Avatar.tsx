import { Check } from "lucide-react"
import { C } from "../tokens"

interface Props {
  char: string
  colors: [string, string]
  size?: number
  ring?: boolean
  verified?: boolean
}

export function Avatar({ char, colors, size = 32, ring = false, verified = false }: Props) {
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {ring && (
        <div style={{
          position: "absolute", inset: -2, borderRadius: "50%",
          border: `2px solid ${C.sub}`,
        }} />
      )}
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: colors[0],
        display: "flex", alignItems: "center", justifyContent: "center",
        color: C.white, fontWeight: 600, fontSize: Math.round(size * 0.38),
        fontFamily: C.font,
      }}>
        {char}
      </div>
      {verified && (
        <div style={{
          position: "absolute", bottom: -1, right: -1, zIndex: 2,
          width: Math.round(size * 0.32), height: Math.round(size * 0.32), borderRadius: "50%",
          background: C.text, display: "flex", alignItems: "center", justifyContent: "center",
          border: `1.5px solid ${C.white}`,
        }}>
          <Check size={Math.round(size * 0.18)} color={C.white} strokeWidth={3} />
        </div>
      )}
    </div>
  )
}
