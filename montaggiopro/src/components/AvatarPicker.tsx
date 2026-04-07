import { Avatar } from "./Avatar"
import { PALETTES } from "../tokens"
import { C } from "../tokens"

interface Props {
  colors: [string, string]
  char: string
  onChange: (colors: [string, string]) => void
}

export function AvatarPicker({ colors, char, onChange }: Props) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 16 }}>
      <Avatar char={char} colors={colors} size={72} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {PALETTES.map((p, i) => (
          <button key={i} onClick={() => onChange(p)} style={{
            width: 32, height: 32, borderRadius: "50%", border: "none", cursor: "pointer",
            background: `linear-gradient(135deg, ${p[0]}, ${p[1]})`,
            outline: p[0] === colors[0] && p[1] === colors[1] ? `3px solid ${C.text}` : "none",
            outlineOffset: 2,
          }} />
        ))}
      </div>
    </div>
  )
}
