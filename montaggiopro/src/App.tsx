import { useState, useCallback } from "react"
import {
  Home, Search, PlusSquare, MessageCircle, User, Settings,
  Send, MapPin,
  Briefcase, Building2, List, ChevronLeft,
  Star, Grid, Truck, Zap, Calendar, Save,
  Bell, Shield, Lock, Eye
} from "lucide-react"
import { RoleCtx } from "./context/RoleCtx"
import { ProfileCtx } from "./context/ProfileCtx"
import { AuthProvider } from "./context/AuthCtx"
import { useBreakpoint } from "./hooks/useBreakpoint"
import {
  Avatar, Badge, Btn,
  Input, Toggle, MultiChip, AvatarPicker,
  Stat, Divider, Toast,
  FormGrid, FullRow, SettingsSection, StarRating
} from "./components/ui"
import { EmptyState } from "./components/skeleton/Skeletons"
import { PostCard } from "./features/PostCard"
import { JobCard, TeamCard, StoryReel, FilterBar, WorkGrid, ReviewCard, RoleToggle } from "./features/index"
import CalendarPage from "./pages/CalendarPage"
import { C, SPEC_OPTIONS, ZONE_OPTIONS, VAN_SIZES } from "./tokens"
import { TEAMS, POSTS, JOBS, REVIEWS, CONVS, CHAT_MSGS, MY_PROFILE } from "./data/mock"
import { Role, Profile, Team } from "./types"

// ─── Nav constants ─────────────────────────────────────────
const NAV = {
  squadra: [
    { id:"feed",     Icon:Home,          label:"Home"         },
    { id:"bacheca",  Icon:Briefcase,     label:"Bacheca"      },
    { id:"calendar", Icon:Calendar,      label:"Calendario"   },
    { id:"messages", Icon:MessageCircle, label:"Messaggi"     },
    { id:"profile",  Icon:User,          label:"Profilo"      },
    { id:"settings", Icon:Settings,      label:"Impostazioni" },
  ],
  negozio: [
    { id:"search",   Icon:Search,        label:"Cerca Squadre" },
    { id:"post",     Icon:PlusSquare,    label:"Pubblica"      },
    { id:"listings", Icon:List,          label:"Annunci"       },
    { id:"messages", Icon:MessageCircle, label:"Messaggi"      },
    { id:"profile",  Icon:Building2,     label:"Negozio"       },
    { id:"settings", Icon:Settings,      label:"Impostazioni"  },
  ],
} as const

// ─── NavItem ───────────────────────────────────────────────
function NavItem({ id, Icon, label, active, onClick, vertical=false }: { id:string; Icon:React.ElementType; label:string; active:boolean; onClick:(id:string)=>void; vertical?:boolean }) {
  const [hov, setHov] = useState(false)
  const isSub = id==="settings"
  return (
    <button onClick={()=>onClick(id)} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ display:"flex", alignItems:"center", gap:vertical?14:0, background:hov&&vertical?"#F0F9FF":"none", border:"none", cursor:"pointer", padding:vertical?"10px 14px":"10px", borderRadius:10, width:vertical?"100%":"auto", fontFamily:C.font, justifyContent:vertical?"flex-start":"center", transition:"background .15s" }}>
      <Icon size={22} strokeWidth={active?2.5:1.8} color={active?C.accent:isSub?C.sub:C.text} />
      {vertical && <span style={{ fontSize:14, fontWeight:active?600:400, color:active?C.accent:isSub?C.sub:C.text }}>{label}</span>}
    </button>
  )
}

// ─── Sidebar (desktop) ─────────────────────────────────────
function Sidebar({ page, onPage, role, onToggle }: { page:string; onPage:(p:string)=>void; role:Role; onToggle:(r:Role)=>void }) {
  const items = NAV[role]
  return (
    <nav style={{ width:240, height:"100vh", position:"fixed", left:0, top:0, borderRight:`1px solid ${C.border}`, background:C.white, display:"flex", flexDirection:"column", padding:"16px 12px", zIndex:100 }}>
      <div style={{ padding:"10px 14px 18px", fontWeight:800, fontSize:18, color:C.text, letterSpacing:"-0.02em", fontFamily:C.font }}>MontaggioPro</div>
      <div style={{ paddingBottom:16 }}><RoleToggle role={role} onToggle={onToggle} /></div>
      <div style={{ display:"flex", flexDirection:"column", gap:2, flex:1 }}>
        {items.slice(0,-1).map(({ id, Icon, label }) => <NavItem key={id} id={id} Icon={Icon} label={label} active={page===id} onClick={onPage} vertical />)}
      </div>
      <Divider my={8} />
      {(() => { const last = items[items.length-1]; return <NavItem id={last.id} Icon={last.Icon} label={last.label} active={page==="settings"} onClick={onPage} vertical /> })()}
    </nav>
  )
}

