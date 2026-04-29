import { useState, ReactNode } from "react"
import { LucideIcon } from "lucide-react"
import { Check } from "lucide-react"
import { C, PALETTES } from "../tokens"
import { Avatar } from "./Avatar"
export { Avatar } from "./Avatar"
export { Badge } from "./Badge"
export { Btn } from "./Btn"

// ─── Chip ────────────────────────────────────────────────
interface ChipProps { label:string; icon?:LucideIcon; active?:boolean; onClick?:()=>void }
export function Chip({ label, icon:Icon, active=false, onClick }: ChipProps) {
  return (
    <button onClick={onClick} style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"7px 14px", borderRadius:20, background:active?C.accent:C.white, border:`1px solid ${active?C.accent:C.border}`, color:active?"#fff":C.text, fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:C.font, whiteSpace:"nowrap", transition:"all .15s" }}>
      {Icon && <Icon size={13} />}{label}
    </button>
  )
}

// ─── Input ───────────────────────────────────────────────
interface InputProps { label?:string; value:string; onChange:(v:string)=>void; placeholder?:string; multiline?:boolean; type?:string }
export function Input({ label, value, onChange, placeholder, multiline=false, type="text" }: InputProps) {
  const [focus, setFocus] = useState(false)
  const base: React.CSSProperties = { width:"100%", padding:"10px 12px", borderRadius:8, border:`1px solid ${focus?C.accent:C.border}`, background:C.white, fontSize:14, color:C.text, fontFamily:C.font, outline:"none", transition:"border-color .15s", boxSizing:"border-box" }
  return (
    <div style={{ marginBottom:16 }}>
      {label && <div style={{ fontSize:13, fontWeight:600, color:C.text, marginBottom:6 }}>{label}</div>}
      {multiline
        ? <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...base, resize:"vertical" }} onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)} />
        : <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={base} onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)} />
      }
    </div>
  )
}

// ─── Toggle ──────────────────────────────────────────────
interface ToggleProps { label:string; description?:string; checked:boolean; onChange:(v:boolean)=>void }
export function Toggle({ label, description, checked, onChange }: ToggleProps) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0", borderBottom:`1px solid ${C.border}` }}>
      <div>
        <div style={{ fontSize:14, color:C.text, fontWeight:500 }}>{label}</div>
        {description && <div style={{ fontSize:12, color:C.sub, marginTop:2 }}>{description}</div>}
      </div>
      <div onClick={()=>onChange(!checked)} style={{ width:44, height:24, borderRadius:12, background:checked?C.accent:C.border, cursor:"pointer", position:"relative", transition:"background .2s", flexShrink:0, marginLeft:16 }}>
        <div style={{ position:"absolute", top:3, left:checked?23:3, width:18, height:18, borderRadius:"50%", background:C.white, transition:"left .2s", boxShadow:"0 1px 4px rgba(0,0,0,.2)" }} />
      </div>
    </div>
  )
}

// ─── MultiChip ───────────────────────────────────────────
interface MCProps { label?:string; options:readonly string[]; selected:string[]; onChange:(v:string[])=>void }
export function MultiChip({ label, options, selected, onChange }: MCProps) {
  const toggle = (opt:string) => onChange(selected.includes(opt) ? selected.filter(s=>s!==opt) : [...selected, opt])
  return (
    <div style={{ marginBottom:20 }}>
      {label && <div style={{ fontSize:13, fontWeight:600, color:C.text, marginBottom:8 }}>{label}</div>}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
        {options.map(opt => {
          const on = selected.includes(opt)
          return <button key={opt} onClick={()=>toggle(opt)} style={{ padding:"6px 12px", borderRadius:20, border:`1px solid ${on?C.accent:C.border}`, background:on?`${C.accent}15`:C.white, color:on?C.accent:C.text, fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:C.font, transition:"all .15s" }}>{opt}</button>
        })}
      </div>
    </div>
  )
}

