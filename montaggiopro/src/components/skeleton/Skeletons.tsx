import { LucideIcon, AlertCircle, RefreshCw } from "lucide-react"
import { C } from "../../tokens"
import { Btn } from "../Btn"

// ─── Base shimmer block ───────────────────────────────────
export function Sk({ w="100%", h=16, r=6, mb=0 }: { w?:string|number; h?:number; r?:number; mb?:number }) {
  return <div style={{ width:w, height:h, borderRadius:r, background:"linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)", backgroundSize:"200% 100%", animation:"shimmer 1.5s infinite", marginBottom:mb }} />
}

export function SkAvatar({ size=36 }: { size?:number }) {
  return <div style={{ width:size, height:size, borderRadius:"50%", background:"#f0f0f0", flexShrink:0, animation:"shimmer 1.5s infinite" }} />
}

export function SkPost() {
  return (
    <div style={{ background:C.white, borderBottom:`1px solid ${C.border}`, padding:"12px 0" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"0 12px 10px" }}>
        <SkAvatar size={36} /><div style={{ flex:1 }}><Sk h={13} mb={6} /><Sk w="40%" h={11} /></div>
      </div>
      <Sk w="100%" h={300} r={0} />
      <div style={{ padding:"10px 12px" }}><Sk h={13} mb={8} /><Sk w="80%" h={13} /></div>
    </div>
  )
}

export function SkCard() {
  return (
    <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:16 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
        <SkAvatar size={48} /><div style={{ flex:1 }}><Sk h={14} mb={8} /><Sk w="60%" h={12} /></div>
      </div>
      <Sk h={12} mb={8} /><Sk h={12} mb={8} /><Sk w="70%" h={12} />
    </div>
  )
}

// ─── Error / Empty states ─────────────────────────────────
export function ErrorState({ message, onRetry }: { message:string; onRetry?:()=>void }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:48, gap:12, color:C.sub }}>
      <AlertCircle size={40} style={{ opacity:.4 }} />
      <div style={{ fontSize:14, color:C.text }}>Qualcosa è andato storto</div>
      <div style={{ fontSize:13, color:C.sub }}>{message}</div>
      {onRetry && <Btn variant="secondary" icon={RefreshCw} small onClick={onRetry}>Riprova</Btn>}
    </div>
  )
}

export function EmptyState({ label, icon: Icon }: { label:string; icon:LucideIcon }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:48, gap:12, color:C.sub }}>
      <Icon size={40} strokeWidth={1} style={{ opacity:.3 }} />
      <div style={{ fontSize:14, color:C.text }}>{label}</div>
    </div>
  )
}
