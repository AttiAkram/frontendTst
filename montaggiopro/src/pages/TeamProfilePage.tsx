import { useState } from "react"
import { ArrowLeft, Settings, UserPlus, UserCheck, MessageCircle, Truck, MapPin } from "lucide-react"
import { Avatar } from "../components/Avatar"
import { StarRating } from "../components/StarRating"
import { Badge } from "../components/Badge"
import { Btn } from "../components/Btn"
import { Stat } from "../components/Stat"
import { WorkGrid } from "../features/WorkGrid"
import { AvailCalendar } from "../features/AvailCalendar"
import { ReviewCard } from "../features/ReviewCard"
import { C } from "../tokens"
import { REVIEWS } from "../data/mock"
import type { Team } from "../types"

interface Props { team?: Team; onBack?: () => void; onSettings?: () => void }

type Tab = "portfolio" | "calendario" | "recensioni"

export function TeamProfilePage({ team, onBack, onSettings }: Props) {
  const [tab, setTab] = useState<Tab>("portfolio")
  const [following, setFollowing] = useState(false)
  if (!team) return null

  const isOwn = !!onSettings
  const tabs: { key: Tab; label: string }[] = [
    { key: "portfolio", label: "Portfolio" },
    { key: "calendario", label: "Calendario" },
    { key: "recensioni", label: "Recensioni" },
  ]

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
      {onBack && (
        <div onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", marginBottom: 12, color: C.text, fontFamily: C.font, fontSize: 14 }}>
          <ArrowLeft size={18} /> Indietro
        </div>
      )}
      <div style={{ background: C.white, borderRadius: 12, padding: 20, border: `1px solid ${C.border}`, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <Avatar char={team.char} colors={team.colors} size={80} verified={team.verified} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.text, fontFamily: C.font }}>{team.name}</div>
            <div style={{ fontSize: 13, color: C.sub, fontFamily: C.font }}>{team.leader} · {team.members} membri</div>
            <StarRating value={team.rating} count={team.reviews} size={13} />
          </div>
        </div>
        <div style={{ fontSize: 14, color: C.text, fontFamily: C.font, marginBottom: 12 }}>{team.bio}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 12, color: C.sub, fontSize: 13, fontFamily: C.font }}>
          <MapPin size={13} /> {team.zones.join(", ")}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          {team.specs.map(s => <Badge key={s} label={s} />)}
          <Badge label={`${team.equipment.vanM3}m³`} icon={Truck} />
          {team.equipment.scalaMot && <Badge label="Scala mot." color={C.amber} />}
          {team.equipment.argano && <Badge label="Argano" color={C.amber} />}
        </div>
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 16 }}>
          <Stat label="Lavori" value={team.jobs} />
          <Stat label="Anni esp." value={team.experience} />
          <Stat label="Recensioni" value={team.reviews} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {isOwn ? (
            <>
              <Btn full variant="secondary" icon={Settings} onClick={onSettings}>Modifica profilo</Btn>
            </>
          ) : (
            <>
              <Btn full icon={following ? UserCheck : UserPlus} variant={following ? "secondary" : "primary"}
                onClick={() => setFollowing(f => !f)}>
                {following ? "Segui già" : "Segui"}
              </Btn>
              <Btn full variant="secondary" icon={MessageCircle}>Messaggio</Btn>
            </>
          )}
        </div>
      </div>
      <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, marginBottom: 16 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: 1, padding: "12px 0", border: "none", background: "transparent",
            borderBottom: `2px solid ${tab === t.key ? C.accent : "transparent"}`,
            color: tab === t.key ? C.accent : C.sub, fontSize: 14, fontWeight: 600,
            fontFamily: C.font, cursor: "pointer", transition: "all 200ms",
          }}>{t.label}</button>
        ))}
      </div>
      {tab === "portfolio" && <WorkGrid team={team} />}
      {tab === "calendario" && <AvailCalendar avail={team.availability} />}
      {tab === "recensioni" && REVIEWS.map(r => <ReviewCard key={r.id} review={r} />)}
    </div>
  )
}
