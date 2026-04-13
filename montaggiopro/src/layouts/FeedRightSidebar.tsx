import { useState } from "react"
import { Avatar } from "../components/Avatar"
import { C } from "../tokens"
import { TEAMS } from "../data/mock"
import type { Profile, Team } from "../types"

interface Props { profile: Profile; onTeamClick: (t: Team) => void }

function SuggestedTeam({ team, onClick }: { team: Team; onClick: () => void }) {
  const [following, setFollowing] = useState(false)
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
      <div onClick={onClick} style={{ cursor: "pointer" }}>
        <Avatar char={team.char} colors={team.colors} size={28} />
      </div>
      <div style={{ flex: 1, minWidth: 0, cursor: "pointer" }} onClick={onClick}>
        <div style={{ fontSize: 12, fontWeight: 500, color: C.text, fontFamily: C.font, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{team.name}</div>
        <div style={{ fontSize: 11, color: C.sub, fontFamily: C.font }}>{team.zones[0]}</div>
      </div>
      <button onClick={(e) => { e.stopPropagation(); setFollowing(f => !f) }} style={{
        border: "none", background: "transparent", cursor: "pointer",
        color: following ? C.sub : C.text, fontSize: 11, fontWeight: 600, fontFamily: C.font,
      }}>
        {following ? "Seguito" : "Segui"}
      </button>
    </div>
  )
}

export function FeedRightSidebar({ profile, onTeamClick }: Props) {
  return (
    <div style={{ width: 260, flexShrink: 0, paddingLeft: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <Avatar char={profile.char} colors={profile.colors} size={36} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: C.font }}>{profile.name}</div>
          <div style={{ fontSize: 11, color: C.sub, fontFamily: C.font, cursor: "pointer" }}>Il tuo profilo</div>
        </div>
      </div>
      <div style={{ height: 1, background: C.border, margin: "10px 0" }} />
      <div style={{ fontSize: 12, fontWeight: 500, color: C.sub, fontFamily: C.font, marginBottom: 10 }}>Suggeriti</div>
      {TEAMS.slice(1, 5).map(t => <SuggestedTeam key={t.id} team={t} onClick={() => onTeamClick(t)} />)}
      <div style={{ height: 1, background: C.border, margin: "10px 0" }} />
      <div style={{ fontSize: 10, color: C.sub, fontFamily: C.font }}>Privacy · Termini · MontaggioPro 2026</div>
    </div>
  )
}
