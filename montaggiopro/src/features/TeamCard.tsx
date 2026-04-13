import { useState, useEffect } from "react"
import { Truck } from "lucide-react"
import { C } from "../tokens"
import { Avatar } from "../components/Avatar"
import { Btn } from "../components/Btn"
import { Stat } from "../components/Stat"
import type { Team } from "../types"

interface Props { team: Team; onClick: () => void; delay?: number }

export function TeamCard({ team, onClick, delay = 0 }: Props) {
  const [visible, setVisible] = useState(delay === 0)
  const [following, setFollowing] = useState(false)

  useEffect(() => {
    if (delay > 0) { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t) }
  }, [delay])

  return (
    <div
      onClick={onClick}
      style={{
        background: C.white, borderRadius: 12, padding: 14, marginBottom: 10, cursor: "pointer",
        opacity: visible ? 1 : 0, transform: `translateY(${visible ? 0 : 12}px)`,
        transition: "opacity 250ms, transform 250ms",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <Avatar char={team.char} colors={team.colors} size={36} verified={team.verified} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: C.font }}>{team.name}</div>
          <div style={{ fontSize: 11, color: C.sub, fontFamily: C.font }}>{team.zones.join(", ")}</div>
        </div>
        <div onClick={e => { e.stopPropagation(); setFollowing(f => !f) }}>
          <Btn small variant={following ? "secondary" : "primary"}>
            {following ? "Seguito" : "Segui"}
          </Btn>
        </div>
      </div>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
        {team.specs.map(s => (
          <span key={s} style={{ fontSize: 11, padding: "2px 6px", borderRadius: 4, background: C.bg, color: C.sub, fontFamily: C.font }}>{s}</span>
        ))}
        <span style={{ fontSize: 11, padding: "2px 6px", borderRadius: 4, background: C.bg, color: C.sub, fontFamily: C.font, display: "inline-flex", alignItems: "center", gap: 3 }}>
          <Truck size={10} />{team.equipment.vanM3}m3
        </span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <Stat label="Lavori" value={team.jobs} />
        <Stat label="Anni" value={team.experience} />
        <Stat label="Membri" value={team.members} />
      </div>
    </div>
  )
}
