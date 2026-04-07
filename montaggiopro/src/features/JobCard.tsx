import { useState, useEffect } from "react"
import { Calendar, Package, Building2, DollarSign, Check } from "lucide-react"
import { C, JOB_COLORS } from "../tokens"
import { Avatar } from "../components/Avatar"
import { Detail } from "../components/Detail"
import { Badge } from "../components/Badge"
import { Btn } from "../components/Btn"
import type { Job } from "../types"

interface Props { job: Job; delay?: number }

export function JobCard({ job, delay = 0 }: Props) {
  const [visible, setVisible] = useState(delay === 0)
  const [applied, setApplied] = useState(job.applied)

  useEffect(() => {
    if (delay > 0) { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t) }
  }, [delay])

  const jobColor = JOB_COLORS[job.type] ?? [C.sub, C.sub]

  return (
    <div style={{
      background: C.white, borderRadius: 12, padding: 16, marginBottom: 12,
      border: `1px solid ${C.border}`, position: "relative",
      opacity: visible ? 1 : 0, transform: `translateY(${visible ? 0 : 20}px)`,
      transition: "opacity 350ms, transform 350ms",
    }}>
      <div style={{
        position: "absolute", top: 12, right: 12, padding: "4px 10px", borderRadius: 12,
        fontSize: 11, fontWeight: 600, color: C.white,
        background: `linear-gradient(135deg, ${jobColor[0]}, ${jobColor[1]})`,
      }}>{job.type}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Avatar char={job.store.char} colors={job.store.colors} size={40} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text, fontFamily: C.font }}>{job.store.name}</div>
          <div style={{ fontSize: 12, color: C.sub, fontFamily: C.font }}>{job.city} ({job.province})</div>
        </div>
      </div>
      <div style={{ fontSize: 13, color: C.text, fontFamily: C.font, marginBottom: 12 }}>{job.description}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        <Detail icon={Calendar} label="Data" value={job.date} />
        <Detail icon={Package} label="Colli" value={job.colli} />
        <Detail icon={Building2} label="Piano" value={job.floor} />
        <Detail icon={DollarSign} label="Budget" value={`${job.budget} EUR`} />
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        {job.scalaMot && <Badge label="Scala motorizzata" color={C.amber} />}
        {job.argano && <Badge label="Argano" color={C.amber} />}
      </div>
      <Btn full onClick={() => setApplied(true)} icon={applied ? Check : undefined}
        variant={applied ? "secondary" : "primary"}>
        {applied ? "Candidatura inviata" : "Candidati"}
      </Btn>
    </div>
  )
}
