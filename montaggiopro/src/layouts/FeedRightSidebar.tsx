import { useState } from "react"
import { UserPlus, UserCheck } from "lucide-react"
import { Avatar } from "../components/Avatar"
import { Divider } from "../components/Divider"
import { C } from "../tokens"
import { TEAMS } from "../data/mock"
import type { Profile, Team } from "../types"

interface Props { profile: Profile; onTeamClick: (t: Team) => void }

function SuggestedTeam({ team, onClick }: { team: Team; onClick: () => void }) {
  const [following, setFollowing] = useState(false)
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
      <div onClick={onClick} style={{ cursor: "pointer" }}>
        <Avatar char={team.char} colors={team.colors} size={32} />
      </div>
      <div style={{ flex: 1, cursor: "pointer" }} onClick={onClick}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: C.font }}>{team.name}</div>
        <div style={{ fontSize: 11, color: C.sub, fontFamily: C.font }}>{team.zones[0]}</div>
      </div>
      <button onClick={() => setFollowing(f => !f)} style={{
        border: "none", background: "transparent", cursor: "pointer",
        color: following ? C.sub : C.accent, fontSize: 12, fontWeight: 600, fontFamily: C.font,
      }}>
        {following ? <UserCheck size={16} /> : <UserPlus size={16} />}
      </button>
    </div>
  )
}

export function FeedRightSidebar({ profile, onTeamClick }: Props) {
  return (
    <div style={{ width: 280, flexShrink: 0, paddingLeft: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <Avatar char={profile.char} colors={profile.colors} size={44} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text, fontFamily: C.font }}>{profile.name}</div>
          <div style={{ fontSize: 12, color: C.accent, fontFamily: C.font, cursor: "pointer" }}>Profilo</div>
        </div>
      </div>
      <Divider my={12} />
      <div style={{ fontSize: 13, fontWeight: 600, color: C.sub, fontFamily: C.font, marginBottom: 12 }}>Squadre suggerite</div>
      {TEAMS.slice(1, 5).map(t => <SuggestedTeam key={t.id} team={t} onClick={() => onTeamClick(t)} />)}
      <Divider my={12} />
      <div style={{ fontSize: 11, color: C.sub, fontFamily: C.font }}>Privacy · Termini · MontaggioPro 2026</div>
    </div>
  )
}
