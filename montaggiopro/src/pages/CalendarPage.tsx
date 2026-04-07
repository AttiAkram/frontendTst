import { useState } from "react"
import { AvailCalendar } from "../features/AvailCalendar"
import { C, AVAIL_STYLE } from "../tokens"
import type { Profile, AvailStatus } from "../types"

interface Props { profile: Profile; updateProfile: (p: Profile) => void }

export function CalendarPage({ profile, updateProfile }: Props) {
  const [selected, setSelected] = useState<AvailStatus>("free")

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
      <AvailCalendar avail={profile.availability} />
      <div style={{
        background: C.white, borderRadius: 12, padding: 16, marginTop: 16,
        border: `1px solid ${C.border}`,
      }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.text, fontFamily: C.font, marginBottom: 12 }}>
          Imposta disponibilità
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {(["free","partial","busy"] as const).map(s => {
            const style = AVAIL_STYLE[s]
            return (
              <button key={s} onClick={() => setSelected(s)} style={{
                flex: 1, padding: "10px 0", borderRadius: 8, fontSize: 13, fontWeight: 600,
                fontFamily: C.font, cursor: "pointer", border: `2px solid ${selected === s ? style.color : "transparent"}`,
                background: style.bg, color: style.color, transition: "border-color 200ms",
              }}>
                {s === "free" ? "Disponibile" : s === "partial" ? "Parziale" : "Occupato"}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
