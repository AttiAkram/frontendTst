import { useState } from "react"
import { Heart } from "lucide-react"
import { C } from "../tokens"
import type { Team } from "../types"

interface Props { team: Team }

function GridCell({ team, index }: { team: Team; index: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        aspectRatio: "1/1", borderRadius: 4, position: "relative", cursor: "pointer",
        background: C.bg,
      }}
    >
      {hovered && (
        <div style={{
          position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", borderRadius: 4,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
          color: C.white, fontSize: 12, fontWeight: 500, fontFamily: C.font,
        }}>
          <Heart size={14} fill={C.white} /> {Math.floor(Math.random() * 50 + 10)}
        </div>
      )}
    </div>
  )
}

export function WorkGrid({ team }: Props) {
  const cells = Array.from({ length: 9 }, (_, i) => i)
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
      {cells.map(i => <GridCell key={i} team={team} index={i} />)}
    </div>
  )
}
