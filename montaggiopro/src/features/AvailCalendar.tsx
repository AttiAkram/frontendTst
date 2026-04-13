import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { C, AVAIL_STYLE } from "../tokens"
import type { AvailStatus } from "../types"

interface Props { avail: Record<number, AvailStatus> }

const DAYS = ["Lu","Ma","Me","Gi","Ve","Sa","Do"]
const MONTHS = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno",
                "Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"]

export function AvailCalendar({ avail }: Props) {
  const [monthOffset, setMonthOffset] = useState(0)
  const now = new Date()
  const month = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1)
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const startDay = (month.getDay() + 6) % 7

  return (
    <div style={{ background: C.white, borderRadius: 12, padding: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <button onClick={() => setMonthOffset(m => m - 1)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
          <ChevronLeft size={18} color={C.text} />
        </button>
        <span style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: C.font }}>
          {MONTHS[month.getMonth()]} {month.getFullYear()}
        </span>
        <button onClick={() => setMonthOffset(m => m + 1)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
          <ChevronRight size={18} color={C.text} />
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, textAlign: "center" }}>
        {DAYS.map(d => (
          <div key={d} style={{ fontSize: 10, fontWeight: 600, color: C.sub, fontFamily: C.font, padding: 4 }}>{d}</div>
        ))}
        {Array.from({ length: startDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1
          const status = avail[day] ?? "free"
          const s = AVAIL_STYLE[status]
          return (
            <div key={day} style={{
              padding: 5, borderRadius: 6, fontSize: 12, fontWeight: 500,
              background: s.bg, color: s.color, fontFamily: C.font, cursor: "pointer",
            }}>{day}</div>
          )
        })}
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 12 }}>
        {(["free","partial","busy"] as const).map(s => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: C.sub, fontFamily: C.font }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: AVAIL_STYLE[s].color }} />
            {s === "free" ? "Libero" : s === "partial" ? "Parziale" : "Occupato"}
          </div>
        ))}
      </div>
    </div>
  )
}
