import { Avatar } from "./Avatar"
import { PALETTES, C } from "../tokens"

interface Props {
  colors: [string, string]
  char: string
  onChange: (colors: [string, string]) => void
}

export function AvatarPicker({ colors, char, onChange }: Props) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 14 }}>
      <Avatar char={char} colors={colors} size={56} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {PALETTES.map((p, i) => (
          <button key={i} onClick={() => onChange(p)} style={{
            width: 28, height: 28, borderRadius: "50%", border: "none", cursor: "pointer",
            background: p[0],
            outline: p[0] === colors[0] ? `2px solid ${C.text}` : "2px solid transparent",
            outlineOffset: 2,
          }} />
        ))}
      </div>
    </div>
  )
}
