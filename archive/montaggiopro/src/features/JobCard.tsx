import { useState, useEffect } from "react"
import { Calendar, Package, Building2, DollarSign, Check } from "lucide-react"
import { C, JOB_COLORS } from "../tokens"
import { Avatar } from "../components/Avatar"
import { Detail } from "../components/Detail"
import { Btn } from "../components/Btn"
import type { Job } from "../types"

interface Props { job: Job; delay?: number }

export function JobCard({ job, delay = 0 }: Props) {
  const [visible, setVisible] = useState(delay === 0)
  const [applied, setApplied] = useState(job.applied)

  useEffect(() => {
    if (delay > 0) { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t) }
  }, [delay])

  const jobColor = JOB_COLORS[job.type] ?? C.sub

  return (
    <div style={{
      background: C.white, borderRadius: 12, padding: 14, marginBottom: 10,
      position: "relative",
      opacity: visible ? 1 : 0, transform: `translateY(${visible ? 0 : 12}px)`,
      transition: "opacity 250ms, transform 250ms",
    }}>
      <span style={{
        position: "absolute", top: 10, right: 10, padding: "2px 8px", borderRadius: 4,
        fontSize: 11, fontWeight: 600, color: C.white, background: jobColor,
      }}>{job.type}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Avatar char={job.store.char} colors={job.store.colors} size={32} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: C.font }}>{job.store.name}</div>
          <div style={{ fontSize: 11, color: C.sub, fontFamily: C.font }}>{job.city} ({job.province})</div>
        </div>
      </div>
      <div style={{ fontSize: 12, color: C.sub, fontFamily: C.font, marginBottom: 10, lineHeight: 1.4 }}>{job.description}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 10 }}>
        <Detail icon={Calendar} label="Data" value={job.date} />
        <Detail icon={Package} label="Colli" value={job.colli} />
        <Detail icon={Building2} label="Piano" value={job.floor} />
        <Detail icon={DollarSign} label="Budget" value={`${job.budget} EUR`} />
      </div>
      {(job.scalaMot || job.argano) && (
        <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
          {job.scalaMot && <span style={{ fontSize: 11, padding: "2px 6px", borderRadius: 4, background: C.bg, color: C.sub, fontFamily: C.font }}>Scala mot.</span>}
          {job.argano && <span style={{ fontSize: 11, padding: "2px 6px", borderRadius: 4, background: C.bg, color: C.sub, fontFamily: C.font }}>Argano</span>}
        </div>
      )}
      <Btn full onClick={() => setApplied(true)} icon={applied ? Check : undefined}
        variant={applied ? "secondary" : "primary"}>
        {applied ? "Candidatura inviata" : "Candidati"}
      </Btn>
    </div>
  )
}
