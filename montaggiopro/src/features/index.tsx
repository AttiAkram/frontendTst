import { useState, useEffect } from "react"
import { MapPin, Calendar, Package, Truck, Building2, Zap, Wrench, Heart, Check, Plus, Filter } from "lucide-react"
import { Avatar } from "../components/Avatar"
import { Badge } from "../components/Badge"
import { Btn } from "../components/Btn"
import { StarRating, Stat, Detail, Divider, Chip } from "../components/ui"
import { C, JOB_COLORS } from "../tokens"
import { Job, Team, Review, Role } from "../types"
import { useMutation } from "../hooks/useMutation"
import { EP } from "../config/api"

// ─── JobCard ─────────────────────────────────────────────
export function JobCard({ job, delay = 0 }: { job: Job; delay?: number }) {
  const [applied, setApplied] = useState(job.applied)
  const [in_, setIn] = useState(false)
  useEffect(() => { const t = setTimeout(() => setIn(true), delay); return () => clearTimeout(t) }, [delay])
  const { mutate: apply, loading } = useMutation(EP.applyJob(job.id))
  const [c1] = JOB_COLORS[job.type] ?? [C.accent, C.accent]

  return (
    <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:16, opacity:in_?1:0, transform:in_?"none":"translateY(8px)", transition:"opacity .35s ease,transform .35s ease" }}>
      <div style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:12 }}>
        <Avatar char={job.store.char} colors={job.store.colors} size={40} />
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:600, fontSize:14, color:C.text }}>{job.store.name}</div>
          <div style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, color:C.sub, marginTop:2 }}>
            <MapPin size={11} /> {job.city}, {job.province}
          </div>
        </div>
        <div style={{ background:`${c1}18`, border:`1px solid ${c1}40`, borderRadius:8, padding:"4px 10px", fontSize:12, fontWeight:600, color:c1 }}>{job.type}</div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
        <Detail icon={Calendar}  label="Data"   value={job.date} />
        <Detail icon={Package}   label="Colli"  value={`${job.colli} colli`} />
        <Detail icon={Building2} label="Piano"  value={job.floor} />
        <Detail icon={Truck}     label="Budget" value={`€ ${job.budget}`} />
      </div>

      {(job.scalaMot || job.argano) && (
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
          {job.scalaMot && <Badge label="Scala motorizzata" icon={Zap}    color={C.amber} bg="#FFFBEB" />}
          {job.argano   && <Badge label="Argano"            icon={Wrench} color={C.sub} />}
        </div>
      )}

      <p style={{ fontSize:13, color:C.sub, lineHeight:1.5, marginBottom:12 }}>{job.description}</p>
      <Divider />
      <div style={{ paddingTop:10, display:"flex", justifyContent:"flex-end" }}>
        <Btn loading={loading} variant={applied?"secondary":"primary"} icon={applied?Check:Plus} small
          onClick={() => apply().then(() => setApplied(true)).catch(() => {})}>
          {applied ? "Candidatura inviata" : "Candidati"}
        </Btn>
      </div>
    </div>
  )
}

// ─── TeamCard ────────────────────────────────────────────
export function TeamCard({ team, onClick, delay = 0 }: { team: Team; onClick?: () => void; delay?: number }) {
  const [in_,      setIn]       = useState(false)
  const [followed, setFollowed] = useState(false)
  const [shadow,   setShadow]   = useState(false)
  useEffect(() => { const t = setTimeout(() => setIn(true), delay); return () => clearTimeout(t) }, [delay])
  const { mutate: follow } = useMutation(EP.followTeam(team.id))

  return (
    <div onClick={onClick} onMouseEnter={() => setShadow(true)} onMouseLeave={() => setShadow(false)}
      style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:16, cursor:"pointer", opacity:in_?1:0, transition:"opacity .35s ease,box-shadow .2s ease", boxShadow:shadow?"0 2px 12px rgba(0,0,0,.08)":"none" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
        <Avatar char={team.char} colors={team.colors} size={48} verified={team.verified} />
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700, fontSize:14, color:C.text }}>{team.name}</div>
          <StarRating value={team.rating} count={team.reviews} />
          <div style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:C.sub, marginTop:2 }}>
            <MapPin size={10} /> {team.zones.slice(0,2).join(", ")}
          </div>
        </div>
        <button onClick={e => { e.stopPropagation(); setFollowed(v => !v); follow() }}
          style={{ padding:"6px 14px", borderRadius:8, background:followed?"transparent":C.accent, border:`1px solid ${followed?C.border:C.accent}`, color:followed?C.text:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:C.font, transition:"all .15s" }}>
          {followed ? "Segui già" : "Segui"}
        </button>
      </div>
      <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:10 }}>
        {team.specs.map(s => <Badge key={s} label={s} />)}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:11, color:C.sub }}>
        <Truck size={12} /> Furgone {team.equipment.van} ({team.equipment.vanM3}m³)
        {team.equipment.scalaMot && <Badge label="Scala mot." color={C.amber} bg="#FFFBEB" />}
      </div>
      <div style={{ display:"flex", gap:20, marginTop:10, paddingTop:10, borderTop:`1px solid ${C.border}` }}>
        <Stat label="Lavori"    value={team.jobs}       />
        <Stat label="Anni esp." value={team.experience} />
        <Stat label="Membri"    value={team.members}    />
      </div>
    </div>
  )
}

