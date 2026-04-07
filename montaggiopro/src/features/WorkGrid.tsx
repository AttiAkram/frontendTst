import { useState } from "react"
import { Heart } from "lucide-react"
import { C } from "../tokens"
import type { Team } from "../types"

interface Props { team: Team }

export function WorkGrid({ team }: Props) {
  const cells = Array.from({ length: 9 }, (_, i) => i)
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 3 }}>
      {cells.map(i => <GridCell key={i} team={team} index={i} />)}
    </div>
  )
}

function GridCell({ team, index }: { team: Team; index: number }) {
  const [hovered, setHovered] = useState(false)
  const angle = (index * 40) % 360
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        aspectRatio: "1/1", borderRadius: 4, position: "relative", cursor: "pointer",
        background: `linear-gradient(${angle}deg, ${team.colors[0]}, ${team.colors[1]})`,
      }}
    >
      {hovered && (
        <div style={{
          position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", borderRadius: 4,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          color: C.white, fontSize: 14, fontWeight: 600, fontFamily: C.font,
        }}>
          <Heart size={16} fill={C.white} /> {Math.floor(Math.random() * 50 + 10)}
        </div>
      )}
    </div>
  )
}