// ─── BottomNav (mobile) ────────────────────────────────────
function BottomNav({ page, onPage, role }: { page:string; onPage:(p:string)=>void; role:Role }) {
  const items = NAV[role].filter(i => !["settings","calendar"].includes(i.id))
  return (
    <nav style={{ position:"fixed", bottom:0, left:0, right:0, background:C.white, borderTop:`1px solid ${C.border}`, display:"flex", justifyContent:"space-around", padding:"6px 0 max(6px,env(safe-area-inset-bottom))", zIndex:100 }}>
      {items.map(({ id, Icon, label }) => <NavItem key={id} id={id} Icon={Icon} label={label} active={page===id} onClick={onPage} />)}
    </nav>
  )
}

// ─── MobileHeader ──────────────────────────────────────────
function MobileHeader({ role, onToggle, page, onPage }: { role:Role; onToggle:(r:Role)=>void; page:string; onPage:(p:string)=>void }) {
  return (
    <div style={{ position:"sticky", top:0, background:C.white, borderBottom:`1px solid ${C.border}`, padding:"10px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", zIndex:50 }}>
      <span style={{ fontWeight:800, fontSize:17, color:C.text, fontFamily:C.font }}>MontaggioPro</span>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <RoleToggle role={role} onToggle={onToggle} />
        <button onClick={()=>onPage("settings")} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", color:page==="settings"?C.accent:C.sub, padding:4 }}>
          <Settings size={20} />
        </button>
      </div>
    </div>
  )
}

// ─── FeedPage ──────────────────────────────────────────────
function FeedPage({ onTeamClick }: { onTeamClick:(t:Team)=>void }) {
  const bp = useBreakpoint()
  return (
    <div style={{ display:"flex", gap:bp==="desktop"?48:0, maxWidth:bp==="desktop"?820:468, margin:"0 auto", padding:bp==="desktop"?"24px 0":0 }}>
      <div style={{ flex:1, minWidth:0 }}>
        <StoryReel teams={TEAMS} />
        {POSTS.map((p,i) => <PostCard key={p.id} post={p} delay={i*80} />)}
      </div>
      {bp==="desktop" && (
        <div style={{ width:280, flexShrink:0, paddingTop:20 }}>
          <div style={{ fontSize:13, fontWeight:600, color:C.sub, marginBottom:14 }}>Squadre suggerite</div>
          {TEAMS.slice(1,5).map(t => (
            <div key={t.id} onClick={()=>onTeamClick(t)} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, cursor:"pointer" }}>
              <Avatar char={t.char} colors={t.colors} size={32} verified={t.verified} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{t.name}</div>
                <div style={{ fontSize:12, color:C.sub }}>{t.zones[0]}</div>
              </div>
              <button style={{ background:"none", border:"none", cursor:"pointer", fontSize:13, fontWeight:600, color:C.accent, fontFamily:C.font }}>Segui</button>
            </div>
          ))}
          <Divider my={16} />
          <div style={{ fontSize:11, color:C.border, lineHeight:2 }}>© 2026 MontaggioPro · Privacy · Termini</div>
        </div>
      )}
    </div>
  )
}

// ─── JobBoardPage ──────────────────────────────────────────
function JobBoardPage() {
  const [filter, setFilter] = useState<string|null>(null)
  const filtered = filter ? JOBS.filter(j => j.type===filter||j.province===filter) : JOBS
  return (
    <div style={{ maxWidth:640, margin:"0 auto" }}>
      <FilterBar filters={["Cucina","Bagno","Living","Camera","Ufficio","MO","BO","MI"]} active={filter} onChange={setFilter} />
      <div style={{ display:"flex", flexDirection:"column", gap:12, padding:16 }}>
        {filtered.map((j,i) => <JobCard key={j.id} job={j} delay={i*60} />)}
        {!filtered.length && <EmptyState label="Nessun annuncio con questi filtri" icon={Briefcase} />}
      </div>
    </div>
  )
}

