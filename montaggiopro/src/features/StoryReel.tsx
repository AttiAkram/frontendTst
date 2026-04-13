import { useState, useEffect } from "react"
import { Avatar } from "../components/Avatar"
import { C } from "../tokens"
import type { Team } from "../types"

interface Props { teams: Team[] }

function Story({ team, delay }: { team: Team; delay: number }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t) }, [delay])
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
      opacity: visible ? 1 : 0, transition: "opacity 200ms",
    }}>
      <Avatar char={team.char} colors={team.colors} size={44} ring />
      <div style={{
        fontSize: 10, color: C.sub, fontFamily: C.font, width: 56,
        textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>{team.name.split(" ")[0]}</div>
    </div>
  )
}

export function StoryReel({ teams }: Props) {
  return (
    <div style={{
      display: "flex", gap: 14, overflowX: "auto", padding: "10px 12px",
      background: C.white, borderRadius: 12, marginBottom: 12,
    }}>
      {teams.map((t, i) => <Story key={t.id} team={t} delay={i * 60} />)}
    </div>
  )
}