// ─── StoryReel ───────────────────────────────────────────
export function StoryReel({ teams }: { teams: Team[] }) {
  return (
    <div style={{ background:C.white, borderBottom:`1px solid ${C.border}`, overflowX:"auto", display:"flex", gap:18, padding:"14px 16px" }}>
      {teams.map((t, i) => {
        const [in_, setIn] = useState(false) // eslint-disable-line
        useEffect(() => { const id = setTimeout(() => setIn(true), i*55); return () => clearTimeout(id) }, []) // eslint-disable-line
        return (
          <button key={t.id} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:5, padding:0, opacity:in_?1:0, transform:in_?"none":"translateY(6px)", transition:"all .3s ease", minWidth:66 }}>
            <Avatar char={t.char} colors={t.colors} size={52} ring />
            <span style={{ fontSize:11, color:C.sub, maxWidth:64, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontFamily:C.font }}>{t.name.split(" ")[0]}</span>
          </button>
        )
      })}
    </div>
  )
}

// ─── FilterBar ───────────────────────────────────────────
export function FilterBar({ filters, active, onChange }: { filters: string[]; active: string | null; onChange: (v: string | null) => void }) {
  return (
    <div style={{ overflowX:"auto", display:"flex", gap:8, padding:"12px 16px", background:C.white, borderBottom:`1px solid ${C.border}` }}>
      <Chip label="Tutti" icon={Filter} active={!active} onClick={() => onChange(null)} />
      {filters.map(f => <Chip key={f} label={f} active={active===f} onClick={() => onChange(active===f?null:f)} />)}
    </div>
  )
}

// ─── WorkGrid ────────────────────────────────────────────
const WORK_LIKES = [312,189,445,267,198,521,144,389,233]
export function WorkGrid({ team }: { team: Team }) {
  const [c1, c2] = team.colors
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:3 }}>
      {Array.from({ length:9 }, (_, i) => (
        <div key={i} style={{ aspectRatio:"1", background:`linear-gradient(${120+i*18}deg,${c1}55,${c2}88)`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", position:"relative", overflow:"hidden" }}
          onMouseEnter={e => (e.currentTarget.querySelector(".ov") as HTMLDivElement).style.opacity = "1"}
          onMouseLeave={e => (e.currentTarget.querySelector(".ov") as HTMLDivElement).style.opacity = "0"}>
          <Wrench size={22} color={`${c1}88`} strokeWidth={1} />
          <div className="ov" style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.4)", opacity:0, display:"flex", alignItems:"center", justifyContent:"center", transition:"opacity .2s" }}>
            <span style={{ color:"#fff", fontSize:13, fontWeight:700, display:"flex", alignItems:"center", gap:4 }}>
              <Heart size={14} fill="#fff" color="#fff" /> {WORK_LIKES[i]}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── ReviewCard ──────────────────────────────────────────
export function ReviewCard({ review }: { review: Review }) {
  return (
    <div style={{ padding:"16px 0", borderBottom:`1px solid ${C.border}` }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
        <Avatar char={review.store.char} colors={review.store.colors} size={36} />
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:600, fontSize:13, color:C.text }}>{review.store.name}</div>
          <div style={{ fontSize:11, color:C.sub }}>{review.date}</div>
        </div>
        <StarRating value={review.rating} />
      </div>
      <p style={{ fontSize:13, color:C.text, lineHeight:1.6 }}>{review.text}</p>
      <div style={{ display:"flex", gap:4, marginTop:8, flexWrap:"wrap" }}>
        {review.tags.map(t => <Badge key={t} label={t} color={C.green} bg="#F0FDF4" />)}
      </div>
    </div>
  )
}

// ─── RoleToggle ──────────────────────────────────────────
export function RoleToggle({ role, onToggle }: { role: Role; onToggle: (r: Role) => void }) {
  return (
    <div style={{ display:"flex", background:C.bg, borderRadius:10, padding:3, border:`1px solid ${C.border}` }}>
      {(["squadra","negozio"] as Role[]).map(r => (
        <button key={r} onClick={() => onToggle(r)}
          style={{ padding:"6px 14px", borderRadius:8, border:"none", cursor:"pointer", fontFamily:C.font, background:role===r?C.white:"transparent", color:role===r?C.text:C.sub, fontWeight:role===r?600:400, fontSize:13, boxShadow:role===r?"0 1px 4px rgba(0,0,0,.1)":"none", transition:"all .2s" }}>
          {r.charAt(0).toUpperCase()+r.slice(1)}
        </button>
      ))}
    </div>
  )
}