// ─── SearchPage ────────────────────────────────────────────
function SearchPage({ onTeamClick }: { onTeamClick:(t:Team)=>void }) {
  const [filter, setFilter] = useState<string|null>(null)
  const filtered = filter ? TEAMS.filter(t => t.specs.includes(filter)||t.zones.some(z=>z.includes(filter))) : TEAMS
  return (
    <div style={{ maxWidth:700, margin:"0 auto" }}>
      <div style={{ padding:16, background:C.white, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, background:C.bg, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px" }}>
          <Search size={16} color={C.sub} /><span style={{ color:C.sub, fontSize:14, fontFamily:C.font }}>Cerca per zona, specializzazione...</span>
        </div>
      </div>
      <FilterBar filters={["Cucine","Bagni","Living","Bologna","Milano","Roma"]} active={filter} onChange={setFilter} />
      <div style={{ display:"flex", flexDirection:"column", gap:12, padding:16 }}>
        {filtered.map((t,i) => <TeamCard key={t.id} team={t} delay={i*60} onClick={()=>onTeamClick(t)} />)}
      </div>
    </div>
  )
}

// ─── MessagesPage ──────────────────────────────────────────
function MessagesPage() {
  const bp = useBreakpoint()
  const [active, setActive] = useState<number|null>(null)
  const conv = CONVS.find(c => c.id===active)

  const ChatView = () => (
    <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
      <div style={{ padding:"12px 16px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:12 }}>
        {bp==="mobile" && <button onClick={()=>setActive(null)} style={{ background:"none", border:"none", cursor:"pointer", display:"flex" }}><ChevronLeft size={20} /></button>}
        {conv && <Avatar char={conv.char} colors={conv.colors} size={36} />}
        <span style={{ fontWeight:700, fontSize:14, color:C.text, fontFamily:C.font }}>{conv?.name}</span>
      </div>
      <div style={{ flex:1, padding:16, overflowY:"auto", background:C.bg, display:"flex", flexDirection:"column", gap:10 }}>
        {CHAT_MSGS.map((msg,i) => <div key={i} style={{ alignSelf:msg.me?"flex-end":"flex-start", background:msg.me?C.accent:C.white, color:msg.me?"#fff":C.text, padding:"10px 14px", borderRadius:18, maxWidth:"72%", fontSize:13, lineHeight:1.5, border:msg.me?"none":`1px solid ${C.border}` }}>{msg.text}</div>)}
      </div>
      <div style={{ padding:12, background:C.white, borderTop:`1px solid ${C.border}`, display:"flex", gap:8 }}>
        <div style={{ flex:1, background:C.bg, border:`1px solid ${C.border}`, borderRadius:20, padding:"9px 14px", fontSize:13, color:C.sub }}>Scrivi...</div>
        <button style={{ background:C.accent, border:"none", borderRadius:"50%", width:38, height:38, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Send size={16} color="#fff" /></button>
      </div>
    </div>
  )

  const ConvList = () => (
    <>
      <div style={{ padding:"14px 16px", fontWeight:700, fontSize:16, color:C.text, borderBottom:`1px solid ${C.border}`, background:C.white }}>Messaggi</div>
      {CONVS.map(c => (
        <div key={c.id} onClick={()=>setActive(c.id)} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", background:C.white, borderBottom:`1px solid ${C.border}`, cursor:"pointer" }}
          onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background=C.bg}
          onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background=C.white}>
          <Avatar char={c.char} colors={c.colors} size={48} />
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:c.unread?700:400, fontSize:14, color:C.text }}>{c.name}</div>
            <div style={{ fontSize:13, color:C.sub, marginTop:2 }}>{c.last}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:12, color:C.sub, marginBottom:4 }}>{c.time}</div>
            {c.unread>0 && <div style={{ background:C.accent, color:"#fff", borderRadius:"50%", width:18, height:18, fontSize:11, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", marginLeft:"auto" }}>{c.unread}</div>}
          </div>
        </div>
      ))}
    </>
  )

  if (bp!=="mobile") return (
    <div style={{ display:"flex", height:"100vh", maxWidth:900, margin:"0 auto", border:`1px solid ${C.border}`, borderTop:"none" }}>
      <div style={{ width:320, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column" }}><ConvList /></div>
      {active && conv ? <ChatView /> : <EmptyState label="Seleziona una conversazione" icon={MessageCircle} />}
    </div>
  )

  if (active && conv) return <div style={{ height:"calc(100vh - 120px)", display:"flex", flexDirection:"column" }}><ChatView /></div>
  return <div style={{ maxWidth:600, margin:"0 auto" }}><ConvList /></div>
}

// ─── TeamProfilePage ───────────────────────────────────────
function TeamProfilePage({ team, onBack, onSettings }: { team:Team; onBack?:()=>void; onSettings?:()=>void }) {
  const [tab, setTab] = useState<"portfolio"|"calendar"|"reviews">("portfolio")
  const [followed, setFollowed] = useState(false)
  const TABS = [{ id:"portfolio" as const, label:"Portfolio", Icon:Grid }, { id:"calendar" as const, label:"Calendario", Icon:Calendar }, { id:"reviews" as const, label:"Recensioni", Icon:Star }]

  return (
    <div>
      {onBack && <div style={{ background:C.white, borderBottom:`1px solid ${C.border}`, padding:"10px 16px" }}><button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontSize:14, color:C.text, fontFamily:C.font }}><ChevronLeft size={18} /> Indietro</button></div>}
      <div style={{ background:C.white, borderBottom:`1px solid ${C.border}`, padding:20 }}>
        <div style={{ maxWidth:600, margin:"0 auto" }}>
          <div style={{ display:"flex", gap:24, alignItems:"center", marginBottom:14 }}>
            <Avatar char={team.char} colors={team.colors} size={80} verified={team.verified} />
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:18, color:C.text, marginBottom:2 }}>{team.name}</div>
              <div style={{ fontSize:13, color:C.sub, marginBottom:10 }}>{team.leader} · {team.members} membri</div>
              <div style={{ display:"flex", gap:24 }}>
                <Stat label="Lavori" value={team.jobs} /><Stat label="Recensioni" value={team.reviews} /><Stat label="Anni esp." value={team.experience} />
              </div>
            </div>
          </div>
          <StarRating value={team.rating} count={team.reviews} size={14} />
          <p style={{ fontSize:13, color:C.text, lineHeight:1.6, margin:"10px 0" }}>{team.bio}</p>
          <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:C.sub, marginBottom:10 }}><MapPin size={13} /> {team.zones.join(" · ")}</div>
          <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:10 }}>{team.specs.map(s => <Badge key={s} label={s} />)}</div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
            <Badge label={`Furgone ${team.equipment.van} (${team.equipment.vanM3}m³)`} icon={Truck} />
            {team.equipment.scalaMot && <Badge label="Scala motorizzata" icon={Zap} color={C.amber} bg="#FFFBEB" />}
          </div>
          <div style={{ display:"flex", gap:8 }}>
            {onSettings
              ? <><Btn icon={Settings} variant="secondary" onClick={onSettings}>Modifica profilo</Btn><Btn variant="secondary" icon={Eye}>Anteprima</Btn></>
              : <><Btn variant={followed?"secondary":"primary"} onClick={()=>setFollowed(v=>!v)}>{followed?"Stai seguendo":"Segui"}</Btn><Btn variant="secondary" icon={MessageCircle}>Messaggio</Btn></>
            }
          </div>
        </div>
      </div>
      <div style={{ background:C.white, borderBottom:`1px solid ${C.border}`, display:"flex" }}>
        {TABS.map(({ id, label, Icon }) => (
          <button key={id} onClick={()=>setTab(id)} style={{ flex:1, padding:"12px 0", background:"none", border:"none", cursor:"pointer", borderBottom:`2px solid ${tab===id?C.text:"transparent"}`, display:"flex", alignItems:"center", justifyContent:"center", gap:6, fontSize:13, fontWeight:tab===id?700:400, color:tab===id?C.text:C.sub, fontFamily:C.font, transition:"all .15s" }}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>
      <div style={{ maxWidth:600, margin:"0 auto" }}>
        {tab==="portfolio" && <WorkGrid team={team} />}
        {tab==="calendar"  && <div style={{ padding:20 }}><CalendarPage /></div>}
        {tab==="reviews"   && <div style={{ padding:"0 16px" }}>{REVIEWS.map(r => <ReviewCard key={r.id} review={r} />)}</div>}
      </div>
    </div>
  )
}

// ─── SettingsPage ──────────────────────────────────────────
function SettingsPage() {
  const bp      = useBreakpoint()
  const isMob   = bp === "mobile"
  const [tab,   setTab]   = useState("profile")
  const [form,  setForm]  = useState<Profile>({ ...MY_PROFILE })
  const [toast, setToast] = useState(false)

  const update = useCallback((key: keyof Profile, val: unknown) => setForm(f => ({ ...f, [key]:val })), [])

  const save = () => { setToast(true); setTimeout(()=>setToast(false), 2200) }

  const STABS = [
    { id:"profile",       label:"Modifica profilo", Icon:User   },
    { id:"account",       label:"Account",          Icon:Lock   },
    { id:"notifications", label:"Notifiche",        Icon:Bell   },
    { id:"privacy",       label:"Privacy",          Icon:Shield },
  ]

  return (
    <div style={{ maxWidth:840, margin:"0 auto", paddingBottom:40 }}>
      <Toast message="Profilo aggiornato!" visible={toast} />
      <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}`, background:C.white }}>
        <div style={{ fontWeight:700, fontSize:16, color:C.text }}>Impostazioni</div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:isMob?"1fr":"200px 1fr", minHeight:"70vh" }}>
        <div style={{ borderRight:isMob?"none":`1px solid ${C.border}`, padding:isMob?"8px 12px":"12px 8px", background:C.white, borderBottom:isMob?`1px solid ${C.border}`:"none" }}>
          <div style={{ display:isMob?"flex":"block", gap:4, overflowX:isMob?"auto":"visible" }}>
            {STABS.map(({ id, label, Icon }) => (
              <button key={id} onClick={()=>setTab(id)} style={{ display:"flex", alignItems:"center", gap:10, width:isMob?"auto":"100%", padding:"10px 12px", borderRadius:8, border:"none", background:tab===id?`${C.accent}15`:"transparent", color:tab===id?C.accent:C.text, fontSize:isMob?12:14, fontWeight:tab===id?600:400, cursor:"pointer", fontFamily:C.font, whiteSpace:"nowrap", marginBottom:isMob?0:2, transition:"background .15s" }}>
                <Icon size={15} />{label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ padding:isMob?"16px":"28px 32px", background:C.white }}>

          {tab==="profile" && (
            <div>
              <AvatarPicker colors={form.colors} char={form.char} onChange={v=>update("colors",v)} />
              <FormGrid>
                <Input label="Nome squadra"   value={form.name}         onChange={v=>update("name",v)}         placeholder="Es. Fratelli Rossi" />
                <Input label="Nome leader"    value={form.leader}       onChange={v=>update("leader",v)}       placeholder="Es. Marco Rossi" />
                <Input label="Iniziale"       value={form.char}         onChange={v=>update("char",v.slice(-1).toUpperCase()||"?")} placeholder="R" />
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  <Input label="Membri"    value={String(form.members)}    onChange={v=>update("members",Number(v))}    type="number" />
                  <Input label="Anni esp." value={String(form.experience)} onChange={v=>update("experience",Number(v))} type="number" />
                </div>
                <FullRow><Input label="Bio" value={form.bio} onChange={v=>update("bio",v)} placeholder="Descriviti..." multiline /></FullRow>
                <FullRow><MultiChip label="Specializzazioni"  options={SPEC_OPTIONS} selected={form.specs} onChange={v=>update("specs",v)} /></FullRow>
                <FullRow><MultiChip label="Zone di copertura" options={ZONE_OPTIONS} selected={form.zones} onChange={v=>update("zones",v)} /></FullRow>
              </FormGrid>
              <SettingsSection title="Attrezzatura">
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:C.text, marginBottom:8 }}>Tipo furgone</div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                    {VAN_SIZES.map(size => {
                      const on = form.equipment.van===size
                      return <button key={size} onClick={()=>update("equipment",{ ...form.equipment, van:size })} style={{ padding:"10px 8px", borderRadius:8, border:`1px solid ${on?C.accent:C.border}`, background:on?`${C.accent}15`:C.white, color:on?C.accent:C.text, fontSize:13, fontWeight:on?600:400, cursor:"pointer", fontFamily:C.font, textAlign:"center", transition:"all .15s" }}>{size.charAt(0).toUpperCase()+size.slice(1)}</button>
                    })}
                  </div>
                </div>
                <Toggle label="Scala motorizzata" description="Per piani senza ascensore" checked={form.equipment.scalaMot} onChange={v=>update("equipment",{ ...form.equipment, scalaMot:v })} />
                <Toggle label="Argano"            description="Per carichi oltre le scale"  checked={form.equipment.argano}   onChange={v=>update("equipment",{ ...form.equipment, argano:v })} />
              </SettingsSection>
            </div>
          )}

          {tab==="account" && (
            <div>
              <SettingsSection title="Dati account">
                <FormGrid>
                  <Input label="Email"    value="marco.rossi@fratellirossi.it" onChange={()=>{}} type="email" />
                  <Input label="Telefono" value="+39 333 1234567"              onChange={()=>{}} type="tel" />
                </FormGrid>
              </SettingsSection>
              <SettingsSection title="Cambio password">
                <Input label="Password attuale" value="••••••••" onChange={()=>{}} type="password" />
                <FormGrid>
                  <Input label="Nuova password"    value="" onChange={()=>{}} type="password" placeholder="Min. 8 caratteri" />
                  <Input label="Conferma password" value="" onChange={()=>{}} type="password" placeholder="Ripeti" />
                </FormGrid>
                <Btn variant="secondary">Aggiorna password</Btn>
              </SettingsSection>
              <SettingsSection title="Zona pericolosa">
                <p style={{ fontSize:13, color:C.sub, marginBottom:12 }}>L'eliminazione è permanente.</p>
                <Btn variant="danger">Elimina account</Btn>
              </SettingsSection>
            </div>
          )}

          {tab==="notifications" && (
            <SettingsSection title="Preferenze notifiche" description="Scegli cosa ricevere via app e via email.">
              {(["nuoviLavori","messaggi","recensioni","aggiornamenti","newsletter"] as const).map(key => (
                <Toggle key={key}
                  label={{ nuoviLavori:"Nuovi lavori nella tua zona", messaggi:"Messaggi", recensioni:"Recensioni", aggiornamenti:"Aggiornamenti piattaforma", newsletter:"Newsletter" }[key]}
                  description={{ nuoviLavori:"Avviso per annunci compatibili", messaggi:"Da negozi e squadre", recensioni:"Dopo ogni lavoro completato", aggiornamenti:"Nuove funzionalità", newsletter:"Consigli e novità" }[key]}
                  checked={form.notifPrefs?.[key] ?? false}
                  onChange={v=>update("notifPrefs",{ ...form.notifPrefs, [key]:v })} />
              ))}
            </SettingsSection>
          )}

          {tab==="privacy" && (
            <div>
              <SettingsSection title="Visibilità profilo">
                {(["profiloPubblico","mostraDisp","mostraStats"] as const).map(key => (
                  <Toggle key={key}
                    label={{ profiloPubblico:"Profilo pubblico", mostraDisp:"Mostra disponibilità", mostraStats:"Mostra statistiche" }[key]}
                    description={{ profiloPubblico:"Visibile nella ricerca", mostraDisp:"Calendario visibile ai negozi", mostraStats:"Lavori, valutazione, anni" }[key]}
                    checked={form.privacyPrefs?.[key] ?? false}
                    onChange={v=>update("privacyPrefs",{ ...form.privacyPrefs, [key]:v })} />
                ))}
              </SettingsSection>
              <SettingsSection title="Messaggi diretti" description="Chi può inviarti messaggi?">
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                  {(["tutti","verificati","nessuno"] as const).map(val => {
                    const on = form.privacyPrefs?.messaggiDa===val
                    return <button key={val} onClick={()=>update("privacyPrefs",{ ...form.privacyPrefs, messaggiDa:val })} style={{ padding:"10px 8px", borderRadius:8, border:`1px solid ${on?C.accent:C.border}`, background:on?`${C.accent}15`:C.white, color:on?C.accent:C.text, fontSize:13, fontWeight:on?600:400, cursor:"pointer", fontFamily:C.font, textAlign:"center", transition:"all .15s" }}>{val.charAt(0).toUpperCase()+val.slice(1)}</button>
                  })}
                </div>
              </SettingsSection>
            </div>
          )}

          {tab!=="account" && (
            <div style={{ marginTop:16, display:"flex", gap:10 }}>
              <Btn icon={Save} onClick={save}>Salva modifiche</Btn>
              <Btn variant="secondary" onClick={()=>setForm({ ...MY_PROFILE })}>Annulla</Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Placeholder({ label, Icon }: { label:string; Icon:React.ElementType }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"60vh", gap:14, color:C.sub, fontFamily:C.font }}>
      <Icon size={48} strokeWidth={1} style={{ opacity:.3 }} />
      <div style={{ fontSize:18, fontWeight:600, color:C.text }}>{label}</div>
      <div style={{ fontSize:14 }}>In arrivo</div>
    </div>
  )
}

// ─── App ───────────────────────────────────────────────────
const DEFAULT: Record<Role, string> = { squadra:"feed", negozio:"search" }

export default function App() {
  const bp      = useBreakpoint()
  const isMob   = bp === "mobile"
  const [role,    setRole]    = useState<Role>("squadra")
  const [page,    setPage]    = useState("feed")
  const [selTeam, setSelTeam] = useState<Team|null>(null)
  const [profile, setProfile] = useState<Profile>({ ...MY_PROFILE })

  const switchRole = (r: Role) => { setRole(r); setPage(DEFAULT[r]); setSelTeam(null) }
  const openTeam   = (t: Team) => { setSelTeam(t); setPage("teamProfile") }
  const goBack     = () => { setSelTeam(null); setPage(role==="squadra"?"feed":"search") }

  const renderPage = () => {
    if (page==="teamProfile" && selTeam) return <TeamProfilePage team={selTeam} onBack={goBack} />
    if (page==="profile")               return <TeamProfilePage team={profile} onSettings={()=>setPage("settings")} />
    const map: Record<string, React.ReactNode> = {
      feed:     <FeedPage onTeamClick={openTeam} />,
      bacheca:  <JobBoardPage />,
      calendar: <CalendarPage />,
      messages: <MessagesPage />,
      search:   <SearchPage onTeamClick={openTeam} />,
      settings: <SettingsPage />,
      post:     <Placeholder label="Pubblica un annuncio" Icon={PlusSquare} />,
      listings: <Placeholder label="I miei annunci"       Icon={Briefcase} />,
    }
    return map[page] ?? map.feed
  }

  return (
    <AuthProvider>
      <ProfileCtx.Provider value={{ profile, updateProfile:setProfile }}>
        <RoleCtx.Provider value={role}>
          <style>{`
            @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
            @keyframes spin     { to{transform:rotate(360deg)} }
            @keyframes slideUp  { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }
            @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
            *, *::before, *::after { box-sizing:border-box; margin:0; padding:0 }
            body { background:${C.bg}; font-family:${C.font}; color:${C.text} }
            ::-webkit-scrollbar { width:4px; height:4px }
            ::-webkit-scrollbar-thumb { background:${C.border}; border-radius:2px }
            button, input, textarea { font-family:${C.font} }
          `}</style>

          {!isMob && <Sidebar page={page} onPage={setPage} role={role} onToggle={switchRole} />}

          <main style={{ marginLeft:isMob?0:240, paddingBottom:isMob?72:0, minHeight:"100vh", background:C.bg }}>
            {isMob && <MobileHeader role={role} onToggle={switchRole} page={page} onPage={setPage} />}
            {renderPage()}
          </main>

          {isMob && <BottomNav page={page} onPage={setPage} role={role} />}
        </RoleCtx.Provider>
      </ProfileCtx.Provider>
    </AuthProvider>
  )
}
