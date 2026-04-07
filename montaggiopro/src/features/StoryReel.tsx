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
      opacity: visible ? 1 : 0, transform: `translateY(${visible ? 0 : 10}px)`,
      transition: "opacity 300ms, transform 300ms",
    }}>
      <Avatar char={team.char} colors={team.colors} size={52} ring />
      <div style={{
        fontSize: 11, color: C.text, fontFamily: C.font, width: 64,
        textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>{team.name.split(" ")[0]}</div>
    </div>
  )
}

export function StoryReel({ teams }: Props) {
  return (
    <div style={{
      display: "flex", gap: 18, overflowX: "auto", padding: "12px 16px",
      background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, marginBottom: 16,
    }}>
      {teams.map((t, i) => <Story key={t.id} team={t} delay={i * 80} />)}
    </div>
  )
}
