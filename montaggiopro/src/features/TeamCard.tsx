import { useState, useEffect } from "react"
import { UserPlus, UserCheck, Truck } from "lucide-react"
import { C } from "../tokens"
import { Avatar } from "../components/Avatar"
import { Badge } from "../components/Badge"
import { Btn } from "../components/Btn"
import { Stat } from "../components/Stat"
import type { Team } from "../types"

interface Props { team: Team; onClick: () => void; delay?: number }

export function TeamCard({ team, onClick, delay = 0 }: Props) {
  const [visible, setVisible] = useState(delay === 0)
  const [following, setFollowing] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (delay > 0) { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t) }
  }, [delay])

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.white, borderRadius: 12, padding: 16, marginBottom: 12, cursor: "pointer",
        border: `1px solid ${C.border}`,
        boxShadow: hovered ? "0 4px 12px rgba(0,0,0,0.08)" : "none",
        opacity: visible ? 1 : 0, transform: `translateY(${visible ? 0 : 20}px)`,
        transition: "opacity 350ms, transform 350ms, box-shadow 200ms",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <Avatar char={team.char} colors={team.colors} size={44} verified={team.verified} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text, fontFamily: C.font }}>{team.name}</div>
          <div style={{ fontSize: 12, color: C.sub, fontFamily: C.font }}>{team.zones.join(", ")}</div>
        </div>
        <div onClick={e => { e.stopPropagation(); setFollowing(f => !f) }}>
          <Btn small variant={following ? "secondary" : "primary"} icon={following ? UserCheck : UserPlus}>
            {following ? "Segui già" : "Segui"}
          </Btn>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {team.specs.map(s => <Badge key={s} label={s} />)}
        <Badge label={`${team.equipment.vanM3}m³`} icon={Truck} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <Stat label="Lavori" value={team.jobs} />
        <Stat label="Anni esp." value={team.experience} />
        <Stat label="Membri" value={team.members} />
      </div>
    </div>
  )
}
