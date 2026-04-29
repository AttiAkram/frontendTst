import { useState, useCallback } from "react"
import { ChevronLeft, ChevronRight, X, MapPin, Package, Zap, Calendar, Building2 } from "lucide-react"
import { C, AVAIL_COLOR, AVAIL_BG, AVAIL_LABEL, JOB_COLORS } from "../tokens"
import { AvailStatus, Role } from "../types"
import { AVAIL_DEMO, CALENDAR_JOBS } from "../data/mock"
import { useBreakpoint } from "../hooks/useBreakpoint"

const MONTHS     = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"]
const DAYS_LONG  = ["Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato","Domenica"]
const DAYS_SHORT = ["L","M","M","G","V","S","D"]
const DAYS_MED   = ["Lun","Mar","Mer","Gio","Ven","Sab","Dom"]

const getDays   = (y:number, m:number) => new Date(y,m+1,0).getDate()
const getOffset = (y:number, m:number) => { const d = new Date(y,m,1).getDay(); return d===0?6:d-1 }
const isToday   = (y:number, m:number, d:number) => { const t=new Date(); return t.getFullYear()===y&&t.getMonth()===m&&t.getDate()===d }
const weekdayName = (y:number, m:number, d:number) => { const day=new Date(y,m,d).getDay(); return DAYS_LONG[day===0?6:day-1] }

// ─── Dot ──────────────────────────────────────────────────
function Dot({ status, size=6 }: { status?:AvailStatus; size?:number }) {
  if (!status) return <div style={{ height:size }} />
  return <div style={{ width:size, height:size, borderRadius:"50%", background:AVAIL_COLOR[status], flexShrink:0 }} />
}

// ─── JobCard (detail panel) ───────────────────────────────
function DayJobCard({ job }: { job: typeof CALENDAR_JOBS[number][number] }) {
  const color = (JOB_COLORS[job.type] ?? [C.accent])[0]
  return (
    <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden", borderLeft:`4px solid ${color}` }}>
      <div style={{ padding:"12px 14px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
          <span style={{ fontSize:11, fontWeight:700, color, background:`${color}18`, padding:"2px 8px", borderRadius:20 }}>{job.type}</span>
        </div>
        <div style={{ fontWeight:600, fontSize:14, color:C.text, marginBottom:8 }}>{job.store}</div>
        <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
          <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:C.sub }}>
            <MapPin size={11} /> {job.city} · {job.floor}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:C.sub }}>
            <Package size={11} /> {job.colli} colli <strong style={{ color:C.text, marginLeft:4 }}>€ {job.budget}</strong>
          </div>
          {job.scalaMot && <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"#F59E0B" }}><Zap size={11} /> Scala motorizzata richiesta</div>}
        </div>
      </div>
    </div>
  )
}