// ─── AvatarPicker ─────────────────────────────────────────
interface APProps { colors:[string,string]; char:string; onChange:(c:[string,string])=>void }
export function AvatarPicker({ colors, char, onChange }: APProps) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:20, padding:"16px 0", borderBottom:`1px solid ${C.border}`, marginBottom:20 }}>
      <Avatar char={char} colors={colors} size={72} />
      <div>
        <div style={{ fontSize:13, fontWeight:600, color:C.text, marginBottom:10 }}>Colore profilo</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {PALETTES.map(([c1,c2]) => {
            const active = colors[0]===c1
            return <div key={c1} onClick={()=>onChange([c1,c2])} style={{ width:30, height:30, borderRadius:"50%", background:`linear-gradient(135deg,${c1},${c2})`, cursor:"pointer", outline:active?`3px solid ${C.text}`:"3px solid transparent", outlineOffset:2, transition:"outline .15s" }} />
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Stat ─────────────────────────────────────────────────
interface StatProps { label:string; value:string|number }
export function Stat({ label, value }: StatProps) {
  return (
    <div>
      <div style={{ fontWeight:700, fontSize:14, color:C.text }}>{value}</div>
      <div style={{ fontSize:11, color:C.sub }}>{label}</div>
    </div>
  )
}

// ─── Detail ───────────────────────────────────────────────
interface DetailProps { icon:LucideIcon; label:string; value:string }
export function Detail({ icon:Icon, label, value }: DetailProps) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:5 }}>
      <Icon size={13} color={C.sub} />
      <span style={{ fontSize:12, color:C.sub }}>{label}:</span>
      <span style={{ fontSize:12, fontWeight:600, color:C.text }}>{value}</span>
    </div>
  )
}

// ─── Divider ──────────────────────────────────────────────
export function Divider({ my=0 }: { my?:number }) {
  return <div style={{ height:1, background:C.border, margin:`${my}px 0` }} />
}

// ─── Toast ────────────────────────────────────────────────
interface ToastProps { message:string; visible:boolean }
export function Toast({ message, visible }: ToastProps) {
  return (
    <div style={{ position:"fixed", bottom:90, left:"50%", transform:`translateX(-50%) translateY(${visible?0:20}px)`, opacity:visible?1:0, transition:"all .3s ease", background:C.text, color:C.white, padding:"10px 20px", borderRadius:20, fontSize:13, fontWeight:600, zIndex:9999, display:"flex", alignItems:"center", gap:8, pointerEvents:"none" }}>
      <Check size={14} />{message}
    </div>
  )
}

// ─── FormGrid ─────────────────────────────────────────────
interface FGProps { children:ReactNode; cols?:1|2 }
export function FormGrid({ children, cols=2 }: FGProps) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:`repeat(${cols},1fr)`, gap:"0 24px" }}>
      {children}
    </div>
  )
}

export function FullRow({ children }: { children:ReactNode }) {
  return <div style={{ gridColumn:"1 / -1" }}>{children}</div>
}

// ─── SettingsSection ──────────────────────────────────────
interface SSProps { title:string; description?:string; children:ReactNode }
export function SettingsSection({ title, description, children }: SSProps) {
  return (
    <div style={{ marginBottom:28 }}>
      <div style={{ fontWeight:700, fontSize:15, color:C.text, marginBottom:description?4:14 }}>{title}</div>
      {description && <div style={{ fontSize:13, color:C.sub, marginBottom:14 }}>{description}</div>}
      {children}
    </div>
  )
}

// ─── StarRating ───────────────────────────────────────────
import { Star } from "lucide-react"
interface SRProps { value:number; count?:number; size?:number }
export function StarRating({ value, count, size=12 }: SRProps) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:3 }}>
      <Star size={size} fill={C.amber} color={C.amber} />
      <span style={{ fontWeight:700, fontSize:size+1, color:C.text }}>{value}</span>
      {count!==undefined && <span style={{ fontSize:size, color:C.sub }}>({count})</span>}
    </div>
  )
}
