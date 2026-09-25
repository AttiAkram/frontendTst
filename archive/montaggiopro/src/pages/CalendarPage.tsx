import { useState } from "react"
import { AvailCalendar } from "../features/AvailCalendar"
import { C, AVAIL_STYLE } from "../tokens"
import type { Profile, AvailStatus } from "../types"

interface Props { profile: Profile; updateProfile: (p: Profile) => void }

export function CalendarPage({ profile }: Props) {
  const [selected, setSelected] = useState<AvailStatus>("free")

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "12px 16px" }}>
      <AvailCalendar avail={profile.availability} />
      <div style={{ background: C.white, borderRadius: 12, padding: 14, marginTop: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: C.font, marginBottom: 10 }}>
          Imposta disponibilità
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {(["free","partial","busy"] as const).map(s => {
            const st = AVAIL_STYLE[s]
            return (
              <button key={s} onClick={() => setSelected(s)} style={{
                flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 12, fontWeight: 500,
                fontFamily: C.font, cursor: "pointer",
                border: `2px solid ${selected === s ? st.color : "transparent"}`,
                background: st.bg, color: st.color, transition: "border-color 150ms",
              }}>
                {s === "free" ? "Libero" : s === "partial" ? "Parziale" : "Occupato"}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