// ─── Status Picker ────────────────────────────────────────
function StatusPicker({ current, onSelect }: { current?:AvailStatus; onSelect:(s:AvailStatus)=>void }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
      {(Object.keys(AVAIL_LABEL) as AvailStatus[]).map(s => {
        const on = current===s
        return (
          <button key={s} onClick={() => onSelect(s)}
            style={{ padding:"10px 4px", borderRadius:10, border:`1.5px solid ${on?AVAIL_COLOR[s]:C.border}`, background:on?`${AVAIL_COLOR[s]}18`:C.white, cursor:"pointer", fontFamily:C.font, display:"flex", flexDirection:"column", alignItems:"center", gap:5, transition:"all .15s" }}>
            <Dot status={s} size={9} />
            <span style={{ fontSize:11, fontWeight:on?700:400, color:on?AVAIL_COLOR[s]:C.sub }}>{AVAIL_LABEL[s]}</span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Detail Content ───────────────────────────────────────
function DetailContent({ year, month, day, avail, jobs, role, onStatusChange }: {
  year:number; month:number; day:number
  avail:Record<number,AvailStatus>; jobs:typeof CALENDAR_JOBS
  role:Role; onStatusChange:(d:number, s:AvailStatus)=>void
}) {
  const status  = avail[day]
  const dayJobs = jobs[day] ?? []
  const today   = isToday(year, month, day)
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <div style={{ padding:"20px 20px 16px", borderBottom:`1px solid ${C.border}` }}>
        <div style={{ fontSize:11, fontWeight:600, color:C.sub, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:4 }}>{weekdayName(year,month,day)}</div>
        <div style={{ display:"flex", alignItems:"baseline", gap:8, marginBottom:status?12:0 }}>
          <span style={{ fontSize:44, fontWeight:300, color:today?"#007AFF":C.text, lineHeight:1 }}>{day}</span>
          <span style={{ fontSize:16, color:C.sub }}>{MONTHS[month]} {year}</span>
        </div>
        {status && (
          <div style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"7px 12px", borderRadius:20, background:AVAIL_BG[status] }}>
            <Dot status={status} size={8} />
            <span style={{ fontSize:13, fontWeight:600, color:AVAIL_COLOR[status] }}>{AVAIL_LABEL[status]}</span>
          </div>
        )}
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"16px 20px" }}>
        {dayJobs.length===0 ? (
          <div style={{ textAlign:"center", padding:"28px 0", color:C.sub }}>
            <Calendar size={28} style={{ opacity:.25, display:"block", margin:"0 auto 8px" }} />
            <div style={{ fontSize:13 }}>Nessun lavoro</div>
          </div>
        ) : (
          <>
            <div style={{ fontSize:11, fontWeight:600, color:C.sub, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10 }}>
              {dayJobs.length} {dayJobs.length===1?"lavoro":"lavori"}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {dayJobs.map(j => <DayJobCard key={j.id} job={j} />)}
            </div>
          </>
        )}
      </div>
      <div style={{ padding:"14px 20px", borderTop:`1px solid ${C.border}`, background:C.white }}>
        {role==="squadra" ? (
          <>
            <div style={{ fontSize:11, fontWeight:600, color:C.sub, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10 }}>Imposta disponibilità</div>
            <StatusPicker current={status} onSelect={s => onStatusChange(day, s)} />
          </>
        ) : (
          <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:C.sub }}>
            <Building2 size={13} /> Sola lettura — solo la squadra può modificare
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Bottom Sheet ─────────────────────────────────────────
function BottomSheet({ open, onClose, children }: { open:boolean; onClose:()=>void; children:React.ReactNode }) {
  if (!open) return null
  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.3)", zIndex:300, animation:"fadeIn .2s ease" }} />
      <div style={{ position:"fixed", bottom:0, left:0, right:0, background:C.white, borderRadius:"18px 18px 0 0", zIndex:310, maxHeight:"85vh", display:"flex", flexDirection:"column", animation:"slideUp .28s cubic-bezier(0.32,0.72,0,1)", overflow:"hidden" }}>
        <div style={{ display:"flex", justifyContent:"center", padding:"10px 0 4px" }}>
          <div style={{ width:36, height:4, borderRadius:2, background:C.border }} />
        </div>
        <button onClick={onClose} style={{ border:"none", cursor:"pointer", position:"absolute", top:14, right:16, width:28, height:28, borderRadius:"50%", background:"#F2F2F7", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <X size={14} color={C.sub} />
        </button>
        <div style={{ flex:1, overflow:"hidden" }}>{children}</div>
      </div>
    </>
  )
}

// ─── Mini Calendar ────────────────────────────────────────
function MiniCalendar({ year, month, avail, selectedDay, onDayClick, onMonthChange }: {
  year:number; month:number; avail:Record<number,AvailStatus>
  selectedDay:number|null; onDayClick:(d:number)=>void; onMonthChange:(dir:number)=>void
}) {
  const days=getDays(year,month), offset=getOffset(year,month)
  return (
    <div style={{ padding:"12px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
        <button onClick={()=>onMonthChange(-1)} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", padding:4 }}><ChevronLeft size={13} color={C.sub} /></button>
        <span style={{ fontSize:11, fontWeight:600, color:C.text }}>{MONTHS[month].slice(0,3)} {year}</span>
        <button onClick={()=>onMonthChange(1)}  style={{ background:"none", border:"none", cursor:"pointer", display:"flex", padding:4 }}><ChevronRight size={13} color={C.sub} /></button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", marginBottom:2 }}>
        {DAYS_SHORT.map((d,i) => <div key={i} style={{ textAlign:"center", fontSize:10, fontWeight:600, color:C.sub }}>{d}</div>)}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)" }}>
        {Array.from({length:offset}).map((_,i) => <div key={`e${i}`} />)}
        {Array.from({length:days},(_,i) => {
          const day=i+1, today=isToday(year,month,day), sel=selectedDay===day, st=avail[day]
          return (
            <div key={day} onClick={()=>onDayClick(day)} style={{ display:"flex", flexDirection:"column", alignItems:"center", cursor:"pointer", padding:"1px 0" }}>
              <div style={{ width:22, height:22, borderRadius:"50%", background:today?"#007AFF":sel?`#007AFF18`:"transparent", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:10, fontWeight:today?700:400, color:today?"#fff":sel?"#007AFF":C.text }}>{day}</span>
              </div>
              {st && !today ? <Dot status={st} size={4} /> : <div style={{ height:4 }} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Month Grid ───────────────────────────────────────────
function MonthGrid({ year, month, avail, jobs, selectedDay, onDayClick, mobile }: {
  year:number; month:number; avail:Record<number,AvailStatus>; jobs:typeof CALENDAR_JOBS
  selectedDay:number|null; onDayClick:(d:number)=>void; mobile:boolean
}) {
  const days=getDays(year,month), offset=getOffset(year,month), rows=Math.ceil((offset+days)/7)
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        {(mobile?DAYS_SHORT:DAYS_MED).map((d,i) => (
          <div key={i} style={{ textAlign:"center", padding:mobile?"8px 0":"10px 0", fontSize:mobile?10:12, fontWeight:600, color:C.sub }}>{d}</div>
        ))}
      </div>
      <div style={{ flex:1, overflow:"auto", display:"grid", gridTemplateColumns:"repeat(7,1fr)", gridTemplateRows:`repeat(${rows},minmax(${mobile?52:90}px,1fr))`, borderLeft:`1px solid ${C.border}` }}>
        {Array.from({length:offset}).map((_,i) => <div key={`e${i}`} style={{ background:"#F2F2F7", borderRight:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }} />)}
        {Array.from({length:days},(_,i) => {
          const day=i+1, today=isToday(year,month,day), sel=selectedDay===day, status=avail[day], dayJobs=jobs[day]??[]
          return (
            <div key={day} onClick={()=>onDayClick(day)}
              style={{ borderRight:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:mobile?"4px 3px":"8px 6px", cursor:"pointer", background:sel?`#007AFF08`:"transparent", outline:sel?"2px solid #007AFF":"none", outlineOffset:-1, transition:"background .12s", display:"flex", flexDirection:"column", overflow:"hidden" }}
              onMouseEnter={e=>{ if(!sel)(e.currentTarget as HTMLDivElement).style.background="#F2F2F7" }}
              onMouseLeave={e=>{ if(!sel)(e.currentTarget as HTMLDivElement).style.background="transparent" }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0, marginBottom:mobile?2:4 }}>
                <div style={{ width:mobile?22:26, height:mobile?22:26, borderRadius:"50%", background:today?"#007AFF":"transparent", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:2 }}>
                  <span style={{ fontSize:mobile?11:13, fontWeight:today?700:400, color:today?"#fff":C.text }}>{day}</span>
                </div>
                {status && <Dot status={status} size={mobile?5:6} />}
              </div>
              {!mobile && (
                <div style={{ display:"flex", flexDirection:"column", gap:2, overflow:"hidden" }}>
                  {dayJobs.slice(0,2).map(j => {
                    const color=(JOB_COLORS[j.type]??[C.accent])[0]
                    return (
                      <div key={j.id} style={{ display:"flex", alignItems:"center", gap:3, background:`${color}1A`, borderRadius:4, padding:"2px 4px", overflow:"hidden" }}>
                        <div style={{ width:5, height:5, borderRadius:"50%", background:color, flexShrink:0 }} />
                        <span style={{ fontSize:9, fontWeight:500, color, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{j.store.split(" ")[0]}</span>
                      </div>
                    )
                  })}
                  {dayJobs.length>2 && <span style={{ fontSize:9, color:C.sub, paddingLeft:3 }}>+{dayJobs.length-2} altri</span>}
                </div>
              )}
              {mobile && dayJobs.length>0 && <div style={{ textAlign:"center" }}><span style={{ fontSize:9, fontWeight:600, color:"#007AFF" }}>{dayJobs.length}</span></div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Toolbar ──────────────────────────────────────────────
function Toolbar({ year, month, view, setView, onPrev, onNext, onToday, mobile }: {
  year:number; month:number; view:string; setView:(v:"month"|"week")=>void
  onPrev:()=>void; onNext:()=>void; onToday:()=>void; mobile:boolean
}) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:mobile?"10px 12px":"12px 20px", borderBottom:`1px solid ${C.border}`, background:C.white, flexShrink:0, gap:8 }}>
      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
        <button onClick={onPrev} style={{ border:"none", cursor:"pointer", width:32, height:32, borderRadius:8, background:"#F2F2F7", display:"flex", alignItems:"center", justifyContent:"center" }}><ChevronLeft size={16} color={C.sub} /></button>
        <button onClick={onNext} style={{ border:"none", cursor:"pointer", width:32, height:32, borderRadius:8, background:"#F2F2F7", display:"flex", alignItems:"center", justifyContent:"center" }}><ChevronRight size={16} color={C.sub} /></button>
        <h1 style={{ fontSize:mobile?16:20, fontWeight:700, color:C.text, letterSpacing:"-0.02em", marginLeft:4, whiteSpace:"nowrap" }}>
          {mobile?MONTHS[month].slice(0,3):MONTHS[month]} <span style={{ fontWeight:300, color:C.sub }}>{year}</span>
        </h1>
      </div>
      {!mobile && (
        <div style={{ display:"flex", background:"#F2F2F7", borderRadius:9, padding:3, gap:2 }}>
          {(["month","week"] as const).map(v => (
            <button key={v} onClick={()=>setView(v)} style={{ padding:"5px 14px", borderRadius:7, border:"none", background:view===v?C.white:"transparent", color:view===v?C.text:C.sub, fontSize:13, fontWeight:view===v?600:400, cursor:"pointer", fontFamily:C.font, boxShadow:view===v?"0 1px 4px rgba(0,0,0,.1)":"none", transition:"all .15s" }}>
              {v==="month"?"Mese":"Settimana"}
            </button>
          ))}
        </div>
      )}
      <button onClick={onToday} style={{ padding:mobile?"6px 12px":"6px 16px", borderRadius:9, border:`1px solid ${C.border}`, background:C.white, color:C.text, fontSize:mobile?12:13, fontWeight:500, cursor:"pointer", fontFamily:C.font, whiteSpace:"nowrap" }}
        onMouseEnter={e=>(e.currentTarget.style.background="#F2F2F7")}
        onMouseLeave={e=>(e.currentTarget.style.background=C.white)}>
        Oggi
      </button>
    </div>
  )
}

// ─── Main ──────────────────────────────────────────────────
export default function CalendarPage() {
  const bp      = useBreakpoint()
  const mobile  = bp === "mobile"
  const desktop = bp === "desktop"
  const today   = new Date()

  const [year,  setYear]  = useState(2026)
  const [month, setMonth] = useState(3)
  const [view,  setView]  = useState<"month"|"week">("month")
  const [sel,   setSel]   = useState<number|null>(null)
  const [sheet, setSheet] = useState(false)
  const [avail, setAvail] = useState<Record<number,AvailStatus>>(AVAIL_DEMO)
  const [jobs]            = useState(CALENDAR_JOBS)
  const [role,  setRole]  = useState<Role>("squadra")

  const changeMonth = useCallback((dir:number) => {
    setMonth(m => {
      const n = m+dir
      if (n<0)  { setYear(y=>y-1); return 11 }
      if (n>11) { setYear(y=>y+1); return 0  }
      return n
    })
    setSel(null); setSheet(false)
  }, [])

  const clickDay = useCallback((day:number) => {
    setSel(day)
    if (mobile) setSheet(true)
  }, [mobile])

  const goToday = useCallback(() => {
    setYear(today.getFullYear()); setMonth(today.getMonth())
    setSel(today.getDate())
    if (mobile) setSheet(true)
  }, [mobile])

  const changeStatus = useCallback((day:number, status:AvailStatus) => {
    setAvail(p => ({ ...p, [day]:status }))
  }, [])

  const detailProps = { year, month, avail, jobs, role, onStatusChange:changeStatus }

  return (
    <>
      <style>{`
        @keyframes slideUp  { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes shimmer  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:${C.font};background:${C.bg};color:${C.text}}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px}
        button{font-family:${C.font}}
      `}</style>

      {/* ── Desktop ── */}
      {!mobile && (
        <div style={{ display:"flex", height:"100vh", overflow:"hidden" }}>
          {desktop && (
            <div style={{ width:210, flexShrink:0, background:"#F2F2F7", borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", overflow:"hidden" }}>
              <div style={{ padding:"20px 16px 10px", borderBottom:`1px solid ${C.border}` }}>
                <div style={{ fontWeight:800, fontSize:14, color:C.text }}>MontaggioPro</div>
                <div style={{ fontSize:11, color:C.sub, marginTop:1 }}>Disponibilità</div>
              </div>
              <MiniCalendar year={year} month={month} avail={avail} selectedDay={sel} onDayClick={clickDay} onMonthChange={changeMonth} />
              <div style={{ padding:"12px 16px", borderTop:`1px solid ${C.border}`, marginTop:"auto" }}>
                <div style={{ fontSize:10, fontWeight:600, color:C.sub, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8 }}>Legenda</div>
                {(Object.entries(AVAIL_LABEL) as [AvailStatus,string][]).map(([s,l]) => (
                  <div key={s} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:6 }}>
                    <Dot status={s} size={7} /><span style={{ fontSize:12, color:C.text }}>{l}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding:"10px 12px 16px", borderTop:`1px solid ${C.border}` }}>
                <div style={{ fontSize:10, fontWeight:600, color:C.sub, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>Vista</div>
                <div style={{ display:"flex", background:C.border, borderRadius:8, padding:2 }}>
                  {(["squadra","negozio"] as Role[]).map(r => (
                    <button key={r} onClick={()=>setRole(r)} style={{ flex:1, padding:"5px 0", borderRadius:6, border:"none", background:role===r?C.white:"transparent", fontSize:10, fontWeight:role===r?700:400, color:role===r?C.text:C.sub, cursor:"pointer", transition:"all .15s" }}>
                      {r.charAt(0).toUpperCase()+r.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>
            <Toolbar year={year} month={month} view={view} setView={setView} onPrev={()=>changeMonth(-1)} onNext={()=>changeMonth(1)} onToday={goToday} mobile={false} />
            <MonthGrid year={year} month={month} avail={avail} jobs={jobs} selectedDay={sel} onDayClick={clickDay} mobile={false} />
          </div>

          {desktop && (
            <div style={{ width:300, flexShrink:0, borderLeft:`1px solid ${C.border}`, background:C.white, display:"flex", flexDirection:"column", overflow:"hidden" }}>
              {sel ? (
                <DetailContent day={sel} {...detailProps} />
              ) : (
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", color:C.sub, gap:10 }}>
                  <Calendar size={40} style={{ opacity:.2 }} />
                  <span style={{ fontSize:14 }}>Seleziona un giorno</span>
                </div>
              )}
            </div>
          )}

          {!desktop && (
            <BottomSheet open={!!sel} onClose={()=>setSel(null)}>
              {sel && <DetailContent day={sel} {...detailProps} />}
            </BottomSheet>
          )}
        </div>
      )}

      {/* ── Mobile ── */}
      {mobile && (
        <div style={{ display:"flex", flexDirection:"column", height:"100vh", overflow:"hidden" }}>
          <div style={{ background:C.white, borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
            <Toolbar year={year} month={month} view={view} setView={setView} onPrev={()=>changeMonth(-1)} onNext={()=>changeMonth(1)} onToday={goToday} mobile />
            <div style={{ padding:"0 8px 8px" }}>
              <MiniCalendar year={year} month={month} avail={avail} selectedDay={sel} onDayClick={clickDay} onMonthChange={changeMonth} />
            </div>
            <div style={{ display:"flex", background:C.border, borderRadius:8, padding:2, margin:"0 12px 10px" }}>
              {(["squadra","negozio"] as Role[]).map(r => (
                <button key={r} onClick={()=>setRole(r)} style={{ flex:1, padding:"6px 0", borderRadius:6, border:"none", background:role===r?C.white:"transparent", fontSize:12, fontWeight:role===r?700:400, color:role===r?C.text:C.sub, cursor:"pointer", transition:"all .15s" }}>
                  {r.charAt(0).toUpperCase()+r.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
            <MonthGrid year={year} month={month} avail={avail} jobs={jobs} selectedDay={sel} onDayClick={clickDay} mobile />
          </div>
          <BottomSheet open={sheet} onClose={()=>{ setSheet(false); setSel(null) }}>
            {sel && <DetailContent day={sel} {...detailProps} />}
          </BottomSheet>
        </div>
      )}
    </>
  )
}
