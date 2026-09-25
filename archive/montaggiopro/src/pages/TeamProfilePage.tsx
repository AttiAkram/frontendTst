import { useState } from "react"
import { ArrowLeft, Settings, MessageCircle, Truck, MapPin } from "lucide-react"
import { Avatar } from "../components/Avatar"
import { StarRating } from "../components/StarRating"
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
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "12px 16px" }}>
      {onBack && (
        <button onClick={onBack} style={{
          display: "flex", alignItems: "center", gap: 4, cursor: "pointer", marginBottom: 10,
          color: C.text, fontFamily: C.font, fontSize: 13, background: "none", border: "none", padding: 0,
        }}>
          <ArrowLeft size={16} /> Indietro
        </button>
      )}
      <div style={{ background: C.white, borderRadius: 12, padding: 16, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <Avatar char={team.char} colors={team.colors} size={56} verified={team.verified} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text, fontFamily: C.font }}>{team.name}</div>
            <div style={{ fontSize: 12, color: C.sub, fontFamily: C.font }}>{team.leader} · {team.members} membri</div>
            <StarRating value={team.rating} count={team.reviews} size={12} />
          </div>
        </div>
        <div style={{ fontSize: 13, color: C.text, fontFamily: C.font, lineHeight: 1.4, marginBottom: 10 }}>{team.bio}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 10, color: C.sub, fontSize: 12, fontFamily: C.font }}>
          <MapPin size={12} /> {team.zones.join(", ")}
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
          {team.specs.map(s => <span key={s} style={{ fontSize: 11, padding: "2px 6px", borderRadius: 4, background: C.bg, color: C.sub, fontFamily: C.font }}>{s}</span>)}
          <span style={{ fontSize: 11, padding: "2px 6px", borderRadius: 4, background: C.bg, color: C.sub, fontFamily: C.font, display: "inline-flex", alignItems: "center", gap: 3 }}>
            <Truck size={10} />{team.equipment.vanM3}m3
          </span>
          {team.equipment.scalaMot && <span style={{ fontSize: 11, padding: "2px 6px", borderRadius: 4, background: C.bg, color: C.sub, fontFamily: C.font }}>Scala mot.</span>}
          {team.equipment.argano && <span style={{ fontSize: 11, padding: "2px 6px", borderRadius: 4, background: C.bg, color: C.sub, fontFamily: C.font }}>Argano</span>}
        </div>
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 14 }}>
          <Stat label="Lavori" value={team.jobs} />
          <Stat label="Anni" value={team.experience} />
          <Stat label="Recensioni" value={team.reviews} />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {isOwn ? (
            <Btn full variant="secondary" icon={Settings} onClick={onSettings}>Modifica profilo</Btn>
          ) : (
            <>
              <Btn full onClick={() => setFollowing(f => !f)}
                variant={following ? "secondary" : "primary"}>
                {following ? "Seguito" : "Segui"}
              </Btn>
              <Btn full variant="secondary" icon={MessageCircle}>Messaggio</Btn>
            </>
          )}
        </div>
      </div>
      <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, marginBottom: 12 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: 1, padding: "10px 0", border: "none", background: "transparent",
            borderBottom: `2px solid ${tab === t.key ? C.text : "transparent"}`,
            color: tab === t.key ? C.text : C.sub, fontSize: 13, fontWeight: 500,
            fontFamily: C.font, cursor: "pointer", transition: "all 150ms",
          }}>{t.label}</button>
        ))}
      </div>
      {tab === "portfolio" && <WorkGrid team={team} />}
      {tab === "calendario" && <AvailCalendar avail={team.availability} />}
      {tab === "recensioni" && REVIEWS.map(r => <ReviewCard key={r.id} review={r} />)}
    </div>
  )
}
