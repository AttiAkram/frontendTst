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
    <div style={{ background: C.white, borderRadius: 12, padding: 16, border: `1px solid ${C.border}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <ChevronLeft size={20} color={C.text} style={{ cursor: "pointer" }} onClick={() => setMonthOffset(m => m - 1)} />
        <span style={{ fontSize: 15, fontWeight: 600, color: C.text, fontFamily: C.font }}>
          {MONTHS[month.getMonth()]} {month.getFullYear()}
        </span>
        <ChevronRight size={20} color={C.text} style={{ cursor: "pointer" }} onClick={() => setMonthOffset(m => m + 1)} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, textAlign: "center" }}>
        {DAYS.map(d => (
          <div key={d} style={{ fontSize: 11, fontWeight: 600, color: C.sub, fontFamily: C.font, padding: 4 }}>{d}</div>
        ))}
        {Array.from({ length: startDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1
          const status = avail[day] ?? "free"
          const s = AVAIL_STYLE[status]
          return (
            <div key={day} style={{
              padding: 6, borderRadius: 6, fontSize: 13, fontWeight: 500,
              background: s.bg, color: s.color, fontFamily: C.font, cursor: "pointer",
            }}>{day}</div>
          )
        })}
      </div>
      <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 16 }}>
        {(["free","partial","busy"] as const).map(s => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: C.sub, fontFamily: C.font }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: AVAIL_STYLE[s].bg, border: `1px solid ${AVAIL_STYLE[s].color}` }} />
            {s === "free" ? "Disponibile" : s === "partial" ? "Parziale" : "Occupato"}
          </div>
        ))}
      </div>
    </div>
  )
}
